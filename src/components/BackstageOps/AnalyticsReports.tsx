import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  Star, 
  MapPin, 
  Compass, 
  Clock, 
  Sparkles, 
  ArrowUpRight, 
  Receipt, 
  Percent, 
  Calendar, 
  Download, 
  Filter,
  CheckCircle2,
  FileSpreadsheet,
  Plus,
  Printer,
  FileText,
  X,
  Building2,
  Coffee,
  Radio
} from 'lucide-react';
import { CAFE_INFO } from '../../data/mockData';
import { DataTable, ColumnDef, FilterConfig } from '../Common/DataTable';
import { downloadFinancialTaxCSV, openPrintablePB1TaxReport } from '../../utils/financialTaxExport';
import { Order } from '../../types';
import { VisitorAnalyticsRadar } from './analytics/VisitorAnalyticsRadar';

interface TransactionLedgerItem {
  id: string;
  invoiceNo: string;
  timestamp: string;
  customerName: string;
  tableInfo: string;
  paymentMethod: 'QRIS' | 'Tunai' | 'EDC Debit' | 'Kartu Kredit';
  subtotal: number;
  pb1Tax: number;
  serviceCharge: number;
  totalAmount: number;
  cashierName: string;
  taxStatus: 'reconciled' | 'pending';
}

const INITIAL_TRANSACTIONS: TransactionLedgerItem[] = [
  {
    id: 'trx-101',
    invoiceNo: '#HC-TRX-240826-001',
    timestamp: '19:35 WIB',
    customerName: 'Kevin Adisurya',
    tableInfo: 'Meja 05 (Stage)',
    paymentMethod: 'QRIS',
    subtotal: 185000,
    pb1Tax: 18500,
    serviceCharge: 9250,
    totalAmount: 212750,
    cashierName: 'Siti Barista Kasir',
    taxStatus: 'reconciled'
  },
  {
    id: 'trx-102',
    invoiceNo: '#HC-TRX-240826-002',
    timestamp: '19:22 WIB',
    customerName: 'Rian Pratama',
    tableInfo: 'Meja 02 (Indoor)',
    paymentMethod: 'Tunai',
    subtotal: 95000,
    pb1Tax: 9500,
    serviceCharge: 4750,
    totalAmount: 109250,
    cashierName: 'Siti Barista Kasir',
    taxStatus: 'reconciled'
  },
  {
    id: 'trx-103',
    invoiceNo: '#HC-TRX-240826-003',
    timestamp: '19:10 WIB',
    customerName: 'Dina Wahyuni',
    tableInfo: 'Meja 07 (Stage)',
    paymentMethod: 'QRIS',
    subtotal: 240000,
    pb1Tax: 24000,
    serviceCharge: 12000,
    totalAmount: 276000,
    cashierName: 'Budi Supervisor',
    taxStatus: 'reconciled'
  },
  {
    id: 'trx-104',
    invoiceNo: '#HC-TRX-240826-004',
    timestamp: '18:50 WIB',
    customerName: 'Bambang Soedirgo',
    tableInfo: 'Meja 14 (VIP)',
    paymentMethod: 'EDC Debit',
    subtotal: 580000,
    pb1Tax: 58000,
    serviceCharge: 29000,
    totalAmount: 667000,
    cashierName: 'Budi Supervisor',
    taxStatus: 'reconciled'
  },
  {
    id: 'trx-105',
    invoiceNo: '#HC-TRX-240826-005',
    timestamp: '18:35 WIB',
    customerName: 'Maya Savira',
    tableInfo: 'Meja 10 (Outdoor)',
    paymentMethod: 'QRIS',
    subtotal: 125000,
    pb1Tax: 12500,
    serviceCharge: 6250,
    totalAmount: 143750,
    cashierName: 'Siti Barista Kasir',
    taxStatus: 'reconciled'
  },
  {
    id: 'trx-106',
    invoiceNo: '#HC-TRX-240826-006',
    timestamp: '18:15 WIB',
    customerName: 'Ahmad Fauzi',
    tableInfo: 'Meja 06 (Stage)',
    paymentMethod: 'Tunai',
    subtotal: 160000,
    pb1Tax: 16000,
    serviceCharge: 8000,
    totalAmount: 184000,
    cashierName: 'Siti Barista Kasir',
    taxStatus: 'reconciled'
  },
  {
    id: 'trx-107',
    invoiceNo: '#HC-TRX-240826-007',
    timestamp: '17:45 WIB',
    customerName: 'Grup PITSTOP Motor',
    tableInfo: 'Meja 11 (Outdoor)',
    paymentMethod: 'QRIS',
    subtotal: 420000,
    pb1Tax: 42000,
    serviceCharge: 21000,
    totalAmount: 483000,
    cashierName: 'Budi Supervisor',
    taxStatus: 'reconciled'
  }
];

export const AnalyticsReports: React.FC = () => {
  const [activeReportTab, setActiveReportTab] = useState<'financial_tax' | 'visitor_radar'>('financial_tax');
  const [transactions, setTransactions] = useState<TransactionLedgerItem[]>(INITIAL_TRANSACTIONS);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  const topSellers = [
    { name: 'Kopi Susu Homie Signature', qty: 184, revenue: 4416000, margin: '72%', growth: '+18%' },
    { name: 'Aren Cremosa Cozie', qty: 112, revenue: 3136000, margin: '68%', growth: '+24%' },
    { name: 'Nasi Goreng Kampung Homie', qty: 76, revenue: 2736000, margin: '65%', growth: '+12%' },
    { name: 'V60 Single Origin (Aceh Gayo)', qty: 58, revenue: 1740000, margin: '75%', growth: '+8%' },
    { name: 'Platter Nongkrong #PITSTOP', qty: 48, revenue: 1824000, margin: '62%', growth: '+31%' }
  ];

  const trafficSources = [
    { channel: 'Google Search & Maps ("Cafe Kalisari" / "Cafe Cijantung")', share: 42, visits: '1.240 klik/bln', note: 'SEO lokal & rating 4.8★' },
    { channel: 'Instagram (@homiecozie.jkt Story & Reels Live Music)', share: 28, visits: '820 klik/bln', note: 'Konten live acoustic & promo kopi' },
    { channel: 'Komunitas Motor #PITSTOP & Direct WhatsApp', share: 20, visits: '590 klik/bln', note: 'Member loyal & grup nongkrong' },
    { channel: 'Walk-in Warga Sekitar (Jl. H. Hasan & Baru)', share: 10, visits: '290 klik/bln', note: 'Tetangga & keluarga sekitar' }
  ];

  const hourlyRushes = [
    { hour: '10:00', load: 25 },
    { hour: '12:00', load: 75, isPeak: true },
    { hour: '14:00', load: 45 },
    { hour: '16:00', load: 60 },
    { hour: '18:30', load: 85, isPeak: true },
    { hour: '19:30', load: 100, isPeak: true },
    { hour: '20:30', load: 90, isPeak: true },
    { hour: '21:30', load: 50 }
  ];

  // Financial metrics breakdown
  const grossSales = 14850000;
  const cogsTotal = 4455000; // ~30%
  const grossProfit = grossSales - cogsTotal;
  const serviceChargeTotal = Math.round(grossSales * 0.05);
  const pb1TaxTotal = Math.round(grossSales * 0.10);

  const handleImportBankStatement = (importedRows: Record<string, any>[]) => {
    const newTrx: TransactionLedgerItem[] = importedRows.map((row, idx) => {
      const sub = Number(row.subtotal || row['Subtotal'] || 100000);
      const tax = Number(row.pb1Tax || row['PB1'] || sub * 0.1);
      const service = Number(row.serviceCharge || row['Service'] || sub * 0.05);

      return {
        id: row.id || `trx-imp-${Date.now()}-${idx}`,
        invoiceNo: row.invoiceNo || row['No Invoice'] || `#HC-TRX-IMP-${idx + 1}`,
        timestamp: row.timestamp || row['Waktu'] || new Date().toLocaleTimeString('id-ID') + ' WIB',
        customerName: row.customerName || row['Pelanggan'] || 'Tamu POS',
        tableInfo: row.tableInfo || row['Meja'] || 'Takeaway',
        paymentMethod: (row.paymentMethod || row['Metode Bayar'] || 'QRIS') as any,
        subtotal: sub,
        pb1Tax: tax,
        serviceCharge: service,
        totalAmount: Number(row.totalAmount || row['Total'] || sub + tax + service),
        cashierName: row.cashierName || row['Kasir'] || 'Kasir',
        taxStatus: 'reconciled'
      };
    });

    setTransactions((prev) => [...newTrx, ...prev]);
  };

  // 1. Transaction DataTable Columns
  const transactionColumns: ColumnDef<TransactionLedgerItem>[] = [
    {
      header: 'No. Invoice',
      accessorKey: 'invoiceNo',
      sortable: true,
      minWidth: '150px',
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          <span className="font-mono font-bold text-xs text-amber-800 block">{row.invoiceNo}</span>
          <span className="text-[10px] text-[#8C7E72] font-mono block">{row.timestamp}</span>
        </div>
      )
    },
    {
      header: 'Pelanggan & Meja',
      accessorKey: 'customerName',
      sortable: true,
      minWidth: '160px',
      cell: ({ row }) => (
        <div className="min-w-0">
          <div className="font-bold text-xs text-[#1F1A16] truncate">{row.customerName}</div>
          <span className="text-[10px] text-[#5C5248] block truncate">{row.tableInfo}</span>
        </div>
      )
    },
    {
      header: 'Kanal Pembayaran',
      accessorKey: 'paymentMethod',
      sortable: true,
      minWidth: '130px',
      cell: ({ row }) => (
        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold border whitespace-nowrap inline-block ${
          row.paymentMethod === 'QRIS' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
          row.paymentMethod === 'Tunai' ? 'bg-amber-50 text-amber-800 border-amber-200' :
          'bg-purple-50 text-purple-800 border-purple-200'
        }`}>
          {row.paymentMethod}
        </span>
      )
    },
    {
      header: 'Subtotal F&B',
      accessorKey: 'subtotal',
      sortable: true,
      minWidth: '120px',
      align: 'right',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-[#1F1A16] whitespace-nowrap">{formatRupiah(row.subtotal)}</span>
      )
    },
    {
      header: 'PB1 Resto (10%)',
      accessorKey: 'pb1Tax',
      sortable: true,
      minWidth: '120px',
      align: 'right',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-emerald-700 font-bold whitespace-nowrap">{formatRupiah(row.pb1Tax)}</span>
      )
    },
    {
      header: 'Service (5%)',
      accessorKey: 'serviceCharge',
      sortable: true,
      minWidth: '110px',
      align: 'right',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-amber-800 whitespace-nowrap">{formatRupiah(row.serviceCharge)}</span>
      )
    },
    {
      header: 'Total Akhir',
      accessorKey: 'totalAmount',
      sortable: true,
      minWidth: '120px',
      align: 'right',
      cell: ({ row }) => (
        <span className="font-mono font-black text-xs text-[#1F1A16] whitespace-nowrap">{formatRupiah(row.totalAmount)}</span>
      )
    },
    {
      header: 'Status Bapenda',
      accessorKey: 'taxStatus',
      sortable: true,
      minWidth: '120px',
      align: 'center',
      cell: ({ row }) => (
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-mono font-bold uppercase inline-flex items-center justify-center gap-1 whitespace-nowrap">
          <CheckCircle2 className="w-2.5 h-2.5" /> Reconciled
        </span>
      )
    }
  ];

  const transactionFilters: FilterConfig<TransactionLedgerItem>[] = [
    {
      id: 'payment',
      label: 'Metode Bayar',
      options: [
        { label: 'QRIS Dinamis', value: 'QRIS' },
        { label: 'Tunai Kasir', value: 'Tunai' },
        { label: 'EDC Debit', value: 'EDC Debit' }
      ],
      filterFn: (row, val) => row.paymentMethod === val
    }
  ];

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl mx-auto w-full pb-24 lg:pb-8">
      
      {/* Analytics Sub-Module Switcher */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#FAF7F2] rounded-2xl border border-[#EAE2D8] text-xs font-bold overflow-x-auto no-scrollbar shadow-xs">
        <button
          onClick={() => setActiveReportTab('financial_tax')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeReportTab === 'financial_tax'
              ? 'bg-[#C84B27] text-white shadow-xs'
              : 'text-[#5C5248] hover:bg-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>📈 1. Analitik Keuangan, Omzet & Pajak PB1</span>
        </button>

        <button
          onClick={() => setActiveReportTab('visitor_radar')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeReportTab === 'visitor_radar'
              ? 'bg-[#C84B27] text-white shadow-xs'
              : 'text-[#5C5248] hover:bg-white'
          }`}
        >
          <Radio className="w-4 h-4 text-emerald-300 animate-pulse" />
          <span>📡 2. Radar Pengunjung & Conversion Intelligence</span>
        </button>
      </div>

      {activeReportTab === 'visitor_radar' ? (
        <VisitorAnalyticsRadar />
      ) : (
        <>
          {/* Top Stat KPI Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Omzet Hari Ini */}
        <div className="bg-white p-5 rounded-3xl border border-[#EAE2D8] shadow-xs hover:shadow-md hover:border-[#C84B27]/30 transition-all flex flex-col justify-between min-h-[145px]">
          <div className="flex items-center justify-between gap-2 pb-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-[#C84B27] flex items-center justify-center shrink-0 shadow-2xs">
                <DollarSign className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#5C5248] whitespace-nowrap">
                Omzet Hari Ini
              </span>
            </div>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 whitespace-nowrap">
              +18.4% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>

          <div className="font-display font-black text-2xl sm:text-[26px] text-[#1F1A16] tracking-tight my-1">
            {formatRupiah(grossSales)}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#5C5248] pt-2 border-t border-[#EAE2D8]/60 mt-1">
            <span>94 Transaksi Kasir</span>
            <span className="font-mono text-[#8C7E72] text-[10px]">Dine-in & QRIS</span>
          </div>
        </div>

        {/* KPI 2: Tamu Berkunjung */}
        <div className="bg-white p-5 rounded-3xl border border-[#EAE2D8] shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between min-h-[145px]">
          <div className="flex items-center justify-between gap-2 pb-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 shadow-2xs">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#5C5248] whitespace-nowrap">
                Tamu Berkunjung
              </span>
            </div>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 whitespace-nowrap">
              +24% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>

          <div className="font-display font-black text-2xl sm:text-[26px] text-[#1F1A16] tracking-tight my-1 flex items-baseline gap-1.5">
            <span>248</span>
            <span className="text-sm font-bold text-[#8C7E72] font-mono">Pax</span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#5C5248] pt-2 border-t border-[#EAE2D8]/60 mt-1">
            <span>Rata-rata Okupansi</span>
            <span className="font-mono font-bold text-[#1F1A16] text-[11px]">2.6 Pax / Meja</span>
          </div>
        </div>

        {/* KPI 3: Laba Kotor */}
        <div className="bg-white p-5 rounded-3xl border border-[#EAE2D8] shadow-xs hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between min-h-[145px]">
          <div className="flex items-center justify-between gap-2 pb-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#5C5248] whitespace-nowrap">
                Laba Kotor
              </span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200 shrink-0 whitespace-nowrap">
              70% Margin
            </span>
          </div>

          <div className="font-display font-black text-2xl sm:text-[26px] text-[#1F1A16] tracking-tight my-1">
            {formatRupiah(grossProfit)}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#5C5248] pt-2 border-t border-[#EAE2D8]/60 mt-1">
            <span>HPP Terkontrol</span>
            <span className="font-mono font-bold text-emerald-700 text-[11px]">{formatRupiah(cogsTotal)}</span>
          </div>
        </div>

        {/* KPI 4: Pajak Restoran PB1 */}
        <div className="bg-white p-5 rounded-3xl border border-[#EAE2D8] shadow-xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between min-h-[145px]">
          <div className="flex items-center justify-between gap-2 pb-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0 shadow-2xs">
                <Receipt className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#5C5248] whitespace-nowrap">
                Pajak PB1
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-50 text-teal-800 border border-teal-200 shrink-0 whitespace-nowrap">
              <CheckCircle2 className="w-3 h-3" /> Rekonsiliasi
            </span>
          </div>

          <div className="font-display font-black text-2xl sm:text-[26px] text-[#1F1A16] tracking-tight my-1">
            {formatRupiah(pb1TaxTotal)}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#5C5248] pt-2 border-t border-[#EAE2D8]/60 mt-1">
            <span>Tarif PB1 (10%)</span>
            <span className="font-mono font-bold text-teal-800 text-[10px]">Bapenda DKI Jaktim</span>
          </div>
        </div>

      </div>

      {/* Main Transactions & PB1 Tax Ledger DataTable */}
      <DataTable<TransactionLedgerItem>
        data={transactions}
        columns={transactionColumns}
        title="Buku Besar Transaksi Kasir & Rekonsiliasi Pajak PB1"
        subtitle="Laporan audit transaksi harian yang siap diekspor untuk pelaporan SPT Masa Bapenda Jaktim"
        searchPlaceholder="Cari no invoice #HC, nama tamu, kasir..."
        searchableKeys={['invoiceNo', 'customerName', 'cashierName', 'paymentMethod']}
        filters={transactionFilters}
        enableSelection={true}
        initialPageSize={10}
        pageSizeOptions={[5, 10, 25, 50]}
        exportFileName="HomieCozie_Laporan_Pajak_PB1"
        enableExport={true}
        enableImport={true}
        onImport={handleImportBankStatement}
        topActions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                const exportableOrders: Order[] = transactions.map(t => ({
                  id: t.id,
                  orderNumber: t.invoiceNo.replace('#HC-TRX-', '').replace('#', ''),
                  customerName: t.customerName,
                  tableNumber: t.tableInfo.match(/\d+/)?.[0] || '01',
                  orderType: 'dine-in',
                  items: [],
                  subtotal: t.subtotal,
                  discount: 0,
                  tax: t.pb1Tax,
                  serviceCharge: t.serviceCharge,
                  total: t.totalAmount,
                  paymentMethod: t.paymentMethod === 'QRIS' ? 'qris' : t.paymentMethod === 'Tunai' ? 'cash' : 'card',
                  paymentStatus: 'paid',
                  status: 'completed',
                  createdAt: t.timestamp
                }));
                downloadFinancialTaxCSV(exportableOrders, 'September_2026');
              }}
              className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              title="Unduh Rekapitulasi Pajak PB1 & Keuangan (.CSV / Excel)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Excel PB1 (10%)</span>
            </button>

            <button
              onClick={() => {
                const exportableOrders: Order[] = transactions.map(t => ({
                  id: t.id,
                  orderNumber: t.invoiceNo.replace('#HC-TRX-', '').replace('#', ''),
                  customerName: t.customerName,
                  tableNumber: t.tableInfo.match(/\d+/)?.[0] || '01',
                  orderType: 'dine-in',
                  items: [],
                  subtotal: t.subtotal,
                  discount: 0,
                  tax: t.pb1Tax,
                  serviceCharge: t.serviceCharge,
                  total: t.totalAmount,
                  paymentMethod: t.paymentMethod === 'QRIS' ? 'qris' : t.paymentMethod === 'Tunai' ? 'cash' : 'card',
                  paymentStatus: 'paid',
                  status: 'completed',
                  createdAt: t.timestamp
                }));
                openPrintablePB1TaxReport(exportableOrders, 'September 2026');
              }}
              className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              title="Cetak SPT Masa Pajak Restoran PB1 Resmi (PDF)"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak SPT PB1 (PDF)</span>
            </button>

            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#1F1A16] hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Pratinjau Dokumen Rekapitulasi Fiskal Lengkap"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Pratinjau Audit</span>
            </button>
          </div>
        }
      />

      {/* Two-Column Analytics Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Top Selling Items + Traffic Acquisition */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Top Sellers Table */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAE2D8] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D8]">
              <div>
                <h3 className="font-display font-black text-base text-[#1F1A16] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#C84B27]" />
                  <span>5 Menu Paling Laris (Top Performers)</span>
                </h3>
                <p className="text-xs text-[#5C5248] mt-0.5">
                  Berdasarkan volume penjualan dan persentase kontribusi margin kotor
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {topSellers.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white border border-[#EAE2D8] flex items-center justify-center font-mono font-bold text-xs text-amber-800 shadow-xs">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#1F1A16]">{item.name}</div>
                      <div className="text-[10px] text-[#8C7E72] font-mono">
                        {item.qty} terjual ({item.growth}) • Margin: {item.margin}
                      </div>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-[#C84B27] text-xs">
                    {formatRupiah(item.revenue)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources Breakdown */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAE2D8] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D8]">
              <div>
                <h3 className="font-display font-black text-base text-[#1F1A16] flex items-center gap-2">
                  <Compass className="w-4 h-4 text-teal-700" />
                  <span>Sumber Akuisisi Pelanggan (Traffic Attribution)</span>
                </h3>
                <p className="text-xs text-[#5C5248] mt-0.5">
                  Analisis saluran kedatangan pengunjung ke Homie Cozie Pasar Rebo
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {trafficSources.map((src, idx) => (
                <div key={idx} className="space-y-1.5 p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8]">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-[#1F1A16]">{src.channel}</span>
                    <span className="font-mono font-bold text-amber-800">{src.share}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-[#C84B27]"
                      style={{ width: `${src.share}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#5C5248]">
                    <span>{src.note}</span>
                    <span className="font-mono text-[#8C7E72]">{src.visits}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Hourly Heatmap & PB1 Tax Reconciliation */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Rush Hours Heatmap */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAE2D8] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D8]">
              <div>
                <h3 className="font-display font-black text-base text-[#1F1A16] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>Heatmap Beban Jam Sibuk (Rush Hours)</span>
                </h3>
                <p className="text-xs text-[#5C5248] mt-0.5">
                  Optimasi alokasi shift barista & staf dapur
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {hourlyRushes.map((hr, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <span className="w-12 font-mono font-bold text-[#5C5248]">{hr.hour}</span>
                  <div className="flex-1 h-4 rounded-lg bg-stone-100 overflow-hidden p-0.5 border border-[#EAE2D8]">
                    <div 
                      className={`h-full rounded-md transition-all ${
                        hr.isPeak ? 'bg-[#C84B27]' : 'bg-stone-300'
                      }`}
                      style={{ width: `${hr.load}%` }}
                    />
                  </div>
                  <span className={`w-10 text-right font-mono font-bold text-[11px] ${
                    hr.isPeak ? 'text-[#C84B27]' : 'text-[#8C7E72]'
                  }`}>
                    {hr.load}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tax & Financial Summary Card */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#EAE2D8] shadow-xs space-y-4 w-full min-w-0">
            <div className="flex items-center gap-2.5 pb-3.5 border-b border-[#EAE2D8]">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
                <Receipt className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-bold text-sm sm:text-base text-[#1F1A16] leading-snug">
                  Struktur Finansial & Pajak Restoran
                </h3>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] gap-2">
                <span className="text-[#5C5248] text-xs font-sans">Gross F&B Sales:</span>
                <span className="font-bold text-[#1F1A16] whitespace-nowrap shrink-0">{formatRupiah(grossSales)}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] gap-2">
                <span className="text-[#5C5248] text-xs font-sans">Total COGS (Bahan Baku):</span>
                <span className="font-bold text-rose-600 whitespace-nowrap shrink-0">-{formatRupiah(cogsTotal)}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] gap-2">
                <span className="text-[#5C5248] text-xs font-sans">Service Charge (5%):</span>
                <span className="font-bold text-amber-800 whitespace-nowrap shrink-0">+{formatRupiah(serviceChargeTotal)}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] gap-2">
                <span className="text-[#5C5248] text-xs font-sans">Pajak Restoran PB1 (10%):</span>
                <span className="font-bold text-emerald-700 whitespace-nowrap shrink-0">+{formatRupiah(pb1TaxTotal)}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100/40 border border-amber-200/80 text-amber-950 gap-1.5 sm:gap-2">
                <span className="font-bold text-xs font-sans leading-snug">Estimasi Laba Bersih Operasional:</span>
                <span className="font-black text-sm sm:text-base text-[#C84B27] whitespace-nowrap shrink-0 text-right font-mono">
                  {formatRupiah(grossProfit + serviceChargeTotal)}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
      </>
      )}

      {/* ================= OFFICIAL PDF / PRINTABLE REPORT MODAL ================= */}
      {isPdfModalOpen && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs p-3 sm:p-6 md:p-8 flex justify-center items-start print:p-0 print:bg-white print:static"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsPdfModalOpen(false);
          }}
        >
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-10 border border-[#EAE2D8] shadow-2xl relative space-y-6 my-4 sm:my-6 print:shadow-none print:border-none print:m-0 print:p-0 print:rounded-none">
            
            {/* Sticky Top Modal Actions Bar (Pinned at top, never cut off, hidden during actual print) */}
            <div className="sticky -top-6 sm:-top-10 -mx-6 sm:-mx-10 px-6 sm:px-10 py-4 bg-white/95 backdrop-blur-md z-20 flex items-center justify-between border-b border-[#EAE2D8] rounded-t-3xl shadow-xs print:hidden">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-900 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-[#C84B27]" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-xs sm:text-sm text-[#1F1A16] block truncate">
                    Dokumen Laporan Keuangan & Rekonsiliasi Pajak PB1
                  </span>
                  <span className="text-[11px] text-[#8C7E72] font-mono block">
                    Format Standar Audit Pajak Daerah Bapenda DKI Jakarta
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-98"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Cetak / Simpan PDF (Ctrl+P)</span>
                  <span className="sm:hidden">Cetak PDF</span>
                </button>
                <button
                  onClick={() => setIsPdfModalOpen(false)}
                  className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-stone-200 text-[#5C5248] transition-colors cursor-pointer"
                  title="Tutup Pratinjau (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ================= FORMAL A4 PRINTABLE DOCUMENT ================= */}
            <div className="bg-white p-6 sm:p-10 rounded-2xl border border-stone-300 shadow-xs space-y-7 font-sans text-stone-900 print:border-none print:shadow-none print:p-0">
              
              {/* 1. Official Letterhead & Entity Identity */}
              <div className="border-b-4 border-double border-stone-800 pb-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  
                  {/* Left: Brand Identity & Legal Details */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-900/20 bg-stone-100 shrink-0 shadow-xs">
                      <img 
                        src={CAFE_INFO.logo} 
                        alt="Homie Cozie Logo" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-mono font-bold tracking-widest text-[#C84B27] uppercase">
                        PT. HOMIE COZIE BERKAH RASA
                      </div>
                      <h1 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-stone-950">
                        HOMIE COZIE COFFEE & KITCHEN
                      </h1>
                      <p className="text-xs text-stone-600 leading-snug">
                        {CAFE_INFO.address}
                      </p>
                      <p className="text-[11px] font-mono text-stone-500">
                        Telp: {CAFE_INFO.phone} • Email: finance@homiecozie.com • Web: www.homiecozie.com
                      </p>
                    </div>
                  </div>

                  {/* Right: Legal NPWPD & Document Classification */}
                  <div className="sm:text-right font-mono text-xs space-y-1 bg-stone-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-none border-stone-200 shrink-0">
                    <div className="inline-block px-2.5 py-1 rounded bg-stone-900 text-white font-bold text-[10px] tracking-wider uppercase">
                      DOKUMEN FISKAL RESMI
                    </div>
                    <div className="text-[11px] text-stone-700 font-bold pt-1">
                      No: HC/FIN-PB1/{new Date().getFullYear()}/08/{new Date().getDate().toString().padStart(2, '0')}-01
                    </div>
                    <div className="text-[10px] text-stone-500">
                      NPWPD: 31.750.882.1-008.000 • NIB: 022010882026
                    </div>
                    <div className="text-[10px] text-stone-500">
                      Periode: {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>

                </div>
              </div>

              {/* 2. Executive Financial KPI Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] text-stone-500 block uppercase font-bold">Gross Revenue</span>
                  <span className="text-sm sm:text-base font-black text-stone-900 block mt-0.5">
                    {formatRupiah(grossSales)}
                  </span>
                  <span className="text-[9px] text-emerald-700 font-bold block mt-0.5">94 Transaksi Sukses</span>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 block uppercase font-bold">Pajak PB1 Restoran (10%)</span>
                  <span className="text-sm sm:text-base font-black text-emerald-800 block mt-0.5">
                    {formatRupiah(pb1TaxTotal)}
                  </span>
                  <span className="text-[9px] text-emerald-700 font-bold block mt-0.5">Bapenda DKI Jaktim</span>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
                  <span className="text-[10px] text-amber-800 block uppercase font-bold">Service Charge (5%)</span>
                  <span className="text-sm sm:text-base font-black text-amber-900 block mt-0.5">
                    {formatRupiah(serviceChargeTotal)}
                  </span>
                  <span className="text-[9px] text-amber-700 font-bold block mt-0.5">Alokasi Tim Staf Kafe</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#C84B27]/10 border border-orange-200">
                  <span className="text-[10px] text-orange-950 block uppercase font-bold">Total Settled Inflow</span>
                  <span className="text-sm sm:text-base font-black text-[#C84B27] block mt-0.5">
                    {formatRupiah(grossSales + serviceChargeTotal + pb1TaxTotal)}
                  </span>
                  <span className="text-[9px] text-orange-950 font-bold block mt-0.5">Kliring Kas & Bank 100%</span>
                </div>
              </div>

              {/* 3. Section I: Structured Revenue & PB1 Tax Reconciliation */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded bg-stone-900 text-white text-[9px] font-mono flex items-center justify-center font-bold">I</span>
                    <span>Rekonsiliasi Arus Pendapatan & Pajak PB1 (Restaurant Tax Statement)</span>
                  </h3>
                  <span className="text-[10px] font-mono text-stone-500">Mata Uang: IDR (Rupiah)</span>
                </div>

                <div className="overflow-x-auto border border-stone-300 rounded-xl">
                  <table className="w-full text-xs font-mono">
                    <thead className="bg-stone-100 text-stone-700 border-b border-stone-300 text-[11px]">
                      <tr>
                        <th className="p-2.5 text-left font-bold w-20">Kode</th>
                        <th className="p-2.5 text-left font-bold">Pos Anggaran / Komponen Finansial</th>
                        <th className="p-2.5 text-center font-bold w-24">Tarif</th>
                        <th className="p-2.5 text-right font-bold w-36">Jumlah (IDR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 text-[11px]">
                      <tr>
                        <td className="p-2 text-stone-500 font-bold">401.01</td>
                        <td className="p-2">Penjualan Minuman (Coffee, Manual Brew & Signature Mocktail)</td>
                        <td className="p-2 text-center text-stone-500">58.4%</td>
                        <td className="p-2 text-right font-bold">Rp 8.672.400</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-stone-500 font-bold">401.02</td>
                        <td className="p-2">Penjualan Makanan Dapur (Kitchen Mains, Pasta, Rice & Bites)</td>
                        <td className="p-2 text-center text-stone-500">41.6%</td>
                        <td className="p-2 text-right font-bold">Rp 6.177.600</td>
                      </tr>
                      <tr className="bg-stone-50 font-bold">
                        <td className="p-2 text-stone-900">401.00</td>
                        <td className="p-2 text-stone-900">Total Penjualan Kotor (Gross F&B Sales)</td>
                        <td className="p-2 text-center">100%</td>
                        <td className="p-2 text-right text-stone-900">{formatRupiah(grossSales)}</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-stone-500 font-bold">501.00</td>
                        <td className="p-2 text-rose-700">Biaya Pokok Penjualan / COGS Bahan Baku (Estimasi)</td>
                        <td className="p-2 text-center text-rose-700">~30.0%</td>
                        <td className="p-2 text-right text-rose-700 font-bold">-{formatRupiah(cogsTotal)}</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-stone-500 font-bold">203.01</td>
                        <td className="p-2 text-amber-800">Biaya Pelayanan Pelanggan (Service Charge)</td>
                        <td className="p-2 text-center text-amber-800">5.0%</td>
                        <td className="p-2 text-right text-amber-800 font-bold">+{formatRupiah(serviceChargeTotal)}</td>
                      </tr>
                      <tr className="bg-emerald-50/60 font-bold border-y border-emerald-200">
                        <td className="p-2.5 text-emerald-900 font-bold">202.01</td>
                        <td className="p-2.5 text-emerald-900">Pajak Restoran PB1 (10%) Terutang Wajib Setor Bapenda</td>
                        <td className="p-2.5 text-center text-emerald-900">10.0%</td>
                        <td className="p-2.5 text-right font-black text-emerald-800 text-xs">+{formatRupiah(pb1TaxTotal)}</td>
                      </tr>
                      <tr className="bg-stone-100 font-black text-xs">
                        <td className="p-3 text-stone-900">101.00</td>
                        <td className="p-3 text-stone-900">TOTAL PENERIMAAN KASIR BERSIH (NETT SETTLED INFLOW)</td>
                        <td className="p-3 text-center">-</td>
                        <td className="p-3 text-right text-[#C84B27] text-sm">
                          {formatRupiah(grossSales + serviceChargeTotal + pb1TaxTotal)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. Section II: Payment Settlement Breakdown */}
              <div className="space-y-2.5">
                <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-stone-900 text-white text-[9px] font-mono flex items-center justify-center font-bold">II</span>
                  <span>Distribusi Kanal Pembayaran (Payment Gateway Settlement)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl border border-stone-200 bg-stone-50/60 space-y-1">
                    <div className="flex justify-between text-stone-700 font-bold">
                      <span>QRIS Dinamis (All E-Wallet)</span>
                      <span>57.1%</span>
                    </div>
                    <div className="text-sm font-black text-stone-900">Rp 8.425.000</div>
                    <div className="text-[10px] text-stone-500">54 Trx • Auto-settlement H+0</div>
                  </div>

                  <div className="p-3 rounded-xl border border-stone-200 bg-stone-50/60 space-y-1">
                    <div className="flex justify-between text-stone-700 font-bold">
                      <span>EDC Debit / Kartu Kredit</span>
                      <span>28.8%</span>
                    </div>
                    <div className="text-sm font-black text-stone-900">Rp 4.250.000</div>
                    <div className="text-[10px] text-stone-500">23 Trx • BCA & Mandiri POS</div>
                  </div>

                  <div className="p-3 rounded-xl border border-stone-200 bg-stone-50/60 space-y-1">
                    <div className="flex justify-between text-stone-700 font-bold">
                      <span>Tunai Kasir (Cash in Drawer)</span>
                      <span>14.1%</span>
                    </div>
                    <div className="text-sm font-black text-stone-900">Rp 2.175.000</div>
                    <div className="text-[10px] text-stone-500">17 Trx • Fisik di Laci Kasir</div>
                  </div>
                </div>
              </div>

              {/* 5. Section III: Audit Sample of Today's Transactions */}
              <div className="space-y-2.5">
                <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-stone-900 text-white text-[9px] font-mono flex items-center justify-center font-bold">III</span>
                  <span>Cuplikan Audit Transaksi Terverifikasi (Transaction Audit Trail)</span>
                </h3>

                <div className="overflow-x-auto border border-stone-300 rounded-xl">
                  <table className="w-full text-[11px] font-mono">
                    <thead className="bg-stone-100 text-stone-700 border-b border-stone-300">
                      <tr>
                        <th className="p-2 text-left font-bold">No. Invoice</th>
                        <th className="p-2 text-left font-bold">Waktu</th>
                        <th className="p-2 text-left font-bold">Pelanggan & Meja</th>
                        <th className="p-2 text-center font-bold">Kanal</th>
                        <th className="p-2 text-right font-bold">Subtotal F&B</th>
                        <th className="p-2 text-right font-bold">PB1 (10%)</th>
                        <th className="p-2 text-right font-bold">Total Bayar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {transactions.slice(0, 5).map((t, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}>
                          <td className="p-2 font-bold text-stone-900">{t.invoiceNo}</td>
                          <td className="p-2 text-stone-500">{t.timestamp}</td>
                          <td className="p-2 text-stone-800">{t.customerName} ({t.tableInfo})</td>
                          <td className="p-2 text-center">
                            <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-800 text-[10px] font-bold">
                              {t.paymentMethod}
                            </span>
                          </td>
                          <td className="p-2 text-right">{formatRupiah(t.subtotal)}</td>
                          <td className="p-2 text-right text-emerald-700 font-bold">{formatRupiah(t.pb1Tax)}</td>
                          <td className="p-2 text-right font-bold text-stone-900">{formatRupiah(t.totalAmount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 6. Section IV: Security Verification Seal & Official Signatures */}
              <div className="pt-4 border-t-2 border-stone-300 space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-xs">
                  
                  {/* Left: Prepared By Supervisor */}
                  <div className="text-center space-y-12">
                    <p className="font-bold text-stone-700 text-[11px] uppercase tracking-wider">
                      Disusun Oleh (Supervisor Kasir):
                    </p>
                    <div className="space-y-0.5">
                      <div className="font-bold underline text-stone-900 text-xs">
                        Budi Santoso, S.E.
                      </div>
                      <p className="text-[10px] text-stone-500 font-mono">
                        NIP: STF-2026-004 • Kasir & Accounting
                      </p>
                      <p className="text-[9px] text-stone-400 font-mono">
                        Verifikasi Digital: 27/08/2026 19:50 WIB
                      </p>
                    </div>
                  </div>

                  {/* Center: Official Stamp & Fiscal QR Audit Token */}
                  <div className="text-center p-3 rounded-2xl border-2 border-dashed border-emerald-600/40 bg-emerald-50/40 space-y-2">
                    <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono text-[9px] font-black uppercase tracking-wider">
                      ✓ BAPENDA COMPLIANT & AUDITED
                    </div>
                    <p className="text-[10px] text-stone-600 leading-tight">
                      Dokumen ini dihasilkan secara otomatis oleh sistem POS Homie Cozie dan sah sebagai arsip laporan perpajakan.
                    </p>
                    <div className="font-mono text-[9px] text-stone-400 break-all">
                      TOKEN: HC-BAPENDA-AUTH-{new Date().toISOString().slice(0, 10).replace(/-/g, '')}-77A9
                    </div>
                  </div>

                  {/* Right: Approved by Owner / Director */}
                  <div className="text-center space-y-12">
                    <p className="font-bold text-stone-700 text-[11px] uppercase tracking-wider">
                      Disetujui Oleh (Director / Owner):
                    </p>
                    <div className="space-y-0.5">
                      <div className="font-bold underline text-stone-900 text-xs">
                        Kevin Adisurya Nugraha
                      </div>
                      <p className="text-[10px] text-stone-500 font-mono">
                        Director & Founder Homie Cozie
                      </p>
                      <p className="text-[9px] text-stone-400 font-mono">
                        Authorized Fiscal Signatory
                      </p>
                    </div>
                  </div>

                </div>

                {/* Footer Note */}
                <div className="text-center text-[10px] text-stone-400 font-mono pt-3 border-t border-stone-200">
                  Dicetak otomatis oleh Sistem Enterprise Homie Cozie Coffee & Kitchen • Halaman 1 dari 1 • Rahasia Internal Kafe
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
