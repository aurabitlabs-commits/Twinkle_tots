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
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
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
import com.example.components.TaraMascot
import com.example.model.PhonicsEntry
import com.example.model.ScreenName
import com.example.ui.theme.Ink
import com.example.ui.theme.InkLight
import com.example.ui.theme.Pastels

data class PhonicsCardItem(
    val title: String,
    val subtitle: String,
    val icon: String,
    val color: Color,
    val target: ScreenName
)

val samplePhonicsLetters = listOf(
    PhonicsEntry("A", "A", "a", "ay", "/æ/", "aah", "Apple", "🍎", "A makes the aah sound in Apple"),
    PhonicsEntry("B", "B", "b", "bee", "/b/", "buh", "Ball", "⚽", "B makes the buh sound in Ball"),
    PhonicsEntry("C", "C", "c", "see", "/k/", "kuh", "Cat", "🐱", "C makes the kuh sound in Cat"),
    PhonicsEntry("D", "D", "d", "dee", "/d/", "duh", "Dog", "🐶", "D makes the duh sound in Dog")
)

@Composable
fun PhonicsHomeScreen(
    soundManager: SoundManager,
    onBack: () -> Unit,
    onNavigate: (ScreenName) -> Unit,
    modifier: Modifier = Modifier
) {
    val items = listOf(
        PhonicsCardItem("Letter Sounds", "Name vs Sound", "🗣️", Color(0xFFFF7043), ScreenName.LETTER_SOUNDS),
        PhonicsCardItem("Listen & Find", "Beginning Sound", "👂", Color(0xFF42A5F5), ScreenName.BEGINNING_SOUND),
        PhonicsCardItem("Blend Sounds", "C + A + T ➔ CAT", "🔗", Color(0xFFAB47BC), ScreenName.SOUND_BLENDING),
        PhonicsCardItem("Spell the Word", "Tap to spell", "✏️", Color(0xFF26A69A), ScreenName.SPELLING),
        PhonicsCardItem("Word Families", "-at, -an Houses", "🏡", Color(0xFFFFA726), ScreenName.WORD_FAMILIES),
        PhonicsCardItem("Phonics Games", "Missing Sound", "🎮", Color(0xFFEC407A), ScreenName.PHONICS_GAMES)
    )

    Box(
        modifier = modifier
            .testTag("phonics_home_screen")
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(Pastels[0], Pastels[3])))
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
                Text(text = "Phonics & Sounds", color = Ink, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                Box(modifier = Modifier.size(44.dp))
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Greeting card
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(24.dp))
                    .background(Color.White)
                    .border(width = 2.dp, color = Color(0xFFFFE082), shape = RoundedCornerShape(24.dp))
                    .padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                TaraMascot(size = 54.dp)
                Column(modifier = Modifier.padding(start = 12.dp)) {
                    Text(text = "Let's Learn Sounds! ✨", color = Ink, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Text(text = "Letters have names AND sounds!", color = InkLight, fontSize = 12.sp)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(items) { card ->
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(24.dp))
                            .background(Color.White)
                            .border(width = 2.dp, color = Color(0xFFE2E8F0), shape = RoundedCornerShape(24.dp))
                            .clickable {
                                soundManager.playTone(ToneType.TAP)
                                soundManager.speak(card.title)
                                onNavigate(card.target)
                            }
                            .padding(16.dp),
                        verticalArrangement = Arrangement.SpaceBetween
                    ) {
                        Box(
                            modifier = Modifier
                                .size(48.dp)
                                .clip(RoundedCornerShape(16.dp))
                                .background(card.color.copy(alpha = 0.15f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = card.icon, fontSize = 26.sp)
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        Text(text = card.title, color = Ink, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                        Text(text = card.subtitle, color = InkLight, fontSize = 11.sp)
                    }
                }
            }
        }
    }
}

@Composable
fun LetterSoundsLessonScreen(
    soundManager: SoundManager,
    onBack: () -> Unit,
    addStars: (Int) -> Unit,
    modifier: Modifier = Modifier
) {
    var index by remember { mutableIntStateOf(0) }
    val item = samplePhonicsLetters[index]

    Box(
        modifier = modifier
            .testTag("letter_sounds_lesson_screen")
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(Pastels[index % Pastels.size], Color.White)))
            .statusBarsPadding()
            .padding(18.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                BackButton(onClick = {
                    soundManager.playTone(ToneType.TAP)
                    onBack()
                })
                Text(text = "Letter Sounds", color = Ink, fontSize = 22.sp, fontWeight = FontWeight.Bold)
                Box(modifier = Modifier.size(44.dp))
            }

            // Big Lesson Card
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(32.dp))
                    .background(Color.White)
                    .border(width = 4.dp, color = Color(0xFFFFE082), shape = RoundedCornerShape(32.dp))
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.Bottom) {
                    Text(text = item.upper, fontSize = 72.sp, fontWeight = FontWeight.Black, color = Ink)
                    Text(text = item.lower, fontSize = 60.sp, fontWeight = FontWeight.Black, color = Color(0xFFFF8C42))
                }

                Spacer(modifier = Modifier.height(14.dp))

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    // Name button
                    Column(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(18.dp))
                            .background(Color(0xFFFFF3E0))
                            .clickable {
                                soundManager.playTone(ToneType.TAP)
                                soundManager.speak("Letter name: ${item.name}")
                            }
                            .padding(12.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(text = "NAME", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color(0xFFE65100))
                        Text(text = item.name, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Ink)
                    }

                    // Sound button
                    Column(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(18.dp))
                            .background(Color(0xFFE0F2F1))
                            .clickable {
                                soundManager.playTone(ToneType.POP)
                                soundManager.speak(item.taraPhrase)
                            }
                            .padding(12.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(text = "SOUND", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color(0xFF00695C))
                        Text(text = item.phoneme, fontSize = 20.sp, fontWeight = FontWeight.Black, color = Color(0xFF004D40))
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Example word
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(20.dp))
                        .background(Color(0xFFFFB74D))
                        .clickable {
                            soundManager.playTone(ToneType.CORRECT)
                            soundManager.speak("${item.example} starts with ${item.soundSpoken}")
                            addStars(1)
                        }
                        .padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center
                ) {
                    Text(text = item.emoji, fontSize = 36.sp)
                    Spacer(modifier = Modifier.size(10.dp))
                    Text(text = item.example, fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color.White)
                }
            }

            // Navigation
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(16.dp))
                        .background(if (index > 0) Color.White else Color(0x66FFFFFF))
                        .clickable(enabled = index > 0) {
                            soundManager.playTone(ToneType.TAP)
                            index--
                        }
                        .padding(horizontal = 20.dp, vertical = 10.dp)
                ) {
                    Text(text = "◀ Prev", fontWeight = FontWeight.Bold, color = Ink)
                }

                Text(text = "${index + 1} / ${samplePhonicsLetters.size}", fontWeight = FontWeight.Bold, color = InkLight)

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(16.dp))
                        .background(Color(0xFFFF8C42))
                        .clickable {
                            soundManager.playTone(ToneType.TAP)
                            if (index < samplePhonicsLetters.size - 1) index++ else index = 0
                        }
                        .padding(horizontal = 20.dp, vertical = 10.dp)
                ) {
                    Text(text = "Next ▶", fontWeight = FontWeight.Bold, color = Color.White)
                }
            }
        }
    }
}
