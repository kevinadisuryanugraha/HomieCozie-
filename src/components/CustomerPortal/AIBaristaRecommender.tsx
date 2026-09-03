import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Coffee, 
  UtensilsCrossed, 
  Flame, 
  Heart, 
  Plus, 
  Check, 
  Compass, 
  ChevronRight,
  Zap,
  Leaf,
  Sun,
  Moon
} from 'lucide-react';
import { MenuItem } from '../../types';
import { INITIAL_MENU_ITEMS } from '../../data/mockData';

interface AIBaristaRecommenderProps {
  onAddPairingBundle: (drink: MenuItem, food: MenuItem) => void;
}

interface VibePreset {
  id: string;
  icon: any;
  label: string;
  badge: string;
  desc: string;
  drinkId: string;
  foodId: string;
  baristaNote: string;
  flavorTags: string[];
}

const VIBE_PRESETS: VibePreset[] = [
  {
    id: 'focus-booster',
    icon: Zap,
    label: '⚡ Deep Work & Fokus Produktif',
    badge: 'Kafein Optimal',
    desc: 'Espresso bold dengan susu pasteurisasi dipadukan pastry renyah berenergi.',
    drinkId: 'm-1', // Kopi Susu Homie Signature
    foodId: 'm-8', // Croissant Almond
    baristaNote: 'Kombinasi klasik aroma nutty almond menyempurnakan rasa manis legit gula aren organik.',
    flavorTags: ['Nutty', 'Sweet Aren', 'Creamy', 'Flaky Buttery']
  },
  {
    id: 'afternoon-chill',
    icon: Sun,
    label: '🌿 Santai Sore & Sweet Mood',
    badge: 'Creamy & Fresh',
    desc: 'Mocktail segar atau latte lembut dengan camilan gurih renyah.',
    drinkId: 'm-3', // Artisan Matcha Latte
    foodId: 'm-7', // Truffle Parmesan Fries
    baristaNote: 'Rasa gurih keju parmesan dan aroma minyak truffle mengimbangi manis lembut matcha Uji.',
    flavorTags: ['Earthly Umami', 'Savory Truffle', 'Crispy', 'Soothing']
  },
  {
    id: 'heavy-hunger',
    icon: Flame,
    label: '🍽️ Makan Berat & Comfort Food',
    badge: 'Kenyang Maksimal',
    desc: 'Hidangan utama lezat dengan manual brew kopi single origin.',
    drinkId: 'm-2', // V60 Manual Brew Flores Bajawa
    foodId: 'm-5', // Nasi Goreng Kampung Homie
    baristaNote: 'Keasaman bersih floral V60 Flores menyeimbangkan bumbu rempah dan gurihnya sambal terasi.',
    flavorTags: ['Floral Citrus', 'Spicy Savory', 'Smoky Wok', 'Clean Aftertaste']
  },
  {
    id: 'tropical-refresh',
    icon: Leaf,
    label: '🍓 Segar Tropis Non-Kafein',
    badge: 'Fruity & Zesty',
    desc: 'Kombinasi mocktail buah dingin dengan pasta creamy.',
    drinkId: 'm-4', // Cascara Berry Fizz
    foodId: 'm-6', // Creamy Truffle Pasta
    baristaNote: 'Soda buah beri merah yang asam segar memecah kekentalan saus krim pasta truffle.',
    flavorTags: ['Berry Sweet', 'Zesty Soda', 'Creamy Mushroom', 'Refreshing']
  }
];

export const AIBaristaRecommender: React.FC<AIBaristaRecommenderProps> = ({
  onAddPairingBundle
}) => {
  const [activeVibeId, setActiveVibeId] = useState<string>(VIBE_PRESETS[0].id);
  const [isBundleAdded, setIsBundleAdded] = useState<boolean>(false);

  const activePreset = VIBE_PRESETS.find(p => p.id === activeVibeId) || VIBE_PRESETS[0];

  const drinkItem = INITIAL_MENU_ITEMS.find(m => m.id === activePreset.drinkId) || INITIAL_MENU_ITEMS[0];
  const foodItem = INITIAL_MENU_ITEMS.find(m => m.id === activePreset.foodId) || INITIAL_MENU_ITEMS[7];

  const originalTotal = drinkItem.price + foodItem.price;
  const bundleDiscount = 5000;
  const bundlePrice = originalTotal - bundleDiscount;

  const handleApplyBundle = () => {
    onAddPairingBundle(drinkItem, foodItem);
    setIsBundleAdded(true);
    setTimeout(() => setIsBundleAdded(false), 2500);
  };

  return (
    <div className="bg-gradient-to-br from-[#FAF7F2] via-white to-amber-50/40 p-5 sm:p-7 rounded-3xl border-2 border-amber-200/80 shadow-md space-y-5 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-300/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header AI Barista */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE2D8] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#C84B27] text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-black text-base sm:text-lg text-[#1F1A16]">
                AI Barista: Smart Flavor Pairing
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#C84B27]/10 text-[#C84B27] border border-[#C84B27]/20">
                PROMO BUNDLE -Rp5.000
              </span>
            </div>
            <p className="text-xs text-[#5C5248]">
              Pilih suasana hati Anda, AI kami mencocokkan racikan kopi & makanan paling harmonis
            </p>
          </div>
        </div>
      </div>

      {/* Vibe Selection Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {VIBE_PRESETS.map((preset) => {
          const Icon = preset.icon;
          const isActive = preset.id === activeVibeId;
          return (
            <button
              key={preset.id}
              onClick={() => setActiveVibeId(preset.id)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                isActive
                  ? 'bg-white border-[#C84B27] shadow-md ring-2 ring-[#C84B27]/20'
                  : 'bg-white/70 border-[#EAE2D8] hover:bg-white text-[#5C5248]'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#C84B27]' : 'text-[#5C5248]'}`} />
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-amber-100 text-amber-900' : 'bg-stone-100 text-stone-600'}`}>
                  {preset.badge}
                </span>
              </div>
              <span className={`text-xs font-bold leading-snug line-clamp-1 ${isActive ? 'text-[#1F1A16]' : 'text-[#5C5248]'}`}>
                {preset.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Recommended Pairing Display */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EAE2D8] shadow-xs grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Drink & Food Items Duo */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Drink Card */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8]">
            <img 
              src={drinkItem.image} 
              alt={drinkItem.name} 
              className="w-14 h-14 rounded-xl object-cover border border-[#EAE2D8]"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono text-[#5C5248] uppercase block">Minuman Utama</span>
              <h4 className="font-bold text-xs text-[#1F1A16] truncate">{drinkItem.name}</h4>
              <span className="font-mono font-bold text-xs text-[#C84B27]">
                Rp{drinkItem.price.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Food Card */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8]">
            <img 
              src={foodItem.image} 
              alt={foodItem.name} 
              className="w-14 h-14 rounded-xl object-cover border border-[#EAE2D8]"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono text-[#5C5248] uppercase block">Pairing Makanan</span>
              <h4 className="font-bold text-xs text-[#1F1A16] truncate">{foodItem.name}</h4>
              <span className="font-mono font-bold text-xs text-[#C84B27]">
                Rp{foodItem.price.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* Action & Pricing Bundle Column */}
        <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-[#EAE2D8] pt-3 md:pt-0 md:pl-4 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-stone-400 line-through font-mono">
                Rp{originalTotal.toLocaleString('id-ID')}
              </span>
              <span className="font-display font-black text-xl text-[#C84B27]">
                Rp{bundlePrice.toLocaleString('id-ID')}
              </span>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold block">
              Hemat Rp5.000 dengan Paket Pairing AI
            </span>
          </div>

          <button
            onClick={handleApplyBundle}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 ${
              isBundleAdded
                ? 'bg-emerald-600 text-white shadow-emerald-200'
                : 'bg-[#C84B27] hover:bg-[#B23E1C] text-white shadow-md'
            }`}
          >
            {isBundleAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Paket Ditambahkan!</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Pesan Paket Pairing Ini</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Barista Tasting Notes Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-[#5C5248]">
        <div className="flex items-center gap-1.5">
          <Coffee className="w-3.5 h-3.5 text-[#C84B27]" />
          <span><strong>Catatan Barista:</strong> <em>"{activePreset.baristaNote}"</em></span>
        </div>
        <div className="flex items-center gap-1">
          {activePreset.flavorTags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-md bg-white border border-[#EAE2D8] text-[9px] font-mono text-[#5C5248]">
              #{tag}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
};
