package com.example.components

import androidx.compose.animation.core.animateDpAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.example.ui.theme.Primary

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun ProgressDots(
    total: Int,
    current: Int,
    modifier: Modifier = Modifier
) {
    FlowRow(
        modifier = modifier,
        horizontalArrangement = Arrangement.spacedBy(6.dp, Alignment.CenterHorizontally),
        verticalArrangement = Arrangement.spacedBy(6.dp, Alignment.CenterVertically),
        maxItemsInEachRow = 13
    ) {
        for (i in 0 until total) {
            val isCurrent = i == current
            val isPast = i < current
            val dotWidth by animateDpAsState(targetValue = if (isCurrent) 22.dp else 10.dp, label = "dot_width")
            val color = when {
                isCurrent -> Primary
                isPast -> Primary.copy(alpha = 0.5f)
                else -> Color(0xFFE0E0E0)
            }
            Box(
                modifier = Modifier
                    .width(dotWidth)
                    .height(10.dp)
                    .clip(CircleShape)
                    .background(color)
            )
        }
    }
}
