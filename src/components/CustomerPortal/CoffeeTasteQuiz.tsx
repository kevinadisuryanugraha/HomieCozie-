import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Coffee, 
  Flame, 
  CheckCircle2, 
  Plus, 
  ArrowRight,
  Snowflake,
  Sun,
  Citrus,
  GlassWater,
  Sliders,
  Check,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_MENU_ITEMS } from '../../data/mockData';
import { MenuItem } from '../../types';

interface CoffeeTasteQuizProps {
  onAddToCart: (item: MenuItem) => void;
  onOpenCustomizer?: (item: MenuItem) => void;
}

interface FlavorOption {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  recommendedMenuId: string;
  matchScore: number;
}

export const CoffeeTasteQuiz: React.FC<CoffeeTasteQuizProps> = ({ onAddToCart, onOpenCustomizer }) => {
  const [selectedFlavor, setSelectedFlavor] = useState<string>('creamy');
  const [temperature, setTemperature] = useState<'iced' | 'hot'>('iced');
  const [sweetnessLevel, setSweetnessLevel] = useState<'normal' | 'less' | 'no'>('normal');
  const [isAdded, setIsAdded] = useState(false);

  const flavorProfiles: FlavorOption[] = [
    {
      id: 'creamy',
      title: 'Kopi Susu Aren Gurih',
      subtitle: 'Creamy, manis aren legit, dan harum espresso khas',
      icon: Coffee,
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-900',
      borderColor: 'border-amber-200',
      recommendedMenuId: 'm-1', // Kopi Susu Homie Signature
      matchScore: 99
    },
    {
      id: 'fruity',
      title: 'Manual Brew V60 Fruity',
      subtitle: 'Aroma berry, bunga melati, acidity lembut & bersih',
      icon: Sparkles,
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-800',
      borderColor: 'border-emerald-200',
      recommendedMenuId: 'm-3', // V60 Single Origin
      matchScore: 96
    },
    {
      id: 'bold',
      title: 'Bold & Strong Espresso',
      subtitle: 'Dark cocoa, tebal di lidah, ekstra boost energi',
      icon: Flame,
      iconBg: 'bg-[#C84B27]/10',
      iconColor: 'text-[#C84B27]',
      borderColor: 'border-orange-200',
      recommendedMenuId: 'm-2', // Aren Cremosa Cozie
      matchScore: 94
    },
    {
      id: 'fresh',
      title: 'Segar Soda & Mocktail Tea',
      subtitle: 'Non-kopi, sparkling peach, teh artisan menyegarkan',
      icon: Citrus,
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-800',
      borderColor: 'border-purple-200',
      recommendedMenuId: 'm-5', // Berry Breeze Mojito
      matchScore: 97
    }
  ];

  const currentProfile = flavorProfiles.find((f) => f.id === selectedFlavor) || flavorProfiles[0];
  const matchedItem = INITIAL_MENU_ITEMS.find((m) => m.id === currentProfile.recommendedMenuId) || INITIAL_MENU_ITEMS[0];

  const handleQuickAdd = () => {
    onAddToCart(matchedItem);
    setIsAdded(true);
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch {}
    setTimeout(() => setIsAdded(false), 2500);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  return (
    <section className="py-12 bg-[#F5EFEB] border-b border-[#EAE2D8] text-[#1F1A16] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-900 border border-amber-500/20 text-xs font-mono font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C84B27]" />
              <span>Interactive Taste Finder</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1F1A16] tracking-tight">
              Cari Racikan Seduhan Sesuai Mood Hari Ini
            </h2>
            <p className="text-xs sm:text-sm text-[#5C5248] mt-1 max-w-xl">
              Pilih profil rasa yang kamu sukai, kami akan mencarikan menu yang paling pas untuk santap di tempat atau take-away.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-[#5C5248]">
            <Sliders className="w-4 h-4 text-[#C84B27]" />
            <span>Live Barista Matcher</span>
          </div>
        </div>

        {/* 2-Columns Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 7-COLS: Selection Options */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Flavor Profile Choice */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-[#1F1A16] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#C84B27] text-white flex items-center justify-center text-[10px] font-bold">1</span>
                <span>Pilih Karakter Rasa Favorit:</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {flavorProfiles.map((flavor) => {
                  const isSelected = selectedFlavor === flavor.id;
                  const IconComp = flavor.icon;

                  return (
                    <motion.button
                      key={flavor.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedFlavor(flavor.id)}
                      className={`p-4 rounded-2xl text-left transition-all border flex items-start gap-3.5 relative shadow-xs cursor-pointer ${
                        isSelected 
                          ? 'bg-white border-[#C84B27] ring-2 ring-[#C84B27]/20 shadow-md' 
                          : 'bg-white border-[#EAE2D8] hover:border-[#D5C9BC] hover:bg-white/80'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl ${flavor.iconBg} ${flavor.iconColor} border ${flavor.borderColor} flex items-center justify-center shrink-0`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="font-bold text-xs sm:text-sm text-[#1F1A16] flex items-center justify-between gap-1.5">
                          <span className="truncate">{flavor.title}</span>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-[#C84B27] shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-[#5C5248] leading-snug">
                          {flavor.subtitle}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Serving Style & Sweetness */}
            <div className="space-y-2.5 pt-2">
              <label className="text-xs font-bold text-[#1F1A16] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#C84B27] text-white flex items-center justify-center text-[10px] font-bold">2</span>
                <span>Penyajian & Level Manis:</span>
              </label>

              <div className="flex flex-wrap items-center gap-3">
                {/* Temperature Switcher */}
                <div className="flex items-center p-1 bg-white rounded-2xl border border-[#EAE2D8] text-xs font-bold shadow-xs">
                  <button
                    onClick={() => setTemperature('iced')}
                    className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                      temperature === 'iced' 
                        ? 'bg-sky-600 text-white shadow-xs' 
                        : 'text-[#5C5248] hover:text-[#1F1A16] hover:bg-stone-50'
                    }`}
                  >
                    <Snowflake className="w-3.5 h-3.5" />
                    <span>Dingin (Iced)</span>
                  </button>
                  <button
                    onClick={() => setTemperature('hot')}
                    className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                      temperature === 'hot' 
                        ? 'bg-[#C84B27] text-white shadow-xs' 
                        : 'text-[#5C5248] hover:text-[#1F1A16] hover:bg-stone-50'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Hangat (Hot)</span>
                  </button>
                </div>

                {/* Sweetness Switcher */}
                <div className="flex items-center p-1 bg-white rounded-2xl border border-[#EAE2D8] text-xs font-bold shadow-xs">
                  <button
                    onClick={() => setSweetnessLevel('normal')}
                    className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                      sweetnessLevel === 'normal' 
                        ? 'bg-[#C84B27] text-white shadow-xs' 
                        : 'text-[#5C5248] hover:text-[#1F1A16] hover:bg-stone-50'
                    }`}
                  >
                    Manis Pas (100%)
                  </button>
                  <button
                    onClick={() => setSweetnessLevel('less')}
                    className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                      sweetnessLevel === 'less' 
                        ? 'bg-[#C84B27] text-white shadow-xs' 
                        : 'text-[#5C5248] hover:text-[#1F1A16] hover:bg-stone-50'
                    }`}
                  >
                    Less Sugar (50%)
                  </button>
                  <button
                    onClick={() => setSweetnessLevel('no')}
                    className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                      sweetnessLevel === 'no' 
                        ? 'bg-[#C84B27] text-white shadow-xs' 
                        : 'text-[#5C5248] hover:text-[#1F1A16] hover:bg-stone-50'
                    }`}
                  >
                    No Sugar (0%)
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT 5-COLS: Live Matched Recommendation Card */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedFlavor}-${temperature}-${sweetnessLevel}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE2D8] shadow-lg relative overflow-hidden"
              >
                {/* Match Score Badge */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#EAE2D8]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-900">
                      Rekomendasi Barista:
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                    {currentProfile.matchScore}% Match
                  </span>
                </div>

                {/* Product Detail Preview */}
                <div className="flex items-center gap-4 py-4">
                  <img
                    src={matchedItem.image}
                    alt={matchedItem.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-[#EAE2D8] shrink-0 shadow-xs"
                  />
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="text-[11px] font-mono font-semibold text-[#5C5248] uppercase tracking-wider">
                      {matchedItem.categoryLabel || matchedItem.category}
                    </div>
                    <h3 className="font-display font-black text-base sm:text-lg text-[#1F1A16] leading-tight truncate">
                      {matchedItem.name}
                    </h3>
                    <p className="text-xs text-[#5C5248] line-clamp-2 leading-relaxed">
                      {matchedItem.description}
                    </p>
                    <div className="font-mono font-black text-[#C84B27] text-base pt-1">
                      {formatRupiah(matchedItem.price)}
                    </div>
                  </div>
                </div>

                {/* Selected Customization Preview Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pb-4 text-[11px] font-mono text-[#5C5248]">
                  <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#EAE2D8] flex items-center gap-1">
                    {temperature === 'iced' ? (
                      <>
                        <Snowflake className="w-3 h-3 text-sky-600" />
                        <span>Dingin (Ice)</span>
                      </>
                    ) : (
                      <>
                        <Flame className="w-3 h-3 text-[#C84B27]" />
                        <span>Hangat (Hot)</span>
                      </>
                    )}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#EAE2D8]">
                    Gula: {sweetnessLevel === 'normal' ? 'Normal 100%' : sweetnessLevel === 'less' ? 'Less 50%' : 'Tanpa Gula 0%'}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#EAE2D8]">
                    Susu: Dairy / Oat (+5K)
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#EAE2D8]">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleQuickAdd}
                    className={`flex-1 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                      isAdded 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-[#C84B27] hover:bg-[#B23E1C] text-white'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Berhasil Ditambahkan!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Pesan Racikan Ini Langsung</span>
                      </>
                    )}
                  </motion.button>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
};
