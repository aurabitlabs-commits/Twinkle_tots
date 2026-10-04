package com.example.screens

import android.content.Intent
import android.net.Uri
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Mail
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.RestartAlt
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.ripple
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.audio.SoundManager
import com.example.audio.ToneType
import com.example.components.BackButton
import com.example.model.AppProgress
import com.example.model.AppSettings
import com.example.ui.theme.ErrorColor
import com.example.ui.theme.Ink
import com.example.ui.theme.InkLight
import com.example.ui.theme.Primary
import com.example.ui.theme.StarYellow
import com.example.ui.theme.Success

@Composable
fun ParentZoneScreen(
    soundManager: SoundManager,
    settings: AppSettings,
    progress: AppProgress,
    onToggle: (String) -> Unit,
    onResetStars: () -> Unit,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    var showResetDialog by remember { mutableStateOf(false) }

    // Calm professional parent-zone aesthetic
    val gradient = Brush.verticalGradient(
        colors = listOf(
            Color(0xFFF8FAFC),
            Color(0xFFF1F5F9),
            Color(0xFFE2E8F0)
        )
    )

    if (showResetDialog) {
        AlertDialog(
            onDismissRequest = { showResetDialog = false },
            confirmButton = {
                Button(
                    onClick = {
                        soundManager.playTone(ToneType.POP)
                        onResetStars()
                        showResetDialog = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = ErrorColor)
                ) {
                    Text(text = "Reset Progress", color = Color.White, fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                Button(
                    onClick = { showResetDialog = false },
                    colors = ButtonDefaults.buttonColors(containerColor = Color.LightGray)
                ) {
                    Text(text = "Cancel", color = Ink, fontWeight = FontWeight.SemiBold)
                }
            },
            title = {
                Text(text = "Reset All Progress?", fontWeight = FontWeight.Bold, color = Ink)
            },
            text = {
                Text(
                    text = "This will reset all collected stars and learned card history to zero. This cannot be undone.",
                    color = InkLight
                )
            },
            shape = RoundedCornerShape(24.dp)
        )
    }

    Box(
        modifier = modifier
            .testTag("parent_zone_screen")
            .fillMaxSize()
            .background(gradient)
            .statusBarsPadding()
            .padding(18.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState()),
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

                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "Parent Zone 👨‍👩‍👧",
                        color = Ink,
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Black
                    )
                    Text(
                        text = "Grown-ups controls & progress",
                        color = InkLight,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }

                Spacer(modifier = Modifier.size(56.dp))
            }

            Spacer(modifier = Modifier.height(16.dp))

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .widthIn(max = 440.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Section 1: Progress Summary
                ParentCard(title = "Child Progress Summary 📊") {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = "Total Stars Earned:", color = Ink, fontSize = 15.sp, fontWeight = FontWeight.SemiBold)
                        Text(text = "⭐ ${progress.totalStars}", color = Primary, fontSize = 17.sp, fontWeight = FontWeight.Black)
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = "Flashcards Seen:", color = Ink, fontSize = 15.sp, fontWeight = FontWeight.SemiBold)
                        Text(text = "${progress.seenCards.size}", color = Ink, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = "Items Traced:", color = Ink, fontSize = 15.sp, fontWeight = FontWeight.SemiBold)
                        Text(text = "${progress.tracedLetters.size}", color = Ink, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                    }
                }

                // Section 2: Audio & Voice Controls
                ParentCard(title = "Sound & Voice Settings 🔊") {
                    ParentToggleRow(
                        icon = Icons.Default.VolumeUp,
                        title = "Sound Effects",
                        subtitle = "Chimes, pops, and tap feedbacks",
                        checked = settings.soundEffects,
                        onCheckedChange = { onToggle("soundEffects") }
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    ParentToggleRow(
                        icon = Icons.Default.Mic,
                        title = "Voice Pronunciation",
                        subtitle = "Spoken letters, numbers, and stories",
                        checked = settings.voice,
                        onCheckedChange = { onToggle("voice") }
                    )
                }

                // Section 3: Reset Progress
                ParentCard(title = "Manage Data 💾") {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { showResetDialog = true },
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(38.dp)
                                    .clip(CircleShape)
                                    .background(ErrorColor.copy(alpha = 0.12f)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.RestartAlt, contentDescription = null, tint = ErrorColor, modifier = Modifier.size(20.dp))
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(text = "Reset All Stars & Progress", color = ErrorColor, fontSize = 15.sp, fontWeight = FontWeight.Bold)
                                Text(text = "Start fresh from 0 stars", color = InkLight, fontSize = 12.sp)
                            }
                        }
                    }
                }

                // Section 4: Privacy & Safety
                ParentCard(title = "Child Safety & Privacy 🛡️") {
                    Text(
                        text = "Twinkle Tots is 100% kid-safe. No advertising, no tracking, and fully offline functional. Child data never leaves this device.",
                        color = InkLight,
                        fontSize = 13.sp,
                        lineHeight = 18.sp
                    )
                }

                // Section 5: About & Support
                ParentCard(title = "About Twinkle Tots ℹ️") {
                    Text(text = "Version: 1.0.0 (Production Release)", color = InkLight, fontSize = 13.sp)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(text = "Designed for toddlers, preschoolers & curious young minds.", color = InkLight, fontSize = 13.sp)
                }
            }

            Spacer(modifier = Modifier.height(30.dp))
        }
    }
}

@Composable
private fun ParentCard(
    title: String,
    content: @Composable () -> Unit
) {
    val shape = RoundedCornerShape(24.dp)
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(elevation = 3.dp, shape = shape, spotColor = Color.Black.copy(alpha = 0.08f))
            .clip(shape)
            .background(Color.White)
            .border(1.5.dp, Color(0xFFE2E8F0), shape)
            .padding(20.dp)
    ) {
        Text(
            text = title,
            color = Ink,
            fontSize = 17.sp,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(14.dp))
        content()
    }
}

@Composable
private fun ParentToggleRow(
    icon: ImageVector,
    title: String,
    subtitle: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.weight(1f)
        ) {
            Box(
                modifier = Modifier
                    .size(38.dp)
                    .clip(CircleShape)
                    .background(Color(0xFFF1F5F9)),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, contentDescription = null, tint = Ink, modifier = Modifier.size(20.dp))
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column {
                Text(text = title, color = Ink, fontSize = 15.sp, fontWeight = FontWeight.Bold)
                Text(text = subtitle, color = InkLight, fontSize = 12.sp)
            }
        }

        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange,
            colors = SwitchDefaults.colors(
                checkedThumbColor = Color.White,
                checkedTrackColor = Primary
            )
        )
    }
}
