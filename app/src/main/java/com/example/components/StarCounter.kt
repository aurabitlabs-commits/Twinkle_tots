package com.example.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.Ink
import com.example.ui.theme.StarDark
import com.example.ui.theme.StarYellow

@Composable
fun StarCounter(
    count: Int,
    modifier: Modifier = Modifier
) {
    val scaleAnim = remember { Animatable(1f) }
    val starRotateAnim = remember { Animatable(0f) }

    // Pulse animation for star
    val infiniteTransition = rememberInfiniteTransition(label = "star_glow")
    val starGlowScale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.12f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 1200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "glow_scale"
    )

    LaunchedEffect(count) {
        if (count > 0) {
            starRotateAnim.animateTo(360f, animationSpec = tween(400))
            starRotateAnim.snapTo(0f)
            scaleAnim.animateTo(1.22f, animationSpec = spring(dampingRatio = 0.45f))
            scaleAnim.animateTo(1f, animationSpec = spring(dampingRatio = 0.65f))
        }
    }

    val capsuleShape = RoundedCornerShape(26.dp)

    Box(
        modifier = modifier
            .testTag("star_counter")
            .shadow(elevation = 6.dp, shape = capsuleShape, spotColor = StarDark.copy(alpha = 0.25f))
            .clip(capsuleShape)
            .background(
                brush = Brush.horizontalGradient(
                    colors = listOf(
                        Color(0xFFFFFDF5),
                        Color(0xFFFFF8E1),
                        Color(0xFFFFFDF5)
                    )
                )
            )
            .border(
                width = 2.5.dp,
                brush = Brush.linearGradient(
                    colors = listOf(
                        StarYellow.copy(alpha = 0.9f),
                        StarDark.copy(alpha = 0.6f)
                    )
                ),
                shape = capsuleShape
            )
            .scale(scaleAnim.value)
            .padding(horizontal = 14.dp, vertical = 7.dp),
        contentAlignment = Alignment.Center
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            // Glowing Animated Star Icon
            Box(
                modifier = Modifier
                    .size(30.dp)
                    .clip(CircleShape)
                    .background(StarYellow.copy(alpha = 0.2f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Star,
                    contentDescription = "Stars",
                    tint = StarYellow,
                    modifier = Modifier
                        .size(24.dp)
                        .scale(starGlowScale)
                        .rotate(starRotateAnim.value)
                )
            }

            Spacer(modifier = Modifier.width(8.dp))

            // Star Count & Friendly Label
            Text(
                text = "$count",
                color = Ink,
                fontSize = 19.sp,
                fontWeight = FontWeight.ExtraBold,
                letterSpacing = 0.5.sp
            )

            Spacer(modifier = Modifier.width(4.dp))

            Text(
                text = if (count == 1) "Star" else "Stars",
                color = StarDark,
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold
            )
        }
    }
}
