package com.example.data

import com.example.model.TracingItem

val englishTracingItems = listOf(
    TracingItem("A", "A", listOf(listOf(50f to 15f, 20f to 85f), listOf(50f to 15f, 80f to 85f), listOf(32f to 60f, 68f to 60f))),
    TracingItem("B", "B", listOf(listOf(25f to 15f, 25f to 85f), listOf(25f to 15f, 60f to 15f, 72f to 32f, 60f to 50f, 25f to 50f), listOf(25f to 50f, 65f to 50f, 78f to 68f, 65f to 85f, 25f to 85f))),
    TracingItem("C", "C", listOf(listOf(80f to 25f, 50f to 15f, 25f to 50f, 50f to 85f, 80f to 75f))),
    TracingItem("D", "D", listOf(listOf(25f to 15f, 25f to 85f), listOf(25f to 15f, 60f to 15f, 80f to 50f, 60f to 85f, 25f to 85f))),
    TracingItem("E", "E", listOf(listOf(25f to 15f, 25f to 85f), listOf(25f to 15f, 80f to 15f), listOf(25f to 50f, 70f to 50f), listOf(25f to 85f, 80f to 85f))),
    TracingItem("F", "F", listOf(listOf(25f to 15f, 25f to 85f), listOf(25f to 15f, 80f to 15f), listOf(25f to 50f, 68f to 50f))),
    TracingItem("G", "G", listOf(listOf(80f to 25f, 50f to 15f, 22f to 50f, 50f to 85f, 78f to 85f, 78f to 55f, 55f to 55f))),
    TracingItem("H", "H", listOf(listOf(25f to 15f, 25f to 85f), listOf(75f to 15f, 75f to 85f), listOf(25f to 50f, 75f to 50f))),
    TracingItem("I", "I", listOf(listOf(30f to 15f, 70f to 15f), listOf(50f to 15f, 50f to 85f), listOf(30f to 85f, 70f to 85f))),
    TracingItem("J", "J", listOf(listOf(30f to 15f, 75f to 15f), listOf(58f to 15f, 58f to 70f, 45f to 85f, 25f to 75f))),
    TracingItem("K", "K", listOf(listOf(25f to 15f, 25f to 85f), listOf(75f to 18f, 28f to 52f), listOf(38f to 48f, 78f to 85f))),
    TracingItem("L", "L", listOf(listOf(30f to 15f, 30f to 85f), listOf(30f to 85f, 80f to 85f))),
    TracingItem("M", "M", listOf(listOf(20f to 85f, 20f to 15f), listOf(20f to 15f, 50f to 60f), listOf(50f to 60f, 80f to 15f), listOf(80f to 15f, 80f to 85f))),
    TracingItem("N", "N", listOf(listOf(25f to 85f, 25f to 15f), listOf(25f to 15f, 75f to 85f), listOf(75f to 85f, 75f to 15f))),
    TracingItem("O", "O", listOf(listOf(50f to 15f, 20f to 50f, 50f to 85f, 80f to 50f, 50f to 15f))),
    TracingItem("P", "P", listOf(listOf(25f to 15f, 25f to 85f), listOf(25f to 15f, 62f to 15f, 75f to 33f, 62f to 52f, 25f to 52f))),
    TracingItem("Q", "Q", listOf(listOf(50f to 15f, 20f to 50f, 50f to 85f, 80f to 50f, 50f to 15f), listOf(58f to 65f, 82f to 88f))),
    TracingItem("R", "R", listOf(listOf(25f to 15f, 25f to 85f), listOf(25f to 15f, 62f to 15f, 75f to 33f, 62f to 52f, 25f to 52f), listOf(52f to 52f, 78f to 85f))),
    TracingItem("S", "S", listOf(listOf(75f to 25f, 50f to 15f, 25f to 32f, 50f to 50f, 75f to 68f, 50f to 85f, 25f to 75f))),
    TracingItem("T", "T", listOf(listOf(20f to 15f, 80f to 15f), listOf(50f to 15f, 50f to 85f))),
    TracingItem("U", "U", listOf(listOf(25f to 15f, 25f to 68f, 50f to 85f, 75f to 68f, 75f to 15f))),
    TracingItem("V", "V", listOf(listOf(20f to 15f, 50f to 85f), listOf(50f to 85f, 80f to 15f))),
    TracingItem("W", "W", listOf(listOf(18f to 15f, 32f to 85f), listOf(32f to 85f, 50f to 40f), listOf(50f to 40f, 68f to 85f), listOf(68f to 85f, 82f to 15f))),
    TracingItem("X", "X", listOf(listOf(20f to 18f, 80f to 82f), listOf(80f to 18f, 20f to 82f))),
    TracingItem("Y", "Y", listOf(listOf(22f to 15f, 50f to 48f), listOf(78f to 15f, 50f to 48f), listOf(50f to 48f, 50f to 85f))),
    TracingItem("Z", "Z", listOf(listOf(22f to 18f, 78f to 18f, 22f to 82f, 78f to 82f)))
)

val numbersTracingItems = listOf(
    TracingItem("1", "1", listOf(listOf(35f to 32f, 50f to 15f, 50f to 85f), listOf(28f to 85f, 72f to 85f))),
    TracingItem("2", "2", listOf(listOf(25f to 32f, 48f to 15f, 75f to 32f, 25f to 85f, 78f to 85f))),
    TracingItem("3", "3", listOf(listOf(25f to 20f, 75f to 20f, 48f to 48f, 75f to 62f, 50f to 85f, 25f to 75f))),
    TracingItem("4", "4", listOf(listOf(65f to 15f, 20f to 62f, 80f to 62f), listOf(65f to 15f, 65f to 85f))),
    TracingItem("5", "5", listOf(listOf(75f to 18f, 30f to 18f, 26f to 45f, 65f to 45f, 75f to 65f, 55f to 85f, 25f to 78f))),
    TracingItem("6", "6", listOf(listOf(70f to 20f, 40f to 30f, 25f to 58f, 50f to 85f, 75f to 68f, 55f to 50f, 25f to 58f))),
    TracingItem("7", "7", listOf(listOf(22f to 18f, 78f to 18f, 42f to 85f))),
    TracingItem("8", "8", listOf(listOf(50f to 50f, 28f to 32f, 50f to 15f, 72f to 32f, 50f to 50f, 25f to 68f, 50f to 85f, 75f to 68f, 50f to 50f))),
    TracingItem("9", "9", listOf(listOf(75f to 50f, 50f to 50f, 25f to 32f, 50f to 15f, 75f to 32f, 75f to 75f, 55f to 85f))),
    TracingItem("10", "10", listOf(listOf(28f to 25f, 38f to 15f, 38f to 85f), listOf(70f to 15f, 55f to 48f, 70f to 85f, 85f to 48f, 70f to 15f)))
)

val hindiTracingItems = listOf(
    TracingItem("a", "अ", listOf(listOf(32f to 28f, 52f to 28f, 58f to 42f, 42f to 54f), listOf(42f to 54f, 62f to 65f, 52f to 82f, 30f to 78f), listOf(45f to 54f, 72f to 54f), listOf(72f to 28f, 72f to 82f), listOf(60f to 28f, 85f to 28f))),
    TracingItem("aa", "आ", listOf(listOf(25f to 28f, 42f to 28f, 48f to 42f, 35f to 54f), listOf(35f to 54f, 52f to 65f, 42f to 82f, 22f to 78f), listOf(38f to 54f, 62f to 54f), listOf(62f to 28f, 62f to 82f), listOf(78f to 28f, 78f to 82f), listOf(52f to 28f, 88f to 28f))),
    TracingItem("i", "इ", listOf(listOf(50f to 28f, 50f to 36f), listOf(50f to 36f, 32f to 45f, 50f to 58f, 68f to 70f, 45f to 82f, 32f to 92f), listOf(30f to 28f, 70f to 28f))),
    TracingItem("ee", "ई", listOf(listOf(50f to 28f, 50f to 36f), listOf(50f to 36f, 32f to 45f, 50f to 58f, 68f to 70f, 45f to 82f, 32f to 92f), listOf(50f to 28f, 65f to 14f, 72f to 24f), listOf(30f to 28f, 70f to 28f))),
    TracingItem("u", "उ", listOf(listOf(35f to 30f, 60f to 30f, 65f to 48f, 48f to 58f), listOf(48f to 58f, 70f to 70f, 58f to 84f, 30f to 80f), listOf(30f to 30f, 75f to 30f))),
    TracingItem("oo", "ऊ", listOf(listOf(35f to 30f, 60f to 30f, 65f to 48f, 48f to 58f), listOf(48f to 58f, 70f to 70f, 58f to 84f, 30f to 80f), listOf(55f to 58f, 75f to 62f, 82f to 75f), listOf(30f to 30f, 75f to 30f))),
    TracingItem("ri", "ऋ", listOf(listOf(50f to 28f, 50f to 84f), listOf(50f to 56f, 28f to 40f), listOf(50f to 56f, 28f to 74f), listOf(50f to 52f, 65f to 40f, 72f to 50f, 62f to 65f, 78f to 82f), listOf(30f to 28f, 70f to 28f))),
    TracingItem("e", "ए", listOf(listOf(42f to 28f, 42f to 55f, 65f to 84f), listOf(62f to 28f, 62f to 55f, 45f to 55f), listOf(32f to 28f, 72f to 28f))),
    TracingItem("ai", "ऐ", listOf(listOf(42f to 38f, 42f to 60f, 65f to 84f), listOf(62f to 38f, 62f to 60f, 45f to 60f), listOf(55f to 14f, 45f to 38f), listOf(32f to 38f, 72f to 38f))),
    TracingItem("o", "ओ", listOf(listOf(25f to 38f, 42f to 38f, 48f to 50f, 35f to 60f), listOf(35f to 60f, 52f to 70f, 42f to 84f, 22f to 80f), listOf(38f to 60f, 62f to 60f), listOf(62f to 38f, 62f to 84f), listOf(78f to 38f, 78f to 84f), listOf(88f to 16f, 78f to 38f), listOf(52f to 38f, 88f to 38f))),
    TracingItem("au", "औ", listOf(listOf(25f to 38f, 42f to 38f, 48f to 50f, 35f to 60f), listOf(35f to 60f, 52f to 70f, 42f to 84f, 22f to 80f), listOf(38f to 60f, 62f to 60f), listOf(62f to 38f, 62f to 84f), listOf(78f to 38f, 78f to 84f), listOf(75f to 14f, 78f to 38f), listOf(88f to 16f, 78f to 38f), listOf(52f to 38f, 88f to 38f))),
    TracingItem("am", "अं", listOf(listOf(32f to 35f, 52f to 35f, 58f to 48f, 42f to 58f), listOf(42f to 58f, 62f to 68f, 52f to 84f, 30f to 80f), listOf(45f to 58f, 72f to 58f), listOf(72f to 35f, 72f to 84f), listOf(72f to 20f, 72f to 23f), listOf(60f to 35f, 85f to 35f))),
    TracingItem("ah", "अः", listOf(listOf(32f to 28f, 52f to 28f, 58f to 42f, 42f to 54f), listOf(42f to 54f, 62f to 65f, 52f to 82f, 30f to 78f), listOf(45f to 54f, 72f to 54f), listOf(72f to 28f, 72f to 82f), listOf(85f to 45f, 85f to 48f), listOf(85f to 65f, 85f to 68f), listOf(60f to 28f, 85f to 28f)))
)
