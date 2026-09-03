import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  MessageCircle
} from 'lucide-react';
import { FAQ_ITEMS, CAFE_INFO } from '../../data/mockData';

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'Semua Pertanyaan' },
    { id: 'fasilitas', label: 'Fasilitas & WFH' },
    { id: 'acara', label: 'Live Music & Event' },
    { id: 'menu', label: 'Menu & Kehalalan' },
    { id: 'reservasi', label: 'Reservasi & Grup' },
    { id: 'pembayaran', label: 'Pembayaran' }
  ];

  const filteredFaqs = FAQ_ITEMS.filter(faq => {
    const matchesCat = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = 
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleAccordion = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <section id="faq-section" className="py-16 sm:py-20 bg-[#FAF7F2] text-[#1F1A16] border-b border-[#EAE2D8] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-[#1F1A16]">
            Pertanyaan yang Sering Diajukan
          </h2>

          <p className="text-[#5C5248] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
            Semua yang perlu Anda ketahui tentang fasilitas WFH, Live Music, reservasi meja, dan kehalalan menu di Homie Cozie.
          </p>
        </div>

        {/* Search Bar & Category Filters */}
        <div className="space-y-4 mb-10">
          <div className="relative">
            <Search className="w-5 h-5 text-[#5C5248] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari pertanyaan (misal: colokan, parkir, halal, live music)..."
              className="w-full bg-white border border-[#EAE2D8] rounded-xl pl-12 pr-4 py-3 text-sm text-[#1F1A16] placeholder:text-[#5C5248] focus:outline-none focus:border-[#C84B27] focus:ring-1 focus:ring-[#C84B27] transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#B23812] hover:underline"
              >
                Reset
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shadow-xs ${
                  activeCategory === cat.id
                    ? 'bg-[#C84B27] text-white border-[#C84B27]'
                    : 'bg-white text-[#5C5248] border-[#EAE2D8] hover:border-[#D5C9BC] hover:bg-stone-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List with Motion */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map(faq => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs ${
                    isOpen ? 'border-[#C84B27]/40 ring-1 ring-[#C84B27]/20' : 'border-[#EAE2D8] hover:border-[#D5C9BC]'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <div className="flex items-start gap-3">
                      {faq.tag && (
                        <span className="hidden sm:inline-block bg-[#FAF7F2] text-amber-800 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md border border-[#EAE2D8] shrink-0 mt-0.5">
                          {faq.tag}
                        </span>
                      )}
                      <span className="font-display font-bold text-sm sm:text-base text-[#1F1A16] leading-snug">
                        {faq.question}
                      </span>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen ? 'bg-[#C84B27] text-white rotate-180' : 'bg-[#FAF7F2] text-[#5C5248] border border-[#EAE2D8]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#5C5248] leading-relaxed border-t border-[#EAE2D8]">
                          <p>{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-dashed border-stone-300 text-center space-y-2">
              <HelpCircle className="w-8 h-8 text-[#B23812] mx-auto opacity-50" />
              <div className="font-bold text-sm text-[#1F1A16]">Pertanyaan tidak ditemukan</div>
              <p className="text-xs text-[#5C5248]">
                Silakan coba kata kunci lain atau hubungi admin WhatsApp kami secara langsung.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Direct WA Help Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-[#EAE2D8] text-[#1F1A16] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="font-display font-bold text-base text-[#1F1A16]">
                Masih Ada Pertanyaan Lain?
              </div>
              <div className="text-xs text-[#5C5248]">
                Admin WhatsApp kami siap membantu informasi reservasi & menu 24/7.
              </div>
            </div>
          </div>

          <motion.a
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            href={`https://wa.me/${CAFE_INFO.whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20Homie%20Cozie,%20saya%20ingin%20tanya%20informasi%20kafe...`}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5B] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat WhatsApp Admin</span>
          </motion.a>
        </div>

      </div>
    </section>
  );
};
