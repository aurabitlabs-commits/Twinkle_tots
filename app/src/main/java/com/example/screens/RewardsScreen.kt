package com.example.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.audio.SoundManager
import com.example.audio.ToneType
import com.example.components.BackButton
import com.example.components.MascotAnimation
import com.example.components.TaraMascot
import com.example.model.AppProgress
import com.example.ui.theme.Ink
import com.example.ui.theme.InkLight
import com.example.ui.theme.Primary
import com.example.ui.theme.StarDark
import com.example.ui.theme.StarYellow

@Composable
fun RewardsScreen(
    progress: AppProgress,
    soundManager: SoundManager,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val gradient = Brush.verticalGradient(
        colors = listOf(
            Color(0xFFFFFBEB),
            Color(0xFFFFF3E0),
            Color(0xFFE8F4F8)
        )
    )

    Box(
        modifier = modifier
            .testTag("rewards_screen")
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

                Text(
                    text = "My Rewards ⭐",
                    color = Ink,
                    fontSize = 26.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = (-0.5).sp
                )

                Spacer(modifier = Modifier.size(56.dp))
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Large Glowing Star Showcase
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .widthIn(max = 440.dp)
                    .shadow(elevation = 12.dp, shape = RoundedCornerShape(36.dp), spotColor = StarDark.copy(alpha = 0.3f))
                .clip(RoundedCornerShape(36.dp))
                .background(
                    Brush.verticalGradient(
                        listOf(Color.White, Color(0xFFFFF9E6))
                    )
                )
                .border(3.dp, StarYellow, RoundedCornerShape(36.dp))
                .padding(24.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    TaraMascot(
                        size = 100.dp,
                        animation = MascotAnimation.CELEBRATE,
                        onClick = {
                            soundManager.playTone(ToneType.WIN)
                            soundManager.speak("You are doing amazing! Keep earning stars!")
                        }
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Star,
                            contentDescription = null,
                            tint = StarYellow,
                            modifier = Modifier.size(36.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "${progress.totalStars}",
                            color = Ink,
                            fontSize = 44.sp,
                            fontWeight = FontWeight.Black
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = if (progress.totalStars == 1) "Star" else "Stars",
                            color = StarDark,
                            fontSize = 22.sp,
                            fontWeight = FontWeight.ExtraBold
                        )
                    }

                    Spacer(modifier = Modifier.height(4.dp))

                    val encouragement = when {
                        progress.totalStars >= 50 -> "Legendary Champion! ⭐ You shine so bright!"
                        progress.totalStars >= 20 -> "Super Star! 🌟 Keep up the wonderful work!"
                        progress.totalStars >= 5 -> "Rising Star! 🎈 Great progress every day!"
                        else -> "Welcome, Little Star! Play activities to collect stars! ✨"
                    }

                    Text(
                        text = encouragement,
                        color = InkLight,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.SemiBold,
                        textAlign = TextAlign.Center
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Real Learning Stats Cards Grid
            Text(
                text = "Learning Journey 🚀",
                color = Ink,
                fontSize = 20.sp,
                fontWeight = FontWeight.ExtraBold,
                modifier = Modifier
                    .fillMaxWidth()
                    .widthIn(max = 440.dp)
                    .padding(horizontal = 4.dp, vertical = 6.dp)
            )

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .widthIn(max = 440.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Cards Explored
                StatRowCard(
                    icon = "🃏",
                    title = "Flashcards Explored",
                    value = "${progress.seenCards.size}",
                    color = Primary
                )

                // Best ABC Quiz Round
                StatRowCard(
                    icon = "🔤",
                    title = "Best ABC Score",
                    value = "${progress.bestAbcRound} / 10",
                    color = Color(0xFFFF7043)
                )

                // Best 123 Quiz Round
                StatRowCard(
                    icon = "🔢",
                    title = "Best 123 Score",
                    value = "${progress.bestNumRound} / 10",
                    color = Color(0xFF0288D1)
                )

                // Tracing Letters
                StatRowCard(
                    icon = "✏️",
                    title = "Items Traced",
                    value = "${progress.tracedLetters.size}",
                    color = Color(0xFF8E24AA)
                )
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

@Composable
private fun StatRowCard(
    icon: String,
    title: String,
    value: String,
    color: Color
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(elevation = 3.dp, shape = RoundedCornerShape(20.dp), spotColor = color.copy(alpha = 0.2f))
            .clip(RoundedCornerShape(20.dp))
            .background(Color.White)
            .border(2.dp, color.copy(alpha = 0.25f), RoundedCornerShape(20.dp))
            .padding(horizontal = 16.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(CircleShape)
                    .background(color.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Text(text = icon, fontSize = 24.sp)
            }
            Spacer(modifier = Modifier.width(14.dp))
            Text(
                text = title,
                color = Ink,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold
            )
        }

        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(12.dp))
                .background(color.copy(alpha = 0.12f))
                .padding(horizontal = 12.dp, vertical = 6.dp)
        ) {
            Text(
                text = value,
                color = color,
                fontSize = 16.sp,
                fontWeight = FontWeight.Black
            )
        }
    }
}
