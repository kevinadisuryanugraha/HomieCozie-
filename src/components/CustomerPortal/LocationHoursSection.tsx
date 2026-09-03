import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Instagram, 
  Navigation, 
  CheckCircle2, 
  Car, 
  Bike, 
  Wifi, 
  ExternalLink,
  Copy,
  Check,
  Compass,
  Layers,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { CAFE_INFO } from '../../data/mockData';

interface LocationHoursSectionProps {
  onOpenReservation: () => void;
}

export const LocationHoursSection: React.FC<LocationHoursSectionProps> = ({ onOpenReservation }) => {
  const [activeMapView, setActiveMapView] = useState<'interactive' | 'landmarks' | 'parking'>('interactive');
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);

  const fullAddress = CAFE_INFO.address;
  const googleMapsUrl = CAFE_INFO.mapsEmbedUrl;
  const wazeUrl = 'https://waze.com/ul?q=Homie+Cozie+Coffee+Kitchen+Jakarta';

  // Embed URL for real interactive Google Maps
  const embedMapsUrl = 'https://maps.google.com/maps?q=Jl.+H.+Hasan+No.23,+RT.5/RW.2,+Baru,+Kec.+Pasar+Rebo,+Kota+Jakarta+Timur&t=&z=16&ie=UTF8&iwloc=&output=embed';

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const nearbyLandmarks = [
    { label: 'Dari Jl. Raya Bogor / Cijantung', time: '± 5 menit (1.8 km)', desc: 'Masuk via Jl. Kalisari Raya, lurus ke Jl. H. Hasan.' },
    { label: 'Dari GOR Ciracas / KKO', time: '± 7 menit (2.5 km)', desc: 'Akses mudah melalui Jl. Baru Kalisari.' },
    { label: 'Dari Flyover Pasar Rebo / TB Simatupang', time: '± 10 menit (3.2 km)', desc: 'Lurus ke arah Cijantung, belok kiri arah Kalisari.' }
  ];

  return (
    <section id="location-section" className="py-12 lg:py-20 bg-[#FAF7F2] text-[#1F1A16] border-b border-[#EAE2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-10 space-y-2">
          <div className="text-xs font-mono font-semibold text-[#5C5248] uppercase tracking-wider">
            Lokasi & Jam Operasional
          </div>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-[#1F1A16] tracking-tight">
            Kunjungi Homie Cozie Pasar Rebo
          </h2>
          <p className="text-[#5C5248] text-xs sm:text-sm leading-relaxed">
            Titik temu strategis di kawasan Kalisari, Pasar Rebo dengan akses jalan mudah, parkir mobil/motor luas, dan suasana asri.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Location & Schedule Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            
            {/* Address & Hours Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#EAE2D8] space-y-5 shadow-xs">
              
              {/* Address */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#C84B27] flex items-center justify-center shrink-0 border border-amber-200">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <h3 className="font-display font-bold text-base text-[#1F1A16]">
                      Alamat Cafe
                    </h3>
                  </div>

                  <button
                    onClick={handleCopyAddress}
                    className="p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-stone-200 text-[#5C5248] text-xs font-semibold flex items-center gap-1 border border-[#EAE2D8] transition-colors cursor-pointer"
                    title="Salin Alamat"
                  >
                    {copiedAddress ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="text-[11px] text-emerald-700 font-bold">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Salin</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-[#5C5248] leading-relaxed pl-10">
                  {fullAddress}
                </p>
              </div>

              {/* Operating Schedule */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-[#1F1A16] font-bold">
                    <Clock className="w-4 h-4 text-amber-700" />
                    <span>Jam Operasional</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Buka Setiap Hari</span>
                  </span>
                </div>

                <div className="text-xs text-[#5C5248] space-y-1.5 pt-1 font-mono">
                  <div className="flex justify-between items-center py-1 border-b border-[#EAE2D8]">
                    <span>Senin – Minggu</span>
                    <span className="font-bold text-[#1F1A16]">10:00 – 23:00 WIB</span>
                  </div>
                  <div className="flex justify-between items-center text-amber-800 pt-0.5 font-bold">
                    <span className="flex items-center gap-1 font-sans font-semibold text-[11px]">
                      🎸 Live Acoustic
                    </span>
                    <span>Jumat & Sabtu 19:30 WIB</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch gap-2.5 pt-1">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Petunjuk Arah Maps</span>
                </a>

                <button
                  onClick={onOpenReservation}
                  className="py-3 px-4 rounded-xl bg-white hover:bg-stone-50 text-[#1F1A16] text-xs font-semibold border border-[#EAE2D8] hover:border-[#D5C9BC] transition-colors shadow-xs cursor-pointer"
                >
                  Booking Meja
                </button>
              </div>

            </div>

            {/* Parking & Facilities Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-[#5C5248]">
              <div className="bg-white p-3 rounded-2xl border border-[#EAE2D8] flex items-center gap-2 shadow-xs">
                <Car className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-medium text-xs">Parkir Mobil</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-[#EAE2D8] flex items-center gap-2 shadow-xs">
                <Bike className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-medium text-xs">Parkir Motor</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-[#EAE2D8] flex items-center gap-2 shadow-xs">
                <Wifi className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-medium text-xs">Wi-Fi 100M</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-[#EAE2D8] flex items-center gap-2 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-medium text-xs">AC & Musholla</span>
              </div>
            </div>

          </div>

          {/* Right Column: Live Interactive Google Map with Multi-Tab Controls (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-6 border border-[#EAE2D8] flex flex-col justify-between space-y-4 shadow-md">
            
            {/* View Switcher Tabs Header */}
            <div className="flex items-center justify-between gap-2 border-b border-[#EAE2D8] pb-3 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveMapView('interactive')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeMapView === 'interactive'
                      ? 'bg-[#C84B27] text-white shadow-xs'
                      : 'bg-[#FAF7F2] text-[#5C5248] border border-[#EAE2D8] hover:text-[#1F1A16]'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Peta Interaktif</span>
                </button>

                <button
                  onClick={() => setActiveMapView('landmarks')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeMapView === 'landmarks'
                      ? 'bg-[#C84B27] text-white shadow-xs'
                      : 'bg-[#FAF7F2] text-[#5C5248] border border-[#EAE2D8] hover:text-[#1F1A16]'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Patokan Rute</span>
                </button>

                <button
                  onClick={() => setActiveMapView('parking')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeMapView === 'parking'
                      ? 'bg-[#C84B27] text-white shadow-xs'
                      : 'bg-[#FAF7F2] text-[#5C5248] border border-[#EAE2D8] hover:text-[#1F1A16]'
                  }`}
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>Akses Parkir</span>
                </button>
              </div>

              {/* Fast External App Links */}
              <div className="hidden sm:flex items-center gap-2">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold flex items-center gap-1 transition-colors"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={wazeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-[11px] font-bold flex items-center gap-1 transition-colors"
                >
                  <span>Waze</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Interactive Viewport Area */}
            <div className="relative rounded-2xl overflow-hidden h-[340px] sm:h-[380px] border border-[#EAE2D8] bg-[#FAF7F2]">
              
              {/* 1. Live Google Maps Interactive iFrame */}
              {activeMapView === 'interactive' && (
                <div className="w-full h-full relative">
                  <iframe
                    title="Google Maps Homie Cozie Coffee and Kitchen"
                    src={embedMapsUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />

                  {/* Floating Pin Card Overlay on Map */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-[#EAE2D8] shadow-md flex items-center gap-2 text-xs max-w-[280px]">
                    <div className="w-7 h-7 rounded-lg bg-[#C84B27] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-display font-bold text-[#1F1A16] text-[11px] truncate">Homie Cozie Coffee & Kitchen</div>
                      <div className="text-[10px] text-[#5C5248] truncate">Jl. H. Hasan No. 23, Pasar Rebo</div>
                    </div>
                  </div>

                  {/* Interactive Map Hint Overlay */}
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#EAE2D8] text-[10px] font-mono text-[#5C5248] shadow-xs">
                    🔍 Geser & Zoom Peta Bebas
                  </div>
                </div>
              )}

              {/* 2. Landmarks & Route Guide */}
              {activeMapView === 'landmarks' && (
                <div className="p-6 h-full flex flex-col justify-between overflow-y-auto space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-sm text-[#1F1A16] flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-[#C84B27]" />
                      <span>Rute & Akses Menuju Homie Cozie</span>
                    </h3>
                    <p className="text-xs text-[#5C5248]">
                      Lokasi sangat mudah ditemukan, berada di pinggir jalan utama Jl. H. Hasan Kalisari.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {nearbyLandmarks.map((lm, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-[#EAE2D8] space-y-1 shadow-xs">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#1F1A16]">{lm.label}</span>
                          <span className="font-mono text-emerald-700 font-bold text-[11px]">{lm.time}</span>
                        </div>
                        <p className="text-[11px] text-[#5C5248] leading-relaxed">
                          {lm.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Patokan: Dekat persimpangan Kalisari Baru, bangunan estetik warna bata hangat.</span>
                  </div>
                </div>
              )}

              {/* 3. Parking & Space Access View */}
              {activeMapView === 'parking' && (
                <div className="p-6 h-full flex flex-col justify-between overflow-y-auto space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-sm text-[#1F1A16] flex items-center gap-1.5">
                      <Car className="w-4 h-4 text-[#C84B27]" />
                      <span>Fasilitas Parkir & Drop-Off</span>
                    </h3>
                    <p className="text-xs text-[#5C5248]">
                      Area parkir aman didukung oleh petugas parkir dan pengawasan kamera CCTV 24 jam.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white p-4 rounded-xl border border-[#EAE2D8] space-y-1.5 shadow-xs">
                      <div className="flex items-center gap-2 font-bold text-xs text-[#1F1A16]">
                        <Bike className="w-4 h-4 text-emerald-700" />
                        <span>Kapasitas Motor</span>
                      </div>
                      <div className="text-base font-display font-black text-[#1F1A16]">
                        30+ Motor
                      </div>
                      <p className="text-[11px] text-[#5C5248]">
                        Area parkir beratap rindang, ideal untuk kumpul komunitas motor #PITSTOP.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-[#EAE2D8] space-y-1.5 shadow-xs">
                      <div className="flex items-center gap-2 font-bold text-xs text-[#1F1A16]">
                        <Car className="w-4 h-4 text-emerald-700" />
                        <span>Kapasitas Mobil</span>
                      </div>
                      <div className="text-base font-display font-black text-[#1F1A16]">
                        8–10 Mobil
                      </div>
                      <p className="text-[11px] text-[#5C5248]">
                        Parkir depan cafe rata dan leluasa bermanuver masuk & keluar.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Free Parkir & Bebas Pungutan Liar untuk semua pengunjung cafe.</span>
                  </div>
                </div>
              )}

            </div>

            {/* Social & Contact Strip */}
            <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#EAE2D8] flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-4">
                <a
                  href="https://instagram.com/homiecozie.jkt"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-[#5C5248] font-semibold hover:text-[#1F1A16] transition-colors"
                >
                  <Instagram className="w-4 h-4 text-amber-700" />
                  <span>{CAFE_INFO.instagram}</span>
                </a>

                <a
                  href={`https://wa.me/${CAFE_INFO.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-[#5C5248] font-semibold hover:text-emerald-700 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>{CAFE_INFO.whatsapp}</span>
                </a>
              </div>

              <span className="text-[11px] font-mono text-[#5C5248]">
                Kalisari, Pasar Rebo, Jakarta Timur
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
