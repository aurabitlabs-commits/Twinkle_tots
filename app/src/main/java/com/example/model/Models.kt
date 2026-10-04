package com.example.model

enum class ScreenName {
    SPLASH,
    ONBOARDING,
    HOME,
    LEARN_HUB,
    PLAY_HUB,
    PRACTICE_HUB,
    STORY_RHYME_HUB,
    REWARDS_SCREEN,
    PARENT_ZONE,
    PROFILE_SETUP,
    WRITING_ACADEMY,
    GAME_ZONE,
    BADGES,
    PHONICS_HOME,
    LETTER_SOUNDS,
    BEGINNING_SOUND,
    SOUND_BLENDING,
    SPELLING,
    WORD_FAMILIES,
    PHONICS_GAMES,
    DAYS_MONTHS_MENU,
    DAYS_LEARN,
    MONTHS_LEARN,
    CALENDAR,
    DAYS_MONTHS_PLAY,
    ABC_MENU,
    ABC_LEARN,
    ABC_PLAY,
    ABC_TRACE,
    ABC_MATCH,
    NUM_MENU,
    NUM_LEARN,
    NUM_PLAY,
    NUM_TRACE,
    NUM_MATCH,
    BEFORE_AFTER_BETWEEN,
    NUMBER_SPELLING,
    HINDI_MENU,
    HINDI_LEARN,
    HINDI_PLAY,
    HINDI_TRACE,
    HINDI_MATCH,
    SHAPES_MENU,
    SHAPES_LEARN,
    SHAPES_FIND,
    SHAPE_SORTER,
    SHAPE_MATCH,
    COLORS_MENU,
    COLORS_LEARN,
    COLORS_FIND,
    PAINT,
    COLOR_MATCH,
    RHYMES_LIST,
    RHYME_PLAYER,
    STORIES_LIST,
    STORY_PLAYER,
    PARENT_PROGRESS,
    PLUS_PACKS,
    BODY_ACTIVITY,
    HINDI_GINTI,
    PARENT_GATE,
    SETTINGS
}

data class DayItem(
    val id: String,
    val index: Int,
    val en: String,
    val hi: String,
    val color: String
)

data class MonthItem(
    val id: String,
    val index: Int,
    val en: String,
    val hi: String,
    val season: String,
    val cueEmoji: String,
    val cueName: String,
    val daysCount: Int
)

data class ChildProfile(
    val name: String = "Little Star",
    val ageGroup: String = "3-4",
    val avatar: String = "⭐",
    val preferredLanguage: String = "both",
    val isSetupCompleted: Boolean = false,
    val earnedBadges: List<String> = listOf("first_star")
)

data class PhonicsEntry(
    val id: String,
    val upper: String,
    val lower: String,
    val name: String,
    val phoneme: String,
    val soundSpoken: String,
    val example: String,
    val emoji: String,
    val taraPhrase: String
)

data class CvcWord(
    val word: String,
    val letters: List<String>,
    val phonemes: List<String>,
    val emoji: String,
    val family: String
)

data class AlphabetEntry(
    val id: String,
    val upper: String,
    val lower: String,
    val word: String,
    val emoji: String,
    val audioPhrase: String,
    val audioLetter: String
)

data class NumberEntry(
    val id: Int,
    val numeral: String,
    val word: String,
    val emoji: String,
    val audioNumber: String
)

data class HindiEntry(
    val id: String,
    val group: String,
    val subgroup: String,
    val letter: String,
    val word: String,
    val emoji: String,
    val audioLetter: String,
    val audioPhrase: String,
    val noPicture: Boolean = false
)

data class RealWorldItem(
    val name: String,
    val emoji: String
)

data class ShapeEntry(
    val id: String,
    val nameEn: String,
    val nameHi: String,
    val realWorld: List<RealWorldItem>
)

data class ColorEntry(
    val id: String,
    val nameEn: String,
    val nameHi: String,
    val hexColor: Long,
    val objects: List<RealWorldItem>
)

data class TracingItem(
    val id: String,
    val label: String,
    val strokes: List<List<Pair<Float, Float>>>
)

data class RhymeItem(
    val id: String,
    val lang: String,
    val title: String,
    val thumbnail: String,
    val lines: List<String>
)

data class StoryItem(
    val id: String,
    val titleEn: String,
    val titleHi: String,
    val coverEmoji: String,
    val pages: List<Pair<String, String>>
)

data class QuizQuestion(
    val correctId: String,
    val options: List<String>
)

data class NumPlayQuestion(
    val correctId: String,
    val options: List<String>,
    val count: Int,
    val emoji: String
)

data class AppSettings(
    val soundEffects: Boolean = true,
    val voice: Boolean = true,
    val voiceLang: String = "both",
    val playTimeLimit: Int = 0,
    val weekStart: String = "sun"
)

data class AppProgress(
    val totalStars: Int = 0,
    val bestAbcRound: Int = 0,
    val bestNumRound: Int = 0,
    val seenCards: Set<String> = emptySet(),
    val starsByTopic: Map<String, Int> = emptyMap(),
    val tracedLetters: Set<String> = emptySet(),
    val plusUnlocked: Boolean = false
)
