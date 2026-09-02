import React, { useState, useEffect, useRef } from 'react';
import { Order, OrderStatus } from '../../types';
import { 
  Clock, 
  CheckCircle2, 
  Flame, 
  Coffee, 
  UtensilsCrossed, 
  Check, 
  AlertCircle,
  BellRing,
  ArrowRight,
  ChefHat,
  Volume2,
  VolumeX,
  Sparkles,
  AlertTriangle,
  Timer
} from 'lucide-react';
import { soundService } from '../../utils/audioChime';

interface KitchenDisplaySystemProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
}

export const KitchenDisplaySystem: React.FC<KitchenDisplaySystemProps> = ({
  orders,
  onUpdateOrderStatus
}) => {
  const [stationFilter, setStationFilter] = useState<'all' | 'kitchen' | 'bar'>('all');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(soundService.getIsMuted());
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const prevOrderCountRef = useRef<number>(orders.length);

  // Periodic timer updater for accurate elapsed cooking minutes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Trigger bell chime when a new order appears
  useEffect(() => {
    if (orders.length > prevOrderCountRef.current) {
      soundService.playNewOrderChime();
    }
    prevOrderCountRef.current = orders.length;
  }, [orders.length]);

  const toggleSound = () => {
    const muted = soundService.toggleMute();
    setIsAudioMuted(muted);
    if (!muted) {
      soundService.playNewOrderChime();
    }
  };

  const activeOrders = orders.filter((o) => ['pending', 'preparing', 'ready'].includes(o.status));

  // Determine if item is bar (beverage/coffee/mocktail) vs kitchen (food/snack/pasta/dessert)
  const isBarItem = (category?: string) => 
    ['coffee', 'non-coffee', 'manual-brew', 'signature', 'mocktail'].includes(category || '');

  const isKitchenItem = (category?: string) => 
    ['kitchen-mains', 'pasta-rice', 'light-bites', 'pastry-dessert', 'main-course', 'snack', 'pastry'].includes(category || '');

  const filteredOrders = activeOrders.filter((ord) => {
    if (stationFilter === 'all') return true;
    if (stationFilter === 'bar') {
      return ord.items.some((it) => isBarItem(it.menuItem?.category));
    }
    if (stationFilter === 'kitchen') {
      return ord.items.some((it) => isKitchenItem(it.menuItem?.category));
    }
    return true;
  });

  const barCount = activeOrders.filter((ord) => 
    ord.items.some((it) => isBarItem(it.menuItem?.category))
  ).length;

  const kitchenCount = activeOrders.filter((ord) => 
    ord.items.some((it) => isKitchenItem(it.menuItem?.category))
  ).length;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return { label: 'Pesanan Baru Masuk', color: 'bg-rose-50 text-rose-800 border-rose-200 ring-1 ring-rose-200' };
      case 'preparing':
        return { label: 'Sedang Disiapkan', color: 'bg-amber-50 text-amber-900 border-amber-200 ring-1 ring-amber-200' };
      case 'ready':
        return { label: 'Siap Disajikan', color: 'bg-emerald-50 text-emerald-800 border-emerald-200 ring-1 ring-emerald-200' };
      default:
        return { label: status, color: 'bg-stone-100 text-stone-700 border-stone-200' };
    }
  };

  const formatOrderTime = (timeStr?: string) => {
    if (!timeStr) return 'Baru Saja';
    if (timeStr.includes('WIB')) return timeStr;
    return `${timeStr} WIB`;
  };

  // Calculate elapsed time from created string or fallback to index heuristic
  const getElapsedMinutes = (createdAt?: string, orderIndex?: number): number => {
    if (!createdAt) return (orderIndex || 0) * 3 + 2;
    // Check if time format HH:MM or ISO
    const match = createdAt.match(/(\d{1,2}):(\d{2})/);
    if (match) {
      const now = new Date(currentTime);
      const orderHours = parseInt(match[1], 10);
      const orderMins = parseInt(match[2], 10);
      const orderDate = new Date(now);
      orderDate.setHours(orderHours, orderMins, 0, 0);
      const diffMins = Math.max(1, Math.round((now.getTime() - orderDate.getTime()) / 60000));
      if (diffMins > 0 && diffMins < 300) return diffMins;
    }
    return (orderIndex || 0) * 4 + 3;
  };

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl mx-auto w-full pb-24 lg:pb-8">
      
      {/* ================= TOP CONTROLS & STATUS BAR ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-[#EAE2D8] shadow-xs">
        
        {/* Left: Flame Icon + Title + Live Counter Badge */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#C84B27] shrink-0 shadow-2xs">
            <Flame className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center flex-wrap gap-2">
              <h3 className="font-display font-black text-base text-[#1F1A16] truncate">
                Layar Dapur & Barista (KDS)
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#C84B27] text-white shrink-0 whitespace-nowrap shadow-2xs">
                {activeOrders.length} Antrean Aktif
              </span>
            </div>
            <p className="text-xs text-[#8C7E72] mt-0.5 truncate">
              Sinkronisasi real-time otomatis dari QR Order Meja & Kasir POS
            </p>
          </div>
        </div>

        {/* Right: Station Filter + Sound Chime Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Audio Chime Bell Toggle */}
          <button
            onClick={toggleSound}
            className={`px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
              isAudioMuted
                ? 'bg-[#FAF7F2] border-[#EAE2D8] text-[#8C7E72] hover:bg-stone-200'
                : 'bg-amber-500/10 border-amber-300 text-amber-900 hover:bg-amber-500/20'
            }`}
            title={isAudioMuted ? 'Aktifkan Bunyi Notifikasi Bell Dapur' : 'Mute Bunyi Notifikasi'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-[#C84B27]" />}
            <span>{isAudioMuted ? 'Mute' : 'Audio On'}</span>
          </button>

          {/* Station Filter Segmented Control */}
          <div className="flex items-center gap-1.5 p-1 bg-[#FAF7F2] rounded-2xl border border-[#EAE2D8] overflow-x-auto no-scrollbar shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setStationFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                stationFilter === 'all'
                  ? 'bg-[#C84B27] text-white shadow-xs'
                  : 'text-[#5C5248] hover:bg-white hover:text-[#1F1A16]'
              }`}
            >
              <span>Semua Station</span>
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono font-bold ${
                stationFilter === 'all' ? 'bg-white/20 text-white' : 'bg-stone-200 text-[#5C5248]'
              }`}>
                {activeOrders.length}
              </span>
            </button>

            <button
              onClick={() => setStationFilter('bar')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                stationFilter === 'bar'
                  ? 'bg-[#C84B27] text-white shadow-xs'
                  : 'text-[#5C5248] hover:bg-white hover:text-[#1F1A16]'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Barista Bar</span>
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono font-bold ${
                stationFilter === 'bar' ? 'bg-white/20 text-white' : 'bg-stone-200 text-[#5C5248]'
              }`}>
                {barCount}
              </span>
            </button>

            <button
              onClick={() => setStationFilter('kitchen')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                stationFilter === 'kitchen'
                  ? 'bg-[#C84B27] text-white shadow-xs'
                  : 'text-[#5C5248] hover:bg-white hover:text-[#1F1A16]'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Kitchen Dapur</span>
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono font-bold ${
                stationFilter === 'kitchen' ? 'bg-white/20 text-white' : 'bg-stone-200 text-[#5C5248]'
              }`}>
                {kitchenCount}
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* ================= ORDERS GRID ================= */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-[#EAE2D8] rounded-3xl p-12 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h4 className="font-display font-black text-lg text-[#1F1A16]">
            {stationFilter === 'all' ? 'Semua Pesanan Telah Selesai!' : `Tidak Ada Antrean di ${stationFilter === 'bar' ? 'Barista Bar' : 'Kitchen Dapur'}`}
          </h4>
          <p className="text-xs text-[#5C5248] max-w-sm mx-auto">
            Tidak ada tiket antrean aktif yang tertunda untuk station yang dipilih.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {filteredOrders.map((ord, idx) => {
            const statusInfo = getStatusBadge(ord.status);
            const elapsedMins = getElapsedMinutes(ord.createdAt, idx);
            const isUrgent = elapsedMins >= 15;
            const isWarning = elapsedMins >= 10 && elapsedMins < 15;

            return (
              <div
                key={ord.id}
                className={`bg-white rounded-3xl border shadow-xs p-5 flex flex-col justify-between space-y-4 transition-all hover:shadow-md ${
                  isUrgent
                    ? 'border-rose-400 ring-2 ring-rose-400/40 bg-rose-50/15 animate-pulse'
                    : ord.status === 'pending'
                    ? 'border-rose-300 ring-1 ring-rose-200/80 bg-linear-to-b from-rose-50/20 to-white'
                    : ord.status === 'preparing'
                    ? 'border-amber-300 ring-1 ring-amber-200/80 bg-linear-to-b from-amber-50/20 to-white'
                    : 'border-emerald-300 ring-1 ring-emerald-200/80 bg-linear-to-b from-emerald-50/20 to-white'
                }`}
              >
                {/* Header */}
                <div className="space-y-2.5 border-b border-[#EAE2D8] pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-lg text-[#1F1A16] tracking-tight">
                        #{ord.orderNumber}
                      </span>
                      {isUrgent && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-black bg-rose-600 text-white flex items-center gap-1 shadow-2xs">
                          <AlertTriangle className="w-3 h-3" />
                          <span>URGENT</span>
                        </span>
                      )}
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border whitespace-nowrap shrink-0 ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#5C5248] font-mono">
                    <span className="px-2.5 py-1 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] text-amber-900 font-bold">
                      {ord.tableNumber ? `Meja #${ord.tableNumber}` : 'Takeaway (Bungkus)'}
                    </span>
                    
                    {/* Cooking Timer Badge */}
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] font-bold ${
                        isUrgent 
                          ? 'bg-rose-100 text-rose-800 border-rose-300' 
                          : isWarning
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        <Timer className="w-3 h-3" />
                        <span>{elapsedMins} mnt</span>
                      </span>
                      <span className="text-[#8C7E72] font-semibold text-[11px]">
                        {formatOrderTime(ord.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-2 flex-1 py-1">
                  {ord.items.map((it, itemIdx) => {
                    const isBar = isBarItem(it.menuItem?.category);

                    return (
                      <div key={itemIdx} className="flex items-start justify-between gap-2 text-xs p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8]">
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1.5">
                            <div className="font-bold text-[#1F1A16] truncate">
                              <span className="text-[#C84B27] font-mono mr-1.5 font-bold">{it.quantity}x</span>
                              <span>{it.menuItem.name}</span>
                            </div>
                            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-lg shrink-0 ${
                              isBar ? 'bg-amber-500/15 text-amber-900 border border-amber-300/60' : 'bg-orange-500/15 text-[#C84B27] border border-orange-300/60'
                            }`}>
                              {isBar ? 'Barista Bar' : 'Kitchen Dapur'}
                            </span>
                          </div>

                          {it.selectedOptions && Object.values(it.selectedOptions).some(Boolean) && (
                            <div className="text-[10px] text-amber-800 font-mono">
                              {Object.entries(it.selectedOptions)
                                .filter(([_, v]) => Boolean(v))
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(' • ')}
                            </div>
                          )}

                          {it.notes && (
                            <div className="text-[10px] text-rose-700 font-bold bg-rose-50 border border-rose-200 px-2 py-1 rounded-lg">
                              ⚠️ Catatan: {it.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Action Footer */}
                <div className="pt-3 border-t border-[#EAE2D8] flex items-center gap-2">
                  {ord.status === 'pending' && (
                    <button
                      onClick={() => {
                        onUpdateOrderStatus(ord.id, 'preparing');
                        soundService.playWaiterCallChime();
                      }}
                      className="w-full py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-black text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                    >
                      <Flame className="w-4 h-4" />
                      <span>Mulai Masak / Seduh</span>
                    </button>
                  )}

                  {ord.status === 'preparing' && (
                    <button
                      onClick={() => {
                        onUpdateOrderStatus(ord.id, 'ready');
                        soundService.playNewOrderChime();
                      }}
                      className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Tandai Siap Saji (Ready)</span>
                    </button>
                  )}

                  {ord.status === 'ready' && (
                    <button
                      onClick={() => onUpdateOrderStatus(ord.id, 'served')}
                      className="w-full py-2.5 rounded-2xl bg-[#FAF7F2] hover:bg-stone-200 text-[#1F1A16] font-bold text-xs border border-[#EAE2D8] transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Selesai Disajikan</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
