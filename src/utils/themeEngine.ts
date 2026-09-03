import { BackstageThemeConfig } from '../types';
import { DEFAULT_BACKSTAGE_THEME, THEME_FONT_PRESETS, THEME_COLOR_PRESETS } from '../data/themePresets';

const STORAGE_KEY = 'homie_cozie_backstage_theme';

export function getStoredThemeConfig(): BackstageThemeConfig {
  if (typeof window === 'undefined') return DEFAULT_BACKSTAGE_THEME;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_BACKSTAGE_THEME;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_BACKSTAGE_THEME, ...parsed };
  } catch (e) {
    return DEFAULT_BACKSTAGE_THEME;
  }
}

export function saveThemeConfig(config: BackstageThemeConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save backstage theme:', e);
  }
}

export function applyThemeToDOM(config: BackstageThemeConfig): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // 1. Primary Colors
  root.style.setProperty('--color-primary', config.primaryColor);
  root.style.setProperty('--color-primary-hover', config.primaryHover);
  root.style.setProperty('--color-accent', config.accentColor);

  // 2. Font Family
  const fontPreset = THEME_FONT_PRESETS.find(f => f.id === config.fontFamily) || THEME_FONT_PRESETS[0];
  root.style.setProperty('--font-backstage-main', fontPreset.cssFamily);

  // 3. Theme Mode Background & Surface CSS Properties
  if (config.themeMode === 'dark') {
    root.style.setProperty('--bg-light', '#09090B');
    root.style.setProperty('--bg-surface', '#18181B');
    root.style.setProperty('--card-light', '#121215');
    root.style.setProperty('--border-subtle', '#27272A');
    root.style.setProperty('--border-strong', '#3F3F46');
    root.style.setProperty('--text-primary', '#F4F4F5');
    root.style.setProperty('--text-secondary', '#A1A1AA');
    root.style.setProperty('--text-muted', '#71717A');
    root.classList.add('dark-theme');
  } else if (config.themeMode === 'espresso') {
    root.style.setProperty('--bg-light', '#22150E');
    root.style.setProperty('--bg-surface', '#2D1D14');
    root.style.setProperty('--card-light', '#1A100B');
    root.style.setProperty('--border-subtle', '#442C1E');
    root.style.setProperty('--border-strong', '#5F3D2A');
    root.style.setProperty('--text-primary', '#FDF8F3');
    root.style.setProperty('--text-secondary', '#D8C4B6');
    root.style.setProperty('--text-muted', '#A68D7E');
    root.classList.add('dark-theme');
  } else if (config.themeMode === 'slate') {
    root.style.setProperty('--bg-light', '#F8FAFC');
    root.style.setProperty('--bg-surface', '#F1F5F9');
    root.style.setProperty('--card-light', '#FFFFFF');
    root.style.setProperty('--border-subtle', '#E2E8F0');
    root.style.setProperty('--border-strong', '#CBD5E1');
    root.style.setProperty('--text-primary', '#0F172A');
    root.style.setProperty('--text-secondary', '#475569');
    root.style.setProperty('--text-muted', '#64748B');
    root.classList.remove('dark-theme');
  } else if (config.themeMode === 'light') {
    root.style.setProperty('--bg-light', '#FAFAFA');
    root.style.setProperty('--bg-surface', '#F4F4F5');
    root.style.setProperty('--card-light', '#FFFFFF');
    root.style.setProperty('--border-subtle', '#E4E4E7');
    root.style.setProperty('--border-strong', '#D4D4D8');
    root.style.setProperty('--text-primary', '#18181B');
    root.style.setProperty('--text-secondary', '#52525B');
    root.style.setProperty('--text-muted', '#71717A');
    root.classList.remove('dark-theme');
  } else {
    // Default 'warm'
    root.style.setProperty('--bg-light', '#FAF7F2');
    root.style.setProperty('--bg-surface', '#F5EFEB');
    root.style.setProperty('--card-light', '#FFFFFF');
    root.style.setProperty('--border-subtle', '#EAE2D8');
    root.style.setProperty('--border-strong', '#D5C9BC');
    root.style.setProperty('--text-primary', '#1F1A16');
    root.style.setProperty('--text-secondary', '#5C5248');
    root.style.setProperty('--text-muted', '#5C5248');
    root.classList.remove('dark-theme');
  }

  // 4. Data Attributes
  root.setAttribute('data-theme-preset', config.colorPreset);
  root.setAttribute('data-theme-mode', config.themeMode);
  root.setAttribute('data-font', config.fontFamily);
  root.setAttribute('data-radius', config.borderRadius);
  root.setAttribute('data-density', config.uiDensity);

  // 5. Dynamic Live Stylesheet Injection (Guarantees Instant UI Transformation)
  let styleEl = document.getElementById('backstage-dynamic-theme') as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'backstage-dynamic-theme';
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = `
    /* Primary Accent Highlights across Backstage */
    .bg-\\[\\#C84B27\\],
    button.bg-\\[\\#C84B27\\],
    .btn-theme-primary {
      background-color: ${config.primaryColor} !important;
    }

    .hover\\:bg-\\[\\#B23E1C\\]:hover,
    button.bg-\\[\\#C84B27\\]:hover,
    .btn-theme-primary:hover {
      background-color: ${config.primaryHover} !important;
    }

    .text-\\[\\#C84B27\\] {
      color: ${config.primaryColor} !important;
    }

    .border-\\[\\#C84B27\\] {
      border-color: ${config.primaryColor} !important;
    }

    .ring-\\[\\#C84B27\\]\\/20 {
      --tw-ring-color: ${config.primaryColor}33 !important;
    }

    /* Active Sidebar Navigation Item */
    aside button.bg-\\[\\#C84B27\\] {
      background-color: ${config.primaryColor} !important;
      color: #ffffff !important;
    }

    /* Font Family */
    .backstage-container,
    .backstage-container * {
      font-family: ${fontPreset.cssFamily}, -apple-system, BlinkMacSystemFont, sans-serif !important;
    }

    ${
      config.themeMode === 'dark' ? `
        .backstage-container,
        .backstage-container header,
        .backstage-container aside,
        .backstage-container main {
          background-color: #09090B !important;
          color: #F4F4F5 !important;
          border-color: #27272A !important;
        }
        .backstage-container .bg-white,
        .backstage-container .bg-\\[\\#FAF7F2\\] {
          background-color: #121215 !important;
          border-color: #27272A !important;
          color: #F4F4F5 !important;
        }
        .backstage-container .bg-\\[\\#F5EFEB\\] {
          background-color: #18181B !important;
          border-color: #27272A !important;
        }
        .backstage-container .text-\\[\\#1F1A16\\] {
          color: #F4F4F5 !important;
        }
        .backstage-container .text-\\[\\#5C5248\\] {
          color: #A1A1AA !important;
        }
        .backstage-container .text-\\[\\#5C5248\\] {
          color: #71717A !important;
        }
        .backstage-container .border-\\[\\#EAE2D8\\] {
          border-color: #27272A !important;
        }
        .backstage-container input,
        .backstage-container select,
        .backstage-container textarea {
          background-color: #18181B !important;
          color: #F4F4F5 !important;
          border-color: #27272A !important;
        }
      ` : config.themeMode === 'espresso' ? `
        .backstage-container,
        .backstage-container header,
        .backstage-container aside,
        .backstage-container main {
          background-color: #1E120B !important;
          color: #FDF8F3 !important;
          border-color: #442C1E !important;
        }
        .backstage-container .bg-white,
        .backstage-container .bg-\\[\\#FAF7F2\\] {
          background-color: #2A1A11 !important;
          border-color: #442C1E !important;
          color: #FDF8F3 !important;
        }
        .backstage-container .bg-\\[\\#F5EFEB\\] {
          background-color: #352217 !important;
          border-color: #442C1E !important;
        }
        .backstage-container .text-\\[\\#1F1A16\\] {
          color: #FDF8F3 !important;
        }
        .backstage-container .text-\\[\\#5C5248\\] {
          color: #D8C4B6 !important;
        }
        .backstage-container .text-\\[\\#5C5248\\] {
          color: #A68D7E !important;
        }
        .backstage-container .border-\\[\\#EAE2D8\\] {
          border-color: #442C1E !important;
        }
        .backstage-container input,
        .backstage-container select,
        .backstage-container textarea {
          background-color: #2A1A11 !important;
          color: #FDF8F3 !important;
          border-color: #442C1E !important;
        }
      ` : config.themeMode === 'slate' ? `
        .backstage-container {
          background-color: #F8FAFC !important;
          color: #0F172A !important;
        }
        .backstage-container .bg-white {
          background-color: #FFFFFF !important;
          border-color: #E2E8F0 !important;
        }
        .backstage-container .bg-\\[\\#FAF7F2\\] {
          background-color: #F8FAFC !important;
        }
        .backstage-container .bg-\\[\\#F5EFEB\\] {
          background-color: #F1F5F9 !important;
        }
        .backstage-container .text-\\[\\#1F1A16\\] {
          color: #0F172A !important;
        }
        .backstage-container .text-\\[\\#5C5248\\] {
          color: #475569 !important;
        }
        .backstage-container .text-\\[\\#5C5248\\] {
          color: #64748B !important;
        }
        .backstage-container .border-\\[\\#EAE2D8\\] {
          border-color: #E2E8F0 !important;
        }
      ` : config.themeMode === 'light' ? `
        .backstage-container {
          background-color: #FAFAFA !important;
          color: #18181B !important;
        }
        .backstage-container .bg-white {
          background-color: #FFFFFF !important;
          border-color: #E4E4E7 !important;
        }
        .backstage-container .bg-\\[\\#FAF7F2\\] {
          background-color: #FAFAFA !important;
        }
        .backstage-container .bg-\\[\\#F5EFEB\\] {
          background-color: #F4F4F5 !important;
        }
        .backstage-container .text-\\[\\#1F1A16\\] {
          color: #18181B !important;
        }
        .backstage-container .text-\\[\\#5C5248\\] {
          color: #52525B !important;
        }
        .backstage-container .text-\\[\\#5C5248\\] {
          color: #71717A !important;
        }
        .backstage-container .border-\\[\\#EAE2D8\\] {
          border-color: #E4E4E7 !important;
        }
      ` : `
        .backstage-container {
          background-color: #FAF7F2 !important;
          color: #1F1A16 !important;
        }
      `
    }

    ${
      config.borderRadius === 'sharp' ? `
        .backstage-container .rounded-2xl,
        .backstage-container .rounded-3xl,
        .backstage-container .rounded-xl {
          border-radius: 4px !important;
        }
      ` : config.borderRadius === 'pill' ? `
        .backstage-container .rounded-2xl,
        .backstage-container .rounded-3xl,
        .backstage-container .rounded-xl {
          border-radius: 9999px !important;
        }
      ` : `
        .backstage-container .rounded-2xl {
          border-radius: 1rem !important;
        }
      `
    }
  `;
}
