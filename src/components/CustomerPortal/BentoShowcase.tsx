import React from 'react';
import { motion } from 'motion/react';
import { 
  Music, 
  Coffee, 
  Wifi, 
  Utensils, 
  Sparkles, 
  Zap, 
  ArrowUpRight, 
  Flame, 
  Volume2,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { SpotlightCard } from '../Common/SpotlightCard';

interface BentoShowcaseProps {
  onExploreMenu: () => void;
  onOpenReservation: () => void;
  onOpenEvents: () => void;
}

export const BentoShowcase: React.FC<BentoShowcaseProps> = ({
  onExploreMenu,
  onOpenReservation,
  onOpenEvents
}) => {
  return (
    <section 
      id="bento-overview-section"
      className="py-16 sm:py-24 bg-[#FAF7F2] text-[#1F1A16] relative overflow-hidden"
      aria-label="Keunggulan Utama Homie Cozie"
    >
      {/* Ambient background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C84B27]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header (bklit.com & UI/UX Pro Max typography) */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-900/10 border border-amber-900/20 text-[#8C341A] text-xs font-bold font-mono uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C84B27]" />
            Eksplorasi Suasana & Layanan
          </div>
          <h2 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-[#1F1A16] tracking-tight leading-tight">
            Lebih Dari Sekadar Kedai Kopi.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#3D332A] leading-relaxed font-normal">
            Kombinasi harmonis antara panggung musik akhir pekan, racikan biji kopi Nusantara pilihan, hidangan dapur chef yang hangat, serta ruang produktif ramah WFH.
          </p>
        </div>

        {/* Bento Grid Layout (Kokonut UI / 21st.dev inspired) */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-[280px] sm:auto-rows-[320px]">
          
          {/* Bento Card 1: Live Music Stage (Span 2 Cols on Tablet/Desktop) */}
          <SpotlightCard
            onClick={onOpenEvents}
            className="md:col-span-2 group cursor-pointer border-[#EAE2D8] hover:shadow-xl transition-all duration-300"
          >
            <div className="relative h-full w-full overflow-hidden p-6 sm:p-8 flex flex-col justify-between text-white">
              {/* Background Photo with Rich Dark Gradient */}
              <img
                src="/photos/homie_cozie_006.webp"
                alt="Live Music Stage Homie Cozie"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14100E] via-[#14100E]/70 to-transparent" />
              
              {/* Top Meta Badges */}
              <div className="relative z-10 flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C84B27]/90 backdrop-blur-md text-white text-xs font-bold shadow-sm">
                  <Music className="w-3.5 h-3.5 animate-pulse" />
                  <span>Panggung Musik Akustik</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-[#C84B27] transition-colors">
                  <ArrowUpRight className="w-4 h-4 text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>

              {/* Bottom Content & Audio Wave Visualizer */}
              <div className="relative z-10 space-y-2 mt-auto">
                {/* Simulated Audio Wave (Kokonut UI) */}
                <div className="flex items-end gap-1 h-5 mb-1">
                  {[40, 70, 100, 60, 90, 45, 80, 55, 95, 35, 75, 50].map((h, idx) => (
                    <motion.div
                      key={idx}
                      animate={{ height: [`${h * 0.3}%`, `${h}%`, `${h * 0.5}%`] }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        delay: idx * 0.08,
                        ease: 'easeInOut'
                      }}
                      className="w-1 bg-amber-400/90 rounded-full"
                    />
                  ))}
                  <span className="text-[11px] font-mono text-amber-300 ml-2 font-semibold">
                    Setiap Jumat & Sabtu 19:30 WIB • Free Entry
                  </span>
                </div>

                <h3 className="font-display font-black text-xl sm:text-2xl text-white leading-tight">
                  Weekend Acoustic Groove & Open Stage
                </h3>
                <p className="text-xs sm:text-sm text-stone-200 line-clamp-2 max-w-xl font-medium">
                  Nikmati penampilan musisi lokal berbakat di area semi-outdoor yang asri dengan tata suara jernih dan suasana akrab tanpa tiket masuk.
                </p>
              </div>
            </div>
          </SpotlightCard>

          {/* Bento Card 2: Specialty Barista Bar */}
          <SpotlightCard
            onClick={onExploreMenu}
            className="md:col-span-1 group cursor-pointer border-[#EAE2D8] hover:shadow-xl transition-all duration-300"
          >
            <div className="relative h-full w-full overflow-hidden p-6 flex flex-col justify-between text-white">
              <img
                src="/photos/homie_cozie_008.webp"
                alt="Specialty Barista Coffee"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14100E] via-[#14100E]/75 to-transparent" />

              <div className="relative z-10 flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600/90 backdrop-blur-md text-white text-xs font-bold">
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Single Origin</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-amber-600 transition-colors">
                  <ArrowUpRight className="w-4 h-4 text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>

              <div className="relative z-10 space-y-1.5 mt-auto">
                <div className="flex flex-wrap gap-1 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-stone-900/80 border border-stone-700 text-[10px] text-amber-300 font-mono">
                    Gayo
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-stone-900/80 border border-stone-700 text-[10px] text-amber-300 font-mono">
                    Toraja
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-stone-900/80 border border-stone-700 text-[10px] text-amber-300 font-mono">
                    Manual V60
                  </span>
                </div>
                <h3 className="font-display font-black text-lg sm:text-xl text-white leading-tight">
                  Artisan Coffee & Signature Gula Aren
                </h3>
                <p className="text-xs text-stone-200 line-clamp-2">
                  100% biji kopi murni Nusantara diseduh dengan kalibrasi presisi oleh barista berpengalaman.
                </p>
              </div>
            </div>
          </SpotlightCard>

          {/* Bento Card 3: WFH Ready & Mezzanine Space */}
          <SpotlightCard
            onClick={onOpenReservation}
            className="md:col-span-1 group cursor-pointer border-[#EAE2D8] hover:shadow-xl transition-all duration-300"
          >
            <div className="relative h-full w-full overflow-hidden p-6 flex flex-col justify-between text-white">
              <img
                src="/photos/homie_cozie_025.webp"
                alt="Cozy WFH Space Homie Cozie"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14100E] via-[#14100E]/75 to-transparent" />

              <div className="relative z-10 flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/90 backdrop-blur-md text-white text-xs font-bold">
                  <Wifi className="w-3.5 h-3.5" />
                  <span>100 Mbps WFH Hub</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-emerald-700 transition-colors">
                  <ArrowUpRight className="w-4 h-4 text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>

              <div className="relative z-10 space-y-1.5 mt-auto">
                <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-300">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Colokan Tiap Meja
                  </span>
                  <span>•</span>
                  <span>AC Dingin</span>
                </div>
                <h3 className="font-display font-black text-lg sm:text-xl text-white leading-tight">
                  Ruang Nyaman WFH & Meeting
                </h3>
                <p className="text-xs text-stone-200 line-clamp-2">
                  Meja luas, kursi ergonomis, dan colokan di setiap sudut untuk produktivitas maksimal.
                </p>
              </div>
            </div>
          </SpotlightCard>

          {/* Bento Card 4: Chef's Kitchen Comfort Food (Span 2 Cols) */}
          <SpotlightCard
            onClick={onExploreMenu}
            className="md:col-span-2 group cursor-pointer border-[#EAE2D8] hover:shadow-xl transition-all duration-300"
          >
            <div className="relative h-full w-full overflow-hidden p-6 sm:p-8 flex flex-col justify-between text-white">
              <img
                src="/photos/homie_cozie_105.webp"
                alt="Kitchen Mains Homie Cozie"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14100E] via-[#14100E]/70 to-transparent" />

              <div className="relative z-10 flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-900/90 backdrop-blur-md text-white text-xs font-bold">
                  <Utensils className="w-3.5 h-3.5 text-amber-300" />
                  <span>Dapur Chef Hangat</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-mono font-bold text-amber-300">
                    Rp 25.000 – Rp 50.000
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-[#C84B27] transition-colors">
                    <ArrowUpRight className="w-4 h-4 text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>

              <div className="relative z-10 space-y-2 mt-auto">
                <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold">
                  <Flame className="w-3.5 h-3.5 text-[#E4572E]" />
                  <span>Fresh Made to Order • Resep Autentik Nusantara & Western</span>
                </div>
                <h3 className="font-display font-black text-xl sm:text-2xl text-white leading-tight">
                  Santap Kenyang Nikmat: Dari Nasi Goreng Kampung Hingga Pasta Chef
                </h3>
                <p className="text-xs sm:text-sm text-stone-200 line-clamp-2 max-w-xl">
                  Disiapkan langsung saat dipesan dengan bumbu rempah melimpah, porsi memuaskan, dan bahan berkualitas segar.
                </p>
              </div>
            </div>
          </SpotlightCard>

        </div>

      </div>
    </section>
  );
};
