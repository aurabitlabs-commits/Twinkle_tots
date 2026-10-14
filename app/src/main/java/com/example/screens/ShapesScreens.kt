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
import com.example.components.NavArrow
import com.example.components.NavArrowDirection
import com.example.components.ProgressDots
import com.example.components.ShapeCanvas
import com.example.components.SpeakerButton
import com.example.components.TaraMascot
import com.example.data.shapesData
import com.example.model.QuizQuestion
import com.example.model.ShapeEntry
import com.example.ui.theme.Ink
import com.example.ui.theme.InkLight
import com.example.ui.theme.PastelBorders
import com.example.ui.theme.Pastels
import com.example.utils.roundStars
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

private val shapeColors = listOf(
    Color(0xFFFF7043), Color(0xFF42A5F5), Color(0xFF66BB6A),
    Color(0xFFAB47BC), Color(0xFFFFA726), Color(0xFFEC407A)
)

@Composable
fun ShapesLearnScreen(
    soundManager: SoundManager,
    onBack: () -> Unit,
    markCardSeen: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    var index by remember { mutableIntStateOf(0) }
    val current = shapesData[index]

    LaunchedEffect(index) {
        soundManager.speak("${current.nameEn}... ${current.nameHi}")
        markCardSeen(current.id)
    }

    DisposableEffect(Unit) {
        onDispose { soundManager.stopSpeech() }
    }

    val gradient = Brush.verticalGradient(
        colors = listOf(Pastels[index % Pastels.size], Pastels[(index + 2) % Pastels.size])
    )

    Box(
        modifier = modifier
            .testTag("shapes_learn_screen")
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
                    text = "Shapes / आकार",
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

            // Card
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
                Text(
                    text = current.nameEn,
                    color = Ink,
                    fontSize = 44.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = current.nameHi,
                    color = InkLight,
                    fontSize = 26.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(16.dp))

                Box(
                    modifier = Modifier
                        .size(140.dp)
                        .clip(RoundedCornerShape(30.dp))
                        .background(Color.White)
                        .padding(16.dp),
                    contentAlignment = Alignment.Center
                ) {
                    ShapeCanvas(
                        shapeId = current.id,
                        color = shapeColors[index % shapeColors.size],
                        size = 100.dp
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Real world items
                Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                    current.realWorld.forEach { item ->
                        Column(
                            modifier = Modifier
                                .clip(RoundedCornerShape(16.dp))
                                .background(Color.White)
                                .padding(horizontal = 14.dp, vertical = 8.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(text = item.emoji, fontSize = 32.sp)
                            Text(text = item.name, color = InkLight, fontSize = 12.sp, fontWeight = FontWeight.Bold)
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
                NavArrow(direction = NavArrowDirection.RIGHT, disabled = index == shapesData.size - 1, onClick = {
                    soundManager.playTone(ToneType.TAP)
                    index++
                })
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text(text = "${index + 1} / ${shapesData.size}", color = InkLight, fontSize = 18.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(6.dp))
            ProgressDots(total = shapesData.size, current = index)
            Spacer(modifier = Modifier.height(10.dp))
        }
    }
}

@Composable
fun ShapesFindScreen(
    soundManager: SoundManager,
    onBack: () -> Unit,
    onHome: () -> Unit,
    addStars: (Int) -> Unit,
    recordRoundScore: (String, Int) -> Unit,
    modifier: Modifier = Modifier
) {
    val coroutineScope = rememberCoroutineScope()
    val shapesMap = remember { shapesData.associateBy { it.id } }

    fun buildShapeQuestions(): List<QuizQuestion> {
        val pool = shapesData.shuffled().take(10)
        return pool.map { s ->
            val wrong = (shapesData - s).shuffled().take(2).map { it.id }
            QuizQuestion(correctId = s.id, options = (listOf(s.id) + wrong).shuffled())
        }
    }

    var questions by remember { mutableStateOf(buildShapeQuestions()) }
    var qIndex by remember { mutableIntStateOf(0) }
    var wrongAnswers by remember { mutableStateOf(setOf<String>()) }
    var firstTryCorrect by remember { mutableIntStateOf(0) }
    var showConfetti by remember { mutableStateOf(false) }
    var isDone by remember { mutableStateOf(false) }

    val current = questions.getOrNull(qIndex)
    val correctShape = current?.let { shapesMap[it.correctId] }

    LaunchedEffect(qIndex, isDone) {
        if (!isDone && correctShape != null) {
            delay(300)
            soundManager.speak("Find the ${correctShape.nameEn}... ${correctShape.nameHi} ढूँढो")
        }
    }

    DisposableEffect(Unit) {
        onDispose { soundManager.stopSpeech() }
    }

    val playAgain = {
        soundManager.stopSpeech()
        questions = buildShapeQuestions()
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
                .background(Brush.verticalGradient(listOf(Pastels[2], Pastels[4])))
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
            .testTag("shapes_find_screen")
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
                Text(text = "Find the Shape", color = Ink, fontSize = 26.sp, fontWeight = FontWeight.Bold)
                SpeakerButton(onClick = {
                    soundManager.playTone(ToneType.TAP)
                    correctShape?.let { soundManager.speak("Find the ${it.nameEn}... ${it.nameHi} ढूँढो") }
                })
            }

            Spacer(modifier = Modifier.height(10.dp))
            TaraMascot(size = 68.dp, animation = if (showConfetti) MascotAnimation.CHEER else MascotAnimation.IDLE)
            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = correctShape?.let { "Find the ${it.nameEn}!" } ?: "",
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
                    current.options.forEachIndexed { idx, optId ->
                        val shape = shapesMap[optId]
                        val state = when {
                            optId == current.correctId && showConfetti -> ChoiceState.CORRECT
                            wrongAnswers.contains(optId) -> ChoiceState.WRONG
                            wrongAnswers.size >= 2 && optId == current.correctId -> ChoiceState.REVEALED
                            showConfetti -> ChoiceState.DISABLED
                            else -> ChoiceState.DEFAULT
                        }

                        ChoiceButton(
                            label = shape?.nameEn ?: "",
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
                                    shape?.let { soundManager.speak("Yes! ${it.nameEn}") }

                                    coroutineScope.launch {
                                        delay(2000)
                                        showConfetti = false
                                        if (qIndex < questions.size - 1) {
                                            qIndex++
                                            wrongAnswers = emptySet()
                                        } else {
                                            recordRoundScore("shapes", firstTryCorrect)
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
                                            correctShape?.let { soundManager.speak("The answer is ${it.nameEn}") }
                                            delay(2000)
                                            if (qIndex < questions.size - 1) {
                                                qIndex++
                                                wrongAnswers = emptySet()
                                            } else {
                                                recordRoundScore("shapes", firstTryCorrect)
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
fun ShapeSorterScreen(
    soundManager: SoundManager,
    onBack: () -> Unit,
    onHome: () -> Unit,
    addStars: (Int) -> Unit,
    modifier: Modifier = Modifier
) {
    val coroutineScope = rememberCoroutineScope()
    var puzzleIdx by remember { mutableIntStateOf(0) }
    var placedHoles by remember { mutableStateOf(setOf<String>()) }
    var selectedShapeId by remember { mutableStateOf<String?>(null) }
    var showConfetti by remember { mutableStateOf(false) }
    var isDone by remember { mutableStateOf(false) }

    val currentShapes = remember(puzzleIdx) {
        shapesData.shuffled().take(3)
    }

    LaunchedEffect(puzzleIdx) {
        placedHoles = emptySet()
        selectedShapeId = null
        soundManager.speak("Match the shapes!")
    }

    if (isDone) {
        Box(
            modifier = modifier
                .fillMaxSize()
                .background(Brush.verticalGradient(listOf(Pastels[2], Pastels[0])))
                .statusBarsPadding()
        ) {
            ConfettiView(active = true)
            EndRoundScreen(
                stars = 3,
                onPlayAgain = {
                    puzzleIdx = 0
                    isDone = false
                },
                onHome = onHome
            )
        }
        return
    }

    val gradient = Brush.verticalGradient(
        colors = listOf(Pastels[puzzleIdx % Pastels.size], Pastels[(puzzleIdx + 2) % Pastels.size])
    )

    Box(
        modifier = modifier
            .testTag("shape_sorter_screen")
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
                Text(text = "Shape Sorter", color = Ink, fontSize = 26.sp, fontWeight = FontWeight.Bold)
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color.White)
                        .padding(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Text(text = "${puzzleIdx + 1} / 5", color = Ink, fontWeight = FontWeight.Bold)
                }
            }

            Spacer(modifier = Modifier.height(10.dp))
            Text(
                text = if (selectedShapeId != null) "Tap the matching outline hole!" else "Tap a shape at the bottom!",
                color = Ink,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(18.dp))

            // Outline Holes at Top
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(24.dp))
                    .background(Color.White)
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceAround,
                verticalAlignment = Alignment.CenterVertically
            ) {
                currentShapes.forEach { shape ->
                    val isPlaced = placedHoles.contains(shape.id)
                    Box(
                        modifier = Modifier
                            .size(76.dp)
                            .clip(RoundedCornerShape(16.dp))
                            .background(if (isPlaced) Color.Transparent else Color(0xFFF1F5F9))
                            .clickable {
                                if (!isPlaced && selectedShapeId != null) {
                                    if (selectedShapeId == shape.id) {
                                        soundManager.playTone(ToneType.POP)
                                        val nextPlaced = placedHoles + shape.id
                                        placedHoles = nextPlaced
                                        selectedShapeId = null

                                        if (nextPlaced.size == 3) {
                                            soundManager.playTone(ToneType.WIN)
                                            showConfetti = true
                                            addStars(1)
                                            coroutineScope.launch {
                                                delay(1800)
                                                showConfetti = false
                                                if (puzzleIdx < 4) puzzleIdx++ else isDone = true
                                            }
                                        }
                                    } else {
                                        soundManager.playTone(ToneType.WRONG)
                                        selectedShapeId = null
                                    }
                                }
                            },
                        contentAlignment = Alignment.Center
                    ) {
                        if (isPlaced) {
                            ShapeCanvas(shapeId = shape.id, color = Color(0xFF66BB6A), size = 68.dp)
                        } else {
                            ShapeCanvas(shapeId = shape.id, color = Color.Transparent, strokeColor = Color(0xFF64748B), strokeWidth = 4f, size = 60.dp)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            // Shapes to Pick at Bottom
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(24.dp))
                    .background(Color.White)
                    .padding(20.dp),
                horizontalArrangement = Arrangement.SpaceAround,
                verticalAlignment = Alignment.CenterVertically
            ) {
                currentShapes.shuffled().forEach { shape ->
                    val isPlaced = placedHoles.contains(shape.id)
                    val isSelected = selectedShapeId == shape.id

                    Box(
                        modifier = Modifier
                            .size(76.dp)
                            .scale(if (isSelected) 1.15f else 1f)
                            .clip(RoundedCornerShape(16.dp))
                            .background(if (isSelected) Color(0xFFFFF9C4) else Color.Transparent)
                            .clickable(enabled = !isPlaced) {
                                soundManager.playTone(ToneType.TAP)
                                selectedShapeId = shape.id
                                soundManager.speak(shape.nameEn)
                            },
                        contentAlignment = Alignment.Center
                    ) {
                        if (!isPlaced) {
                            ShapeCanvas(shapeId = shape.id, color = Color(0xFFFF8C42), size = 68.dp)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
