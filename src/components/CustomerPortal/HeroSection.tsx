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
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { CAFE_INFO } from '../../data/mockData';

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
  tag: string;
  subtitle: string;
  image: string;
  badge: string;
}

const SHOWCASE_SCENES: ShowcaseScene[] = [
  {
    id: 'stage',
    tabLabel: 'Live Music Stage',
    icon: Music,
    title: 'Weekend Acoustic Groove',
    tag: 'Live Music Weekend',
    subtitle: 'Jumat & Sabtu mulai 19:30 WIB • Semi-Outdoor Stage & Free Entry',
    image: '/photos/homie_cozie_006.jpg',
    badge: 'Jumat & Sabtu 19:30'
  },
  {
    id: 'barista',
    tabLabel: 'Specialty Coffee',
    icon: Coffee,
    title: 'Artisan Espresso & Manual Brew',
    tag: 'Signature Coffee',
    subtitle: 'Kopi Susu Gula Aren Asli & Seduhan Filter V60 Single Origin Nusantara',
    image: '/photos/homie_cozie_008.jpg',
    badge: '100% Arabika & Robusta Pilihan'
  },
  {
    id: 'kitchen',
    tabLabel: 'Kitchen Mains',
    icon: Utensils,
    title: 'Comfort Food & Kitchen Mains',
    tag: 'Chef Recipes',
    subtitle: 'Nasi Goreng Kampung, Pasta Aglio Olio, Rice Bowl Sambal Matah & Platters',
    image: '/photos/homie_cozie_105.jpg',
    badge: 'Fresh Cooked to Order'
  },
  {
    id: 'ambiance',
    tabLabel: 'Cozy Space',
    icon: Wind,
    title: 'Indoor AC & Garden Backyard',
    tag: 'Ruang Nyaman',
    subtitle: 'Colokan di setiap meja, Wi-Fi 100Mbps cepat, dan area mezzanine semi-private',
    image: '/photos/homie_cozie_025.png',
    badge: 'WFH & Hangout Ready'
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

  useEffect(() => {
    // Number counters
    const ratingObj = { val: 0 };
    animate(ratingObj, {
      val: 4.8,
      duration: 1200,
      ease: 'outExpo',
      onUpdate: () => {
        if (ratingCounterRef.current) {
          ratingCounterRef.current.innerText = `${ratingObj.val.toFixed(1)}`;
        }
      }
    });

    const reviewsObj = { val: 0 };
    animate(reviewsObj, {
      val: 268,
      duration: 1400,
      ease: 'outExpo',
      onUpdate: () => {
        if (reviewsCounterRef.current) {
          reviewsCounterRef.current.innerText = `${Math.round(reviewsObj.val)}+`;
        }
      }
    });

    const cupsObj = { val: 0 };
    animate(cupsObj, {
      val: 50,
      duration: 1600,
      ease: 'outExpo',
      onUpdate: () => {
        if (cupsCounterRef.current) {
          cupsCounterRef.current.innerText = `${Math.round(cupsObj.val)}K+`;
        }
      }
    });

    const yearsObj = { val: 0 };
    animate(yearsObj, {
      val: 6,
      duration: 1000,
      ease: 'outExpo',
      onUpdate: () => {
        if (yearsCounterRef.current) {
          yearsCounterRef.current.innerText = `${Math.round(yearsObj.val)} Thn`;
        }
      }
    });
  }, []);

  const currentScene = SHOWCASE_SCENES[activeSceneIndex];

  return (
    <section id="hero-section" className="bg-[#FAF7F2] text-[#1F1A16] py-8 lg:py-14 border-b border-[#EAE2D8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Brand Copy & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Live Operational Status Ribbon */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#EAE2D8] text-[#1F1A16] font-medium shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <span className="font-semibold text-emerald-800">Buka Hari Ini</span>
                <span className="text-[#8C7E72] font-mono">10:00 – 23:00 WIB</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#EAE2D8] text-[#5C5248] shadow-xs">
                <span>📍 Kalisari, Pasar Rebo, Jakarta Timur</span>
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-display font-black text-[#1F1A16] leading-[1.12] tracking-tight">
                Kopi Hangat, Santap Nikmat & Panggung Musik.
              </h1>
              
              <p className="text-[#5C5248] text-sm sm:text-base leading-relaxed max-w-xl">
                Tempat nongkrong favorit Kalisari – Cijantung dengan racikan kopi specialty Nusantara, hidangan dapur hangat berstandar chef, dan pertunjukan live acoustic setiap akhir pekan.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                id="hero-reserve-btn"
                onClick={onOpenReservation}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-display font-bold text-sm transition-colors shadow-md shadow-[#C84B27]/20 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Reservasi Meja Online</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  id="hero-explore-menu-btn"
                  onClick={onExploreMenu}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-white hover:bg-stone-50 text-[#1F1A16] font-semibold text-xs sm:text-sm border border-[#EAE2D8] hover:border-[#D5C9BC] transition-colors shadow-xs cursor-pointer"
                >
                  <Utensils className="w-4 h-4 text-amber-700" />
                  <span>Daftar Menu</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  id="hero-qr-order-btn"
                  onClick={onOpenQRScan}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-white hover:bg-stone-50 text-[#1F1A16] font-semibold text-xs sm:text-sm border border-[#EAE2D8] hover:border-[#D5C9BC] transition-colors shadow-xs cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-emerald-700" />
                  <span>Pesan di Meja</span>
                </motion.button>
              </div>
            </div>

            {/* Integrated Metrics Bar */}
            <div className="pt-4 border-t border-[#EAE2D8]">
              <div className="bg-white rounded-2xl border border-[#EAE2D8] p-3.5 sm:p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 divide-y sm:divide-y-0 sm:divide-x divide-[#EAE2D8] shadow-xs">
                
                <div className="flex flex-col justify-center px-2">
                  <div className="flex items-center gap-1 text-[#1F1A16] font-mono font-black text-lg">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span ref={ratingCounterRef}>4.8</span>
                    <span className="text-xs text-[#8C7E72] font-normal">/ 5.0</span>
                  </div>
                  <div className="text-[11px] text-[#8C7E72] mt-0.5">Rating Google (268+ Ulasan)</div>
                </div>

                <div className="flex flex-col justify-center pt-2 sm:pt-0 sm:px-3">
                  <div className="font-mono font-black text-[#1F1A16] text-lg">
                    <span ref={reviewsCounterRef}>268+</span>
                  </div>
                  <div className="text-[11px] text-[#8C7E72] mt-0.5">Ulasan Positif Terverifikasi</div>
                </div>

                <div className="flex flex-col justify-center pt-2 sm:pt-0 sm:px-3">
                  <div className="font-mono font-black text-[#C84B27] text-lg">
                    <span ref={cupsCounterRef}>50K+</span>
                  </div>
                  <div className="text-[11px] text-[#8C7E72] mt-0.5">Cangkir Kopi Disajikan</div>
                </div>

                <div className="flex flex-col justify-center pt-2 sm:pt-0 sm:px-3">
                  <div className="font-mono font-black text-[#1F1A16] text-lg">
                    <span ref={yearsCounterRef}>6 Thn</span>
                  </div>
                  <div className="text-[11px] text-[#8C7E72] mt-0.5">Sejak 2020 di Kalisari</div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column: Interactive Atmosphere Showcase (5 cols) */}
          <div 
            className="lg:col-span-5 space-y-3"
            onMouseEnter={() => setIsAutoPlayPaused(true)}
            onMouseLeave={() => setIsAutoPlayPaused(false)}
          >
            {/* Atmosphere Card */}
            <div className="bg-white rounded-3xl overflow-hidden border border-[#EAE2D8] shadow-md transition-all">
              
              {/* Scene Switcher Tabs Header */}
              <div className="p-2 border-b border-[#EAE2D8] bg-[#FAF7F2] flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
                {SHOWCASE_SCENES.map((scene, idx) => {
                  const Icon = scene.icon;
                  const isActive = activeSceneIndex === idx;
                  return (
                    <button
                      key={scene.id}
                      onClick={() => setActiveSceneIndex(idx)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-white text-[#1F1A16] shadow-xs border border-[#EAE2D8]'
                          : 'text-[#8C7E72] hover:text-[#1F1A16]'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C84B27]' : 'text-[#8C7E72]'}`} />
                      <span className="text-[11px]">{scene.tabLabel}</span>
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
                    alt={currentScene.title}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80';
                    }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Top Badge Overlay */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-[#C84B27] text-white shadow-xs">
                    {currentScene.tag}
                  </span>
                </div>

                {/* Bottom Pill Overlay */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#EAE2D8] flex items-center justify-between text-xs shadow-xs">
                  <span className="font-semibold text-[#1F1A16] text-[11px] truncate">
                    {currentScene.badge}
                  </span>
                  <button
                    onClick={activeSceneIndex === 0 ? onOpenEvents : activeSceneIndex === 1 || activeSceneIndex === 2 ? onExploreMenu : onOpenReservation}
                    className="text-[#C84B27] hover:text-[#B23E1C] font-bold text-[11px] flex items-center gap-1 shrink-0 ml-2 cursor-pointer"
                  >
                    <span>Lihat Detail</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Scene Caption Footer */}
              <div className="p-4 space-y-1 bg-white">
                <h3 className="font-display font-bold text-base text-[#1F1A16]">
                  {currentScene.title}
                </h3>
                <p className="text-xs text-[#5C5248] leading-relaxed">
                  {currentScene.subtitle}
                </p>
              </div>

            </div>

            {/* Quick Amenity Icons Ribbon */}
            <div className="bg-white p-3 rounded-2xl border border-[#EAE2D8] grid grid-cols-4 gap-2 text-center text-xs text-[#5C5248] shadow-xs">
              <div className="flex flex-col items-center gap-1">
                <Wifi className="w-4 h-4 text-emerald-700" />
                <span className="text-[10px] font-medium">Wi-Fi 100Mbps</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Zap className="w-4 h-4 text-amber-700" />
                <span className="text-[10px] font-medium">Colokan Meja</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Car className="w-4 h-4 text-blue-700" />
                <span className="text-[10px] font-medium">Parkir Luas</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Wind className="w-4 h-4 text-[#C84B27]" />
                <span className="text-[10px] font-medium">AC & Outdoor</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
