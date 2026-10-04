package com.example.data

import android.content.Context
import android.content.SharedPreferences
import com.example.model.AppProgress
import com.example.model.AppSettings

class StorageManager(context: Context) {
    private val prefs: SharedPreferences =
        context.getSharedPreferences("twinkletots_prefs", Context.MODE_PRIVATE)

    companion object {
        private const val KEY_TOTAL_STARS = "total_stars"
        private const val KEY_BEST_ABC_ROUND = "best_abc_round"
        private const val KEY_BEST_NUM_ROUND = "best_num_round"
        private const val KEY_SEEN_CARDS = "seen_cards"
        private const val KEY_SOUND_EFFECTS = "sound_effects"
        private const val KEY_VOICE = "voice"
        private const val KEY_ONBOARDING_SEEN = "onboarding_seen"
    }

    fun hasSeenOnboarding(): Boolean {
        return prefs.getBoolean(KEY_ONBOARDING_SEEN, false)
    }

    fun setSeenOnboarding(seen: Boolean) {
        prefs.edit().putBoolean(KEY_ONBOARDING_SEEN, seen).apply()
    }

    fun loadProgress(): AppProgress {
        val totalStars = prefs.getInt(KEY_TOTAL_STARS, 0)
        val bestAbc = prefs.getInt(KEY_BEST_ABC_ROUND, 0)
        val bestNum = prefs.getInt(KEY_BEST_NUM_ROUND, 0)
        val seen = prefs.getStringSet(KEY_SEEN_CARDS, emptySet()) ?: emptySet()
        return AppProgress(
            totalStars = totalStars,
            bestAbcRound = bestAbc,
            bestNumRound = bestNum,
            seenCards = seen
        )
    }

    fun saveProgress(progress: AppProgress) {
        prefs.edit()
            .putInt(KEY_TOTAL_STARS, progress.totalStars)
            .putInt(KEY_BEST_ABC_ROUND, progress.bestAbcRound)
            .putInt(KEY_BEST_NUM_ROUND, progress.bestNumRound)
            .putStringSet(KEY_SEEN_CARDS, progress.seenCards)
            .apply()
    }

    fun resetProgress() {
        prefs.edit()
            .putInt(KEY_TOTAL_STARS, 0)
            .putInt(KEY_BEST_ABC_ROUND, 0)
            .putInt(KEY_BEST_NUM_ROUND, 0)
            .putStringSet(KEY_SEEN_CARDS, emptySet())
            .apply()
    }

    fun loadSettings(): AppSettings {
        val sfx = prefs.getBoolean(KEY_SOUND_EFFECTS, true)
        val voice = prefs.getBoolean(KEY_VOICE, true)
        return AppSettings(soundEffects = sfx, voice = voice)
    }

    fun saveSettings(settings: AppSettings) {
        prefs.edit()
            .putBoolean(KEY_SOUND_EFFECTS, settings.soundEffects)
            .putBoolean(KEY_VOICE, settings.voice)
            .apply()
    }
}
