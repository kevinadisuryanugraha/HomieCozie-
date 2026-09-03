import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Music, 
  Wifi, 
  Clock, 
  Coffee, 
  ChevronRight, 
  X,
  Volume2,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { CAFE_INFO } from '../../data/mockData';

export const LiveAtmosphereBar: React.FC = () => {
  const [isOpenDetails, setIsOpenDetails] = useState(false);

  return (
    <>
      {/* Sleek Horizontal Floating Vibe Bar (Kokonut UI / 21st.dev inspired) */}
      <div className="w-full max-w-5xl mx-auto px-2 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          onClick={() => setIsOpenDetails(true)}
          className="group relative cursor-pointer overflow-hidden rounded-2xl bg-[#1C1714]/90 backdrop-blur-md border border-[#3E3028] shadow-lg hover:border-amber-600/50 transition-all duration-300 p-2 sm:p-2.5 text-stone-200"
        >
          {/* Subtle Ambient Shimmer Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#C84B27]/10 via-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 sm:gap-4 text-xs">
            
            {/* Live Indicator Badge */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="font-mono font-bold text-[11px] text-emerald-400 tracking-wide uppercase">
                Buka Hari Ini
              </span>
              <span className="text-stone-400 font-mono text-[11px]">
                10:00 – 23:00 WIB
              </span>
            </div>

            {/* Middle Feature Highlights */}
            <div className="hidden md:flex items-center gap-4 text-[11px] text-stone-300">
              <div className="flex items-center gap-1.5 hover:text-amber-300 transition-colors">
                <Music className="w-3.5 h-3.5 text-[#E4572E] animate-pulse" />
                <span className="font-medium">Live Acoustic: Akhir Pekan 19:30</span>
              </div>
              <span className="text-stone-600">•</span>
              <div className="flex items-center gap-1.5 hover:text-amber-300 transition-colors">
                <Wifi className="w-3.5 h-3.5 text-amber-400" />
                <span>Wi-Fi 100 Mbps & Full Colokan</span>
              </div>
            </div>

            {/* Right Action Trigger */}
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 group-hover:text-amber-300 transition-colors shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-[#C84B27]" />
              <span className="hidden sm:inline">Info Suasana & Menu Rekomendasi</span>
              <span className="sm:hidden">Info Suasana</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>

          </div>
        </motion.div>
      </div>

      {/* Atmospheric Details Modal (Kokonut UI / shadcn Sheet style) */}
      <AnimatePresence>
        {isOpenDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-[#181310] border border-amber-900/40 rounded-3xl p-5 sm:p-6 text-stone-100 shadow-2xl relative overflow-hidden"
            >
              {/* Background Ambient Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#C84B27]/25 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-base sm:text-lg text-white">
                      Suasana & Info Kafe Hari Ini
                    </h3>
                    <p className="text-xs text-stone-400">Homie Cozie Coffee & Kitchen • Kalisari</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpenDetails(false)}
                  className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                  aria-label="Tutup Info"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                
                {/* Status Card */}
                <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 flex items-start gap-3">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Jam Operasional</span>
                    <span className="text-stone-300 text-xs">
                      Selasa – Minggu: 10:00 – 23:00 WIB (Senin Tutup / Khusus Booking Private)
                    </span>
                  </div>
                </div>

                {/* Live Music Card */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-stone-900/90 to-amber-950/30 border border-amber-900/40 flex items-start gap-3">
                  <Volume2 className="w-4 h-4 text-[#E4572E] shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">Live Acoustic Stage</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#C84B27]/20 border border-[#C84B27]/40 text-[10px] font-mono font-bold text-[#E4572E]">
                        Free Entry
                      </span>
                    </div>
                    <span className="text-stone-300 text-xs mt-0.5 block">
                      Setiap Jumat & Sabtu malam mulai pukul 19:30 WIB di panggung semi-outdoor.
                    </span>
                  </div>
                </div>

                {/* Facilities Card */}
                <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 flex items-start gap-3">
                  <Wifi className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Fasilitas WFH & Nongkrong</span>
                    <ul className="text-stone-300 text-xs space-y-1 mt-1">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        Wi-Fi 100 Mbps Dedicated (SSID: <code>{CAFE_INFO.wifiSsid}</code>)
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        Colokan listrik di setiap meja Indoor AC & Mezzanine Lt 2
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        Musholla bersih, Toilet terawat, & Parkir luas
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Barista Recommendation */}
                <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 flex items-start gap-3">
                  <Coffee className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Rekomendasi Barista Hari Ini</span>
                    <span className="text-stone-300 text-xs block mt-0.5">
                      ☕ <strong>Es Kopi Susu HC</strong> (Gula Aren Asli) & <strong>V60 Single Origin Gayo</strong> — dipadukan dengan Nasi Goreng Kampung Chef.
                    </span>
                  </div>
                </div>

              </div>

              <div className="mt-5 pt-3 border-t border-stone-800 flex items-center justify-end">
                <button
                  onClick={() => setIsOpenDetails(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-bold text-xs transition-colors cursor-pointer shadow-md"
                >
                  Tutup & Lanjut Eksplor
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
