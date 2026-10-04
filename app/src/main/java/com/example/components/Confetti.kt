package com.example.components

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import kotlin.random.Random

private data class ConfettiParticle(
    val id: Int,
    val xRatio: Float,
    val delayMs: Int,
    val durationMs: Int,
    val color: Color,
    val emoji: String?,
    val sizeDp: Int,
    val rotation: Float
)

@Composable
fun ConfettiView(
    active: Boolean,
    modifier: Modifier = Modifier
) {
    if (!active) return

    val config = LocalConfiguration.current
    val screenHeight = config.screenHeightDp.dp
    val screenWidth = config.screenWidthDp.dp

    val colors = listOf(
        Color(0xFFFFD54F),
        Color(0xFFFF8C42),
        Color(0xFF4FC3F7),
        Color(0xFF66BB6A),
        Color(0xFFFF8A80),
        Color(0xFFCE93D8)
    )
    val emojis = listOf("\u2B50", "\uD83C\uDF89", "\u2728", "\uD83C\uDF8A")

    val particles = remember(active) {
        List(35) { index ->
            val isEmoji = Random.nextBoolean()
            ConfettiParticle(
                id = index,
                xRatio = Random.nextFloat(),
                delayMs = Random.nextInt(0, 400),
                durationMs = Random.nextInt(1500, 2500),
                color = colors[Random.nextInt(colors.size)],
                emoji = if (isEmoji) emojis[Random.nextInt(emojis.size)] else null,
                sizeDp = Random.nextInt(14, 26),
                rotation = Random.nextFloat() * 720f
            )
        }
    }

    var startAnimation by remember { mutableStateOf(false) }

    LaunchedEffect(active) {
        startAnimation = true
    }

    Box(modifier = modifier.fillMaxSize()) {
        particles.forEach { p ->
            val fallProgress by animateFloatAsState(
                targetValue = if (startAnimation) 1f else 0f,
                animationSpec = tween(
                    durationMillis = p.durationMs,
                    delayMillis = p.delayMs,
                    easing = LinearEasing
                ),
                label = "particle_${p.id}"
            )

            val yOffset = (-30).dp + (screenHeight + 60.dp) * fallProgress
            val xOffset = screenWidth * p.xRatio
            val currentRotation = p.rotation * fallProgress

            Box(
                modifier = Modifier
                    .offset(x = xOffset, y = yOffset)
                    .rotate(currentRotation)
                    .size(p.sizeDp.dp)
            ) {
                if (p.emoji != null) {
                    Text(text = p.emoji, fontSize = (p.sizeDp).sp)
                } else {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .clip(RoundedCornerShape(4.dp))
                            .background(p.color)
                    )
                }
            }
        }
    }
}
