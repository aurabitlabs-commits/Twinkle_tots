package com.example.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Backspace
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.material3.ripple
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.audio.SoundManager
import com.example.audio.ToneType
import com.example.components.BackButton
import com.example.components.MascotAnimation
import com.example.components.TaraMascot
import com.example.ui.theme.ErrorColor
import com.example.ui.theme.ErrorLight
import com.example.ui.theme.Ink
import com.example.ui.theme.InkLight
import com.example.ui.theme.PastelBorders
import com.example.ui.theme.Pastels
import com.example.ui.theme.Success
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlin.random.Random

private data class MathGate(val a: Int, val b: Int, val answer: Int)

private fun generateGate(): MathGate {
    val a = Random.nextInt(2, 10)
    val b = Random.nextInt(2, 10)
    return MathGate(a, b, a + b)
}

@Composable
fun ParentGateScreen(
    soundManager: SoundManager,
    onBack: () -> Unit,
    onPass: () -> Unit,
    modifier: Modifier = Modifier
) {
    val coroutineScope = rememberCoroutineScope()
    var gate by remember { mutableStateOf(generateGate()) }
    var input by remember { mutableStateOf("") }
    var isWrong by remember { mutableStateOf(false) }

    val gradient = Brush.verticalGradient(
        colors = listOf(Pastels[0], Pastels[2])
    )

    Box(
        modifier = modifier
            .testTag("parent_gate_screen")
            .fillMaxSize()
            .background(gradient)
            .statusBarsPadding()
            .padding(20.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Top Bar
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                BackButton(onClick = {
                    soundManager.playTone(ToneType.TAP)
                    onBack()
                })

                Text(
                    text = "Parents Only",
                    color = Ink,
                    fontSize = 26.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.size(56.dp))
            }

            Spacer(modifier = Modifier.height(12.dp))

            TaraMascot(size = 72.dp, animation = MascotAnimation.IDLE)

            Spacer(modifier = Modifier.height(16.dp))

            // White Card
            val cardShape = RoundedCornerShape(32.dp)
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .widthIn(max = 340.dp)
                    .shadow(elevation = 10.dp, shape = cardShape)
                    .clip(cardShape)
                    .background(Color.White)
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "Please solve this to continue",
                    color = InkLight,
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Medium
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "${gate.a} + ${gate.b} = ?",
                    color = Ink,
                    fontSize = 36.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(14.dp))

                // Display box
                Box(
                    modifier = Modifier
                        .size(width = 120.dp, height = 56.dp)
                        .clip(RoundedCornerShape(16.dp))
                        .background(if (isWrong) ErrorLight else Pastels[0])
                        .border(
                            width = 3.dp,
                            color = if (isWrong) ErrorColor else PastelBorders[0],
                            shape = RoundedCornerShape(16.dp)
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = if (input.isEmpty()) "?" else input,
                        color = Ink,
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                if (isWrong) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Oops! Going back...",
                        color = ErrorColor,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }

                Spacer(modifier = Modifier.height(18.dp))

                // Numeric Keypad
                Column(
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    val digits = listOf(
                        listOf("1", "2", "3"),
                        listOf("4", "5", "6"),
                        listOf("7", "8", "9")
                    )

                    digits.forEach { row ->
                        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            row.forEach { d ->
                                KeypadButton(
                                    label = d,
                                    bgColor = Pastels[d.toInt() % Pastels.size],
                                    borderColor = PastelBorders[d.toInt() % PastelBorders.size],
                                    onClick = {
                                        soundManager.playTone(ToneType.TAP)
                                        if (input.length < 2) input += d
                                    }
                                )
                            }
                        }
                    }

                    // Bottom row: Backspace, 0, OK
                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        Box(
                            modifier = Modifier
                                .size(64.dp)
                                .clip(RoundedCornerShape(16.dp))
                                .background(Color(0xFFE0E0E0))
                                .clickable {
                                    soundManager.playTone(ToneType.TAP)
                                    if (input.isNotEmpty()) input = input.dropLast(1)
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Backspace,
                                contentDescription = "Delete",
                                tint = Ink,
                                modifier = Modifier.size(24.dp)
                            )
                        }

                        KeypadButton(
                            label = "0",
                            bgColor = Pastels[0],
                            borderColor = PastelBorders[0],
                            onClick = {
                                soundManager.playTone(ToneType.TAP)
                                if (input.length < 2) input += "0"
                            }
                        )

                        Box(
                            modifier = Modifier
                                .size(64.dp)
                                .clip(RoundedCornerShape(16.dp))
                                .background(Success)
                                .clickable {
                                    if (input.isNotEmpty()) {
                                        val entered = input.toIntOrNull()
                                        if (entered == gate.answer) {
                                            soundManager.playTone(ToneType.CORRECT)
                                            onPass()
                                        } else {
                                            soundManager.playTone(ToneType.WRONG)
                                            isWrong = true
                                            coroutineScope.launch {
                                                delay(1500)
                                                isWrong = false
                                                input = ""
                                                gate = generateGate()
                                                onBack()
                                            }
                                        }
                                    }
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "OK",
                                color = Color.White,
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.weight(1f))
        }
    }
}

@Composable
private fun KeypadButton(
    label: String,
    bgColor: Color,
    borderColor: Color,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .size(64.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(bgColor)
            .border(width = 3.dp, color = borderColor, shape = RoundedCornerShape(16.dp))
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = ripple(bounded = true),
                onClick = onClick
            ),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = label,
            color = Ink,
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold
        )
    }
}
