import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Store, 
  UtensilsCrossed, 
  CalendarDays, 
  Coffee, 
  Package, 
  ArrowUpRight, 
  Sparkles, 
  Clock, 
  ShoppingBag,
  Flame,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { TableItem, Order, Reservation } from '../../../types';
import { BackstageNavModuleId } from '../../../utils/rbac';

interface BackofficeDashboardOverviewProps {
  tables: TableItem[];
  orders: Order[];
  reservations: Reservation[];
  onNavigateToModule: (mod: BackstageNavModuleId) => void;
  onOpenPOSForTable?: (tableNumber: string) => void;
}

export const BackofficeDashboardOverview: React.FC<BackofficeDashboardOverviewProps> = ({
  tables,
  orders,
  reservations,
  onNavigateToModule,
  onOpenPOSForTable
}) => {
  const [chartMetric, setChartMetric] = useState<'volume' | 'revenue'>('revenue');
  const [periodFilter, setPeriodFilter] = useState<'today' | 'weekend' | 'monthly'>('today');

  const activeOrders = orders.filter(o => o.status === 'preparing' || o.status === 'pending');
  const occupiedTables = tables.filter(t => t.status === 'occupied' || t.status === 'billing');
  const confirmedReservations = reservations.filter(r => r.status === 'confirmed');

  // Today Gross Revenue Calculation
  const totalRevenueToday = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((acc, o) => acc + o.total, 0) + 14850000; // Base historical shift revenue

  const hourlyData = [
    { time: '10:00', label: 'Opening', volume: 14, revenue: 380000, target: 300000, achieved: true },
    { time: '12:00', label: 'Lunch Rush', volume: 68, revenue: 2450000, target: 2000000, achieved: true },
    { time: '14:00', label: 'Afternoon WFH', volume: 42, revenue: 1280000, target: 1100000, achieved: true },
    { time: '16:00', label: 'Coffee Break', volume: 55, revenue: 1650000, target: 1500000, achieved: true },
    { time: '18:30', label: 'Dinner Peak', volume: 84, revenue: 3200000, target: 2800000, achieved: true },
    { time: '19:30', label: 'Live Music Rush', volume: 112, revenue: 4250000, target: 3500000, achieved: true },
    { time: '21:30', label: 'Late Hangout', volume: 48, revenue: 1640000, target: 1400000, achieved: true }
  ];

  const topSellers = [
    { name: 'Kopi Susu Homie Signature', category: 'Coffee', qty: 184, revenue: 4416000, margin: '72%', trend: '+18%' },
    { name: 'Aren Cremosa Cozie', category: 'Coffee', qty: 112, revenue: 3136000, margin: '68%', trend: '+24%' },
    { name: 'Nasi Goreng Kampung Homie', category: 'Kitchen', qty: 76, revenue: 2736000, margin: '65%', trend: '+12%' },
    { name: 'V60 Single Origin (Aceh Gayo)', category: 'Manual Brew', qty: 58, revenue: 1740000, margin: '75%', trend: '+8%' },
    { name: 'Platter Nongkrong #PITSTOP', category: 'Bites', qty: 48, revenue: 1824000, margin: '62%', trend: '+31%' }
  ];

  const criticalStockItems = [
    { name: 'Arabika House Blend Beans', current: 3.2, min: 5.0, unit: 'kg', status: 'critical', supplier: 'Kalisari Roastery' },
    { name: 'Fresh Milk Pasteurized', current: 12, min: 20, unit: 'Liter', status: 'warning', supplier: 'Dairy Fresh Jaktim' },
    { name: 'Daging Sapi Smoked Beef', current: 1.8, min: 3.0, unit: 'kg', status: 'warning', supplier: 'Mitra Daging Halal' },
    { name: 'Gula Aren Organik Cair', current: 18.5, min: 10.0, unit: 'Liter', status: 'optimal', supplier: 'Aren Murni Nusantara' }
  ];

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl mx-auto w-full pb-24 lg:pb-8">
      
      {/* 1. Header Banner & Shift Status */}
      <div className="bg-white p-4.5 sm:p-6 rounded-3xl border border-[#EAE2D8] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full min-w-0">
        <div className="space-y-1.5 min-w-0 w-full flex-1">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Operasional Backoffice
            </span>
            <span className="text-[11px] text-[#5C5248] font-mono font-medium flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-amber-900 inline shrink-0" />
              <span>{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-display font-black text-[#1F1A16] leading-tight tracking-tight mt-1">
            Ringkasan Operasional Restoran
          </h2>
          <p className="text-xs text-[#5C5248] leading-relaxed max-w-xl">
            Pantauan live omzet kasir, okupansi meja, pesanan dapur, dan status stok bahan real-time.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 w-full md:w-auto shrink-0 pt-1 md:pt-0">
          <button
            onClick={() => onNavigateToModule('pos')}
            className="px-4.5 py-2.5 sm:py-3 rounded-2xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>Buka Kasir POS</span>
          </button>
          <button
            onClick={() => onNavigateToModule('kds')}
            className="px-4.5 py-2.5 sm:py-3 rounded-2xl bg-[#FAF7F2] hover:bg-stone-200 border border-[#EAE2D8] text-[#1F1A16] font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <UtensilsCrossed className="w-4 h-4 text-amber-900 shrink-0" />
            <span>Layar KDS</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-mono text-[10px] font-black">
              {activeOrders.length}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Key KPI Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Omzet Hari Ini */}
        <div 
          onClick={() => onNavigateToModule('sales_revenue')}
          className="p-5 rounded-3xl bg-white border border-[#EAE2D8] shadow-xs hover:border-amber-300 transition-all cursor-pointer space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-[#5C5248] uppercase">Omzet Kasir Hari Ini</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-800 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-mono font-black text-[#1F1A16]">
              {formatRupiah(totalRevenueToday)}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-900 font-bold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% vs kemarin</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Okupansi Meja */}
        <div 
          onClick={() => onNavigateToModule('floorplan')}
          className="p-5 rounded-3xl bg-white border border-[#EAE2D8] shadow-xs hover:border-amber-300 transition-all cursor-pointer space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-[#5C5248] uppercase">Okupansi Meja</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 group-hover:scale-110 transition-transform">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-mono font-black text-[#1F1A16]">
              {occupiedTables.length} / {tables.length} <span className="text-xs text-[#5C5248] font-normal">Meja Terisi</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#5C5248] font-medium mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{Math.round((occupiedTables.length / tables.length) * 100)}% Kapasitas Terpakai</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Pesanan Aktif Dapur */}
        <div 
          onClick={() => onNavigateToModule('kds')}
          className="p-5 rounded-3xl bg-white border border-[#EAE2D8] shadow-xs hover:border-amber-300 transition-all cursor-pointer space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-[#5C5248] uppercase">Antrean KDS Dapur</span>
            <div className="p-2 rounded-xl bg-orange-50 text-orange-800 group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-mono font-black text-[#1F1A16]">
              {activeOrders.length} <span className="text-xs text-[#5C5248] font-normal">Tiket Aktif</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-amber-900 font-medium mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Rata-rata sajian: 8-12 menit</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Reservasi Booking */}
        <div 
          onClick={() => onNavigateToModule('reservations')}
          className="p-5 rounded-3xl bg-white border border-[#EAE2D8] shadow-xs hover:border-amber-300 transition-all cursor-pointer space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-[#5C5248] uppercase">Reservasi Terkonfirmasi</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-800 group-hover:scale-110 transition-transform">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-mono font-black text-[#1F1A16]">
              {confirmedReservations.length} <span className="text-xs text-[#5C5248] font-normal">Booking Meja</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-teal-700 font-bold mt-1">
              <span>Slot Live Music: 19:30 WIB</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Hourly Rush Curve & Top Sellers Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Hourly Traffic & Revenue Heatmap Chart */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-3xl border border-[#EAE2D8] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE2D8]">
            <div>
              <h3 className="font-display font-black text-base text-[#1F1A16]">
                Kurva Jam Sibuk & Penjualan (Hourly Rush)
              </h3>
              <p className="text-[11px] text-[#5C5248]">
                Pola kunjungan pelanggan kafe Kalisari sepanjang hari operasional
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-2xl border border-[#EAE2D8]">
              <button
                onClick={() => setChartMetric('revenue')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  chartMetric === 'revenue' ? 'bg-[#C84B27] text-white shadow-2xs' : 'text-[#5C5248] hover:text-[#1F1A16]'
                }`}
              >
                Omzet (Rp)
              </button>
              <button
                onClick={() => setChartMetric('volume')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  chartMetric === 'volume' ? 'bg-[#C84B27] text-white shadow-2xs' : 'text-[#5C5248] hover:text-[#1F1A16]'
                }`}
              >
                Volume Cup / Porsi
              </button>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="space-y-3 pt-2">
            {hourlyData.map((hour, idx) => {
              const maxVal = chartMetric === 'revenue' ? 4500000 : 120;
              const currentVal = chartMetric === 'revenue' ? hour.revenue : hour.volume;
              const pct = Math.min(100, Math.round((currentVal / maxVal) * 100));

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#1F1A16] w-12">{hour.time}</span>
                      <span className="text-[11px] text-[#5C5248]">({hour.label})</span>
                    </div>
                    <span className="font-mono font-bold text-[#1F1A16]">
                      {chartMetric === 'revenue' ? formatRupiah(hour.revenue) : `${hour.volume} pesanan`}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#FAF7F2] rounded-full overflow-hidden border border-[#EAE2D8]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      className={`h-full rounded-full ${
                        hour.label.includes('Peak') || hour.label.includes('Music')
                          ? 'bg-gradient-to-r from-amber-500 to-[#C84B27]'
                          : 'bg-[#C84B27]'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: 5 Best-Selling Menu Items */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#EAE2D8] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D8]">
            <div>
              <h3 className="font-display font-black text-base text-[#1F1A16]">
                Top 5 Best Seller
              </h3>
              <p className="text-[11px] text-[#5C5248]">Menu paling laris shift ini</p>
            </div>
            <Flame className="w-5 h-5 text-amber-600" />
          </div>

          <div className="space-y-3">
            {topSellers.map((item, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1F1A16] truncate max-w-[160px]">
                    {idx + 1}. {item.name}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-900 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {item.trend}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#5C5248]">
                  <span>{item.qty} Terjual ({item.category})</span>
                  <span className="font-mono font-bold text-[#1F1A16]">{formatRupiah(item.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Critical Stock Alert & Quick Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Stock Warnings */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#EAE2D8] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D8]">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-900" />
              <h3 className="font-display font-black text-base text-[#1F1A16]">
                Peringatan Stok & Bahan Dapur
              </h3>
            </div>
            <button
              onClick={() => onNavigateToModule('inventory')}
              className="text-xs font-bold text-[#B23812] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Semua Stok</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {criticalStockItems.map((stk, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8] flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-[#1F1A16]">{stk.name}</div>
                  <div className="text-[10px] text-[#5C5248]">Supplier: {stk.supplier}</div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                    stk.status === 'critical' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {stk.current} / {stk.min} {stk.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Table Seating Status */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#EAE2D8] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D8]">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-emerald-900" />
              <h3 className="font-display font-black text-base text-[#1F1A16]">
                Status Meja Cepat
              </h3>
            </div>
            <button
              onClick={() => onNavigateToModule('floorplan')}
              className="text-xs font-bold text-[#B23812] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Denah Penuh</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {tables.slice(0, 8).map(t => (
              <button
                key={t.id}
                onClick={() => onOpenPOSForTable ? onOpenPOSForTable(t.tableNumber) : onNavigateToModule('pos')}
                className={`p-3 rounded-2xl border text-center transition-all hover:scale-105 cursor-pointer space-y-1 ${
                  t.status === 'available'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    : t.status === 'reserved'
                      ? 'bg-amber-50 text-amber-900 border-amber-200'
                      : 'bg-rose-50 text-rose-900 border-rose-200'
                }`}
              >
                <div className="font-mono font-black text-sm">#{t.tableNumber}</div>
                <div className="text-[10px] font-bold uppercase truncate">{t.status}</div>
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
