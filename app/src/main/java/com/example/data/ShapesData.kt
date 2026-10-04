package com.example.data

import com.example.model.RealWorldItem
import com.example.model.ShapeEntry

val shapesData = listOf(
    ShapeEntry("circle", "Circle", "गोला", listOf(RealWorldItem("Ball", "⚽"), RealWorldItem("Clock", "⏰"))),
    ShapeEntry("square", "Square", "वर्ग", listOf(RealWorldItem("Gift", "🎁"), RealWorldItem("Window", "🪟"))),
    ShapeEntry("triangle", "Triangle", "त्रिकोण", listOf(RealWorldItem("Pizza", "🍕"), RealWorldItem("Tent", "⛺"))),
    ShapeEntry("rectangle", "Rectangle", "आयत", listOf(RealWorldItem("Door", "🚪"), RealWorldItem("Book", "📖"))),
    ShapeEntry("oval", "Oval", "अंडाकार", listOf(RealWorldItem("Egg", "🥚"), RealWorldItem("Mirror", "🪞"))),
    ShapeEntry("star", "Star", "तारा", listOf(RealWorldItem("Starfish", "🌟"), RealWorldItem("Wand", "🪄"))),
    ShapeEntry("heart", "Heart", "दिल", listOf(RealWorldItem("Heart Card", "💖"), RealWorldItem("Strawberry", "🍓"))),
    ShapeEntry("diamond", "Diamond", "समचतुर्भुज", listOf(RealWorldItem("Kite", "🪁"), RealWorldItem("Sign", "💠")))
)
