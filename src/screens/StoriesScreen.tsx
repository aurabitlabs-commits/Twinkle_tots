import { useState } from 'react';
import { BackButton } from '@/components/BackButton';
import { colors } from '@/theme';
import { playTone } from '@/hooks/useSpeech';
import storiesData from '@/data/stories.json';
import type { StoryData } from './StoryPlayerScreen';
import { BookOpen } from 'lucide-react';

interface StoriesScreenProps {
  onBack: () => void;
  onSelectStory: (story: StoryData, lang: 'en' | 'hi') => void;
}

export function StoriesScreen({ onBack, onSelectStory }: StoriesScreenProps) {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const allStories = storiesData as StoryData[];

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none overflow-y-auto"
      style={{
        background: `linear-gradient(160deg, ${colors.pastels[0]} 0%, ${colors.pastels[3]} 100%)`,
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 sticky top-0 bg-white/70 backdrop-blur-sm z-10 shadow-xs">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl" style={{ color: colors.ink }}>
          Stories / कहानियाँ
        </h2>
        <div className="w-8" />
      </div>

      {/* Language Toggle */}
      <div className="flex justify-center gap-2 p-3">
        <button
          onClick={() => {
            playTone('tap');
            setLang('en');
          }}
          className={`px-5 py-2 rounded-xl font-rounded font-bold text-sm transition-all ${
            lang === 'en' ? 'bg-amber-500 text-white shadow-sm' : 'bg-white/80 text-slate-700'
          }`}
        >
          English
        </button>
        <button
          onClick={() => {
            playTone('tap');
            setLang('hi');
          }}
          className={`px-5 py-2 rounded-xl font-rounded font-bold text-sm transition-all ${
            lang === 'hi' ? 'bg-amber-500 text-white shadow-sm' : 'bg-white/80 text-slate-700'
          }`}
        >
          हिन्दी
        </button>
      </div>

      {/* Stories List */}
      <div className="p-4 flex flex-col gap-4 max-w-[420px] mx-auto w-full pb-8">
        {allStories.map((story) => (
          <button
            key={story.id}
            onClick={() => {
              playTone('tap');
              onSelectStory(story, lang);
            }}
            className="rounded-3xl p-5 bg-white/95 hover:bg-white border-2 border-amber-200/80 shadow-md flex items-center gap-4 transition-transform active:scale-95 text-left cursor-pointer"
          >
            <div className="w-18 h-18 rounded-2xl bg-amber-100 flex items-center justify-center text-4xl flex-shrink-0 shadow-xs">
              {story.coverEmoji}
            </div>
            <div className="flex-1">
              <span className="font-rounded font-bold text-xl text-slate-900 line-clamp-1 block">
                {story.title[lang]}
              </span>
              <span className="text-xs font-semibold text-slate-500 block mt-1">
                {story.pages.length} Pages • Tap Words & Quiz
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
              <BookOpen size={20} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
