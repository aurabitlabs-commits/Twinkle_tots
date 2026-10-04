package com.example.screens

import androidx.compose.foundation.background
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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.audio.SoundManager
import com.example.audio.ToneType
import com.example.components.BackButton
import com.example.components.BigButton
import com.example.components.MascotAnimation
import com.example.components.TaraMascot
import com.example.model.ScreenName
import com.example.ui.theme.Ink

data class TopicButtonItem(
    val label: String,
    val iconEmoji: String,
    val color: Color,
    val route: ScreenName,
    val speech: String
)

@Composable
fun TopicMenuScreen(
    title: String,
    titleIcon: String,
    bgColors: List<Color>,
    buttons: List<TopicButtonItem>,
    soundManager: SoundManager,
    onBack: () -> Unit,
    onNavigate: (ScreenName) -> Unit,
    modifier: Modifier = Modifier
) {
    val gradient = Brush.verticalGradient(colors = bgColors)
    val isMultiGrid = buttons.size > 4

    Box(
        modifier = modifier
            .testTag("topic_menu_$title")
            .fillMaxSize()
            .background(gradient)
            .statusBarsPadding()
            .padding(18.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState()),
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

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(text = titleIcon, fontSize = 32.sp)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = title,
                        color = Ink,
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = (-0.5).sp
                    )
                }

                Spacer(modifier = Modifier.size(56.dp))
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Tara Mascot
            TaraMascot(
                size = if (isMultiGrid) 70.dp else 84.dp,
                animation = MascotAnimation.BOUNCE,
                onClick = {
                    soundManager.playTone(ToneType.POP)
                    soundManager.speak("Let's choose an activity!")
                }
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Buttons: 2-column grid when 5+ items, or clean column when <= 4
            if (isMultiGrid) {
                val chunkedButtons = buttons.chunked(2)
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .widthIn(max = 380.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    chunkedButtons.forEach { rowButtons ->
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            rowButtons.forEach { btn ->
                                BigButton(
                                    label = btn.label,
                                    icon = { Text(text = btn.iconEmoji, fontSize = 28.sp) },
                                    color = btn.color,
                                    isLarge = false,
                                    modifier = Modifier.weight(1f),
                                    onClick = {
                                        soundManager.playTone(ToneType.TAP)
                                        soundManager.speak(btn.speech)
                                        onNavigate(btn.route)
                                    }
                                )
                            }
                            if (rowButtons.size == 1) {
                                Spacer(modifier = Modifier.weight(1f))
                            }
                        }
                    }
                }
            } else {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .widthIn(max = 340.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    buttons.forEach { btn ->
                        BigButton(
                            label = btn.label,
                            icon = { Text(text = btn.iconEmoji, fontSize = 34.sp) },
                            color = btn.color,
                            isLarge = false,
                            onClick = {
                                soundManager.playTone(ToneType.TAP)
                                soundManager.speak(btn.speech)
                                onNavigate(btn.route)
                            }
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
