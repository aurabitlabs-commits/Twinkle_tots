# Twinkle Tots - Toddler Learning App (Android)

Twinkle Tots is a friendly, interactive toddler learning Android application built with **Kotlin** and **Jetpack Compose**. It helps toddlers learn the alphabet and numbers through speech synthesis, tap-to-count flashcards, playful quizzes, a cheerful star mascot named Tara, and a rewarding star collection system.

## Features

- **ABC Learning & Flashcards**:
  - Interactive cards for all 26 letters (A–Z) with uppercase, lowercase, words, and emojis.
  - Clear voice pronunciation ("A for Apple", "B for Ball") using Android Text-To-Speech.
  - Interactive card bounce and pop sound effects on tap.
  - Horizontal swipe and arrow navigation with progress indicators.

- **ABC Play (Quiz Mode)**:
  - 10-question rounds challenging toddlers to listen and find the matching letter.
  - Cheerful celebrations with animated confetti, audio praise, and stars on first-try correct answers.
  - Gentle hints and automatic reveal if a child misses twice.
  - End-of-round performance screen with 1 to 3 star ratings.

- **123 Learning & Tap-to-Count**:
  - Numbers 1 to 10 with numerals, number words, and colorful object emojis.
  - Automatic count-up sequence highlighting each item as it speaks ("One", "Two", "Three"...).
  - Tap-to-count grid where toddlers can individually tap items to hear them pop and count.

- **123 Play (Quiz Mode)**:
  - "How many?" counting challenges with random cute objects (apples, balloons, stars, fish, ducks, flowers).
  - Tappable count tracker and three large numeral answer buttons.
  - Immediate audio feedback, victory tones, and star rewards.

- **Tara Mascot**:
  - Cute animated star mascot that floats, bounces, and cheers along with the toddler.

- **Parent Gate & Settings**:
  - Math gate protection (addition challenge with keypad) to ensure young toddlers cannot access settings.
  - Toggles for Sound Effects and Voice Speech.
  - Option to reset star count with confirmation.
  - Privacy Policy and Support links.

## Android Architecture & Tech Stack

- **UI Framework**: Modern Jetpack Compose with Material 3.
- **Language**: Kotlin 2.2.10.
- **Build System**: Gradle 9.3.1 with Android Gradle Plugin 9.1.1 (Kotlin DSL).
- **Speech**: Android `TextToSpeech` with US English locale and custom child-friendly pitch/rate.
- **Audio Synthesizer**: `AudioTrack` PCM tone generator for low-latency custom sound effects (correct, wrong, win, tap, pop).
- **Persistence**: Android `SharedPreferences` for stars, round records, seen cards, and user settings.
- **Adaptive Icon**: Custom Material You adaptive launcher icon featuring Tara the mascot.
- **Edge-to-Edge**: `enableEdgeToEdge()` with full system bar and navigation bar insets support.
