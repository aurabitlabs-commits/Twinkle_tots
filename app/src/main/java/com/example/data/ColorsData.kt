package com.example.data

import com.example.model.ColorEntry
import com.example.model.RealWorldItem

val colorsData = listOf(
    ColorEntry("red", "Red", "लाल", 0xFFE53935, listOf(RealWorldItem("Apple", "🍎"), RealWorldItem("Tomato", "🍅"))),
    ColorEntry("blue", "Blue", "नीला", 0xFF1E88E5, listOf(RealWorldItem("Ocean", "🌊"), RealWorldItem("Blueberry", "🫐"))),
    ColorEntry("yellow", "Yellow", "पीला", 0xFFFDD835, listOf(RealWorldItem("Sun", "☀️"), RealWorldItem("Banana", "🍌"))),
    ColorEntry("green", "Green", "हरा", 0xFF43A047, listOf(RealWorldItem("Leaf", "🍃"), RealWorldItem("Frog", "🐸"))),
    ColorEntry("orange", "Orange", "नारंगी", 0xFFFB8C00, listOf(RealWorldItem("Orange", "🍊"), RealWorldItem("Carrot", "🥕"))),
    ColorEntry("purple", "Purple", "बैंगनी", 0xFF8E24AA, listOf(RealWorldItem("Grapes", "🍇"), RealWorldItem("Eggplant", "🍆"))),
    ColorEntry("pink", "Pink", "गुलाबी", 0xFFF06292, listOf(RealWorldItem("Flamingo", "🦩"), RealWorldItem("Flower", "🌸"))),
    ColorEntry("brown", "Brown", "भूरा", 0xFF6D4C41, listOf(RealWorldItem("Bear", "🐻"), RealWorldItem("Chocolate", "🍫"))),
    ColorEntry("black", "Black", "काला", 0xFF212121, listOf(RealWorldItem("Crow", "🦅"), RealWorldItem("Tire", "🛞"))),
    ColorEntry("white", "White", "सफेद", 0xFFFAFAFA, listOf(RealWorldItem("Milk", "🥛"), RealWorldItem("Cloud", "☁️")))
)
