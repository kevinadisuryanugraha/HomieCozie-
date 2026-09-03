import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, Order, OrderType, PaymentMethod } from '../../types';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  QrCode, 
  CheckCircle2, 
  CreditCard, 
  Banknote, 
  Sparkles, 
  ArrowRight, 
  Receipt,
  UtensilsCrossed,
  Clock,
  ExternalLink
} from 'lucide-react';
import { triggerConfetti } from "../../utils/confettiHelper";
import { CAFE_INFO } from '../../data/mockData';
import { soundService } from '../../utils/audioChime';

interface QROrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onSubmitOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => Order;
}

export const QROrderDrawer: React.FC<QROrderDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSubmitOrder
}) => {
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [tableNumber, setTableNumber] = useState<string>('06');
  const [customerName, setCustomerName] = useState<string>('Bima Satria');
  const [customerPhone, setCustomerPhone] = useState<string>('0813-8890-1122');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
  const serviceCharge = Math.round(subtotal * 0.05); // 5% service
  const tax = Math.round(subtotal * 0.10); // 10% PB1
  const total = subtotal + serviceCharge + tax;

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  const handleProcessOrder = () => {
    if (cartItems.length === 0) return;
    setIsProcessingPayment(true);
    soundService.playCashRegisterSound();

    setTimeout(() => {
      const newOrder = onSubmitOrder({
        orderType,
        tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
        customerName: customerName || 'Tamu Homie',
        customerPhone: customerPhone || undefined,
        items: [...cartItems],
        subtotal,
        serviceCharge,
        tax,
        discount: 0,
        total,
        paymentMethod,
        paymentStatus: 'paid'
      });

      setIsProcessingPayment(false);
      setCompletedOrder(newOrder);
      onClearCart();

      try {
        triggerConfetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }, 1200);
  };

  const handleCloseAndReset = () => {
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm">
      <div className="bg-white border-l border-[#EAE2D8] w-full max-w-lg h-full flex flex-col text-[#1F1A16] shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE2D8] flex items-center justify-between bg-[#FAF7F2] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#C84B27] shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-base sm:text-lg text-[#1F1A16]">
                {completedOrder ? 'Pesanan Terkirim ke Dapur!' : 'Keranjang Pesanan Meja'}
              </h3>
              <p className="text-xs text-[#5C5248]">
                {completedOrder ? `Order #${completedOrder.orderNumber}` : `${cartItems.length} menu dipilih`}
              </p>
            </div>
          </div>

          <button
            onClick={handleCloseAndReset}
            className="p-2 rounded-xl text-[#5C5248] hover:text-[#1F1A16] hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* COMPLETED ORDER RECEIPT VIEW */}
        {completedOrder ? (
          <div className="flex-1 p-5 overflow-y-auto space-y-5">
            <div className="bg-emerald-50 rounded-3xl p-5 border-2 border-emerald-300 shadow-md text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-display font-black text-xl text-[#1F1A16]">
                  Pesanan Berhasil Diproses! 🚀
                </h4>
                <p className="text-xs text-[#5C5248] mt-1 max-w-xs mx-auto leading-relaxed">
                  Pesanan sudah langsung masuk ke <strong>Kitchen Display System (KDS)</strong> dan sedang disiapkan tim barista & kitchen Homie Cozie.
                </p>
              </div>

              {/* Order Number Badge */}
              <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 flex items-center justify-around text-xs shadow-xs">
                <div>
                  <span className="text-[#5C5248] text-[10px] uppercase font-bold block">NO. ORDER</span>
                  <span className="font-mono font-black text-[#C84B27] text-sm">{completedOrder.orderNumber}</span>
                </div>
                <div>
                  <span className="text-[#5C5248] text-[10px] uppercase font-bold block">PENEMPATAN</span>
                  <span className="font-bold text-[#1F1A16] uppercase">
                    {completedOrder.orderType === 'dine-in' ? `Meja #${completedOrder.tableNumber}` : 'Takeaway'}
                  </span>
                </div>
                <div>
                  <span className="text-[#5C5248] text-[10px] uppercase font-bold block">METODE</span>
                  <span className="font-bold text-emerald-700 uppercase">{completedOrder.paymentMethod}</span>
                </div>
              </div>
            </div>

            {/* Receipt Item List */}
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE2D8] space-y-2.5 text-xs">
              <span className="font-bold text-[#1F1A16] block border-b border-[#EAE2D8] pb-2">
                Rincian Menu ({completedOrder.items.length} item):
              </span>
              {completedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs py-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#C84B27]">{item.quantity}x</span>
                    <span className="text-[#1F1A16] font-medium">{item.menuItem.name}</span>
                  </div>
                  <span className="font-mono font-bold text-[#1F1A16]">
                    {formatRupiah(item.menuItem.price * item.quantity)}
                  </span>
                </div>
              ))}

              <div className="pt-3 border-t border-[#EAE2D8] space-y-1 text-xs text-[#5C5248]">
                <div className="flex justify-between">
                  <span>Pajak Restoran PB1 (10%)</span>
                  <span className="font-mono">{formatRupiah(completedOrder.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Charge (5%)</span>
                  <span className="font-mono">{formatRupiah(completedOrder.serviceCharge)}</span>
                </div>
                <div className="flex justify-between text-[#1F1A16] font-bold text-sm pt-2 border-t border-[#EAE2D8]">
                  <span>Total Pembayaran (Lunas):</span>
                  <span className="font-display font-black text-[#C84B27] text-base">{formatRupiah(completedOrder.total)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCloseAndReset}
              className="w-full py-3.5 rounded-2xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
            >
              Selesai & Tutup Jendela
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          /* EMPTY CART VIEW */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200 text-[#C84B27] flex items-center justify-center shadow-inner">
              <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-display font-black text-lg text-[#1F1A16]">
                Keranjang Anda Masih Kosong
              </h4>
              <p className="text-xs text-[#5C5248] mt-1 max-w-xs leading-relaxed">
                Pilih racikan kopi favorit, hidangan lezat, atau coba rekomendasi pairing dari AI Barista kami.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Jelajahi Menu
            </button>
          </div>
        ) : (
          /* ACTIVE CART REVIEW & CHECKOUT VIEW */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            
            {/* Scrollable Items & Inputs Area */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
              
              {/* Order Type & Table Picker */}
              <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EAE2D8] space-y-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderType('dine-in')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      orderType === 'dine-in'
                        ? 'bg-[#C84B27] text-white shadow-xs'
                        : 'bg-white border border-[#EAE2D8] text-[#5C5248] hover:bg-stone-100'
                    }`}
                  >
                    Dine-in (Makan di Tempat)
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('takeaway')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      orderType === 'takeaway'
                        ? 'bg-[#C84B27] text-white shadow-xs'
                        : 'bg-white border border-[#EAE2D8] text-[#5C5248] hover:bg-stone-100'
                    }`}
                  >
                    Takeaway (Bawa Pulang)
                  </button>
                </div>

                {orderType === 'dine-in' && (
                  <div className="flex items-center justify-between pt-2 border-t border-[#EAE2D8] text-xs">
                    <span className="font-bold text-[#1F1A16]">Nomor Meja Anda:</span>
                    <select
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="bg-white border border-[#EAE2D8] rounded-xl px-3 py-1.5 font-mono font-bold text-xs text-[#1F1A16] focus:outline-none focus:border-[#C84B27]"
                    >
                      {Array.from({ length: 15 }, (_, i) => {
                        const num = String(i + 1).padStart(2, '0');
                        return (
                          <option key={num} value={num}>
                            Meja #{num}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-[#5C5248]">
                  <span className="font-bold text-[#1F1A16]">Daftar Menu Dipilih ({cartItems.length}):</span>
                  <button
                    onClick={onClearCart}
                    className="text-rose-600 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Kosongkan</span>
                  </button>
                </div>

                {cartItems.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="bg-white p-3.5 rounded-2xl border border-[#EAE2D8] shadow-xs flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-xs text-[#1F1A16] truncate">
                        {item.menuItem.name}
                      </h5>
                      <div className="font-mono text-xs text-[#C84B27] font-bold mt-0.5">
                        {formatRupiah(item.menuItem.price * item.quantity)}
                      </div>

                      {/* Options breakdown */}
                      <div className="text-[10px] text-[#5C5248] flex flex-wrap gap-1 mt-1">
                        {item.selectedOptions?.sugar && <span className="bg-stone-100 px-1.5 py-0.5 rounded font-medium">{item.selectedOptions.sugar}</span>}
                        {item.selectedOptions?.ice && <span className="bg-stone-100 px-1.5 py-0.5 rounded font-medium">{item.selectedOptions.ice}</span>}
                        {item.selectedOptions?.spiciness && <span className="bg-stone-100 px-1.5 py-0.5 rounded font-medium">{item.selectedOptions.spiciness}</span>}
                      </div>

                      {item.notes && (
                        <div className="text-[10px] text-amber-700 italic mt-0.5">
                          "{item.notes}"
                        </div>
                      )}
                    </div>

                    {/* Quantity counter */}
                    <div className="flex items-center gap-2 bg-[#FAF7F2] px-2.5 py-1 rounded-xl border border-[#EAE2D8] shrink-0">
                      <button
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                        className="text-[#C84B27] font-bold p-0.5 hover:scale-110 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-xs font-bold text-[#1F1A16] w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                        className="text-[#C84B27] font-bold p-0.5 hover:scale-110 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.cartItemId)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1F1A16] block">
                  Metode Pembayaran:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('qris')}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'qris'
                        ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold shadow-xs'
                        : 'bg-[#FAF7F2] border-[#EAE2D8] text-[#5C5248] hover:bg-stone-100'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-[#C84B27]" />
                    <span className="text-[11px]">QRIS Instant</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'cash'
                        ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold shadow-xs'
                        : 'bg-[#FAF7F2] border-[#EAE2D8] text-[#5C5248] hover:bg-stone-100'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span className="text-[11px]">Bayar di Kasir</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('debit')}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'debit'
                        ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold shadow-xs'
                        : 'bg-[#FAF7F2] border-[#EAE2D8] text-[#5C5248] hover:bg-stone-100'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span className="text-[11px]">Debit / EDC</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Sticky Total & Order Button */}
            <div className="p-4 sm:p-5 bg-[#FAF7F2] border-t border-[#EAE2D8] space-y-3 shrink-0 shadow-lg">
              <div className="space-y-1 text-xs text-[#5C5248]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Charge (5%)</span>
                  <span className="font-mono">{formatRupiah(serviceCharge)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pajak Restoran PB1 (10%)</span>
                  <span className="font-mono">{formatRupiah(tax)}</span>
                </div>
                <div className="flex justify-between text-[#1F1A16] font-bold text-sm pt-2 border-t border-[#EAE2D8]">
                  <span>Total Tagihan:</span>
                  <span className="font-display font-black text-[#C84B27] text-base">{formatRupiah(total)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleProcessOrder}
                disabled={isProcessingPayment}
                className="w-full py-3.5 rounded-2xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Memproses Transaksi & Mengirim ke Dapur...</span>
                  </>
                ) : (
                  <>
                    <span>Kirim Pesanan Sekarang ({formatRupiah(total)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
