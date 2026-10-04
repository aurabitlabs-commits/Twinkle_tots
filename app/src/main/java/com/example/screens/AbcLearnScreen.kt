package com.example.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectHorizontalDragGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.audio.SoundManager
import com.example.audio.ToneType
import com.example.components.BackButton
import com.example.components.FlashCard
import com.example.components.NavArrow
import com.example.components.NavArrowDirection
import com.example.components.ProgressDots
import com.example.components.SpeakerButton
import com.example.data.alphabetData
import com.example.ui.theme.Ink
import com.example.ui.theme.InkLight
import com.example.ui.theme.Pastels

@Composable
fun AbcLearnScreen(
    soundManager: SoundManager,
    onBack: () -> Unit,
    markCardSeen: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    var index by remember { mutableIntStateOf(0) }
    val current = alphabetData[index]

    LaunchedEffect(index) {
        soundManager.speak(current.audioPhrase)
        markCardSeen(current.id)
    }

    DisposableEffect(Unit) {
        onDispose {
            soundManager.stopSpeech()
        }
    }

    val gradient = Brush.verticalGradient(
        colors = listOf(Pastels[index % Pastels.size], Pastels[(index + 2) % Pastels.size])
    )

    var dragAccumulator by remember { mutableFloatStateOf(0f) }

    Box(
        modifier = modifier
            .testTag("abc_learn_screen")
            .fillMaxSize()
            .background(gradient)
            .statusBarsPadding()
            .pointerInput(index) {
                detectHorizontalDragGestures(
                    onDragStart = { dragAccumulator = 0f },
                    onDragEnd = {
                        if (dragAccumulator < -60f && index < alphabetData.size - 1) {
                            soundManager.playTone(ToneType.TAP)
                            index++
                        } else if (dragAccumulator > 60f && index > 0) {
                            soundManager.playTone(ToneType.TAP)
                            index--
                        }
                    },
                    onHorizontalDrag = { _, dragAmount ->
                        dragAccumulator += dragAmount
                    }
                )
            }
            .padding(18.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Top Bar
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                BackButton(onClick = {
                    soundManager.playTone(ToneType.TAP)
                    onBack()
                })

                Text(
                    text = "ABC Learn",
                    color = Ink,
                    fontSize = 26.sp,
                    fontWeight = FontWeight.Bold
                )

                SpeakerButton(onClick = {
                    soundManager.playTone(ToneType.TAP)
                    soundManager.speak(current.audioPhrase)
                })
            }

            Spacer(modifier = Modifier.weight(1f))

            // FlashCard
            FlashCard(
                bigText = current.upper,
                smallText = current.lower,
                word = current.word,
                emoji = current.emoji,
                pastelIndex = index,
                onTap = {
                    soundManager.playTone(ToneType.POP)
                    soundManager.speak(current.audioPhrase)
                }
            )

            Spacer(modifier = Modifier.weight(1f))

            // Navigation Arrows
            Row(
                horizontalArrangement = Arrangement.spacedBy(36.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                NavArrow(
                    direction = NavArrowDirection.LEFT,
                    disabled = index == 0,
                    onClick = {
                        soundManager.playTone(ToneType.TAP)
                        index--
                    }
                )

                NavArrow(
                    direction = NavArrowDirection.RIGHT,
                    disabled = index == alphabetData.size - 1,
                    onClick = {
                        soundManager.playTone(ToneType.TAP)
                        index++
                    }
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Progress
            Text(
                text = "${index + 1} / ${alphabetData.size}",
                color = InkLight,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(6.dp))

            ProgressDots(
                total = alphabetData.size,
                current = index
            )

            Spacer(modifier = Modifier.height(10.dp))
        }
    }
}
