package com.example.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
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
import com.example.components.NavArrow
import com.example.components.NavArrowDirection
import com.example.components.ProgressDots
import com.example.components.SpeakerButton
import com.example.components.TaraMascot
import com.example.data.colorsData
import com.example.model.ColorEntry
import com.example.model.QuizQuestion
import com.example.ui.theme.Ink
import com.example.ui.theme.InkLight
import com.example.ui.theme.PastelBorders
import com.example.ui.theme.Pastels
import com.example.utils.roundStars
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun ColorsLearnScreen(
    soundManager: SoundManager,
    onBack: () -> Unit,
    markCardSeen: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    var index by remember { mutableIntStateOf(0) }
    val current = colorsData[index]

    LaunchedEffect(index) {
        soundManager.speak("${current.nameEn}... ${current.nameHi}")
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
            .testTag("colors_learn_screen")
            .fillMaxSize()
            .background(gradient)
            .statusBarsPadding()
            .padding(18.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
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
                    text = "Colors / रंग",
                    color = Ink,
                    fontSize = 26.sp,
                    fontWeight = FontWeight.Bold
                )
                SpeakerButton(onClick = {
                    soundManager.playTone(ToneType.TAP)
                    soundManager.speak("${current.nameEn}... ${current.nameHi}")
                })
            }

            Spacer(modifier = Modifier.weight(1f))

            val shapeCorner = RoundedCornerShape(36.dp)
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .widthIn(max = 380.dp)
                    .shadow(elevation = 8.dp, shape = shapeCorner)
                    .clip(shapeCorner)
                    .background(Pastels[index % Pastels.size])
                    .border(width = 4.dp, color = PastelBorders[index % PastelBorders.size], shape = shapeCorner)
                    .clickable {
                        soundManager.playTone(ToneType.POP)
                        soundManager.speak("${current.nameEn}... ${current.nameHi}")
                    }
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(text = current.nameEn, color = Ink, fontSize = 44.sp, fontWeight = FontWeight.Bold)
                Text(text = current.nameHi, color = InkLight, fontSize = 26.sp, fontWeight = FontWeight.Bold)

                Spacer(modifier = Modifier.height(16.dp))

                Box(
                    modifier = Modifier
                        .size(130.dp)
                        .clip(CircleShape)
                        .background(Color(current.hexColor))
                        .border(width = 4.dp, color = Color.White, shape = CircleShape)
                )

                Spacer(modifier = Modifier.height(16.dp))

                Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                    current.objects.forEach { obj ->
                        Column(
                            modifier = Modifier
                                .clip(RoundedCornerShape(16.dp))
                                .background(Color.White)
                                .padding(horizontal = 14.dp, vertical = 8.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(text = obj.emoji, fontSize = 32.sp)
                            Text(text = obj.name, color = InkLight, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            Row(horizontalArrangement = Arrangement.spacedBy(36.dp)) {
                NavArrow(direction = NavArrowDirection.LEFT, disabled = index == 0, onClick = {
                    soundManager.playTone(ToneType.TAP)
                    index--
                })
                NavArrow(direction = NavArrowDirection.RIGHT, disabled = index == colorsData.size - 1, onClick = {
                    soundManager.playTone(ToneType.TAP)
                    index++
                })
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text(text = "${index + 1} / ${colorsData.size}", color = InkLight, fontSize = 18.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(6.dp))
            ProgressDots(total = colorsData.size, current = index)
            Spacer(modifier = Modifier.height(10.dp))
        }
    }
}

@Composable
fun ColorsFindScreen(
    soundManager: SoundManager,
    onBack: () -> Unit,
    onHome: () -> Unit,
    addStars: (Int) -> Unit,
    recordRoundScore: (String, Int) -> Unit,
    modifier: Modifier = Modifier
) {
    val coroutineScope = rememberCoroutineScope()
    val colorsMap = remember { colorsData.associateBy { it.id } }

    fun buildColorQuestions(): List<QuizQuestion> {
        val pool = colorsData.shuffled().take(10)
        return pool.map { c ->
            val wrong = (colorsData - c).shuffled().take(2).map { it.id }
            QuizQuestion(correctId = c.id, options = (listOf(c.id) + wrong).shuffled())
        }
    }

    var questions by remember { mutableStateOf(buildColorQuestions()) }
    var qIndex by remember { mutableIntStateOf(0) }
    var wrongAnswers by remember { mutableStateOf(setOf<String>()) }
    var firstTryCorrect by remember { mutableIntStateOf(0) }
    var showConfetti by remember { mutableStateOf(false) }
    var isDone by remember { mutableStateOf(false) }

    val current = questions.getOrNull(qIndex)
    val correctColor = current?.let { colorsMap[it.correctId] }

    LaunchedEffect(qIndex, isDone) {
        if (!isDone && correctColor != null) {
            delay(300)
            soundManager.speak("Find ${correctColor.nameEn}... ${correctColor.nameHi} ढूँढो")
        }
    }

    DisposableEffect(Unit) {
        onDispose { soundManager.stopSpeech() }
    }

    val playAgain = {
        soundManager.stopSpeech()
        questions = buildColorQuestions()
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
                .background(Brush.verticalGradient(listOf(Pastels[3], Pastels[1])))
                .statusBarsPadding()
        ) {
            ConfettiView(active = true)
            EndRoundScreen(stars = roundStars(firstTryCorrect), onPlayAgain = playAgain, onHome = onHome)
        }
        return
    }

    val gradient = Brush.verticalGradient(
        colors = listOf(Pastels[qIndex % Pastels.size], Pastels[(qIndex + 3) % Pastels.size])
    )

    Box(
        modifier = modifier
            .testTag("colors_find_screen")
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
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                BackButton(onClick = {
                    soundManager.playTone(ToneType.TAP)
                    onBack()
                })
                Text(text = "Find the Color", color = Ink, fontSize = 26.sp, fontWeight = FontWeight.Bold)
                SpeakerButton(onClick = {
                    soundManager.playTone(ToneType.TAP)
                    correctColor?.let { soundManager.speak("Find ${it.nameEn}... ${it.nameHi} ढूँढो") }
                })
            }

            Spacer(modifier = Modifier.height(10.dp))
            TaraMascot(size = 68.dp, animation = if (showConfetti) MascotAnimation.CHEER else MascotAnimation.IDLE)
            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = correctColor?.let { "Find ${it.nameEn}!" } ?: "",
                color = Ink,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.weight(1f))

            if (current != null) {
                Column(
                    modifier = Modifier.fillMaxWidth().widthIn(max = 320.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    current.options.forEach { optId ->
                        val col = colorsMap[optId]
                        val state = when {
                            optId == current.correctId && showConfetti -> ChoiceState.CORRECT
                            wrongAnswers.contains(optId) -> ChoiceState.WRONG
                            wrongAnswers.size >= 2 && optId == current.correctId -> ChoiceState.REVEALED
                            showConfetti -> ChoiceState.DISABLED
                            else -> ChoiceState.DEFAULT
                        }

                        ChoiceButton(
                            label = col?.nameEn ?: "",
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
                                    col?.let { soundManager.speak("Yes! ${it.nameEn}") }

                                    coroutineScope.launch {
                                        delay(2000)
                                        showConfetti = false
                                        if (qIndex < questions.size - 1) {
                                            qIndex++
                                            wrongAnswers = emptySet()
                                        } else {
                                            recordRoundScore("colors", firstTryCorrect)
                                            soundManager.playTone(ToneType.WIN)
                                            isDone = true
                                        }
                                    }
                                } else {
                                    soundManager.playTone(ToneType.WRONG)
                                    soundManager.speak("Try again... फिर से कोशिश करो")
                                    wrongAnswers = wrongAnswers + optId
                                    if (wrongAnswers.size >= 2) {
                                        coroutineScope.launch {
                                            delay(500)
                                            correctColor?.let { soundManager.speak("The answer is ${it.nameEn}") }
                                            delay(2000)
                                            if (qIndex < questions.size - 1) {
                                                qIndex++
                                                wrongAnswers = emptySet()
                                            } else {
                                                recordRoundScore("colors", firstTryCorrect)
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
            Text(text = "${qIndex + 1} / ${questions.size}", color = InkLight, fontSize = 18.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(6.dp))
            ProgressDots(total = questions.size, current = qIndex)
            Spacer(modifier = Modifier.height(10.dp))
        }
    }
}

@Composable
fun PaintScreen(
    soundManager: SoundManager,
    onBack: () -> Unit,
    addStars: (Int) -> Unit,
    modifier: Modifier = Modifier
) {
    var activeColor by remember { mutableStateOf(Color(colorsData[0].hexColor)) }
    var activePic by remember { mutableStateOf("house") }
    var regionColors by remember { mutableStateOf(mapOf<String, Color>()) }
    var showConfetti by remember { mutableStateOf(false) }

    Box(
        modifier = modifier
            .testTag("paint_screen")
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(Pastels[3], Pastels[1])))
            .statusBarsPadding()
            .padding(18.dp)
    ) {
        ConfettiView(active = showConfetti)

        Column(modifier = Modifier.fillMaxSize(), horizontalAlignment = Alignment.CenterHorizontally) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                BackButton(onClick = {
                    soundManager.playTone(ToneType.TAP)
                    onBack()
                })
                Text(text = "Paint / रंग भरो", color = Ink, fontSize = 26.sp, fontWeight = FontWeight.Bold)
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(16.dp))
                        .background(Color(0xFF66BB6A))
                        .clickable {
                            soundManager.playTone(ToneType.WIN)
                            showConfetti = true
                            addStars(1)
                        }
                        .padding(horizontal = 14.dp, vertical = 8.dp)
                ) {
                    Text(text = "✓ Done", color = Color.White, fontWeight = FontWeight.Bold)
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Picture Selector
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf("house" to "🏠 House", "rocket" to "🚀 Rocket", "fish" to "🐟 Fish").forEach { (key, label) ->
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(if (activePic == key) Color(0xFFFF8C42) else Color.White)
                            .clickable {
                                soundManager.playTone(ToneType.TAP)
                                activePic = key
                                regionColors = emptyMap()
                            }
                            .padding(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Text(text = label, color = if (activePic == key) Color.White else Ink, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    }
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            // Canvas Box with Tap-to-fill Regions
            Box(
                modifier = Modifier
                    .size(280.dp)
                    .clip(RoundedCornerShape(28.dp))
                    .background(Color.White)
                    .border(width = 4.dp, color = Color(0xFFFFE082), shape = RoundedCornerShape(28.dp))
                    .padding(16.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
                    // Tap-to-paint interactive blocks
                    Box(
                        modifier = Modifier
                            .size(120.dp, 80.dp)
                            .clip(RoundedCornerShape(16.dp))
                            .background(regionColors["top"] ?: Color(0xFFF1F5F9))
                            .border(width = 3.dp, color = Ink, shape = RoundedCornerShape(16.dp))
                            .clickable {
                                soundManager.playTone(ToneType.POP)
                                regionColors = regionColors + ("top" to activeColor)
                            },
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = if (activePic == "house") "Roof" else if (activePic == "rocket") "Nose" else "Head", color = Ink, fontWeight = FontWeight.Bold)
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Box(
                            modifier = Modifier
                                .size(90.dp, 90.dp)
                                .clip(RoundedCornerShape(16.dp))
                                .background(regionColors["body"] ?: Color(0xFFF1F5F9))
                                .border(width = 3.dp, color = Ink, shape = RoundedCornerShape(16.dp))
                                .clickable {
                                    soundManager.playTone(ToneType.POP)
                                    regionColors = regionColors + ("body" to activeColor)
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = "Body", color = Ink, fontWeight = FontWeight.Bold)
                        }
                        Box(
                            modifier = Modifier
                                .size(90.dp, 90.dp)
                                .clip(RoundedCornerShape(16.dp))
                                .background(regionColors["detail"] ?: Color(0xFFF1F5F9))
                                .border(width = 3.dp, color = Ink, shape = RoundedCornerShape(16.dp))
                                .clickable {
                                    soundManager.playTone(ToneType.POP)
                                    regionColors = regionColors + ("detail" to activeColor)
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = if (activePic == "house") "Door" else "Fin", color = Ink, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            // 10-Color Palette
            LazyRow(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .background(Color.White)
                    .padding(vertical = 12.dp, horizontal = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(colorsData) { col ->
                    val colorObj = Color(col.hexColor)
                    val isSel = activeColor == colorObj
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .scale(if (isSel) 1.25f else 1f)
                            .clip(CircleShape)
                            .background(colorObj)
                            .border(width = if (isSel) 3.dp else 1.dp, color = if (isSel) Color(0xFFFFB300) else Color(0xFFE0E0E0), shape = CircleShape)
                            .clickable {
                                soundManager.playTone(ToneType.TAP)
                                activeColor = colorObj
                                soundManager.speak("${col.nameEn}... ${col.nameHi}")
                            }
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))
        }
    }
}
