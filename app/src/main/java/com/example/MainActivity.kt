package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.example.audio.SoundManager
import com.example.data.StorageManager
import com.example.data.alphabetData
import com.example.data.colorsData
import com.example.data.englishTracingItems
import com.example.data.hindiData
import com.example.data.hindiTracingItems
import com.example.data.numbersData
import com.example.data.numbersTracingItems
import com.example.data.shapesData
import com.example.model.AppProgress
import com.example.model.AppSettings
import com.example.model.RhymeItem
import com.example.model.ScreenName
import com.example.model.StoryItem
import com.example.screens.AbcLearnScreen
import com.example.screens.AbcPlayScreen
import com.example.screens.ColorsFindScreen
import com.example.screens.ColorsLearnScreen
import com.example.screens.HindiLearnScreen
import com.example.screens.HindiPlayScreen
import com.example.screens.HomeScreen
import com.example.screens.LearnHubScreen
import com.example.screens.MemoryMatchScreen
import com.example.screens.NumLearnScreen
import com.example.screens.NumPlayScreen
import com.example.screens.OnboardingScreen
import com.example.screens.PaintScreen
import com.example.screens.ParentGateScreen
import com.example.screens.ParentZoneScreen
import com.example.screens.PlayHubScreen
import com.example.screens.PracticeHubScreen
import com.example.screens.RewardsScreen
import com.example.screens.RhymePlayerScreen
import com.example.screens.RhymesListScreen
import com.example.screens.SettingsScreen
import com.example.screens.ShapeSorterScreen
import com.example.screens.ShapesFindScreen
import com.example.screens.ShapesLearnScreen
import com.example.screens.SplashScreen
import com.example.screens.StoriesListScreen
import com.example.screens.StoryPlayerScreen
import com.example.screens.StoryRhymeHubScreen
import com.example.screens.TopicButtonItem
import com.example.screens.TopicMenuScreen
import com.example.screens.TracingScreen
import com.example.screens.sampleRhymes
import com.example.screens.sampleStories
import com.example.ui.theme.Pastels
import com.example.ui.theme.Primary
import com.example.ui.theme.Secondary
import com.example.ui.theme.Success
import com.example.ui.theme.TwinkleTotsTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)

        setContent {
            TwinkleTotsTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    TwinkleTotsApp()
                }
            }
        }
    }
}

@Composable
fun TwinkleTotsApp() {
    val context = androidx.compose.ui.platform.LocalContext.current
    val storageManager = remember { StorageManager(context) }
    val soundManager = remember { SoundManager(context) }

    val hasSeenOnboarding = remember { storageManager.hasSeenOnboarding() }
    var currentScreen by remember { mutableStateOf(if (hasSeenOnboarding) ScreenName.SPLASH else ScreenName.ONBOARDING) }
    var progress by remember { mutableStateOf(storageManager.loadProgress()) }
    var settings by remember { mutableStateOf(storageManager.loadSettings()) }

    var activeRhyme by remember { mutableStateOf(sampleRhymes[0]) }
    var activeStory by remember { mutableStateOf(sampleStories[0]) }
    var storyLang by remember { mutableStateOf("en") }

    soundManager.settings = settings

    DisposableEffect(Unit) {
        onDispose { soundManager.release() }
    }

    val addStars = { count: Int ->
        val updated = progress.copy(totalStars = progress.totalStars + count)
        progress = updated
        storageManager.saveProgress(updated)
    }

    val recordRoundScore = { topic: String, score: Int ->
        val updated = if (topic == "abc") {
            if (score > progress.bestAbcRound) progress.copy(bestAbcRound = score) else progress
        } else {
            if (score > progress.bestNumRound) progress.copy(bestNumRound = score) else progress
        }
        progress = updated
        storageManager.saveProgress(updated)
    }

    val markCardSeen = { cardId: String ->
        if (!progress.seenCards.contains(cardId)) {
            val updated = progress.copy(seenCards = progress.seenCards + cardId)
            progress = updated
            storageManager.saveProgress(updated)
        }
    }

    val markLetterTraced = { letterId: String ->
        if (!progress.tracedLetters.contains(letterId)) {
            val updated = progress.copy(tracedLetters = progress.tracedLetters + letterId, totalStars = progress.totalStars + 1)
            progress = updated
            storageManager.saveProgress(updated)
        }
    }

    val resetAll = {
        storageManager.resetProgress()
        progress = AppProgress()
    }

    val toggleSetting = { key: String ->
        val updated = when (key) {
            "soundEffects" -> settings.copy(soundEffects = !settings.soundEffects)
            "voice" -> settings.copy(voice = !settings.voice)
            else -> settings
        }
        settings = updated
        storageManager.saveSettings(updated)
        soundManager.settings = updated
    }

    // Android System Back Navigation Handler - Preserving exact hierarchy
    BackHandler(enabled = currentScreen != ScreenName.HOME && currentScreen != ScreenName.SPLASH && currentScreen != ScreenName.ONBOARDING) {
        currentScreen = when (currentScreen) {
            ScreenName.ABC_LEARN, ScreenName.ABC_PLAY, ScreenName.ABC_TRACE, ScreenName.ABC_MATCH -> ScreenName.ABC_MENU
            ScreenName.ABC_MENU -> ScreenName.LEARN_HUB
            ScreenName.NUM_LEARN, ScreenName.NUM_PLAY, ScreenName.NUM_TRACE, ScreenName.NUM_MATCH -> ScreenName.NUM_MENU
            ScreenName.NUM_MENU -> ScreenName.LEARN_HUB
            ScreenName.HINDI_LEARN, ScreenName.HINDI_PLAY, ScreenName.HINDI_TRACE, ScreenName.HINDI_MATCH -> ScreenName.HINDI_MENU
            ScreenName.HINDI_MENU -> ScreenName.LEARN_HUB
            ScreenName.SHAPES_LEARN, ScreenName.SHAPES_FIND, ScreenName.SHAPE_SORTER, ScreenName.SHAPE_MATCH -> ScreenName.SHAPES_MENU
            ScreenName.SHAPES_MENU -> ScreenName.LEARN_HUB
            ScreenName.COLORS_LEARN, ScreenName.COLORS_FIND, ScreenName.PAINT, ScreenName.COLOR_MATCH -> ScreenName.COLORS_MENU
            ScreenName.COLORS_MENU -> ScreenName.LEARN_HUB
            ScreenName.RHYME_PLAYER -> ScreenName.RHYMES_LIST
            ScreenName.RHYMES_LIST -> ScreenName.STORY_RHYME_HUB
            ScreenName.STORY_PLAYER -> ScreenName.STORIES_LIST
            ScreenName.STORIES_LIST -> ScreenName.STORY_RHYME_HUB
            ScreenName.LEARN_HUB, ScreenName.PLAY_HUB, ScreenName.PRACTICE_HUB, ScreenName.STORY_RHYME_HUB, ScreenName.REWARDS_SCREEN -> ScreenName.HOME
            ScreenName.PARENT_ZONE, ScreenName.SETTINGS, ScreenName.PARENT_GATE -> ScreenName.HOME
            else -> ScreenName.HOME
        }
    }

    when (currentScreen) {
        ScreenName.SPLASH -> {
            SplashScreen(onDone = { currentScreen = ScreenName.HOME })
        }
        ScreenName.ONBOARDING -> {
            OnboardingScreen(
                soundManager = soundManager,
                onComplete = {
                    storageManager.setSeenOnboarding(true)
                    currentScreen = ScreenName.HOME
                }
            )
        }
        ScreenName.HOME -> {
            HomeScreen(
                stars = progress.totalStars,
                soundManager = soundManager,
                onNavigate = { screen -> currentScreen = screen }
            )
        }

        // --- PRIMARY DESTINATION HUBS ---
        ScreenName.LEARN_HUB -> {
            LearnHubScreen(
                soundManager = soundManager,
                onBack = { currentScreen = ScreenName.HOME },
                onNavigate = { currentScreen = it }
            )
        }
        ScreenName.PLAY_HUB -> {
            PlayHubScreen(
                soundManager = soundManager,
                onBack = { currentScreen = ScreenName.HOME },
                onNavigate = { currentScreen = it }
            )
        }
        ScreenName.PRACTICE_HUB -> {
            PracticeHubScreen(
                soundManager = soundManager,
                onBack = { currentScreen = ScreenName.HOME },
                onNavigate = { currentScreen = it }
            )
        }
        ScreenName.STORY_RHYME_HUB -> {
            StoryRhymeHubScreen(
                soundManager = soundManager,
                onBack = { currentScreen = ScreenName.HOME },
                onNavigate = { currentScreen = it }
            )
        }
        ScreenName.REWARDS_SCREEN -> {
            RewardsScreen(
                progress = progress,
                soundManager = soundManager,
                onBack = { currentScreen = ScreenName.HOME }
            )
        }

        // --- TOPIC MENUS (Structured inside LEARN HUB) ---
        ScreenName.ABC_MENU -> {
            TopicMenuScreen(
                title = "ABC Adventure",
                titleIcon = "🐣",
                bgColors = listOf(Color(0xFFFF8A65), Color(0xFFFFD54F)),
                buttons = listOf(
                    TopicButtonItem("Learn", "📖", Primary, ScreenName.ABC_LEARN, "Learn ABC"),
                    TopicButtonItem("Play", "🎮", Success, ScreenName.ABC_PLAY, "Play ABC"),
                    TopicButtonItem("Trace", "✏️", Color(0xFF8E24AA), ScreenName.ABC_TRACE, "Trace Letter"),
                    TopicButtonItem("Match", "🧩", Color(0xFFFF7043), ScreenName.ABC_MATCH, "Match Letters")
                ),
                soundManager = soundManager,
                onBack = { currentScreen = ScreenName.LEARN_HUB },
                onNavigate = { currentScreen = it }
            )
        }
        ScreenName.NUM_MENU -> {
            TopicMenuScreen(
                title = "123 Garden",
                titleIcon = "🔢",
                bgColors = listOf(Color(0xFF29B6F6), Color(0xFF81C784)),
                buttons = listOf(
                    TopicButtonItem("Learn", "📖", Secondary, ScreenName.NUM_LEARN, "Learn Numbers"),
                    TopicButtonItem("Play", "🎮", Success, ScreenName.NUM_PLAY, "Play Numbers"),
                    TopicButtonItem("Trace", "✏️", Color(0xFF8E24AA), ScreenName.NUM_TRACE, "Trace Numbers"),
                    TopicButtonItem("Match", "🧩", Color(0xFFFF7043), ScreenName.NUM_MATCH, "Match Numbers")
                ),
                soundManager = soundManager,
                onBack = { currentScreen = ScreenName.LEARN_HUB },
                onNavigate = { currentScreen = it }
            )
        }
        ScreenName.HINDI_MENU -> {
            TopicMenuScreen(
                title = "अ आ World",
                titleIcon = "🦚",
                bgColors = listOf(Color(0xFFFF7043), Color(0xFFFFCA28)),
                buttons = listOf(
                    TopicButtonItem("Learn", "📖", Color(0xFFFF7043), ScreenName.HINDI_LEARN, "वर्णमाला सीखो"),
                    TopicButtonItem("Play", "🎮", Success, ScreenName.HINDI_PLAY, "वर्णमाला खेलो"),
                    TopicButtonItem("Trace", "✏️", Color(0xFF8E24AA), ScreenName.HINDI_TRACE, "अक्षर लिखो"),
                    TopicButtonItem("Match", "🧩", Color(0xFF26A69A), ScreenName.HINDI_MATCH, "वर्णमाला मिलाओ")
                ),
                soundManager = soundManager,
                onBack = { currentScreen = ScreenName.LEARN_HUB },
                onNavigate = { currentScreen = it }
            )
        }
        ScreenName.SHAPES_MENU -> {
            TopicMenuScreen(
                title = "Shape Planet",
                titleIcon = "🔺",
                bgColors = listOf(Color(0xFFAB47BC), Color(0xFF4DD0E1)),
                buttons = listOf(
                    TopicButtonItem("Learn", "📖", Color(0xFFAB47BC), ScreenName.SHAPES_LEARN, "Learn Shapes"),
                    TopicButtonItem("Find", "🔍", Secondary, ScreenName.SHAPES_FIND, "Find Shape"),
                    TopicButtonItem("Sorter", "🧩", Success, ScreenName.SHAPE_SORTER, "Shape Sorter"),
                    TopicButtonItem("Match", "🃏", Color(0xFFFF7043), ScreenName.SHAPE_MATCH, "Match Shapes")
                ),
                soundManager = soundManager,
                onBack = { currentScreen = ScreenName.LEARN_HUB },
                onNavigate = { currentScreen = it }
            )
        }
        ScreenName.COLORS_MENU -> {
            TopicMenuScreen(
                title = "Color Garden",
                titleIcon = "🎨",
                bgColors = listOf(Color(0xFFEC407A), Color(0xFFFFB74D)),
                buttons = listOf(
                    TopicButtonItem("Learn", "📖", Color(0xFF26A69A), ScreenName.COLORS_LEARN, "Learn Colors"),
                    TopicButtonItem("Find", "🔍", Primary, ScreenName.COLORS_FIND, "Find Color"),
                    TopicButtonItem("Paint", "🖌️", Color(0xFFEC407A), ScreenName.PAINT, "Paint and Draw"),
                    TopicButtonItem("Match", "🧩", Color(0xFFFF7043), ScreenName.COLOR_MATCH, "Match Colors")
                ),
                soundManager = soundManager,
                onBack = { currentScreen = ScreenName.LEARN_HUB },
                onNavigate = { currentScreen = it }
            )
        }

        // --- ABC SCREENS ---
        ScreenName.ABC_LEARN -> AbcLearnScreen(soundManager, { currentScreen = ScreenName.ABC_MENU }, markCardSeen)
        ScreenName.ABC_PLAY -> AbcPlayScreen(soundManager, { currentScreen = ScreenName.ABC_MENU }, { currentScreen = ScreenName.HOME }, addStars, recordRoundScore)
        ScreenName.ABC_TRACE -> TracingScreen("Trace Letter", englishTracingItems, progress.tracedLetters, soundManager, { currentScreen = ScreenName.ABC_MENU }, markLetterTraced)
        ScreenName.ABC_MATCH -> MemoryMatchScreen("ABC Match", alphabetData.take(6).map { it.upper to it.emoji }, soundManager, { currentScreen = ScreenName.ABC_MENU }, { addStars(1) })

        // --- 123 SCREENS ---
        ScreenName.NUM_LEARN -> NumLearnScreen(soundManager, { currentScreen = ScreenName.NUM_MENU }, markCardSeen)
        ScreenName.NUM_PLAY -> NumPlayScreen(soundManager, { currentScreen = ScreenName.NUM_MENU }, { currentScreen = ScreenName.HOME }, addStars, recordRoundScore)
        ScreenName.NUM_TRACE -> TracingScreen("Trace Number", numbersTracingItems, progress.tracedLetters, soundManager, { currentScreen = ScreenName.NUM_MENU }, markLetterTraced)
        ScreenName.NUM_MATCH -> MemoryMatchScreen("123 Match", numbersData.take(6).map { it.numeral to it.emoji }, soundManager, { currentScreen = ScreenName.NUM_MENU }, { addStars(1) })

        // --- HINDI SCREENS ---
        ScreenName.HINDI_LEARN -> HindiLearnScreen(soundManager, { currentScreen = ScreenName.HINDI_MENU }, markCardSeen)
        ScreenName.HINDI_PLAY -> HindiPlayScreen(soundManager, { currentScreen = ScreenName.HINDI_MENU }, { currentScreen = ScreenName.HOME }, addStars, recordRoundScore)
        ScreenName.HINDI_TRACE -> TracingScreen("अक्षर लिखो", hindiTracingItems, progress.tracedLetters, soundManager, { currentScreen = ScreenName.HINDI_MENU }, markLetterTraced)
        ScreenName.HINDI_MATCH -> MemoryMatchScreen("वर्णमाला Match", hindiData.take(6).map { it.letter to it.emoji }, soundManager, { currentScreen = ScreenName.HINDI_MENU }, { addStars(1) })

        // --- SHAPES SCREENS ---
        ScreenName.SHAPES_LEARN -> ShapesLearnScreen(soundManager, { currentScreen = ScreenName.SHAPES_MENU }, markCardSeen)
        ScreenName.SHAPES_FIND -> ShapesFindScreen(soundManager, { currentScreen = ScreenName.SHAPES_MENU }, { currentScreen = ScreenName.HOME }, addStars, recordRoundScore)
        ScreenName.SHAPE_SORTER -> ShapeSorterScreen(soundManager, { currentScreen = ScreenName.SHAPES_MENU }, { currentScreen = ScreenName.HOME }, addStars)
        ScreenName.SHAPE_MATCH -> MemoryMatchScreen("Shape Match", shapesData.take(6).map { it.nameEn to it.realWorld[0].emoji }, soundManager, { currentScreen = ScreenName.SHAPES_MENU }, { addStars(1) })

        // --- COLORS SCREENS ---
        ScreenName.COLORS_LEARN -> ColorsLearnScreen(soundManager, { currentScreen = ScreenName.COLORS_MENU }, markCardSeen)
        ScreenName.COLORS_FIND -> ColorsFindScreen(soundManager, { currentScreen = ScreenName.COLORS_MENU }, { currentScreen = ScreenName.HOME }, addStars, recordRoundScore)
        ScreenName.PAINT -> PaintScreen(soundManager, { currentScreen = ScreenName.COLORS_MENU }, addStars)
        ScreenName.COLOR_MATCH -> MemoryMatchScreen("Color Match", colorsData.take(6).map { it.nameEn to it.objects[0].emoji }, soundManager, { currentScreen = ScreenName.COLORS_MENU }, { addStars(1) })

        // --- RHYMES ---
        ScreenName.RHYMES_LIST -> {
            RhymesListScreen(
                soundManager = soundManager,
                onBack = { currentScreen = ScreenName.STORY_RHYME_HUB },
                onSelectRhyme = {
                    activeRhyme = it
                    currentScreen = ScreenName.RHYME_PLAYER
                }
            )
        }
        ScreenName.RHYME_PLAYER -> {
            RhymePlayerScreen(
                rhyme = activeRhyme,
                soundManager = soundManager,
                onBack = { currentScreen = ScreenName.RHYMES_LIST },
                onComplete = { addStars(1) }
            )
        }

        // --- STORIES ---
        ScreenName.STORIES_LIST -> {
            StoriesListScreen(
                soundManager = soundManager,
                onBack = { currentScreen = ScreenName.STORY_RHYME_HUB },
                onSelectStory = { story, lang ->
                    activeStory = story
                    storyLang = lang
                    currentScreen = ScreenName.STORY_PLAYER
                }
            )
        }
        ScreenName.STORY_PLAYER -> {
            StoryPlayerScreen(
                story = activeStory,
                lang = storyLang,
                soundManager = soundManager,
                onBack = { currentScreen = ScreenName.STORIES_LIST },
                onComplete = { addStars(1) }
            )
        }

        // --- PARENT GATE & PARENT ZONE ---
        ScreenName.PARENT_GATE -> {
            ParentGateScreen(
                soundManager = soundManager,
                onBack = { currentScreen = ScreenName.HOME },
                onPass = { currentScreen = ScreenName.PARENT_ZONE }
            )
        }
        ScreenName.PARENT_ZONE -> {
            ParentZoneScreen(
                soundManager = soundManager,
                settings = settings,
                progress = progress,
                onToggle = toggleSetting,
                onResetStars = resetAll,
                onBack = { currentScreen = ScreenName.HOME }
            )
        }
        ScreenName.SETTINGS -> {
            SettingsScreen(
                soundManager = soundManager,
                settings = settings,
                onToggle = toggleSetting,
                onResetStars = resetAll,
                onBack = { currentScreen = ScreenName.PARENT_ZONE }
            )
        }
        else -> {
            HomeScreen(
                stars = progress.totalStars,
                soundManager = soundManager,
                onNavigate = { screen -> currentScreen = screen }
            )
        }
    }
}
