package com.example.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
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
import com.example.components.ConfettiView
import com.example.model.StoryItem
import com.example.ui.theme.Ink
import com.example.ui.theme.InkLight
import com.example.ui.theme.Pastels

val sampleStories = listOf(
    StoryItem(
        "crow",
        "The Thirsty Crow",
        "प्यासा कौआ",
        "🦅",
        listOf(
            "On a hot sunny day, a little crow felt very thirsty." to "एक गर्म दिन था। छोटा कौआ बहुत प्यासा था।",
            "He flew across the garden looking for fresh water." to "वह बगीचे में पानी ढूँढने के लिए उड़ने लगा।",
            "He found a pitcher with a little water at the bottom." to "उसे एक मटका दिखा, जिसमें थोड़ा पानी था।",
            "He dropped small pebbles one by one into the pitcher." to "उसने एक-एक करके कंकड़ मटके में डाले।",
            "The water rose to the top! The crow drank and flew happily." to "पानी ऊपर आ गया! कौए ने पानी पिया और खुशी से उड़ गया।"
        )
    ),
    StoryItem(
        "hare_tortoise",
        "The Hare and Tortoise",
        "खरगोश और कछुआ",
        "🐢",
        listOf(
            "A proud hare challenged a slow, steady tortoise to a race." to "एक घमंडी खरगोश ने कछुए को दौड़ की चुनौती दी।",
            "The hare ran fast and took a long nap under a tree." to "खरगोश तेज़ दौड़ा और पेड़ के नीचे सो गया।",
            "The tortoise walked slowly and steadily without stopping." to "कछुआ बिना रुके लगातार चलता रहा।",
            "The tortoise crossed the finish line first! Slow and steady wins." to "कछुआ पहले पहुँच गया! धीरज और मेहनत की जीत हुई।"
        )
    )
)

@Composable
fun StoriesListScreen(
    soundManager: SoundManager,
    onBack: () -> Unit,
    onSelectStory: (StoryItem, String) -> Unit,
    modifier: Modifier = Modifier
) {
    var lang by remember { mutableStateOf("en") }

    Box(
        modifier = modifier
            .testTag("stories_list_screen")
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(Pastels[0], Pastels[3])))
            .statusBarsPadding()
            .padding(18.dp)
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                BackButton(onClick = {
                    soundManager.playTone(ToneType.TAP)
                    onBack()
                })
                Text(text = "Stories / कहानियाँ", color = Ink, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                Box(modifier = Modifier.size(44.dp))
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Lang toggle
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.align(Alignment.CenterHorizontally)) {
                listOf("en" to "English", "hi" to "हिन्दी").forEach { (key, label) ->
                    val isSel = lang == key
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(if (isSel) Color(0xFFFF8C42) else Color.White)
                            .clickable {
                                soundManager.playTone(ToneType.TAP)
                                lang = key
                            }
                            .padding(horizontal = 16.dp, vertical = 6.dp)
                    ) {
                        Text(text = label, color = if (isSel) Color.White else Ink, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                items(sampleStories) { story ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(24.dp))
                            .background(Color.White)
                            .border(width = 2.dp, color = Color(0xFFFFE082), shape = RoundedCornerShape(24.dp))
                            .clickable {
                                soundManager.playTone(ToneType.TAP)
                                onSelectStory(story, lang)
                            }
                            .padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(56.dp)
                                .clip(RoundedCornerShape(18.dp))
                                .background(Color(0xFFE8F5E9)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = story.coverEmoji, fontSize = 32.sp)
                        }

                        Column(modifier = Modifier.weight(1f).padding(horizontal = 14.dp)) {
                            Text(
                                text = if (lang == "hi") story.titleHi else story.titleEn,
                                color = Ink,
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Text(text = "${story.pages.size} Pages • Interactive", color = InkLight, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                        }

                        Text(text = "📖", fontSize = 22.sp)
                    }
                }
            }
        }
    }
}

@Composable
fun StoryPlayerScreen(
    story: StoryItem,
    lang: String,
    soundManager: SoundManager,
    onBack: () -> Unit,
    onComplete: () -> Unit,
    modifier: Modifier = Modifier
) {
    var pageIdx by remember { mutableIntStateOf(0) }
    var showConfetti by remember { mutableStateOf(false) }

    val currentPage = story.pages[pageIdx]
    val caption = if (lang == "hi") currentPage.second else currentPage.first

    LaunchedEffect(pageIdx) {
        soundManager.speak(caption)
    }

    DisposableEffect(Unit) {
        onDispose { soundManager.stopSpeech() }
    }

    Box(
        modifier = modifier
            .testTag("story_player_screen")
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(Pastels[pageIdx % Pastels.size], Pastels[(pageIdx + 3) % Pastels.size])))
            .statusBarsPadding()
            .padding(18.dp)
    ) {
        ConfettiView(active = showConfetti)

        Column(modifier = Modifier.fillMaxSize(), horizontalAlignment = Alignment.CenterHorizontally) {
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
                    text = if (lang == "hi") story.titleHi else story.titleEn,
                    color = Ink,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )
                Box(modifier = Modifier.size(44.dp))
            }

            Spacer(modifier = Modifier.weight(1f))

            // Main illustration frame
            Box(
                modifier = Modifier
                    .size(260.dp)
                    .clip(RoundedCornerShape(32.dp))
                    .background(Color.White)
                    .border(width = 4.dp, color = Color(0xFFFFE082), shape = RoundedCornerShape(32.dp)),
                contentAlignment = Alignment.Center
            ) {
                Text(text = story.coverEmoji, fontSize = 90.sp)
            }

            Spacer(modifier = Modifier.weight(1f))

            // Caption card
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(24.dp))
                    .background(Color.White)
                    .padding(20.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = caption,
                    color = Ink,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    lineHeight = 24.sp
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Page controls
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(16.dp))
                        .background(if (pageIdx > 0) Color.White else Color(0x66FFFFFF))
                        .clickable(enabled = pageIdx > 0) {
                            soundManager.playTone(ToneType.TAP)
                            pageIdx--
                        }
                        .padding(horizontal = 16.dp, vertical = 10.dp)
                ) {
                    Text(text = "◀ Back", color = Ink, fontWeight = FontWeight.Bold)
                }

                Text(text = "${pageIdx + 1} / ${story.pages.size}", color = InkLight, fontWeight = FontWeight.Bold)

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(16.dp))
                        .background(Color(0xFFFF8C42))
                        .clickable {
                            soundManager.playTone(ToneType.TAP)
                            if (pageIdx < story.pages.size - 1) {
                                pageIdx++
                            } else {
                                showConfetti = true
                                soundManager.playTone(ToneType.WIN)
                                onComplete()
                            }
                        }
                        .padding(horizontal = 16.dp, vertical = 10.dp)
                ) {
                    Text(
                        text = if (pageIdx < story.pages.size - 1) "Next ▶" else "Finish ⭐",
                        color = Color.White,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))
        }
    }
}
