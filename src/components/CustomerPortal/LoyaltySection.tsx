import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Gift, 
  Check, 
  Coffee, 
  QrCode, 
  ArrowRight,
  Award
} from 'lucide-react';
import { triggerConfetti } from "../../utils/confettiHelper";
import { CAFE_INFO } from '../../data/mockData';

interface LoyaltySectionProps {
  onOpenMenu: () => void;
}

export const LoyaltySection: React.FC<LoyaltySectionProps> = ({ onOpenMenu }) => {
  const [stamps, setStamps] = useState<number>(7);
  const [points, setPoints] = useState<number>(380);
  const [activeTab, setActiveTab] = useState<'stamps' | 'vouchers'>('stamps');
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);

  // 3D Tilt State
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX(((y - centerY) / centerY) * -10);
    setRotateY(((x - centerX) / centerX) * 10);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handleRedeemVoucher = (code: string, pointCost: number) => {
    if (points >= pointCost) {
      setPoints((prev) => prev - pointCost);
      setRedeemedCode(code);
      try {
        triggerConfetti({ 
          particleCount: 50, 
          spread: 70,
          origin: { y: 0.7 }
        });
      } catch {}
    }
  };

  return (
    <section id="loyalty-section" className="py-16 bg-[#FAF7F2] text-[#1F1A16] border-b border-[#EAE2D8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-10 space-y-2">
          <h2 className="font-display font-black text-2xl sm:text-4xl text-[#1F1A16]">
            Kumpulkan Cap, Nikmati Kopi Gratis
          </h2>
          <p className="text-[#5C5248] text-xs sm:text-sm leading-relaxed">
            Dapatkan 1 cap digital setiap pembelian kopi specialty. Kumpulkan 10 cap untuk 1 cup minuman gratis atau tukarkan poin untuk potongan belanja.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive 3D VIP Pass (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Interactive 3D Perspective Tilt Card */}
            <div 
              style={{ perspective: 1000 }}
              className="w-full"
            >
              <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                animate={{ rotateX, rotateY }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                className="matte-vip-card rounded-2xl p-6 relative overflow-hidden text-white cursor-pointer select-none"
              >
                {/* Top Tier & Brand */}
                <div className="flex items-center justify-between relative z-10 mb-6">
                  <div>
                    <span className="text-[10px] font-mono tracking-wider text-amber-300/90 uppercase block font-semibold">
                      Digital VIP Member Card
                    </span>
                    <h3 className="font-display font-black text-xl text-white flex items-center gap-2">
                      <span>Gold Tier Member</span>
                      <Award className="w-4 h-4 text-amber-400" />
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-900 border border-[#3D322B] p-0.5 flex items-center justify-center shrink-0">
                    <img
                      src={CAFE_INFO.logo}
                      alt="Logo"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </div>

                {/* Cardholder Data */}
                <div className="space-y-4 relative z-10 font-mono mb-6">
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase">Nama Member</div>
                    <div className="font-sans font-bold text-base text-white">Bima Satria Nugraha</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/15">
                    <div>
                      <div className="text-[10px] text-stone-400 uppercase">Cozie Points</div>
                      <div className="font-mono font-bold text-lg text-amber-300">{points} Pts</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-400 uppercase">Cap Terkumpul</div>
                      <div className="font-mono font-bold text-lg text-emerald-400">{stamps} / 10 Cap</div>
                    </div>
                  </div>
                </div>

                {/* QR Code Bar */}
                <div className="bg-[#120E0C] text-stone-200 p-3 rounded-xl border border-white/10 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2 text-xs">
                    <QrCode className="w-4 h-4 text-amber-300" />
                    <span className="font-sans text-[11px]">Tunjukkan saat bayar</span>
                  </div>
                  <span className="font-mono text-xs text-amber-200 font-bold">
                    HC-GOLD-7729
                  </span>
                </div>

                <div className="text-center text-[10px] text-stone-400 mt-2 font-mono">
                  ✨ Geser kursor untuk efek 3D Card
                </div>
              </motion.div>
            </div>

            {/* Quick Benefits Card */}
            <div className="bg-white p-4 rounded-2xl border border-[#EAE2D8] text-xs space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-[#1F1A16] font-bold">
                <span>Keuntungan Gold Member</span>
                <span className="text-amber-800 font-mono text-[10px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Diskon 10% Tiap Rabu
                </span>
              </div>
              <p className="text-[11px] text-[#5C5248] leading-relaxed">
                Sebutkan nomor WhatsApp atau tunjukkan barcode di kasir saat memesan untuk otomatis mengumpulkan cap dan poin.
              </p>
              <button
                onClick={onOpenMenu}
                className="w-full py-2.5 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 mt-1 shadow-xs"
              >
                <span>Pesan Menu & Tambah Cap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Stamp Grid & Rewards Catalogue (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-7 border border-[#EAE2D8] space-y-6 shadow-xs">
            
            {/* Interactive Tabs */}
            <div className="flex items-center gap-2 border-b border-[#EAE2D8] pb-4">
              <button
                onClick={() => setActiveTab('stamps')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'stamps' 
                    ? 'bg-[#C84B27] text-white shadow-xs' 
                    : 'text-[#5C5248] hover:text-[#1F1A16] bg-[#FAF7F2] border border-[#EAE2D8]'
                }`}
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>Kartu 10 Cap</span>
              </button>

              <button
                onClick={() => setActiveTab('vouchers')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'vouchers' 
                    ? 'bg-[#C84B27] text-white shadow-xs' 
                    : 'text-[#5C5248] hover:text-[#1F1A16] bg-[#FAF7F2] border border-[#EAE2D8]'
                }`}
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Katalog Voucher Poin</span>
              </button>
            </div>

            {/* Stamp Card View */}
            {activeTab === 'stamps' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <h3 className="font-display font-bold text-[#1F1A16] text-base sm:text-lg">Progress Cap Digital</h3>
                    <p className="text-[#5C5248] text-xs">Cap ke-10 otomatis dapat 1 Kopi Susu / Latte GRATIS 🎁</p>
                  </div>
                  <span className="font-mono font-bold text-amber-900 text-lg sm:text-xl">{stamps} / 10 Cap</span>
                </div>

                {/* 10 Stamps Grid with Pop Animation */}
                <div className="grid grid-cols-5 gap-2.5 sm:gap-3">
                  {Array.from({ length: 10 }).map((_, index) => {
                    const isStamped = index < stamps;
                    const isRewardSlot = index === 9;

                    return (
                      <motion.div
                        key={index}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.04 }}
                        className={`aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all p-2 text-center relative ${
                          isStamped
                            ? 'bg-[#C84B27] border-[#C84B27] text-white shadow-xs'
                            : isRewardSlot
                            ? 'bg-amber-50 border-dashed border-amber-400 text-amber-800'
                            : 'bg-[#FAF7F2] border-[#EAE2D8] text-[#5C5248]'
                        }`}
                      >
                        {isStamped ? (
                          <>
                            <Check className="w-5 h-5 text-white stroke-[3]" />
                            <span className="text-[10px] font-mono font-bold mt-0.5">#{index + 1}</span>
                          </>
                        ) : isRewardSlot ? (
                          <>
                            <Gift className="w-5 h-5 text-amber-600" />
                            <span className="text-[9px] font-bold mt-0.5 uppercase">FREE CUP</span>
                          </>
                        ) : (
                          <>
                            <Coffee className="w-4 h-4 text-[#5C5248]" />
                            <span className="text-[10px] font-mono mt-0.5 text-[#5C5248]">#{index + 1}</span>
                          </>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] flex items-center justify-between text-xs">
                  <span className="text-[#5C5248]">Tinggal <strong className="text-[#B23812]">{10 - stamps} cap lagi</strong> untuk klaim kopi gratis berikutnya!</span>
                  <button 
                    onClick={onOpenMenu}
                    className="font-bold text-[#B23812] hover:underline"
                  >
                    Buka Menu →
                  </button>
                </div>
              </div>
            )}

            {/* Vouchers View */}
            {activeTab === 'vouchers' && (
              <div className="space-y-3">
                {[
                  { id: 'v-1', title: 'Diskon Rp 15.000 All Pasta', code: 'PASTAFIESTA15', cost: 150, desc: 'Min. belanja 50k di jam 16:00–20:00' },
                  { id: 'v-2', title: 'Free Upgrade Aren Cremosa', code: 'FREEAREN2026', cost: 200, desc: 'Tukar 200 Cozie Points untuk 1 Cup Aren Cremosa' },
                  { id: 'v-3', title: 'Potongan 20% Total Bill', code: 'HOMIEVIP20', cost: 350, desc: 'Khusus dine-in weekend min. 4 orang' }
                ].map((v) => {
                  const isRedeemed = redeemedCode === v.code;
                  const canAfford = points >= v.cost;

                  return (
                    <div
                      key={v.id}
                      className="p-4 rounded-xl border border-[#EAE2D8] bg-[#FAF7F2] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#1F1A16]">{v.title}</span>
                          <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                            {v.cost} Pts
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5C5248]">{v.desc}</p>
                        {isRedeemed && (
                          <div className="text-[11px] font-mono font-bold text-emerald-900 pt-1">
                            Kode Voucher: <span className="bg-white px-2 py-0.5 rounded border border-emerald-300">{v.code}</span>
                          </div>
                        )}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleRedeemVoucher(v.code, v.cost)}
                        disabled={!canAfford || isRedeemed}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shadow-xs ${
                          isRedeemed
                            ? 'bg-emerald-700 text-white cursor-default'
                            : canAfford
                            ? 'bg-[#C84B27] hover:bg-[#B23E1C] text-white'
                            : 'bg-stone-200 text-stone-700 cursor-not-allowed border border-stone-300 font-medium'
                        }`}
                      >
                        {isRedeemed ? '✓ Berhasil Ditukar' : canAfford ? 'Tukar Poin' : 'Poin Kurang'}
                      </motion.button>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
