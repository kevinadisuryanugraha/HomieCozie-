import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  MapPin, 
  ExternalLink, 
  X, 
  Maximize2,
  Coffee,
  Music,
  Utensils,
  LayoutGrid
} from 'lucide-react';
import { GALLERY_ITEMS } from '../../data/mockData';
import { GalleryItem } from '../../types';

export const GallerySection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'ambience' | 'music' | 'coffee' | 'food'>('all');
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', label: 'Semua Galeri', icon: LayoutGrid },
    { id: 'ambience', label: 'Suasana & Area', icon: MapPin },
    { id: 'music', label: 'Live Music & Event', icon: Music },
    { id: 'coffee', label: 'Kopi & Barista', icon: Coffee },
    { id: 'food', label: 'Makanan & Kitchen', icon: Utensils }
  ];

  const filteredItems = GALLERY_ITEMS.filter(
    item => activeCategory === 'all' || item.category === activeCategory
  );

  return (
    <section id="gallery-section" className="py-16 sm:py-20 bg-[#FAF7F2] text-[#1F1A16] border-b border-[#EAE2D8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-[#1F1A16]">
            Galeri Suasana Homie Cozie
          </h2>

          <p className="text-[#5C5248] text-sm sm:text-base leading-relaxed font-normal">
            Intip sudut-sudut nyaman dari 4 zona kafe kami: Semi-Outdoor Stage, Indoor AC Utama, Mezzanine VIP Loft, hingga Backyard Garden yang asri.
          </p>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border shadow-xs ${
                  isActive
                    ? 'bg-[#C84B27] text-white border-[#C84B27]'
                    : 'bg-white text-[#5C5248] border-[#EAE2D8] hover:border-[#D5C9BC] hover:bg-stone-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-amber-600'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Gallery Grid with Motion */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredItems.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -6 }}
                onClick={() => setPreviewItem(item)}
                className="group bg-white rounded-2xl overflow-hidden border border-[#EAE2D8] hover:border-[#D5C9BC] shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    loading="lazy" decoding="async" width={400} height={300}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4 text-white">
                    <span className="text-xs font-semibold flex items-center gap-1.5 text-white">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Klik untuk memperbesar</span>
                    </span>
                    <span className="bg-[#C84B27] text-white text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                      {item.categoryLabel}
                    </span>
                  </div>

                  {/* Area Tag Badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[#1F1A16] text-[11px] font-bold px-3 py-1 rounded-xl border border-[#EAE2D8] shadow-xs">
                    {item.areaTag}
                  </div>
                </div>

                {/* Caption Content */}
                <div className="p-5 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-base sm:text-lg text-[#1F1A16] group-hover:text-[#B23812] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#5C5248] mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Callout banner */}
        <div className="mt-12 bg-white p-6 rounded-2xl border border-[#EAE2D8] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-base text-[#1F1A16]">
                Tag Kami di Instagram & TikTok!
              </div>
              <div className="text-xs text-[#5C5248]">
                Bagikan momen ngopi dan nongkrong Anda di @homiecozie.jkt
              </div>
            </div>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
          >
            <span>Buka Instagram @homiecozie.jkt</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
          </a>
        </div>

      </div>

      {/* Lightbox / Zoom Modal */}
      <AnimatePresence>
        {previewItem && (
          <div 
            onClick={() => setPreviewItem(null)}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs p-4 sm:p-6 flex items-center justify-center"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="bg-white max-w-3xl w-full rounded-3xl overflow-hidden border border-[#EAE2D8] shadow-2xl space-y-0 relative text-[#1F1A16]"
            >
              {/* Close button */}
              <button
                onClick={() => setPreviewItem(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-800 flex items-center justify-center transition-colors border border-[#EAE2D8] shadow-xs"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Image */}
              <div className="relative aspect-[16/10] bg-stone-100">
                <img
                  src={previewItem.imageUrl}
                  alt={previewItem.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#C84B27] text-white text-xs font-mono font-bold px-3 py-1 rounded-xl shadow-xs">
                  {previewItem.areaTag}
                </div>
              </div>

              {/* Modal Details */}
              <div className="p-6 space-y-2">
                <span className="text-xs font-mono font-bold text-amber-800 uppercase">
                  {previewItem.categoryLabel}
                </span>
                <h3 className="font-display font-black text-xl text-[#1F1A16]">
                  {previewItem.title}
                </h3>
                <p className="text-sm text-[#5C5248] leading-relaxed">
                  {previewItem.description}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
