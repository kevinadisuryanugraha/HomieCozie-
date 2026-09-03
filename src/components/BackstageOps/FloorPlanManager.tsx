import React, { useState } from 'react';
import { TableItem, CafeArea } from '../../types';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Coffee, 
  Utensils, 
  AlertCircle, 
  RotateCw,
  Plus,
  Store,
  ArrowRight,
  Receipt,
  X,
  QrCode,
  Printer
} from 'lucide-react';
import { TableQRModal } from './floorplan/TableQRModal';

interface FloorPlanManagerProps {
  tables: TableItem[];
  onUpdateTableStatus: (tableId: string, newStatus: TableItem['status'], customerName?: string) => void;
  onOpenNewOrderForTable: (tableNumber: string) => void;
}

export const FloorPlanManager: React.FC<FloorPlanManagerProps> = ({
  tables,
  onUpdateTableStatus,
  onOpenNewOrderForTable
}) => {
  const [selectedArea, setSelectedArea] = useState<CafeArea | 'all'>('all');
  const [activeTableDetail, setActiveTableDetail] = useState<TableItem | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState<boolean>(false);

  const areas: { id: CafeArea | 'all'; label: string }[] = [
    { id: 'all', label: 'Semua Area (15 Meja)' },
    { id: 'stage', label: 'Semi-Outdoor Stage (4 Meja)' },
    { id: 'indoor', label: 'Indoor AC Utama (5 Meja)' },
    { id: 'mezzanine', label: 'Mezzanine VIP Loft (3 Meja)' },
    { id: 'garden', label: 'Backyard Garden (3 Meja)' }
  ];

  const filteredTables = tables.filter((t) => selectedArea === 'all' || t.area === selectedArea);

  const getStatusColor = (status: TableItem['status']) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-50/70 border-emerald-300 text-emerald-950 shadow-xs hover:border-emerald-500';
      case 'occupied':
        return 'bg-rose-50/70 border-rose-300 text-rose-950 shadow-xs hover:border-rose-500';
      case 'reserved':
        return 'bg-amber-50/70 border-amber-300 text-amber-950 shadow-xs hover:border-amber-500';
      case 'billing':
        return 'bg-sky-50/70 border-sky-300 text-sky-950 shadow-xs hover:border-sky-500';
      case 'cleaning':
        return 'bg-stone-100 border-stone-300 text-stone-900 shadow-xs hover:border-stone-400';
      default:
        return 'bg-white border-[#EAE2D8] text-[#1F1A16] shadow-xs';
    }
  };

  const getStatusBadge = (status: TableItem['status']) => {
    switch (status) {
      case 'available':
        return { label: 'Tersedia', dot: 'bg-emerald-500', badgeStyle: 'bg-emerald-100/80 text-emerald-800 border-emerald-200' };
      case 'occupied':
        return { label: 'Terisi', dot: 'bg-rose-500', badgeStyle: 'bg-rose-100/80 text-rose-800 border-rose-200' };
      case 'reserved':
        return { label: 'Dipesan', dot: 'bg-amber-500', badgeStyle: 'bg-amber-100/80 text-amber-800 border-amber-200' };
      case 'billing':
        return { label: 'Minta Bill', dot: 'bg-sky-500', badgeStyle: 'bg-sky-100/80 text-sky-800 border-sky-200' };
      case 'cleaning':
        return { label: 'Dibersihkan', dot: 'bg-stone-400', badgeStyle: 'bg-stone-200 text-stone-800 border-stone-300' };
    }
  };

  const counts = {
    total: tables.length,
    available: tables.filter((t) => t.status === 'available').length,
    occupied: tables.filter((t) => t.status === 'occupied').length,
    reserved: tables.filter((t) => t.status === 'reserved').length
  };

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl mx-auto w-full pb-24 lg:pb-8">
      
      {/* Floor Plan Ribbon Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-[#EAE2D8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#5C5248] block font-medium">Total Kapasitas</span>
            <span className="font-mono font-bold text-xl text-[#1F1A16]">{counts.total} Meja</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-800 font-mono font-bold border border-amber-200">
            15
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-emerald-800 block font-medium">Meja Tersedia</span>
            <span className="font-mono font-bold text-xl text-emerald-700">{counts.available} Meja</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 font-mono font-bold">
            {counts.available}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-rose-800 block font-medium">Meja Terisi (Aktif)</span>
            <span className="font-mono font-bold text-xl text-rose-700">{counts.occupied} Meja</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-800 font-mono font-bold">
            {counts.occupied}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-amber-800 block font-medium">Reserved Meja</span>
            <span className="font-mono font-bold text-xl text-amber-700">{counts.reserved} Meja</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 font-mono font-bold">
            {counts.reserved}
          </div>
        </div>
      </div>

      {/* Area Switcher Tabs & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {areas.map((ar) => (
            <button
              key={ar.id}
              onClick={() => setSelectedArea(ar.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-colors border cursor-pointer ${
                selectedArea === ar.id
                  ? 'bg-[#C84B27] text-white border-[#C84B27] shadow-xs'
                  : 'bg-white text-[#5C5248] border-[#EAE2D8] hover:bg-stone-50'
              }`}
            >
              {ar.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsQRModalOpen(true)}
          className="px-4 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer ml-auto"
        >
          <QrCode className="w-3.5 h-3.5 text-[#C84B27]" />
          <span>Cetak Kartu QR Meja (Table Tents)</span>
        </button>
      </div>

      {/* Floor Plan Interactive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTables.map((tbl) => {
          const badge = getStatusBadge(tbl.status);
          const cleanName = tbl.name.replace(/^Meja\s+\d+\s*[-–—:]\s*/i, '').trim();

          return (
            <div
              key={tbl.id}
              className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between space-y-4 cursor-pointer relative overflow-hidden ${getStatusColor(
                tbl.status
              )}`}
              onClick={() => setActiveTableDetail(tbl)}
            >
              {/* Top Card Info */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-display font-black text-2xl text-[#1F1A16] tracking-tight leading-none shrink-0">
                      #{tbl.tableNumber}
                    </span>
                    {cleanName && (
                      <span className="text-xs font-bold text-[#5C5248] truncate leading-tight">
                        {cleanName}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#5C5248] font-mono block mt-1">
                    {tbl.areaLabel || tbl.area.toUpperCase()}
                  </span>
                </div>

                <div
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border flex items-center gap-1.5 shrink-0 ${badge.badgeStyle}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                  <span>{badge.label}</span>
                </div>
              </div>

              {/* Dynamic Status Detail */}
              <div className="space-y-2 bg-white/80 backdrop-blur-2xs p-3.5 rounded-2xl border border-stone-200/60 text-xs shadow-2xs">
                <div className="flex items-center justify-between text-[#5C5248]">
                  <span className="flex items-center gap-1.5 text-[11px] font-medium">
                    <Users className="w-3.5 h-3.5 text-[#5C5248]" />
                    <span>Kapasitas:</span>
                  </span>
                  <span className="font-mono font-bold text-[#1F1A16]">{tbl.capacity} Pax</span>
                </div>

                {tbl.status === 'occupied' && (
                  <>
                    <div className="flex items-center justify-between text-[#5C5248] pt-0.5">
                      <span className="text-[11px] font-medium">Tamu Aktif:</span>
                      <span className="font-bold text-[#1F1A16] truncate max-w-[130px]">
                        {tbl.currentCustomer || 'Tamu Walk-in'}
                      </span>
                    </div>
                    {tbl.occupiedSince && (
                      <div className="flex items-center justify-between text-[#5C5248] pt-0.5 border-t border-stone-200/50">
                        <span className="text-[11px] font-medium">Ditempati Sejak:</span>
                        <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 text-[11px]">
                          {tbl.occupiedSince}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {tbl.status === 'reserved' && (
                  <div className="flex items-center justify-between text-amber-900 pt-0.5">
                    <span className="text-[11px] text-[#5C5248] font-medium">Atas Nama:</span>
                    <span className="font-bold truncate max-w-[130px]">{tbl.currentCustomer || 'Tamu VIP'}</span>
                  </div>
                )}

                {tbl.status === 'billing' && (
                  <div className="flex items-center justify-between text-sky-900 pt-0.5">
                    <span className="text-[11px] text-[#5C5248] font-medium">Instruksi:</span>
                    <span className="font-bold text-sky-700">Cetak Bill Kasir</span>
                  </div>
                )}

                {tbl.status === 'available' && (
                  <div className="flex items-center justify-between text-emerald-800 pt-0.5">
                    <span className="text-[11px] text-[#5C5248] font-medium">Kondisi Meja:</span>
                    <span className="font-semibold text-[11px] text-emerald-700">Siap Digunakan</span>
                  </div>
                )}

                {tbl.status === 'cleaning' && (
                  <div className="flex items-center justify-between text-stone-700 pt-0.5">
                    <span className="text-[11px] text-[#5C5248] font-medium">Status:</span>
                    <span className="font-semibold text-[11px] text-stone-600">Perlu Sanitasi</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenNewOrderForTable(tbl.tableNumber);
                  }}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-[#EAE2D8] text-xs font-bold text-[#1F1A16] flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C84B27]" />
                  <span>Buka POS</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTableDetail(tbl);
                  }}
                  className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer"
                >
                  <span>Ubah Status</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Status Modification Modal */}
      {activeTableDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 border border-[#EAE2D8] shadow-2xl w-full max-w-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#EAE2D8] pb-3">
              <div>
                <h3 className="font-display font-black text-lg text-[#1F1A16]">
                  Ubah Status Meja #{activeTableDetail.tableNumber}
                </h3>
                <span className="text-xs text-[#5C5248] font-mono">{activeTableDetail.areaLabel} ({activeTableDetail.capacity} Kursi)</span>
              </div>
              <button
                onClick={() => setActiveTableDetail(null)}
                className="p-1 rounded-lg hover:bg-stone-100 text-[#5C5248] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#1F1A16] block">Pilih Status Baru:</span>
              <div className="grid grid-cols-2 gap-2 font-bold font-mono">
                {[
                  { id: 'available', label: 'Tersedia', color: 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100' },
                  { id: 'occupied', label: 'Terisi (Occupied)', color: 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100' },
                  { id: 'reserved', label: 'Reserved', color: 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100' },
                  { id: 'billing', label: 'Minta Bill', color: 'bg-sky-50 text-sky-800 border-sky-300 hover:bg-sky-100' },
                  { id: 'cleaning', label: 'Dibersihkan', color: 'bg-stone-100 text-stone-800 border-stone-300 hover:bg-stone-200' }
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      onUpdateTableStatus(activeTableDetail.id, st.id as any);
                      setActiveTableDetail(null);
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all hover:scale-102 cursor-pointer ${st.color}`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveTableDetail(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-[#1F1A16] cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table QR Stand Generator Modal */}
      <TableQRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        tables={tables}
      />

    </div>
  );
};
