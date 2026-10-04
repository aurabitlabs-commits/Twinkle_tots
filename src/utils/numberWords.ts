import { shuffle } from './shuffle';

const ONES_EN = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
];

const TENS_EN = [
  '',
  '',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety',
];

// Complete 1 to 100 Hindi numbers dictionary
export const HINDI_NUMBERS: Record<number, string> = {
  1: 'एक',
  2: 'दो',
  3: 'तीन',
  4: 'चार',
  5: 'पाँच',
  6: 'छह',
  7: 'सात',
  8: 'आठ',
  9: 'नौ',
  10: 'दस',
  11: 'ग्यारह',
  12: 'बारह',
  13: 'तेरह',
  14: 'चौदह',
  15: 'पंद्रह',
  16: 'सोलह',
  17: 'सत्रह',
  18: 'अठारह',
  19: 'उन्नीस',
  20: 'बीस',
  21: 'इक्कीस',
  22: 'बाईस',
  23: 'तेईस',
  24: 'चौबीस',
  25: 'पच्चीस',
  26: 'छब्बीस',
  27: 'सत्ताईस',
  28: 'अट्ठाईस',
  29: 'उनतीस',
  30: 'तीस',
  31: 'इकतीस',
  32: 'बत्तीस',
  33: 'तैंतीस',
  34: 'चौंतीस',
  35: 'पैंतीस',
  36: 'छत्तीस',
  37: 'सैंतीस',
  38: 'अड़तीस',
  39: 'उनतालीस',
  40: 'चालीस',
  41: 'इकतालीस',
  42: 'बयालीस',
  43: 'तैंतालीस',
  44: 'चवालीस',
  45: 'पैंतालीस',
  46: 'छियालीस',
  47: 'सैंतालीस',
  48: 'अड़तालीस',
  49: 'उनचास',
  50: 'पचास',
  51: 'इक्यावन',
  52: 'बावन',
  53: 'तिरपन',
  54: 'चौवन',
  55: 'पचपन',
  56: 'छप्पन',
  57: 'सत्तावन',
  58: 'अट्ठावन',
  59: 'उनसठ',
  60: 'साठ',
  61: 'इकसठ',
  62: 'बासठ',
  63: 'तिरसठ',
  64: 'चौंसठ',
  65: 'पैंसठ',
  66: 'छियासठ',
  67: 'सरसठ',
  68: 'अड़सठ',
  69: 'उनहत्तर',
  70: 'सत्तर',
  71: 'इकहत्तर',
  72: 'बहत्तर',
  73: 'तिहत्तर',
  74: 'चौहत्तर',
  75: 'पचहत्तर',
  76: 'छिहत्तर',
  77: 'सतहत्तर',
  78: 'अठहत्तर',
  79: 'उन्यासी',
  80: 'अस्सी',
  81: 'इक्यासी',
  82: 'बयासी',
  83: 'तिरासी',
  84: 'चौरासी',
  85: 'पचासी',
  86: 'छियासी',
  87: 'सत्तासी',
  88: 'अट्ठासी',
  89: 'नवासी',
  90: 'नब्बे',
  91: 'इक्यानवे',
  92: 'बयानवे',
  93: 'तिरानवे',
  94: 'चौरानवे',
  95: 'पचानवे',
  96: 'छियानवे',
  97: 'सत्तानवे',
  98: 'अट्ठानवे',
  99: 'निन्यानवे',
  100: 'एक सौ',
};

export interface NumberDetail {
  num: number;
  en: string;
  hi: string;
  tens: number;
  ones: number;
  tensWord: string;
  onesWord: string;
  breakdownText: string;
}

export function getNumberWord(n: number): NumberDetail {
  if (n < 1) n = 1;
  if (n > 100) n = 100;

  if (n === 100) {
    return {
      num: 100,
      en: 'One Hundred',
      hi: 'एक सौ',
      tens: 10,
      ones: 0,
      tensWord: '10 Tens',
      onesWord: '0 Ones',
      breakdownText: '100 = 10 Tens',
    };
  }

  let en = '';
  const tens = Math.floor(n / 10);
  const ones = n % 10;

  if (n < 20) {
    en = ONES_EN[n];
  } else {
    en = TENS_EN[tens] + (ones > 0 ? `-${ONES_EN[ones]}` : '');
  }

  // Guaranteed genuine Hindi word from 1 to 100
  const hi = HINDI_NUMBERS[n] || 'संख्या';

  const tensWord = tens > 0 ? `${tens * 10} (${TENS_EN[tens]})` : '0';
  const onesWord = ones > 0 ? `${ones} (${ONES_EN[ones]})` : '0';
  const breakdownText = tens > 0 ? `${n} = ${tens * 10} + ${ones}` : `${n} = ${ones}`;

  return {
    num: n,
    en,
    hi,
    tens,
    ones,
    tensWord,
    onesWord,
    breakdownText,
  };
}

export function getAllNumbers(max = 100): NumberDetail[] {
  const result: NumberDetail[] = [];
  for (let i = 1; i <= max; i++) {
    result.push(getNumberWord(i));
  }
  return result;
}

export type SequenceType = 'before' | 'after' | 'between';

export interface BeforeAfterQuestion {
  id: string;
  type: SequenceType;
  givenNumbers: number[];
  correctNumber: number;
  options: number[];
  promptEn: string;
  promptHi: string;
  displayPattern: string; // e.g. "_ 24", "68 _", "42 _ 44"
}

export function generateSequenceQuestion(
  type: SequenceType | 'mixed',
  range: '1-20' | '1-50' | '1-100'
): BeforeAfterQuestion {
  const maxLimit = range === '1-20' ? 20 : range === '1-50' ? 50 : 100;
  const actualType: SequenceType =
    type === 'mixed'
      ? (['before', 'after', 'between'][Math.floor(Math.random() * 3)] as SequenceType)
      : type;

  let correctNumber = 1;
  let givenNumbers: number[] = [];
  let displayPattern = '';
  let promptEn = '';
  let promptHi = '';

  if (actualType === 'before') {
    // "What comes BEFORE n?" (n must be >= 2)
    const base = Math.floor(Math.random() * (maxLimit - 1)) + 2; // 2..maxLimit
    correctNumber = base - 1;
    givenNumbers = [base];
    displayPattern = `[ ? ]  ${base}`;
    promptEn = `What comes BEFORE ${base}?`;
    promptHi = `${base} से पहले क्या आता है?`;
  } else if (actualType === 'after') {
    // "What comes AFTER n?" (n must be < maxLimit)
    const base = Math.floor(Math.random() * (maxLimit - 1)) + 1; // 1..(maxLimit-1)
    correctNumber = base + 1;
    givenNumbers = [base];
    displayPattern = `${base}  [ ? ]`;
    promptEn = `What comes AFTER ${base}?`;
    promptHi = `${base} के बाद क्या आता है?`;
  } else {
    // "between" -> e.g. "What comes BETWEEN 42 and 44?"
    const base = Math.floor(Math.random() * (maxLimit - 2)) + 1; // 1..(maxLimit-2)
    correctNumber = base + 1;
    givenNumbers = [base, base + 2];
    displayPattern = `${base}  [ ? ]  ${base + 2}`;
    promptEn = `What comes BETWEEN ${base} and ${base + 2}?`;
    promptHi = `${base} और ${base + 2} के बीच क्या आता है?`;
  }

  // Generate 2 wrong distractors close to correctNumber
  const candidates: number[] = [];
  for (let offset of [-2, -1, 1, 2, 3, -3, 10, -10]) {
    const val = correctNumber + offset;
    if (val >= 1 && val <= maxLimit && val !== correctNumber && !givenNumbers.includes(val)) {
      candidates.push(val);
    }
  }

  const wrongOptions = shuffle(candidates).slice(0, 2);
  while (wrongOptions.length < 2) {
    const r = Math.floor(Math.random() * maxLimit) + 1;
    if (r !== correctNumber && !wrongOptions.includes(r)) {
      wrongOptions.push(r);
    }
  }

  const options = shuffle([correctNumber, ...wrongOptions]);

  return {
    id: `seq_${Date.now()}_${Math.random()}`,
    type: actualType,
    givenNumbers,
    correctNumber,
    options,
    promptEn,
    promptHi,
    displayPattern,
  };
}
