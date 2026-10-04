package com.example.audio

import android.content.Context
import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack
import android.speech.tts.TextToSpeech
import com.example.model.AppSettings
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.util.Locale
import kotlin.math.sin

enum class ToneType {
    CORRECT,
    WRONG,
    WIN,
    TAP,
    POP
}

class SoundManager(context: Context) : TextToSpeech.OnInitListener {
    private var tts: TextToSpeech? = TextToSpeech(context.applicationContext, this)
    private var isTtsReady = false
    private val scope = CoroutineScope(Dispatchers.Default)

    var settings: AppSettings = AppSettings()

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            tts?.language = Locale.US
            tts?.setPitch(1.15f)
            tts?.setSpeechRate(0.9f)
            isTtsReady = true
        }
    }

    fun speak(text: String) {
        if (!settings.voice || !isTtsReady) return
        tts?.stop()
        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "twinkle_${System.currentTimeMillis()}")
    }

    fun stopSpeech() {
        tts?.stop()
    }

    fun playTone(type: ToneType) {
        if (!settings.soundEffects) return
        scope.launch {
            try {
                when (type) {
                    ToneType.CORRECT -> {
                        playPcmNote(523.0, 150, 0.15f)
                        playPcmNote(659.0, 150, 0.15f)
                        playPcmNote(784.0, 250, 0.15f)
                    }
                    ToneType.WRONG -> {
                        playPcmNote(300.0, 180, 0.15f, isTriangle = true)
                        playPcmNote(250.0, 220, 0.15f, isTriangle = true)
                    }
                    ToneType.WIN -> {
                        playPcmNote(523.0, 140, 0.15f)
                        playPcmNote(659.0, 140, 0.15f)
                        playPcmNote(784.0, 140, 0.15f)
                        playPcmNote(1047.0, 350, 0.15f)
                    }
                    ToneType.TAP -> {
                        playPcmNote(600.0, 70, 0.12f)
                    }
                    ToneType.POP -> {
                        playPcmNote(800.0, 60, 0.12f)
                    }
                }
            } catch (_: Exception) {
                // Audio synthesis should never crash the app
            }
        }
    }

    private fun playPcmNote(frequency: Double, durationMs: Int, volume: Float, isTriangle: Boolean = false) {
        val sampleRate = 22050
        val numSamples = (durationMs * sampleRate) / 1000
        val buffer = ShortArray(numSamples)

        for (i in 0 until numSamples) {
            val progress = i.toDouble() / numSamples
            // Linear attack, exponential decay envelope
            val envelope = when {
                progress < 0.1 -> progress / 0.1
                else -> Math.exp(-progress * 4.0)
            }
            val t = 2.0 * Math.PI * i * frequency / sampleRate
            val sampleVal = if (isTriangle) {
                // Triangle wave approximation
                val saw = (i * frequency / sampleRate) % 1.0
                if (saw < 0.5) (4.0 * saw - 1.0) else (3.0 - 4.0 * saw)
            } else {
                sin(t)
            }
            val sample = (sampleVal * Short.MAX_VALUE * volume * envelope).toInt()
            buffer[i] = sample.coerceIn(Short.MIN_VALUE.toInt(), Short.MAX_VALUE.toInt()).toShort()
        }

        val track = AudioTrack.Builder()
            .setAudioAttributes(
                AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_GAME)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .build()
            )
            .setAudioFormat(
                AudioFormat.Builder()
                    .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                    .setSampleRate(sampleRate)
                    .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                    .build()
            )
            .setBufferSizeInBytes(buffer.size * 2)
            .setTransferMode(AudioTrack.MODE_STATIC)
            .build()

        track.write(buffer, 0, buffer.size)
        track.play()
        Thread.sleep(durationMs.toLong() + 20)
        track.release()
    }

    fun release() {
        tts?.stop()
        tts?.shutdown()
        tts = null
    }
}
