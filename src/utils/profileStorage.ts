export interface ChildProfile {
  name: string;
  ageGroup: '3-4' | '4-5' | '5-6';
  avatar: string;
  preferredLanguage: 'both' | 'en' | 'hi';
  isSetupCompleted: boolean;
  earnedBadges: string[];
  taraCostume: string; // 'classic' | 'crown' | 'cap' | 'glasses'
}

const PROFILE_KEY = 'twinkletots_child_profile';

export const AVATAR_OPTIONS = [
  { id: 'tara', emoji: '⭐', label: 'Tara Star' },
  { id: 'lion', emoji: '🦁', label: 'Leo Lion' },
  { id: 'bunny', emoji: '🐰', label: 'Bella Bunny' },
  { id: 'panda', emoji: '🐼', label: 'Pip Panda' },
  { id: 'fox', emoji: '🦊', label: 'Felix Fox' },
  { id: 'tiger', emoji: '🐯', label: 'Tiggy Tiger' },
  { id: 'duck', emoji: '🦆', label: 'Ducky' },
  { id: 'elephant', emoji: '🐘', label: 'Ellie' },
];

export const BADGE_DEFINITIONS = [
  { id: 'first_star', title: 'First Star', icon: '🌟', desc: 'Earned your very first star!' },
  { id: 'adventure_champ', title: 'Daily Explorer', icon: '🏆', desc: 'Completed Today’s Adventure!' },
  { id: 'tracing_pro', title: 'Writing Star', icon: '✏️', desc: 'Traced 5 letters or numbers beautifully!' },
  { id: 'abc_master', title: 'Alphabet Whiz', icon: '🔤', desc: 'Mastered ABC learning cards!' },
  { id: 'number_wizard', title: 'Counting Hero', icon: '🔢', desc: 'Counted numbers 1 to 10!' },
  { id: 'game_champion', title: 'Game Champ', icon: '🎮', desc: 'Won 5 fun mini-games!' },
  { id: 'streak_3', title: '3-Day Streak', icon: '🔥', desc: 'Learned 3 days in a row!' },
  { id: 'music_lover', title: 'Song Bird', icon: '🎵', desc: 'Sang along to nursery rhymes!' },
];

export const DEFAULT_PROFILE: ChildProfile = {
  name: 'Little Star',
  ageGroup: '3-4',
  avatar: '⭐',
  preferredLanguage: 'both',
  isSetupCompleted: false,
  earnedBadges: ['first_star'],
  taraCostume: 'classic',
};

export function loadChildProfile(): ChildProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveChildProfile(profile: ChildProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

export function awardBadge(badgeId: string): boolean {
  const profile = loadChildProfile();
  if (!profile.earnedBadges.includes(badgeId)) {
    profile.earnedBadges.push(badgeId);
    saveChildProfile(profile);
    return true; // newly earned
  }
  return false;
}

export function getPersonalizedGreeting(profile: ChildProfile): string {
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const name = profile.name && profile.name !== 'Little Star' ? profile.name : 'Little Star';
  return `${timeGreeting}, ${name}! ✨`;
}

export function getPersonalizedPraise(profile: ChildProfile, lang: 'en' | 'hi' = 'en'): string {
  const name = profile.name && profile.name !== 'Little Star' ? profile.name : '';
  if (lang === 'hi') {
    const praises = name
      ? [`शाबाश, ${name}!`, `बहुत अच्छे, ${name}!`, `कमाल कर दिया, ${name}!`]
      : ['शाबाश!', 'बहुत अच्छे!', 'कमाल कर दिया!'];
    return praises[Math.floor(Math.random() * praises.length)];
  }
  const praises = name
    ? [`Great job, ${name}!`, `Super star, ${name}!`, `You did it, ${name}!`, `Awesome work, ${name}!`]
    : ['Great job!', 'Super star!', 'You did it!', 'Awesome work!'];
  return praises[Math.floor(Math.random() * praises.length)];
}
