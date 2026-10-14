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
import com.example.components.CardLayoutVariant
import com.example.components.LearningWorldCard
import com.example.components.MascotAnimation
import com.example.components.TaraMascot
import com.example.model.ScreenName
import com.example.ui.theme.Category123
import com.example.ui.theme.Category123Bg
import com.example.ui.theme.CategoryAbc
import com.example.ui.theme.CategoryAbcBg
import com.example.ui.theme.CategoryColors
import com.example.ui.theme.CategoryColorsBg
import com.example.ui.theme.CategoryHindi
import com.example.ui.theme.CategoryHindiBg
import com.example.ui.theme.CategoryShapes
import com.example.ui.theme.CategoryShapesBg
import com.example.ui.theme.Ink
import com.example.ui.theme.InkLight
import com.example.ui.theme.LearnHubGradient
import com.example.ui.theme.Primary

@Composable
fun LearnHubScreen(
    soundManager: SoundManager,
    onBack: () -> Unit,
    onNavigate: (ScreenName) -> Unit,
    modifier: Modifier = Modifier
) {
    val gradient = LearnHubGradient

    Box(
        modifier = modifier
            .testTag("learn_hub_screen")
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
                    text = "Learn World 📚",
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
                    animation = MascotAnimation.IDLE,
                    onClick = {
                        soundManager.playTone(ToneType.POP)
                        soundManager.speak("Let's learn something new!")
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
                        text = "Pick a world to discover & play!",
                        color = Ink,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // 5 Learning Worlds (Asymmetrical & Structured)
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .widthIn(max = 440.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // 1. ABC Adventure (Hero Card)
                LearningWorldCard(
                    title = "ABC Adventure",
                    subtitle = "Letters, Play, Trace & Match",
                    icon = "🐣",
                    categoryColor = CategoryAbc,
                    categoryBg = CategoryAbcBg,
                    variant = CardLayoutVariant.HERO,
                    badgeText = "⭐ 4 ACTIVITIES",
                    onClick = {
                        soundManager.playTone(ToneType.TAP)
                        soundManager.speak("A B C Adventure")
                        onNavigate(ScreenName.ABC_MENU)
                    }
                )

                // 2. 123 Number Garden & Hindi World (Row)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    LearningWorldCard(
                        title = "123 Garden",
                        subtitle = "Numbers 1-10",
                        icon = "🔢",
                        categoryColor = Category123,
                        categoryBg = Category123Bg,
                        variant = CardLayoutVariant.COMPACT,
                        modifier = Modifier.weight(1f),
                        onClick = {
                            soundManager.playTone(ToneType.TAP)
                            soundManager.speak("Number Garden! One Two Three")
                            onNavigate(ScreenName.NUM_MENU)
                        }
                    )

                    LearningWorldCard(
                        title = "अ आ World",
                        subtitle = "स्वर और व्यंजन",
                        icon = "🦚",
                        categoryColor = CategoryHindi,
                        categoryBg = CategoryHindiBg,
                        variant = CardLayoutVariant.COMPACT,
                        modifier = Modifier.weight(1f),
                        onClick = {
                            soundManager.playTone(ToneType.TAP)
                            soundManager.speak("वर्णमाला सीखो और खेलो")
                            onNavigate(ScreenName.HINDI_MENU)
                        }
                    )
                }

                // 3. Shape Planet & Color Garden (Row)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    LearningWorldCard(
                        title = "Shape Planet",
                        subtitle = "Learn, Sorter & Match",
                        icon = "🔺",
                        categoryColor = CategoryShapes,
                        categoryBg = CategoryShapesBg,
                        variant = CardLayoutVariant.COMPACT,
                        modifier = Modifier.weight(1f),
                        onClick = {
                            soundManager.playTone(ToneType.TAP)
                            soundManager.speak("Shape Planet! आकार")
                            onNavigate(ScreenName.SHAPES_MENU)
                        }
                    )

                    LearningWorldCard(
                        title = "Color Garden",
                        subtitle = "Colors, Find & Paint",
                        icon = "🎨",
                        categoryColor = CategoryColors,
                        categoryBg = CategoryColorsBg,
                        variant = CardLayoutVariant.COMPACT,
                        modifier = Modifier.weight(1f),
                        onClick = {
                            soundManager.playTone(ToneType.TAP)
                            soundManager.speak("Color Garden! रंग")
                            onNavigate(ScreenName.COLORS_MENU)
                        }
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
