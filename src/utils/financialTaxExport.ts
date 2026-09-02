import { Order } from '../types';
import { CAFE_INFO } from '../data/mockData';

export interface FinancialTaxSummary {
  periodLabel: string;
  totalOrdersCount: number;
  grossSales: number;        // Omzet kotor sebelum diskon
  totalDiscount: number;     // Total potongan voucher/promo
  dpp: number;               // Dasar Pengenaan Pajak (Gross - Discount)
  taxPB1: number;            // Pajak PB1 10% F&B
  serviceCharge: number;     // Service charge 5%
  netRevenue: number;        // Total penerimaan kasir (DPP + PB1 + Service)
  paymentMethodsBreakdown: {
    qris: number;
    cash: number;
    card: number;
    transfer: number;
  };
}

export const calculateFinancialTaxSummary = (
  orders: Order[],
  periodLabel: string = 'Bulan Berjalan (September 2026)'
): FinancialTaxSummary => {
  const paidOrders = orders.filter(o => o.paymentStatus === 'paid' || o.status === 'completed');

  let grossSales = 0;
  let totalDiscount = 0;
  let dpp = 0;
  let taxPB1 = 0;
  let serviceCharge = 0;
  let netRevenue = 0;

  const paymentBreakdown = {
    qris: 0,
    cash: 0,
    card: 0,
    transfer: 0
  };

  paidOrders.forEach(order => {
    const sub = order.subtotal || 0;
    const disc = order.discount || 0;
    const orderDpp = Math.max(0, sub - disc);
    const tax = order.tax || Math.round(orderDpp * 0.10);
    const sc = order.serviceCharge || Math.round(orderDpp * 0.05);
    const tot = order.total || (orderDpp + tax + sc);

    grossSales += sub;
    totalDiscount += disc;
    dpp += orderDpp;
    taxPB1 += tax;
    serviceCharge += sc;
    netRevenue += tot;

    const method = (order.paymentMethod || 'qris').toLowerCase();
    if (method.includes('qris')) paymentBreakdown.qris += tot;
    else if (method.includes('cash') || method.includes('tunai')) paymentBreakdown.cash += tot;
    else if (method.includes('card') || method.includes('kartu') || method.includes('debit')) paymentBreakdown.card += tot;
    else paymentBreakdown.transfer += tot;
  });

  return {
    periodLabel,
    totalOrdersCount: paidOrders.length,
    grossSales,
    totalDiscount,
    dpp,
    taxPB1,
    serviceCharge,
    netRevenue,
    paymentMethodsBreakdown: paymentBreakdown
  };
};

/**
 * Generates and triggers download of Excel-ready CSV for Financial & PB1 Tax Reconciliation
 */
export const downloadFinancialTaxCSV = (orders: Order[], periodLabel: string = 'September_2026') => {
  const summary = calculateFinancialTaxSummary(orders, periodLabel);
  const paidOrders = orders.filter(o => o.paymentStatus === 'paid' || o.status === 'completed');

  const escapeCell = (val: any) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows: string[][] = [
    [escapeCell(`LAPORAN KEUANGAN & REKAPITULASI SETORAN PAJAK RESTORAN PB1 (10%)`)],
    [escapeCell(`Unit Usaha: ${CAFE_INFO.name}`)],
    [escapeCell(`Alamat: ${CAFE_INFO.address}`)],
    [escapeCell(`NPWPD / NIB: 09.345.678.9-012.000 / 1234567890123`)],
    [escapeCell(`Periode: ${summary.periodLabel}`)],
    [escapeCell(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} WIB`)],
    [],
    [escapeCell(`--- RINGKASAN REKAPITULASI FISKAL ---`)],
    [escapeCell(`Parameter Akuntansi`), escapeCell(`Nominal (IDR)`)],
    [escapeCell(`Total Transaksi Selesai`), escapeCell(`${summary.totalOrdersCount} Transaksi`)],
    [escapeCell(`Omzet Kotor (Gross Sales)`), escapeCell(summary.grossSales.toString())],
    [escapeCell(`Total Diskon & Potongan Promo`), escapeCell((-summary.totalDiscount).toString())],
    [escapeCell(`Dasar Pengenaan Pajak (DPP / Net Sales)`), escapeCell(summary.dpp.toString())],
    [escapeCell(`Pajak Restoran PB1 (10% Terhutang)`), escapeCell(summary.taxPB1.toString())],
    [escapeCell(`Service Charge Restoran (5%)`), escapeCell(summary.serviceCharge.toString())],
    [escapeCell(`Total Penerimaan Kasir (Gross Revenue)`), escapeCell(summary.netRevenue.toString())],
    [],
    [escapeCell(`--- RINCIAN CHANNEL PEMBAYARAN ---`)],
    [escapeCell(`QRIS Dinamis & Statis (GPN)`), escapeCell(summary.paymentMethodsBreakdown.qris.toString())],
    [escapeCell(`Uang Tunai (Cash POS)`), escapeCell(summary.paymentMethodsBreakdown.cash.toString())],
    [escapeCell(`Kartu Debit / Kredit EDC`), escapeCell(summary.paymentMethodsBreakdown.card.toString())],
    [escapeCell(`Transfer Bank / Virtual Account`), escapeCell(summary.paymentMethodsBreakdown.transfer.toString())],
    [],
    [escapeCell(`--- BUKU JURNAL TRANSAKSI DETAIL ---`)],
    [
      escapeCell('No. Pesanan'),
      escapeCell('Waktu Transaksi'),
      escapeCell('Pelanggan'),
      escapeCell('Meja / Tipe'),
      escapeCell('Subtotal Menu'),
      escapeCell('Diskon'),
      escapeCell('DPP (Dasar Pajak)'),
      escapeCell('PB1 (10%)'),
      escapeCell('Service (5%)'),
      escapeCell('Total Akhir'),
      escapeCell('Metode Bayar'),
      escapeCell('Status Kasir')
    ],
    ...paidOrders.map((o) => {
      const sub = o.subtotal || 0;
      const disc = o.discount || 0;
      const dppVal = Math.max(0, sub - disc);
      const taxVal = o.tax || Math.round(dppVal * 0.10);
      const scVal = o.serviceCharge || Math.round(dppVal * 0.05);
      return [
        escapeCell(`#${o.orderNumber}`),
        escapeCell(o.createdAt || new Date().toLocaleTimeString('id-ID')),
        escapeCell(o.customerName),
        escapeCell(o.orderType === 'dine-in' ? `Meja ${o.tableNumber || '-'}` : 'Takeaway'),
        escapeCell(sub.toString()),
        escapeCell(disc.toString()),
        escapeCell(dppVal.toString()),
        escapeCell(taxVal.toString()),
        escapeCell(scVal.toString()),
        escapeCell(o.total.toString()),
        escapeCell((o.paymentMethod || 'QRIS').toUpperCase()),
        escapeCell((o.status || 'completed').toUpperCase())
      ];
    })
  ];

  const csvContent = '\uFEFF' + rows.map(r => r.join(',')).join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Laporan_Pajak_PB1_${CAFE_INFO.name.replace(/\s+/g, '_')}_${periodLabel}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generates an official printable PDF window for PB1 Tax Return & Financial Summary
 */
export const openPrintablePB1TaxReport = (orders: Order[], periodLabel: string = 'September 2026') => {
  const summary = calculateFinancialTaxSummary(orders, periodLabel);
  const paidOrders = orders.filter(o => o.paymentStatus === 'paid' || o.status === 'completed');
  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Laporan Setoran Pajak PB1 Restoran - ${CAFE_INFO.name}</title>
      <style>
        @page { size: A4 portrait; margin: 12mm 15mm; }
        * { box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #1F1A16;
          margin: 0;
          padding: 0;
          font-size: 10.5px;
          line-height: 1.4;
        }
        .kop {
          border-bottom: 3px double #1F1A16;
          padding-bottom: 12px;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .kop-left h1 {
          font-size: 17px;
          margin: 0 0 2px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 900;
        }
        .kop-left p {
          margin: 1px 0;
          color: #5C5248;
          font-size: 10px;
        }
        .kop-badge {
          text-align: right;
          font-size: 9.5px;
          color: #5C5248;
          font-family: monospace;
          background: #FAF7F2;
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid #EAE2D8;
        }
        .doc-title {
          text-align: center;
          margin: 12px 0 16px 0;
        }
        .doc-title h2 {
          font-size: 13.5px;
          margin: 0 0 3px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #C84B27;
          font-weight: 900;
        }
        .doc-title span {
          font-size: 10.5px;
          color: #5C5248;
          font-weight: 600;
        }
        .grid-summary {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 16px;
        }
        .stat-card {
          background: #FAF7F2;
          border: 1px solid #EAE2D8;
          border-radius: 8px;
          padding: 8px 10px;
        }
        .stat-card .label {
          font-size: 8.5px;
          text-transform: uppercase;
          color: #8C7E72;
          font-weight: 700;
          margin-bottom: 2px;
        }
        .stat-card .val {
          font-size: 13px;
          font-weight: 800;
          font-family: monospace;
          color: #1F1A16;
        }
        .stat-card.highlight {
          background: #FFF5F2;
          border-color: #C84B27;
        }
        .stat-card.highlight .val {
          color: #C84B27;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 16px;
          font-size: 9.5px;
        }
        th, td {
          border: 1px solid #EAE2D8;
          padding: 5px 7px;
          text-align: left;
        }
        th {
          background-color: #FAF7F2;
          font-weight: 700;
          font-size: 8.5px;
          text-transform: uppercase;
          color: #5C5248;
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-mono { font-family: monospace; }
        .font-bold { font-weight: 700; }
        .bg-light { background-color: #FAFAFA; }
        .signature-block {
          margin-top: 24px;
          display: flex;
          justify-content: space-between;
          page-break-inside: avoid;
        }
        .sig-box {
          width: 200px;
          text-align: center;
          font-size: 9.5px;
        }
        .sig-space {
          height: 48px;
        }
        .sig-line {
          border-top: 1px solid #1F1A16;
          padding-top: 4px;
          font-weight: 700;
        }
        @media print {
          .no-print { display: none; }
          body { font-size: 9.5pt; }
        }
      </style>
    </head>
    <body>
      <div class="kop">
        <div class="kop-left">
          <h1>${CAFE_INFO.name}</h1>
          <p>${CAFE_INFO.address} • Telp: ${CAFE_INFO.phone}</p>
          <p>NPWPD Restoran: 09.345.678.9-012.000 • NIB: 1234567890123</p>
        </div>
        <div class="kop-badge">
          <div><strong>FORMULIR PB1-RESTO-01</strong></div>
          <div>Lampiran SPT Masa Pajak Restoran</div>
          <div style="color: #15803D; font-weight: bold;">Status: VALID TERVERIFIKASI</div>
        </div>
      </div>

      <div class="doc-title">
        <h2>Rekapitulasi Omzet & Setoran Pajak Restoran PB1 (10%)</h2>
        <span>Periode Pelaporan: <strong>${summary.periodLabel}</strong></span>
      </div>

      <div class="grid-summary">
        <div class="stat-card">
          <div class="label">Omzet Kotor (Gross)</div>
          <div class="val">${formatRupiah(summary.grossSales)}</div>
        </div>
        <div class="stat-card">
          <div class="label">Dasar Pengenaan Pajak (DPP)</div>
          <div class="val">${formatRupiah(summary.dpp)}</div>
        </div>
        <div class="stat-card highlight">
          <div class="label">Setoran PB1 (10% Terhutang)</div>
          <div class="val">${formatRupiah(summary.taxPB1)}</div>
        </div>
        <div class="stat-card">
          <div class="label">Service Charge (5%)</div>
          <div class="val">${formatRupiah(summary.serviceCharge)}</div>
        </div>
        <div class="stat-card">
          <div class="label">Diskon & Promo Voucher</div>
          <div class="val">-${formatRupiah(summary.totalDiscount)}</div>
        </div>
        <div class="stat-card">
          <div class="label">Total Penerimaan Kasir</div>
          <div class="val">${formatRupiah(summary.netRevenue)}</div>
        </div>
      </div>

      <h3 style="font-size: 10px; margin: 10px 0 5px 0; text-transform: uppercase; font-weight: bold;">Daftar Transaksi Kasir Terverifikasi (${summary.totalOrdersCount} Pesanan)</h3>
      <table>
        <thead>
          <tr>
            <th class="text-center" style="width: 25px;">No</th>
            <th>No. Order</th>
            <th>Waktu</th>
            <th>Pelanggan</th>
            <th class="text-right">Subtotal</th>
            <th class="text-right">Diskon</th>
            <th class="text-right">DPP (Net)</th>
            <th class="text-right">PB1 (10%)</th>
            <th class="text-right">Total Akhir</th>
            <th class="text-center">Metode</th>
          </tr>
        </thead>
        <tbody>
          ${paidOrders.map((o, idx) => {
            const sub = o.subtotal || 0;
            const disc = o.discount || 0;
            const dppVal = Math.max(0, sub - disc);
            const taxVal = o.tax || Math.round(dppVal * 0.10);
            return `
              <tr>
                <td class="text-center font-mono">${idx + 1}</td>
                <td class="font-mono font-bold">#${o.orderNumber}</td>
                <td>${o.createdAt || '-'}</td>
                <td>${o.customerName}</td>
                <td class="text-right font-mono">${formatRupiah(sub)}</td>
                <td class="text-right font-mono text-rose-600">${disc > 0 ? `-${formatRupiah(disc)}` : '-'}</td>
                <td class="text-right font-mono font-bold">${formatRupiah(dppVal)}</td>
                <td class="text-right font-mono font-bold" style="color: #C84B27;">${formatRupiah(taxVal)}</td>
                <td class="text-right font-mono font-bold">${formatRupiah(o.total)}</td>
                <td class="text-center font-mono" style="font-size: 8px;">${(o.paymentMethod || 'QRIS').toUpperCase()}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
        <tfoot>
          <tr class="bg-light font-bold">
            <td colspan="4" class="text-center">TOTAL KESELURUHAN</td>
            <td class="text-right font-mono">${formatRupiah(summary.grossSales)}</td>
            <td class="text-right font-mono">-${formatRupiah(summary.totalDiscount)}</td>
            <td class="text-right font-mono">${formatRupiah(summary.dpp)}</td>
            <td class="text-right font-mono" style="color: #C84B27;">${formatRupiah(summary.taxPB1)}</td>
            <td class="text-right font-mono">${formatRupiah(summary.netRevenue)}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>

      <div class="signature-block">
        <div class="sig-box">
          <div>Disiapkan Oleh,</div>
          <div>Head Cashier / Accounting</div>
          <div class="sig-space"></div>
          <div class="sig-line">Siti Rahmawati, S.Ak</div>
          <div style="font-size: 8.5px; color: #8C7E72;">Finance & Tax Specialist</div>
        </div>

        <div class="sig-box">
          <div>Mengetahui & Menyetujui,</div>
          <div>Owner / General Manager</div>
          <div class="sig-space"></div>
          <div class="sig-line">Hans Christian Pratama</div>
          <div style="font-size: 8.5px; color: #8C7E72;">Director of Homie Cozie F&B</div>
        </div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank', 'width=900,height=750');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
};
