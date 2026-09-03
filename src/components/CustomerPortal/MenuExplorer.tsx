import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coffee, 
  UtensilsCrossed, 
  Sparkles, 
  Flame, 
  Search, 
  Check, 
  X, 
  Plus, 
  ArrowRight,
  Filter,
  Wine,
  Utensils,
  Layers,
  Cake,
  FileDown
} from 'lucide-react';
import { triggerConfetti } from "../../utils/confettiHelper";
import { INITIAL_MENU_ITEMS, CAFE_INFO } from '../../data/mockData';
import { MenuItem, MenuCategory } from '../../types';
import { AIBaristaRecommender } from './AIBaristaRecommender';
import { SpotlightCard } from '../Common/SpotlightCard';

interface MenuExplorerProps {
  onAddToCart: (item: MenuItem, quantity?: number, selectedOptions?: Record<string, string>, notes?: string) => void;
  onOpenReservation: () => void;
}

export const MenuExplorer: React.FC<MenuExplorerProps> = ({ onAddToCart, onOpenReservation }) => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tagFilter, setTagFilter] = useState<'all' | 'bestseller' | 'chef'>('all');
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [addedItemSuccess, setAddedItemSuccess] = useState<string | null>(null);

  // Customization state
  const [sugar, setSugar] = useState<string>('Normal Sweet (100%)');
  const [ice, setIce] = useState<string>('Normal Ice');
  const [spiciness, setSpiciness] = useState<string>('Sedang');
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');

  const categories: { id: MenuItem['category'] | 'all'; label: string; icon: any }[] = [
    { id: 'all', label: 'Semua Menu', icon: UtensilsCrossed },
    { id: 'coffee', label: 'Kopi Susu & Espresso', icon: Coffee },
    { id: 'manual-brew', label: 'Manual Brew V60', icon: Sparkles },
    { id: 'non-coffee', label: 'Mocktail & Tea', icon: Wine },
    { id: 'kitchen-mains', label: 'Kitchen Mains', icon: Flame },
    { id: 'pasta-rice', label: 'Pasta & Noodles', icon: Utensils },
    { id: 'light-bites', label: 'Platter & Bites', icon: Layers },
    { id: 'pastry-dessert', label: 'Dessert & Croffle', icon: Cake }
  ];

  // Filtering
  const filteredItems = INITIAL_MENU_ITEMS.filter((item) => {
    // 1. Category filter
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    // 2. Search filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchTags = item.tasteProfile?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchTags) return false;
    }
    // 3. Tag filter
    if (tagFilter === 'bestseller' && !item.isBestSeller) return false;
    if (tagFilter === 'chef' && !item.isChefSpecial && !item.isChefRecommended) return false;

    return true;
  });

  const handleOpenCustomize = (item: MenuItem) => {
    setCustomizingItem(item);
    setQuantity(1);
    setNotes('');
    if (item.options?.sugarLevels) setSugar(item.options.sugarLevels[0]);
    if (item.options?.iceLevels) setIce(item.options.iceLevels[0]);
    if (item.options?.spiciness) setSpiciness(item.options.spiciness[0]);
  };

  const handleConfirmAddToCart = () => {
    if (!customizingItem) return;
    const options: Record<string, string> = {};
    if (customizingItem.options?.sugarLevels) options.sugar = sugar;
    if (customizingItem.options?.iceLevels) options.ice = ice;
    if (customizingItem.options?.spiciness) options.spiciness = spiciness;

    onAddToCart(customizingItem, quantity, options, notes);
    setAddedItemSuccess(customizingItem.id);

    try {
      triggerConfetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch {}

    setTimeout(() => {
      setAddedItemSuccess(null);
    }, 2000);

    setCustomizingItem(null);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  return (
    <section id="menu-section" className="py-16 bg-[#FAF7F2] text-[#1F1A16] border-b border-[#EAE2D8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Specialty Beans & Kitchen Recipes</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#1F1A16]">
              Daftar Menu Homie Cozie
            </h2>
            <p className="text-[#5C5248] text-xs sm:text-sm leading-relaxed">
              Semua sajian dibuat fresh to order dengan biji kopi arabika Nusantara pilihan dan resep bumbu khas dapur rumahan.
            </p>
          </div>

          <a
            href={CAFE_INFO.menuPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 font-bold text-xs transition-colors shadow-xs w-fit"
          >
            <FileDown className="w-4 h-4 text-amber-900" />
            <span>Buka / Unduh Buku Menu Resmi (PDF)</span>
          </a>
        </div>

        {/* AI Barista Smart Pairing Assistant */}
        <div className="mb-8">
          <AIBaristaRecommender
            onAddPairingBundle={(drink, food) => {
              onAddToCart(drink, 1);
              onAddToCart(food, 1);
            }}
          />
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EAE2D8] mb-10 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            
            {/* Search Box */}
            <div className="relative w-full sm:w-88">
              <Search className="w-4 h-4 text-[#5C5248] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari Kopi Susu, Aren Cremosa, Nasi Goreng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl text-xs font-medium text-[#1F1A16] placeholder:text-[#5C5248] focus:outline-none focus:border-[#C84B27] focus:ring-1 focus:ring-[#C84B27] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C5248] hover:text-[#1F1A16] text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Tag Badges */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0 text-xs">
              <button
                onClick={() => setTagFilter('all')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-xs font-semibold transition-colors ${
                  tagFilter === 'all' 
                    ? 'bg-stone-900 text-white shadow-xs' 
                    : 'bg-[#FAF7F2] text-[#5C5248] border border-[#EAE2D8] hover:bg-stone-200/60'
                }`}
              >
                Semua Menu
              </button>
              <button
                onClick={() => setTagFilter('bestseller')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-xs font-semibold transition-colors ${
                  tagFilter === 'bestseller' 
                    ? 'bg-[#C84B27] text-white shadow-xs' 
                    : 'bg-[#FAF7F2] text-amber-800 border border-[#EAE2D8] hover:bg-stone-200/60'
                }`}
              >
                Best Seller
              </button>
              <button
                onClick={() => setTagFilter('chef')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-xs font-semibold transition-colors ${
                  tagFilter === 'chef' 
                    ? 'bg-emerald-700 text-white shadow-xs' 
                    : 'bg-[#FAF7F2] text-emerald-800 border border-[#EAE2D8] hover:bg-stone-200/60'
                }`}
              >
                Chef's Pick
              </button>
            </div>

          </div>

          {/* Category Tabs: Responsive Flex-Wrap on Desktop, Hidden Smooth Swipe on Mobile (shadcn / motion) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar md:flex-wrap pb-1 relative">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isSelected 
                      ? 'text-white' 
                      : 'text-[#5C5248] hover:text-[#1F1A16] bg-[#FAF7F2] border border-[#EAE2D8] hover:bg-stone-200/60'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="menu-category-active-tab-pill"
                      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                      className="absolute inset-0 bg-[#C84B27] rounded-xl shadow-xs z-0"
                    />
                  )}
                  <Icon className={`w-3.5 h-3.5 shrink-0 relative z-10 ${isSelected ? 'text-white' : 'text-[#8C341A]'}`} />
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Cards Grid with Motion Stagger & 21st.dev Spotlight */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#EAE2D8] p-8 shadow-xs">
            <UtensilsCrossed className="w-12 h-12 text-stone-400 mx-auto mb-3" />
            <h3 className="text-lg font-display font-bold text-[#1F1A16]">Menu tidak ditemukan</h3>
            <p className="text-xs text-[#5C5248] mt-1">Coba gunakan kata kunci pencarian lain atau pilih kategori lain.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setTagFilter('all');
              }}
              className="mt-4 px-5 py-2.5 rounded-xl bg-[#C84B27] text-white text-xs font-bold shadow-xs hover:bg-[#B23E1C] cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredItems.map((item) => (
                <SpotlightCard
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col justify-between group shadow-xs hover:shadow-lg transition-all duration-300"
                >
                  {/* Image with Tag */}
                  <div className="relative h-44 overflow-hidden bg-stone-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                      loading="lazy" decoding="async" width={360} height={180}
                    />

                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      {item.isBestSeller && (
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#C84B27] text-white shadow-xs">
                          Best Seller
                        </span>
                      )}
                      {(item.isChefSpecial || item.isChefRecommended) && (
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-700 text-white shadow-xs">
                          Chef's Pick
                        </span>
                      )}
                      {!item.isBestSeller && item.isNew && (
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-900 text-white shadow-xs">
                          Baru
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#5C5248] mb-1.5">
                        <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          item.category === 'coffee' 
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : item.category === 'manual-brew'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : item.category === 'non-coffee'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : item.category === 'kitchen-mains'
                            ? 'bg-orange-50 text-orange-800 border-orange-200'
                            : item.category === 'pasta-rice'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : item.category === 'light-bites'
                            ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                            : 'bg-pink-50 text-pink-800 border-pink-200'
                        }`}>
                          {item.categoryLabel}
                        </span>
                        <span className="font-mono text-[11px] text-[#5C5248]">
                          ± {item.preparationTimeMinutes} mnt
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-base text-[#1F1A16] line-clamp-1 group-hover:text-[#B23812] transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#5C5248] line-clamp-2 mt-1 leading-relaxed">
                        {item.description}
                      </p>

                      {item.tasteProfile && (
                        <div className="mt-2 text-xs text-[#5C5248] font-mono">
                          <span className="text-amber-900 font-semibold">Notes:</span> {item.tasteProfile}
                        </div>
                      )}
                    </div>

                    {/* Price & Action Button */}
                    <div className="pt-3 border-t border-[#EAE2D8] flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-[#5C5248] font-mono">Harga</div>
                        <div className="font-mono font-bold text-[#1F1A16] text-base">
                          {formatRupiah(item.price)}
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleOpenCustomize(item)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors shadow-xs ${
                          addedItemSuccess === item.id
                            ? 'bg-emerald-700 text-white'
                            : 'bg-[#C84B27] hover:bg-[#B23E1C] text-white'
                        }`}
                      >
                        {addedItemSuccess === item.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Ditambahkan</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Pesan</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Customization Modal */}
        <AnimatePresence>
          {customizingItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white border border-[#EAE2D8] rounded-3xl max-w-md w-full p-6 text-[#1F1A16] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b border-[#EAE2D8] pb-3">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-amber-800">{customizingItem.categoryLabel}</span>
                    <h3 className="font-display font-black text-xl text-[#1F1A16]">{customizingItem.name}</h3>
                  </div>
                  <button
                    onClick={() => setCustomizingItem(null)}
                    className="p-1 text-stone-400 hover:text-stone-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Item image & summary */}
                <div className="flex gap-3 items-center bg-[#FAF7F2] p-3 rounded-2xl border border-[#EAE2D8]">
                  <img
                    src={customizingItem.image}
                    alt={customizingItem.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="w-16 h-16 rounded-xl object-cover border border-[#EAE2D8] shrink-0"
                  />
                  <div className="text-xs">
                    <div className="font-mono font-bold text-[#B23812] text-base">{formatRupiah(customizingItem.price)}</div>
                    <p className="text-[#5C5248] text-[11px] line-clamp-2 mt-0.5">{customizingItem.description}</p>
                  </div>
                </div>

                {/* Options: Sugar */}
                {customizingItem.options?.sugarLevels && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1F1A16]">Tingkat Manis (Sugar Level):</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {customizingItem.options.sugarLevels.map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setSugar(lvl)}
                          className={`p-2.5 rounded-xl text-left border font-medium transition-all ${
                            sugar === lvl 
                              ? 'bg-[#C84B27] border-[#C84B27] text-white font-bold shadow-xs' 
                              : 'bg-[#FAF7F2] border-[#EAE2D8] text-[#5C5248] hover:bg-stone-200/60'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Options: Ice */}
                {customizingItem.options?.iceLevels && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1F1A16]">Tingkat Es / Suhu (Temperature):</label>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {customizingItem.options.iceLevels.map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setIce(lvl)}
                          className={`p-2.5 rounded-xl text-center border font-medium transition-all ${
                            ice === lvl 
                              ? 'bg-[#C84B27] border-[#C84B27] text-white font-bold shadow-xs' 
                              : 'bg-[#FAF7F2] border-[#EAE2D8] text-[#5C5248] hover:bg-stone-200/60'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Options: Spiciness */}
                {customizingItem.options?.spiciness && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1F1A16]">Level Pedas (Spiciness):</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {customizingItem.options.spiciness.map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setSpiciness(lvl)}
                          className={`p-2.5 rounded-xl text-left border font-medium transition-all ${
                            spiciness === lvl 
                              ? 'bg-[#C84B27] border-[#C84B27] text-white font-bold shadow-xs' 
                              : 'bg-[#FAF7F2] border-[#EAE2D8] text-[#5C5248] hover:bg-stone-200/60'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity selector */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-bold text-[#1F1A16]">Jumlah Pesanan:</span>
                  <div className="flex items-center gap-3 bg-[#FAF7F2] px-3 py-1.5 rounded-2xl border border-[#EAE2D8]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-[#B23812] font-bold px-2 py-0.5 hover:bg-stone-200 rounded-lg"
                    >
                      -
                    </button>
                    <span className="font-mono text-sm font-bold text-[#1F1A16]">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-[#B23812] font-bold px-2 py-0.5 hover:bg-stone-200 rounded-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-xs font-bold text-[#1F1A16] block mb-1">Catatan Khusus untuk Dapur:</label>
                  <input
                    type="text"
                    placeholder="Mis. 'Kurangi minyak', 'Pisah sambal', dsb."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl text-xs text-[#1F1A16] placeholder:text-[#5C5248] focus:outline-none focus:border-[#C84B27]"
                  />
                </div>

                {/* Confirm Add to Cart */}
                <div className="pt-3 border-t border-[#EAE2D8] flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-mono text-[#5C5248]">Total Harga</div>
                    <div className="font-mono font-bold text-[#B23812] text-lg">
                      {formatRupiah(customizingItem.price * quantity)}
                    </div>
                  </div>

                  <button
                    onClick={handleConfirmAddToCart}
                    className="flex-1 py-3 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
                  >
                    Tambahkan ke Pesanan
                  </button>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
