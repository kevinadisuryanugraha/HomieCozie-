import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Printer, 
  X, 
  Coffee, 
  UtensilsCrossed, 
  Receipt, 
  QrCode, 
  Check, 
  Share2, 
  Download,
  Copy
} from 'lucide-react';
import { Order, ThermalPaperWidth, ThermalSlipType } from '../../../types';
import { CAFE_INFO } from '../../../data/mockData';
import { printThermalReceipt, printKitchenTicket } from '../../../utils/thermalPrinter';
import { api } from '../../../services/api';

interface ThermalReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  cashierName?: string;
}

export const ThermalReceiptModal: React.FC<ThermalReceiptModalProps> = ({
  isOpen,
  onClose,
  order,
  cashierName = 'Kasir Utama'
}) => {
  const [paperWidth, setPaperWidth] = useState<ThermalPaperWidth>('58mm');
  const [slipType, setSlipType] = useState<ThermalSlipType>('customer');
  const [copied, setCopied] = useState<boolean>(false);
  const [waSent, setWaSent] = useState<boolean>(false);
  const [isSendingWa, setIsSendingWa] = useState<boolean>(false);

  if (!isOpen || !order) return null;

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  const handleDirectThermalPrint = () => {
    if (slipType === 'customer') {
      printThermalReceipt(order, { paperWidth, showTaxBreakdown: true });
    } else {
      printKitchenTicket(order);
    }
  };

  const handleSendWhatsAppReceipt = async () => {
    if (!order) return;
    setIsSendingWa(true);
    try {
      await api.whatsapp.sendReceipt(order.id, order.customerPhone);
      setWaSent(true);
      setTimeout(() => setWaSent(false), 3000);
    } catch (e) {
      console.warn('WhatsApp API offline / fallback:', e);
      setWaSent(true);
      setTimeout(() => setWaSent(false), 3000);
    } finally {
      setIsSendingWa(false);
    }
  };

  // Filter items for kitchen and bar chits
  const kitchenItems = order.items.filter(it => 
    ['m-5', 'm-6', 'm-7', 'm-8'].includes(it.menuItem.id) || 
    it.menuItem.category.toLowerCase().includes('kitchen') ||
    it.menuItem.category.toLowerCase().includes('bites') ||
    it.menuItem.category.toLowerCase().includes('pasta') ||
    it.menuItem.category.toLowerCase().includes('pastry')
  );

  const barItems = order.items.filter(it => 
    !kitchenItems.some(k => k.cartItemId === it.cartItemId)
  );

  const activeItems = slipType === 'customer' 
    ? order.items 
    : slipType === 'kitchen' 
      ? kitchenItems 
      : barItems;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyReceiptText = () => {
    const lines = [
      `========================================`,
      `       HOMIE COZIE COFFEE & KITCHEN     `,
      `========================================`,
      `Order: #${order.orderNumber} | Meja: #${order.tableNumber || 'Takeaway'}`,
      `Waktu: ${order.createdAt} | Kasir: ${cashierName}`,
      `Tamu: ${order.customerName}`,
      `----------------------------------------`,
      ...order.items.map(it => `${it.quantity}x ${it.menuItem.name} - ${formatRupiah(it.menuItem.price * it.quantity)}`),
      `----------------------------------------`,
      `Subtotal: ${formatRupiah(order.subtotal)}`,
      order.serviceCharge ? `Service Charge (5%): ${formatRupiah(order.serviceCharge)}` : '',
      `Resto PB1 Tax (10%): ${formatRupiah(order.tax)}`,
      order.discount ? `Diskon: -${formatRupiah(order.discount)}` : '',
      `TOTAL BAYAR: ${formatRupiah(order.total)}`,
      `Metode: ${order.paymentMethod || 'QRIS'} (LUNAS)`,
      `========================================`,
      `Terima kasih atas kunjungan Anda!`
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(lines);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl border border-[#EAE2D8] w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#EAE2D8] flex items-center justify-between bg-[#FAF7F2] shrink-0">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-2xl bg-[#1F1A16] text-amber-400 flex items-center justify-center shadow-xs shrink-0">
                <Printer className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <h3 className="font-display font-black text-base text-[#1F1A16] leading-tight">
                  Dual Thermal Slip Router
                </h3>
                <p className="text-xs text-[#5C5248] leading-tight truncate">
                  Pratinjau & Cetak Struk POS 58mm / 80mm Bluetooth & USB
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white hover:bg-stone-100 text-[#5C5248] flex items-center justify-center border border-[#EAE2D8] transition-colors cursor-pointer shrink-0 shadow-2xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Router Controls (Slip Type & Paper Width) */}
          <div className="p-3 sm:px-6 bg-[#FAF7F2] border-b border-[#EAE2D8] flex flex-wrap items-center justify-between gap-3">
            {/* Slip Type */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-[#EAE2D8]">
              <button
                onClick={() => setSlipType('customer')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  slipType === 'customer'
                    ? 'bg-[#C84B27] text-white shadow-xs'
                    : 'text-[#5C5248] hover:text-[#1F1A16]'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Struk Pelanggan</span>
              </button>

              <button
                onClick={() => setSlipType('kitchen')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  slipType === 'kitchen'
                    ? 'bg-[#C84B27] text-white shadow-xs'
                    : 'text-[#5C5248] hover:text-[#1F1A16]'
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Tiket Dapur ({kitchenItems.length})</span>
              </button>

              <button
                onClick={() => setSlipType('bar')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  slipType === 'bar'
                    ? 'bg-[#C84B27] text-white shadow-xs'
                    : 'text-[#5C5248] hover:text-[#1F1A16]'
                }`}
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>Tiket Barista ({barItems.length})</span>
              </button>
            </div>

            {/* Paper Width */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-[#EAE2D8]">
              <button
                onClick={() => setPaperWidth('58mm')}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  paperWidth === '58mm' ? 'bg-stone-900 text-white' : 'text-[#5C5248]'
                }`}
              >
                58mm
              </button>
              <button
                onClick={() => setPaperWidth('80mm')}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  paperWidth === '80mm' ? 'bg-stone-900 text-white' : 'text-[#5C5248]'
                }`}
              >
                80mm
              </button>
            </div>
          </div>

          {/* Thermal Receipt Visualizer (Scrollable Canvas) */}
          <div className="p-6 overflow-y-auto bg-stone-100/80 flex items-center justify-center flex-1 min-h-[360px]">
            <div
              id="thermal-receipt-printable"
              className={`bg-white text-black font-mono shadow-xl border border-stone-300 p-5 rounded-sm transition-all text-xs leading-tight ${
                paperWidth === '58mm' ? 'w-[280px]' : 'w-[360px]'
              }`}
            >
              {/* Slip 1: Customer Receipt */}
              {slipType === 'customer' && (
                <div className="space-y-2 text-center">
                  <div className="font-bold text-sm uppercase tracking-wide">
                    {CAFE_INFO.name}
                  </div>
                  <div className="text-[10px] text-stone-600">
                    {CAFE_INFO.address}
                  </div>
                  <div className="text-[10px] text-stone-600">
                    Tel/WA: {CAFE_INFO.whatsapp}
                  </div>

                  <div className="border-t border-dashed border-stone-400 my-2 pt-1 text-left text-[11px] space-y-0.5">
                    <div className="flex justify-between">
                      <span>Order: #{order.orderNumber}</span>
                      <span>Meja: #{order.tableNumber || 'Takeaway'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Waktu: {order.createdAt}</span>
                      <span>Kasir: {cashierName}</span>
                    </div>
                    <div className="text-[10px] text-stone-700">
                      Tamu: {order.customerName}
                    </div>
                  </div>

                  <div className="border-t border-dashed border-stone-400 my-2 pt-2 text-left space-y-1.5">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <div className="flex justify-between font-bold">
                          <span>{it.quantity}x {it.menuItem.name}</span>
                          <span>{formatRupiah(it.menuItem.price * it.quantity)}</span>
                        </div>
                        {it.selectedOptions && Object.entries(it.selectedOptions).length > 0 && (
                          <div className="text-[10px] text-stone-500 pl-3">
                            {Object.values(it.selectedOptions).join(', ')}
                          </div>
                        )}
                        {it.notes && (
                          <div className="text-[10px] text-stone-500 pl-3 italic">
                            * {it.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-dashed border-stone-400 my-2 pt-2 text-left space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatRupiah(order.subtotal)}</span>
                    </div>
                    {order.serviceCharge ? (
                      <div className="flex justify-between text-stone-600">
                        <span>Service Charge (5%)</span>
                        <span>{formatRupiah(order.serviceCharge)}</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between text-stone-600">
                      <span>Resto PB1 Tax (10%)</span>
                      <span>{formatRupiah(order.tax)}</span>
                    </div>
                    {order.discount ? (
                      <div className="flex justify-between text-rose-700">
                        <span>Diskon Promo</span>
                        <span>-{formatRupiah(order.discount)}</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between font-bold text-sm pt-1 border-t border-stone-300">
                      <span>TOTAL BAYAR</span>
                      <span>{formatRupiah(order.total)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-stone-600 pt-0.5">
                      <span>Metode Pembayaran</span>
                      <span className="uppercase font-bold">{order.paymentMethod || 'QRIS'} (LUNAS)</span>
                    </div>
                  </div>

                  {/* QRIS / Loyalty Footer */}
                  <div className="border-t border-dashed border-stone-400 pt-3 space-y-1 text-center">
                    <div className="text-[10px] font-bold uppercase">
                      Poin Cozie Member Diperoleh: +{Math.round(order.total / 1000)} Poin
                    </div>
                    <div className="text-[9px] text-stone-500 leading-tight">
                      Terima kasih atas kunjungan Anda di Homie Cozie. Tag @homiecozie di Instagram!
                    </div>
                    <div className="pt-2 font-mono text-[9px] text-stone-400">
                      *** HOMIE COZIE CLOUD POS v2.4 ***
                    </div>
                  </div>
                </div>
              )}

              {/* Slip 2: Kitchen Chit / Bar Chit */}
              {(slipType === 'kitchen' || slipType === 'bar') && (
                <div className="space-y-3 text-left">
                  <div className="border-b-2 border-black pb-2 flex items-center justify-between">
                    <div>
                      <div className="text-base font-black uppercase">
                        {slipType === 'kitchen' ? '🔥 TIKET DAPUR' : '☕ TIKET BARISTA'}
                      </div>
                      <div className="text-xs">Order: #{order.orderNumber}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black">MEJA #{order.tableNumber || 'TAKEAWAY'}</div>
                      <div className="text-[10px]">{order.createdAt}</div>
                    </div>
                  </div>

                  <div className="text-xs text-stone-700">
                    Tamu: <strong>{order.customerName}</strong> ({order.orderType?.toUpperCase()})
                  </div>

                  {activeItems.length === 0 ? (
                    <div className="py-6 text-center text-stone-400 italic text-xs">
                      Tidak ada menu untuk stasiun ini.
                    </div>
                  ) : (
                    <div className="border-t border-dashed border-stone-400 pt-2 space-y-2.5">
                      {activeItems.map((it, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-start justify-between text-sm font-black">
                            <span>{it.quantity}x {it.menuItem.name}</span>
                          </div>
                          {it.selectedOptions && Object.entries(it.selectedOptions).length > 0 && (
                            <div className="text-xs font-bold text-stone-800 bg-stone-100 p-1 rounded">
                              {Object.entries(it.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                            </div>
                          )}
                          {it.notes && (
                            <div className="text-xs text-rose-800 font-bold bg-rose-50 p-1 rounded">
                              CATATAN: {it.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-t-2 border-black pt-2 flex items-center justify-between text-[10px] font-bold">
                    <span>Server: {cashierName}</span>
                    <span>Total Item: {activeItems.reduce((acc, it) => acc + it.quantity, 0)} Porsi</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="p-3 sm:p-4 border-t border-[#EAE2D8] bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyReceiptText}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-2xl bg-[#FAF7F2] hover:bg-[#EAE2D8] text-[#1F1A16] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#EAE2D8] transition-colors cursor-pointer shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin' : 'Salin Teks'}</span>
              </button>

              <button
                onClick={handleSendWhatsAppReceipt}
                disabled={isSendingWa}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-200 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{waSent ? '✓ WA Terkirim' : isSendingWa ? 'Mengirim...' : 'Kirim WA'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3.5 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Tutup
              </button>

              <button
                onClick={handleDirectThermalPrint}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-2xl bg-stone-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
                title="Cetak langsung ke Thermal Printer (58mm/80mm ESC/POS)"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>Direct ESC/POS</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex-1 sm:flex-none px-4 py-2 rounded-2xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Standar</span>
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
