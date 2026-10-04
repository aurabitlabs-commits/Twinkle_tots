package com.example.utils

import com.example.model.QuizQuestion

fun buildLetterRound(allLetters: List<String>, roundSize: Int = 10): List<QuizQuestion> {
    val uniqueLetters = allLetters.shuffled().take(minOf(roundSize, allLetters.size))
    return uniqueLetters.map { letter ->
        val wrongOptions = allLetters.filter { it != letter }.shuffled().take(2)
        QuizQuestion(
            correctId = letter,
            options = (listOf(letter) + wrongOptions).shuffled()
        )
    }
}

fun buildNumberRound(maxNumber: Int = 10, roundSize: Int = 10): List<QuizQuestion> {
    val allNumbers = (1..maxNumber).map { it.toString() }
    val uniqueNumbers = allNumbers.shuffled().take(minOf(roundSize, maxNumber))
    return uniqueNumbers.map { numStr ->
        val correct = numStr.toIntOrNull() ?: 1
        val candidates = mutableListOf<Int>()
        for (delta in 1..3) {
            if (correct - delta >= 1) candidates.add(correct - delta)
            if (correct + delta <= maxNumber) candidates.add(correct + delta)
        }
        val wrongOptions = candidates.shuffled().take(2).map { it.toString() }
        QuizQuestion(
            correctId = numStr,
            options = (listOf(numStr) + wrongOptions).shuffled()
        )
    }
}

fun roundStars(firstTryCorrect: Int): Int {
    return when {
        firstTryCorrect >= 9 -> 3
        firstTryCorrect >= 5 -> 2
        else -> 1
    }
}
