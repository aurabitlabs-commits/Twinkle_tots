export type ScreenName =
  | 'splash'
  | 'home'
  | 'profileSetup'
  | 'writingAcademy'
  | 'gameZone'
  | 'badgesScreen'
  | 'phonicsHome'
  | 'letterSounds'
  | 'beginningSound'
  | 'soundBlending'
  | 'spellingActivity'
  | 'wordFamilies'
  | 'phonicsGames'
  | 'daysMonthsMenu'
  | 'daysLearn'
  | 'monthsLearn'
  | 'calendarScreen'
  | 'daysMonthsPlay'
  | 'gameNextUp'
  | 'gameOrderUp'
  | 'gameYesterdayTomorrow'
  | 'gameMonthPictureMatch'
  | 'abcMenu'
  | 'abcLearn'
  | 'abcPlay'
  | 'abcTrace'
  | 'abcMatch'
  | 'numMenu'
  | 'numLearn'
  | 'numPlay'
  | 'numTrace'
  | 'numMatch'
  | 'beforeAfterBetween'
  | 'numberSpelling'
  | 'hindiMenu'
  | 'hindiLearn'
  | 'hindiPlay'
  | 'hindiTrace'
  | 'hindiMatch'
  | 'shapesMenu'
  | 'shapesLearn'
  | 'shapesFind'
  | 'shapeSorter'
  | 'shapeMatch'
  | 'colorsMenu'
  | 'colorsLearn'
  | 'colorsFind'
  | 'paint'
  | 'colorMatch'
  | 'rhymesList'
  | 'rhymePlayer'
  | 'storiesList'
  | 'storyPlayer'
  | 'parentProgress'
  | 'plusPacks'
  | 'animalsMenu'
  | 'fruitsMenu'
  | 'vehiclesMenu'
  | 'bodyActivity'
  | 'hindiGinti'
  | 'soundQuiz'
  | 'parentGate'
  | 'settings';

export interface AlphabetEntry {
  id: string;
  upper: string;
  lower: string;
  word: string;
  emoji: string;
  audioPhrase: string;
  audioLetter: string;
}

export interface NumberEntry {
  id: number;
  numeral: string;
  word: string;
  emoji: string;
  audioNumber: string;
}

export interface HindiEntry {
  id: string;
  group: 'swar' | 'vyanjan';
  subgroup: string;
  letter: string;
  word: string;
  emoji: string;
  audioLetter: string;
  audioPhrase: string;
  noPicture: boolean;
}

export interface ShapeEntry {
  id: string;
  nameEn: string;
  nameHi: string;
  svgPath: string;
  realWorld: Array<{ name: string; emoji: string }>;
}

export interface ColorEntry {
  id: string;
  nameEn: string;
  nameHi: string;
  hex: string;
  objects: Array<{ name: string; emoji: string }>;
}

export interface TracingItem {
  id: string;
  label: string;
  strokes: number[][][];
}

export type QuestionKind = 'text' | 'image' | 'color' | 'shape';

export interface QuestionOption {
  id: string;
  kind: QuestionKind;
  value: string;
  label?: string;
  color?: string;
  emoji?: string;
}

export interface GenericQuestion {
  id: string;
  promptText: string;
  promptAudioText: string;
  correctId: string;
  options: QuestionOption[];
  feedbackAudioText?: string;
}

export interface QuizQuestion {
  correctId: string;
  options: string[];
}

export interface AppSettings {
  soundEffects: boolean;
  voice: boolean;
  voiceLang?: 'en' | 'hi' | 'both';
  playTimeLimit?: number; // 0, 15, 30, 45, 60
  weekStart?: 'sun' | 'mon'; // default 'sun'
}

export interface AppProgress {
  totalStars: number;
  bestAbcRound: number;
  bestNumRound: number;
  seenCards: string[];
  starsByTopic: Record<string, number>;
  tracedLetters: string[];
  bestScores: Record<string, number>;
}
