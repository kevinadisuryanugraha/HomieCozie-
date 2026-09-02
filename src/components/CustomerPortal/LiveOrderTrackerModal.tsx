import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Clock, 
  Flame, 
  Coffee, 
  UtensilsCrossed, 
  Sparkles, 
  X, 
  ChefHat, 
  BellRing, 
  Check, 
  ArrowRight,
  RefreshCw,
  PhoneCall,
  MapPin,
  HeartHandshake
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { soundService } from '../../utils/audioChime';
import confetti from 'canvas-confetti';

interface LiveOrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdateStatus?: (orderId: string, status: OrderStatus) => void;
}

const STEPS = [
  {
    status: 'pending',
    title: 'Pesanan Diterima',
    subtitle: 'Sistem POS kasir telah memverifikasi pembayaran',
    icon: CheckCircle2,
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-200'
  },
  {
    status: 'preparing',
    title: 'Barista & Dapur Sedang Meracik',
    subtitle: 'Espresso diekstrak & dapur mulai memasak hidangan panas',
    icon: Flame,
    color: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-200'
  },
  {
    status: 'ready',
    title: 'Siap Diantar ke Meja',
    subtitle: 'Pelayan sedang membawa nampan sajian menuju meja Anda',
    icon: BellRing,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 border-emerald-200'
  },
  {
    status: 'completed',
    title: 'Selesai Disajikan',
    subtitle: 'Selamat menikmati sajian hangat di Homie Cozie!',
    icon: Sparkles,
    color: 'text-[#C84B27]',
    bg: 'bg-orange-50 border-orange-200'
  }
];

export const LiveOrderTrackerModal: React.FC<LiveOrderTrackerModalProps> = ({
  isOpen,
  onClose,
  order,
  onUpdateStatus
}) => {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order?.status || 'preparing');
  const [remainingSeconds, setRemainingSeconds] = useState<number>(540); // 9 minutes estimate

  useEffect(() => {
    if (order) {
      setCurrentStatus(order.status);
    }
  }, [order?.status]);

  // Countdown timer simulation
  useEffect(() => {
    if (!isOpen || currentStatus === 'completed') return;
    const timer = setInterval(() => {
      setRemainingSeconds(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, currentStatus]);

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 0;
      case 'preparing': return 1;
      case 'ready': return 2;
      case 'completed': return 3;
      case 'cancelled': return 0;
      default: return 1;
    }
  };

  const currentStepIdx = getStepIndex(currentStatus);

  const handleAdvanceStatus = () => {
    const sequence: OrderStatus[] = ['pending', 'preparing', 'ready', 'completed'];
    const nextIdx = (currentStepIdx + 1) % sequence.length;
    const nextStatus = sequence[nextIdx];
    
    setCurrentStatus(nextStatus);
    if (order && onUpdateStatus) {
      onUpdateStatus(order.id, nextStatus);
    }

    // Audio chime on state transition
    if (nextStatus === 'preparing') {
      soundService.playNewOrderChime();
    } else if (nextStatus === 'ready') {
      soundService.playWaiterCallChime();
    } else if (nextStatus === 'completed') {
      soundService.playNewOrderChime();
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  if (!isOpen || !order) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs p-3 sm:p-6 flex justify-center items-start"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-8 border border-[#EAE2D8] shadow-2xl space-y-6 my-4 sm:my-6 text-[#1F1A16]"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE2D8]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#C84B27] flex items-center justify-center font-bold">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-lg text-[#1F1A16]">
                  Live Order Tracker
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-[#5C5248]">
                Pesanan #{order.orderNumber} • Meja #{order.tableNumber || 'Takeaway'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-stone-200 text-[#5C5248] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Estimated Wait Badge */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-900 to-stone-800 text-white flex items-center justify-between shadow-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
              Estimasi Waktu Penyajian
            </span>
            <span className="text-xs text-stone-200 font-bold">
              {currentStatus === 'completed' ? 'Pesanan Telah Tiba di Meja' : 'Sedang Diramu oleh Barista'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-mono font-black text-amber-400">
              {currentStatus === 'completed' ? '00:00' : formatTimer(remainingSeconds)}
            </span>
            <span className="text-[10px] text-stone-400 block">Menit : Detik</span>
          </div>
        </div>

        {/* 4-Step Vertical / Horizontal Visual Stepper */}
        <div className="space-y-4 pt-2">
          {STEPS.map((step, idx) => {
            const isCompleted = currentStepIdx > idx;
            const isCurrent = currentStepIdx === idx;
            const isFuture = currentStepIdx < idx;
            const StepIcon = step.icon;

            return (
              <div 
                key={step.status}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-4 relative overflow-hidden ${
                  isCurrent 
                    ? 'bg-amber-50/60 border-[#C84B27]/40 shadow-xs' 
                    : isCompleted 
                      ? 'bg-emerald-50/40 border-emerald-200 opacity-90' 
                      : 'bg-[#FAF7F2] border-[#EAE2D8] opacity-50'
                }`}
              >
                {/* Left Step Circle / Icon */}
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border font-bold transition-all ${
                  isCurrent 
                    ? 'bg-[#C84B27] text-white border-[#C84B27] ring-4 ring-[#C84B27]/20 shadow-xs' 
                    : isCompleted 
                      ? 'bg-emerald-600 text-white border-emerald-600' 
                      : 'bg-white text-stone-400 border-stone-300'
                }`}>
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[3]" />
                  ) : (
                    <StepIcon className={`w-5 h-5 ${isCurrent ? 'animate-bounce' : ''}`} />
                  )}
                </div>

                {/* Step Content */}
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`font-display font-bold text-sm ${isCurrent ? 'text-[#C84B27]' : isCompleted ? 'text-emerald-900' : 'text-stone-700'}`}>
                      {step.title}
                    </h4>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#C84B27] text-white animate-pulse shrink-0">
                        Diproses
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5C5248] leading-relaxed">
                    {step.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Items Breakdown Accordion Box */}
        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8] space-y-2.5 text-xs">
          <div className="flex items-center justify-between border-b border-[#EAE2D8] pb-2 font-bold text-stone-800">
            <span>Rincian Menu ({order.items.reduce((acc, it) => acc + it.quantity, 0)} Item)</span>
            <span className="font-mono text-[#C84B27]">{formatRupiah(order.total)} (Lunas)</span>
          </div>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {order.items.map((it, idx) => (
              <div key={idx} className="flex items-center justify-between text-[#5C5248]">
                <span>{it.quantity}x {it.menuItem.name}</span>
                <span className="font-mono text-stone-700 font-medium">
                  {formatRupiah(it.menuItem.price * it.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Advance Status Simulator Bar */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-900 font-bold">
            <RefreshCw className="w-4 h-4 text-[#C84B27] shrink-0" />
            <span className="text-[11px]">Uji Coba Alur Dapur:</span>
          </div>
          <button
            onClick={handleAdvanceStatus}
            className="px-3.5 py-1.5 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <span>Simulasi Tahap Berikutnya ➔</span>
          </button>
        </div>

        {/* Bottom Button */}
        <div className="pt-2 flex gap-3">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-[#1F1A16] hover:bg-black text-white text-xs font-bold transition-all shadow-xs cursor-pointer text-center"
          >
            Tutup Pelacak Pesanan
          </button>
        </div>

      </motion.div>
    </div>
  );
};
