package com.example.screens

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
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
import androidx.compose.foundation.layout.offset
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
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
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
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.audio.SoundManager
import com.example.audio.ToneType
import com.example.components.CardLayoutVariant
import com.example.components.LearningWorldCard
import com.example.components.LockButton
import com.example.components.MascotAnimation
import com.example.components.StarCounter
import com.example.components.TaraMascot
import com.example.model.ScreenName
import com.example.ui.theme.Category123
import com.example.ui.theme.CategoryAbc
import com.example.ui.theme.CategoryColors
import com.example.ui.theme.CategoryHindi
import com.example.ui.theme.CategoryShapes
import com.example.ui.theme.Ink
import com.example.ui.theme.InkLight
import com.example.ui.theme.Primary
import com.example.ui.theme.StarYellow

@Composable
fun HomeScreen(
    stars: Int,
    soundManager: SoundManager,
    onNavigate: (ScreenName) -> Unit,
    modifier: Modifier = Modifier
) {
    var mascotState by remember { mutableStateOf(MascotAnimation.IDLE) }
    var greetingText by remember { mutableStateOf("Ready to play & learn? ✨") }

    // Floating decorative clouds / stars animation
    val infiniteTransition = rememberInfiniteTransition(label = "home_decor")
    val cloudOffset by infiniteTransition.animateFloat(
        initialValue = -8f,
        targetValue = 8f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 2600, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "cloud_float"
    )

    // Soft magical playground background gradient
    val backgroundGradient = Brush.verticalGradient(
        colors = listOf(
            Color(0xFFE8F4F8), // Morning sky blue
            Color(0xFFFFF9E6), // Gentle warm sunlight
            Color(0xFFFFF3EB)  // Soft peach horizon
        )
    )

    Box(
        modifier = modifier
            .testTag("home_screen")
            .fillMaxSize()
            .background(backgroundGradient)
            .statusBarsPadding()
    ) {
        // Floating decorative stars
        Text(
            text = "✨",
            fontSize = 24.sp,
            modifier = Modifier
                .align(Alignment.TopStart)
                .padding(start = 24.dp, top = 80.dp)
                .offset(y = cloudOffset.dp * 0.7f)
        )
        Text(
            text = "🌟",
            fontSize = 20.sp,
            modifier = Modifier
                .align(Alignment.TopEnd)
                .padding(end = 28.dp, top = 120.dp)
                .offset(y = -cloudOffset.dp * 0.5f)
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp, vertical = 12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // TOP BAR: Brand Badge + Star Capsule + Parent Lock
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 6.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Twinkle Tots Brand Pill
                Box(
                    modifier = Modifier
                        .shadow(elevation = 3.dp, shape = RoundedCornerShape(20.dp))
                        .clip(RoundedCornerShape(20.dp))
                        .background(Color.White.copy(alpha = 0.9f))
                        .border(1.5.dp, Primary.copy(alpha = 0.35f), RoundedCornerShape(20.dp))
                        .padding(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.AutoAwesome,
                            contentDescription = null,
                            tint = StarYellow,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "TWINKLE TOTS",
                            color = Primary,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.ExtraBold,
                            letterSpacing = 1.sp
                        )
                    }
                }

                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    StarCounter(count = stars)
                    LockButton(onClick = {
                        soundManager.playTone(ToneType.TAP)
                        onNavigate(ScreenName.PARENT_GATE)
                    })
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // HERO PLAYGROUND AREA: Living Tara Mascot & Interactive Greeting
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .widthIn(max = 440.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    // Speech Bubble from Tara
                    Box(
                        modifier = Modifier
                            .shadow(elevation = 4.dp, shape = RoundedCornerShape(20.dp), spotColor = Primary.copy(alpha = 0.2f))
                            .clip(RoundedCornerShape(20.dp))
                            .background(Color.White)
                            .border(2.dp, Primary.copy(alpha = 0.25f), RoundedCornerShape(20.dp))
                            .padding(horizontal = 16.dp, vertical = 8.dp)
                    ) {
                        Text(
                            text = greetingText,
                            color = Ink,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 0.2.sp
                        )
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    // Living Tara Mascot - Interactive on Tap
                    TaraMascot(
                        size = 110.dp,
                        animation = mascotState,
                        onClick = {
                            soundManager.playTone(ToneType.POP)
                            soundManager.speak("Hi little star! What shall we explore next?")
                            mascotState = MascotAnimation.CHEER
                            greetingText = "Yay! Let's explore together! 🎈"
                        }
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        text = "Learning Playground",
                        color = Ink,
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = (-0.5).sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // 🌟 PROMINENT "TODAY'S ADVENTURE" CARD
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .widthIn(max = 440.dp)
                    .shadow(elevation = 8.dp, shape = RoundedCornerShape(28.dp), spotColor = Primary.copy(alpha = 0.35f))
                    .clip(RoundedCornerShape(28.dp))
                    .background(
                        Brush.horizontalGradient(
                            listOf(
                                Color(0xFFFF9800),
                                Color(0xFFFF5722)
                            )
                        )
                    )
                    .border(2.dp, Color.White.copy(alpha = 0.4f), RoundedCornerShape(28.dp))
                    .clickable {
                        soundManager.playTone(ToneType.TAP)
                        soundManager.speak("Today's Adventure! Let's play ABC Quest!")
                        onNavigate(ScreenName.ABC_PLAY)
                    }
                    .padding(18.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.weight(1f)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(54.dp)
                                .clip(RoundedCornerShape(18.dp))
                                .background(Color.White.copy(alpha = 0.25f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = "🚀", fontSize = 30.sp)
                        }

                        Spacer(modifier = Modifier.width(14.dp))

                        Column {
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(Color.White.copy(alpha = 0.25f))
                                    .padding(horizontal = 8.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = "🌟 DAILY QUEST",
                                    color = Color.White,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    letterSpacing = 0.6.sp
                                )
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "Today's Adventure",
                                color = Color.White,
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Black
                            )
                            Text(
                                text = "Find 3 letters ➔ Count ➔ Trace",
                                color = Color(0xFFFFF3E0),
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(16.dp))
                            .background(Color.White)
                            .padding(horizontal = 14.dp, vertical = 8.dp)
                    ) {
                        Text(
                            text = "Start ▶",
                            color = Primary,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Black
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // PRIMARY NAVIGATION DESTINATIONS (5 Large Hub Cards)
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .widthIn(max = 440.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // 1. 📚 LEARN (Hero Destination)
                LearningWorldCard(
                    title = "📚 Learn",
                    subtitle = "ABC, 123, Hindi, Shapes & Colors",
                    icon = "🐣",
                    categoryColor = CategoryAbc,
                    categoryBg = Color(0xFFFFF3E0),
                    variant = CardLayoutVariant.HERO,
                    badgeText = "⭐ 5 WORLDS",
                    onClick = {
                        soundManager.playTone(ToneType.TAP)
                        soundManager.speak("Learn World! Alphabet, Numbers, Hindi, Shapes and Colors")
                        onNavigate(ScreenName.LEARN_HUB)
                    }
                )

                // 2. Row: 🎮 PLAY & ✏️ PRACTICE
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    LearningWorldCard(
                        title = "🎮 Play",
                        subtitle = "Games & Puzzles",
                        icon = "🧩",
                        categoryColor = Color(0xFF8E24AA),
                        categoryBg = Color(0xFFF3E5F5),
                        variant = CardLayoutVariant.COMPACT,
                        modifier = Modifier.weight(1f),
                        onClick = {
                            soundManager.playTone(ToneType.TAP)
                            soundManager.speak("Play Zone! Fun games and matching")
                            onNavigate(ScreenName.PLAY_HUB)
                        }
                    )

                    LearningWorldCard(
                        title = "✏️ Practice",
                        subtitle = "Trace & Write",
                        icon = "📝",
                        categoryColor = Color(0xFF00897B),
                        categoryBg = Color(0xFFE0F2F1),
                        variant = CardLayoutVariant.COMPACT,
                        modifier = Modifier.weight(1f),
                        onClick = {
                            soundManager.playTone(ToneType.TAP)
                            soundManager.speak("Practice! Trace letters and numbers")
                            onNavigate(ScreenName.PRACTICE_HUB)
                        }
                    )
                }

                // 3. Row: 📖 STORIES & RHYMES & ⭐ MY REWARDS
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    LearningWorldCard(
                        title = "📖 Stories & Songs",
                        subtitle = "Stories & Rhymes",
                        icon = "🎵",
                        categoryColor = Color(0xFF0288D1),
                        categoryBg = Color(0xFFE1F5FE),
                        variant = CardLayoutVariant.COMPACT,
                        modifier = Modifier.weight(1f),
                        onClick = {
                            soundManager.playTone(ToneType.TAP)
                            soundManager.speak("Story and Rhyme Time!")
                            onNavigate(ScreenName.STORY_RHYME_HUB)
                        }
                    )

                    LearningWorldCard(
                        title = "⭐ My Rewards",
                        subtitle = "Stars & Badges",
                        icon = "🏆",
                        categoryColor = Color(0xFFFFA000),
                        categoryBg = Color(0xFFFFF8E1),
                        variant = CardLayoutVariant.COMPACT,
                        modifier = Modifier.weight(1f),
                        onClick = {
                            soundManager.playTone(ToneType.TAP)
                            soundManager.speak("My Rewards and Stars!")
                            onNavigate(ScreenName.REWARDS_SCREEN)
                        }
                    )
                }
            }

            Spacer(modifier = Modifier.height(28.dp))
        }
    }
}
