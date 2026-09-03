import React from 'react';
import { motion } from 'motion/react';
import { 
  Home, 
  Calendar, 
  ShoppingBag, 
  Star, 
  MessageCircle
} from 'lucide-react';
import { AppMode } from '../../types';
import { CAFE_INFO } from '../../data/mockData';

interface MobileBottomDockProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  cartItemCount: number;
}

export const MobileBottomDock: React.FC<MobileBottomDockProps> = ({
  currentMode,
  onModeChange,
  cartItemCount
}) => {
  // Only show on customer-facing pages, not on Backstage, Auth, or PRD mode
  if (currentMode === 'backstage' || currentMode === 'auth' || currentMode === 'prd-pitch') {
    return null;
  }

  const navItems: { id: AppMode; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'customer', label: 'Beranda', icon: Home },
    { id: 'reservation', label: 'Booking', icon: Calendar },
    { id: 'order', label: 'Pesan', icon: ShoppingBag, badge: cartItemCount },
    { id: 'member', label: 'VIP Club', icon: Star }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-none p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <div className="max-w-md mx-auto pointer-events-auto flex items-center justify-between gap-1.5 bg-white/95 backdrop-blur-md border border-[#EAE2D8] rounded-2xl p-1.5 px-2 shadow-2xl">
        
        {/* Nav Buttons */}
        <div className="flex-1 grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentMode === item.id;

            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.94 }}
                onClick={() => onModeChange(item.id)}
                className={`relative py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-colors ${
                  isActive
                    ? 'text-white'
                    : 'text-[#5C5248] hover:text-[#1F1A16]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-dock-active"
                    className="absolute inset-0 bg-[#C84B27] rounded-xl -z-10 shadow-xs"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white stroke-[2.5]' : 'text-[#5C5248]'}`} />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 bg-stone-900 text-white text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full border border-white">
                      {item.badge}
                    </span>
                  )}
                </div>

                <span className={`text-[10px] font-semibold mt-0.5 leading-tight ${isActive ? 'text-white font-bold' : 'text-[#5C5248]'}`}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* WhatsApp Fast CTA Action */}
        <a
          href={`https://wa.me/${CAFE_INFO.whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20Homie%20Cozie,%20saya%20ingin%20tanya%20informasi...`}
          target="_blank"
          rel="noreferrer"
          className="w-10 h-10 rounded-xl bg-[#25D366] hover:bg-[#1EBE5B] text-white flex items-center justify-center shadow-md shrink-0 ml-1"
          aria-label="WhatsApp Cafe"
        >
          <MessageCircle className="w-4 h-4 fill-white text-white" />
        </a>

      </div>
    </div>
  );
};
