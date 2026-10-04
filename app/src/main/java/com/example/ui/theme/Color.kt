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
val CategoryAbcBg = Color(0xFFFFF3E0)
val Category123 = Color(0xFF0288D1)       // Sky Blue - Number Garden
val Category123Bg = Color(0xFFE1F5FE)
val CategoryHindi = Color(0xFFFF5722)     // Saffron Sunrise - वर्णमाला World
val CategoryHindiBg = Color(0xFFFBE9E7)
val CategoryShapes = Color(0xFF8E24AA)    // Amethyst Purple - Shape Planet
val CategoryShapesBg = Color(0xFFF3E5F5)
val CategoryColors = Color(0xFF00897B)    // Mint Teal - Color Garden
val CategoryColorsBg = Color(0xFFE0F2F1)

// Premium Storybook Pastels
val Pastels = listOf(
    Color(0xFFFFF3E0), // Soft warm peach
    Color(0xFFE3F2FD), // Soft sky blue
    Color(0xFFF3E5F5), // Soft lavender dream
    Color(0xFFE8F5E9), // Gentle mint
    Color(0xFFFFF9C4), // Sunshine cream
    Color(0xFFFCE4EC)  // Rosy cloud
)

val PastelBorders = listOf(
    Color(0xFFFFCC80),
    Color(0xFF90CAF9),
    Color(0xFFCE93D8),
    Color(0xFFA5D6A7),
    Color(0xFFFFF59D),
    Color(0xFFF48FB1)
)

// Gradients for Magical Learning Worlds
val SkyPlaygroundGradient = Brush.verticalGradient(
    colors = listOf(
        Color(0xFFE0F7FA), // Soft cyan sky
        Color(0xFFFFF9C4), // Warm sunlight
        Color(0xFFFFF3E0)  // Peach horizon
    )
)

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
