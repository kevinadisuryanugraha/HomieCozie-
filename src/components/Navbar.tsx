import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { AppMode, SystemUser } from '../types';
import { 
  CalendarDays, 
  ShoppingBag, 
  Star, 
  Gift, 
  Menu, 
  X
} from 'lucide-react';
import { CAFE_INFO } from '../data/mockData';

interface NavbarProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  cartItemCount: number;
  activeCustomerTab: string;
  onSelectCustomerTab: (tab: string) => void;
  currentUser?: SystemUser;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onModeChange,
  cartItemCount,
  activeCustomerTab,
  onSelectCustomerTab
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001
  });

  const navLinks = [
    { id: 'hero', label: 'Beranda' },
    { id: 'about', label: 'Tentang' },
    { id: 'menu', label: 'Menu' },
    { id: 'gallery', label: 'Galeri' },
    { id: 'events', label: 'Event' },
    { id: 'loyalty', label: 'Loyalitas' },
    { id: 'faq', label: 'FAQ' },
    { id: 'location', label: 'Lokasi' }
  ];

  const handleNavClick = (tabId: string) => {
    setIsMobileMenuOpen(false);
    if (currentMode !== 'customer') {
      onModeChange('customer');
      setTimeout(() => {
        const elem = document.getElementById(`${tabId}-section`);
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    } else {
      onSelectCustomerTab(tabId);
      const elem = document.getElementById(`${tabId}-section`);
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#EAE2D8] text-[#1F1A16] transition-colors shadow-xs">
      
      {/* Top Utility Ribbon (Desktop & Tablet) */}
      <div className="hidden sm:block bg-[#FAF7F2] text-[#5C5248] px-4 py-1.5 text-xs border-b border-[#EAE2D8]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-amber-700 font-semibold text-[11px]">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{CAFE_INFO.googleRating} Rating ({CAFE_INFO.totalGoogleReviews}+ Ulasan Google)</span>
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-[#8C7E72] text-[11px]">
              Jl. H. Hasan No. 23, Pasar Rebo, Jakarta Timur
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs font-medium">
            <span className="text-[#5C5248] text-[11px]">
              Buka: 10:00 – 23:00 WIB
            </span>
            <span className="text-amber-700 font-semibold text-[11px]">
              Live Music: Weekend 19:30 WIB
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 overflow-x-hidden">
        
        {/* Left: Brand Identity */}
        <div 
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none shrink min-w-0"
          id="brand-logo-btn"
        >
          <div className="w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-[#EAE2D8] bg-stone-100 p-0.5 flex items-center justify-center shadow-xs shrink-0">
            <img
              src={CAFE_INFO.logo}
              alt="Homie Cozie Logo"
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="min-w-0">
            <h1 className="font-display font-black text-sm sm:text-lg text-[#1F1A16] leading-none tracking-tight truncate">
              Homie Cozie
            </h1>
            <p className="text-[10px] sm:text-[11px] text-[#8C7E72] font-medium mt-0.5 truncate">
              Coffee & Kitchen
            </p>
          </div>
        </div>

        {/* Center: Clean Text Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center space-x-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#EAE2D8] shrink-0">
          {navLinks.map((link) => {
            const isActive = currentMode === 'customer' && activeCustomerTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive 
                    ? 'bg-[#C84B27] text-white shadow-xs' 
                    : 'text-[#5C5248] hover:text-[#1F1A16] hover:bg-stone-200/60'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Reservation CTA, Order Cart, VIP, & Staff Auth */}
        <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Member VIP Portal Trigger */}
          <button
            onClick={() => onModeChange('member')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors border shrink-0 ${
              currentMode === 'member'
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-white text-[#5C5248] border-[#EAE2D8] hover:bg-[#FAF7F2] hover:text-[#1F1A16]'
            }`}
            title="Portal Member VIP"
          >
            <Gift className="w-3.5 h-3.5 text-amber-600" />
            <span>Member VIP</span>
          </button>

          {/* Cart / Digital Order Button */}
          <button
            id="cart-trigger-btn"
            onClick={() => onModeChange('order')}
            className={`relative flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl border transition-colors shrink-0 ${
              currentMode === 'order'
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-[#5C5248] border-[#EAE2D8] hover:bg-[#FAF7F2] hover:text-[#1F1A16]'
            }`}
            title="Keranjang Pesanan"
          >
            <ShoppingBag className="w-4 h-4 text-[#C84B27]" />
            <span className="hidden md:inline text-xs font-semibold">Pesanan</span>
            {cartItemCount > 0 && (
              <span className="bg-[#C84B27] text-white text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full shadow-2xs">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Primary CTA: Reservasi Meja */}
          <button
            id="nav-reservation-btn"
            onClick={() => onModeChange('reservation')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-display font-black transition-colors shrink-0 ${
              currentMode === 'reservation'
                ? 'bg-stone-900 text-white'
                : 'bg-[#C84B27] hover:bg-[#B23E1C] text-white shadow-xs'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reservasi Meja</span>
            <span className="sm:hidden">Reservasi</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl bg-white border border-[#EAE2D8] text-[#1F1A16] hover:bg-[#FAF7F2] transition-colors shrink-0 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-t border-[#EAE2D8] px-4 py-4 space-y-3 overflow-hidden shadow-md"
          >
            <div className="grid grid-cols-2 gap-1.5 text-xs font-semibold">
              {navLinks.map((link) => {
                const isActive = currentMode === 'customer' && activeCustomerTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`p-2.5 rounded-lg border text-left transition-colors ${
                      isActive
                        ? 'bg-[#C84B27] text-white border-[#C84B27]'
                        : 'bg-[#FAF7F2] text-[#5C5248] border-[#EAE2D8] hover:bg-stone-200/60'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[#EAE2D8] flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onModeChange('member');
                }}
                className="w-full py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Gift className="w-4 h-4 text-amber-600" />
                <span>Portal Member VIP</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Scroll Progress Bar */}
      {currentMode === 'customer' && (
        <motion.div
          style={{ scaleX }}
          className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#C84B27] via-amber-600 to-[#C84B27] origin-left z-50 pointer-events-none"
        />
      )}
    </header>
  );
};
