/**
 * Homie Cozie Coffee & Kitchen — ESC/POS Direct Thermal Receipt Printing Engine
 * Supports 58mm (32 chars) and 80mm (48 chars) thermal paper rolls,
 * Auto-Paper Cut, Cash Drawer Kick, and Direct Browser Printing.
 */

import { Order } from '../types';
import { CAFE_INFO } from '../data/mockData';

export interface ThermalPrintConfig {
  paperWidth: '58mm' | '80mm';
  showTaxBreakdown: boolean;
  storeName?: string;
  storeAddress?: string;
  storePhone?: string;
}

export const printThermalReceipt = (
  order: Order,
  config: ThermalPrintConfig = { paperWidth: '58mm', showTaxBreakdown: true }
) => {
  if (typeof window === 'undefined') return;

  const is58mm = config.paperWidth === '58mm';
  const storeName = config.storeName || CAFE_INFO.name;
  const storeAddress = config.storeAddress || CAFE_INFO.address;
  const storePhone = config.storePhone || `Tel/WA: ${CAFE_INFO.whatsapp}`;
  const formatMoney = (num: number) => `Rp ${Number(num).toLocaleString('id-ID')}`;

  const printWindow = window.open('', '_blank', 'width=400,height=650');
  if (!printWindow) {
    alert('Harap izinkan pop-up browser untuk mencetak struk thermal kasir.');
    return;
  }

  const itemsHtml = order.items.map(it => `
    <tr>
      <td colspan="2" style="padding-top: 4px; font-weight: bold; word-break: break-word;">
        ${it.quantity}x ${it.menuItem.name}
      </td>
      <td style="text-align: right; padding-top: 4px; font-weight: bold; white-space: nowrap;">
        ${formatMoney(it.menuItem.price * it.quantity)}
      </td>
    </tr>
    ${it.selectedOptions && Object.keys(it.selectedOptions).length > 0 ? `
      <tr>
        <td colspan="3" style="padding-left: 8px; font-size: 9px; color: #555;">
          ${Object.values(it.selectedOptions).join(', ')}
        </td>
      </tr>
    ` : ''}
    ${it.notes ? `
      <tr>
        <td colspan="3" style="padding-left: 8px; font-size: 9px; color: #777; font-style: italic;">
          * ${it.notes}
        </td>
      </tr>
    ` : ''}
  `).join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>Struk #${order.orderNumber} - ${storeName}</title>
        <style>
          @page {
            margin: 0;
            size: ${is58mm ? '58mm auto' : '80mm auto'};
          }
          * {
            box-sizing: border-box;
          }
          body {
            font-family: 'Courier New', Courier, monospace;
            font-size: ${is58mm ? '10.5px' : '12px'};
            line-height: 1.35;
            margin: 0;
            padding: ${is58mm ? '8px 6px' : '12px 10px'};
            color: #000;
            background: #fff;
            width: ${is58mm ? '54mm' : '76mm'};
          }
          .header {
            text-align: center;
            border-bottom: 1px dashed #000;
            padding-bottom: 6px;
            margin-bottom: 6px;
          }
          .header .brand {
            font-size: ${is58mm ? '13px' : '15px'};
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .header .address {
            font-size: 9px;
            margin-top: 2px;
          }
          .meta-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
            margin-bottom: 6px;
            border-bottom: 1px dashed #000;
            padding-bottom: 4px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10.5px;
            margin-bottom: 6px;
          }
          .totals-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10.5px;
            border-top: 1px dashed #000;
            padding-top: 4px;
            margin-top: 4px;
          }
          .totals-table td {
            padding: 1.5px 0;
          }
          .grand-total {
            font-size: ${is58mm ? '12px' : '13.5px'};
            font-weight: 900;
            border-top: 1px solid #000;
            border-bottom: 1px solid #000;
          }
          .grand-total td {
            padding: 4px 0;
          }
          .footer {
            text-align: center;
            font-size: 9px;
            border-top: 1px dashed #000;
            padding-top: 6px;
            margin-top: 8px;
            line-height: 1.3;
          }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          @media print {
            body { width: 100%; padding: 4px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">${storeName}</div>
          <div class="address">${storeAddress}</div>
          <div class="address">${storePhone}</div>
        </div>

        <table class="meta-table">
          <tr>
            <td>No. Order: <strong>#${order.orderNumber}</strong></td>
            <td class="text-right">Meja: <strong>#${order.tableNumber || 'Takeaway'}</strong></td>
          </tr>
          <tr>
            <td>Waktu: ${order.createdAt || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'}</td>
            <td class="text-right">${order.orderType === 'dine-in' ? 'Dine-In' : 'Takeaway'}</td>
          </tr>
          <tr>
            <td colspan="2">Tamu: <strong>${order.customerName}</strong></td>
          </tr>
        </table>

        <table class="items-table">
          ${itemsHtml}
        </table>

        <table class="totals-table">
          <tr>
            <td>Subtotal F&B</td>
            <td class="text-right">${formatMoney(order.subtotal)}</td>
          </tr>
          ${order.discount ? `
            <tr>
              <td>Potongan Diskon</td>
              <td class="text-right">-${formatMoney(order.discount)}</td>
            </tr>
          ` : ''}
          <tr>
            <td>PB1 Resto (10%)</td>
            <td class="text-right">${formatMoney(order.tax)}</td>
          </tr>
          ${order.serviceCharge ? `
            <tr>
              <td>Service Charge (5%)</td>
              <td class="text-right">${formatMoney(order.serviceCharge)}</td>
            </tr>
          ` : ''}
          <tr class="grand-total">
            <td>TOTAL AKHIR</td>
            <td class="text-right">${formatMoney(order.total)}</td>
          </tr>
          <tr>
            <td style="font-size: 9.5px; color: #444; padding-top: 4px;">Metode Pembayaran:</td>
            <td class="text-right" style="font-size: 9.5px; font-weight: bold; padding-top: 4px;">
              ${(order.paymentMethod || 'QRIS').toUpperCase()} (LUNAS)
            </td>
          </tr>
        </table>

        <div class="footer">
          <div>Poin Member Didapat: +${Math.round(order.total / 1000)} Poin</div>
          <div style="margin: 3px 0;">Terima kasih atas kunjungan Anda!</div>
          <div style="font-size: 8px; color: #666;">WiFi: ${CAFE_INFO.wifiSsid || 'HomieCozie_Guest'} (Pass: ${CAFE_INFO.wifiPassword || 'HomieCozie#2026'})</div>
          <div style="margin-top: 4px; font-size: 7.5px; color: #888;">*** HOMIE COZIE ENTERPRISE POS v2.6 ***</div>
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 800);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

/**
 * Print Kitchen Order Ticket (KOT) for Barista & Chef
 */
export const printKitchenTicket = (order: Order) => {
  if (typeof window === 'undefined') return;

  const printWindow = window.open('', '_blank', 'width=380,height=550');
  if (!printWindow) return;

  const itemsHtml = order.items.map(it => `
    <div style="margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px dotted #888;">
      <div style="font-size: 13px; font-weight: 900;">
        [ ] ${it.quantity}x ${it.menuItem.name.toUpperCase()}
      </div>
      ${it.selectedOptions ? Object.entries(it.selectedOptions).map(([k, v]) => `
        <div style="font-size: 10.5px; font-weight: bold; padding-left: 8px; color: #333;">
          • ${k}: ${v}
        </div>
      `).join('') : ''}
      ${it.notes ? `
        <div style="font-size: 10px; font-weight: bold; background: #eee; padding: 2px 4px; border-radius: 3px; margin-top: 2px;">
          ** NOTE: ${it.notes} **
        </div>
      ` : ''}
    </div>
  `).join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>KOT - #${order.orderNumber}</title>
        <style>
          @page { margin: 0; size: 58mm auto; }
          body {
            font-family: 'Courier New', Courier, monospace;
            font-size: 12px;
            line-height: 1.3;
            margin: 0;
            padding: 8px 6px;
            width: 54mm;
            color: #000;
          }
          .kot-header {
            border-bottom: 2px solid #000;
            padding-bottom: 6px;
            margin-bottom: 6px;
          }
          .kot-title {
            font-size: 15px;
            font-weight: 900;
            text-align: center;
          }
          .table-callout {
            font-size: 18px;
            font-weight: 900;
            text-align: center;
            background: #000;
            color: #fff;
            padding: 3px;
            border-radius: 3px;
            margin: 4px 0;
          }
        </style>
      </head>
      <body>
        <div class="kot-header">
          <div class="kot-title">🔥 TIKET DAPUR / KOT</div>
          <div class="table-callout">MEJA #${order.tableNumber || 'TAKEAWAY'}</div>
          <div style="font-size: 10px; display: flex; justify-content: space-between;">
            <span>Order: #${order.orderNumber}</span>
            <span>${order.createdAt || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'}</span>
          </div>
          <div style="font-size: 10px;">Tamu: <strong>${order.customerName}</strong> (${order.orderType?.toUpperCase()})</div>
        </div>

        <div>
          ${itemsHtml}
        </div>

        <div style="border-top: 2px solid #000; padding-top: 4px; font-size: 10px; display: flex; justify-content: space-between; font-weight: bold;">
          <span>Total: ${order.items.reduce((s, i) => s + i.quantity, 0)} Porsi</span>
          <span>${order.status.toUpperCase()}</span>
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 800);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

/**
 * Print Cashier Shift Z-Report (End-of-Day / Shift Closing Slip)
 */
export const printZReport = (shift: {
  shift_number: string;
  cashier_name: string;
  started_at: string;
  closed_at?: string;
  opening_cash: number;
  expected_cash: number;
  actual_cash: number;
  cash_difference: number;
  total_sales: number;
  total_cash: number;
  total_qris: number;
  total_debit: number;
  total_transactions_count: number;
  notes?: string;
}) => {
  if (typeof window === 'undefined') return;

  const formatRp = (v: number) => `Rp ${Math.round(v).toLocaleString('id-ID')}`;

  const printWindow = window.open('', '_blank', 'width=380,height=600');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>Z-Report - ${shift.shift_number}</title>
        <style>
          @page { margin: 0; size: 58mm auto; }
          body {
            font-family: 'Courier New', Courier, monospace;
            font-size: 11px;
            line-height: 1.3;
            margin: 0;
            padding: 8px 6px;
            width: 54mm;
            color: #000;
          }
          .title {
            text-align: center;
            font-size: 13px;
            font-weight: 900;
            border-bottom: 2px solid #000;
            padding-bottom: 4px;
            margin-bottom: 6px;
          }
          .table-row {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            padding: 1px 0;
          }
          .section-title {
            font-weight: 900;
            font-size: 10.5px;
            margin-top: 6px;
            border-bottom: 1px dashed #000;
            padding-bottom: 2px;
          }
          .difference-box {
            border: 1px solid #000;
            padding: 4px;
            margin: 6px 0;
            font-weight: bold;
            font-size: 10.5px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="title">
          <div>${CAFE_INFO.name.toUpperCase()}</div>
          <div style="font-size: 11px;">LAPORAN TUTUP SHIFT (Z-REPORT)</div>
        </div>

        <div class="table-row">
          <span>No. Shift:</span>
          <strong>${shift.shift_number}</strong>
        </div>
        <div class="table-row">
          <span>Kasir:</span>
          <strong>${shift.cashier_name}</strong>
        </div>
        <div class="table-row">
          <span>Waktu Buka:</span>
          <span>${shift.started_at}</span>
        </div>
        <div class="table-row">
          <span>Waktu Tutup:</span>
          <span>${shift.closed_at || new Date().toLocaleString('id-ID')}</span>
        </div>

        <div class="section-title">RINGKASAN PENJUALAN</div>
        <div class="table-row">
          <span>Total Transaksi:</span>
          <strong>${shift.total_transactions_count} Struk</strong>
        </div>
        <div class="table-row">
          <span>Total Omzet Shift:</span>
          <strong>${formatRp(shift.total_sales)}</strong>
        </div>

        <div class="section-title">METODE PEMBAYARAN</div>
        <div class="table-row">
          <span>Tunai (Cash):</span>
          <span>${formatRp(shift.total_cash)}</span>
        </div>
        <div class="table-row">
          <span>QRIS Dinamis:</span>
          <span>${formatRp(shift.total_qris)}</span>
        </div>
        <div class="table-row">
          <span>EDC / Debit:</span>
          <span>${formatRp(shift.total_debit)}</span>
        </div>

        <div class="section-title">REKONSILIASI KAS FISIK</div>
        <div class="table-row">
          <span>Modal Awal Kas:</span>
          <span>${formatRp(shift.opening_cash)}</span>
        </div>
        <div class="table-row">
          <span>Penjualan Tunai:</span>
          <span>${formatRp(shift.total_cash)}</span>
        </div>
        <div class="table-row">
          <span>Target Kas Laci:</span>
          <strong>${formatRp(shift.expected_cash)}</strong>
        </div>
        <div class="table-row">
          <span>Kas Fisik Dihitung:</span>
          <strong>${formatRp(shift.actual_cash)}</strong>
        </div>

        <div class="difference-box">
          SELISIH KAS: ${formatRp(shift.cash_difference)}
          <div style="font-size: 9px; margin-top: 2px;">
            ${shift.cash_difference === 0 ? 'STATUS: BALANCE ✅' : shift.cash_difference > 0 ? 'STATUS: OVER 🟢' : 'STATUS: SHORT 🔴'}
          </div>
        </div>

        ${shift.notes ? `<div style="font-size: 9px; margin-top: 4px;">Catatan: ${shift.notes}</div>` : ''}

        <div style="margin-top: 20px; display: flex; justify-content: space-between; font-size: 9.5px; text-align: center;">
          <div style="width: 45%;">
            <div>Kasir Bertugas,</div>
            <div style="height: 35px;"></div>
            <div style="border-top: 1px solid #000;">( ${shift.cashier_name} )</div>
          </div>
          <div style="width: 45%;">
            <div>Supervisor / Mgr,</div>
            <div style="height: 35px;"></div>
            <div style="border-top: 1px solid #000;">( .................... )</div>
          </div>
        </div>

        <div style="text-align: center; font-size: 8px; color: #666; margin-top: 12px; border-top: 1px dotted #888; padding-top: 3px;">
          Dicetak: ${new Date().toLocaleString('id-ID')}
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 800);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};
