package com.example.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
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
import com.example.components.MascotAnimation
import com.example.components.TaraMascot
import com.example.model.RhymeItem
import com.example.ui.theme.Ink
import com.example.ui.theme.InkLight
import com.example.ui.theme.Pastels
import kotlinx.coroutines.delay

val sampleRhymes = listOf(
    RhymeItem(
        "twinkle", "en", "Twinkle Twinkle Little Star", "⭐",
        listOf(
            "Twinkle, twinkle, little star,",
            "How I wonder what you are!",
            "Up above the world so high,",
            "Like a diamond in the sky.",
            "Twinkle, twinkle, little star,",
            "How I wonder what you are!"
        )
    ),
    RhymeItem(
        "baa_baa", "en", "Baa Baa Black Sheep", "🐑",
        listOf(
            "Baa, baa, black sheep, have you any wool?",
            "Yes sir, yes sir, three bags full!",
            "One for the master, and one for the dame,",
            "And one for the little boy who lives down the lane."
        )
    ),
    RhymeItem(
        "titli", "hi", "तितली उड़ी बस पर चढ़ी", "🦋",
        listOf(
            "तितली उड़ी बस पर चढ़ी,",
            "सीट ना मिली तो रोने लगी।",
            "ड्राइवर ने बोला आजा मेरे पास,",
            "तितली बोली ना बाबा ना!"
        )
    ),
    RhymeItem(
        "machhli", "hi", "मछली जल की रानी है", "🐟",
        listOf(
            "मछली जल की रानी है,",
            "जीवन उसका पानी है।",
            "हाथ लगाओ तो डर जाएगी,",
            "बाहर निकालो तो मर जाएगी।"
        )
    )
)

@Composable
fun RhymesListScreen(
    soundManager: SoundManager,
    onBack: () -> Unit,
    onSelectRhyme: (RhymeItem) -> Unit,
    modifier: Modifier = Modifier
) {
    var langFilter by remember { mutableStateOf("all") }
    val filtered = remember(langFilter) {
        if (langFilter == "all") sampleRhymes else sampleRhymes.filter { it.lang == langFilter }
    }

    Box(
        modifier = modifier
            .testTag("rhymes_list_screen")
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(Pastels[1], Pastels[4])))
            .statusBarsPadding()
            .padding(18.dp)
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                BackButton(onClick = {
                    soundManager.playTone(ToneType.TAP)
                    onBack()
                })
                Text(text = "Sing Along / बाल गीत", color = Ink, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                Box(modifier = Modifier.size(44.dp))
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Lang filter
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.align(Alignment.CenterHorizontally)) {
                listOf("all" to "All Songs", "en" to "English", "hi" to "हिन्दी").forEach { (key, label) ->
                    val isSel = langFilter == key
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(if (isSel) Color(0xFFFF8C42) else Color.White)
                            .clickable {
                                soundManager.playTone(ToneType.TAP)
                                langFilter = key
                            }
                            .padding(horizontal = 14.dp, vertical = 6.dp)
                    ) {
                        Text(text = label, color = if (isSel) Color.White else Ink, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                items(filtered) { rhyme ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(24.dp))
                            .background(Color.White)
                            .border(width = 2.dp, color = Color(0xFFFFE082), shape = RoundedCornerShape(24.dp))
                            .clickable {
                                soundManager.playTone(ToneType.TAP)
                                onSelectRhyme(rhyme)
                            }
                            .padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(56.dp)
                                .clip(RoundedCornerShape(18.dp))
                                .background(Color(0xFFFFF3E0)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = rhyme.thumbnail, fontSize = 30.sp)
                        }

                        Column(modifier = Modifier.weight(1f).padding(horizontal = 14.dp)) {
                            Text(text = rhyme.title, color = Ink, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                            Text(text = if (rhyme.lang == "hi") "Hindi Song" else "English Rhyme", color = InkLight, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                        }

                        Text(text = "▶", color = Color(0xFFFF8C42), fontSize = 20.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
fun RhymePlayerScreen(
    rhyme: RhymeItem,
    soundManager: SoundManager,
    onBack: () -> Unit,
    onComplete: () -> Unit,
    modifier: Modifier = Modifier
) {
    var lineIdx by remember { mutableIntStateOf(0) }
    var isPlaying by remember { mutableStateOf(true) }
    var isDance by remember { mutableStateOf(false) }
    var showConfetti by remember { mutableStateOf(false) }

    val currentLine = rhyme.lines.getOrNull(lineIdx) ?: rhyme.lines[0]

    LaunchedEffect(lineIdx, isPlaying) {
        if (isPlaying) {
            soundManager.speak(currentLine)
            delay(4000)
            if (lineIdx < rhyme.lines.size - 1) {
                lineIdx++
            } else {
                isPlaying = false
                showConfetti = true
                soundManager.playTone(ToneType.WIN)
                onComplete()
            }
        }
    }

    DisposableEffect(Unit) {
        onDispose { soundManager.stopSpeech() }
    }

    Box(
        modifier = modifier
            .testTag("rhyme_player_screen")
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(Pastels[lineIdx % Pastels.size], Pastels[(lineIdx + 2) % Pastels.size])))
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
                Text(text = rhyme.title, color = Ink, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                Box(
                    modifier = Modifier
                        .size(44.dp)
                        .clip(CircleShape)
                        .background(Color.White)
                        .clickable {
                            soundManager.playTone(ToneType.TAP)
                            lineIdx = 0
                            isPlaying = true
                            showConfetti = false
                        },
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = "↺", fontSize = 22.sp, fontWeight = FontWeight.Bold)
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            // Dancing mascot on tap
            Box(
                modifier = Modifier
                    .scale(if (isDance) 1.2f else 1f)
                    .clickable {
                        soundManager.playTone(ToneType.POP)
                        isDance = true
                    }
            ) {
                TaraMascot(size = 130.dp, animation = if (isDance) MascotAnimation.CHEER else MascotAnimation.IDLE)
            }

            Spacer(modifier = Modifier.height(14.dp))
            Text(text = rhyme.thumbnail, fontSize = 54.sp)

            Spacer(modifier = Modifier.weight(1f))

            // Karaoke Lyrics Card
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(28.dp))
                    .background(Color.White)
                    .padding(20.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = currentLine,
                    color = Ink,
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold,
                    lineHeight = 28.sp
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Play / Pause button
            Box(
                modifier = Modifier
                    .size(64.dp)
                    .clip(CircleShape)
                    .background(Color(0xFFFF8C42))
                    .clickable {
                        soundManager.playTone(ToneType.TAP)
                        isPlaying = !isPlaying
                    },
                contentAlignment = Alignment.Center
            ) {
                Text(text = if (isPlaying) "❚❚" else "▶", color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.height(14.dp))
        }
    }
}
