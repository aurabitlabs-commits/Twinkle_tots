package com.example.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.widthIn
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
import androidx.compose.ui.graphics.Brush
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
import com.example.data.alphabetData
import com.example.model.QuizQuestion
import com.example.ui.theme.Ink
import com.example.ui.theme.InkLight
import com.example.ui.theme.Pastels
import com.example.utils.buildLetterRound
import com.example.utils.roundStars
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun AbcPlayScreen(
    soundManager: SoundManager,
    onBack: () -> Unit,
    onHome: () -> Unit,
    addStars: (Int) -> Unit,
    recordRoundScore: (String, Int) -> Unit,
    modifier: Modifier = Modifier
) {
    val coroutineScope = rememberCoroutineScope()
    val alphabetMap = remember { alphabetData.associateBy { it.id } }
    val allLetterIds = remember { alphabetData.map { it.id } }

    var questions by remember { mutableStateOf(buildLetterRound(allLetterIds, 10)) }
    var qIndex by remember { mutableIntStateOf(0) }
    var wrongAnswers by remember { mutableStateOf(setOf<String>()) }
    var firstTryCorrect by remember { mutableIntStateOf(0) }
    var showConfetti by remember { mutableStateOf(false) }
    var isDone by remember { mutableStateOf(false) }
    var mascotState by remember { mutableStateOf(MascotAnimation.IDLE) }

    val currentQuestion: QuizQuestion? = questions.getOrNull(qIndex)
    val correctEntry = currentQuestion?.let { alphabetMap[it.correctId] }

    LaunchedEffect(qIndex, isDone) {
        if (!isDone && currentQuestion != null) {
            delay(300)
            correctEntry?.let { soundManager.speak("Can you find ${it.upper}? 🔎") }
        }
    }

    DisposableEffect(Unit) {
        onDispose {
            soundManager.stopSpeech()
        }
    }

    val playAgain = {
        soundManager.stopSpeech()
        questions = buildLetterRound(allLetterIds, 10)
        qIndex = 0
        wrongAnswers = emptySet()
        firstTryCorrect = 0
        showConfetti = false
        isDone = false
        mascotState = MascotAnimation.IDLE
    }

    if (isDone) {
        Box(
            modifier = modifier
                .fillMaxSize()
                .background(Brush.verticalGradient(listOf(Pastels[0], Pastels[3])))
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
            .testTag("abc_play_screen")
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
                    text = "Alphabet Quest 🔎",
                    color = Ink,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = (-0.3).sp
                )

                SpeakerButton(onClick = {
                    soundManager.playTone(ToneType.TAP)
                    correctEntry?.let { soundManager.speak("Can you find ${it.upper}?") }
                })
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Tara Mascot Reaction
            TaraMascot(
                size = 76.dp,
                animation = mascotState
            )

            Spacer(modifier = Modifier.height(6.dp))

            // Playful Prompt
            Text(
                text = "Can you find ${correctEntry?.upper ?: ""}? 🔎",
                color = Ink,
                fontSize = 22.sp,
                fontWeight = FontWeight.ExtraBold
            )

            Spacer(modifier = Modifier.weight(1f))

            // Choices
            if (currentQuestion != null) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .widthIn(max = 330.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    currentQuestion.options.forEach { letterId ->
                        val entry = alphabetMap[letterId]
                        val state = when {
                            letterId == currentQuestion.correctId && showConfetti -> ChoiceState.CORRECT
                            wrongAnswers.contains(letterId) -> ChoiceState.WRONG
                            wrongAnswers.size >= 2 && letterId == currentQuestion.correctId -> ChoiceState.REVEALED
                            showConfetti -> ChoiceState.DISABLED
                            else -> ChoiceState.DEFAULT
                        }

                        ChoiceButton(
                            label = "${entry?.upper ?: ""} ${entry?.lower ?: ""}",
                            emoji = entry?.emoji,
                            state = state,
                            onClick = {
                                if (letterId == currentQuestion.correctId) {
                                    val wasFirstTry = wrongAnswers.isEmpty()
                                    if (wasFirstTry) {
                                        firstTryCorrect++
                                        addStars(1)
                                    }
                                    soundManager.playTone(ToneType.CORRECT)
                                    showConfetti = true
                                    mascotState = MascotAnimation.CHEER
                                    entry?.let { soundManager.speak("Yay! You found it! ⭐ ${it.upper} for ${it.word}") }

                                    coroutineScope.launch {
                                        delay(1800)
                                        showConfetti = false
                                        mascotState = MascotAnimation.IDLE
                                        if (qIndex < questions.size - 1) {
                                            qIndex++
                                            wrongAnswers = emptySet()
                                        } else {
                                            recordRoundScore("abc", firstTryCorrect)
                                            soundManager.playTone(ToneType.WIN)
                                            isDone = true
                                        }
                                    }
                                } else {
                                    soundManager.playTone(ToneType.WRONG)
                                    mascotState = MascotAnimation.WOBBLE
                                    soundManager.speak("Almost! Try again! 💛")
                                    val nextWrong = wrongAnswers + letterId
                                    wrongAnswers = nextWrong
                                    if (nextWrong.size >= 2) {
                                        coroutineScope.launch {
                                            delay(500)
                                            correctEntry?.let { soundManager.speak("The answer is ${it.upper}") }
                                            delay(1800)
                                            mascotState = MascotAnimation.IDLE
                                            if (qIndex < questions.size - 1) {
                                                qIndex++
                                                wrongAnswers = emptySet()
                                            } else {
                                                recordRoundScore("abc", firstTryCorrect)
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

            Spacer(modifier = Modifier.weight(1f))

            // Progress
            Text(
                text = "${qIndex + 1} / ${questions.size}",
                color = InkLight,
                fontSize = 17.sp,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(6.dp))

            ProgressDots(total = questions.size, current = qIndex)

            Spacer(modifier = Modifier.height(10.dp))
        }
    }
}
