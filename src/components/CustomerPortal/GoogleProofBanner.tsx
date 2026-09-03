import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, MessageSquarePlus } from 'lucide-react';
import { GOOGLE_REVIEWS } from '../../data/mockData';

interface GoogleProofBannerProps {
  onOpenFeedback: () => void;
}

export const GoogleProofBanner: React.FC<GoogleProofBannerProps> = ({ onOpenFeedback }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const nextReview = () => {
    setActiveIdx((prev) => (prev + 1) % GOOGLE_REVIEWS.length);
  };

  const prevReview = () => {
    setActiveIdx((prev) => (prev - 1 + GOOGLE_REVIEWS.length) % GOOGLE_REVIEWS.length);
  };

  const current = GOOGLE_REVIEWS[activeIdx];

  return (
    <section className="bg-[#FAF7F2] py-14 border-b border-[#EAE2D8] text-[#1F1A16] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="text-xs font-mono font-bold text-[#3D332A] mb-1">
              Google Verified Reviews
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[#1F1A16]">
              Rating 4.8 dari 268+ Ulasan Google
            </h2>
            <p className="text-[#3D332A] text-xs sm:text-sm mt-1 max-w-xl font-normal leading-relaxed">
              Konsistensi rasa kopi, kenyamanan suasana, dan kehangatan pelayanan Homie Cozie selama 6 tahun di Kalisari & Cijantung.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Google Rating Display */}
            <div className="bg-white border border-[#EAE2D8] px-4 py-2 rounded-xl flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-900 font-mono font-bold flex items-center justify-center text-lg border border-amber-200">
                4.8
              </div>
              <div>
                <div className="flex items-center text-amber-500 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-600" />
                  ))}
                </div>
                <div className="text-[11px] font-bold text-[#3D332A] mt-0.5">
                  268+ Ulasan
                </div>
              </div>
            </div>

            <button
              onClick={onOpenFeedback}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Tulis Ulasan</span>
            </button>
          </div>
        </div>

        {/* Testimonials Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EAE2D8] shadow-xs">
          <div className="max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
              >
                {/* Rating Stars & Tag */}
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <div className="flex items-center text-amber-500 gap-1">
                    {[...Array(current.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-600" />
                    ))}
                  </div>
                  <span className="text-xs text-amber-950 font-bold bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                    {current.tag}
                  </span>
                  <span className="text-xs font-mono font-medium text-[#3D332A]">
                    • {current.date}
                  </span>
                </div>

                {/* Review Quote Text */}
                <p className="text-[#1F1A16] text-sm sm:text-base leading-relaxed">
                  "{current.content}"
                </p>

                {/* Author Info */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#EAE2D8]">
                  <div className="flex items-center gap-3">
                    <img
                      src={current.avatar}
                      alt={current.author}
                      width={36}
                      height={36}
                      loading="lazy"
                      decoding="async"
                      className="w-9 h-9 rounded-full object-cover border border-stone-300"
                    />
                    <div>
                      <div className="font-display font-bold text-sm text-[#1F1A16]">
                        {current.author}
                      </div>
                      <div className="text-[11px] text-[#3D332A] font-mono font-medium">
                        Google Reviewer
                      </div>
                    </div>
                  </div>

                  {/* Navigation Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevReview}
                      className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-800 transition-colors border border-[#EAE2D8] cursor-pointer font-bold"
                      aria-label="Previous Review"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-[#3D332A] px-1 font-mono font-bold">
                      {activeIdx + 1} / {GOOGLE_REVIEWS.length}
                    </span>
                    <button
                      onClick={nextReview}
                      className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-800 transition-colors border border-[#EAE2D8] cursor-pointer font-bold"
                      aria-label="Next Review"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
};
