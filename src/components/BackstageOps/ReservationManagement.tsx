import React, { useState } from 'react';
import { Reservation, TableItem } from '../../types';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  XCircle, 
  MessageCircle, 
  Search, 
  Filter, 
  Send, 
  Sparkles, 
  ArrowRight, 
  X, 
  Phone,
  Plus,
  Coffee,
  Check
} from 'lucide-react';
import { DataTable, ColumnDef, FilterConfig, BulkAction } from '../Common/DataTable';

interface ReservationManagementProps {
  reservations: Reservation[];
  tables: TableItem[];
  onUpdateStatus: (resId: string, newStatus: Reservation['status'], assignedTable?: string) => void;
}

export const ReservationManagement: React.FC<ReservationManagementProps> = ({
  reservations,
  tables,
  onUpdateStatus
}) => {
  const [resList, setResList] = useState<Reservation[]>(reservations);
  const [activeResForSeat, setActiveResForSeat] = useState<Reservation | null>(null);
  const [selectedTableToSeat, setSelectedTableToSeat] = useState<string>('01');

  // New Reservation Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newGuests, setNewGuests] = useState<number>(2);
  const [newTime, setNewTime] = useState<string>('19:30');
  const [newArea, setNewArea] = useState<Reservation['areaPreference']>('semi-outdoor');
  const [newNotes, setNewNotes] = useState<string>('');

  const handleSendWA = (res: Reservation) => {
    const text = encodeURIComponent(
      `Halo Kak ${res.customerName}! ✨\n\nKami dari Homie Cozie Coffee & Kitchen menginformasikan bahwa reservasi meja kakak (Kode: ${res.bookingCode}) untuk ${res.guestCount} orang pada hari ini jam ${res.timeSlot} WIB sudah SIAP di area ${res.areaPreference.toUpperCase()}! ☕✨\n\nAlamat: Jl. H. Hasan No. 23, Pasar Rebo.\nSampai jumpa nanti ya Kak!`
    );
    window.open(`https://wa.me/${res.customerPhone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const handleConfirmSeat = () => {
    if (!activeResForSeat) return;
    onUpdateStatus(activeResForSeat.id, 'seated', selectedTableToSeat);
    setResList((prev) =>
      prev.map((r) => (r.id === activeResForSeat.id ? { ...r, status: 'seated', tableNumber: selectedTableToSeat } : r))
    );
    setActiveResForSeat(null);
  };

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    const created: Reservation = {
      id: `res-${Date.now()}`,
      bookingCode: `#HC-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: newName,
      customerPhone: newPhone,
      customerEmail: `${newName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      date: 'Hari ini',
      timeSlot: newTime,
      guestCount: newGuests,
      areaPreference: newArea,
      status: 'confirmed',
      notes: newNotes,
      createdAt: new Date().toLocaleTimeString('id-ID'),
      waConfirmed: false
    };

    setResList((prev) => [created, ...prev]);
    setShowAddModal(false);
    setNewName('');
    setNewPhone('');
  };

  const handleImportReservations = (importedRows: Record<string, any>[]) => {
    const newBookings: Reservation[] = importedRows.map((row, idx) => ({
      id: row.id || `res-${Date.now()}-${idx}`,
      bookingCode: row.bookingCode || row['Kode Booking'] || `#HC-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: row.customerName || row['Nama Pemesan'] || 'Tamu Reservasi',
      customerPhone: row.customerPhone || row['WhatsApp'] || row['No HP'] || '0812-0000-0000',
      customerEmail: row.customerEmail || row['Email'] || '',
      date: row.date || row['Tanggal'] || 'Hari ini',
      timeSlot: row.timeSlot || row['Jam'] || '19:30',
      guestCount: Number(row.guestCount || row['Jumlah Tamu'] || 2),
      areaPreference: (row.areaPreference || row['Area'] || 'semi-outdoor').toLowerCase() as any,
      tableNumber: row.tableNumber || row['Meja'] || undefined,
      status: (row.status || row['Status'] || 'confirmed') as any,
      notes: row.notes || row['Catatan'] || '',
      createdAt: new Date().toLocaleTimeString('id-ID'),
      waConfirmed: Boolean(row.waConfirmed ?? false)
    }));

    setResList((prev) => [...newBookings, ...prev]);
  };

  const formatReservationDate = (dateStr?: string) => {
    if (!dateStr || dateStr === 'Hari ini') return 'Hari ini';
    try {
      if (!dateStr.includes('-') && !dateStr.includes('T')) return dateStr;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) {
        const parts = dateStr.split('T')[0].split('-');
        if (parts.length === 3) {
          const day = parseInt(parts[2], 10);
          const month = parseInt(parts[1], 10);
          const year = parts[0];
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
          return `${day} ${monthNames[month - 1] || ''} ${year}`;
        }
        return dateStr;
      }
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed':
        return { label: 'Terkonfirmasi', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'seated':
        return { label: 'Seated (Duduk) ☕', color: 'bg-sky-50 text-sky-800 border-sky-200' };
      case 'completed':
        return { label: 'Selesai', color: 'bg-stone-100 text-stone-700 border-stone-200' };
      case 'cancelled':
        return { label: 'Batal', color: 'bg-rose-50 text-rose-800 border-rose-200' };
      case 'pending':
      default:
        return { label: 'Menunggu', color: 'bg-amber-50 text-amber-800 border-amber-200' };
    }
  };

  // 1. Column Definitions for DataTable
  const columns: ColumnDef<Reservation>[] = [
    {
      header: 'Kode Booking',
      accessorKey: 'bookingCode',
      sortable: true,
      minWidth: '130px',
      cell: ({ row }) => (
        <span className="font-mono font-black text-xs text-amber-800 whitespace-nowrap">
          {row.bookingCode}
        </span>
      )
    },
    {
      header: 'Nama Pemesan',
      accessorKey: 'customerName',
      sortable: true,
      minWidth: '180px',
      cell: ({ row }) => (
        <div className="min-w-0">
          <div className="font-bold text-sm text-[#1F1A16] truncate">{row.customerName}</div>
          {row.notes && (
            <span className="text-[10px] text-[#5C5248] italic line-clamp-1 block">"{row.notes}"</span>
          )}
        </div>
      )
    },
    {
      header: 'WhatsApp Kontak',
      accessorKey: 'customerPhone',
      sortable: true,
      minWidth: '140px',
      cell: ({ row }) => (
        <a
          href={`https://wa.me/${row.customerPhone.replace(/\D/g, '')}?text=Halo%20Kak%20${encodeURIComponent(row.customerName)}!%20☕`}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-mono text-[#1F1A16] hover:text-[#25D366] inline-flex items-center gap-1.5 whitespace-nowrap"
        >
          <Phone className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
          <span>{row.customerPhone}</span>
        </a>
      )
    },
    {
      header: 'Jadwal & Sesi',
      sortable: true,
      minWidth: '140px',
      accessorFn: (row) => `${row.date} ${row.timeSlot}`,
      cell: ({ row }) => (
        <div className="font-mono text-xs text-[#1F1A16] whitespace-nowrap">
          <div className="font-bold">{row.timeSlot} WIB</div>
          <span className="text-[10px] text-[#5C5248] block">{formatReservationDate(row.date)}</span>
        </div>
      )
    },
    {
      header: 'Pax / Tamu',
      accessorKey: 'guestCount',
      sortable: true,
      minWidth: '100px',
      align: 'center',
      cell: ({ row }) => (
        <div className="font-mono font-bold text-xs text-amber-800 flex items-center justify-center gap-1 whitespace-nowrap">
          <Users className="w-3.5 h-3.5 shrink-0" />
          <span>{row.guestCount} Orang</span>
        </div>
      )
    },
    {
      header: 'Zona Area',
      accessorKey: 'areaPreference',
      sortable: true,
      minWidth: '130px',
      cell: ({ row }) => (
        <span className="text-xs capitalize font-medium text-[#5C5248] whitespace-nowrap block">
          {row.areaPreference}
        </span>
      )
    },
    {
      header: 'Alokasi Meja',
      accessorKey: 'tableNumber',
      sortable: true,
      minWidth: '120px',
      align: 'center',
      cell: ({ row }) => (
        row.tableNumber ? (
          <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold text-xs whitespace-nowrap inline-block">
            Meja #{row.tableNumber}
          </span>
        ) : (
          <span className="text-[10px] text-[#5C5248] font-mono whitespace-nowrap">Belum Di-assign</span>
        )
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      minWidth: '120px',
      align: 'center',
      cell: ({ row }) => {
        const meta = getStatusBadge(row.status);
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border whitespace-nowrap inline-block ${meta.color}`}>
            {meta.label}
          </span>
        );
      }
    },
    {
      header: 'Aksi',
      align: 'center',
      minWidth: '120px',
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap">
          <button
            onClick={() => handleSendWA(row)}
            className="p-1.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 transition-colors cursor-pointer"
            title="Kirim Konfirmasi WA"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </button>

          {row.status === 'confirmed' && (
            <button
              onClick={() => {
                setActiveResForSeat(row);
                setSelectedTableToSeat(row.tableNumber || '01');
              }}
              className="px-2.5 py-1 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white text-[10px] font-bold shadow-2xs cursor-pointer"
            >
              Seat
            </button>
          )}

          {row.status === 'seated' && (
            <button
              onClick={() => {
                onUpdateStatus(row.id, 'completed');
                setResList((prev) =>
                  prev.map((r) => (r.id === row.id ? { ...r, status: 'completed' } : r))
                );
              }}
              className="p-1.5 rounded-xl bg-stone-100 hover:bg-emerald-100 text-emerald-900 border border-stone-200 cursor-pointer"
              title="Tandai Selesai"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )
    }
  ];

  // 2. Filters
  const filters: FilterConfig<Reservation>[] = [
    {
      id: 'status',
      label: 'Status Reservasi',
      options: [
        { label: 'Terkonfirmasi', value: 'confirmed' },
        { label: 'Seated (Duduk)', value: 'seated' },
        { label: 'Selesai', value: 'completed' },
        { label: 'Dibatalkan', value: 'cancelled' }
      ],
      filterFn: (row, val) => row.status === val
    },
    {
      id: 'area',
      label: 'Zona Preferensi',
      options: [
        { label: 'Indoor AC', value: 'indoor' },
        { label: 'Semi-Outdoor Stage', value: 'semi-outdoor' },
        { label: 'Outdoor Kanopi', value: 'outdoor' },
        { label: 'Private VIP Room', value: 'vip' }
      ],
      filterFn: (row, val) => row.areaPreference.toLowerCase() === val.toLowerCase()
    }
  ];

  // 3. Bulk Actions
  const bulkActions: BulkAction<Reservation>[] = [
    {
      label: 'Konfirmasi Massal',
      icon: <Check className="w-3.5 h-3.5" />,
      variant: 'primary',
      onClick: (selected, clear) => {
        const ids = new Set(selected.map((s) => s.id));
        setResList((prev) =>
          prev.map((r) => (ids.has(r.id) ? { ...r, status: 'confirmed' } : r))
        );
        alert(`${selected.length} reservasi berhasil dikonfirmasi!`);
        clear();
      }
    }
  ];

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl mx-auto w-full pb-24 lg:pb-8">
      
      {/* Top Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#EAE2D8] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full min-w-0">
        <div className="space-y-1.5 min-w-0 w-full flex-1">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-amber-800 min-w-0 w-full overflow-hidden">
            <Sparkles className="w-4 h-4 text-[#B23812] shrink-0" />
            <span className="truncate">Manajemen Reservasi & Alokasi Meja Acara</span>
          </div>
          <h3 className="font-display font-black text-lg sm:text-xl text-[#1F1A16] leading-tight break-words">
            {resList.length} Reservasi Terjadwal
          </h3>
          <p className="text-xs text-[#5C5248] max-w-xl leading-relaxed">
            Atur slot jam kedatangan tamu, alokasi zona meja kafe, notifikasi pengingat WhatsApp, dan integrasi check-in instan.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto px-4.5 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs shrink-0 transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Reservasi Manual</span>
        </button>
      </div>

      {/* Main Reservation DataTable */}
      <DataTable<Reservation>
        data={resList}
        columns={columns}
        title="Daftar Reservasi & Jadwal Booking"
        subtitle="Data reservasi online via web dan booking manual kasir / WhatsApp"
        searchPlaceholder="Cari kode booking #HC, nama tamu, no WA..."
        searchableKeys={['bookingCode', 'customerName', 'customerPhone', 'notes']}
        filters={filters}
        bulkActions={bulkActions}
        enableSelection={true}
        initialPageSize={10}
        pageSizeOptions={[5, 10, 25, 50]}
        exportFileName="HomieCozie_Reservasi_Table"
        enableExport={true}
        enableImport={true}
        onImport={handleImportReservations}
        enableViewSwitcher={true}
        renderCardView={(res, _, isSelected, toggleSelect) => {
          const statusMeta = getStatusBadge(res.status);
          const formattedDate = formatReservationDate(res.date);

          return (
            <div
              className={`bg-white rounded-3xl p-5 border shadow-xs space-y-4 flex flex-col justify-between transition-all w-full min-w-0 ${
                isSelected ? 'border-[#C84B27] ring-2 ring-[#C84B27]/20 bg-amber-50/20' : 'border-[#EAE2D8] hover:border-[#C84B27]'
              }`}
            >
              <div className="space-y-3 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={toggleSelect}
                      className="w-4 h-4 mt-0.5 rounded-md accent-[#C84B27] cursor-pointer shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="font-mono font-black text-xs text-amber-800 block">
                        {res.bookingCode}
                      </span>
                      <h4 className="font-display font-bold text-base text-[#1F1A16] mt-0.5 truncate">
                        {res.customerName}
                      </h4>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border shrink-0 ${statusMeta.color}`}>
                    {statusMeta.label}
                  </span>
                </div>

                <div className="space-y-2 p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8] text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#5C5248] text-[11px] font-medium shrink-0">Jadwal & Sesi:</span>
                    <span className="font-mono font-bold text-[#1F1A16] text-right whitespace-nowrap">
                      {formattedDate} • {res.timeSlot} WIB
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#5C5248] text-[11px] font-medium shrink-0">Jumlah Tamu:</span>
                    <span className="font-mono font-bold text-amber-800 whitespace-nowrap">
                      {res.guestCount} Orang
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#5C5248] text-[11px] font-medium shrink-0">Area Preferensi:</span>
                    <span className="font-bold text-[#1F1A16] capitalize whitespace-nowrap">
                      {res.areaPreference}
                    </span>
                  </div>
                  {res.tableNumber ? (
                    <div className="flex items-center justify-between gap-2 text-emerald-900 font-bold pt-1.5 border-t border-[#EAE2D8]">
                      <span className="text-[11px] shrink-0">Alokasi Meja:</span>
                      <span className="font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-lg border border-emerald-200 whitespace-nowrap">
                        Meja #{res.tableNumber}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2 text-[#5C5248] pt-1.5 border-t border-[#EAE2D8]">
                      <span className="text-[11px] shrink-0">Alokasi Meja:</span>
                      <span className="text-[10px] font-mono italic whitespace-nowrap">Belum Di-assign</span>
                    </div>
                  )}
                </div>

                {res.notes && (
                  <div className="text-[11px] text-[#5C5248] italic bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EAE2D8] leading-relaxed">
                    <span className="font-semibold not-italic text-[#1F1A16]">Catatan:</span> "{res.notes}"
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#EAE2D8] flex items-center justify-between gap-2 text-xs">
                <button
                  onClick={() => handleSendWA(res)}
                  className="flex-1 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5B] text-white font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  title="Kirim pesan konfirmasi WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                {res.status === 'confirmed' && (
                  <button
                    onClick={() => {
                      setActiveResForSeat(res);
                      setSelectedTableToSeat(res.tableNumber || '01');
                    }}
                    className="flex-1 py-2 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <span>Dudukkan (Seat)</span>
                  </button>
                )}

                {res.status === 'seated' && (
                  <button
                    onClick={() => {
                      onUpdateStatus(res.id, 'completed');
                      setResList((prev) =>
                        prev.map((r) => (r.id === res.id ? { ...r, status: 'completed' } : r))
                      );
                    }}
                    className="flex-1 py-2 rounded-xl bg-[#FAF7F2] hover:bg-stone-200 text-[#1F1A16] font-bold flex items-center justify-center gap-1.5 border border-[#EAE2D8] cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Selesai</span>
                  </button>
                )}
              </div>
            </div>
          );
        }}
      />

      {/* Seating Table Assignment Modal */}
      {activeResForSeat && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAE2D8] rounded-3xl p-6 max-w-md w-full text-[#1F1A16] space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D8]">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#B23812]" />
                <h3 className="font-display font-black text-lg text-[#1F1A16]">
                  Dudukkan Tamu: {activeResForSeat.customerName}
                </h3>
              </div>
              <button
                onClick={() => setActiveResForSeat(null)}
                className="p-1 rounded-lg hover:bg-stone-100 text-[#5C5248] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-[#5C5248]">
                Pilih nomor meja fisik yang tersedia untuk tamu ({activeResForSeat.guestCount} orang di area {activeResForSeat.areaPreference}):
              </p>

              <div className="space-y-1.5">
                <label className="font-bold text-[#1F1A16]">Pilih Meja Tersedia:</label>
                <select
                  value={selectedTableToSeat}
                  onChange={(e) => setSelectedTableToSeat(e.target.value)}
                  className="w-full p-3 bg-[#FAF7F2] border border-[#EAE2D8] rounded-2xl text-xs font-mono font-bold text-[#1F1A16] focus:outline-none focus:border-[#C84B27]"
                >
                  {tables.map((t) => (
                    <option key={t.id} value={t.tableNumber}>
                      Meja #{t.tableNumber} — {t.areaLabel} ({t.capacity} Kursi) [{t.status}]
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveResForSeat(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-[#1F1A16] cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmSeat}
                className="px-5 py-2 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Konfirmasi Tamu Duduk</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Reservation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateReservation} className="bg-white border border-[#EAE2D8] rounded-3xl p-6 max-w-lg w-full text-[#1F1A16] space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D8]">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#B23812]" />
                <h3 className="font-display font-black text-lg text-[#1F1A16]">
                  Tambah Reservasi Tamu
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-stone-100 text-[#5C5248] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1F1A16] block mb-1">Nama Pemesan:</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl text-xs text-[#1F1A16] focus:outline-none focus:border-[#C84B27]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1F1A16] block mb-1">Nomor WhatsApp:</label>
                  <input
                    type="text"
                    required
                    placeholder="0812-xxxx-xxxx"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl text-xs font-mono text-[#1F1A16] focus:outline-none focus:border-[#C84B27]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#1F1A16] block mb-1">Jumlah Tamu:</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={newGuests}
                    onChange={(e) => setNewGuests(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-[#C84B27]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1F1A16] block mb-1">Jam Kedatangan:</label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-[#C84B27]"
                  >
                    <option value="12:00">12:00 (Lunch)</option>
                    <option value="16:00">16:00 (Sore)</option>
                    <option value="18:30">18:30 (Dinner)</option>
                    <option value="19:30">19:30 (Live Music)</option>
                    <option value="20:30">20:30 (Late Night)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#1F1A16] block mb-1">Zona Area:</label>
                  <select
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value as any)}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl text-xs font-bold focus:outline-none focus:border-[#C84B27]"
                  >
                    <option value="indoor">Indoor AC</option>
                    <option value="semi-outdoor">Semi-Outdoor</option>
                    <option value="outdoor">Outdoor Kanopi</option>
                    <option value="vip">Private VIP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1F1A16] block mb-1">Catatan Khusus (Opsional):</label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Dekat colokan listrik, bawa kue ulang tahun, dll"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl text-xs text-[#1F1A16] focus:outline-none focus:border-[#C84B27] resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#EAE2D8]">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-[#5C5248] text-xs font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Simpan Reservasi
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
