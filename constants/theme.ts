export const Colors = {
  primary:      '#1A5EAB',   // logo blue (CV)
  primaryLight: '#E3EEF9',
  accent:       '#38A23B',   // logo green (GRATUIT)
  accentLight:  '#E6F4E6',
  ink:       '#13110D',
  ink2:      '#3D3A34',
  ink3:      '#6B6760',
  paper:     '#F7F4EF',
  surface2:  '#F0EDE7',
  rule:      '#E4E0D9',
  rule2:     '#D5D0C8',
  white:     '#FFFFFF',
  error:     '#EF4444',
  success:   '#10B981',
};

export const FontSize = {
  xs:   11,
  sm:   13,
  base: 15,
  md:   17,
  lg:   20,
  xl:   24,
  xxl:  30,
  hero: 38,
};

export const Spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

// Font families — swap to 'Satoshi-Regular' etc. once TTFs are bundled
export const Fonts = {
  regular: undefined,     // system default
  medium:  undefined,
  bold:    undefined,
  black:   undefined,
} as const;

export const PALETTE = [
  '#1A5EAB',
  '#2563EB',
  '#7C3AED',
  '#DC2626',
  '#D97706',
  '#059669',
  '#1F2937',
  '#BE185D',
  '#0369A1',
  '#7F1D1D',
];

export const TEMPLATES = [
  { key: 'modern',       label: 'Moderne',        badge: 'Populaire'   },
  { key: 'professional', label: 'Professionnel',   badge: 'Classique'   },
  { key: 'creative',     label: 'Créatif',         badge: 'Tendance'    },
  { key: 'simple',       label: 'Simple',          badge: 'Minimaliste' },
  { key: 'canadian',     label: 'Canadien 🍁',     badge: 'Québec'      },
  { key: 'europass',     label: 'Europass 🇪🇺',    badge: 'Europe'      },
  { key: 'ats',          label: 'ATS Compatible',  badge: '✓ ATS'       },
];
