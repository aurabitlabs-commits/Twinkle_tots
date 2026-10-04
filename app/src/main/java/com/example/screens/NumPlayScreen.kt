package com.example.screens

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.widthIn
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
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.audio.SoundManager
import com.example.audio.ToneType
import com.example.components.BackButton
import com.example.components.ChoiceButton
import com.example.components.ChoiceState
import com.example.components.ConfettiView
import com.example.components.EndRoundScreen
import com.example.components.MascotAnimation
import com.example.components.ProgressDots
import com.example.components.SpeakerButton
import com.example.components.TaraMascot
import com.example.data.numbersData
import com.example.model.NumPlayQuestion
import com.example.ui.theme.Ink
import com.example.ui.theme.InkLight
import com.example.ui.theme.Pastels
import com.example.ui.theme.Success
import com.example.ui.theme.SuccessLight
import com.example.utils.buildNumberRound
import com.example.utils.roundStars
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

private val numberWords = listOf("One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten")
private val objectEmojis = listOf("\uD83C\uDF4E", "\uD83C\uDF89", "\u2B50", "\uD83D\uDC1F", "\uD83E\uDD86", "\uD83C\uDF38")

private fun generateNumPlayRound(): List<NumPlayQuestion> {
    val base = buildNumberRound(10, 10)
    return base.map { q ->
        val count = q.correctId.toIntOrNull() ?: 1
        NumPlayQuestion(
            correctId = q.correctId,
            options = q.options,
            count = count,
            emoji = objectEmojis.random()
        )
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun NumPlayScreen(
    soundManager: SoundManager,
    onBack: () -> Unit,
    onHome: () -> Unit,
    addStars: (Int) -> Unit,
    recordRoundScore: (String, Int) -> Unit,
    modifier: Modifier = Modifier
) {
    val coroutineScope = rememberCoroutineScope()
    val numbersMap = remember { numbersData.associateBy { it.id.toString() } }

    var questions by remember { mutableStateOf(generateNumPlayRound()) }
    var qIndex by remember { mutableIntStateOf(0) }
    var tappedObjects by remember { mutableStateOf(setOf<Int>()) }
    var wrongAnswers by remember { mutableStateOf(setOf<String>()) }
    var firstTryCorrect by remember { mutableIntStateOf(0) }
    var showConfetti by remember { mutableStateOf(false) }
    var isDone by remember { mutableStateOf(false) }

    val current = questions.getOrNull(qIndex)

    LaunchedEffect(qIndex, isDone) {
        tappedObjects = emptySet()
        if (!isDone && current != null) {
            delay(300)
            soundManager.speak("How many?")
        }
    }

    DisposableEffect(Unit) {
        onDispose {
            soundManager.stopSpeech()
        }
    }

    val playAgain = {
        soundManager.stopSpeech()
        questions = generateNumPlayRound()
        qIndex = 0
        tappedObjects = emptySet()
        wrongAnswers = emptySet()
        firstTryCorrect = 0
        showConfetti = false
        isDone = false
    }

    if (isDone) {
        Box(
            modifier = modifier
                .fillMaxSize()
                .background(Brush.verticalGradient(listOf(Pastels[1], Pastels[4])))
                .statusBarsPadding()
        ) {
            ConfettiView(active = true)
            EndRoundScreen(
                stars = roundStars(firstTryCorrect),
                onPlayAgain = playAgain,
                onHome = onHome
            )
        }
        return
    }

    val gradient = Brush.verticalGradient(
        colors = listOf(Pastels[qIndex % Pastels.size], Pastels[(qIndex + 3) % Pastels.size])
    )

    Box(
        modifier = modifier
            .testTag("num_play_screen")
            .fillMaxSize()
            .background(gradient)
            .statusBarsPadding()
            .padding(18.dp)
    ) {
        ConfettiView(active = showConfetti)

        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Top Bar
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
                    text = "123 Play",
                    color = Ink,
                    fontSize = 26.sp,
                    fontWeight = FontWeight.Bold
                )

                SpeakerButton(onClick = {
                    soundManager.playTone(ToneType.TAP)
                    soundManager.speak("How many?")
                })
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Mascot
            TaraMascot(
                size = 64.dp,
                animation = if (showConfetti) MascotAnimation.CHEER else MascotAnimation.IDLE
            )

            Spacer(modifier = Modifier.height(10.dp))

            // Object Counting Grid
            if (current != null) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .shadow(elevation = 6.dp, shape = RoundedCornerShape(24.dp))
                        .clip(RoundedCornerShape(24.dp))
                        .background(Color.White)
                        .padding(16.dp),
                    contentAlignment = Alignment.Center
                ) {
                    FlowRow(
                        horizontalArrangement = Arrangement.spacedBy(10.dp, Alignment.CenterHorizontally),
                        verticalArrangement = Arrangement.spacedBy(10.dp, Alignment.CenterVertically),
                        maxItemsInEachRow = if (current.count <= 4) current.count else 5
                    ) {
                        for (i in 0 until current.count) {
                            val isTapped = tappedObjects.contains(i)
                            val objScale = remember { Animatable(1f) }

                            Box(
                                modifier = Modifier
                                    .size(54.dp)
                                    .scale(objScale.value)
                                    .clip(CircleShape)
                                    .background(if (isTapped) SuccessLight else Color(0xFFF7F7F7))
                                    .border(
                                        width = 3.dp,
                                        color = if (isTapped) Success else Color.Transparent,
                                        shape = CircleShape
                                    )
                                    .clickable {
                                        if (!isTapped) {
                                            soundManager.playTone(ToneType.POP)
                                            tappedObjects = tappedObjects + i
                                            soundManager.speak(numberWords[i])
                                            coroutineScope.launch {
                                                objScale.animateTo(1.25f, spring(dampingRatio = 0.4f))
                                                objScale.animateTo(1f, spring(dampingRatio = 0.6f))
                                            }
                                        }
                                    },
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = current.emoji,
                                    fontSize = 28.sp,
                                    modifier = Modifier.scale(if (isTapped) 0.85f else 1f)
                                )
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            // Choices (horizontal row of 3 cards)
            if (current != null) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .widthIn(max = 360.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    current.options.forEach { numStr ->
                        val state = when {
                            numStr == current.correctId && showConfetti -> ChoiceState.CORRECT
                            wrongAnswers.contains(numStr) -> ChoiceState.WRONG
                            wrongAnswers.size >= 2 && numStr == current.correctId -> ChoiceState.REVEALED
                            showConfetti -> ChoiceState.DISABLED
                            else -> ChoiceState.DEFAULT
                        }

                        Box(modifier = Modifier.weight(1f)) {
                            ChoiceButton(
                                label = numStr,
                                state = state,
                                onClick = {
                                    if (numStr == current.correctId) {
                                        val wasFirstTry = wrongAnswers.isEmpty()
                                        if (wasFirstTry) {
                                            firstTryCorrect++
                                            addStars(1)
                                        }
                                        soundManager.playTone(ToneType.CORRECT)
                                        showConfetti = true
                                        val entry = numbersMap[current.correctId]
                                        if (entry != null) {
                                            soundManager.speak("Yes! ${entry.word} ${entry.emoji}")
                                        }

                                        coroutineScope.launch {
                                            delay(2000)
                                            showConfetti = false
                                            if (qIndex < questions.size - 1) {
                                                qIndex++
                                                wrongAnswers = emptySet()
                                            } else {
                                                val finalScore = firstTryCorrect
                                                recordRoundScore("num", finalScore)
                                                soundManager.playTone(ToneType.WIN)
                                                isDone = true
                                            }
                                        }
                                    } else {
                                        soundManager.playTone(ToneType.WRONG)
                                        soundManager.speak("Try again")
                                        val nextWrong = wrongAnswers + numStr
                                        wrongAnswers = nextWrong
                                        if (nextWrong.size >= 2) {
                                            val entry = numbersMap[current.correctId]
                                            coroutineScope.launch {
                                                delay(500)
                                                if (entry != null) {
                                                    soundManager.speak("The answer is ${entry.word}")
                                                }
                                                delay(2000)
                                                if (qIndex < questions.size - 1) {
                                                    qIndex++
                                                    wrongAnswers = emptySet()
                                                } else {
                                                    recordRoundScore("num", firstTryCorrect)
                                                    isDone = true
                                                }
                                            }
                                        }
                                    }
                                }
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            // Progress
            Text(
                text = "${qIndex + 1} / ${questions.size}",
                color = InkLight,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(6.dp))

            ProgressDots(total = questions.size, current = qIndex)

            Spacer(modifier = Modifier.height(10.dp))
        }
    }
}
