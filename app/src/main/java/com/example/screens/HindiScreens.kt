package com.example.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.widthIn
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
import com.example.components.FlashCard
import com.example.components.MascotAnimation
import com.example.components.NavArrow
import com.example.components.NavArrowDirection
import com.example.components.ProgressDots
import com.example.components.SpeakerButton
import com.example.components.TaraMascot
import com.example.data.hindiData
import com.example.model.HindiEntry
import com.example.model.QuizQuestion
import com.example.ui.theme.Ink
import com.example.ui.theme.InkLight
import com.example.ui.theme.Pastels
import com.example.utils.roundStars
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun HindiLearnScreen(
    soundManager: SoundManager,
    onBack: () -> Unit,
    markCardSeen: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    var tab by remember { mutableStateOf("swar") }
    var index by remember { mutableIntStateOf(0) }

    val currentList = remember(tab) {
        hindiData.filter { it.group == tab }
    }
    val current = currentList.getOrNull(index) ?: currentList[0]

    LaunchedEffect(tab) {
        index = 0
    }

    LaunchedEffect(index, tab) {
        soundManager.speak(current.audioPhrase)
        markCardSeen(current.id)
    }

    DisposableEffect(Unit) {
        onDispose { soundManager.stopSpeech() }
    }

    val gradient = Brush.verticalGradient(
        colors = listOf(Pastels[index % Pastels.size], Pastels[(index + 3) % Pastels.size])
    )

    Box(
        modifier = modifier
            .testTag("hindi_learn_screen")
            .fillMaxSize()
            .background(gradient)
            .statusBarsPadding()
            .padding(18.dp)
    ) {
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
                    text = "वर्णमाला सीखो",
                    color = Ink,
                    fontSize = 26.sp,
                    fontWeight = FontWeight.Bold
                )
                SpeakerButton(onClick = {
                    soundManager.playTone(ToneType.TAP)
                    soundManager.speak(current.audioPhrase)
                })
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Tabs: स्वर (13) & व्यंजन (36)
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(16.dp))
                        .background(if (tab == "swar") Color(0xFFFF7043) else Color.White)
                        .clickable {
                            soundManager.playTone(ToneType.TAP)
                            tab = "swar"
                        }
                        .padding(horizontal = 20.dp, vertical = 10.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "स्वर (13)",
                        color = if (tab == "swar") Color.White else Ink,
                        fontWeight = FontWeight.Bold,
                        fontSize = 17.sp
                    )
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(16.dp))
                        .background(if (tab == "vyanjan") Color(0xFFFF7043) else Color.White)
                        .clickable {
                            soundManager.playTone(ToneType.TAP)
                            tab = "vyanjan"
                        }
                        .padding(horizontal = 20.dp, vertical = 10.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "व्यंजन (36)",
                        color = if (tab == "vyanjan") Color.White else Ink,
                        fontWeight = FontWeight.Bold,
                        fontSize = 17.sp
                    )
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            // FlashCard
            FlashCard(
                bigText = current.letter,
                word = if (current.noPicture) null else "${current.letter} से ${current.word}",
                emoji = if (current.noPicture) null else current.emoji,
                pastelIndex = index,
                onTap = {
                    soundManager.playTone(ToneType.POP)
                    soundManager.speak(current.audioPhrase)
                }
            )

            Spacer(modifier = Modifier.weight(1f))

            // Navigation Arrows
            Row(
                horizontalArrangement = Arrangement.spacedBy(36.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                NavArrow(
                    direction = NavArrowDirection.LEFT,
                    disabled = index == 0,
                    onClick = {
                        soundManager.playTone(ToneType.TAP)
                        index--
                    }
                )
                NavArrow(
                    direction = NavArrowDirection.RIGHT,
                    disabled = index == currentList.size - 1,
                    onClick = {
                        soundManager.playTone(ToneType.TAP)
                        index++
                    }
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "${index + 1} / ${currentList.size}",
                color = InkLight,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(6.dp))

            ProgressDots(total = currentList.size, current = index)
            Spacer(modifier = Modifier.height(10.dp))
        }
    }
}

@Composable
fun HindiPlayScreen(
    soundManager: SoundManager,
    onBack: () -> Unit,
    onHome: () -> Unit,
    addStars: (Int) -> Unit,
    recordRoundScore: (String, Int) -> Unit,
    modifier: Modifier = Modifier
) {
    val coroutineScope = rememberCoroutineScope()
    var mode by remember { mutableStateOf("swar") } // swar, vyanjan, all
    val hindiMap = remember { hindiData.associateBy { it.id } }

    fun buildHindiQuestions(m: String): List<QuizQuestion> {
        val pool = when (m) {
            "swar" -> hindiData.filter { it.group == "swar" }
            "vyanjan" -> hindiData.filter { it.group == "vyanjan" }
            else -> hindiData
        }.shuffled().take(10)

        return pool.map { entry ->
            val wrong = (hindiData - entry).shuffled().take(2).map { it.id }
            QuizQuestion(
                correctId = entry.id,
                options = (listOf(entry.id) + wrong).shuffled()
            )
        }
    }

    var questions by remember { mutableStateOf(buildHindiQuestions(mode)) }
    var qIndex by remember { mutableIntStateOf(0) }
    var wrongAnswers by remember { mutableStateOf(setOf<String>()) }
    var firstTryCorrect by remember { mutableIntStateOf(0) }
    var showConfetti by remember { mutableStateOf(false) }
    var isDone by remember { mutableStateOf(false) }

    val current = questions.getOrNull(qIndex)
    val correctEntry = current?.let { hindiMap[it.correctId] }

    LaunchedEffect(qIndex, isDone) {
        if (!isDone && correctEntry != null) {
            delay(300)
            soundManager.speak("अक्षर ढूँढो: ${correctEntry.letter}")
        }
    }

    DisposableEffect(Unit) {
        onDispose { soundManager.stopSpeech() }
    }

    val playAgain = {
        soundManager.stopSpeech()
        questions = buildHindiQuestions(mode)
        qIndex = 0
        wrongAnswers = emptySet()
        firstTryCorrect = 0
        showConfetti = false
        isDone = false
    }

    if (isDone) {
        Box(
            modifier = modifier
                .fillMaxSize()
                .background(Brush.verticalGradient(listOf(Pastels[5], Pastels[2])))
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
            .testTag("hindi_play_screen")
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
                    text = "सुनो और चुनो",
                    color = Ink,
                    fontSize = 26.sp,
                    fontWeight = FontWeight.Bold
                )
                SpeakerButton(onClick = {
                    soundManager.playTone(ToneType.TAP)
                    correctEntry?.let { soundManager.speak("अक्षर ढूँढो: ${it.letter}") }
                })
            }

            Spacer(modifier = Modifier.height(8.dp))

            // 3-way toggle: स्वर / व्यंजन / दोनों
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf("swar" to "स्वर", "vyanjan" to "व्यंजन", "all" to "दोनों").forEach { (key, label) ->
                    val isSel = mode == key
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(if (isSel) Color(0xFFFF7043) else Color.White)
                            .clickable {
                                soundManager.playTone(ToneType.TAP)
                                mode = key
                                playAgain()
                            }
                            .padding(horizontal = 14.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = label,
                            color = if (isSel) Color.White else Ink,
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            TaraMascot(
                size = 68.dp,
                animation = if (showConfetti) MascotAnimation.CHEER else MascotAnimation.IDLE
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = "अक्षर सुनो और सही विकल्प चुनो!",
                color = Ink,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.weight(1f))

            if (current != null) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .widthIn(max = 320.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    current.options.forEach { optId ->
                        val entry = hindiMap[optId]
                        val state = when {
                            optId == current.correctId && showConfetti -> ChoiceState.CORRECT
                            wrongAnswers.contains(optId) -> ChoiceState.WRONG
                            wrongAnswers.size >= 2 && optId == current.correctId -> ChoiceState.REVEALED
                            showConfetti -> ChoiceState.DISABLED
                            else -> ChoiceState.DEFAULT
                        }

                        ChoiceButton(
                            label = entry?.letter ?: "",
                            emoji = if (entry?.noPicture == true) null else entry?.emoji,
                            state = state,
                            onClick = {
                                if (optId == current.correctId) {
                                    val wasFirstTry = wrongAnswers.isEmpty()
                                    if (wasFirstTry) {
                                        firstTryCorrect++
                                        addStars(1)
                                    }
                                    soundManager.playTone(ToneType.CORRECT)
                                    showConfetti = true
                                    entry?.let { soundManager.speak("शाबाश! ${it.audioPhrase}") }

                                    coroutineScope.launch {
                                        delay(2000)
                                        showConfetti = false
                                        if (qIndex < questions.size - 1) {
                                            qIndex++
                                            wrongAnswers = emptySet()
                                        } else {
                                            recordRoundScore("hindi", firstTryCorrect)
                                            soundManager.playTone(ToneType.WIN)
                                            isDone = true
                                        }
                                    }
                                } else {
                                    soundManager.playTone(ToneType.WRONG)
                                    soundManager.speak("फिर से कोशिश करो")
                                    val nextWrong = wrongAnswers + optId
                                    wrongAnswers = nextWrong
                                    if (nextWrong.size >= 2) {
                                        coroutineScope.launch {
                                            delay(500)
                                            correctEntry?.let { soundManager.speak("सही उत्तर है ${it.letter}") }
                                            delay(2000)
                                            if (qIndex < questions.size - 1) {
                                                qIndex++
                                                wrongAnswers = emptySet()
                                            } else {
                                                recordRoundScore("hindi", firstTryCorrect)
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
