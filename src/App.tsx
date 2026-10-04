import { useState, useEffect } from 'react';
import type { ScreenName, TracingItem } from '@/types';
import { useStars } from '@/hooks/useStars';
import { useSettings } from '@/hooks/useSettings';
import { setCachedSettings } from '@/hooks/useSpeech';
import { usePlayTimeLimit } from '@/hooks/usePlayTimeLimit';
import { loadChildProfile } from '@/utils/profileStorage';
import { TOPICS } from '@/topics';

import { SplashScreen } from '@/screens/SplashScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { ProfileSetupScreen } from '@/screens/ProfileSetupScreen';
import { WritingAcademyScreen } from '@/screens/WritingAcademyScreen';
import { GameZoneScreen } from '@/screens/GameZoneScreen';
import { BadgesScreen } from '@/screens/BadgesScreen';
import { TopicMenuScreen } from '@/screens/TopicMenuScreen';
import { AbcLearnScreen } from '@/screens/AbcLearnScreen';
import { AbcPlayScreen } from '@/screens/AbcPlayScreen';
import { NumLearnScreen } from '@/screens/NumLearnScreen';
import { NumPlayScreen } from '@/screens/NumPlayScreen';
import { HindiLearnScreen } from '@/screens/HindiLearnScreen';
import { HindiPlayScreen } from '@/screens/HindiPlayScreen';
import { ShapesLearnScreen } from '@/screens/ShapesLearnScreen';
import { ShapesFindScreen } from '@/screens/ShapesFindScreen';
import { ShapeSorterScreen } from '@/screens/ShapeSorterScreen';
import { ColorsLearnScreen } from '@/screens/ColorsLearnScreen';
import { ColorsFindScreen } from '@/screens/ColorsFindScreen';
import { PaintScreen } from '@/screens/PaintScreen';
import { TracingScreen } from '@/screens/TracingScreen';
import { RhymesScreen } from '@/screens/RhymesScreen';
import { RhymePlayerScreen, type RhymeData } from '@/screens/RhymePlayerScreen';
import { StoriesScreen } from '@/screens/StoriesScreen';
import { StoryPlayerScreen, type StoryData } from '@/screens/StoryPlayerScreen';
import { ParentProgressScreen } from '@/screens/ParentProgressScreen';
import { PlusPacksScreen } from '@/screens/PlusPacksScreen';
import { PackLearnPlayScreen } from '@/screens/PackLearnPlayScreen';
import { BodyActivityScreen } from '@/screens/BodyActivityScreen';
import { HindiGintiScreen } from '@/screens/HindiGintiScreen';
import { SoundQuizScreen } from '@/screens/SoundQuizScreen';
import { ParentGateScreen } from '@/screens/ParentGateScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { PhonicsHomeScreen } from '@/screens/PhonicsHomeScreen';
import { LetterSoundsScreen } from '@/screens/LetterSoundsScreen';
import { BeginningSoundScreen } from '@/screens/BeginningSoundScreen';
import { SoundBlendingScreen } from '@/screens/SoundBlendingScreen';
import { SpellingScreen } from '@/screens/SpellingScreen';
import { WordFamiliesScreen } from '@/screens/WordFamiliesScreen';
import { PhonicsGamesScreen } from '@/screens/PhonicsGamesScreen';
import { DaysMonthsMenuScreen } from '@/screens/DaysMonthsMenuScreen';
import { DaysLearnScreen } from '@/screens/DaysLearnScreen';
import { MonthsLearnScreen } from '@/screens/MonthsLearnScreen';
import { CalendarScreen } from '@/screens/CalendarScreen';
import { DaysMonthsPlayScreen } from '@/screens/DaysMonthsPlayScreen';
import { NextUpGameScreen } from '@/screens/NextUpGameScreen';
import { OrderUpGameScreen } from '@/screens/OrderUpGameScreen';
import { YesterdayTomorrowGameScreen } from '@/screens/YesterdayTomorrowGameScreen';
import { MonthPictureMatchGameScreen } from '@/screens/MonthPictureMatchGameScreen';
import { BeforeAfterBetweenScreen } from '@/screens/BeforeAfterBetweenScreen';
import { NumberSpellingScreen } from '@/screens/NumberSpellingScreen';

import { MemoryMatch } from '@/components/MemoryMatch';
import { BackButton } from '@/components/BackButton';
import { PaywallModal } from '@/components/PaywallModal';
import { RestModal } from '@/components/RestModal';
import { TodaysAdventureModal } from '@/components/TodaysAdventureModal';

import tracingData from '@/data/tracing.json';
import rhymesData from '@/data/rhymes.json';
import plusPacksData from '@/data/plusPacks.json';
import alphabetData from '@/data/alphabet.json';
import numbersData from '@/data/numbers.json';
import hindiData from '@/data/hindi.json';
import shapesData from '@/data/shapes.json';
import colorsData from '@/data/colors.json';

setCachedSettings({ soundEffects: true, voice: true });

export default function App() {
  const [screen, setScreen] = useState<ScreenName>('splash');
  const [activeRhyme, setActiveRhyme] = useState<RhymeData | null>(null);
  const [activeStory, setActiveStory] = useState<{ story: StoryData; lang: 'en' | 'hi' } | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showAdventure, setShowAdventure] = useState(false);
  const [dmLevel, setDmLevel] = useState<1 | 2 | 3>(1);

  const {
    progress,
    addStars,
    recordRoundScore,
    markCardSeen,
    markLetterTraced,
    resetAll,
  } = useStars();
  const { settings, toggle, setSetting } = useSettings();
  const { isRestTime, grantMoreTime } = usePlayTimeLimit();

  const navigate = (s: ScreenName) => setScreen(s);

  const handleSplashDone = () => {
    const profile = loadChildProfile();
    if (!profile.isSetupCompleted) {
      navigate('profileSetup');
    } else {
      navigate('home');
    }
  };

  const abcTopic = TOPICS.find((t) => t.id === 'abc')!;
  const numTopic = TOPICS.find((t) => t.id === 'numbers')!;
  const hindiTopic = TOPICS.find((t) => t.id === 'hindi')!;
  const shapesTopic = TOPICS.find((t) => t.id === 'shapes')!;
  const colorsTopic = TOPICS.find((t) => t.id === 'colors')!;

  const englishTracing = tracingData.english as TracingItem[];
  const numberTracing = tracingData.numbers as TracingItem[];
  const hindiTracing = tracingData.hindi as TracingItem[];

  if (screen === 'splash') {
    return (
      <div className="app-shell">
        <SplashScreen onDone={handleSplashDone} />
      </div>
    );
  }

  return (
    <div className="app-shell">
      {/* Bedtime / Rest modal overlay */}
      {isRestTime && <RestModal onGrantMoreTime={grantMoreTime} />}

      {/* Paywall modal overlay */}
      {showPaywall && (
        <PaywallModal
          onClose={() => setShowPaywall(false)}
          onSuccess={() => setShowPaywall(false)}
        />
      )}

      {/* Today's Adventure Modal */}
      {showAdventure && (
        <TodaysAdventureModal
          onClose={() => setShowAdventure(false)}
          onStartStep={(route) => {
            setShowAdventure(false);
            navigate(route as ScreenName);
          }}
          onFinishAdventure={() => addStars(3)}
        />
      )}

      {/* FIRST-LAUNCH PROFILE SETUP */}
      {screen === 'profileSetup' && (
        <ProfileSetupScreen
          onComplete={() => navigate('home')}
          isEditing={false}
        />
      )}

      {/* HOME */}
      {screen === 'home' && (
        <HomeScreen
          stars={progress.totalStars}
          onNavigate={(s) => navigate(s)}
          onOpenPaywall={() => setShowPaywall(true)}
          onOpenAdventure={() => setShowAdventure(true)}
        />
      )}

      {/* WRITING ACADEMY */}
      {screen === 'writingAcademy' && (
        <WritingAcademyScreen
          onBack={() => navigate('home')}
          onLetterCompleted={(id) => {
            markLetterTraced(id);
            addStars(1, 'abc');
          }}
        />
      )}

      {/* GAME ZONE */}
      {screen === 'gameZone' && (
        <GameZoneScreen
          onBack={() => navigate('home')}
          addStars={addStars}
          onOpenMemoryMatch={() => navigate('abcMatch')}
        />
      )}

      {/* BADGES & TROPHIES SHOWCASE */}
      {screen === 'badgesScreen' && (
        <BadgesScreen onBack={() => navigate('home')} />
      )}

      {/* PHONICS & EARLY READING */}
      {screen === 'phonicsHome' && (
        <PhonicsHomeScreen
          onBack={() => navigate('home')}
          onNavigate={navigate}
        />
      )}
      {screen === 'letterSounds' && (
        <LetterSoundsScreen
          onBack={() => navigate('phonicsHome')}
          addStars={addStars}
        />
      )}
      {screen === 'beginningSound' && (
        <BeginningSoundScreen
          onBack={() => navigate('phonicsHome')}
          addStars={addStars}
        />
      )}
      {screen === 'soundBlending' && (
        <SoundBlendingScreen
          onBack={() => navigate('phonicsHome')}
          addStars={addStars}
        />
      )}
      {screen === 'spellingActivity' && (
        <SpellingScreen
          onBack={() => navigate('phonicsHome')}
          addStars={addStars}
        />
      )}
      {screen === 'wordFamilies' && (
        <WordFamiliesScreen
          onBack={() => navigate('phonicsHome')}
          addStars={addStars}
        />
      )}
      {screen === 'phonicsGames' && (
        <PhonicsGamesScreen
          onBack={() => navigate('phonicsHome')}
          addStars={addStars}
        />
      )}

      {/* DAYS & MONTHS PACK */}
      {screen === 'daysMonthsMenu' && (
        <DaysMonthsMenuScreen
          onBack={() => navigate('home')}
          onNavigate={navigate}
        />
      )}
      {screen === 'daysLearn' && (
        <DaysLearnScreen
          onBack={() => navigate('daysMonthsMenu')}
          weekStart={settings.weekStart || 'sun'}
          voiceLang={settings.voiceLang || 'both'}
          markCardSeen={markCardSeen}
        />
      )}
      {screen === 'monthsLearn' && (
        <MonthsLearnScreen
          onBack={() => navigate('daysMonthsMenu')}
          voiceLang={settings.voiceLang || 'both'}
          markCardSeen={markCardSeen}
        />
      )}
      {screen === 'calendarScreen' && (
        <CalendarScreen
          onBack={() => navigate('daysMonthsMenu')}
          weekStart={settings.weekStart || 'sun'}
          voiceLang={settings.voiceLang || 'both'}
        />
      )}
      {screen === 'daysMonthsPlay' && (
        <DaysMonthsPlayScreen
          onBack={() => navigate('daysMonthsMenu')}
          onNavigate={navigate}
          level={dmLevel}
          onChangeLevel={setDmLevel}
        />
      )}
      {screen === 'gameNextUp' && (
        <NextUpGameScreen
          onBack={() => navigate('daysMonthsPlay')}
          addStars={(n) => addStars(n, 'days')}
          level={dmLevel}
          weekStart={settings.weekStart || 'sun'}
          voiceLang={settings.voiceLang || 'both'}
        />
      )}
      {screen === 'gameOrderUp' && (
        <OrderUpGameScreen
          onBack={() => navigate('daysMonthsPlay')}
          addStars={(n) => addStars(n, 'days')}
          level={dmLevel}
          weekStart={settings.weekStart || 'sun'}
        />
      )}
      {screen === 'gameYesterdayTomorrow' && (
        <YesterdayTomorrowGameScreen
          onBack={() => navigate('daysMonthsPlay')}
          addStars={(n) => addStars(n, 'days')}
          voiceLang={settings.voiceLang || 'both'}
        />
      )}
      {screen === 'gameMonthPictureMatch' && (
        <MonthPictureMatchGameScreen
          onBack={() => navigate('daysMonthsPlay')}
          addStars={(n) => addStars(n, 'months')}
          onOpenMonthsLearn={() => navigate('monthsLearn')}
          voiceLang={settings.voiceLang || 'both'}
        />
      )}

      {/* TOPIC MENUS */}
      {screen === 'abcMenu' && (
        <TopicMenuScreen
          title={abcTopic.title}
          titleIcon={abcTopic.icon}
          bgGradient={abcTopic.pastelBg}
          buttons={abcTopic.buttons}
          onBack={() => navigate('home')}
          onNavigate={navigate}
        />
      )}

      {screen === 'numMenu' && (
        <TopicMenuScreen
          title={numTopic.title}
          titleIcon={numTopic.icon}
          bgGradient={numTopic.pastelBg}
          buttons={numTopic.buttons}
          onBack={() => navigate('home')}
          onNavigate={navigate}
        />
      )}

      {screen === 'hindiMenu' && (
        <TopicMenuScreen
          title={hindiTopic.title}
          titleIcon={hindiTopic.icon}
          bgGradient={hindiTopic.pastelBg}
          buttons={hindiTopic.buttons}
          onBack={() => navigate('home')}
          onNavigate={navigate}
        />
      )}

      {screen === 'shapesMenu' && (
        <TopicMenuScreen
          title={shapesTopic.title}
          titleIcon={shapesTopic.icon}
          bgGradient={shapesTopic.pastelBg}
          buttons={shapesTopic.buttons}
          onBack={() => navigate('home')}
          onNavigate={navigate}
        />
      )}

      {screen === 'colorsMenu' && (
        <TopicMenuScreen
          title={colorsTopic.title}
          titleIcon={colorsTopic.icon}
          bgGradient={colorsTopic.pastelBg}
          buttons={colorsTopic.buttons}
          onBack={() => navigate('home')}
          onNavigate={navigate}
        />
      )}

      {/* ABC SCREENS */}
      {screen === 'abcLearn' && (
        <AbcLearnScreen onBack={() => navigate('abcMenu')} markCardSeen={markCardSeen} />
      )}
      {screen === 'abcPlay' && (
        <AbcPlayScreen
          onBack={() => navigate('abcMenu')}
          onHome={() => navigate('home')}
          addStars={addStars}
          recordRoundScore={recordRoundScore}
        />
      )}
      {screen === 'abcTrace' && (
        <TracingScreen
          title="Trace Letter"
          items={englishTracing}
          tracedLetters={progress.tracedLetters}
          onBack={() => navigate('abcMenu')}
          onLetterCompleted={(id) => {
            markLetterTraced(id);
            addStars(1, 'abc');
          }}
          getSpeechText={(item) => `${item.label}`}
        />
      )}
      {screen === 'abcMatch' && (
        <div className="flex flex-col h-full bg-amber-50 p-4">
          <div className="flex items-center justify-between mb-2">
            <BackButton onClick={() => navigate('abcMenu')} />
            <h3 className="font-rounded font-bold text-2xl text-slate-800">ABC Match</h3>
            <div className="w-8" />
          </div>
          <MemoryMatch
            items={alphabetData.slice(0, 10).map((a) => ({
              id: a.id,
              name: `${a.id} for ${a.word}`,
              display: `${a.upper} ${a.emoji}`,
              matchKey: a.id,
            }))}
            onComplete={() => addStars(1, 'abc')}
          />
        </div>
      )}

      {/* 123 SCREENS */}
      {screen === 'numLearn' && (
        <NumLearnScreen onBack={() => navigate('numMenu')} markCardSeen={markCardSeen} />
      )}
      {screen === 'numPlay' && (
        <NumPlayScreen
          onBack={() => navigate('numMenu')}
          onHome={() => navigate('home')}
          addStars={addStars}
          recordRoundScore={recordRoundScore}
        />
      )}
      {screen === 'numTrace' && (
        <TracingScreen
          title="Trace Number"
          items={numberTracing}
          tracedLetters={progress.tracedLetters}
          onBack={() => navigate('numMenu')}
          onLetterCompleted={(id) => {
            markLetterTraced(id);
            addStars(1, 'numbers');
          }}
          getSpeechText={(item) => `${item.label}`}
        />
      )}
      {screen === 'numMatch' && (
        <div className="flex flex-col h-full bg-sky-50 p-4">
          <div className="flex items-center justify-between mb-2">
            <BackButton onClick={() => navigate('numMenu')} />
            <h3 className="font-rounded font-bold text-2xl text-slate-800">123 Match</h3>
            <div className="w-8" />
          </div>
          <MemoryMatch
            items={numbersData.map((n) => ({
              id: String(n.id),
              name: n.word,
              display: `${n.numeral} ${n.emoji}`,
              matchKey: String(n.id),
            }))}
            onComplete={() => addStars(1, 'numbers')}
          />
        </div>
      )}
      {screen === 'beforeAfterBetween' && (
        <BeforeAfterBetweenScreen
          onBack={() => navigate('numMenu')}
          addStars={(n) => addStars(n, 'numbers')}
          voiceLang={settings.voiceLang || 'both'}
        />
      )}
      {screen === 'numberSpelling' && (
        <NumberSpellingScreen
          onBack={() => navigate('numMenu')}
          addStars={(n) => addStars(n, 'numbers')}
          voiceLang={settings.voiceLang || 'both'}
        />
      )}

      {/* HINDI SCREENS */}
      {screen === 'hindiLearn' && (
        <HindiLearnScreen onBack={() => navigate('hindiMenu')} markCardSeen={markCardSeen} />
      )}
      {screen === 'hindiPlay' && (
        <HindiPlayScreen
          onBack={() => navigate('hindiMenu')}
          onHome={() => navigate('home')}
          addStars={addStars}
          recordRoundScore={recordRoundScore}
        />
      )}
      {screen === 'hindiTrace' && (
        <TracingScreen
          title="अक्षर लिखो"
          items={hindiTracing}
          tracedLetters={progress.tracedLetters}
          onBack={() => navigate('hindiMenu')}
          onLetterCompleted={(id) => {
            markLetterTraced(id);
            addStars(1, 'hindi');
          }}
          getSpeechText={(item) => `${item.label}`}
        />
      )}
      {screen === 'hindiMatch' && (
        <div className="flex flex-col h-full bg-orange-50 p-4">
          <div className="flex items-center justify-between mb-2">
            <BackButton onClick={() => navigate('hindiMenu')} />
            <h3 className="font-rounded font-bold text-2xl text-slate-800">वर्णमाला Match</h3>
            <div className="w-8" />
          </div>
          <MemoryMatch
            items={hindiData.slice(0, 10).map((h) => ({
              id: h.id,
              name: h.letter,
              display: `${h.letter} ${h.emoji}`,
              matchKey: h.id,
            }))}
            onComplete={() => addStars(1, 'hindi')}
          />
        </div>
      )}

      {/* SHAPES SCREENS */}
      {screen === 'shapesLearn' && (
        <ShapesLearnScreen onBack={() => navigate('shapesMenu')} markCardSeen={markCardSeen} />
      )}
      {screen === 'shapesFind' && (
        <ShapesFindScreen
          onBack={() => navigate('shapesMenu')}
          onHome={() => navigate('home')}
          addStars={addStars}
          recordRoundScore={recordRoundScore}
        />
      )}
      {screen === 'shapeSorter' && (
        <ShapeSorterScreen
          onBack={() => navigate('shapesMenu')}
          onHome={() => navigate('home')}
          addStars={addStars}
        />
      )}
      {screen === 'shapeMatch' && (
        <div className="flex flex-col h-full bg-purple-50 p-4">
          <div className="flex items-center justify-between mb-2">
            <BackButton onClick={() => navigate('shapesMenu')} />
            <h3 className="font-rounded font-bold text-2xl text-slate-800">Shape Match</h3>
            <div className="w-8" />
          </div>
          <MemoryMatch
            items={shapesData.map((s) => ({
              id: s.id,
              name: s.nameEn,
              display: s.realWorld[0].emoji,
              matchKey: s.id,
            }))}
            onComplete={() => addStars(1, 'shapes')}
          />
        </div>
      )}

      {/* COLORS SCREENS */}
      {screen === 'colorsLearn' && (
        <ColorsLearnScreen onBack={() => navigate('colorsMenu')} markCardSeen={markCardSeen} />
      )}
      {screen === 'colorsFind' && (
        <ColorsFindScreen
          onBack={() => navigate('colorsMenu')}
          onHome={() => navigate('home')}
          addStars={addStars}
          recordRoundScore={recordRoundScore}
        />
      )}
      {screen === 'paint' && (
        <PaintScreen onBack={() => navigate('colorsMenu')} addStars={addStars} />
      )}
      {screen === 'colorMatch' && (
        <div className="flex flex-col h-full bg-teal-50 p-4">
          <div className="flex items-center justify-between mb-2">
            <BackButton onClick={() => navigate('colorsMenu')} />
            <h3 className="font-rounded font-bold text-2xl text-slate-800">Color Match</h3>
            <div className="w-8" />
          </div>
          <MemoryMatch
            items={colorsData.map((c) => ({
              id: c.id,
              name: c.nameEn,
              display: c.objects[0].emoji,
              matchKey: c.id,
            }))}
            onComplete={() => addStars(1, 'colors')}
          />
        </div>
      )}

      {/* RHYMES & STORIES */}
      {screen === 'rhymesList' && (
        <RhymesScreen
          onBack={() => navigate('home')}
          onSelectRhyme={(r) => {
            setActiveRhyme(r);
            navigate('rhymePlayer');
          }}
          onPlayAll={() => {
            setActiveRhyme(rhymesData[0] as RhymeData);
            navigate('rhymePlayer');
          }}
        />
      )}
      {screen === 'rhymePlayer' && activeRhyme && (
        <RhymePlayerScreen
          rhyme={activeRhyme}
          onBack={() => navigate('rhymesList')}
          onNextRhyme={() => {
            const nextIdx = (rhymesData.findIndex((r) => r.id === activeRhyme.id) + 1) % rhymesData.length;
            setActiveRhyme(rhymesData[nextIdx] as RhymeData);
          }}
          onComplete={() => addStars(1, 'rhymes')}
        />
      )}

      {screen === 'storiesList' && (
        <StoriesScreen
          onBack={() => navigate('home')}
          onSelectStory={(story, lang) => {
            setActiveStory({ story, lang });
            navigate('storyPlayer');
          }}
        />
      )}
      {screen === 'storyPlayer' && activeStory && (
        <StoryPlayerScreen
          story={activeStory.story}
          lang={activeStory.lang}
          onBack={() => navigate('storiesList')}
          onComplete={() => addStars(1, 'stories')}
        />
      )}

      {/* PLUS BONUS PACKS */}
      {screen === 'plusPacks' && (
        <PlusPacksScreen
          onBack={() => navigate('home')}
          onNavigate={navigate}
          onOpenPaywall={() => setShowPaywall(true)}
        />
      )}

      {screen === 'animalsMenu' && (
        <PackLearnPlayScreen
          packId="plus_animals"
          title="Animals & Sounds"
          items={plusPacksData.animals}
          onBack={() => navigate('plusPacks')}
          onHome={() => navigate('home')}
          addStars={addStars}
          onOpenPaywall={() => setShowPaywall(true)}
          onSoundQuiz={() => navigate('soundQuiz')}
        />
      )}

      {screen === 'fruitsMenu' && (
        <PackLearnPlayScreen
          packId="plus_fruits_veg"
          title="Fruits & Veggies"
          items={plusPacksData.fruits_veg}
          onBack={() => navigate('plusPacks')}
          onHome={() => navigate('home')}
          addStars={addStars}
          onOpenPaywall={() => setShowPaywall(true)}
        />
      )}

      {screen === 'vehiclesMenu' && (
        <PackLearnPlayScreen
          packId="plus_vehicles"
          title="Vehicles & Sounds"
          items={plusPacksData.vehicles}
          onBack={() => navigate('plusPacks')}
          onHome={() => navigate('home')}
          addStars={addStars}
          onOpenPaywall={() => setShowPaywall(true)}
          onSoundQuiz={() => navigate('soundQuiz')}
        />
      )}

      {screen === 'bodyActivity' && (
        <BodyActivityScreen
          onBack={() => navigate('plusPacks')}
          onHome={() => navigate('home')}
          addStars={addStars}
        />
      )}

      {screen === 'hindiGinti' && (
        <HindiGintiScreen
          onBack={() => navigate('plusPacks')}
          onHome={() => navigate('home')}
          addStars={addStars}
        />
      )}

      {screen === 'soundQuiz' && (
        <SoundQuizScreen
          title="Whose Sound?"
          items={plusPacksData.animals}
          onBack={() => navigate('plusPacks')}
          onHome={() => navigate('home')}
          addStars={addStars}
        />
      )}

      {/* PARENT SCREENS */}
      {screen === 'parentProgress' && (
        <ParentProgressScreen onBack={() => navigate('settings')} />
      )}

      {screen === 'parentGate' && (
        <ParentGateScreen
          onBack={() => navigate('home')}
          onPass={() => navigate('settings')}
        />
      )}

      {screen === 'settings' && (
        <SettingsScreen
          onBack={() => navigate('home')}
          settings={settings}
          onToggle={toggle}
          onSetSetting={setSetting}
          onResetStars={resetAll}
          onOpenProgress={() => navigate('parentProgress')}
          onOpenPaywall={() => setShowPaywall(true)}
          onEditProfile={() => navigate('profileSetup')}
        />
      )}
    </div>
  );
}
