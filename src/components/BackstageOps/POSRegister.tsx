import React, { useState } from 'react';
import { MenuItem, Order, PaymentMethod, OrderType, TableItem } from '../../types';
import { 
  Plus, 
  Minus, 
  Trash2, 
  Search, 
  CreditCard, 
  Banknote, 
  QrCode, 
  Receipt, 
  Printer, 
  Percent, 
  Sparkles, 
  CheckCircle2,
  Users,
  Coffee,
  Check,
  X
} from 'lucide-react';
import { triggerConfetti } from "../../utils/confettiHelper";
import { INITIAL_MENU_ITEMS, CAFE_INFO } from '../../data/mockData';
import { ThermalReceiptModal } from './pos/ThermalReceiptModal';
import { ShiftZReportModal } from './pos/ShiftZReportModal';
import { Lock } from 'lucide-react';

interface POSRegisterProps {
  tables?: TableItem[];
  onSubmitOrder?: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => Order;
  onSavePOSOrder?: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => Order;
  initialTableNumber?: string;
  initialTable?: string;
}

export const POSRegister: React.FC<POSRegisterProps> = ({
  tables,
  onSubmitOrder,
  onSavePOSOrder,
  initialTableNumber,
  initialTable
}) => {
  const saveHandler = onSubmitOrder || onSavePOSOrder || ((ord: any) => ord);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [activeItems, setActiveItems] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [tableNumber, setTableNumber] = useState<string>(initialTableNumber || initialTable || '01');
  const [customerName, setCustomerName] = useState<string>('Tamu Walk-in');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [cashGiven, setCashGiven] = useState<number>(0);
  const [lastReceipt, setLastReceipt] = useState<Order | null>(null);
  const [showZReportModal, setShowZReportModal] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'Semua Menu' },
    { id: 'coffee', label: 'Coffee & Manual Brew' },
    { id: 'non-coffee', label: 'Mocktail & Tea' },
    { id: 'kitchen-mains', label: 'Kitchen Mains' },
    { id: 'pasta-rice', label: 'Pasta & Rice' },
    { id: 'light-bites', label: 'Platter & Bites' },
    { id: 'pastry-dessert', label: 'Dessert' }
  ];

  const filteredMenu = INITIAL_MENU_ITEMS.filter((m) => {
    let matchCat = selectedCategory === 'all';
    if (selectedCategory === 'coffee') {
      matchCat = m.category === 'coffee' || m.category === 'manual-brew';
    } else if (selectedCategory === 'non-coffee') {
      matchCat = m.category === 'non-coffee';
    } else if (!matchCat) {
      matchCat = m.category === selectedCategory;
    }
    const q = search.toLowerCase().trim();
    const matchSearch = q === '' || m.name.toLowerCase().includes(q) || m.description?.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const addItemToBill = (item: MenuItem) => {
    setActiveItems((prev) => {
      const exist = prev.find((p) => p.item.id === item.id);
      if (exist) {
        return prev.map((p) => (p.item.id === item.id ? { ...p, quantity: p.quantity + 1 } : p));
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const updateQty = (id: string, newQty: number) => {
    if (newQty <= 0) {
      setActiveItems((prev) => prev.filter((p) => p.item.id !== id));
    } else {
      setActiveItems((prev) => prev.map((p) => (p.item.id === id ? { ...p, quantity: newQty } : p)));
    }
  };

  const subtotal = activeItems.reduce((acc, it) => acc + it.item.price * it.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const serviceCharge = Math.round(taxableAmount * 0.05);
  const tax = Math.round(taxableAmount * 0.10);
  const total = taxableAmount + serviceCharge + tax;

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  const handleProcessTransaction = () => {
    if (activeItems.length === 0) return;

    const newOrder = saveHandler({
      orderType,
      tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
      customerName: customerName || 'Tamu Kasir',
      items: activeItems.map((ai) => ({
        cartItemId: `${ai.item.id}-${Date.now()}`,
        menuItem: ai.item,
        quantity: ai.quantity
      })),
      subtotal,
      discount: discountAmount,
      serviceCharge,
      tax,
      total,
      paymentMethod,
      paymentStatus: 'paid'
    });

    setLastReceipt(newOrder);
    setActiveItems([]);
    setDiscountPercent(0);

    try {
      triggerConfetti({ particleCount: 50, spread: 60 });
    } catch {}
  };

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start text-[#1F1A16] max-w-7xl mx-auto w-full pb-24 lg:pb-8">
      
      {/* Left Column: Menu Catalog Selector */}
      <div className="lg:col-span-7 space-y-4">
        
        {/* Search & Category Tabs */}
        <div className="bg-white p-4 rounded-3xl border border-[#EAE2D8] shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#5C5248] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari menu Kopi Susu, Nasi Goreng, Truffle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#EAE2D8] rounded-2xl text-xs text-[#1F1A16] placeholder:text-[#5C5248] focus:outline-none focus:border-[#C84B27]"
              />
            </div>

            <button
              onClick={() => setShowZReportModal(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-stone-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer shrink-0"
              title="Tutup Shift Kasir (Z-Report)"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Tutup Shift (Z-Report)</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors border cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-[#C84B27] text-white border-[#C84B27] shadow-xs'
                    : 'bg-[#FAF7F2] text-[#5C5248] border-[#EAE2D8] hover:bg-stone-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredMenu.map((item) => (
            <div
              key={item.id}
              onClick={() => addItemToBill(item)}
              className="bg-white rounded-2xl p-3 border border-[#EAE2D8] shadow-xs hover:border-[#C84B27] cursor-pointer transition-all flex flex-col justify-between space-y-2 hover:-translate-y-0.5"
            >
              <img
                src={item.image}
                alt={item.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80';
                }}
                className="w-full h-24 rounded-xl object-cover"
              />
              <div className="space-y-0.5">
                <h5 className="font-bold text-xs text-[#1F1A16] line-clamp-1">{item.name}</h5>
                <span className="text-[10px] text-[#5C5248] font-mono block uppercase">{item.category}</span>
                <span className="font-mono font-bold text-[#B23812] text-xs block">
                  {formatRupiah(item.price)}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Right Column: Active Bill & Cashier Checkout */}
      <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#EAE2D8] shadow-xs space-y-5">
        
        {/* Bill Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D8]">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#B23812]" />
            <h4 className="font-display font-black text-base text-[#1F1A16]">Struk Tagihan Aktif</h4>
          </div>
          <button
            onClick={() => setActiveItems([])}
            disabled={activeItems.length === 0}
            className="text-xs text-rose-600 hover:underline font-bold disabled:opacity-30 cursor-pointer"
          >
            Clear
          </button>
        </div>

        {/* Order Meta Form (Table & Customer) */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-[#5C5248]">Tipe Pesanan:</label>
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value as any)}
              className="w-full p-2 bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl text-xs text-[#1F1A16] font-bold"
            >
              <option value="dine-in">Dine-In (Meja)</option>
              <option value="takeaway">Takeaway</option>
            </select>
          </div>

          {orderType === 'dine-in' ? (
            <div className="space-y-1">
              <label className="font-bold text-[#5C5248]">Nomor Meja:</label>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full p-2 bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl text-xs text-[#B23812] font-mono font-bold"
              />
            </div>
          ) : (
            <div className="space-y-1">
              <label className="font-bold text-[#5C5248]">Nama Pemesan:</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-2 bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl text-xs text-[#1F1A16] font-bold"
              />
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-none divide-y divide-[#EAE2D8]">
          {activeItems.length === 0 ? (
            <div className="py-8 text-center text-[#5C5248] text-xs">
              Klik item di katalog menu untuk menambahkan ke tagihan
            </div>
          ) : (
            activeItems.map(({ item, quantity }) => (
              <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-[#1F1A16]">{item.name}</div>
                  <span className="text-[10px] font-mono text-[#5C5248]">{formatRupiah(item.price)} / item</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-[#EAE2D8]">
                    <button
                      onClick={() => updateQty(item.id, quantity - 1)}
                      className="w-5 h-5 rounded-lg bg-white hover:bg-stone-200 text-[#1F1A16] border border-[#EAE2D8] flex items-center justify-center font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-xs px-1.5 text-[#1F1A16]">{quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, quantity + 1)}
                      className="w-5 h-5 rounded-lg bg-white hover:bg-stone-200 text-[#1F1A16] border border-[#EAE2D8] flex items-center justify-center font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-mono font-bold text-[#1F1A16] w-20 text-right">
                    {formatRupiah(item.price * quantity)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Discount & Totals Breakdown */}
        {activeItems.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-[#EAE2D8] text-xs font-mono">
            
            {/* Discount selector */}
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#5C5248]">Diskon Promosi:</span>
              <div className="flex items-center gap-1">
                {[0, 10, 15, 20].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDiscountPercent(d)}
                    className={`px-2 py-0.5 rounded-md font-bold cursor-pointer ${
                      discountPercent === d ? 'bg-[#C84B27] text-white' : 'bg-[#FAF7F2] text-[#5C5248] border border-[#EAE2D8]'
                    }`}
                  >
                    {d}%
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between text-[#5C5248]">
              <span>Subtotal:</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-[#B23812]">
                <span>Diskon ({discountPercent}%):</span>
                <span>-{formatRupiah(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-[#5C5248]">
              <span>Service (5%):</span>
              <span>+{formatRupiah(serviceCharge)}</span>
            </div>

            <div className="flex justify-between text-[#5C5248]">
              <span>Pajak PB1 (10%):</span>
              <span>+{formatRupiah(tax)}</span>
            </div>

            <div className="flex justify-between pt-2 border-t border-[#EAE2D8] font-bold text-base text-[#1F1A16]">
              <span>TOTAL TAGIHAN:</span>
              <span className="text-[#B23812] font-black">{formatRupiah(total)}</span>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-1.5 pt-2">
              {[
                { id: 'qris', label: 'QRIS', icon: QrCode },
                { id: 'cash', label: 'Tunai', icon: Banknote },
                { id: 'debit', label: 'Debit', icon: CreditCard }
              ].map((pm) => {
                const Icon = pm.icon;
                return (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-2 rounded-xl text-center font-bold text-xs border flex items-center justify-center gap-1.5 cursor-pointer ${
                      paymentMethod === pm.id
                        ? 'bg-[#C84B27] text-white border-[#C84B27]'
                        : 'bg-[#FAF7F2] text-[#5C5248] border-[#EAE2D8] hover:bg-stone-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{pm.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleProcessTransaction}
              className="w-full py-3.5 rounded-2xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-display font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-3 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Bayar & Kirim ke KDS Dapur</span>
            </button>

          </div>
        )}

      </div>

      {/* Dual Thermal Receipt Print Modal (Customer vs Kitchen/Bar 58mm/80mm) */}
      <ThermalReceiptModal
        isOpen={Boolean(lastReceipt)}
        onClose={() => setLastReceipt(null)}
        order={lastReceipt}
        cashierName="Kasir Utama"
      />

      {/* Cashier Shift Z-Report Modal */}
      <ShiftZReportModal
        isOpen={showZReportModal}
        onClose={() => setShowZReportModal(false)}
      />

    </div>
  );
};
