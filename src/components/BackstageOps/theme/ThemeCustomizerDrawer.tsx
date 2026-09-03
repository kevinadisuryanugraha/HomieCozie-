import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Palette, 
  X, 
  Check, 
  RotateCcw, 
  Sparkles, 
  Type, 
  Sun, 
  Moon, 
  Coffee, 
  Layers, 
  Sliders, 
  Eye, 
  ShieldCheck, 
  ShoppingBag,
  Flame,
  LayoutGrid
} from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { 
  THEME_COLOR_PRESETS, 
  THEME_FONT_PRESETS, 
  DEFAULT_BACKSTAGE_THEME,
  PresetColorOption,
  PresetFontOption
} from '../../../data/themePresets';
import { 
  ThemeColorPreset, 
  ThemeFontFamily, 
  ThemeMode, 
  ThemeBorderRadius, 
  ThemeDensity 
} from '../../../types';

interface ThemeCustomizerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeCustomizerDrawer: React.FC<ThemeCustomizerDrawerProps> = ({
  isOpen,
  onClose
}) => {
  const backstageTheme = useAppStore(s => s.backstageTheme);
  const updateBackstageTheme = useAppStore(s => s.updateBackstageTheme);
  const resetBackstageTheme = useAppStore(s => s.resetBackstageTheme);

  const [activeTab, setActiveTab] = useState<'presets' | 'colors' | 'fonts' | 'layout'>('presets');

  const handleSelectPreset = (preset: PresetColorOption) => {
    updateBackstageTheme({
      colorPreset: preset.id,
      primaryColor: preset.primaryColor,
      primaryHover: preset.primaryHover,
      accentColor: preset.accentColor,
      themeMode: preset.themeMode
    });
  };

  const handleSelectFont = (font: PresetFontOption) => {
    updateBackstageTheme({
      fontFamily: font.id
    });
  };

  const handleSelectMode = (mode: ThemeMode) => {
    updateBackstageTheme({ themeMode: mode });
  };

  const handleSelectRadius = (radius: ThemeBorderRadius) => {
    updateBackstageTheme({ borderRadius: radius });
  };

  const handleSelectDensity = (density: ThemeDensity) => {
    updateBackstageTheme({ uiDensity: density });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Slide-over Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="absolute right-0 top-0 bottom-0 max-w-md w-full bg-white border-l border-[#EAE2D8] shadow-2xl flex flex-col justify-between text-[#1F1A16] z-10"
          >
            {/* 1. Header */}
            <div className="p-5 border-b border-[#EAE2D8] bg-[#FAF7F2] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-white border border-[#EAE2D8] flex items-center justify-center text-[#B23812] shadow-2xs">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-base text-[#1F1A16]">
                    Kustomisasi Tema Backstage
                  </h3>
                  <p className="text-[11px] text-[#5C5248]">
                    Atur palet warna brand, tipografi & layout
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={resetBackstageTheme}
                  title="Reset ke Default"
                  className="p-2 rounded-xl bg-white hover:bg-stone-200 text-[#5C5248] border border-[#EAE2D8] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white hover:bg-stone-200 text-[#5C5248] border border-[#EAE2D8] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. Navigation Tabs */}
            <div className="flex items-center gap-1 px-4 py-2 border-b border-[#EAE2D8] bg-white overflow-x-auto scrollbar-none text-xs font-bold">
              <button
                onClick={() => setActiveTab('presets')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'presets'
                    ? 'bg-[#1F1A16] text-white shadow-2xs'
                    : 'text-[#5C5248] hover:bg-[#FAF7F2]'
                }`}
              >
                Preset Brand
              </button>

              <button
                onClick={() => setActiveTab('colors')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'colors'
                    ? 'bg-[#1F1A16] text-white shadow-2xs'
                    : 'text-[#5C5248] hover:bg-[#FAF7F2]'
                }`}
              >
                Warna & Hex
              </button>

              <button
                onClick={() => setActiveTab('fonts')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'fonts'
                    ? 'bg-[#1F1A16] text-white shadow-2xs'
                    : 'text-[#5C5248] hover:bg-[#FAF7F2]'
                }`}
              >
                Tipografi
              </button>

              <button
                onClick={() => setActiveTab('layout')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'layout'
                    ? 'bg-[#1F1A16] text-white shadow-2xs'
                    : 'text-[#5C5248] hover:bg-[#FAF7F2]'
                }`}
              >
                Mode & Bentuk
              </button>
            </div>

            {/* 3. Main Content Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Tab 1: Presets */}
              {activeTab === 'presets' && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-[#5C5248] uppercase tracking-wider font-mono">
                    Pilih Preset Tema Resto:
                  </div>

                  <div className="space-y-2.5">
                    {THEME_COLOR_PRESETS.map((preset) => {
                      const isSelected = backstageTheme.colorPreset === preset.id;

                      return (
                        <div
                          key={preset.id}
                          onClick={() => handleSelectPreset(preset)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 relative ${
                            isSelected
                              ? 'bg-amber-50/60 border-[#C84B27] ring-2 ring-[#C84B27]/20 shadow-xs'
                              : 'bg-[#FAF7F2] border-[#EAE2D8] hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-[#1F1A16]">{preset.name}</span>
                              {isSelected && (
                                <span className="p-0.5 rounded-full bg-[#C84B27] text-white">
                                  <Check className="w-3 h-3" />
                                </span>
                              )}
                            </div>

                            {/* Color Swatch Dots */}
                            <div className="flex items-center -space-x-1">
                              {preset.previewColors.map((color, idx) => (
                                <span
                                  key={idx}
                                  className="w-4 h-4 rounded-full border border-white shadow-2xs shrink-0"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </div>

                          <p className="text-[11px] text-[#5C5248] leading-snug">
                            {preset.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 2: Custom Colors & Hex */}
              {activeTab === 'colors' && (
                <div className="space-y-4">
                  <div className="text-xs font-bold text-[#5C5248] uppercase tracking-wider font-mono">
                    Penyesuaian Palet Warna Utama:
                  </div>

                  {/* Primary Color Picker */}
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8] space-y-2">
                    <label className="text-xs font-bold text-[#1F1A16] block">
                      Warna Utama Brand (Primary):
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={backstageTheme.primaryColor}
                        onChange={(e) => updateBackstageTheme({ primaryColor: e.target.value })}
                        className="w-10 h-10 rounded-xl border border-[#EAE2D8] cursor-pointer bg-white p-1 shrink-0"
                      />
                      <input
                        type="text"
                        value={backstageTheme.primaryColor}
                        onChange={(e) => updateBackstageTheme({ primaryColor: e.target.value })}
                        className="flex-1 px-3 py-2 bg-white border border-[#EAE2D8] rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-[#C84B27]"
                      />
                    </div>
                  </div>

                  {/* Primary Hover Color Picker */}
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8] space-y-2">
                    <label className="text-xs font-bold text-[#1F1A16] block">
                      Warna Hover Tombol (Primary Hover):
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={backstageTheme.primaryHover}
                        onChange={(e) => updateBackstageTheme({ primaryHover: e.target.value })}
                        className="w-10 h-10 rounded-xl border border-[#EAE2D8] cursor-pointer bg-white p-1 shrink-0"
                      />
                      <input
                        type="text"
                        value={backstageTheme.primaryHover}
                        onChange={(e) => updateBackstageTheme({ primaryHover: e.target.value })}
                        className="flex-1 px-3 py-2 bg-white border border-[#EAE2D8] rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-[#C84B27]"
                      />
                    </div>
                  </div>

                  {/* Accent Color Picker */}
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8] space-y-2">
                    <label className="text-xs font-bold text-[#1F1A16] block">
                      Warna Aksen & Highlight (Accent):
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={backstageTheme.accentColor}
                        onChange={(e) => updateBackstageTheme({ accentColor: e.target.value })}
                        className="w-10 h-10 rounded-xl border border-[#EAE2D8] cursor-pointer bg-white p-1 shrink-0"
                      />
                      <input
                        type="text"
                        value={backstageTheme.accentColor}
                        onChange={(e) => updateBackstageTheme({ accentColor: e.target.value })}
                        className="flex-1 px-3 py-2 bg-white border border-[#EAE2D8] rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-[#C84B27]"
                      />
                    </div>
                  </div>

                  {/* Quick Color Chips */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-mono text-[#5C5248] font-bold block">Pilihan Cepat Warna Populer:</span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: 'Terracotta', color: '#C84B27', hover: '#B23E1C' },
                        { name: 'Espresso', color: '#8B4513', hover: '#70360D' },
                        { name: 'Royal Blue', color: '#2563EB', hover: '#1D4ED8' },
                        { name: 'Matcha Green', color: '#15803D', hover: '#166534' },
                        { name: 'Crimson Bistro', color: '#E11D48', hover: '#BE123C' },
                        { name: 'Amber Gold', color: '#D97706', hover: '#B45309' },
                        { name: 'Obsidian Black', color: '#18181B', hover: '#27272A' }
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => updateBackstageTheme({ primaryColor: item.color, primaryHover: item.hover })}
                          className="px-2.5 py-1.5 rounded-xl border border-[#EAE2D8] bg-white hover:bg-stone-100 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                        >
                          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                          <span>{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Typography & Fonts */}
              {activeTab === 'fonts' && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-[#5C5248] uppercase tracking-wider font-mono">
                    Pilih Gaya Tipografi:
                  </div>

                  <div className="space-y-2.5">
                    {THEME_FONT_PRESETS.map((font) => {
                      const isSelected = backstageTheme.fontFamily === font.id;

                      return (
                        <div
                          key={font.id}
                          onClick={() => handleSelectFont(font)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                            isSelected
                              ? 'bg-amber-50/60 border-[#C84B27] ring-2 ring-[#C84B27]/20 shadow-xs'
                              : 'bg-[#FAF7F2] border-[#EAE2D8] hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-[#1F1A16]">{font.name}</span>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white border border-[#EAE2D8] text-[#5C5248]">
                              {font.category}
                            </span>
                          </div>

                          <div 
                            className="text-sm text-[#1F1A16] pt-1"
                            style={{ fontFamily: font.cssFamily }}
                          >
                            {font.previewText}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 4: Mode & Layout Shape */}
              {activeTab === 'layout' && (
                <div className="space-y-5">
                  {/* Mode Tampilan */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#5C5248] uppercase tracking-wider font-mono block">
                      Mode Tampilan Backstage:
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'warm' as ThemeMode, name: 'Warm Artisan (Default)', icon: Coffee, desc: 'Nuansa hangat kafe' },
                        { id: 'light' as ThemeMode, name: 'Clean Light', icon: Sun, desc: 'Putih bersih modern' },
                        { id: 'dark' as ThemeMode, name: 'Midnight Dark', icon: Moon, desc: 'Mode gelap OLED' },
                        { id: 'espresso' as ThemeMode, name: 'Espresso Lounge', icon: Coffee, desc: 'Lounge cokelat gelap' },
                        { id: 'slate' as ThemeMode, name: 'Nordic Slate', icon: Layers, desc: 'Abu-abu kebiruan' }
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => handleSelectMode(m.id)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                            backstageTheme.themeMode === m.id
                              ? 'bg-[#1F1A16] text-white border-[#1F1A16] shadow-xs'
                              : 'bg-[#FAF7F2] text-[#1F1A16] border-[#EAE2D8] hover:bg-stone-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <m.icon className="w-4 h-4" />
                            <span className="font-bold text-xs">{m.name}</span>
                          </div>
                          <span className={`text-[10px] block mt-1 ${backstageTheme.themeMode === m.id ? 'text-stone-300' : 'text-[#5C5248]'}`}>
                            {m.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Border Radius Style */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#5C5248] uppercase tracking-wider font-mono block">
                      Kelengkungan Sudut (Corner Radius):
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                      {[
                        { id: 'sharp' as ThemeBorderRadius, name: 'Sharp (8px)' },
                        { id: 'rounded' as ThemeBorderRadius, name: 'Balanced (16px)' },
                        { id: 'pill' as ThemeBorderRadius, name: 'Super Soft (24px)' }
                      ].map((r) => (
                        <button
                          key={r.id}
                          onClick={() => handleSelectRadius(r.id)}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            backstageTheme.borderRadius === r.id
                              ? 'bg-[#C84B27] text-white border-[#C84B27] shadow-2xs'
                              : 'bg-[#FAF7F2] text-[#5C5248] border-[#EAE2D8] hover:bg-stone-200'
                          }`}
                        >
                          {r.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* UI Density */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#5C5248] uppercase tracking-wider font-mono block">
                      Kepadatan Tampilan (UI Density):
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                      {[
                        { id: 'compact' as ThemeDensity, name: 'Kompak' },
                        { id: 'comfortable' as ThemeDensity, name: 'Nyaman' },
                        { id: 'spacious' as ThemeDensity, name: 'Lega' }
                      ].map((d) => (
                        <button
                          key={d.id}
                          onClick={() => handleSelectDensity(d.id)}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            backstageTheme.uiDensity === d.id
                              ? 'bg-[#C84B27] text-white border-[#C84B27] shadow-2xs'
                              : 'bg-[#FAF7F2] text-[#5C5248] border-[#EAE2D8] hover:bg-stone-200'
                          }`}
                        >
                          {d.name}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* Live Preview Widget */}
              <div className="p-4 rounded-2xl border border-[#EAE2D8] bg-white shadow-xs space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#5C5248] font-bold">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#B23812]" />
                    <span>Pratinjau Elemen UI Live:</span>
                  </span>
                  <span>Aktif</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-xs text-[#1F1A16]">
                      Kopi Susu Homie Signature
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200">
                      Margin 72%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[#5C5248]">Harga: Rp 24.000</span>
                    <button
                      className="px-3 py-1.5 rounded-xl text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
                      style={{ backgroundColor: backstageTheme.primaryColor }}
                    >
                      + Tambah Bill
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* 4. Footer */}
            <div className="p-4 border-t border-[#EAE2D8] bg-[#FAF7F2] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#5C5248]">
                Tersimpan otomatis di sistem
              </span>

              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-2xl bg-[#1F1A16] hover:bg-black text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                Selesai Kustomisasi
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
