package com.example.screens

import androidx.compose.foundation.background
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
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.audio.SoundManager
import com.example.audio.ToneType
import com.example.components.BackButton
import com.example.components.CardLayoutVariant
import com.example.components.LearningWorldCard
import com.example.components.MascotAnimation
import com.example.components.TaraMascot
import com.example.model.ScreenName
import com.example.ui.theme.Category123
import com.example.ui.theme.CategoryAbc
import com.example.ui.theme.CategoryColors
import com.example.ui.theme.CategoryShapes
import com.example.ui.theme.Ink
import com.example.ui.theme.PlayHubGradient
import com.example.ui.theme.Primary

@Composable
fun PlayHubScreen(
    soundManager: SoundManager,
    onBack: () -> Unit,
    onNavigate: (ScreenName) -> Unit,
    modifier: Modifier = Modifier
) {
    val gradient = PlayHubGradient

    Box(
        modifier = modifier
            .testTag("play_hub_screen")
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

                Text(
                    text = "Play Zone 🎮",
                    color = Ink,
                    fontSize = 26.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = (-0.5).sp
                )

                Spacer(modifier = Modifier.size(56.dp))
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Tara Companion Guidance
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .widthIn(max = 440.dp)
                    .clip(RoundedCornerShape(24.dp))
                    .background(Color.White.copy(alpha = 0.9f))
                    .padding(horizontal = 16.dp, vertical = 10.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                TaraMascot(
                    size = 56.dp,
                    animation = MascotAnimation.CHEER,
                    onClick = {
                        soundManager.playTone(ToneType.POP)
                        soundManager.speak("Ready for a game? Let's play!")
                    }
                )
                Column(modifier = Modifier.padding(start = 12.dp)) {
                    Text(
                        text = "Tara says:",
                        color = Primary,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.ExtraBold
                    )
                    Text(
                        text = "Ready for a fun game? Let's play!",
                        color = Ink,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Game Cards
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .widthIn(max = 440.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // 1. Shape Sorter (Hero Game)
                LearningWorldCard(
                    title = "Shape Sorter",
                    subtitle = "Drag & drop shapes into slots!",
                    icon = "🔷",
                    categoryColor = CategoryShapes,
                    categoryBg = Color(0xFFF3E5F5),
                    variant = CardLayoutVariant.HERO,
                    badgeText = "⭐ TODDLER FAVORITE",
                    onClick = {
                        soundManager.playTone(ToneType.TAP)
                        soundManager.speak("Shape Sorter! Match the shapes")
                        onNavigate(ScreenName.SHAPE_SORTER)
                    }
                )

                // 2. Paint & Draw (Hero Game)
                LearningWorldCard(
                    title = "Paint & Draw",
                    subtitle = "Finger painting with vibrant colors!",
                    icon = "🎨",
                    categoryColor = CategoryColors,
                    categoryBg = Color(0xFFE0F2F1),
                    variant = CardLayoutVariant.HERO,
                    badgeText = "🎨 CREATIVE",
                    onClick = {
                        soundManager.playTone(ToneType.TAP)
                        soundManager.speak("Paint and Draw! Create something colorful")
                        onNavigate(ScreenName.PAINT)
                    }
                )

                // 3. Find Games Row: Shape Find & Color Find
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    LearningWorldCard(
                        title = "Find Shapes",
                        subtitle = "Spot the shape!",
                        icon = "🔍",
                        categoryColor = CategoryShapes,
                        categoryBg = Color(0xFFF3E5F5),
                        variant = CardLayoutVariant.COMPACT,
                        modifier = Modifier.weight(1f),
                        onClick = {
                            soundManager.playTone(ToneType.TAP)
                            soundManager.speak("Find Shape!")
                            onNavigate(ScreenName.SHAPES_FIND)
                        }
                    )

                    LearningWorldCard(
                        title = "Find Colors",
                        subtitle = "Spot the color!",
                        icon = "🔎",
                        categoryColor = CategoryColors,
                        categoryBg = Color(0xFFE0F2F1),
                        variant = CardLayoutVariant.COMPACT,
                        modifier = Modifier.weight(1f),
                        onClick = {
                            soundManager.playTone(ToneType.TAP)
                            soundManager.speak("Find Color!")
                            onNavigate(ScreenName.COLORS_FIND)
                        }
                    )
                }

                // 4. Memory Match Games Row: ABC Match & 123 Match
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    LearningWorldCard(
                        title = "ABC Match",
                        subtitle = "Flip letter cards!",
                        icon = "🧩",
                        categoryColor = CategoryAbc,
                        categoryBg = Color(0xFFFFF3E0),
                        variant = CardLayoutVariant.COMPACT,
                        modifier = Modifier.weight(1f),
                        onClick = {
                            soundManager.playTone(ToneType.TAP)
                            soundManager.speak("ABC Match! Flip and match letters")
                            onNavigate(ScreenName.ABC_MATCH)
                        }
                    )

                    LearningWorldCard(
                        title = "123 Match",
                        subtitle = "Flip number cards!",
                        icon = "🃏",
                        categoryColor = Category123,
                        categoryBg = Color(0xFFE1F5FE),
                        variant = CardLayoutVariant.COMPACT,
                        modifier = Modifier.weight(1f),
                        onClick = {
                            soundManager.playTone(ToneType.TAP)
                            soundManager.speak("123 Match! Flip and match numbers")
                            onNavigate(ScreenName.NUM_MATCH)
                        }
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
