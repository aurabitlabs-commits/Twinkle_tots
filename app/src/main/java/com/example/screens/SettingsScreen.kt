package com.example.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
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
import com.example.model.AppSettings
import com.example.ui.theme.ErrorColor
import com.example.ui.theme.Ink
import com.example.ui.theme.InkLight
import com.example.ui.theme.Pastels
import com.example.ui.theme.Primary
import com.example.ui.theme.Secondary
import com.example.ui.theme.StarYellow
import com.example.ui.theme.Success

@Composable
fun SettingsScreen(
    soundManager: SoundManager,
    settings: AppSettings,
    onToggle: (String) -> Unit,
    onResetStars: () -> Unit,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    var showResetDialog by remember { mutableStateOf(false) }

    val gradient = Brush.verticalGradient(
        colors = listOf(Pastels[0], Pastels[3])
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
                    Text(text = "Reset", color = Color.White, fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                Button(
                    onClick = {
                        soundManager.playTone(ToneType.TAP)
                        showResetDialog = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE0E0E0))
                ) {
                    Text(text = "Cancel", color = Ink, fontWeight = FontWeight.Bold)
                }
            },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Star,
                        contentDescription = "Star",
                        tint = StarYellow,
                        modifier = Modifier.size(32.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(text = "Reset all stars?", color = Ink, fontWeight = FontWeight.Bold)
                }
            },
            text = {
                Text(
                    text = "This will reset your total stars to zero. This action cannot be undone.",
                    color = InkLight,
                    fontSize = 16.sp
                )
            },
            shape = RoundedCornerShape(28.dp),
            containerColor = Color.White
        )
    }

    Box(
        modifier = modifier
            .testTag("settings_screen")
            .fillMaxSize()
            .background(gradient)
            .statusBarsPadding()
            .padding(20.dp)
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

                Text(
                    text = "Settings",
                    color = Ink,
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.size(56.dp))
            }

            Spacer(modifier = Modifier.height(24.dp))

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .widthIn(max = 380.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Sound Effects Toggle
                SettingSwitchRow(
                    icon = Icons.Default.VolumeUp,
                    iconTint = Primary,
                    label = "Sound Effects",
                    checked = settings.soundEffects,
                    onCheckedChange = {
                        soundManager.playTone(ToneType.TAP)
                        onToggle("soundEffects")
                    }
                )

                // Voice Toggle
                SettingSwitchRow(
                    icon = Icons.Default.Mic,
                    iconTint = Secondary,
                    label = "Voice",
                    checked = settings.voice,
                    onCheckedChange = {
                        soundManager.playTone(ToneType.TAP)
                        onToggle("voice")
                    }
                )

                // Reset Stars
                SettingActionRow(
                    icon = Icons.Default.RestartAlt,
                    iconTint = ErrorColor,
                    label = "Reset Stars",
                    trailing = {
                        Icon(
                            imageVector = Icons.Default.Star,
                            contentDescription = null,
                            tint = StarYellow,
                            modifier = Modifier.size(24.dp)
                        )
                    },
                    onClick = {
                        soundManager.playTone(ToneType.TAP)
                        showResetDialog = true
                    }
                )

                // Privacy Policy
                SettingActionRow(
                    icon = Icons.Default.Security,
                    iconTint = Success,
                    label = "Privacy Policy",
                    onClick = {
                        soundManager.playTone(ToneType.TAP)
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://twinkletots.app/privacy"))
                        try {
                            context.startActivity(intent)
                        } catch (_: Exception) {}
                    }
                )

                // Contact Us
                SettingActionRow(
                    icon = Icons.Default.Mail,
                    iconTint = Secondary,
                    label = "Contact Us",
                    onClick = {
                        soundManager.playTone(ToneType.TAP)
                        val intent = Intent(Intent.ACTION_SENDTO).apply {
                            data = Uri.parse("mailto:support@twinkletots.app")
                        }
                        try {
                            context.startActivity(intent)
                        } catch (_: Exception) {}
                    }
                )

                // App Version
                SettingActionRow(
                    icon = Icons.Default.Info,
                    iconTint = InkLight,
                    label = "App Version",
                    trailing = {
                        Text(
                            text = "1.0.0",
                            color = InkLight,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold
                        )
                    },
                    onClick = null
                )
            }
        }
    }
}

@Composable
private fun SettingSwitchRow(
    icon: ImageVector,
    iconTint: Color,
    label: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    val shape = RoundedCornerShape(24.dp)
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(elevation = 4.dp, shape = shape)
            .clip(shape)
            .background(Color.White)
            .clickable { onCheckedChange(!checked) }
            .padding(horizontal = 20.dp, vertical = 14.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = iconTint,
                modifier = Modifier.size(28.dp)
            )
            Spacer(modifier = Modifier.width(16.dp))
            Text(
                text = label,
                color = Ink,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
        }

        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange,
            colors = SwitchDefaults.colors(
                checkedThumbColor = Color.White,
                checkedTrackColor = Success,
                uncheckedThumbColor = Color.White,
                uncheckedTrackColor = Color(0xFFE0E0E0)
            )
        )
    }
}

@Composable
private fun SettingActionRow(
    icon: ImageVector,
    iconTint: Color,
    label: String,
    trailing: (@Composable () -> Unit)? = null,
    onClick: (() -> Unit)?
) {
    val shape = RoundedCornerShape(24.dp)
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(elevation = 4.dp, shape = shape)
            .clip(shape)
            .background(Color.White)
            .clickable(
                enabled = onClick != null,
                interactionSource = remember { MutableInteractionSource() },
                indication = ripple(bounded = true),
                onClick = { onClick?.invoke() }
            )
            .padding(horizontal = 20.dp, vertical = 18.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = iconTint,
                modifier = Modifier.size(28.dp)
            )
            Spacer(modifier = Modifier.width(16.dp))
            Text(
                text = label,
                color = Ink,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
        }

        if (trailing != null) {
            trailing()
        }
    }
}
