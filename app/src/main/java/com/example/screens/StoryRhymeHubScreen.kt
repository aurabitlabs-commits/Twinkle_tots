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
import com.example.ui.theme.Ink
import com.example.ui.theme.Primary
import com.example.ui.theme.StoryRhymeHubGradient

@Composable
fun StoryRhymeHubScreen(
    soundManager: SoundManager,
    onBack: () -> Unit,
    onNavigate: (ScreenName) -> Unit,
    modifier: Modifier = Modifier
) {
    val gradient = StoryRhymeHubGradient

    Box(
        modifier = modifier
            .testTag("story_rhyme_hub_screen")
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
                    text = "Story & Rhyme 📖",
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
                        soundManager.speak("Time for a lovely story or singing songs together!")
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
                        text = "Listen, sing, and enjoy together! ✨",
                        color = Ink,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // 2 Large Beautiful Storybook Choices
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .widthIn(max = 440.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // 1. Bedtime & Moral Stories
                LearningWorldCard(
                    title = "Story Time",
                    subtitle = "The Thirsty Crow, Lion & Mouse, Hare & Tortoise with touch words & quiz",
                    icon = "📖",
                    categoryColor = Color(0xFF6366F1),
                    categoryBg = Color(0xFFEEF2FF),
                    variant = CardLayoutVariant.HERO,
                    badgeText = "⭐ NARRATED STORIES",
                    onClick = {
                        soundManager.playTone(ToneType.TAP)
                        soundManager.speak("Story Time! Bedtime and moral stories")
                        onNavigate(ScreenName.STORIES_LIST)
                    }
                )

                // 2. Sing-Along Rhymes
                LearningWorldCard(
                    title = "Sing-Along Rhymes",
                    subtitle = "Twinkle Twinkle, Baa Baa Sheep, तितली उड़ी, मछली जल की रानी",
                    icon = "🎵",
                    categoryColor = Color(0xFFF59E0B),
                    categoryBg = Color(0xFFFFFBEB),
                    variant = CardLayoutVariant.HERO,
                    badgeText = "🎶 MUSIC & KARAOKE",
                    onClick = {
                        soundManager.playTone(ToneType.TAP)
                        soundManager.speak("Sing Along Rhymes! Nursery songs")
                        onNavigate(ScreenName.RHYMES_LIST)
                    }
                )
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
