package com.example.ui.theme

import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color

// Core Neutral Tokens
val White = Color(0xFFFFFFFF)
val WarmWhite = Color(0xFFFFFDF8)
val WarmSand = Color(0xFFFDFBF7)
val Ink = Color(0xFF1E293B)          // Deep Navy Slate for readable, crisp contrast
val InkLight = Color(0xFF64748B)     // Friendly Muted Slate
val InkSubtle = Color(0xFF94A3B8)    // Soft hint text

// Brand Identity - Twinkle Tots
val Primary = Color(0xFFFF8C42)       // Playful Warm Tangerine
val PrimaryDark = Color(0xFFE8762E)
val PrimaryLight = Color(0xFFFFB088)
val Secondary = Color(0xFF38B6FF)     // Sparkling Sky Blue
val SecondaryDark = Color(0xFF0288D1)

// Feedback & Rewards
val Success = Color(0xFF10B981)       // Cheerful Emerald Green
val SuccessLight = Color(0xFFA7F3D0)
val ErrorColor = Color(0xFFF43F5E)    // Gentle Rose Pink (encouraging, never harsh)
val ErrorLight = Color(0xFFFECDD3)
val StarYellow = Color(0xFFFFC107)    // Glowing Warm Amber Gold
val StarDark = Color(0xFFFFA000)
val StarGaze = Color(0xFFFFF9C4)

// Category Distinct Accents
val CategoryAbc = Color(0xFFFF7043)       // Coral Orange - Alphabet Adventure
val CategoryAbcBg = Color(0xFFFFE0B2)     // Rich warm apricot
val Category123 = Color(0xFF0288D1)       // Sky Blue - Number Garden
val Category123Bg = Color(0xFFB3E5FC)     // Rich sparkling sky
val CategoryHindi = Color(0xFFFF5722)     // Saffron Sunrise - वर्णमाला World
val CategoryHindiBg = Color(0xFFFFCCBC)   // Warm saffron peach
val CategoryShapes = Color(0xFF8E24AA)    // Amethyst Purple - Shape Planet
val CategoryShapesBg = Color(0xFFE1BEE7)  // Soft orchid violet
val CategoryColors = Color(0xFF00897B)    // Mint Teal - Color Garden
val CategoryColorsBg = Color(0xFFB2DFDB)  // Refreshing mint aqua

// Appealing & Attractive Storybook Pastels (Vibrant, high-delight preschool hues)
val Pastels = listOf(
    Color(0xFFFFCC80), // 0: Warm Sunny Peach / Creamsicle
    Color(0xFF80D8FF), // 1: Radiant Sky Azure
    Color(0xFFEA80FC), // 2: Candy Orchid Violet
    Color(0xFFA7FFEB), // 3: Refreshing Aqua Mint
    Color(0xFFFFE57F), // 4: Glowing Sunshine Gold
    Color(0xFFFF80AB)  // 5: Playful Strawberry Blossom
)

val PastelBorders = listOf(
    Color(0xFFFF9800),
    Color(0xFF00B0FF),
    Color(0xFFAA00FF),
    Color(0xFF00BFA5),
    Color(0xFFFFC400),
    Color(0xFFF50057)
)

// Gradients for Magical Learning Worlds
val HomeBackgroundGradient = Brush.verticalGradient(
    colors = listOf(
        Color(0xFF4BA3E3), // Sunny Cerulean Sky
        Color(0xFF6ED4C8), // Soft Turquoise Lagoon
        Color(0xFFFFD54F), // Radiant Sunlight
        Color(0xFFFFAB91)  // Warm Peach Glow
    )
)

val LearnHubGradient = Brush.verticalGradient(
    colors = listOf(
        Color(0xFF4FC3F7), // Luminous Sky Blue
        Color(0xFF81D4FA), // Clear Aqua
        Color(0xFFA5D6A7), // Lush Spring Mint
        Color(0xFFFFE082)  // Golden Sunshine
    )
)

val PlayHubGradient = Brush.verticalGradient(
    colors = listOf(
        Color(0xFFBA68C8), // Playful Amethyst Violet
        Color(0xFF4DD0E1), // Electric Cyan Lagoon
        Color(0xFFFFD54F)  // Warm Honey Gold
    )
)

val PracticeHubGradient = Brush.verticalGradient(
    colors = listOf(
        Color(0xFF26A69A), // Rich Emerald Mint
        Color(0xFF80CBC4), // Refreshing Aqua Lagoon
        Color(0xFFFFF176)  // Sunny Lemon Lime
    )
)

val StoryRhymeHubGradient = Brush.verticalGradient(
    colors = listOf(
        Color(0xFF5C6BC0), // Twilight Periwinkle
        Color(0xFFAB47BC), // Enchanted Storybook Violet
        Color(0xFFFFAB91)  // Sunset Peach
    )
)

val RewardsGradient = Brush.verticalGradient(
    colors = listOf(
        Color(0xFFFFD54F), // Sparkling Trophy Gold
        Color(0xFFFFB74D), // Sunny Amber
        Color(0xFFFF8A65)  // Cheerful Coral
    )
)

val ParentGateGradient = Brush.verticalGradient(
    colors = listOf(
        Color(0xFF80D8FF), // Cheerful Sky
        Color(0xFFCE93D8)  // Friendly Lavender
    )
)

val SplashGradient = Brush.linearGradient(
    colors = listOf(
        Color(0xFF38B6FF), // Azure Sky
        Color(0xFFBA68C8), // Vibrant Violet
        Color(0xFFFF8C42)  // Warm Tangerine
    )
)

val OnboardingGradient = Brush.verticalGradient(
    colors = listOf(
        Color(0xFF4BA3E3), // Radiant Sky
        Color(0xFFFFD54F), // Warm Sunshine
        Color(0xFFFF8A65)  // Coral Sunrise
    )
)

val SkyPlaygroundGradient = HomeBackgroundGradient

val CardGlowGradient = Brush.verticalGradient(
    colors = listOf(
        Color.White.copy(alpha = 0.95f),
        Color.White.copy(alpha = 0.85f)
    )
)

val StarCapsuleGradient = Brush.horizontalGradient(
    colors = listOf(
        Color(0xFFFFF8E1),
        Color(0xFFFFECB3),
        Color(0xFFFFF8E1)
    )
)
