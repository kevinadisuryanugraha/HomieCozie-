import { BackstageThemeConfig, ThemeColorPreset, ThemeFontFamily, ThemeMode } from '../types';

export interface PresetColorOption {
  id: ThemeColorPreset;
  name: string;
  description: string;
  primaryColor: string;
  primaryHover: string;
  accentColor: string;
  previewColors: string[];
  themeMode: ThemeMode;
}

export interface PresetFontOption {
  id: ThemeFontFamily;
  name: string;
  category: string;
  cssFamily: string;
  previewText: string;
}

export const THEME_COLOR_PRESETS: PresetColorOption[] = [
  {
    id: 'terracotta',
    name: 'Homie Cozie Terracotta (Default)',
    description: 'Palet signature hangat bernuansa artisan roastery & culinary warmth.',
    primaryColor: '#C84B27',
    primaryHover: '#B23E1C',
    accentColor: '#D97706',
    previewColors: ['#C84B27', '#FAF7F2', '#1F1A16', '#D97706'],
    themeMode: 'warm'
  },
  {
    id: 'espresso',
    name: 'Espresso & Gold Luxury',
    description: 'Nuansa lounge eksklusif dengan sentuhan kayu walnut dan aksen emas.',
    primaryColor: '#8B4513',
    primaryHover: '#70360D',
    accentColor: '#D97706',
    previewColors: ['#8B4513', '#2C1B14', '#FDF8F3', '#D97706'],
    themeMode: 'espresso'
  },
  {
    id: 'nordic',
    name: 'Nordic Slate & Blue Minimalist',
    description: 'Estetika bersih Skandinavia, kontras tajam & profesional berkelas.',
    primaryColor: '#2563EB',
    primaryHover: '#1D4ED8',
    accentColor: '#06B6D4',
    previewColors: ['#2563EB', '#F8FAFC', '#0F172A', '#06B6D4'],
    themeMode: 'slate'
  },
  {
    id: 'matcha',
    name: 'Matcha & Botanical Sage',
    description: 'Kombinasi hijau sage organik yang menenangkan dan ramah mata.',
    primaryColor: '#15803D',
    primaryHover: '#166534',
    accentColor: '#059669',
    previewColors: ['#15803D', '#F4F7F4', '#14251B', '#059669'],
    themeMode: 'warm'
  },
  {
    id: 'sunset',
    name: 'Sunset Bistro Crimson',
    description: 'Warna berani yang memicu selera makan dan energi dining malam.',
    primaryColor: '#E11D48',
    primaryHover: '#BE123C',
    accentColor: '#F59E0B',
    previewColors: ['#E11D48', '#FFF7ED', '#2A0D15', '#F59E0B'],
    themeMode: 'warm'
  },
  {
    id: 'midnight',
    name: 'Midnight Charcoal (OLED Dark)',
    description: 'Mode gelap penuh dengan kontras tinggi untuk efisiensi di ruangan redup.',
    primaryColor: '#F97316',
    primaryHover: '#EA580C',
    accentColor: '#FBBF24',
    previewColors: ['#F97316', '#09090B', '#27272A', '#FAFAFA'],
    themeMode: 'dark'
  },
  {
    id: 'monochrome',
    name: 'Monochrome Executive (Apple-like)',
    description: 'Desain ultra-minimalis hitam putih monokrom dengan aksen abu-abu netral.',
    primaryColor: '#18181B',
    primaryHover: '#27272A',
    accentColor: '#475569',
    previewColors: ['#18181B', '#F4F4F5', '#71717A', '#FFFFFF'],
    themeMode: 'light'
  }
];

export const THEME_FONT_PRESETS: PresetFontOption[] = [
  {
    id: 'outfit',
    name: 'Outfit (Modern Geometric)',
    category: 'SaaS Modern',
    cssFamily: "'Outfit', sans-serif",
    previewText: 'Rp 24.000 • Kopi Susu Signature'
  },
  {
    id: 'jakarta',
    name: 'Plus Jakarta Sans (Clean Tech)',
    category: 'Enterprise UI',
    cssFamily: "'Plus Jakarta Sans', sans-serif",
    previewText: 'Rp 24.000 • Kopi Susu Signature'
  },
  {
    id: 'inter',
    name: 'Inter (Classic Standard)',
    category: 'High Readability',
    cssFamily: "'Inter', sans-serif",
    previewText: 'Rp 24.000 • Kopi Susu Signature'
  },
  {
    id: 'space',
    name: 'Space Grotesk (Tech Future)',
    category: 'Bold & Punchy',
    cssFamily: "'Space Grotesk', sans-serif",
    previewText: 'Rp 24.000 • Kopi Susu Signature'
  },
  {
    id: 'playfair',
    name: 'Playfair Display & Work Sans',
    category: 'Luxury Editorial',
    cssFamily: "'Playfair Display', serif",
    previewText: 'Rp 24.000 • Kopi Susu Signature'
  }
];

export const DEFAULT_BACKSTAGE_THEME: BackstageThemeConfig = {
  colorPreset: 'terracotta',
  primaryColor: '#C84B27',
  primaryHover: '#B23E1C',
  accentColor: '#D97706',
  themeMode: 'warm',
  fontFamily: 'outfit',
  borderRadius: 'rounded',
  uiDensity: 'comfortable',
  cardGlassmorphism: true,
  highContrast: false,
  customBrandingName: 'Homie Cozie Ops'
};
