import React, { useState } from 'react';
import { CustomerProfile } from '../../types';
import { 
  Users, 
  Search, 
  Award, 
  Send, 
  Sparkles, 
  MessageSquare, 
  Phone, 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  Filter, 
  Gift, 
  Star, 
  ArrowRight, 
  X,
  Plus,
  Edit,
  ExternalLink
} from 'lucide-react';
import { CUSTOMER_CRM } from '../../data/mockData';
import { DataTable, ColumnDef, FilterConfig, BulkAction } from '../Common/DataTable';

export const CRMDatabase: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerProfile[]>(CUSTOMER_CRM);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState<boolean>(false);
  const [broadcastTargetUsers, setBroadcastTargetUsers] = useState<CustomerProfile[]>([]);
  const [broadcastMessage, setBroadcastMessage] = useState<string>(
    'Halo Homie Cozie VIP Member! ✨\n\nSabtu ini ada Weekend Acoustic Groove Nostalgia 2000s mulai jam 19:30 WIB di panggung Semi-Outdoor. Khusus member Cozie Rewards, nikmati Diskon 15% untuk semua menu makanan & minuman! Reservasi mejamu sekarang ya! 🎶☕'
  );
  const [broadcastSentCount, setBroadcastSentCount] = useState<number | null>(null);

  // Quick Points Adjustment Modal
  const [pointsModalUser, setPointsModalUser] = useState<CustomerProfile | null>(null);
  const [pointsDelta, setPointsDelta] = useState<number>(100);

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  const handleSendBroadcast = () => {
    const targetCount = broadcastTargetUsers.length > 0 ? broadcastTargetUsers.length : customers.length;
    setBroadcastSentCount(targetCount);
    setTimeout(() => {
      setIsBroadcastOpen(false);
      setBroadcastSentCount(null);
      setBroadcastTargetUsers([]);
    }, 2500);
  };

  const handleSavePoints = () => {
    if (!pointsModalUser) return;
    setCustomers((prev) =>
      prev.map((c) => (c.id === pointsModalUser.id ? { ...c, coziePoints: Math.max(0, c.coziePoints + pointsDelta) } : c))
    );
    setPointsModalUser(null);
  };

  const handleImportCustomers = (importedRows: Record<string, any>[]) => {
    const newMembers: CustomerProfile[] = importedRows.map((row, idx) => ({
      id: row.id || `crm-${Date.now()}-${idx}`,
      name: row.name || row['Nama Member'] || 'Member Baru',
      phone: row.phone || row['WhatsApp'] || row['No HP'] || '0812-0000-0000',
      email: row.email || row['Email'] || `${(row.name || 'member').toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      tier: (row.tier || row['Tier'] || 'Silver Cozie') as any,
      coziePoints: Number(row.coziePoints || row['Poin'] || 100),
      totalVisits: Number(row.totalVisits || row['Kunjungan'] || 1),
      lifetimeSpend: Number(row.lifetimeSpend || row['Total Belanja'] || 50000),
      lastVisit: row.lastVisit || row['Kunjungan Terakhir'] || 'Hari ini',
      favoriteItems: typeof row.favoriteItems === 'string' ? row.favoriteItems.split(';') : (row.favoriteItems || ['Kopi Susu Homie Signature']),
      tags: typeof row.tags === 'string' ? row.tags.split(';') : (row.tags || ['Member Baru']),
      stampsCount: Number(row.stampsCount || 1)
    }));

    setCustomers((prev) => [...newMembers, ...prev]);
  };

  // 1. Column Definitions for DataTable
  const columns: ColumnDef<CustomerProfile>[] = [
    {
      header: 'Member VIP',
      accessorKey: 'name',
      sortable: true,
      minWidth: '220px',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200 text-[#B23812] flex items-center justify-center font-bold text-xs uppercase shadow-2xs shrink-0">
            {row.name.slice(0, 2)}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-sm text-[#1F1A16] truncate">
              {row.name}
            </div>
            <div className="flex items-center gap-1 mt-0.5 flex-wrap">
              {row.tags.slice(0, 2).map((tg, i) => (
                <span key={i} className="text-[9px] bg-[#FAF7F2] text-[#5C5248] px-1.5 py-0.2 rounded border border-[#EAE2D8] whitespace-nowrap">
                  {tg}
                </span>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'WhatsApp / Kontak',
      accessorKey: 'phone',
      sortable: true,
      minWidth: '150px',
      cell: ({ row }) => (
        <a
          href={`https://wa.me/${row.phone.replace(/\D/g, '')}?text=Halo%20Kak%20${encodeURIComponent(row.name)},%20salam%20hangat%20dari%20Homie%20Cozie!%20☕`}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-mono font-medium text-[#1F1A16] hover:text-[#25D366] inline-flex items-center gap-1.5 group whitespace-nowrap"
        >
          <Phone className="w-3.5 h-3.5 text-[#25D366] group-hover:scale-110 transition-transform shrink-0" />
          <span>{row.phone}</span>
        </a>
      )
    },
    {
      header: 'Tier Member',
      accessorKey: 'tier',
      sortable: true,
      minWidth: '130px',
      cell: ({ row }) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border whitespace-nowrap inline-block ${
          row.tier === 'Platinum Cozie' ? 'bg-purple-50 text-purple-800 border-purple-200' :
          row.tier === 'Gold Cozie' ? 'bg-amber-50 text-amber-800 border-amber-200' :
          'bg-stone-100 text-stone-800 border-stone-200'
        }`}>
          {row.tier}
        </span>
      )
    },
    {
      header: 'Cozie Points',
      accessorKey: 'coziePoints',
      sortable: true,
      minWidth: '120px',
      align: 'right',
      cell: ({ row }) => (
        <span className="font-mono font-bold text-amber-800 text-xs whitespace-nowrap">
          {row.coziePoints.toLocaleString('id-ID')} Pts
        </span>
      )
    },
    {
      header: 'Kunjungan',
      accessorKey: 'totalVisits',
      sortable: true,
      minWidth: '100px',
      align: 'right',
      cell: ({ row }) => (
        <span className="font-mono font-bold text-[#1F1A16] text-xs whitespace-nowrap">
          {row.totalVisits}x Visit
        </span>
      )
    },
    {
      header: 'Total Belanja',
      accessorKey: 'lifetimeSpend',
      sortable: true,
      minWidth: '130px',
      align: 'right',
      cell: ({ row }) => (
        <span className="font-mono font-bold text-emerald-900 text-xs whitespace-nowrap">
          {formatRupiah(row.lifetimeSpend)}
        </span>
      )
    },
    {
      header: 'Menu Favorit',
      accessorKey: 'favoriteItems',
      minWidth: '180px',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {row.favoriteItems.map((fav, i) => (
            <span key={i} className="text-[10px] bg-stone-100 text-[#5C5248] px-1.5 py-0.5 rounded border border-[#EAE2D8] whitespace-nowrap">
              {fav}
            </span>
          ))}
        </div>
      )
    },
    {
      header: 'Aksi',
      align: 'center',
      minWidth: '100px',
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap">
          <button
            onClick={() => {
              setPointsModalUser(row);
              setPointsDelta(100);
            }}
            className="p-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors cursor-pointer"
            title="Tambah / Kurangi Poin"
          >
            <Gift className="w-3.5 h-3.5" />
          </button>
          <a
            href={`https://wa.me/${row.phone.replace(/\D/g, '')}?text=Halo%20Kak%20${encodeURIComponent(row.name)}!%20☕`}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 transition-colors cursor-pointer"
            title="Kirim Pesan WhatsApp"
          >
            <Phone className="w-3.5 h-3.5" />
          </a>
        </div>
      )
    }
  ];

  // 2. Filter Configurations
  const filters: FilterConfig<CustomerProfile>[] = [
    {
      id: 'tier',
      label: 'Tier Member',
      options: [
        { label: 'Platinum Cozie', value: 'Platinum Cozie' },
        { label: 'Gold Cozie', value: 'Gold Cozie' },
        { label: 'Silver Cozie', value: 'Silver Cozie' }
      ],
      filterFn: (row, val) => row.tier === val
    }
  ];

  // 3. Bulk Actions
  const bulkActions: BulkAction<CustomerProfile>[] = [
    {
      label: 'Broadcast WA Terpilih',
      icon: <Send className="w-3.5 h-3.5" />,
      variant: 'primary',
      onClick: (selected) => {
        setBroadcastTargetUsers(selected);
        setIsBroadcastOpen(true);
      }
    },
    {
      label: 'Bonus 250 Poin Massal',
      icon: <Gift className="w-3.5 h-3.5" />,
      variant: 'default',
      onClick: (selected, clear) => {
        const ids = new Set(selected.map((s) => s.id));
        setCustomers((prev) =>
          prev.map((c) => (ids.has(c.id) ? { ...c, coziePoints: c.coziePoints + 250 } : c))
        );
        alert(`Berhasil memberikan bonus +250 Poin kepada ${selected.length} member terpilih!`);
        clear();
      }
    }
  ];

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl mx-auto w-full pb-24 lg:pb-8">
      
      {/* Top Banner: CRM Value Proposition */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#EAE2D8] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full min-w-0">
        <div className="space-y-1.5 min-w-0 w-full flex-1">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-amber-800 min-w-0 w-full overflow-hidden">
            <Sparkles className="w-4 h-4 text-[#B23812] shrink-0" />
            <span className="truncate">Database Pelanggan Terpusat & Solusi Retensi (DataTable Pro)</span>
          </div>
          <h3 className="font-display font-black text-lg sm:text-xl text-[#1F1A16] leading-tight break-words">
            {customers.length} Member Terdaftar dalam Ekosistem
          </h3>
          <p className="text-xs text-[#5C5248] max-w-xl leading-relaxed">
            Lacak histori kunjungan, saldo Cozie Points, menu favorit, filter sortir data komprehensif, ekspor/impor file, dan broadcast WhatsApp tertarget.
          </p>
        </div>

        <button
          onClick={() => {
            setBroadcastTargetUsers([]);
            setIsBroadcastOpen(true);
          }}
          className="w-full sm:w-auto px-4.5 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs shrink-0 transition-all cursor-pointer active:scale-95"
        >
          <Send className="w-4 h-4" />
          <span>Buat Broadcast WhatsApp Promo</span>
        </button>
      </div>

      {/* Main CRM DataTable */}
      <DataTable<CustomerProfile>
        data={customers}
        columns={columns}
        title="Daftar Member & Loyalitas Kafe"
        subtitle="Data CRM terintegrasi dengan POS kasir, reservasi, dan program stempel Cozie Club"
        searchPlaceholder="Cari nama member, WhatsApp, menu favorit..."
        searchableKeys={['name', 'phone', 'email', 'tier']}
        filters={filters}
        bulkActions={bulkActions}
        enableSelection={true}
        initialPageSize={10}
        pageSizeOptions={[5, 10, 25, 50]}
        exportFileName="HomieCozie_Member_CRM"
        enableExport={true}
        enableImport={true}
        onImport={handleImportCustomers}
        enableViewSwitcher={true}
        renderCardView={(c, _, isSelected, toggleSelect) => (
          <div
            className={`bg-white rounded-3xl p-5 border shadow-xs space-y-4 flex flex-col justify-between transition-all ${
              isSelected ? 'border-[#C84B27] ring-2 ring-[#C84B27]/20 bg-amber-50/20' : 'border-[#EAE2D8] hover:border-[#C84B27]'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={toggleSelect}
                    className="w-4 h-4 mt-1 rounded-md accent-[#C84B27] cursor-pointer"
                  />
                  <div>
                    <h4 className="font-display font-bold text-base text-[#1F1A16]">
                      {c.name}
                    </h4>
                    <p className="text-xs text-[#5C5248] font-mono mt-0.5">{c.phone}</p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold border ${
                  c.tier === 'Platinum Cozie' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                  c.tier === 'Gold Cozie' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                  'bg-stone-100 text-stone-800 border-stone-200'
                }`}>
                  {c.tier}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {c.tags.map((tg, i) => (
                  <span key={i} className="text-[10px] bg-[#FAF7F2] text-[#5C5248] px-2 py-0.5 rounded-lg border border-[#EAE2D8]">
                    {tg}
                  </span>
                ))}
              </div>

              {/* Stats Box */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-[#FAF7F2] rounded-2xl border border-[#EAE2D8] text-xs font-mono">
                <div>
                  <span className="text-[10px] text-[#5C5248] block">Cozie Points:</span>
                  <span className="font-bold text-amber-800 text-sm">{c.coziePoints} Pts</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#5C5248] block">Kunjungan:</span>
                  <span className="font-bold text-[#1F1A16] text-sm">{c.totalVisits}x Visit</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#5C5248] block">Lifetime Spend:</span>
                  <span className="font-bold text-emerald-900">{formatRupiah(c.lifetimeSpend)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#5C5248] block">Kunjungan Terakhir:</span>
                  <span className="font-bold text-[#5C5248]">{c.lastVisit}</span>
                </div>
              </div>

              {/* Favorite Items */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#5C5248] uppercase tracking-wider block">
                  Menu Favorit:
                </span>
                <div className="flex flex-wrap gap-1 text-[11px] text-[#5C5248]">
                  {c.favoriteItems.map((fav, i) => (
                    <span key={i} className="bg-stone-100 px-2 py-0.5 rounded-md border border-[#EAE2D8]">
                      ☕ {fav}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#EAE2D8] flex items-center justify-between text-xs">
              <a
                href={`https://wa.me/${c.phone.replace(/\D/g, '')}?text=Halo%20Kak%20${encodeURIComponent(c.name)},%20salam%20hangat%20dari%20Homie%20Cozie!%20☕`}
                target="_blank"
                rel="noreferrer"
                className="text-[#25D366] hover:underline font-bold flex items-center gap-1"
              >
                <Phone className="w-3 h-3" /> Chat WhatsApp
              </a>
              <span className="text-[11px] font-mono text-[#5C5248]">{c.stampsCount}/10 Stamps</span>
            </div>
          </div>
        )}
      />

      {/* Broadcast Modal */}
      {isBroadcastOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAE2D8] rounded-3xl p-6 max-w-lg w-full text-[#1F1A16] space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D8]">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-[#B23812]" />
                <h3 className="font-display font-black text-lg text-[#1F1A16]">
                  Broadcast WhatsApp Promo ({broadcastTargetUsers.length > 0 ? broadcastTargetUsers.length : customers.length} Member)
                </h3>
              </div>
              <button
                onClick={() => setIsBroadcastOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-100 text-[#5C5248] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-[#1F1A16]">Draft Pesan WhatsApp:</label>
              <textarea
                rows={5}
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="w-full p-3 bg-[#FAF7F2] border border-[#EAE2D8] rounded-2xl text-xs text-[#1F1A16] focus:outline-none focus:border-[#C84B27] resize-none"
              />
            </div>

            {broadcastSentCount && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pesan WhatsApp berhasil disimulasikan terkirim ke {broadcastSentCount} member!</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsBroadcastOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-[#1F1A16] cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSendBroadcast}
                className="px-5 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5B] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Broadcast Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Points Modal */}
      {pointsModalUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAE2D8] rounded-3xl p-6 max-w-md w-full text-[#1F1A16] space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D8]">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#B23812]" />
                <h3 className="font-display font-black text-lg text-[#1F1A16]">
                  Atur Saldo Poin: {pointsModalUser.name}
                </h3>
              </div>
              <button
                onClick={() => setPointsModalUser(null)}
                className="p-1 rounded-lg hover:bg-stone-100 text-[#5C5248] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#EAE2D8] text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[#5C5248]">Saldo Poin Saat Ini:</span>
                <span className="font-mono font-bold text-amber-800">{pointsModalUser.coziePoints} Pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C5248]">Tier:</span>
                <span className="font-bold">{pointsModalUser.tier}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-[#1F1A16]">Nominal Penyesuaian (+ Tambah / - Kurang):</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={pointsDelta}
                  onChange={(e) => setPointsDelta(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl text-xs font-mono font-bold text-[#1F1A16] focus:outline-none focus:border-[#C84B27]"
                />
              </div>
              <div className="flex gap-1.5 pt-1">
                {[+50, +100, +250, +500, -100].map((delta) => (
                  <button
                    key={delta}
                    type="button"
                    onClick={() => setPointsDelta(delta)}
                    className="flex-1 py-1 rounded-lg bg-stone-100 hover:bg-amber-100 text-[10px] font-mono font-bold text-[#1F1A16] border border-[#EAE2D8] cursor-pointer"
                  >
                    {delta > 0 ? `+${delta}` : delta}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#EAE2D8]">
              <button
                onClick={() => setPointsModalUser(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-[#5C5248] text-xs font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSavePoints}
                className="px-5 py-2 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
