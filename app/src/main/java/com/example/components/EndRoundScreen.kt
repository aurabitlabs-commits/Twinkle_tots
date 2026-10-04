package com.example.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.material3.ripple
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.Ink
import com.example.ui.theme.InkLight
import com.example.ui.theme.Primary
import com.example.ui.theme.Secondary
import com.example.ui.theme.StarDark
import com.example.ui.theme.StarYellow
import kotlinx.coroutines.delay

@Composable
fun EndRoundScreen(
    stars: Int,
    onPlayAgain: () -> Unit,
    onHome: () -> Unit,
    modifier: Modifier = Modifier
) {
    val starScales = listOf(
        remember { Animatable(0f) },
        remember { Animatable(0f) },
        remember { Animatable(0f) }
    )

    LaunchedEffect(Unit) {
        for (i in 0 until 3) {
            delay(160)
            starScales[i].animateTo(1.28f, spring(dampingRatio = 0.35f))
            starScales[i].animateTo(1f, spring(dampingRatio = 0.65f))
        }
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    listOf(
                        Color(0xFFFFF9E6),
                        Color(0xFFE8F4F8),
                        Color(0xFFF3E8FF)
                    )
                )
            )
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        val shape = RoundedCornerShape(36.dp)

        Column(
            modifier = Modifier
                .testTag("end_round_card")
                .fillMaxWidth()
                .shadow(elevation = 16.dp, shape = shape, spotColor = Primary.copy(alpha = 0.25f))
                .clip(shape)
                .background(Color.White)
                .border(3.5.dp, Primary.copy(alpha = 0.25f), shape)
                .padding(28.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Tara Celebrating in Person!
            TaraMascot(
                size = 110.dp,
                animation = MascotAnimation.CELEBRATE
            )

            Spacer(modifier = Modifier.height(12.dp))

            Text(
                text = "Super Star! ⭐",
                color = Ink,
                fontSize = 32.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = (-0.5).sp
            )

            Spacer(modifier = Modifier.height(14.dp))

            // 3 Animated Glowing Stars
            Row(
                horizontalArrangement = Arrangement.spacedBy(14.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                for (i in 0 until 3) {
                    val isEarned = i < stars
                    Box(
                        modifier = Modifier
                            .size(72.dp)
                            .scale(starScales[i].value)
                            .shadow(
                                elevation = if (isEarned) 8.dp else 2.dp,
                                shape = CircleShape,
                                spotColor = StarDark.copy(alpha = 0.35f)
                            )
                            .clip(CircleShape)
                            .background(
                                if (isEarned) {
                                    Brush.radialGradient(listOf(Color(0xFFFFFDE7), StarYellow))
                                } else {
                                    Brush.verticalGradient(listOf(Color(0xFFF1F5F9), Color(0xFFE2E8F0)))
                                }
                            )
                            .border(
                                2.5.dp,
                                if (isEarned) StarDark else Color(0xFFCBD5E1),
                                CircleShape
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Star,
                            contentDescription = "Star ${i + 1}",
                            tint = if (isEarned) Color.White else Color(0xFF94A3B8),
                            modifier = Modifier.size(44.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            val feedbackText = when (stars) {
                3 -> "Perfect score! You are shining so bright!"
                2 -> "Awesome job! Keep learning & playing!"
                else -> "Great effort! Let's try again!"
            }

            Text(
                text = feedbackText,
                color = InkLight,
                fontSize = 17.sp,
                fontWeight = FontWeight.SemiBold,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(26.dp))

            // Action Buttons with Spring Feedback
            TactileEndButton(
                text = "Play Again",
                icon = Icons.Default.Refresh,
                containerColor = Primary,
                contentColor = Color.White,
                onClick = onPlayAgain,
                testTag = "play_again_button"
            )

            Spacer(modifier = Modifier.height(12.dp))

            TactileEndButton(
                text = "Home Playground",
                icon = Icons.Default.Home,
                containerColor = Color(0xFFE0F2FE),
                contentColor = Color(0xFF0369A1),
                onClick = onHome,
                testTag = "home_button"
            )
        }
    }
}

@Composable
private fun TactileEndButton(
    text: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    containerColor: Color,
    contentColor: Color,
    onClick: () -> Unit,
    testTag: String
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val shape = RoundedCornerShape(26.dp)

    Box(
        modifier = Modifier
            .testTag(testTag)
            .fillMaxWidth()
            .height(58.dp)
            .scale(if (isPressed) 0.96f else 1f)
            .shadow(elevation = 6.dp, shape = shape, spotColor = containerColor.copy(alpha = 0.35f))
            .clip(shape)
            .background(containerColor)
            .clickable(
                interactionSource = interactionSource,
                indication = ripple(bounded = true),
                onClick = onClick
            ),
        contentAlignment = Alignment.Center
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = contentColor,
                modifier = Modifier.size(24.dp)
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = text,
                fontSize = 19.sp,
                fontWeight = FontWeight.Bold,
                color = contentColor
            )
        }
    }
}
