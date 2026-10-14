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
import com.example.ui.theme.CategoryHindi
import com.example.ui.theme.Ink
import com.example.ui.theme.PracticeHubGradient
import com.example.ui.theme.Primary

@Composable
fun PracticeHubScreen(
    soundManager: SoundManager,
    onBack: () -> Unit,
    onNavigate: (ScreenName) -> Unit,
    modifier: Modifier = Modifier
) {
    val gradient = PracticeHubGradient

    Box(
        modifier = modifier
            .testTag("practice_hub_screen")
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
                    text = "Practice ✏️",
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
                    animation = MascotAnimation.BOUNCE,
                    onClick = {
                        soundManager.playTone(ToneType.POP)
                        soundManager.speak("Practice tracing letters and numbers with your finger!")
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
                        text = "Practice tracing with your finger!",
                        color = Ink,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Tracing Cards
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .widthIn(max = 440.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // 1. Trace Letters (A-Z)
                LearningWorldCard(
                    title = "Trace Letters",
                    subtitle = "A to Z letter stroke practice",
                    icon = "🔤",
                    categoryColor = CategoryAbc,
                    categoryBg = Color(0xFFFFF3E0),
                    variant = CardLayoutVariant.HERO,
                    badgeText = "⭐ 26 LETTERS",
                    onClick = {
                        soundManager.playTone(ToneType.TAP)
                        soundManager.speak("Trace Letters! A to Z")
                        onNavigate(ScreenName.ABC_TRACE)
                    }
                )

                // 2. Trace Numbers (1-10)
                LearningWorldCard(
                    title = "Trace Numbers",
                    subtitle = "1 to 10 number stroke practice",
                    icon = "🔢",
                    categoryColor = Category123,
                    categoryBg = Color(0xFFE1F5FE),
                    variant = CardLayoutVariant.HERO,
                    badgeText = "⭐ 10 NUMBERS",
                    onClick = {
                        soundManager.playTone(ToneType.TAP)
                        soundManager.speak("Trace Numbers! 1 to 10")
                        onNavigate(ScreenName.NUM_TRACE)
                    }
                )

                // 3. Trace Hindi (अ-अः)
                LearningWorldCard(
                    title = "अक्षर लिखो",
                    subtitle = "हिंदी वर्णमाला लिखना सीखो",
                    icon = "अ",
                    categoryColor = CategoryHindi,
                    categoryBg = Color(0xFFFBE9E7),
                    variant = CardLayoutVariant.HERO,
                    badgeText = "⭐ वर्णमाला",
                    onClick = {
                        soundManager.playTone(ToneType.TAP)
                        soundManager.speak("हिंदी अक्षर लिखो")
                        onNavigate(ScreenName.HINDI_TRACE)
                    }
                )
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
