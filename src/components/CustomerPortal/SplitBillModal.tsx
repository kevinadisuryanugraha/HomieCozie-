import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Split, 
  Receipt, 
  Check, 
  UserPlus, 
  Trash2, 
  X,
  Share2,
  QrCode,
  Sparkles,
  CheckCircle2,
  Copy,
  Smartphone
} from 'lucide-react';
import { triggerConfetti } from "../../utils/confettiHelper";
import { CartItem } from '../../types';
import { soundService } from '../../utils/audioChime';
import { CAFE_INFO } from '../../data/mockData';

interface SplitBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  tableNumber?: string;
  subtotal: number;
  serviceCharge: number;
  tax: number;
  total: number;
}

interface SplitPerson {
  id: string;
  name: string;
  avatarBg: string;
  assignedItemIds: string[]; // cartItemId array
  isPaid: boolean;
}

const AVATAR_COLORS = [
  'bg-amber-600',
  'bg-emerald-600',
  'bg-blue-600',
  'bg-rose-600',
  'bg-purple-600',
  'bg-teal-600',
  'bg-orange-600',
  'bg-indigo-600'
];

export const SplitBillModal: React.FC<SplitBillModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  tableNumber = '06',
  subtotal,
  serviceCharge,
  tax,
  total
}) => {
  const [splitMode, setSplitMode] = useState<'equal' | 'by-item'>('equal');
  const [equalPeopleCount, setEqualPeopleCount] = useState<number>(3);
  const [paidStatusMap, setPaidStatusMap] = useState<Record<number, boolean>>({});
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [activeQRISPerson, setActiveQRISPerson] = useState<{ name: string; amount: number } | null>(null);

  // By Item People state
  const [people, setPeople] = useState<SplitPerson[]>([
    { id: 'p1', name: 'Bima (Saya)', avatarBg: AVATAR_COLORS[0], assignedItemIds: cartItems.length > 0 ? [cartItems[0].cartItemId] : [], isPaid: false },
    { id: 'p2', name: 'Rian Pratama', avatarBg: AVATAR_COLORS[1], assignedItemIds: cartItems.length > 1 ? [cartItems[1].cartItemId] : [], isPaid: false },
    { id: 'p3', name: 'Dina Wahyuni', avatarBg: AVATAR_COLORS[2], assignedItemIds: cartItems.length > 2 ? [cartItems[2].cartItemId] : [], isPaid: false }
  ]);
  const [newPersonName, setNewPersonName] = useState<string>('');

  const formatRupiah = (val: number) => `Rp ${Math.round(val).toLocaleString('id-ID')}`;

  if (!isOpen) return null;

  // EQUAL SPLIT CALCULATIONS
  const equalSubtotalPerPerson = subtotal / equalPeopleCount;
  const equalServicePerPerson = serviceCharge / equalPeopleCount;
  const equalTaxPerPerson = tax / equalPeopleCount;
  const equalTotalPerPerson = Math.round(total / equalPeopleCount);

  // BY ITEM CALCULATIONS
  const getPersonSubtotal = (person: SplitPerson) => {
    return cartItems
      .filter(it => person.assignedItemIds.includes(it.cartItemId))
      .reduce((acc, it) => acc + it.menuItem.price * it.quantity, 0);
  };

  const getPersonCalculations = (person: SplitPerson) => {
    const pSub = getPersonSubtotal(person);
    const pService = Math.round(pSub * 0.05);
    const pTax = Math.round(pSub * 0.10);
    const pTotal = pSub + pService + pTax;
    return { pSub, pService, pTax, pTotal };
  };

  // Progress calculations
  const totalCollected = splitMode === 'equal'
    ? Object.values(paidStatusMap).filter(Boolean).length * equalTotalPerPerson
    : people.filter(p => p.isPaid).reduce((acc, p) => acc + getPersonCalculations(p).pTotal, 0);

  const percentCollected = Math.min(100, Math.round((totalCollected / (total || 1)) * 100));

  const handleTogglePaidEqual = (idx: number) => {
    setPaidStatusMap(prev => {
      const next = { ...prev, [idx]: !prev[idx] };
      if (next[idx]) {
        soundService.playCashRegisterSound();
        const paidCount = Object.values(next).filter(Boolean).length;
        if (paidCount === equalPeopleCount) {
          try { triggerConfetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } }); } catch {}
        }
      }
      return next;
    });
  };

  const handleTogglePaidByItem = (personId: string) => {
    setPeople(prev => {
      const next = prev.map(p => {
        if (p.id === personId) {
          const nextState = !p.isPaid;
          if (nextState) soundService.playCashRegisterSound();
          return { ...p, isPaid: nextState };
        }
        return p;
      });
      if (next.every(p => p.isPaid)) {
        try { triggerConfetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } }); } catch {}
      }
      return next;
    });
  };

  const handleAssignItem = (cartItemId: string, personId: string) => {
    setPeople(prev => prev.map(p => {
      if (p.id === personId) {
        const already = p.assignedItemIds.includes(cartItemId);
        return {
          ...p,
          assignedItemIds: already ? p.assignedItemIds.filter(id => id !== cartItemId) : [...p.assignedItemIds, cartItemId]
        };
      }
      return p;
    }));
  };

  const handleAddPerson = () => {
    if (!newPersonName.trim()) return;
    const newPerson: SplitPerson = {
      id: `p-${Date.now()}`,
      name: newPersonName.trim(),
      avatarBg: AVATAR_COLORS[people.length % AVATAR_COLORS.length],
      assignedItemIds: [],
      isPaid: false
    };
    setPeople(prev => [...prev, newPerson]);
    setNewPersonName('');
  };

  const handleRemovePerson = (id: string) => {
    if (people.length <= 2) return;
    setPeople(prev => prev.filter(p => p.id !== id));
  };

  const handleCopyShareLink = () => {
    let text = `☕ *RINCIAN PATUNGAN SPLIT BILL — HOMIE COZIE* ☕\n`
      + `Meja: #${tableNumber} • Total Tagihan: ${formatRupiah(total)}\n`
      + `----------------------------------------\n`;

    if (splitMode === 'equal') {
      text += `Mode: Bagi Rata (${equalPeopleCount} Orang)\n`
        + `💳 Nominal per Orang: *${formatRupiah(equalTotalPerPerson)}*\n\n`;
      for (let i = 0; i < equalPeopleCount; i++) {
        text += `${i + 1}. Orang ke-${i + 1}: ${formatRupiah(equalTotalPerPerson)} [${paidStatusMap[i] ? 'LUNAS ✅' : 'BELUM BAYAR ⏳'}]\n`;
      }
    } else {
      text += `Mode: Split per Menu\n\n`;
      people.forEach((p, idx) => {
        const { pTotal } = getPersonCalculations(p);
        text += `${idx + 1}. *${p.name}*: ${formatRupiah(pTotal)} [${p.isPaid ? 'LUNAS ✅' : 'BELUM BAYAR ⏳'}]\n`;
      });
    }

    text += `\nSilakan bayar porsi masing-masing via QRIS di meja!\nTerima kasih ✨`;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE2D8] shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col space-y-4 my-auto overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EAE2D8] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200 text-[#B23812] flex items-center justify-center shadow-xs">
              <Split className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-[#1F1A16]">
                Split Bill / Patungan Meja #{tableNumber}
              </h3>
              <span className="text-xs text-[#5C5248] font-mono">
                Total Tagihan: <strong className="text-[#B23812]">{formatRupiah(total)}</strong> (Termasuk PB1 10% + Service 5%)
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-100 text-[#5C5248] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Settlement Progress Bar */}
        <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EAE2D8] space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[#5C5248]">Status Pelunasan Patungan Meja:</span>
            <span className={percentCollected === 100 ? 'text-emerald-900' : 'text-[#B23812]'}>
              {formatRupiah(totalCollected)} / {formatRupiah(total)} ({percentCollected}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${percentCollected === 100 ? 'bg-emerald-500' : 'bg-[#C84B27]'}`}
              style={{ width: `${percentCollected}%` }}
            />
          </div>
        </div>

        {/* Split Mode Switcher */}
        <div className="grid grid-cols-2 gap-2 bg-[#FAF7F2] p-1.5 rounded-2xl border border-[#EAE2D8] text-xs font-bold">
          <button
            onClick={() => setSplitMode('equal')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              splitMode === 'equal' ? 'bg-[#C84B27] text-white shadow-xs' : 'text-[#5C5248] hover:text-[#1F1A16]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>1. Bagi Rata (Equally)</span>
          </button>

          <button
            onClick={() => setSplitMode('by-item')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              splitMode === 'by-item' ? 'bg-[#C84B27] text-white shadow-xs' : 'text-[#5C5248] hover:text-[#1F1A16]'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>2. Split per Menu (By Item)</span>
          </button>
        </div>

        {/* Mode 1: Equal Split */}
        {splitMode === 'equal' && (
          <div className="space-y-4 overflow-y-auto flex-1 pr-1">
            {/* Number of People Selector */}
            <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-[#EAE2D8]">
              <span className="text-xs font-bold text-[#1F1A16]">Jumlah Orang Patungan:</span>
              <div className="flex items-center gap-2">
                {[2, 3, 4, 5, 6].map(num => (
                  <button
                    key={num}
                    onClick={() => setEqualPeopleCount(num)}
                    className={`w-8 h-8 rounded-xl font-mono font-bold text-xs border transition-all cursor-pointer ${
                      equalPeopleCount === num
                        ? 'bg-[#C84B27] text-white border-[#C84B27] shadow-xs scale-105'
                        : 'bg-[#FAF7F2] text-[#5C5248] border-[#EAE2D8] hover:bg-stone-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Individual Equal Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Array.from({ length: equalPeopleCount }).map((_, idx) => {
                const isPaid = Boolean(paidStatusMap[idx]);
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                      isPaid
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : 'bg-white border-[#EAE2D8] shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} text-white font-bold text-xs flex items-center justify-center shadow-2xs`}>
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[#1F1A16]">Teman #{idx + 1}</div>
                        <div className="font-display font-black text-sm text-[#B23812]">
                          {formatRupiah(equalTotalPerPerson)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setActiveQRISPerson({ name: `Teman #${idx + 1}`, amount: equalTotalPerPerson })}
                        className="p-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        title="Tampilkan QRIS Payer"
                      >
                        <QrCode className="w-3.5 h-3.5 text-[#B23812]" />
                        <span>QRIS</span>
                      </button>

                      <button
                        onClick={() => handleTogglePaidEqual(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                          isPaid
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-[#FAF7F2] hover:bg-stone-200 text-[#5C5248] border border-[#EAE2D8]'
                        }`}
                      >
                        {isPaid ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Lunas</span>
                          </>
                        ) : (
                          <span>Bayar</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Mode 2: By Item Split */}
        {splitMode === 'by-item' && (
          <div className="space-y-4 overflow-y-auto flex-1 pr-1">
            {/* Add Person Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newPersonName}
                onChange={(e) => setNewPersonName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddPerson()}
                placeholder="Tambah nama teman (misal: Aldi, Rina)..."
                className="flex-1 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] text-xs font-bold text-[#1F1A16] focus:outline-hidden focus:border-[#C84B27]"
              />
              <button
                onClick={handleAddPerson}
                className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>

            {/* People List with Item Assignment */}
            <div className="space-y-3">
              {people.map((p) => {
                const { pSub, pTax, pService, pTotal } = getPersonCalculations(p);
                return (
                  <div
                    key={p.id}
                    className={`p-3.5 rounded-2xl border-2 transition-all space-y-2.5 ${
                      p.isPaid ? 'bg-emerald-50/60 border-emerald-300' : 'bg-white border-[#EAE2D8] shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl ${p.avatarBg} text-white font-bold text-xs flex items-center justify-center shadow-2xs`}>
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-[#1F1A16]">{p.name}</div>
                          <div className="font-mono text-[10px] text-[#5C5248]">
                            Subtotal: {formatRupiah(pSub)} + Tax/Svc: {formatRupiah(pTax + pService)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-display font-black text-sm text-[#B23812]">
                          {formatRupiah(pTotal)}
                        </span>

                        <button
                          onClick={() => setActiveQRISPerson({ name: p.name, amount: pTotal })}
                          disabled={pTotal === 0}
                          className="p-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer disabled:opacity-40"
                        >
                          <QrCode className="w-3.5 h-3.5 text-[#B23812]" />
                          <span>QRIS</span>
                        </button>

                        <button
                          onClick={() => handleTogglePaidByItem(p.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            p.isPaid
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'bg-white hover:bg-stone-200 text-[#5C5248] border border-[#EAE2D8]'
                          }`}
                        >
                          {p.isPaid ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Lunas</span>
                            </>
                          ) : (
                            <span>Bayar</span>
                          )}
                        </button>

                        {people.length > 2 && (
                          <button
                            onClick={() => handleRemovePerson(p.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Item Pills Assignment */}
                    <div className="pt-2 border-t border-[#EAE2D8]/60 space-y-1">
                      <span className="text-[10px] font-bold text-[#5C5248] block">
                        Pilih menu yang dimakan oleh {p.name}:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cartItems.map((it) => {
                          const isAssigned = p.assignedItemIds.includes(it.cartItemId);
                          return (
                            <button
                              key={it.cartItemId}
                              onClick={() => handleAssignItem(it.cartItemId, p.id)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                                isAssigned
                                  ? 'bg-stone-900 text-white font-bold shadow-2xs'
                                  : 'bg-[#FAF7F2] border border-[#EAE2D8] text-[#5C5248] hover:bg-stone-100'
                              }`}
                            >
                              <span>{it.menuItem.name} (x{it.quantity})</span>
                              <span className="font-mono text-[10px] text-amber-300">
                                {formatRupiah(it.menuItem.price * it.quantity)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-[#EAE2D8] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleCopyShareLink}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-[#FAF7F2] hover:bg-stone-200 text-[#1F1A16] border border-[#EAE2D8] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-900">Rincian WhatsApp Tersalin!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#B23812]" />
                <span>Bagikan Rincian Patungan ke WhatsApp</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-[#C84B27] hover:bg-[#B23E1C] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Selesai
          </button>
        </div>

        {/* Individual Payer QRIS Modal */}
        {activeQRISPerson && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 border border-[#EAE2D8] shadow-2xl w-full max-w-xs text-center space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE2D8] pb-2">
                <div className="text-left">
                  <span className="text-[10px] font-mono text-[#5C5248]">QRIS SPLIT BILL</span>
                  <h4 className="font-bold text-sm text-[#1F1A16]">{activeQRISPerson.name}</h4>
                </div>
                <button
                  onClick={() => setActiveQRISPerson(null)}
                  className="p-1 rounded-lg hover:bg-stone-100 text-[#5C5248] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-2 px-4 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] text-amber-800 font-bold block">Nominal Patungan:</span>
                <span className="font-display font-black text-2xl text-[#B23812]">
                  {formatRupiah(activeQRISPerson.amount)}
                </span>
              </div>

              <div className="bg-white p-3 rounded-2xl border-2 border-stone-800 inline-block shadow-md">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=00020101021226600016ID.CO.HOMIECOZIE0118936009180000000000520458125303360540${activeQRISPerson.amount}5802ID5912HOMIE_COZIE6013JAKARTA_TIMUR62150111SPLIT-${Date.now().toString().slice(-6)}6304`}
                  alt="QRIS Split Share"
                  className="w-40 h-40 object-contain mx-auto"
                />
              </div>

              <p className="text-[11px] text-[#5C5248]">
                Scan menggunakan BCA Mobile, Livin, GoPay, OVO, ShopeePay, atau Dana.
              </p>

              <button
                onClick={() => setActiveQRISPerson(null)}
                className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold cursor-pointer"
              >
                Tutup QRIS
              </button>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
};
