package com.example.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.audio.SoundManager
import com.example.audio.ToneType
import com.example.components.BackButton
import com.example.components.ConfettiView
import com.example.ui.theme.Ink
import com.example.ui.theme.Pastels
import kotlinx.coroutines.delay

data class MatchCard(
    val id: String,
    val display: String,
    val name: String,
    val instanceId: Int
)

@Composable
fun MemoryMatchScreen(
    title: String,
    rawItems: List<Pair<String, String>>, // name, display
    soundManager: SoundManager,
    onBack: () -> Unit,
    onComplete: () -> Unit,
    modifier: Modifier = Modifier
) {
    var cards by remember {
        mutableStateOf(
            rawItems.take(3).flatMapIndexed { idx, pair ->
                listOf(
                    MatchCard(pair.first, pair.second, pair.first, idx * 2),
                    MatchCard(pair.first, pair.second, pair.first, idx * 2 + 1)
                )
            }.shuffled()
        )
    }

    var flipped by remember { mutableStateOf(listOf<Int>()) }
    var matched by remember { mutableStateOf(setOf<Int>()) }
    var showConfetti by remember { mutableStateOf(false) }

    LaunchedEffect(flipped) {
        if (flipped.size == 2) {
            val c1 = cards.find { it.instanceId == flipped[0] }
            val c2 = cards.find { it.instanceId == flipped[1] }
            if (c1 != null && c2 != null && c1.id == c2.id) {
                soundManager.playTone(ToneType.CORRECT)
                matched = matched + c1.instanceId + c2.instanceId
                flipped = emptyList()
                if (matched.size == cards.size) {
                    soundManager.playTone(ToneType.WIN)
                    showConfetti = true
                    onComplete()
                }
            } else {
                delay(1200)
                flipped = emptyList()
            }
        }
    }

    Box(
        modifier = modifier
            .testTag("memory_match_screen")
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(Pastels[0], Pastels[4])))
            .statusBarsPadding()
            .padding(18.dp)
    ) {
        ConfettiView(active = showConfetti)

        Column(modifier = Modifier.fillMaxSize(), horizontalAlignment = Alignment.CenterHorizontally) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                BackButton(onClick = {
                    soundManager.playTone(ToneType.TAP)
                    onBack()
                })
                Text(text = title, color = Ink, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                Box(modifier = Modifier.size(44.dp))
            }

            Spacer(modifier = Modifier.height(14.dp))

            LazyVerticalGrid(
                columns = GridCells.Fixed(3),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.weight(1f).padding(8.dp)
            ) {
                itemsIndexed(cards) { _, card ->
                    val isOpen = flipped.contains(card.instanceId) || matched.contains(card.instanceId)
                    val isDone = matched.contains(card.instanceId)

                    Box(
                        modifier = Modifier
                            .aspectRatio(1f)
                            .shadow(elevation = 4.dp, shape = RoundedCornerShape(20.dp))
                            .clip(RoundedCornerShape(20.dp))
                            .background(if (isOpen) (if (isDone) Color(0xFFE8F5E9) else Color.White) else Color(0xFFFFB74D))
                            .border(width = 3.dp, color = if (isOpen) Color(0xFFFFE082) else Color(0xFFFFA726), shape = RoundedCornerShape(20.dp))
                            .clickable(enabled = !isOpen && flipped.size < 2) {
                                soundManager.playTone(ToneType.TAP)
                                soundManager.speak(card.name)
                                flipped = flipped + card.instanceId
                            },
                        contentAlignment = Alignment.Center
                    ) {
                        if (isOpen) {
                            Text(text = card.display, fontSize = 34.sp)
                        } else {
                            Text(text = "⭐", fontSize = 28.sp, color = Color.White)
                        }
                    }
                }
            }

            if (showConfetti) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(16.dp))
                        .background(Color(0xFF66BB6A))
                        .clickable {
                            matched = emptySet()
                            flipped = emptyList()
                            cards = cards.shuffled()
                            showConfetti = false
                        }
                        .padding(horizontal = 24.dp, vertical = 12.dp)
                ) {
                    Text(text = "Play Again ➔", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                }
            }
        }
    }
}
