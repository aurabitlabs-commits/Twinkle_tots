package com.example.components

import androidx.compose.animation.core.animateFloatAsState
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
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.material3.ripple
import androidx.compose.runtime.Composable
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.Ink
import com.example.ui.theme.InkLight

enum class CardLayoutVariant {
    HERO,       // Full width hero card (e.g. ABC Adventure)
    COMPACT,    // 2-column card (e.g. 123, Hindi, Shapes, Colors)
    WIDE        // Wide banner card
}

@Composable
fun LearningWorldCard(
    title: String,
    subtitle: String,
    icon: String,
    categoryColor: Color,
    categoryBg: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: CardLayoutVariant = CardLayoutVariant.COMPACT,
    badgeText: String? = null
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(
        targetValue = if (isPressed) 0.95f else 1f,
        animationSpec = spring(dampingRatio = 0.45f),
        label = "world_card_scale"
    )

    val shape = RoundedCornerShape(32.dp)

    Box(
        modifier = modifier
            .testTag("learning_world_$title")
            .scale(scale)
            .shadow(
                elevation = if (isPressed) 3.dp else 8.dp,
                shape = shape,
                spotColor = categoryColor.copy(alpha = 0.3f),
                ambientColor = categoryColor.copy(alpha = 0.15f)
            )
            .clip(shape)
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(
                        Color.White,
                        categoryBg.copy(alpha = 0.45f)
                    )
                )
            )
            .border(
                width = 3.dp,
                brush = Brush.linearGradient(
                    colors = listOf(
                        categoryColor.copy(alpha = 0.55f),
                        categoryColor.copy(alpha = 0.25f)
                    )
                ),
                shape = shape
            )
            .clickable(
                interactionSource = interactionSource,
                indication = ripple(bounded = true, color = categoryColor.copy(alpha = 0.2f)),
                onClick = onClick
            )
    ) {
        // Decorative background sparkle orb
        Box(
            modifier = Modifier
                .align(Alignment.TopEnd)
                .size(if (variant == CardLayoutVariant.HERO) 100.dp else 60.dp)
                .clip(CircleShape)
                .background(categoryColor.copy(alpha = 0.08f))
        )

        if (variant == CardLayoutVariant.HERO) {
            // Hero Layout: Horizontal presentation with large visual icon
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 20.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column(
                    modifier = Modifier.weight(1f)
                ) {
                    if (badgeText != null) {
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(12.dp))
                                .background(categoryColor.copy(alpha = 0.15f))
                                .padding(horizontal = 10.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = badgeText,
                                color = categoryColor,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.ExtraBold,
                                letterSpacing = 0.6.sp
                            )
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                    }

                    Text(
                        text = title,
                        color = Ink,
                        fontSize = 26.sp,
                        fontWeight = FontWeight.ExtraBold,
                        letterSpacing = (-0.3).sp
                    )

                    Spacer(modifier = Modifier.height(2.dp))

                    Text(
                        text = subtitle,
                        color = InkLight,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }

                Spacer(modifier = Modifier.width(14.dp))

                // Large Glowing Icon Bubble
                Box(
                    modifier = Modifier
                        .size(76.dp)
                        .shadow(elevation = 6.dp, shape = RoundedCornerShape(26.dp), spotColor = categoryColor.copy(alpha = 0.35f))
                        .clip(RoundedCornerShape(26.dp))
                        .background(
                            brush = Brush.linearGradient(
                                colors = listOf(
                                    categoryColor.copy(alpha = 0.25f),
                                    categoryColor.copy(alpha = 0.15f)
                                )
                            )
                        )
                        .border(2.dp, categoryColor.copy(alpha = 0.4f), RoundedCornerShape(26.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = icon,
                        fontSize = 38.sp
                    )
                }
            }
        } else {
            // Compact Layout (2-Column Grid)
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 18.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                // Icon Bubble
                Box(
                    modifier = Modifier
                        .size(62.dp)
                        .shadow(elevation = 4.dp, shape = RoundedCornerShape(22.dp), spotColor = categoryColor.copy(alpha = 0.3f))
                        .clip(RoundedCornerShape(22.dp))
                        .background(categoryBg)
                        .border(2.dp, categoryColor.copy(alpha = 0.35f), RoundedCornerShape(22.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = icon,
                        fontSize = 32.sp
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = title,
                    color = Ink,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.ExtraBold,
                    letterSpacing = (-0.2).sp
                )

                Spacer(modifier = Modifier.height(2.dp))

                Text(
                    text = subtitle,
                    color = InkLight,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }
    }
}
