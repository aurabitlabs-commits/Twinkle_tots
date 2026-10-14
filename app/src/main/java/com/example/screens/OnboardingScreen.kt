package com.example.screens

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
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
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.audio.SoundManager
import com.example.audio.ToneType
import com.example.components.BigButton
import com.example.components.MascotAnimation
import com.example.components.TaraMascot
import com.example.ui.theme.Ink
import com.example.ui.theme.InkLight
import com.example.ui.theme.OnboardingGradient
import com.example.ui.theme.Primary
import com.example.ui.theme.StarYellow

private data class OnboardingStep(
    val title: String,
    val subtitle: String,
    val emoji: String,
    val mascotAnim: MascotAnimation
)

@Composable
fun OnboardingScreen(
    soundManager: SoundManager,
    onComplete: () -> Unit,
    modifier: Modifier = Modifier
) {
    var step by remember { mutableIntStateOf(0) }

    val steps = listOf(
        OnboardingStep(
            title = "Hi! I'm Tara! 🐣",
            subtitle = "I'm your friendly guide! We're going to explore, sing, and play together.",
            emoji = "⭐",
            mascotAnim = MascotAnimation.CHEER
        ),
        OnboardingStep(
            title = "Let's Learn & Play! 🎈",
            subtitle = "Discover ABCs, 123 numbers, Hindi वर्णमाला, shapes, colors & fun games!",
            emoji = "🎨",
            mascotAnim = MascotAnimation.BOUNCE
        ),
        OnboardingStep(
            title = "Earn Stars as You Learn! ⭐",
            subtitle = "Collect shiny golden stars for every activity and become a Super Star!",
            emoji = "🏆",
            mascotAnim = MascotAnimation.CELEBRATE
        )
    )

    val currentStep = steps[step]

    val gradient = OnboardingGradient

    Box(
        modifier = modifier
            .testTag("onboarding_screen")
            .fillMaxSize()
            .background(gradient)
            .statusBarsPadding()
            .padding(24.dp)
    ) {
        // Skip Button top right
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.End
        ) {
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(20.dp))
                    .background(Color.White.copy(alpha = 0.85f))
                    .padding(horizontal = 16.dp, vertical = 8.dp)
            ) {
                Text(
                    text = "Skip",
                    color = InkLight,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.testTag("onboarding_skip")
                )
            }
        }

        // Main Slide Content
        Column(
            modifier = Modifier
                .fillMaxSize()
                .widthIn(max = 440.dp)
                .align(Alignment.Center),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            AnimatedContent(
                targetState = currentStep,
                transitionSpec = { fadeIn() togetherWith fadeOut() },
                label = "onboarding_step"
            ) { target ->
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center,
                    modifier = Modifier.padding(horizontal = 12.dp)
                ) {
                    // Living Tara Mascot
                    TaraMascot(
                        size = 130.dp,
                        animation = target.mascotAnim,
                        onClick = {
                            soundManager.playTone(ToneType.POP)
                        }
                    )

                    Spacer(modifier = Modifier.height(28.dp))

                    Text(
                        text = target.title,
                        color = Ink,
                        fontSize = 32.sp,
                        fontWeight = FontWeight.Black,
                        textAlign = TextAlign.Center,
                        letterSpacing = (-0.5).sp
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    Text(
                        text = target.subtitle,
                        color = InkLight,
                        fontSize = 17.sp,
                        fontWeight = FontWeight.SemiBold,
                        textAlign = TextAlign.Center,
                        lineHeight = 24.sp,
                        modifier = Modifier.padding(horizontal = 16.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(36.dp))

            // Step Dots Indicator
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                for (i in steps.indices) {
                    val isActive = i == step
                    Box(
                        modifier = Modifier
                            .size(if (isActive) 24.dp to 10.dp else 10.dp to 10.dp)
                            .clip(CircleShape)
                            .background(if (isActive) Primary else Color(0xFFCBD5E1))
                    )
                }
            }

            Spacer(modifier = Modifier.height(36.dp))

            // Action Button
            BigButton(
                label = if (step < steps.size - 1) "Next ➔" else "Let's Play! 🚀",
                color = Primary,
                onClick = {
                    soundManager.playTone(ToneType.TAP)
                    if (step < steps.size - 1) {
                        step++
                    } else {
                        onComplete()
                    }
                }
            )
        }
    }
}
