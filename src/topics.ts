import { colors } from './theme';
import type { ScreenName } from './types';

export interface TopicDefinition {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  color: string;
  pastelBg: [string, string];
  menuRoute: ScreenName;
  speechText: string;
  buttons: Array<{
    id: string;
    label: string;
    icon: string;
    color: string;
    route: ScreenName;
    speechText: string;
  }>;
}

export const TOPICS: TopicDefinition[] = [
  {
    id: 'abc',
    title: 'ABC',
    subtitle: 'Alphabet',
    icon: '🐣',
    color: colors.primary,
    pastelBg: [colors.pastels[0], colors.pastels[4]],
    menuRoute: 'abcMenu',
    speechText: 'A B C',
    buttons: [
      { id: 'learn', label: 'Learn', icon: '📖', color: colors.primary, route: 'abcLearn', speechText: 'Learn' },
      { id: 'play', label: 'Play', icon: '🎮', color: colors.success, route: 'abcPlay', speechText: 'Play' },
      { id: 'trace', label: 'Trace', icon: '✏️', color: '#8E24AA', route: 'abcTrace', speechText: 'Trace' },
      { id: 'match', label: 'Match', icon: '🧩', color: '#FF7043', route: 'abcMatch', speechText: 'Memory Match' },
    ]
  },
  {
    id: 'numbers',
    title: '123',
    subtitle: 'Numbers',
    icon: '🔢',
    color: colors.secondary,
    pastelBg: [colors.pastels[1], colors.pastels[3]],
    menuRoute: 'numMenu',
    speechText: 'One Two Three',
    buttons: [
      { id: 'learn', label: 'Learn', icon: '📖', color: colors.secondary, route: 'numLearn', speechText: 'Learn' },
      { id: 'play', label: 'Play', icon: '🎮', color: colors.success, route: 'numPlay', speechText: 'Play' },
      { id: 'seq', label: 'Before/After', icon: '↔️', color: '#10B981', route: 'beforeAfterBetween', speechText: 'Before, After and Between numbers' },
      { id: 'spellings', label: 'Spell 1-100', icon: '🔤', color: '#F59E0B', route: 'numberSpelling', speechText: 'Number spellings one to one hundred' },
      { id: 'trace', label: 'Trace', icon: '✏️', color: '#8E24AA', route: 'numTrace', speechText: 'Trace' },
      { id: 'match', label: 'Match', icon: '🧩', color: '#FF7043', route: 'numMatch', speechText: 'Memory Match' },
    ]
  },
  {
    id: 'days_months',
    title: 'Days & Months',
    subtitle: 'दिन और महीने',
    icon: '📅',
    color: '#3B82F6',
    pastelBg: [colors.pastels[4], colors.pastels[2]],
    menuRoute: 'daysMonthsMenu',
    speechText: 'Days and Months, दिन और महीने',
    buttons: [
      { id: 'days', label: 'Days', icon: '☀️', color: '#F59E0B', route: 'daysLearn', speechText: 'Days of the week' },
      { id: 'months', label: 'Months', icon: '🗓️', color: '#3B82F6', route: 'monthsLearn', speechText: 'Months of the year' },
      { id: 'calendar', label: 'Calendar', icon: '📆', color: '#10B981', route: 'calendarScreen', speechText: 'My Calendar' },
      { id: 'play', label: 'Play', icon: '🎮', color: '#EC407A', route: 'daysMonthsPlay', speechText: 'Play games' },
    ]
  },
  {
    id: 'hindi',
    title: 'अ आ',
    subtitle: 'वर्णमाला',
    icon: '🦚',
    color: '#FF7043',
    pastelBg: [colors.pastels[5], colors.pastels[2]],
    menuRoute: 'hindiMenu',
    speechText: 'अ आ',
    buttons: [
      { id: 'learn', label: 'Learn', icon: '📖', color: '#FF7043', route: 'hindiLearn', speechText: 'सीखो' },
      { id: 'play', label: 'Play', icon: '🎮', color: colors.success, route: 'hindiPlay', speechText: 'खेलो' },
      { id: 'trace', label: 'Trace', icon: '✏️', color: '#8E24AA', route: 'hindiTrace', speechText: 'लिखो' },
      { id: 'match', label: 'Match', icon: '🧩', color: '#26A69A', route: 'hindiMatch', speechText: 'जोड़ी मिलाओ' },
    ]
  },
  {
    id: 'shapes',
    title: 'Shapes',
    subtitle: 'आकार',
    icon: '🔺',
    color: '#AB47BC',
    pastelBg: [colors.pastels[2], colors.pastels[0]],
    menuRoute: 'shapesMenu',
    speechText: 'Shapes, आकार',
    buttons: [
      { id: 'learn', label: 'Learn', icon: '📖', color: '#AB47BC', route: 'shapesLearn', speechText: 'Learn Shapes' },
      { id: 'find', label: 'Find', icon: '🔍', color: colors.secondary, route: 'shapesFind', speechText: 'Find Shape' },
      { id: 'sorter', label: 'Sorter', icon: '🧩', color: colors.success, route: 'shapeSorter', speechText: 'Shape Sorter' },
      { id: 'match', label: 'Match', icon: '🃏', color: '#FF7043', route: 'shapeMatch', speechText: 'Shape Match' },
    ]
  },
  {
    id: 'colors',
    title: 'Colors',
    subtitle: 'रंग',
    icon: '🎨',
    color: '#26A69A',
    pastelBg: [colors.pastels[3], colors.pastels[1]],
    menuRoute: 'colorsMenu',
    speechText: 'Colors, रंग',
    buttons: [
      { id: 'learn', label: 'Learn', icon: '📖', color: '#26A69A', route: 'colorsLearn', speechText: 'Learn Colors' },
      { id: 'find', label: 'Find', icon: '🔍', color: colors.primary, route: 'colorsFind', speechText: 'Find Color' },
      { id: 'paint', label: 'Paint', icon: '🖌️', color: '#EC407A', route: 'paint', speechText: 'Paint' },
      { id: 'match', label: 'Match', icon: '🧩', color: '#FF7043', route: 'colorMatch', speechText: 'Color Match' },
    ]
  }
];
