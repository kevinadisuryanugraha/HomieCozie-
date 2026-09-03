import React from 'react';
import { 
  Coffee, 
  Utensils, 
  Music, 
  Users, 
  ArrowRight
} from 'lucide-react';
import { CAFE_INFO, CAFE_STATS } from '../../data/mockData';

interface AboutSectionProps {
  onOpenReservation: () => void;
  onExploreMenu: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenReservation, onExploreMenu }) => {
  const pillars = [
    {
      icon: Coffee,
      title: 'Kopi Nusantara Pilihan',
      description: 'Menggunakan 100% biji kopi arabika & robusta specialty dari petani lokal Indonesia dengan profil sangrai segar mingguan.'
    },
    {
      icon: Utensils,
      title: 'Kitchen Standar Chef',
      description: 'Semua masakan dimasak fresh dari nol tanpa pengawet. Menggabungkan comfort food lokal dan hidangan western favorit.'
    },
    {
      icon: Music,
      title: 'Panggung Akustik & Live Music',
      description: 'Mewadahi talenta musisi lokal setiap akhir pekan untuk menghadirkan atmosfer hangout santai dan menyenangkan.'
    },
    {
      icon: Users,
      title: 'Ruang Ramah Komunitas',
      description: 'Dilengkapi colokan listrik di setiap meja, Wi-Fi 100Mbps, area indoor ber-AC dan semi-outdoor asri.'
    }
  ];

  return (
    <section 
      id="about-section" 
      className="py-14 sm:py-18 bg-[#FAF7F2] text-[#1F1A16] border-b border-[#EAE2D8]"
      aria-label="Tentang Homie Cozie"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Title */}
        <div className="max-w-2xl space-y-2.5 mb-10">
          <h2 className="font-display font-black text-2xl sm:text-4xl text-[#1F1A16] tracking-tight leading-snug">
            Tempat Berkumpul yang Hangat & Tenang di Kalisari
          </h2>

          <p className="text-[#3D332A] text-xs sm:text-sm leading-relaxed font-normal">
            Homie Cozie hadir sebagai ruang santai kedua bagi warga Pasar Rebo dan Jakarta Timur. Menghadirkan secangkir kopi berkualitas, sajian makanan hangat, dan panggung musik akustik dalam suasana akrab #SerasaRumah.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12">
          {CAFE_STATS.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EAE2D8] text-center shadow-xs"
            >
              <div className="font-display font-black text-2xl sm:text-3xl text-[#8C341A] tracking-tight">
                {stat.value}
              </div>
              <div className="font-bold text-[#1F1A16] text-xs sm:text-sm mt-1">
                {stat.label}
              </div>
              <p className="text-[11px] text-[#3D332A] mt-0.5 leading-snug font-medium">
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Split Narrative Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Cafe Interior Photo (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-[#EAE2D8] bg-white shadow-xs">
            <img
              src="/photos/homie_cozie_116.webp"
              srcSet="/photos/homie_cozie_116_mob.webp 480w, /photos/homie_cozie_116.webp 900w"
              sizes="(max-width: 640px) 480px, 900px"
              alt="Barista Homie Cozie menyiapkan seduhan kopi specialty"
              width={600}
              height={400}
              loading="lazy"
              decoding="async"
              className="w-full h-80 sm:h-96 object-cover"
            />
            <div className="p-4 bg-white border-t border-[#EAE2D8]">
              <div className="text-xs font-bold text-[#1F1A16] flex items-center gap-1.5">
                <Coffee className="w-4 h-4 text-[#C84B27]" />
                <span>Barista Specialty Bar</span>
              </div>
              <p className="text-[11px] text-[#3D332A] mt-1 font-medium">
                Penyeduhan kopi presisi dengan mesin espresso modern dan racikan khas Homie Cozie.
              </p>
            </div>
          </div>

          {/* Right Column: 4 Core Pillars (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pillars.map((pillar, idx) => (
                <div 
                  key={idx}
                  className="bg-white p-4.5 rounded-2xl border border-[#EAE2D8] space-y-2 shadow-xs"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-[#8C341A] flex items-center justify-center">
                    <pillar.icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-sm text-[#1F1A16]">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#3D332A] leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenReservation}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs cursor-pointer"
              >
                <span>Reservasi Meja Online</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={onExploreMenu}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-[#1F1A16] font-semibold text-xs sm:text-sm border border-[#EAE2D8] transition-colors shadow-xs cursor-pointer"
              >
                <Coffee className="w-4 h-4 text-[#3D332A]" />
                <span>Lihat Pilihan Menu</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
