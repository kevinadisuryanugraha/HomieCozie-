import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Receipt, 
  Droplets, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Users, 
  MessageSquare,
  Send,
  HelpCircle,
  Clock
} from 'lucide-react';
import { WaiterCallRequest, WaiterCallType } from '../../types';
import { soundService } from '../../utils/audioChime';

interface WaiterCallWidgetProps {
  currentTableNumber?: string;
  onRequestAssistance: (request: Omit<WaiterCallRequest, 'id' | 'createdAt' | 'status'>) => void;
}

export const WaiterCallWidget: React.FC<WaiterCallWidgetProps> = ({
  currentTableNumber = '06',
  onRequestAssistance
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tableNumber, setTableNumber] = useState<string>(currentTableNumber);
  const [callType, setCallType] = useState<WaiterCallType>('call_waiter');
  const [customNote, setCustomNote] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const callOptions: { id: WaiterCallType; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      id: 'call_waiter',
      label: 'Panggil Pelayan',
      desc: 'Bantuan pelayan ke meja untuk tanya menu atau order tambahan',
      icon: Bell
    },
    {
      id: 'request_bill',
      label: 'Minta Cetak Bill',
      desc: 'Pelayan akan membawakan struk dan QRIS / EDC pembayaran',
      icon: Receipt
    },
    {
      id: 'water_refill',
      label: 'Refill Air / Es Batu',
      desc: 'Tambah air mineral dingin atau es batu tambahan',
      icon: Droplets
    },
    {
      id: 'clean_table',
      label: 'Bersihkan Meja',
      desc: 'Piring kosong atau sisa gelas santap diangkat',
      icon: Sparkles
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedOption = callOptions.find((o) => o.id === callType);

    onRequestAssistance({
      tableNumber: tableNumber.trim() || '06',
      callType,
      callTypeLabel: selectedOption?.label || 'Bantuan Meja',
      notes: customNote.trim() || undefined
    });

    soundService.playWaiterCallChime();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsOpen(false);
      setCustomNote('');
    }, 2200);
  };

  return (
    <>
      {/* Floating Waiter Call Button (Bottom Right above Cart/Navbar) */}
      <div className="fixed bottom-24 right-4 sm:right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="p-3.5 sm:px-4 sm:py-3 rounded-full bg-[#1F1A16] hover:bg-black text-white shadow-xl flex items-center gap-2 border border-white/10 cursor-pointer group"
          title="Panggil Pelayan / Minta Bill ke Meja"
        >
          <div className="relative">
            <Bell className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#C84B27] rounded-full ring-2 ring-[#1F1A16] animate-pulse" />
          </div>
          <span className="hidden sm:inline font-bold text-xs">Panggil Pelayan</span>
        </motion.button>
      </div>

      {/* Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-[#EAE2D8] shadow-2xl relative overflow-hidden space-y-5"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-[#FAF7F2] hover:bg-stone-200 text-[#5C5248] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-900 border border-amber-300 flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-[#1F1A16]">
                    Bantuan Meja Kafe
                  </h3>
                  <p className="text-xs text-[#5C5248]">
                    Pelayan Homie Cozie akan segera datang ke meja Anda.
                  </p>
                </div>
              </div>

              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200 p-5"
                >
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <div className="font-bold text-base text-emerald-900">
                    Permintaan Terkirim!
                  </div>
                  <p className="text-xs text-emerald-800">
                    Staf kafe telah menerima notifikasi untuk <strong>Meja #{tableNumber}</strong> dan segera menuju meja Anda.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Table Number Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1F1A16] flex items-center justify-between">
                      <span>Nomor Meja Anda:</span>
                      <span className="text-[11px] font-mono text-[#5C5248]">(Lihat stiker nomor di atas meja)</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder="Contoh: 06, M-02"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] text-sm font-mono font-bold text-[#1F1A16] focus:outline-hidden focus:ring-2 focus:ring-[#C84B27]/20 focus:border-[#C84B27]"
                    />
                  </div>

                  {/* Assistance Type Options */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#1F1A16]">
                      Jenis Bantuan:
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {callOptions.map((opt) => {
                        const isSelected = callType === opt.id;
                        const Icon = opt.icon;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setCallType(opt.id)}
                            className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500/10 border-amber-400 ring-1 ring-amber-400/40 text-[#1F1A16]'
                                : 'bg-[#FAF7F2] border-[#EAE2D8] text-[#5C5248] hover:border-[#D5C9BC]'
                            }`}
                          >
                            <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-amber-500 text-stone-900' : 'bg-white border border-[#EAE2D8]'}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-xs text-[#1F1A16]">
                                {opt.label}
                              </div>
                              <p className="text-[11px] text-[#5C5248] leading-tight mt-0.5">
                                {opt.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Optional Custom Note */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1F1A16]">
                      Catatan Tambahan (Opsional):
                    </label>
                    <input
                      type="text"
                      value={customNote}
                      onChange={(e) => setCustomNote(e.target.value)}
                      placeholder="Contoh: Minta tissue tambahan / bawa mesin EDC"
                      className="w-full px-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] text-xs text-[#1F1A16] focus:outline-hidden focus:ring-2 focus:ring-[#C84B27]/20 focus:border-[#C84B27]"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-2xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Kirim Panggilan ke Pelayan</span>
                    </button>
                  </div>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
