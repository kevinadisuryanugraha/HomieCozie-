import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { animate } from 'animejs';
import { 
  Calendar, 
  Utensils, 
  QrCode, 
  Star, 
  ArrowRight,
  Music,
  Wifi,
  Zap,
  Car,
  Wind,
  Coffee,
  ChevronRight
} from 'lucide-react';

interface HeroSectionProps {
  onOpenReservation: () => void;
  onExploreMenu: () => void;
  onOpenQRScan: () => void;
  onOpenEvents: () => void;
}

interface ShowcaseScene {
  id: string;
  tabLabel: string;
  icon: React.FC<{ className?: string }>;
  title: string;
  subtitle: string;
  image: string;
  mobileImage: string;
}

const SHOWCASE_SCENES: ShowcaseScene[] = [
  {
    id: 'stage',
    tabLabel: 'Live Music',
    icon: Music,
    title: 'Weekend Acoustic Stage',
    subtitle: 'Jumat & Sabtu mulai 19:30 WIB • Semi-Outdoor Stage & Free Entry',
    image: '/photos/homie_cozie_006.webp',
    mobileImage: '/photos/homie_cozie_006_mob.webp'
  },
  {
    id: 'barista',
    tabLabel: 'Specialty Coffee',
    icon: Coffee,
    title: 'Artisan Espresso & Manual Brew',
    subtitle: 'Kopi Susu Gula Aren Asli & Seduhan Filter V60 Single Origin Nusantara',
    image: '/photos/homie_cozie_008.webp',
    mobileImage: '/photos/homie_cozie_008_mob.webp'
  },
  {
    id: 'kitchen',
    tabLabel: 'Kitchen Mains',
    icon: Utensils,
    title: 'Comfort Food & Kitchen Mains',
    subtitle: 'Nasi Goreng Kampung, Pasta Aglio Olio, Rice Bowl Sambal Matah & Platters',
    image: '/photos/homie_cozie_105.webp',
    mobileImage: '/photos/homie_cozie_105_mob.webp'
  },
  {
    id: 'ambiance',
    tabLabel: 'Cozy Space',
    icon: Wind,
    title: 'Indoor AC & Garden Backyard',
    subtitle: 'Colokan di setiap meja, Wi-Fi 100Mbps, dan area mezzanine semi-private',
    image: '/photos/homie_cozie_025.webp',
    mobileImage: '/photos/homie_cozie_025_mob.webp'
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenReservation,
  onExploreMenu,
  onOpenQRScan,
  onOpenEvents
}) => {
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState<boolean>(false);

  const ratingCounterRef = useRef<HTMLSpanElement>(null);
  const reviewsCounterRef = useRef<HTMLSpanElement>(null);
  const cupsCounterRef = useRef<HTMLSpanElement>(null);
  const yearsCounterRef = useRef<HTMLSpanElement>(null);

  // Auto rotate scenes every 6 seconds if not hovered
  useEffect(() => {
    if (isAutoPlayPaused) return;
    const timer = setInterval(() => {
      setActiveSceneIndex(prev => (prev + 1) % SHOWCASE_SCENES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlayPaused]);

  // Anime.js v4 Number Counter Animation
  useEffect(() => {
    const counterObj = {
      rating: 0,
      reviews: 0,
      cups: 0,
      years: 0
    };

    const anim = animate(counterObj, {
      rating: 4.8,
      reviews: 268,
      cups: 50,
      years: 6,
      duration: 1000,
      ease: 'outExpo',
      onUpdate: () => {
        if (ratingCounterRef.current) {
          ratingCounterRef.current.innerText = counterObj.rating.toFixed(1);
        }
        if (reviewsCounterRef.current) {
          reviewsCounterRef.current.innerText = `${Math.round(counterObj.reviews)}+`;
        }
        if (cupsCounterRef.current) {
          cupsCounterRef.current.innerText = `${Math.round(counterObj.cups)}K+`;
        }
        if (yearsCounterRef.current) {
          yearsCounterRef.current.innerText = `${Math.round(counterObj.years)} Thn`;
        }
      }
    });

    return () => {
      anim.pause();
    };
  }, []);

  const currentScene = SHOWCASE_SCENES[activeSceneIndex];

  return (
    <section 
      id="hero-section" 
      className="bg-[#FAF7F2] text-[#1F1A16] py-8 sm:py-12 lg:py-16 border-b border-[#EAE2D8]"
      aria-label="Beranda Utama Homie Cozie"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline & Action CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-display font-black text-[#1F1A16] leading-[1.12] tracking-tight">
                Kopi Hangat, Santap Nikmat & Panggung Musik.
              </h1>
              
              <p className="text-[#3D332A] text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                Tempat nongkrong favorit Kalisari – Cijantung dengan racikan kopi specialty Nusantara, hidangan dapur hangat berstandar chef, dan pertunjukan live acoustic setiap akhir pekan.
              </p>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <button
                id="hero-reserve-btn"
                onClick={onOpenReservation}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-display font-bold text-sm transition-colors shadow-sm cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Reservasi Meja Online</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  id="hero-explore-menu-btn"
                  onClick={onExploreMenu}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-[#1F1A16] font-semibold text-xs sm:text-sm border border-[#EAE2D8] hover:border-[#D5C9BC] transition-colors shadow-xs cursor-pointer"
                >
                  <Utensils className="w-4 h-4 text-[#8C341A]" />
                  <span>Daftar Menu</span>
                </button>

                <button
                  id="hero-qr-order-btn"
                  onClick={onOpenQRScan}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-[#1F1A16] font-semibold text-xs sm:text-sm border border-[#EAE2D8] hover:border-[#D5C9BC] transition-colors shadow-xs cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-emerald-800" />
                  <span>Pesan di Meja</span>
                </button>
              </div>
            </div>

            {/* Proof Metrics Bar */}
            <div className="pt-4 border-t border-[#EAE2D8]">
              <div className="bg-white rounded-2xl border border-[#EAE2D8] p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 divide-y sm:divide-y-0 sm:divide-x divide-[#EAE2D8] shadow-xs">
                
                <div className="flex flex-col justify-center px-2">
                  <div className="flex items-center gap-1 text-[#1F1A16] font-mono font-black text-lg">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-600" />
                    <span ref={ratingCounterRef}>4.8</span>
                    <span className="text-xs text-[#3D332A] font-semibold">/ 5.0</span>
                  </div>
                  <div className="text-[11px] text-[#3D332A] font-medium mt-0.5">Rating Google</div>
                </div>

                <div className="flex flex-col justify-center pt-2 sm:pt-0 sm:px-3">
                  <div className="font-mono font-black text-[#1F1A16] text-lg">
                    <span ref={reviewsCounterRef}>268+</span>
                  </div>
                  <div className="text-[11px] text-[#3D332A] font-medium mt-0.5">Ulasan Pelanggan</div>
                </div>

                <div className="flex flex-col justify-center pt-2 sm:pt-0 sm:px-3">
                  <div className="font-mono font-black text-[#8C341A] text-lg">
                    <span ref={cupsCounterRef}>50K+</span>
                  </div>
                  <div className="text-[11px] text-[#3D332A] font-medium mt-0.5">Cangkir Kopi Terjual</div>
                </div>

                <div className="flex flex-col justify-center pt-2 sm:pt-0 sm:px-3">
                  <div className="font-mono font-black text-[#1F1A16] text-lg">
                    <span ref={yearsCounterRef}>6 Thn</span>
                  </div>
                  <div className="text-[11px] text-[#3D332A] font-medium mt-0.5">Sejak 2020 di Kalisari</div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column: Scene Showcase Card (5 cols) */}
          <div 
            className="lg:col-span-5 space-y-3"
            onMouseEnter={() => setIsAutoPlayPaused(true)}
            onMouseLeave={() => setIsAutoPlayPaused(false)}
          >
            <div className="bg-white rounded-2xl overflow-hidden border border-[#EAE2D8] shadow-sm">
              
              {/* Scene Switcher Header */}
              <div className="p-1.5 border-b border-[#EAE2D8] bg-[#FAF7F2] flex items-center justify-between gap-1 overflow-x-auto no-scrollbar relative">
                {SHOWCASE_SCENES.map((scene, idx) => {
                  const Icon = scene.icon;
                  const isActive = activeSceneIndex === idx;
                  return (
                    <button
                      key={scene.id}
                      onClick={() => setActiveSceneIndex(idx)}
                      className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        isActive ? 'text-[#1F1A16]' : 'text-[#5C5248] hover:text-[#1F1A16]'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="hero-scene-active-pill"
                          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                          className="absolute inset-0 bg-white rounded-xl shadow-xs border border-[#EAE2D8] z-[-1]"
                        />
                      )}
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C84B27]' : 'text-[#5C5248]'}`} />
                      <span className="text-[11px] font-bold">{scene.tabLabel}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Scene Image Viewport */}
              <div className="relative h-64 sm:h-72 overflow-hidden bg-stone-100">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentScene.id}
                    src={currentScene.image}
                    srcSet={`${currentScene.mobileImage} 480w, ${currentScene.image} 900w`}
                    sizes="(max-width: 640px) 480px, 900px"
                    alt={currentScene.title}
                    width={560}
                    height={320}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Bottom Action Strip */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#EAE2D8] flex items-center justify-between text-xs shadow-xs">
                  <span className="font-semibold text-[#1F1A16] text-[11px] truncate">
                    {currentScene.title}
                  </span>
                  <button
                    onClick={activeSceneIndex === 0 ? onOpenEvents : activeSceneIndex === 1 || activeSceneIndex === 2 ? onExploreMenu : onOpenReservation}
                    className="text-[#8C341A] hover:text-[#B23E1C] font-bold text-[11px] flex items-center gap-1 shrink-0 ml-2 cursor-pointer"
                  >
                    <span>Lihat Detail</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Scene Caption Footer */}
              <div className="p-4 bg-white">
                <p className="text-xs text-[#3D332A] leading-relaxed">
                  {currentScene.subtitle}
                </p>
              </div>

            </div>

            {/* Quick Amenity Ribbon */}
            <div className="bg-white p-3 rounded-2xl border border-[#EAE2D8] grid grid-cols-4 gap-2 text-center text-xs text-[#3D332A] shadow-xs">
              <div className="flex flex-col items-center gap-1">
                <Wifi className="w-4 h-4 text-emerald-800" />
                <span className="text-[10px] font-semibold">Wi-Fi 100Mbps</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Zap className="w-4 h-4 text-amber-800" />
                <span className="text-[10px] font-semibold">Colokan Meja</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Car className="w-4 h-4 text-blue-800" />
                <span className="text-[10px] font-semibold">Parkir Luas</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Wind className="w-4 h-4 text-[#8C341A]" />
                <span className="text-[10px] font-semibold">AC & Outdoor</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
