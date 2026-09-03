import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Check, 
  Zap, 
  Sun, 
  Moon, 
  Flame,
  Utensils,
  Coffee
} from 'lucide-react';
import { MenuItem } from '../../types';
import { INITIAL_MENU_ITEMS } from '../../data/mockData';

interface AIBaristaRecommenderProps {
  onAddPairingBundle: (drink: MenuItem, food: MenuItem) => void;
}

interface VibePreset {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  shortDesc: string;
  drinkId: string;
  foodId: string;
  baristaNote: string;
}

const VIBE_PRESETS: VibePreset[] = [
  {
    id: 'focus-booster',
    icon: Zap,
    label: 'Fokus Kerja',
    shortDesc: 'Kopi bold & pastry renyah penambah stamina',
    drinkId: 'm-1', // Kopi Susu Homie Signature
    foodId: 'm-8', // Croissant Almond
    baristaNote: 'Aroma almond panggang berpadu pas dengan rasa gurih manis gula aren organik.'
  },
  {
    id: 'afternoon-chill',
    icon: Sun,
    label: 'Santai Sore',
    shortDesc: 'Matcha lembut & camilan gurih',
    drinkId: 'm-3', // Artisan Matcha Latte
    foodId: 'm-7', // Truffle Parmesan Fries
    baristaNote: 'Keju parmesan gurih dan aroma truffle mengimbangi rasa lembut matcha Uji.'
  },
  {
    id: 'night-acoustic',
    icon: Moon,
    label: 'Musik & Hangout',
    shortDesc: 'Kopi cremosa & platter sharing',
    drinkId: 'm-2', // Aren Cremosa Cozie
    foodId: 'm-6', // Platter Mix Homie
    baristaNote: 'Porsi sharing pas untuk dinikmati bersama teman saat live acoustic weekend.'
  },
  {
    id: 'comfort-hungry',
    icon: Flame,
    label: 'Makan Kenyang',
    shortDesc: 'Iced Americano & Nasi Goreng Kampung',
    drinkId: 'm-4', // Signature Iced Americano
    foodId: 'm-4', // Nasi Goreng Kampung
    baristaNote: 'Segarnya espresso dingin membersihkan rasa gurih kaya rempah dari nasi goreng.'
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

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#EAE2D8] shadow-xs space-y-5">
      
      {/* Header & Segmented Pill Tabs */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h3 className="font-display font-bold text-base sm:text-lg text-[#1F1A16]">
            Paket Pairing Pilihan Barista
          </h3>
          <span className="text-xs text-[#8C341A] font-mono font-semibold">
            Hemat Rp 5.000 per paket
          </span>
        </div>

        {/* Clean Segmented Tab Group */}
        <div className="p-1.5 bg-[#FAF7F2] rounded-xl border border-[#EAE2D8] grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {VIBE_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isActive = preset.id === activeVibeId;
            return (
              <button
                key={preset.id}
                onClick={() => setActiveVibeId(preset.id)}
                className={`relative flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'text-[#1F1A16]'
                    : 'text-[#5C5248] hover:text-[#1F1A16] hover:bg-white/60'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pairing-pill"
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    className="absolute inset-0 bg-white rounded-lg shadow-xs border border-[#EAE2D8] z-0"
                  />
                )}
                <Icon className={`w-3.5 h-3.5 shrink-0 relative z-10 ${isActive ? 'text-[#C84B27]' : 'text-[#5C5248]'}`} />
                <span className="relative z-10 font-bold truncate">{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pairing Preview Box */}
      <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-xl border border-[#EAE2D8] space-y-4">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          
          {/* Items Duo with Plus divider */}
          <div className="lg:col-span-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            
            {/* Drink Card */}
            <div className="flex-1 flex items-center gap-3 p-3 rounded-xl bg-white border border-[#EAE2D8] shadow-2xs">
              <img 
                src={drinkItem.image} 
                alt={drinkItem.name} 
                className="w-13 h-13 rounded-lg object-cover border border-[#EAE2D8] shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-mono text-[#5C5248] uppercase">Minuman</div>
                <div className="font-bold text-xs text-[#1F1A16] truncate">{drinkItem.name}</div>
                <div className="font-mono font-bold text-xs text-[#8C341A] mt-0.5">
                  {formatRupiah(drinkItem.price)}
                </div>
              </div>
            </div>

            {/* Plus sign */}
            <div className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-white border border-[#EAE2D8] text-[#5C5248] shrink-0">
              <Plus className="w-3.5 h-3.5" />
            </div>

            {/* Food Card */}
            <div className="flex-1 flex items-center gap-3 p-3 rounded-xl bg-white border border-[#EAE2D8] shadow-2xs">
              <img 
                src={foodItem.image} 
                alt={foodItem.name} 
                className="w-13 h-13 rounded-lg object-cover border border-[#EAE2D8] shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-mono text-[#5C5248] uppercase">Makanan / Bites</div>
                <div className="font-bold text-xs text-[#1F1A16] truncate">{foodItem.name}</div>
                <div className="font-mono font-bold text-xs text-[#8C341A] mt-0.5">
                  {formatRupiah(foodItem.price)}
                </div>
              </div>
            </div>

          </div>

          {/* Pricing & CTA Button */}
          <div className="lg:col-span-4 flex sm:flex-row lg:flex-col items-center sm:justify-between lg:justify-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l border-[#EAE2D8] lg:pl-5">
            <div className="text-left lg:text-right w-full sm:w-auto lg:w-full">
              <div className="text-[11px] text-[#5C5248] line-through font-mono">
                {formatRupiah(originalTotal)}
              </div>
              <div className="font-mono font-black text-lg text-[#1F1A16]">
                {formatRupiah(bundlePrice)}
              </div>
            </div>

            <button
              onClick={handleApplyBundle}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer ${
                isBundleAdded
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#C84B27] hover:bg-[#B23E1C] text-white'
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
                  <span>Pesan Paket Ini</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Barista Note */}
        <p className="text-xs text-[#5C5248] leading-relaxed pt-2 border-t border-[#EAE2D8]/60">
          <span className="font-semibold text-[#1F1A16]">Catatan Barista:</span> {activePreset.baristaNote}
        </p>

      </div>

    </div>
  );
};
