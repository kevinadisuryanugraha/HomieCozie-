import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { animate } from 'animejs';
import { 
  Gift, 
  QrCode, 
  Clock, 
  Award, 
  CheckCircle2, 
  Coffee, 
  Copy, 
  Tag, 
  Check,
  PartyPopper,
  UtensilsCrossed,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SystemUser } from '../types';
import { CAFE_INFO } from '../data/mockData';

interface MemberPortalPageProps {
  currentUser: SystemUser;
  onNavigateTo: (mode: any) => void;
  onShowToast: (msg: string) => void;
}

export const MemberPortalPage: React.FC<MemberPortalPageProps> = ({
  currentUser,
  onNavigateTo,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'rewards' | 'vouchers' | 'history' | 'tiers'>('rewards');
  const [points, setPoints] = useState<number>(4250);
  const [copiedCard, setCopiedCard] = useState<boolean>(false);

  const pointsRef = useRef<HTMLSpanElement>(null);

  const [vouchers, setVouchers] = useState<{ id: string; title: string; code: string; validUntil: string; minOrder: number; isUsed: boolean; icon: React.ComponentType<{ className?: string }> }[]>([
    { id: 'v1', title: 'Diskon 25% Spesial Ulang Tahun', code: 'BDAY-COZIE-25', validUntil: '30 Sept 2026', minOrder: 50000, isUsed: false, icon: PartyPopper },
    { id: 'v2', title: 'Gratis 1 Kopi Susu Aren (Weekend Live Music)', code: 'AREN-FREE-MUSIC', validUntil: '31 Des 2026', minOrder: 0, isUsed: false, icon: Coffee },
    { id: 'v3', title: 'Potongan Rp 15.000 Menu Pasta & Mains', code: 'PASTA-SAVE-15', validUntil: '15 Okt 2026', minOrder: 75000, isUsed: false, icon: UtensilsCrossed }
  ]);

  const [rewardCatalog, setRewardCatalog] = useState([
    { id: 'r1', name: 'Free Kopi Susu Gula Aren Asli', cost: 2500, category: 'Coffee', image: '/photos/homie_cozie_008.webp', claimed: false },
    { id: 'r2', name: 'Voucher Makan Senilai Rp 25.000', cost: 2000, category: 'Voucher', image: '/photos/homie_cozie_105.webp', claimed: false },
    { id: 'r3', name: 'Gratis Croffle & Pancake Dessert', cost: 3000, category: 'Pastry', image: '/photos/homie_cozie_078.webp', claimed: false },
    { id: 'r4', name: 'Kopi Botolan 1 Liter Homie Cozie', cost: 6000, category: 'Merch', image: '/photos/homie_cozie_084.webp', claimed: false }
  ]);

  const transactionHistory = [
    { id: 'tx-101', date: '24 Agt 2026, 20:15', items: '2x Kopi Gula Aren, 1x Croissant Butter', total: 'Rp 78.000', pointsEarned: '+780 Pts', type: 'in' },
    { id: 'tx-102', date: '19 Agt 2026, 18:40', items: 'Tukar Voucher Potongan Rp 15.000', total: '-1.500 Pts', pointsEarned: '-1.500 Pts', type: 'out' },
    { id: 'tx-103', date: '12 Agt 2026, 19:30', items: '1x Nasi Goreng Kampung, 1x Manual Brew V60', total: 'Rp 68.000', pointsEarned: '+680 Pts', type: 'in' },
    { id: 'tx-104', date: '05 Agt 2026, 14:10', items: 'Bonus Registrasi Pertama Member VIP', total: 'Gratis', pointsEarned: '+2.000 Pts', type: 'in' }
  ];

  useEffect(() => {
    if (!pointsRef.current) return;
    const obj = { val: 0 };
    animate(obj, {
      val: points,
      duration: 1500,
      ease: 'outExpo',
      onUpdate: () => {
        if (pointsRef.current) {
          pointsRef.current.textContent = `${Math.round(obj.val).toLocaleString('id-ID')} Pts`;
        }
      }
    });
  }, [points]);

  const handleClaimReward = (reward: any) => {
    if (points < reward.cost) {
      onShowToast(`Poin tidak mencukupi! Anda butuh ${reward.cost - points} poin lagi.`);
      return;
    }
    setPoints(prev => prev - reward.cost);
    setRewardCatalog(prev => prev.map(r => r.id === reward.id ? { ...r, claimed: true } : r));
    
    const newVoucher = {
      id: `v-claimed-${Date.now()}`,
      title: `Hadiah Reward: ${reward.name}`,
      code: `REWARD-${Math.floor(1000 + Math.random() * 9000)}`,
      validUntil: '30 Hari dari Sekarang',
      minOrder: 0,
      isUsed: false,
      icon: '🎁'
    };
    setVouchers(prev => [newVoucher, ...prev]);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    onShowToast(`✓ Berhasil klaim ${reward.name}! Voucher tersimpan di tab Voucher Saya.`);
  };

  const handleCopyCard = () => {
    navigator.clipboard.writeText('HC-GOLD-2026-088');
    setCopiedCard(true);
    setTimeout(() => setCopiedCard(false), 2000);
    onShowToast('Nomor Member Card tersalin ke clipboard!');
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#FAF7F2] text-[#1F1A16] py-6 sm:py-10 px-3 sm:px-6 lg:px-8 pb-28 sm:pb-12 relative">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Header Banner */}
        <div className="bg-white border border-[#EAE2D8] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="text-xs font-mono font-medium text-[#8C7E72]">
              Gold Tier Member Privilege
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-[#1F1A16]">
              Halo, {(currentUser.role !== 'member' && currentUser.role !== 'guest') ? 'Bima Satria' : currentUser.name}!
            </h1>
            <p className="text-xs sm:text-sm text-[#5C5248] max-w-xl leading-relaxed">
              Kumpulkan Cozie Points setiap kali transaksi di Homie Cozie dan nikmati diskon eksklusif serta promo khusus member.
            </p>
          </div>

          <button
            onClick={() => onNavigateTo('order')}
            className="px-4 py-2.5 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-semibold text-xs flex items-center gap-2 self-start md:self-auto shrink-0 transition-colors shadow-xs"
          >
            <Coffee className="w-4 h-4" />
            <span>Pesan Menu & Tambah Poin</span>
          </button>
        </div>

        {/* Member Digital Card & Loyalty Status */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Matte VIP Card (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="matte-vip-card rounded-2xl p-6 relative overflow-hidden text-white shadow-lg">
              <div className="flex items-center justify-between relative z-10 mb-6">
                <div>
                  <span className="text-[10px] font-mono tracking-wider text-amber-300/80 uppercase block">
                    Digital Member Card
                  </span>
                  <h3 className="font-display font-bold text-xl text-white">
                    Gold Tier Member
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
                    <div className="font-mono font-bold text-lg text-amber-300" ref={pointsRef}>
                      {points.toLocaleString('id-ID')} Pts
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase">Cap Terkumpul</div>
                    <div className="font-mono font-bold text-lg text-emerald-400">7 / 10 Stamp</div>
                  </div>
                </div>
              </div>

              {/* QR Barcode Section */}
              <div className="bg-[#120E0C] text-stone-200 p-3 rounded-xl border border-white/10 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2 text-xs">
                  <QrCode className="w-5 h-5 text-amber-300" />
                  <span>HC-GOLD-2026-088</span>
                </div>
                <button
                  onClick={handleCopyCard}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
                  title="Salin Nomor Member"
                >
                  {copiedCard ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Tier Perks */}
            <div className="bg-white p-4 rounded-2xl border border-[#EAE2D8] space-y-3 shadow-xs">
              <h4 className="font-display font-black text-sm text-[#1F1A16] flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-700" />
                <span>Keuntungan Gold Member Anda</span>
              </h4>
              <div className="space-y-2 text-xs text-[#5C5248]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cashback 10% Cozie Points di setiap transaksi</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Voucher Diskon 25% Spesial Hari Ulang Tahun</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Prioritas RSVP Meja saat Weekend Live Music</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Tabs & Rewards Catalogue (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-[#EAE2D8] space-y-6 shadow-xs">
            
            {/* Tab Bar */}
            <div className="flex items-center gap-2 border-b border-[#EAE2D8] pb-4 overflow-x-auto no-scrollbar">
              {[
                { id: 'rewards', label: 'Tukar Poin', icon: Gift },
                { id: 'vouchers', label: `Voucher Saya (${vouchers.filter(v => !v.isUsed).length})`, icon: Tag },
                { id: 'history', label: 'Riwayat Transaksi', icon: Clock },
                { id: 'tiers', label: 'Tingkatan Tier', icon: Award }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`relative px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      isActive 
                        ? 'bg-[#C84B27] text-white shadow-xs' 
                        : 'text-[#5C5248] hover:text-[#1F1A16] bg-[#FAF7F2] border border-[#EAE2D8]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Reward Catalog */}
            {activeTab === 'rewards' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#5C5248]">Pilih menu atau voucher untuk ditukarkan dengan poin Anda:</span>
                  <span className="font-mono font-bold text-[#C84B27]">{points.toLocaleString('id-ID')} Pts Tersedia</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {rewardCatalog.map((reward) => {
                    const canAfford = points >= reward.cost;
                    return (
                      <div
                        key={reward.id}
                        className="bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#EAE2D8] flex flex-col justify-between p-4 space-y-3 shadow-xs"
                      >
                        <div className="flex gap-3">
                          <img
                            src={reward.image}
                            alt={reward.name}
                            className="w-16 h-16 rounded-xl object-cover border border-[#EAE2D8] shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] font-mono font-bold text-amber-800 uppercase">{reward.category}</span>
                            <h4 className="font-bold text-xs text-[#1F1A16] line-clamp-2 leading-snug">{reward.name}</h4>
                            <div className="font-mono font-bold text-[#C84B27] text-xs mt-1">
                              {reward.cost.toLocaleString('id-ID')} Pts
                            </div>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleClaimReward(reward)}
                          disabled={!canAfford}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                            canAfford
                              ? 'bg-[#C84B27] hover:bg-[#B23E1C] text-white'
                              : 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300'
                          }`}
                        >
                          {canAfford ? 'Tukarkan Poin' : `Poin Kurang (${(reward.cost - points).toLocaleString('id-ID')})`}
                        </motion.button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: Vouchers List */}
            {activeTab === 'vouchers' && (
              <div className="space-y-3">
                {vouchers.map((v) => {
                  const VIcon = v.icon;
                  return (
                    <div
                      key={v.id}
                      className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-900 flex items-center justify-center shrink-0">
                            <VIcon className="w-4 h-4" />
                          </div>
                          <h4 className="font-display font-bold text-sm text-[#1F1A16]">{v.title}</h4>
                        </div>
                        <div className="text-[11px] text-[#5C5248]">
                          Berlaku hingga: <span className="font-mono text-[#1F1A16]">{v.validUntil}</span>
                        </div>
                        <div className="font-mono font-bold text-xs text-emerald-700">
                          Kode: <span className="bg-white px-2 py-0.5 rounded border border-emerald-300">{v.code}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onNavigateTo('order')}
                        className="px-4 py-2 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white text-xs font-bold whitespace-nowrap self-start sm:self-auto shadow-xs cursor-pointer"
                      >
                        Pakai Saat Order
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab 3: Transaction History */}
            {activeTab === 'history' && (
              <div className="space-y-3">
                {transactionHistory.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] flex items-center justify-between text-xs shadow-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-[#1F1A16]">{tx.items}</div>
                      <div className="text-[11px] text-[#8C7E72] font-mono">{tx.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-[#1F1A16]">{tx.total}</div>
                      <div className={`font-mono font-bold text-[11px] ${tx.type === 'in' ? 'text-emerald-700' : 'text-[#C84B27]'}`}>
                        {tx.pointsEarned}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 4: Tiers Info */}
            {activeTab === 'tiers' && (
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8]">
                  <div className="font-bold text-[#1F1A16]">Silver Cozie (0 – 10 Kunjungan)</div>
                  <div className="text-[11px] text-[#5C5248] mt-1">Cashback 5% Poin & Voucher Selamat Datang.</div>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 shadow-xs">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <span>Gold Cozie (11 – 30 Kunjungan)</span>
                    <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">Level Anda Saat Ini</span>
                  </div>
                  <div className="text-[11px] text-amber-800 mt-1">Cashback 10% Poin, Diskon Ulang Tahun 25%, Prioritas RSVP Musik.</div>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-purple-200">
                  <div className="font-bold text-purple-900">Platinum VIP (30+ Kunjungan)</div>
                  <div className="text-[11px] text-[#5C5248] mt-1">Cashback 15% Poin, Free Manual Brew Bulanan, VIP Sofa Reservation.</div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
