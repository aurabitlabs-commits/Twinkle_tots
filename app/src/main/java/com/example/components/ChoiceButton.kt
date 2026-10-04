package com.example.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
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
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.ErrorColor
import com.example.ui.theme.ErrorLight
import com.example.ui.theme.Ink
import com.example.ui.theme.StarDark
import com.example.ui.theme.StarYellow
import com.example.ui.theme.Success
import com.example.ui.theme.SuccessLight

enum class ChoiceState {
    DEFAULT,
    CORRECT,
    WRONG,
    DISABLED,
    REVEALED
}

@Composable
fun ChoiceButton(
    label: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    emoji: String? = null,
    state: ChoiceState = ChoiceState.DEFAULT
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()

    val shakeOffset = remember { Animatable(0f) }
    val popScale = remember { Animatable(1f) }

    LaunchedEffect(state) {
        if (state == ChoiceState.WRONG) {
            // Gentle encouraging wobble
            shakeOffset.animateTo(-8f, tween(60))
            shakeOffset.animateTo(8f, tween(60))
            shakeOffset.animateTo(-5f, tween(60))
            shakeOffset.animateTo(5f, tween(60))
            shakeOffset.animateTo(0f, tween(60))
        } else if (state == ChoiceState.CORRECT) {
            popScale.animateTo(1.14f, spring(dampingRatio = 0.35f))
            popScale.animateTo(1.0f, spring(dampingRatio = 0.65f))
        }
    }

    val (bgBrush, borderColor, textColor) = when (state) {
        ChoiceState.CORRECT -> Triple(
            Brush.verticalGradient(listOf(Color(0xFF34D399), Success)),
            Color(0xFF059669),
            Color.White
        )
        ChoiceState.WRONG -> Triple(
            Brush.verticalGradient(listOf(Color(0xFFFFF1F2), ErrorLight)),
            ErrorColor,
            Color(0xFFBE123C)
        )
        ChoiceState.DISABLED -> Triple(
            Brush.verticalGradient(listOf(Color(0xFFF8FAFC), Color(0xFFF1F5F9))),
            Color(0xFFCBD5E1),
            Color(0xFF94A3B8)
        )
        ChoiceState.REVEALED -> Triple(
            Brush.verticalGradient(listOf(Color(0xFFFFFBEB), StarYellow)),
            StarDark,
            Ink
        )
        ChoiceState.DEFAULT -> Triple(
            Brush.verticalGradient(listOf(Color.White, Color(0xFFFAFBFD))),
            Color(0xFFE2E8F0),
            Ink
        )
    }

    val shape = RoundedCornerShape(28.dp)
    val isInteractive = state == ChoiceState.DEFAULT

    Box(
        modifier = modifier
            .testTag("choice_button_$label")
            .fillMaxWidth()
            .heightIn(min = 96.dp)
            .offset(x = shakeOffset.value.dp)
            .scale(popScale.value * if (isPressed) 0.96f else 1f)
            .shadow(
                elevation = if (state == ChoiceState.CORRECT) 10.dp else if (state == ChoiceState.DEFAULT) 6.dp else 2.dp,
                shape = shape,
                spotColor = if (state == ChoiceState.CORRECT) Success.copy(alpha = 0.4f) else Color.Black.copy(alpha = 0.12f)
            )
            .clip(shape)
            .background(bgBrush)
            .border(width = 3.dp, color = borderColor, shape = shape)
            .clickable(
                enabled = isInteractive,
                interactionSource = interactionSource,
                indication = ripple(bounded = true),
                onClick = onClick
            )
            .padding(vertical = 14.dp, horizontal = 16.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            if (!emoji.isNullOrEmpty()) {
                Text(
                    text = emoji,
                    fontSize = 38.sp
                )
                Spacer(modifier = Modifier.height(4.dp))
            }
            Text(
                text = label,
                color = textColor,
                fontSize = 32.sp,
                fontWeight = FontWeight.ExtraBold,
                letterSpacing = 0.5.sp
            )
        }
    }
}
