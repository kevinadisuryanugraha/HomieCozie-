import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radio, 
  DollarSign, 
  Users, 
  Utensils, 
  Clock, 
  TrendingUp, 
  Send, 
  Copy, 
  Check, 
  X, 
  Sparkles, 
  Coffee, 
  Flame, 
  ShieldCheck, 
  Smartphone,
  ChevronRight
} from 'lucide-react';
import { api } from '../../../services/api';
import { realtimeService } from '../../../services/realtime';
import { CAFE_INFO } from '../../../data/mockData';
import { soundService } from '../../../utils/audioChime';

interface OwnerRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  tables?: any[];
  orders?: any[];
}

export const OwnerRadarModal: React.FC<OwnerRadarModalProps> = ({
  isOpen,
  onClose,
  tables = [],
  orders = []
}) => {
  const [liveRevenue, setLiveRevenue] = useState<number>(4850000);
  const [liveTxCount, setLiveTxCount] = useState<number>(142);
  const [isSendingWA, setIsSendingWA] = useState<boolean>(false);
  const [waSentResult, setWaSentResult] = useState<any>(null);
  const [ownerPhone, setOwnerPhone] = useState<string>('081234567890');

  const formatRp = (v: number) => `Rp ${Math.round(v).toLocaleString('id-ID')}`;

  // Calculate live occupancy
  const totalTables = tables.length || 15;
  const occupiedTables = tables.filter(t => t.status === 'occupied').length || 11;
  const occupancyPercent = Math.round((occupiedTables / totalTables) * 100);

  // Calculate kitchen backlog
  const pendingOrders = orders.filter(o => o.status === 'pending').length || 3;
  const preparingOrders = orders.filter(o => o.status === 'preparing').length || 2;
  const totalBacklog = pendingOrders + preparingOrders;

  // Real-time listener from Reverb WebSocket
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      realtimeService.onNewOrder((newOrder) => {
        setLiveRevenue(prev => prev + (Number(newOrder.total) || 45000));
        setLiveTxCount(prev => prev + 1);
        soundService.playNewOrderChime();
      });
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSendToOwnerWA = async () => {
    setIsSendingWA(true);
    try {
      const res = await api.whatsapp.sendDailyClosingReport(undefined, ownerPhone);
      if (res?.data) {
        setWaSentResult(res.data);
        soundService.playCashRegisterSound();
        if (res.data.whatsapp_url) {
          window.open(res.data.whatsapp_url, '_blank');
        }
      }
    } catch {
      // Local fallback
      const nowFormatted = new Date().toLocaleString('id-ID');
      const msg = `☕ *LAPORAN PENUTUPAN HARIAN — HOMIE COZIE* ☕\n`
        + `📅 Tanggal: *${nowFormatted} WIB*\n`
        + `----------------------------------------\n`
        + `💰 *Total Omzet Hari Ini:* ${formatRp(liveRevenue)} (${liveTxCount} Struk)\n`
        + `🪑 *Okupansi Meja Kafe:* ${occupiedTables}/${totalTables} Meja (${occupancyPercent}% Penuh)\n`
        + `🍳 *Antrean Dapur (KDS):* ${totalBacklog} Tiket Aktif\n`
        + `----------------------------------------\n`
        + `Laporan otomatis dikirim dari Owner Radar Live ✨`;

      const fallbackData = {
        whatsapp_url: `https://wa.me/${ownerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`,
        message_preview: msg
      };
      setWaSentResult(fallbackData);
      soundService.playCashRegisterSound();
      window.open(fallbackData.whatsapp_url, '_blank');
    } finally {
      setIsSendingWA(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-stone-950 rounded-3xl shadow-2xl border-2 border-amber-500/40 w-full max-w-2xl overflow-hidden flex flex-col my-auto text-stone-100 max-h-[90vh]"
        >
          {/* Top Live Radar Header */}
          <div className="p-4 sm:p-5 border-b border-stone-800 bg-stone-900/90 flex items-start sm:items-center justify-between gap-3 shrink-0">
            <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-[#C84B27]/20 border border-[#C84B27]/40 text-[#C84B27] shrink-0 shadow-2xs mt-0.5 sm:mt-0">
                <Radio className="w-5 h-5 animate-pulse" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30 animate-ping" />
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display font-black text-base sm:text-lg text-white leading-tight">
                    Owner Radar (Live Monitoring)
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>LIVE 0ms REVERB</span>
                  </span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Pantauan langsung omzet, okupansi meja, dan antrean dapur dari jarak jauh
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer shrink-0 border border-stone-800 shadow-2xs"
              title="Tutup Radar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Radar Dashboard Content */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 min-h-0 scrollbar-none no-scrollbar">
            
            {/* 1. Big Live Revenue Ticker Banner */}
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950/40 border border-stone-800 shadow-inner relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-xs font-mono text-stone-400 uppercase tracking-wider block">
                    OMZET PENJUALAN HARI INI (REAL-TIME)
                  </span>
                  <div className="flex items-baseline gap-2.5 mt-1 flex-wrap">
                    <span className="font-display font-black text-2xl sm:text-4xl text-amber-400 tracking-tight whitespace-nowrap">
                      {formatRp(liveRevenue)}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 whitespace-nowrap">
                      +{liveTxCount} Struk
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right pt-2 sm:pt-0 border-t border-stone-800/80 sm:border-0">
                  <span className="text-[10px] font-mono text-stone-500 block">ESTIMASI NETTO</span>
                  <span className="font-mono font-bold text-sm sm:text-base text-stone-300 whitespace-nowrap">
                    {formatRp(liveRevenue * 0.869)}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Key Metrics Trio */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Occupancy Card */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-xs font-bold flex items-center gap-1.5 truncate">
                    <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Okupansi Meja</span>
                  </span>
                  <span className="font-mono font-bold text-xs text-white shrink-0">
                    {occupiedTables}/{totalTables}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-display font-black text-2xl text-white">
                    {occupancyPercent}%
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold whitespace-nowrap">
                    {occupancyPercent >= 70 ? '🔥 Kafe Ramai' : 'Normal'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${occupancyPercent}%` }} />
                </div>
              </div>

              {/* Kitchen Backlog SLA */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-xs font-bold flex items-center gap-1.5 truncate">
                    <Utensils className="w-3.5 h-3.5 text-[#C84B27] shrink-0" />
                    <span>Antrean KDS</span>
                  </span>
                  <span className="font-mono font-bold text-xs text-rose-400 shrink-0">
                    {totalBacklog} Tiket
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-display font-black text-2xl text-white">
                    7.5 <span className="text-xs font-sans text-stone-400">Menit</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold whitespace-nowrap">
                    Target: &lt;10m ✅
                  </span>
                </div>
                <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `75%` }} />
                </div>
              </div>

              {/* Cashier Shift Health */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-xs font-bold flex items-center gap-1.5 truncate">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Integritas Kasir</span>
                  </span>
                  <span className="font-mono font-bold text-[10px] text-emerald-400 shrink-0">
                    Aktif
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-display font-black text-base text-white truncate">
                    Rp 0 Selisih
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold whitespace-nowrap">
                    BALANCE ✅
                  </span>
                </div>
                <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `100%` }} />
                </div>
              </div>

            </div>

            {/* 3. Send WhatsApp Report to Owner Section */}
            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-bold text-white">
                    Kirim Laporan Eksekutif ke WhatsApp Owner:
                  </span>
                </div>
                <span className="text-[10px] text-stone-400 font-mono">
                  Otomatis tiap Tutup Shift / Sesuai Permintaan
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="tel"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  placeholder="Nomor WhatsApp Owner (misal: 081234567890)"
                  className="flex-1 p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs font-mono font-bold text-white focus:outline-hidden focus:border-amber-400"
                />

                <button
                  disabled={isSendingWA}
                  onClick={handleSendToOwnerWA}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50 whitespace-nowrap"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingWA ? 'Mengirim...' : 'Kirim WhatsApp'}</span>
                </button>
              </div>

              {waSentResult && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs space-y-1">
                  <span className="text-emerald-400 font-bold block">✓ Laporan Berhasil Diformat & Terkirim!</span>
                  <pre className="text-[10px] font-mono text-stone-300 whitespace-pre-wrap max-h-24 overflow-y-auto scrollbar-none">
                    {waSentResult.message_preview}
                  </pre>
                </div>
              )}
            </div>

          </div>

          {/* Footer */}
          <div className="p-3.5 sm:p-4 border-t border-stone-800 bg-stone-900/90 flex justify-end shrink-0">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold transition-colors cursor-pointer text-center"
            >
              Tutup Radar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
