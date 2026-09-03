import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShoppingBag, 
  CalendarDays, 
  Package, 
  UtensilsCrossed, 
  Store, 
  Users, 
  TrendingUp, 
  Sparkles 
} from 'lucide-react';
import { BackstageNavModuleId } from '../../../utils/rbac';

interface BackofficeQuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToModule: (mod: BackstageNavModuleId) => void;
}

export const BackofficeQuickActionModal: React.FC<BackofficeQuickActionModalProps> = ({
  isOpen,
  onClose,
  onNavigateToModule
}) => {
  const actions = [
    {
      id: 'pos' as BackstageNavModuleId,
      title: 'Input Pesanan Kasir (POS)',
      desc: 'Buka register billing kasir, proses pembayaran QRIS / Tunai.',
      icon: ShoppingBag,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-400'
    },
    {
      id: 'kds' as BackstageNavModuleId,
      title: 'Layar KDS Dapur & Bar',
      desc: 'Pantau antrean racikan kopi & makanan live.',
      icon: UtensilsCrossed,
      color: 'bg-orange-50 text-orange-800 border-orange-200 hover:border-orange-400'
    },
    {
      id: 'reservations' as BackstageNavModuleId,
      title: 'Booking & Reservasi Meja',
      desc: 'Catat reservasi tamu baru atau konfirmasi WhatsApp.',
      icon: CalendarDays,
      color: 'bg-teal-50 text-teal-800 border-teal-200 hover:border-teal-400'
    },
    {
      id: 'floorplan' as BackstageNavModuleId,
      title: 'Denah & Status Meja',
      desc: 'Lihat keterisian kursi Indoor, Garden, Stage, & Mezzanine.',
      icon: Store,
      color: 'bg-amber-50 text-amber-800 border-amber-200 hover:border-amber-400'
    },
    {
      id: 'inventory' as BackstageNavModuleId,
      title: 'Restock Bahan & Inventaris',
      desc: 'Update stok biji kopi, susu segar, daging & kemasan.',
      icon: Package,
      color: 'bg-purple-50 text-purple-800 border-purple-200 hover:border-purple-400'
    },
    {
      id: 'sales_revenue' as BackstageNavModuleId,
      title: 'Laporan Omzet & Pajak PB1',
      desc: 'Cetak rekapitulasi fiskal resmi & analitik laba-rugi.',
      icon: TrendingUp,
      color: 'bg-blue-50 text-blue-800 border-blue-200 hover:border-blue-400'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-2xs p-4 flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-white rounded-3xl max-w-xl w-full p-6 border border-[#EAE2D8] shadow-2xl space-y-6 text-[#1F1A16]"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D8]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-base text-[#1F1A16]">
                    Pintasan Aksi Cepat Restoran
                  </h3>
                  <p className="text-xs text-[#5C5248]">
                    Akses modul operasional langsung dalam 1 klik
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-stone-100 text-[#5C5248] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {actions.map(act => {
                const Icon = act.icon;
                return (
                  <button
                    key={act.id}
                    onClick={() => {
                      onClose();
                      onNavigateToModule(act.id);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer space-y-1.5 ${act.color}`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{act.title}</span>
                    </div>
                    <p className="text-[11px] opacity-80 leading-relaxed">
                      {act.desc}
                    </p>
                  </button>
                );
              })}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
