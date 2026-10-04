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
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
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
import com.example.ui.theme.Primary

@Composable
fun BigButton(
    label: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    icon: (@Composable () -> Unit)? = null,
    color: Color = Primary,
    textColor: Color = Color.White,
    isLarge: Boolean = false,
    disabled: Boolean = false
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(
        targetValue = if (isPressed) 0.95f else 1f,
        animationSpec = spring(dampingRatio = 0.45f),
        label = "big_button_scale"
    )

    val shape = RoundedCornerShape(32.dp)
    val minHeight = if (isLarge) 130.dp else 84.dp

    Box(
        modifier = modifier
            .testTag("big_button_$label")
            .fillMaxWidth()
            .heightIn(min = minHeight)
            .scale(scale)
            .shadow(
                elevation = if (disabled) 0.dp else if (isPressed) 3.dp else 8.dp,
                shape = shape,
                spotColor = color.copy(alpha = 0.4f)
            )
            .clip(shape)
            .background(
                brush = Brush.verticalGradient(
                    colors = if (disabled) {
                        listOf(color.copy(alpha = 0.4f), color.copy(alpha = 0.3f))
                    } else {
                        listOf(
                            color.copy(alpha = 0.95f),
                            color
                        )
                    }
                )
            )
            .border(
                width = 2.dp,
                color = Color.White.copy(alpha = 0.35f),
                shape = shape
            )
            .clickable(
                enabled = !disabled,
                interactionSource = interactionSource,
                indication = ripple(bounded = true, color = Color.White.copy(alpha = 0.3f)),
                onClick = onClick
            )
            .padding(vertical = if (isLarge) 20.dp else 16.dp, horizontal = 24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            if (icon != null) {
                icon()
                Spacer(modifier = Modifier.height(4.dp))
            }
            Text(
                text = label,
                color = textColor,
                fontSize = if (isLarge) 28.sp else 22.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = 0.3.sp
            )
        }
    }
}
