export const colors = {
  white: '#FFFFFF',
  ink: '#2D3A4B',
  inkLight: '#5A6B7E',
  primary: '#FF8C42',
  primaryDark: '#E8762E',
  primaryLight: '#FFB088',
  secondary: '#4FC3F7',
  success: '#66BB6A',
  successLight: '#A5D6A7',
  error: '#FF8A80',
  errorLight: '#FFCCBC',
  star: '#FFD54F',
  starDark: '#FFB300',

  pastels: [
    '#FFF3E0', // soft peach
    '#E3F2FD', // soft sky
    '#F3E5F5', // soft lilac
    '#E8F5E9', // soft mint
    '#FFF9C4', // soft lemon
    '#FCE4EC', // soft pink
  ],

  pastelBorders: [
    '#FFCC80',
    '#90CAF9',
    '#CE93D8',
    '#A5D6A7',
    '#FFF59D',
    '#F48FB1',
  ],
} as const;

export const spacing = {
  xs: '0.5rem',
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '3rem',
  xxl: '4rem',
} as const;

export const radius = {
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '2.5rem',
  full: '9999px',
} as const;

export const fontSizes = {
  tiny: '0.875rem',
  small: '1rem',
  body: '1.25rem',
  medium: '1.5rem',
  large: '2rem',
  xlarge: '3rem',
  xxlarge: '4.5rem',
  huge: '6rem',
} as const;

export const shadows = {
  soft: '0 4px 14px rgba(0, 0, 0, 0.08)',
  medium: '0 6px 20px rgba(0, 0, 0, 0.12)',
  large: '0 10px 30px rgba(0, 0, 0, 0.14)',
  xl: '0 14px 44px rgba(0, 0, 0, 0.16)',
} as const;

export const transitions = {
  fast: '150ms ease',
  normal: '250ms ease',
  slow: '400ms ease',
  bounce: '350ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;
