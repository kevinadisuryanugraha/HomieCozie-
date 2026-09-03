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
  ChevronRight,
  Sparkles,
  Award,
  HeartHandshake
} from 'lucide-react';
import { LiveAtmosphereBar } from '../Common/LiveAtmosphereBar';
import { SpotlightCard } from '../Common/SpotlightCard';

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
  mobileImage: string;
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
    image: '/photos/homie_cozie_006.webp',
    mobileImage: '/photos/homie_cozie_006_mob.webp',
    badge: 'Jumat & Sabtu 19:30'
  },
  {
    id: 'barista',
    tabLabel: 'Specialty Coffee',
    icon: Coffee,
    title: 'Artisan Espresso & Manual Brew',
    tag: 'Signature Coffee',
    subtitle: 'Kopi Susu Gula Aren Asli & Seduhan Filter V60 Single Origin Nusantara',
    image: '/photos/homie_cozie_008.webp',
    mobileImage: '/photos/homie_cozie_008_mob.webp',
    badge: '100% Arabika & Robusta Pilihan'
  },
  {
    id: 'kitchen',
    tabLabel: 'Kitchen Mains',
    icon: Utensils,
    title: 'Comfort Food & Kitchen Mains',
    tag: 'Chef Recipes',
    subtitle: 'Nasi Goreng Kampung, Pasta Aglio Olio, Rice Bowl Sambal Matah & Platters',
    image: '/photos/homie_cozie_105.webp',
    mobileImage: '/photos/homie_cozie_105_mob.webp',
    badge: 'Fresh Cooked to Order'
  },
  {
    id: 'ambiance',
    tabLabel: 'Cozy Space',
    icon: Wind,
    title: 'Indoor AC & Garden Backyard',
    tag: 'Ruang Nyaman',
    subtitle: 'Colokan di setiap meja, Wi-Fi 100Mbps cepat, dan area mezzanine semi-private',
    image: '/photos/homie_cozie_025.webp',
    mobileImage: '/photos/homie_cozie_025_mob.webp',
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
  const steamCanvasRef = useRef<HTMLCanvasElement>(null);

  // Auto rotate scenes every 6 seconds if not hovered
  useEffect(() => {
    if (isAutoPlayPaused) return;
    const timer = setInterval(() => {
      setActiveSceneIndex(prev => (prev + 1) % SHOWCASE_SCENES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlayPaused]);

  // Anime.js v4 Kinetic Metrics Number Counter Animation
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
      duration: 1200,
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

  // Anime.js / Canvas Subtle Kinetic Floating Coffee Steam Particles
  useEffect(() => {
    const canvas = steamCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = canvas.offsetWidth || 300);
    let height = (canvas.height = canvas.offsetHeight || 150);

    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      opacity: number;
      maxOpacity: number;
    }> = [];

    for (let i = 0; i < 18; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 1,
        speedY: Math.random() * 0.4 + 0.2,
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: 0,
        maxOpacity: Math.random() * 0.25 + 0.1
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;

        // Fade in and out
        if (p.y > height * 0.7) {
          p.opacity = Math.min(p.maxOpacity, p.opacity + 0.01);
        } else if (p.y < height * 0.3) {
          p.opacity = Math.max(0, p.opacity - 0.01);
        }

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
          p.opacity = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 75, 39, ${p.opacity})`;
        ctx.fill();
      });

      animFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 300;
      height = canvas.height = canvas.offsetHeight || 150;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const currentScene = SHOWCASE_SCENES[activeSceneIndex];

  return (
    <section 
      id="hero-section" 
      className="bg-[#FAF7F2] text-[#1F1A16] py-6 sm:py-8 lg:py-12 border-b border-[#EAE2D8] relative overflow-hidden"
      aria-label="Beranda Utama Homie Cozie"
    >
      {/* Background Subtle Canvas Steam & Lighting (bklit.com & 21st.dev) */}
      <div className="absolute top-0 right-0 w-full lg:w-1/2 h-96 pointer-events-none overflow-hidden opacity-60">
        <canvas ref={steamCanvasRef} className="w-full h-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Top Floating Live Atmosphere Bar (Kokonut UI / 21st.dev) */}
        <LiveAtmosphereBar />

        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center pt-2">
          
          {/* Left Column: Brand Story, Kinetic Typography & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#EAE2D8] shadow-xs text-xs"
            >
              <span className="w-2 h-2 rounded-full bg-[#C84B27] animate-ping shrink-0" />
              <span className="font-bold text-[#8C341A] font-mono tracking-wider uppercase text-[11px]">
                #SerasaRumah di Kalisari
              </span>
              <span className="text-[#5C5248] font-mono text-[11px] hidden sm:inline">
                • Sejak 2020
              </span>
            </motion.div>

            {/* Kinetic Editorial Headline (bklit.com & UI/UX Pro Max) */}
            <div className="space-y-3">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl sm:text-5xl lg:text-[54px] font-display font-black text-[#1F1A16] leading-[1.12] tracking-tight"
              >
                Kopi Hangat, Santap Nikmat & Panggung Musik.
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-[#3D332A] text-sm sm:text-base leading-relaxed max-w-xl font-normal"
              >
                Tempat nongkrong favorit Kalisari – Cijantung dengan racikan kopi specialty Nusantara, hidangan dapur hangat berstandar chef, dan pertunjukan live acoustic setiap akhir pekan.
              </motion.p>
            </div>

            {/* Interactive CTAs with Motion Physics (motion.dev & 21st.dev) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                id="hero-reserve-btn"
                onClick={onOpenReservation}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#C84B27] to-[#DE522A] hover:from-[#B23E1C] hover:to-[#C84B27] text-white font-display font-bold text-sm transition-all shadow-md shadow-[#C84B27]/25 cursor-pointer"
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
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-[#1F1A16] font-semibold text-xs sm:text-sm border border-[#EAE2D8] hover:border-[#D5C9BC] transition-all shadow-xs cursor-pointer"
                >
                  <Utensils className="w-4 h-4 text-[#8C341A]" />
                  <span>Daftar Menu</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  id="hero-qr-order-btn"
                  onClick={onOpenQRScan}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-[#1F1A16] font-semibold text-xs sm:text-sm border border-[#EAE2D8] hover:border-[#D5C9BC] transition-all shadow-xs cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-emerald-800" />
                  <span>Pesan di Meja</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Kinetic Proof Metrics Bar (Anime.js + Kokonut UI) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-3 border-t border-[#EAE2D8]"
            >
              <div className="bg-white rounded-2xl border border-[#EAE2D8] p-3.5 sm:p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 divide-y sm:divide-y-0 sm:divide-x divide-[#EAE2D8] shadow-xs">
                
                <div className="flex flex-col justify-center px-2">
                  <div className="flex items-center gap-1 text-[#1F1A16] font-mono font-black text-lg">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-600" />
                    <span ref={ratingCounterRef}>4.8</span>
                    <span className="text-xs text-[#3D332A] font-semibold">/ 5.0</span>
                  </div>
                  <div className="text-[11px] text-[#3D332A] font-semibold mt-0.5">Rating Google Terverifikasi</div>
                </div>

                <div className="flex flex-col justify-center pt-2 sm:pt-0 sm:px-3">
                  <div className="font-mono font-black text-[#1F1A16] text-lg">
                    <span ref={reviewsCounterRef}>268+</span>
                  </div>
                  <div className="text-[11px] text-[#3D332A] font-semibold mt-0.5">Ulasan Pelanggan Asli</div>
                </div>

                <div className="flex flex-col justify-center pt-2 sm:pt-0 sm:px-3">
                  <div className="font-mono font-black text-[#8C341A] text-lg">
                    <span ref={cupsCounterRef}>50K+</span>
                  </div>
                  <div className="text-[11px] text-[#3D332A] font-semibold mt-0.5">Cangkir Kopi Disajikan</div>
                </div>

                <div className="flex flex-col justify-center pt-2 sm:pt-0 sm:px-3">
                  <div className="font-mono font-black text-[#1F1A16] text-lg">
                    <span ref={yearsCounterRef}>6 Thn</span>
                  </div>
                  <div className="text-[11px] text-[#3D332A] font-semibold mt-0.5">Konsisten di Kalisari</div>
                </div>

              </div>
            </motion.div>

          </div>

          {/* Right Column: 3D Spotlight Showcase Card (5 cols) */}
          <div 
            className="lg:col-span-5 space-y-3"
            onMouseEnter={() => setIsAutoPlayPaused(true)}
            onMouseLeave={() => setIsAutoPlayPaused(false)}
          >
            {/* Spotlight Container (21st.dev / Kokonut UI) */}
            <SpotlightCard className="shadow-xl">
              
              {/* shadcn-style Segmented Switcher Header with motion layoutId */}
              <div className="p-2 border-b border-[#EAE2D8] bg-[#FAF7F2] flex items-center justify-between gap-1 overflow-x-auto no-scrollbar relative">
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
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Top Badge Overlay */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-[#C84B27] text-white shadow-sm">
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
                    className="text-[#8C341A] hover:text-[#B23E1C] font-bold text-[11px] flex items-center gap-1 shrink-0 ml-2 cursor-pointer"
                  >
                    <span>Lihat Detail</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Scene Caption Footer */}
              <div className="p-4 space-y-1 bg-white">
                <h2 className="font-display font-bold text-base text-[#1F1A16]">
                  {currentScene.title}
                </h2>
                <p className="text-xs text-[#3D332A] leading-relaxed">
                  {currentScene.subtitle}
                </p>
              </div>

            </SpotlightCard>

            {/* Quick Amenity Icons Ribbon */}
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
