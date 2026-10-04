package com.example.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
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
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
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
import com.example.ui.theme.PastelBorders
import com.example.ui.theme.Pastels
import com.example.ui.theme.StarYellow
import com.example.ui.theme.Success
import com.example.ui.theme.SuccessLight
import kotlinx.coroutines.launch

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun FlashCard(
    bigText: String,
    modifier: Modifier = Modifier,
    smallText: String? = null,
    word: String? = null,
    emoji: String? = null,
    emojiCount: Int? = null,
    showEmojiGrid: Boolean = false,
    pastelIndex: Int = 0,
    tappedEmojis: Set<Int> = emptySet(),
    onEmojiTap: ((Int) -> Unit)? = null,
    onTap: (() -> Unit)? = null
) {
    val scope = rememberCoroutineScope()
    val cardScale = remember { Animatable(1f) }
    val objectScale = remember { Animatable(1f) }

    val bgColor = Pastels[pastelIndex % Pastels.size]
    val borderColor = PastelBorders[pastelIndex % PastelBorders.size]
    val shape = RoundedCornerShape(36.dp)

    Column(
        modifier = modifier
            .testTag("flash_card")
            .fillMaxWidth()
            .scale(cardScale.value)
            .shadow(
                elevation = 12.dp,
                shape = shape,
                spotColor = borderColor.copy(alpha = 0.35f),
                ambientColor = borderColor.copy(alpha = 0.15f)
            )
            .clip(shape)
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(
                        Color.White,
                        bgColor.copy(alpha = 0.75f)
                    )
                )
            )
            .border(
                width = 3.5.dp,
                brush = Brush.linearGradient(
                    colors = listOf(
                        borderColor,
                        borderColor.copy(alpha = 0.4f)
                    )
                ),
                shape = shape
            )
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = {
                    scope.launch {
                        cardScale.animateTo(1.04f, spring(dampingRatio = 0.45f))
                        cardScale.animateTo(1f, spring(dampingRatio = 0.65f))
                    }
                    scope.launch {
                        objectScale.animateTo(1.15f, spring(dampingRatio = 0.35f))
                        objectScale.animateTo(1f, spring(dampingRatio = 0.55f))
                    }
                    onTap?.invoke()
                }
            )
            .padding(vertical = 28.dp, horizontal = 20.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // Big Letter / Number Hero Presentation
        Row(
            verticalAlignment = Alignment.Bottom,
            horizontalArrangement = Arrangement.Center
        ) {
            Text(
                text = bigText,
                color = Ink,
                fontSize = 76.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = (-1).sp,
                lineHeight = 76.sp
            )
            if (!smallText.isNullOrEmpty()) {
                Spacer(modifier = Modifier.width(12.dp))
                Text(
                    text = smallText,
                    color = InkLight,
                    fontSize = 46.sp,
                    fontWeight = FontWeight.ExtraBold,
                    letterSpacing = (-0.5).sp,
                    lineHeight = 46.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Big Single Object Stage (for ABC & Hindi)
        if (!showEmojiGrid && !emoji.isNullOrEmpty()) {
            Box(
                modifier = Modifier
                    .size(136.dp)
                    .scale(objectScale.value)
                    .shadow(elevation = 8.dp, shape = CircleShape, spotColor = borderColor.copy(alpha = 0.3f))
                    .clip(CircleShape)
                    .background(Color.White)
                    .border(3.dp, borderColor.copy(alpha = 0.4f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = emoji,
                    fontSize = 74.sp
                )
            }
        }

        // Tap-to-count Interactive Bubble Grid (for 123)
        if (showEmojiGrid && !emoji.isNullOrEmpty() && emojiCount != null && emojiCount > 0) {
            Box(
                modifier = Modifier
                    .shadow(elevation = 6.dp, shape = RoundedCornerShape(26.dp), spotColor = borderColor.copy(alpha = 0.25f))
                    .clip(RoundedCornerShape(26.dp))
                    .background(Color.White)
                    .border(2.dp, borderColor.copy(alpha = 0.35f), RoundedCornerShape(26.dp))
                    .padding(16.dp),
                contentAlignment = Alignment.Center
            ) {
                FlowRow(
                    horizontalArrangement = Arrangement.spacedBy(10.dp, Alignment.CenterHorizontally),
                    verticalArrangement = Arrangement.spacedBy(10.dp, Alignment.CenterVertically),
                    maxItemsInEachRow = if (emojiCount <= 4) emojiCount else 5
                ) {
                    val itemSize = if (emojiCount > 6) 48.dp else 56.dp
                    val emojiFontSize = if (emojiCount > 6) 24.sp else 32.sp

                    for (i in 0 until emojiCount) {
                        val isTapped = tappedEmojis.contains(i)
                        val emojiScale = remember { Animatable(1f) }

                        Box(
                            modifier = Modifier
                                .size(itemSize)
                                .scale(emojiScale.value)
                                .shadow(elevation = if (isTapped) 4.dp else 1.dp, shape = CircleShape)
                                .clip(CircleShape)
                                .background(
                                    if (isTapped) {
                                        Brush.verticalGradient(listOf(SuccessLight, Color(0xFFD1FAE5)))
                                    } else {
                                        Brush.verticalGradient(listOf(Color(0xFFFAFAFA), Color(0xFFF1F5F9)))
                                    }
                                )
                                .border(
                                    width = 2.5.dp,
                                    color = if (isTapped) Success else Color(0xFFE2E8F0),
                                    shape = CircleShape
                                )
                                .clickable {
                                    scope.launch {
                                        emojiScale.animateTo(1.3f, spring(dampingRatio = 0.35f))
                                        emojiScale.animateTo(1f, spring(dampingRatio = 0.55f))
                                    }
                                    onEmojiTap?.invoke(i)
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = emoji,
                                fontSize = emojiFontSize,
                                modifier = Modifier.scale(if (isTapped) 0.95f else 1f)
                            )
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        // Word with playful pill container
        if (!word.isNullOrEmpty()) {
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(16.dp))
                    .background(borderColor.copy(alpha = 0.25f))
                    .padding(horizontal = 20.dp, vertical = 8.dp)
            ) {
                Text(
                    text = word,
                    color = Ink,
                    fontSize = 28.sp,
                    fontWeight = FontWeight.ExtraBold,
                    letterSpacing = 0.5.sp
                )
            }
        }
    }
}
