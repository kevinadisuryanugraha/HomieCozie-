import React from 'react';
import { 
  Menu, 
  Search, 
  RefreshCw, 
  Bell, 
  BellRing,
  ExternalLink, 
  LogOut,
  Wifi,
  WifiOff,
  Sparkles,
  Palette,
  Radio
} from 'lucide-react';
import { SystemUser } from '../../../types';
import { CAFE_INFO } from '../../../data/mockData';

interface BackofficeHeaderProps {
  currentSystemUser: SystemUser;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  activeOrdersCount: number;
  showNotificationDrawer: boolean;
  onToggleNotificationDrawer: () => void;
  onOpenMobileMenu: () => void;
  onNavigateToCustomerPortal: () => void;
  onNavigateToAuthPage: () => void;
  isOnline?: boolean;
  onEnableNotifications?: () => void;
  notificationPermission?: NotificationPermission;
  onOpenAICopilot?: () => void;
  onOpenThemeCustomizer?: () => void;
  onOpenOwnerRadar?: () => void;
}

export const BackofficeHeader: React.FC<BackofficeHeaderProps> = ({
  currentSystemUser,
  searchQuery,
  onSearchChange,
  isRefreshing,
  onRefresh,
  activeOrdersCount,
  showNotificationDrawer,
  onToggleNotificationDrawer,
  onOpenMobileMenu,
  onNavigateToCustomerPortal,
  onNavigateToAuthPage,
  isOnline = true,
  onEnableNotifications,
  notificationPermission,
  onOpenAICopilot,
  onOpenThemeCustomizer,
  onOpenOwnerRadar
}) => {
  return (
    <header className="h-16 shrink-0 bg-white/95 backdrop-blur-md border-b border-[#EAE2D8] px-3 sm:px-5 lg:px-6 flex items-center justify-between gap-3 z-40 shadow-2xs select-none w-full max-w-full overflow-hidden">
      
      {/* Left: Mobile Hamburger + Clean Brand Identity */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden w-9 h-9 rounded-xl bg-white hover:bg-stone-50 text-[#1F1A16] border border-[#EAE2D8] flex items-center justify-center shrink-0 cursor-pointer shadow-2xs active:scale-95 transition-all"
          aria-label="Buka Menu BackOffice"
          title="Buka Menu BackOffice"
        >
          <Menu className="w-5 h-5 text-amber-800" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl overflow-hidden bg-white border border-[#EAE2D8] shadow-xs flex items-center justify-center shrink-0">
            <img
              src={CAFE_INFO.logo}
              alt="Homie Cozie Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-sm sm:text-base text-[#1F1A16] tracking-tight leading-none">
                Homie Cozie
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-200/60 hidden sm:inline-block">
                OPS
              </span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-[10px] font-mono text-[#5C5248] font-semibold leading-none">
                {isOnline ? 'Online Reverb' : 'Offline Mode'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-md xl:max-w-lg mx-2 relative">
        <Search className="w-4 h-4 text-[#5C5248] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari pesanan #HC, meja, bahan baku, menu..."
          className="w-full bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl pl-9 pr-10 py-1.5 text-xs text-[#1F1A16] placeholder:text-[#5C5248] focus:outline-hidden focus:border-[#C84B27] focus:bg-white transition-all shadow-2xs"
        />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold bg-white px-1.5 py-0.5 rounded text-[#5C5248] border border-[#EAE2D8]">
          ⌘K
        </span>
      </div>

      {/* Right Actions: Compact, Categorized & Beautifully Spaced */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        
        {/* 1. AI Copilot Badge Button */}
        {onOpenAICopilot && (
          <button
            onClick={onOpenAICopilot}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#C84B27] hover:from-amber-600 hover:to-[#B23E1C] text-white text-xs font-bold shadow-xs transition-transform active:scale-95 cursor-pointer shrink-0"
            title="Buka AI Executive Copilot (Gemini AI)"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden xl:inline">AI Copilot</span>
          </button>
        )}

        {/* 2. Live Owner Radar Button */}
        {onOpenOwnerRadar && (
          <button
            onClick={onOpenOwnerRadar}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold shadow-2xs transition-all cursor-pointer shrink-0 active:scale-95"
            title="Buka Radar Pantauan Eksekutif Owner (Live Reverb)"
          >
            <Radio className="w-3.5 h-3.5 text-[#C84B27] animate-pulse" />
            <span className="hidden xl:inline">Owner Radar</span>
          </button>
        )}

        {/* 3. Theme Customizer Icon Button */}
        {onOpenThemeCustomizer && (
          <button
            onClick={onOpenThemeCustomizer}
            className="hidden sm:flex w-8.5 h-8.5 rounded-xl bg-[#FAF7F2] hover:bg-stone-200 border border-[#EAE2D8] text-[#5C5248] hover:text-[#1F1A16] items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
            title="Kustomisasi Tema, Warna & Font Backstage"
          >
            <Palette className="w-4 h-4 text-[#C84B27]" />
          </button>
        )}

        {/* 4. Quick Refresh Button */}
        <button
          onClick={onRefresh}
          className={`w-8.5 h-8.5 hidden sm:flex items-center justify-center rounded-xl bg-white hover:bg-stone-50 text-[#5C5248] hover:text-[#1F1A16] border border-[#EAE2D8] transition-all cursor-pointer shadow-2xs shrink-0 ${
            isRefreshing ? 'animate-spin text-[#C84B27]' : ''
          }`}
          title="Segarkan data operasional secara live"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        {/* 5. Notification Bell with Badge */}
        <button
          onClick={onToggleNotificationDrawer}
          className="relative w-8.5 h-8.5 flex items-center justify-center rounded-xl bg-white hover:bg-stone-50 text-[#5C5248] hover:text-[#1F1A16] border border-[#EAE2D8] transition-all cursor-pointer shadow-2xs shrink-0"
          aria-label="Notifikasi antrean dapur & pesanan"
          title="Notifikasi antrean dapur & pesanan"
        >
          <Bell className="w-4 h-4 text-amber-700" />
          {activeOrdersCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#C84B27] text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-xs">
              {activeOrdersCount}
            </span>
          )}
        </button>

        {/* 6. Portal Tamu Link Button */}
        <button
          onClick={onNavigateToCustomerPortal}
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-[#1F1A16] text-xs font-bold border border-[#EAE2D8] transition-colors cursor-pointer shadow-2xs shrink-0"
          title="Buka Halaman Publik Pelanggan"
        >
          <ExternalLink className="w-3.5 h-3.5 text-amber-700" />
          <span>Portal Tamu</span>
        </button>

        {/* 7. Compact User Profile & Logout Pill */}
        <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l border-[#EAE2D8] shrink-0">
          <img
            src={currentSystemUser.avatar}
            alt={currentSystemUser.name}
            className="w-8 h-8 rounded-xl object-cover border border-[#EAE2D8] shrink-0"
          />
          <div className="hidden 2xl:flex flex-col text-left max-w-[120px]">
            <span className="text-xs font-bold text-[#1F1A16] leading-tight truncate">
              {currentSystemUser.name}
            </span>
            <span className="text-[10px] font-mono text-amber-800 font-semibold truncate">
              {currentSystemUser.roleLabel}
            </span>
          </div>
          <button
            onClick={onNavigateToAuthPage}
            className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center transition-colors cursor-pointer shadow-2xs shrink-0"
            aria-label="Keluar / Logout Sesi Staf"
            title="Keluar / Logout Sesi Staf"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </header>
  );
};
