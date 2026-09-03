import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CartItem, 
  Order, 
  OrderType, 
  PaymentMethod,
  MenuItem
} from '../types';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  QrCode, 
  CheckCircle2, 
  Banknote, 
  Sparkles, 
  Receipt,
  UtensilsCrossed,
  ArrowLeft,
  Percent,
  Clock,
  Check,
  Split,
  Coffee
} from 'lucide-react';
import { triggerConfetti } from "../utils/confettiHelper";
import { SplitBillModal } from '../components/CustomerPortal/SplitBillModal';
import { LiveOrderTrackerModal } from '../components/CustomerPortal/LiveOrderTrackerModal';
import { QRISDynamicModal } from '../components/CustomerPortal/QRISDynamicModal';
import { ThermalReceiptModal } from '../components/BackstageOps/pos/ThermalReceiptModal';
import { INITIAL_MENU_ITEMS } from '../data/mockData';

interface OrderCheckoutPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onAddToCart: (menuItem: MenuItem, qty?: number) => void;
  onSubmitOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => Order;
  onNavigateTo: (mode: any) => void;
}

export const OrderCheckoutPage: React.FC<OrderCheckoutPageProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onAddToCart,
  onSubmitOrder,
  onNavigateTo
}) => {
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [tableNumber, setTableNumber] = useState<string>('06');
  const [customerName, setCustomerName] = useState<string>('Bima Satria');
  const [customerPhone, setCustomerPhone] = useState<string>('081298765432');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [useMemberPoints, setUseMemberPoints] = useState<boolean>(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [pendingQRISOrder, setPendingQRISOrder] = useState<Order | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [isSplitBillOpen, setIsSplitBillOpen] = useState<boolean>(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState<boolean>(false);
  const [isQRISModalOpen, setIsQRISModalOpen] = useState<boolean>(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
  const discount = useMemberPoints ? Math.min(15000, Math.round(subtotal * 0.15)) : 0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const serviceCharge = Math.round(taxableAmount * 0.05);
  const tax = Math.round(taxableAmount * 0.10);
  const total = taxableAmount + serviceCharge + tax;

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  const recommendedItems = INITIAL_MENU_ITEMS.filter(m => 
    (m.category === 'light-bites' || m.category === 'pastry-dessert') &&
    !cartItems.some(ci => ci.menuItem.id === m.id)
  ).slice(0, 3);

  const handleProcessOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError(null);

    if (cartItems.length === 0) {
      setOrderError('Keranjang pesanan masih kosong. Silakan pilih menu terlebih dahulu.');
      return;
    }

    if (orderType === 'dine-in' && (!tableNumber || tableNumber.trim() === '')) {
      setOrderError('Nomor meja wajib diisi untuk pesanan Makan di Tempat (Dine-In).');
      return;
    }

    if (!customerName || customerName.trim().length < 2) {
      setOrderError('Nama pemesan wajib diisi minimal 2 karakter.');
      return;
    }

    if (customerPhone && customerPhone.trim() !== '') {
      const cleanPhone = customerPhone.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        setOrderError('Format nomor telepon tidak valid (minimal 10 digit).');
        return;
      }
    }
    
    if (paymentMethod === 'qris') {
      const order = onSubmitOrder({
        orderType,
        tableNumber: orderType === 'dine-in' ? tableNumber.trim() : undefined,
        customerName: customerName.trim(),
        customerPhone: customerPhone?.trim() || undefined,
        items: [...cartItems],
        subtotal,
        serviceCharge,
        tax,
        discount,
        total,
        paymentMethod: 'qris',
        paymentStatus: 'pending'
      });

      setPendingQRISOrder(order);
      setIsQRISModalOpen(true);
      return;
    }

    setIsProcessingPayment(true);

    setTimeout(() => {
      const order = onSubmitOrder({
        orderType,
        tableNumber: orderType === 'dine-in' ? tableNumber.trim() : undefined,
        customerName: customerName.trim(),
        customerPhone: customerPhone?.trim() || undefined,
        items: [...cartItems],
        subtotal,
        serviceCharge,
        tax,
        discount,
        total,
        paymentMethod,
        paymentStatus: 'paid'
      });

      setCompletedOrder(order);
      setIsProcessingPayment(false);
      onClearCart();

      try {
        triggerConfetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#FAF7F2] text-[#1F1A16] py-6 sm:py-10 px-3 sm:px-6 lg:px-8 pb-28 sm:pb-12 relative">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Header Card */}
        <div className="bg-white border border-[#EAE2D8] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-50 text-teal-800 border border-teal-200 mb-1">
              <QrCode className="w-3.5 h-3.5 text-teal-600" />
              <span>Smart Table Ordering & QRIS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-[#1F1A16]">
              Pesanan Digital & Checkout
            </h1>
            <p className="text-xs text-[#5C5248]">
              Pesan langsung dari meja atau bawa pulang (Takeaway) tanpa perlu antre di kasir.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigateTo('customer')}
            className="px-4 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-stone-200 text-[#1F1A16] border border-[#EAE2D8] text-xs font-bold flex items-center gap-2 self-start sm:self-auto transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#C84B27]" />
            <span>Tambah Menu Lain</span>
          </motion.button>
        </div>

        {/* Validation Alert */}
        <AnimatePresence>
          {orderError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 font-bold"
            >
              <span>{orderError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items List (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white border border-[#EAE2D8] rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-[#EAE2D8] pb-4">
                <h3 className="font-display font-black text-lg text-[#1F1A16] flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#C84B27]" />
                  <span>Item Pesanan ({cartItems.reduce((acc, it) => acc + it.quantity, 0)})</span>
                </h3>
                {cartItems.length > 0 && (
                  <button
                    onClick={onClearCart}
                    className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Kosongkan</span>
                  </button>
                )}
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-14 space-y-3">
                  <UtensilsCrossed className="w-12 h-12 text-stone-300 mx-auto" />
                  <h4 className="font-display font-bold text-[#1F1A16] text-base">Keranjang Anda Masih Kosong</h4>
                  <p className="text-xs text-[#5C5248] max-w-xs mx-auto">
                    Jelajahi menu kopi specialty dan kitchen mains khas Homie Cozie.
                  </p>
                  <button
                    onClick={() => onNavigateTo('customer')}
                    className="mt-2 px-5 py-2.5 rounded-xl bg-[#C84B27] text-white text-xs font-bold shadow-xs hover:bg-[#B23E1C]"
                  >
                    Buka Menu Sekarang
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.cartItemId}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EAE2D8] flex items-center justify-between gap-4 shadow-xs"
                      >
                        <div className="flex items-center gap-3.5">
                          <img
                            src={item.menuItem.image}
                            alt={item.menuItem.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80';
                            }}
                            className="w-14 h-14 rounded-xl object-cover border border-[#EAE2D8] shrink-0"
                          />
                          <div className="space-y-0.5">
                            <h4 className="font-display font-bold text-sm text-[#1F1A16]">{item.menuItem.name}</h4>
                            <div className="text-[11px] font-mono text-[#C84B27] font-bold">
                              {formatRupiah(item.menuItem.price)}
                            </div>
                            {item.selectedOptions && (
                              <div className="text-[10px] text-[#5C5248]">
                                {Object.values(item.selectedOptions).filter(Boolean).join(' • ')}
                              </div>
                            )}
                            {item.notes && (
                              <div className="text-[10px] text-[#5C5248] italic">
                                Note: {item.notes}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-white border border-[#EAE2D8] px-2 py-1 rounded-xl shadow-xs">
                            <button
                              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                              className="text-stone-500 hover:text-stone-800 px-1 font-bold"
                            >
                              -
                            </button>
                            <span className="font-mono text-xs font-bold text-[#1F1A16] px-1">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                              className="text-[#C84B27] hover:text-[#B23E1C] px-1 font-bold"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.cartItemId)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Recommended Upsell Items */}
            {recommendedItems.length > 0 && (
              <div className="bg-white border border-[#EAE2D8] rounded-2xl p-5 shadow-xs space-y-3">
                <h4 className="font-display font-bold text-xs text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Tambahan Camilan & Dessert Populer:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {recommendedItems.map((rec) => (
                    <div key={rec.id} className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE2D8] flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-[#1F1A16] truncate">{rec.name}</div>
                        <div className="text-[10px] font-mono text-[#C84B27] font-bold">{formatRupiah(rec.price)}</div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onAddToCart(rec, 1)}
                        className="p-1.5 rounded-lg bg-[#C84B27] text-white hover:bg-[#B23E1C] shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Bill Details, QRIS Simulator & Form (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <form onSubmit={handleProcessOrder} className="bg-white border border-[#EAE2D8] rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
              <h3 className="font-display font-black text-lg text-[#1F1A16] border-b border-[#EAE2D8] pb-3 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-700" />
                <span>Rincian & Pembayaran</span>
              </h3>

              {/* Dine-In / Takeaway Toggle */}
              <div className="grid grid-cols-2 gap-2 bg-[#FAF7F2] p-1 rounded-xl border border-[#EAE2D8]">
                <button
                  type="button"
                  onClick={() => setOrderType('dine-in')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    orderType === 'dine-in' ? 'bg-[#C84B27] text-white shadow-xs' : 'text-[#5C5248] hover:text-[#1F1A16]'
                  }`}
                >
                  Makan di Tempat (Dine-In)
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('takeaway')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    orderType === 'takeaway' ? 'bg-[#C84B27] text-white shadow-xs' : 'text-[#5C5248] hover:text-[#1F1A16]'
                  }`}
                >
                  Bawa Pulang (Takeaway)
                </button>
              </div>

              {/* Inputs: Table & Customer */}
              <div className="space-y-3">
                {orderType === 'dine-in' && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#1F1A16]">Nomor Meja Anda *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 06"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-[#C84B27] focus:outline-none focus:border-[#C84B27]"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1F1A16]">Nama Pemesan *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Anda"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl px-4 py-2.5 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C84B27]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1F1A16]">Nomor WhatsApp (Untuk Notifikasi)</label>
                  <input
                    type="tel"
                    placeholder="081298765432"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl px-4 py-2.5 text-xs font-mono text-[#1F1A16] focus:outline-none focus:border-[#C84B27]"
                  />
                </div>
              </div>

              {/* Member Points Toggle */}
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-amber-700" />
                  <div>
                    <div className="text-xs font-bold text-[#1F1A16]">Gunakan Poin Member VIP</div>
                    <div className="text-[10px] text-[#5C5248]">Hemat diskon 15% (Maks Rp 15.000)</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={useMemberPoints}
                  onChange={(e) => setUseMemberPoints(e.target.checked)}
                  className="w-4 h-4 accent-[#C84B27] rounded cursor-pointer"
                />
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#1F1A16]">Pilih Metode Pembayaran:</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'qris', label: 'QRIS Dinamis', icon: QrCode },
                    { id: 'cash', label: 'Tunai di Kasir', icon: Banknote }
                  ].map((pm) => {
                    const Icon = pm.icon;
                    const isSelected = paymentMethod === pm.id;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id as any)}
                        className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all shadow-xs ${
                          isSelected
                            ? 'bg-[#C84B27] border-[#C84B27] text-white shadow-xs'
                            : 'bg-[#FAF7F2] border-[#EAE2D8] text-[#5C5248] hover:text-[#1F1A16]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{pm.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="space-y-2 text-xs border-t border-[#EAE2D8] pt-3">
                <div className="flex justify-between text-[#5C5248]">
                  <span>Subtotal Pesanan</span>
                  <span className="font-mono">{formatRupiah(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Diskon Member VIP</span>
                    <span className="font-mono">- {formatRupiah(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#5C5248]">
                  <span>Biaya Layanan (5%)</span>
                  <span className="font-mono">{formatRupiah(serviceCharge)}</span>
                </div>
                <div className="flex justify-between text-[#5C5248]">
                  <span>Pajak Restoran PB1 (10%)</span>
                  <span className="font-mono">{formatRupiah(tax)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#1F1A16] pt-2 border-t border-[#EAE2D8]">
                  <span>Total Pembayaran</span>
                  <span className="font-mono text-lg text-[#C84B27]">{formatRupiah(total)}</span>
                </div>
              </div>

              {/* Split Bill Button Trigger */}
              {cartItems.length > 0 && orderType === 'dine-in' && (
                <button
                  type="button"
                  onClick={() => setIsSplitBillOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-300/80 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <Split className="w-3.5 h-3.5 text-[#C84B27]" />
                  <span>👥 Butuh Patungan? Buka Simulasi Split Bill Meja</span>
                </button>
              )}

              {/* Clean QRIS Box */}
              {paymentMethod === 'qris' && (
                <div className="bg-[#FAF7F2] border border-[#EAE2D8] p-4 rounded-xl text-center space-y-3">
                  <div className="w-32 h-32 bg-white p-2 rounded-xl mx-auto flex items-center justify-center shadow-xs border border-[#EAE2D8]">
                    <QrCode className="w-28 h-28 text-stone-900" />
                  </div>
                  <div className="text-[11px] text-[#5C5248] font-medium">
                    Scan QRIS via BCA Mobile, GoPay, OVO, ShopeePay, Dana
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessingPayment || cartItems.length === 0}
                className={`w-full py-3.5 rounded-xl text-xs sm:text-sm font-display font-black flex items-center justify-center gap-2 transition-colors shadow-xs ${
                  isProcessingPayment || cartItems.length === 0
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-[#C84B27] hover:bg-[#B23E1C] text-white'
                }`}
              >
                {isProcessingPayment ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Memproses Pembayaran...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Konfirmasi & Bayar ({formatRupiah(total)})</span>
                  </>
                )}
              </button>
            </form>

          </div>

        </div>

      </div>

      {/* Completed Order Receipt Modal */}
      <AnimatePresence>
        {completedOrder && !isTrackerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border border-[#EAE2D8] rounded-3xl max-w-md w-full p-6 sm:p-7 text-[#1F1A16] shadow-2xl space-y-5"
            >
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center mx-auto shadow-xs">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="font-display font-black text-xl text-[#1F1A16]">Pesanan Diterima Dapur</h3>
                <p className="text-xs text-[#5C5248]">
                  Pesanan #{completedOrder.orderNumber} sedang disiapkan oleh tim dapur & barista.
                </p>
              </div>

              {/* Receipt Body */}
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE2D8] space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-[#EAE2D8] pb-2">
                  <span className="text-[#5C5248]">Nomor Order:</span>
                  <span className="font-mono font-bold text-[#C84B27]">#{completedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5248]">Tipe / Meja:</span>
                  <span className="font-bold text-[#1F1A16]">{completedOrder.orderType.toUpperCase()} {completedOrder.tableNumber && `(Meja #${completedOrder.tableNumber})`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5248]">Atas Nama:</span>
                  <span className="font-bold text-[#1F1A16]">{completedOrder.customerName}</span>
                </div>
                <div className="flex justify-between border-t border-[#EAE2D8] pt-2 font-bold text-sm text-[#C84B27]">
                  <span>Total Lunas (QRIS):</span>
                  <span className="font-mono">{formatRupiah(completedOrder.total)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  onClick={() => setIsReceiptModalOpen(true)}
                  className="w-full py-3 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Receipt className="w-4 h-4" />
                  <span>🧾 Cetak / Simpan Struk Kasir & KOT (58mm/80mm)</span>
                </button>

                <button
                  onClick={() => setIsTrackerOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-stone-200 text-[#1F1A16] font-bold text-xs border border-[#EAE2D8] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Coffee className="w-4 h-4 text-amber-700" />
                  <span>📱 Buka Live Order Tracker (Pantau Antrean Dapur)</span>
                </button>

                <button
                  onClick={() => {
                    setCompletedOrder(null);
                    onNavigateTo('customer');
                  }}
                  className="w-full py-2 text-stone-500 hover:text-stone-800 font-semibold text-xs transition-colors"
                >
                  Kembali ke Beranda
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QRIS Dynamic Interactive Modal */}
      {pendingQRISOrder && (
        <QRISDynamicModal
          isOpen={isQRISModalOpen}
          onClose={() => {
            setIsQRISModalOpen(false);
          }}
          order={pendingQRISOrder}
          onPaymentSuccess={(paidOrder) => {
            setCompletedOrder(paidOrder);
            onClearCart();
          }}
          onOpenReceipt={(paidOrder) => {
            setCompletedOrder(paidOrder);
            setIsReceiptModalOpen(true);
          }}
        />
      )}

      {/* Thermal Receipt Modal (58mm / 80mm & KOT) */}
      {(completedOrder || pendingQRISOrder) && (
        <ThermalReceiptModal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          order={completedOrder || pendingQRISOrder}
          cashierName="Kasir Digital QRIS"
        />
      )}

      {/* Split Bill Modal */}
      <SplitBillModal
        isOpen={isSplitBillOpen}
        onClose={() => setIsSplitBillOpen(false)}
        cartItems={cartItems}
        tableNumber={tableNumber}
        subtotal={subtotal}
        serviceCharge={serviceCharge}
        tax={tax}
        total={total}
      />

      {/* Live Order Tracker Modal */}
      {completedOrder && (
        <LiveOrderTrackerModal
          isOpen={isTrackerOpen}
          onClose={() => {
            setIsTrackerOpen(false);
            setCompletedOrder(null);
            onNavigateTo('customer');
          }}
          order={completedOrder}
        />
      )}

    </div>
  );
};

