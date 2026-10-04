package com.example.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.scale
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.example.ui.theme.ErrorColor
import com.example.ui.theme.Ink
import com.example.ui.theme.StarDark
import com.example.ui.theme.StarYellow
import kotlinx.coroutines.launch
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin

enum class MascotAnimation {
    IDLE,
    BOUNCE,
    CHEER,
    WOBBLE,
    CELEBRATE
}

@Composable
fun TaraMascot(
    size: Dp = 100.dp,
    animation: MascotAnimation = MascotAnimation.IDLE,
    modifier: Modifier = Modifier,
    onClick: (() -> Unit)? = null
) {
    val scope = rememberCoroutineScope()
    val tapScale = remember { Animatable(1f) }

    val infiniteTransition = rememberInfiniteTransition(label = "tara_motion")

    // Breathing float motion
    val floatOffset by infiniteTransition.animateFloat(
        initialValue = if (animation == MascotAnimation.BOUNCE || animation == MascotAnimation.CHEER) -4f else -7f,
        targetValue = if (animation == MascotAnimation.BOUNCE || animation == MascotAnimation.CHEER) 10f else 7f,
        animationSpec = infiniteRepeatable(
            animation = tween(
                durationMillis = when (animation) {
                    MascotAnimation.CHEER -> 400
                    MascotAnimation.BOUNCE -> 600
                    MascotAnimation.WOBBLE -> 350
                    else -> 1800
                },
                easing = FastOutSlowInEasing
            ),
            repeatMode = RepeatMode.Reverse
        ),
        label = "float"
    )

    // Breathing scale motion
    val breathingScale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = when (animation) {
            MascotAnimation.CHEER -> 1.10f
            MascotAnimation.BOUNCE -> 1.07f
            MascotAnimation.CELEBRATE -> 1.12f
            else -> 1.03f
        },
        animationSpec = infiniteRepeatable(
            animation = tween(
                durationMillis = if (animation == MascotAnimation.IDLE) 1400 else 600,
                easing = FastOutSlowInEasing
            ),
            repeatMode = RepeatMode.Reverse
        ),
        label = "breath"
    )

    // Wiggle / cheer rotation
    val rotation by infiniteTransition.animateFloat(
        initialValue = when (animation) {
            MascotAnimation.CHEER -> -10f
            MascotAnimation.WOBBLE -> -8f
            MascotAnimation.CELEBRATE -> -12f
            else -> 0f
        },
        targetValue = when (animation) {
            MascotAnimation.CHEER -> 10f
            MascotAnimation.WOBBLE -> 8f
            MascotAnimation.CELEBRATE -> 12f
            else -> 0f
        },
        animationSpec = infiniteRepeatable(
            animation = tween(
                durationMillis = when (animation) {
                    MascotAnimation.CHEER -> 280
                    MascotAnimation.WOBBLE -> 200
                    MascotAnimation.CELEBRATE -> 320
                    else -> 1000
                },
                easing = LinearEasing
            ),
            repeatMode = RepeatMode.Reverse
        ),
        label = "rotate"
    )

    Box(
        modifier = modifier
            .testTag("tara_mascot")
            .size(size)
            .offset(y = floatOffset.dp)
            .scale(breathingScale * tapScale.value)
            .rotate(rotation)
            .clickable(
                enabled = onClick != null,
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = {
                    scope.launch {
                        tapScale.animateTo(1.22f, spring(dampingRatio = 0.35f))
                        tapScale.animateTo(1f, spring(dampingRatio = 0.55f))
                    }
                    onClick?.invoke()
                }
            ),
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.size(size)) {
            val w = this.size.width
            val h = this.size.height
            val cx = w / 2f
            val cy = h / 2f
            val outerRadius = w * 0.46f
            val innerRadius = outerRadius * 0.52f

            // 5-pointed Star geometry
            val path = Path()
            val points = 5
            val angleStep = (2 * PI) / points
            val startAngle = -PI / 2.0

            for (i in 0 until points * 2) {
                val r = if (i % 2 == 0) outerRadius else innerRadius
                val currentAngle = startAngle + i * (angleStep / 2)
                val x = cx + (r * cos(currentAngle)).toFloat()
                val y = cy + (r * sin(currentAngle)).toFloat()
                if (i == 0) path.moveTo(x, y) else path.lineTo(x, y)
            }
            path.close()

            // Fill Star with Warm Radiant Gradient
            drawPath(
                path = path,
                brush = Brush.radialGradient(
                    colors = listOf(
                        Color(0xFFFFF9C4), // Bright highlight center
                        StarYellow,        // Warm golden middle
                        StarDark           // Amber outer rim
                    ),
                    center = Offset(cx, cy - h * 0.08f),
                    radius = outerRadius * 1.15f
                )
            )

            // Outer Crisp Stroke
            drawPath(
                path = path,
                color = StarDark,
                style = Stroke(width = w * 0.038f, cap = StrokeCap.Round)
            )

            // Sparkle Highlights on top tip
            drawCircle(
                color = Color.White.copy(alpha = 0.75f),
                radius = w * 0.03f,
                center = Offset(cx, cy - outerRadius * 0.65f)
            )

            // Big anime/friendly eyes
            val eyeRadius = w * 0.052f
            val eyeY = cy - h * 0.05f
            val eyeSpacing = w * 0.13f

            // Eye Backgrounds
            drawCircle(color = Ink, radius = eyeRadius, center = Offset(cx - eyeSpacing, eyeY))
            drawCircle(color = Ink, radius = eyeRadius, center = Offset(cx + eyeSpacing, eyeY))

            // Double eye glints (kawaii sparkle)
            val glintMajor = eyeRadius * 0.42f
            val glintMinor = eyeRadius * 0.22f
            drawCircle(color = Color.White, radius = glintMajor, center = Offset(cx - eyeSpacing - eyeRadius * 0.28f, eyeY - eyeRadius * 0.28f))
            drawCircle(color = Color.White, radius = glintMajor, center = Offset(cx + eyeSpacing - eyeRadius * 0.28f, eyeY - eyeRadius * 0.28f))
            drawCircle(color = Color.White, radius = glintMinor, center = Offset(cx - eyeSpacing + eyeRadius * 0.32f, eyeY + eyeRadius * 0.25f))
            drawCircle(color = Color.White, radius = glintMinor, center = Offset(cx + eyeSpacing + eyeRadius * 0.32f, eyeY + eyeRadius * 0.25f))

            // Cheerful Rosy Cheeks
            val cheekRadius = w * 0.065f
            val cheekY = cy + h * 0.05f
            val cheekSpacing = w * 0.19f
            drawCircle(color = Color(0xFFFF8A80).copy(alpha = 0.75f), radius = cheekRadius, center = Offset(cx - cheekSpacing, cheekY))
            drawCircle(color = Color(0xFFFF8A80).copy(alpha = 0.75f), radius = cheekRadius, center = Offset(cx + cheekSpacing, cheekY))

            // Mouth: Smile or Open Happy Mouth for Cheer
            if (animation == MascotAnimation.CHEER || animation == MascotAnimation.CELEBRATE) {
                // Open Happy Mouth
                val openMouth = Path().apply {
                    arcTo(
                        rect = Rect(
                            left = cx - w * 0.09f,
                            top = cy + h * 0.02f,
                            right = cx + w * 0.09f,
                            bottom = cy + h * 0.18f
                        ),
                        startAngleDegrees = 0f,
                        sweepAngleDegrees = 180f,
                        forceMoveTo = false
                    )
                    close()
                }
                drawPath(path = openMouth, color = Color(0xFFC2185B))
                drawPath(path = openMouth, color = Ink, style = Stroke(width = w * 0.025f, cap = StrokeCap.Round))
            } else {
                // Gentle Smiling Arc
                val smilePath = Path().apply {
                    arcTo(
                        rect = Rect(
                            left = cx - w * 0.09f,
                            top = cy + h * 0.02f,
                            right = cx + w * 0.09f,
                            bottom = cy + h * 0.14f
                        ),
                        startAngleDegrees = 0f,
                        sweepAngleDegrees = 180f,
                        forceMoveTo = false
                    )
                }
                drawPath(
                    path = smilePath,
                    color = Ink,
                    style = Stroke(width = w * 0.032f, cap = StrokeCap.Round)
                )
            }
        }
    }
}
