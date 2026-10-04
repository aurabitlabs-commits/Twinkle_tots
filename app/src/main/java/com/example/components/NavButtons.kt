package com.example.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.Icon
import androidx.compose.material3.ripple
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.example.ui.theme.Ink
import com.example.ui.theme.InkLight
import com.example.ui.theme.Primary

@Composable
fun BackButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    color: Color = Color.White
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(
        targetValue = if (isPressed) 0.92f else 1f,
        animationSpec = spring(dampingRatio = 0.45f),
        label = "back_scale"
    )

    Box(
        modifier = modifier
            .testTag("back_button")
            .size(56.dp)
            .scale(scale)
            .shadow(elevation = if (isPressed) 2.dp else 6.dp, shape = CircleShape, spotColor = Color.Black.copy(alpha = 0.15f))
            .clip(CircleShape)
            .background(color)
            .border(2.dp, Color(0xFFE2E8F0), CircleShape)
            .clickable(
                interactionSource = interactionSource,
                indication = ripple(bounded = true),
                onClick = onClick
            ),
        contentAlignment = Alignment.Center
    ) {
        Icon(
            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
            contentDescription = "Back",
            tint = Ink,
            modifier = Modifier.size(28.dp)
        )
    }
}

@Composable
fun LockButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(
        targetValue = if (isPressed) 0.92f else 1f,
        animationSpec = spring(dampingRatio = 0.45f),
        label = "lock_scale"
    )

    Box(
        modifier = modifier
            .testTag("lock_button")
            .size(52.dp)
            .scale(scale)
            .shadow(elevation = if (isPressed) 2.dp else 5.dp, shape = CircleShape, spotColor = Color.Black.copy(alpha = 0.12f))
            .clip(CircleShape)
            .background(Color.White)
            .border(2.dp, Color(0xFFE2E8F0), CircleShape)
            .clickable(
                interactionSource = interactionSource,
                indication = ripple(bounded = true),
                onClick = onClick
            ),
        contentAlignment = Alignment.Center
    ) {
        Icon(
            imageVector = Icons.Default.Lock,
            contentDescription = "Parents Gate",
            tint = InkLight,
            modifier = Modifier.size(22.dp)
        )
    }
}

@Composable
fun SpeakerButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    size: Dp = 56.dp
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(
        targetValue = if (isPressed) 0.92f else 1f,
        animationSpec = spring(dampingRatio = 0.45f),
        label = "speaker_scale"
    )

    Box(
        modifier = modifier
            .testTag("speaker_button")
            .size(size)
            .scale(scale)
            .shadow(elevation = if (isPressed) 2.dp else 6.dp, shape = CircleShape, spotColor = Primary.copy(alpha = 0.35f))
            .clip(CircleShape)
            .background(Color.White)
            .border(2.dp, Primary.copy(alpha = 0.35f), CircleShape)
            .clickable(
                interactionSource = interactionSource,
                indication = ripple(bounded = true),
                onClick = onClick
            ),
        contentAlignment = Alignment.Center
    ) {
        Icon(
            imageVector = Icons.Default.VolumeUp,
            contentDescription = "Hear Sound",
            tint = Primary,
            modifier = Modifier.size(size * 0.52f)
        )
    }
}

@Composable
fun NavArrow(
    direction: NavArrowDirection,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    disabled: Boolean = false
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(
        targetValue = if (isPressed && !disabled) 0.92f else 1f,
        animationSpec = spring(dampingRatio = 0.45f),
        label = "nav_arrow_scale"
    )

    Box(
        modifier = modifier
            .testTag(if (direction == NavArrowDirection.LEFT) "nav_arrow_left" else "nav_arrow_right")
            .size(64.dp)
            .scale(scale)
            .shadow(elevation = if (disabled) 0.dp else if (isPressed) 2.dp else 6.dp, shape = CircleShape, spotColor = Primary.copy(alpha = 0.3f))
            .clip(CircleShape)
            .background(if (disabled) Color(0xFFF1F5F9) else Color.White)
            .border(2.dp, if (disabled) Color.Transparent else Primary.copy(alpha = 0.35f), CircleShape)
            .clickable(
                enabled = !disabled,
                interactionSource = interactionSource,
                indication = ripple(bounded = true),
                onClick = onClick
            ),
        contentAlignment = Alignment.Center
    ) {
        Icon(
            imageVector = if (direction == NavArrowDirection.LEFT) Icons.AutoMirrored.Filled.ArrowBack else Icons.AutoMirrored.Filled.ArrowForward,
            contentDescription = if (direction == NavArrowDirection.LEFT) "Previous" else "Next",
            tint = if (disabled) Color(0xFFCBD5E1) else Primary,
            modifier = Modifier.size(32.dp)
        )
    }
}

enum class NavArrowDirection {
    LEFT,
    RIGHT
}
