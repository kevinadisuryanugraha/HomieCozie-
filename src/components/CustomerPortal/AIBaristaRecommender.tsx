import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coffee, 
  UtensilsCrossed, 
  Flame, 
  Heart, 
  Plus, 
  Check, 
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
    label: 'Deep Work & Fokus Produktif',
    desc: 'Espresso bold dengan susu pasteurisasi dipadukan pastry renyah berenergi.',
    drinkId: 'm-1', // Kopi Susu Homie Signature
    foodId: 'm-8', // Croissant Almond
    baristaNote: 'Kombinasi klasik aroma nutty almond menyempurnakan rasa manis legit gula aren organik.',
    flavorTags: ['Nutty', 'Sweet Aren', 'Creamy', 'Flaky Buttery']
  },
  {
    id: 'afternoon-chill',
    icon: Sun,
    label: 'Santai Sore & Sweet Mood',
    desc: 'Mocktail segar atau latte lembut dengan camilan gurih renyah.',
    drinkId: 'm-3', // Artisan Matcha Latte
    foodId: 'm-7', // Truffle Parmesan Fries
    baristaNote: 'Rasa gurih keju parmesan dan aroma minyak truffle mengimbangi manis lembut matcha Uji.',
    flavorTags: ['Earthly Umami', 'Savory Truffle', 'Crispy', 'Soothing']
  },
  {
    id: 'night-acoustic',
    icon: Moon,
    label: 'Live Music & Hangout Malam',
    desc: 'Seduhan manual brew ringan atau mocktail berkarbonasi dengan platter sharing.',
    drinkId: 'm-2', // Aren Cremosa Cozie
    foodId: 'm-6', // Platter Mix Homie
    baristaNote: 'Kombinasi sempurna untuk ngobrol santai sambil menikmati musik akustik akhir pekan.',
    flavorTags: ['Bold Coffee', 'Crunchy Savory', 'Sharing Size', 'Party Mood']
  },
  {
    id: 'comfort-hungry',
    icon: Flame,
    label: 'Makan Kenyang & Santap Hangat',
    desc: 'Iced Americano atau Teh Artisan dipadukan hidangan utama khas dapur.',
    drinkId: 'm-4', // Signature Iced Americano
    foodId: 'm-4', // Nasi Goreng Kampung
    baristaNote: 'Acidity segar espresso dingin membersihkan rasa gurih pedas rempah nasi goreng.',
    flavorTags: ['Smoky Rempah', 'Clean Citrus', 'Savory Warm', 'Energizing']
  }
];

export const AIBaristaRecommender: React.FC<AIBaristaRecommenderProps> = ({ onAddPairingBundle }) => {
  const [activeVibeId, setActiveVibeId] = useState<string>('focus-booster');
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
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#EAE2D8] shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAE2D8] pb-4">
        <div>
          <h3 className="font-display font-bold text-base sm:text-lg text-[#1F1A16]">
            Paket Pairing Kopi & Makanan
          </h3>
          <p className="text-xs text-[#5C5248]">
            Kombinasi menu pilihan barista dengan potongan harga hemat Rp 5.000 per paket.
          </p>
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
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                isActive
                  ? 'bg-[#FAF7F2] border-[#C84B27] shadow-xs'
                  : 'bg-white border-[#EAE2D8] hover:bg-stone-50 text-[#5C5248]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#8C341A]' : 'text-[#5C5248]'}`} />
              <span className={`text-xs font-bold leading-snug line-clamp-2 ${isActive ? 'text-[#1F1A16]' : 'text-[#5C5248]'}`}>
                {preset.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Recommended Pairing Display */}
      <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-xl border border-[#EAE2D8] grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Drink & Food Items Duo */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Drink Card */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#EAE2D8]">
            <img 
              src={drinkItem.image} 
              alt={drinkItem.name} 
              className="w-14 h-14 rounded-xl object-cover border border-[#EAE2D8]"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono text-[#5C5248] uppercase block">Minuman Utama</span>
              <div className="font-bold text-xs text-[#1F1A16] truncate">{drinkItem.name}</div>
              <span className="font-mono font-bold text-xs text-[#8C341A]">
                Rp{drinkItem.price.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Food Card */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#EAE2D8]">
            <img 
              src={foodItem.image} 
              alt={foodItem.name} 
              className="w-14 h-14 rounded-xl object-cover border border-[#EAE2D8]"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono text-[#5C5248] uppercase block">Makanan / Pendamping</span>
              <div className="font-bold text-xs text-[#1F1A16] truncate">{foodItem.name}</div>
              <span className="font-mono font-bold text-xs text-[#8C341A]">
                Rp{foodItem.price.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* Action / Price CTA */}
        <div className="md:col-span-4 flex flex-col items-center sm:items-end justify-center gap-2 border-t md:border-t-0 md:border-l border-[#EAE2D8] pt-3 md:pt-0 md:pl-4">
          <div className="text-right w-full flex md:flex-col items-center md:items-end justify-between">
            <span className="text-xs text-[#5C5248] line-through font-mono">
              Rp{originalTotal.toLocaleString('id-ID')}
            </span>
            <div className="font-mono font-black text-lg text-[#1F1A16]">
              Rp{bundlePrice.toLocaleString('id-ID')}
            </div>
          </div>

          <button
            onClick={handleApplyBundle}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              isBundleAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-[#C84B27] hover:bg-[#B23E1C] text-white shadow-xs'
            }`}
          >
            {isBundleAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Bundle Ditambahkan</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Pesan Paket Hemat</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
