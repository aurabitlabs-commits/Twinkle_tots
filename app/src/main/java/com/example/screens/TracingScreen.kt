package com.example.screens

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectDragGestures
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
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.audio.SoundManager
import com.example.audio.ToneType
import com.example.components.BackButton
import com.example.components.ConfettiView
import com.example.components.SpeakerButton
import com.example.model.TracingItem
import com.example.ui.theme.Ink
import com.example.ui.theme.Pastels
import kotlin.math.hypot

@Composable
fun TracingScreen(
    title: String,
    items: List<TracingItem>,
    tracedLetters: Set<String>,
    soundManager: SoundManager,
    onBack: () -> Unit,
    onLetterCompleted: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    var currentIndex by remember { mutableIntStateOf(0) }
    val currentItem = items.getOrNull(currentIndex) ?: items[0]

    var currentStrokeIdx by remember(currentItem.id) { mutableIntStateOf(0) }
    var completedStrokes by remember(currentItem.id) { mutableStateOf(setOf<Int>()) }
    var userPath by remember { mutableStateOf(listOf<Offset>()) }
    var showConfetti by remember { mutableStateOf(false) }

    LaunchedEffect(currentItem.id) {
        soundManager.speak(currentItem.label)
        currentStrokeIdx = 0
        completedStrokes = emptySet()
        userPath = emptyList()
        showConfetti = false
    }

    val gradient = Brush.verticalGradient(
        colors = listOf(Pastels[currentIndex % Pastels.size], Pastels[(currentIndex + 2) % Pastels.size])
    )

    Box(
        modifier = modifier
            .testTag("tracing_screen")
            .fillMaxSize()
            .background(gradient)
            .statusBarsPadding()
            .padding(18.dp)
    ) {
        ConfettiView(active = showConfetti)

        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                BackButton(onClick = {
                    soundManager.playTone(ToneType.TAP)
                    onBack()
                })
                Text(text = title, color = Ink, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                SpeakerButton(onClick = {
                    soundManager.playTone(ToneType.TAP)
                    soundManager.speak(currentItem.label)
                })
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Scrollable Letter Selector Bar
            LazyRow(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                itemsIndexed(items) { idx, item ->
                    val isSel = idx == currentIndex
                    val isDone = tracedLetters.contains(item.id)
                    Box(
                        modifier = Modifier
                            .size(if (isSel) 52.dp else 44.dp)
                            .clip(RoundedCornerShape(16.dp))
                            .background(if (isSel) Color.White else Color(0xCCFFFFFF))
                            .border(width = if (isSel) 2.dp else 0.dp, color = Color(0xFFFFB300), shape = RoundedCornerShape(16.dp))
                            .clickable {
                                soundManager.playTone(ToneType.TAP)
                                currentIndex = idx
                            },
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = item.label,
                            color = if (isSel) Color(0xFFFF8C42) else Ink,
                            fontWeight = FontWeight.Bold,
                            fontSize = 20.sp
                        )
                        if (isDone) {
                            Text(text = "⭐", fontSize = 10.sp, modifier = Modifier.align(Alignment.TopEnd).padding(2.dp))
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            // Tracing Canvas Box
            val boxShape = RoundedCornerShape(32.dp)
            Box(
                modifier = Modifier
                    .size(310.dp)
                    .shadow(elevation = 10.dp, shape = boxShape)
                    .clip(boxShape)
                    .background(Color.White)
                    .border(width = 4.dp, color = Color(0xFFFFE082), shape = boxShape)
                    .pointerInput(currentItem.id, currentStrokeIdx) {
                        detectDragGestures(
                            onDragStart = { offset ->
                                userPath = listOf(offset)
                            },
                            onDrag = { change, _ ->
                                change.consume()
                                userPath = userPath + change.position
                            },
                            onDragEnd = {
                                // Stroke validation: check if drawn path roughly spans the current stroke
                                val stroke = currentItem.strokes.getOrNull(currentStrokeIdx)
                                if (stroke != null && userPath.size >= 5) {
                                    soundManager.playTone(ToneType.CHIME)
                                    val nextCompleted = completedStrokes + currentStrokeIdx
                                    completedStrokes = nextCompleted
                                    userPath = emptyList()

                                    if (nextCompleted.size >= currentItem.strokes.size) {
                                        // Completed letter!
                                        soundManager.playTone(ToneType.WIN)
                                        showConfetti = true
                                        onLetterCompleted(currentItem.id)
                                    } else {
                                        currentStrokeIdx++
                                    }
                                } else {
                                    userPath = emptyList()
                                }
                            }
                        )
                    }
            ) {
                Canvas(modifier = Modifier.fillMaxSize()) {
                    val w = size.width
                    val h = size.height

                    // Draw guide strokes
                    currentItem.strokes.forEachIndexed { sIdx, stroke ->
                        if (stroke.size >= 2) {
                            val path = Path().apply {
                                stroke.forEachIndexed { pIdx, pt ->
                                    val x = (pt.first / 100f) * w
                                    val y = (pt.second / 100f) * h
                                    if (pIdx == 0) moveTo(x, y) else lineTo(x, y)
                                }
                            }
                            val isCompleted = completedStrokes.contains(sIdx)
                            val isCurrent = sIdx == currentStrokeIdx
                            val strokeColor = when {
                                isCompleted -> Color(0xFF66BB6A)
                                isCurrent -> Color(0xFFFFE082)
                                else -> Color(0xFFF1F5F9)
                            }
                            drawPath(
                                path = path,
                                color = strokeColor,
                                style = Stroke(width = if (isCompleted) 32f else 38f, cap = StrokeCap.Round, join = StrokeJoin.Round)
                            )
                        }
                    }

                    // Draw start dot on current stroke
                    val currentStroke = currentItem.strokes.getOrNull(currentStrokeIdx)
                    if (currentStroke != null && currentStroke.isNotEmpty() && !completedStrokes.contains(currentStrokeIdx)) {
                        val start = currentStroke.first()
                        val sx = (start.first / 100f) * w
                        val sy = (start.second / 100f) * h
                        drawCircle(color = Color(0xFFFF8C42), radius = 16f, center = Offset(sx, sy))
                        drawCircle(color = Color.White, radius = 9f, center = Offset(sx, sy))
                    }

                    // Draw user ink
                    if (userPath.size > 1) {
                        val inkPath = Path().apply {
                            userPath.forEachIndexed { idx, pt ->
                                if (idx == 0) moveTo(pt.x, pt.y) else lineTo(pt.x, pt.y)
                            }
                        }
                        drawPath(path = inkPath, color = Color(0xFF4FC3F7), style = Stroke(width = 28f, cap = StrokeCap.Round, join = StrokeJoin.Round))
                    }
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            if (showConfetti) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(20.dp))
                        .background(Color(0xFF66BB6A))
                        .clickable {
                            if (currentIndex < items.size - 1) currentIndex++ else currentIndex = 0
                        }
                        .padding(horizontal = 24.dp, vertical = 12.dp)
                ) {
                    Text(text = "Next Letter ➔", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                }
            } else {
                Text(text = "Follow the numbers with your finger! 👆", color = Ink, fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
            }

            Spacer(modifier = Modifier.height(18.dp))
        }
    }
}
