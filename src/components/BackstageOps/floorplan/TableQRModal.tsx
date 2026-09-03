import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  QrCode, 
  Printer, 
  X, 
  Download, 
  Wifi, 
  Sparkles, 
  Coffee, 
  Check, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { TableItem } from '../../../types';
import { CAFE_INFO } from '../../../data/mockData';

interface TableQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  tables: TableItem[];
  selectedTable?: TableItem | null;
}

export const TableQRModal: React.FC<TableQRModalProps> = ({
  isOpen,
  onClose,
  tables,
  selectedTable
}) => {
  const [activeTab, setActiveTab] = useState<'single' | 'all'>('single');
  const [activeTableNumber, setActiveTableNumber] = useState<string>(
    selectedTable ? selectedTable.tableNumber : tables[0]?.tableNumber || '01'
  );

  if (!isOpen) return null;

  const currentTable = tables.find(t => t.tableNumber === activeTableNumber) || tables[0];
  const hostUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

  const getTableUrl = (tbl: TableItem) => `${hostUrl}/#menu?table=${tbl.tableNumber}&area=${tbl.area}`;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      alert('Harap izinkan popup browser untuk mencetak kartu QR meja.');
      return;
    }

    const tablesToPrint = activeTab === 'single' ? [currentTable] : tables;

    const cardsHtml = tablesToPrint.map(tbl => `
      <div class="qr-card">
        <div class="cafe-brand">${CAFE_INFO.name.toUpperCase()}</div>
        <div class="cafe-sub">COFFEE • KITCHEN • COMMUNITY</div>
        <div class="table-badge">
          <div class="table-label">NOMOR MEJA</div>
          <div class="table-number">#${tbl.tableNumber}</div>
          <div class="area-text">Area: ${tbl.areaLabel || tbl.area.toUpperCase()}</div>
        </div>
        <div class="qr-wrapper">
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(getTableUrl(tbl))}"
            alt="QR Code Meja ${tbl.tableNumber}"
            class="qr-img"
          />
          <div class="scan-hint">SCAN UNTUK PESAN DARI MEJA</div>
        </div>
        <div class="steps-box">
          <div class="steps-title">Cara Pemesanan Mandiri:</div>
          <ol class="steps-list">
            <li>Buka Kamera HP & Scan QR Code</li>
            <li>Pilih menu makanan & minuman favorit</li>
            <li>Bayar via QRIS & pesanan langsung diantar</li>
          </ol>
        </div>
        <div class="wifi-box">
          <div>Wi-Fi: <strong>${CAFE_INFO.wifiSsid || 'HomieCozie_Guest'}</strong></div>
          <div>Pass: <strong>${CAFE_INFO.wifiPassword || 'HomieCozie#2026'}</strong></div>
        </div>
      </div>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="id">
        <head>
          <meta charset="UTF-8">
          <title>Cetak Kartu QR Meja - ${CAFE_INFO.name}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            * {
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 0;
              background: #fff;
              color: #1F1A16;
            }
            .grid-container {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 16px;
              page-break-inside: avoid;
            }
            .qr-card {
              border: 2px solid #1F1A16;
              border-radius: 16px;
              padding: 16px;
              text-align: center;
              background: #fff;
              page-break-inside: avoid;
              margin-bottom: 12px;
            }
            .cafe-brand {
              font-size: 15px;
              font-weight: 900;
              letter-spacing: 0.5px;
            }
            .cafe-sub {
              font-size: 8.5px;
              color: #5C5248;
              letter-spacing: 1px;
              margin-top: 1px;
            }
            .table-badge {
              background: #FAF7F2;
              border: 1px solid #EAE2D8;
              border-radius: 10px;
              padding: 6px 12px;
              display: inline-block;
              margin: 8px auto;
            }
            .table-label {
              font-size: 8.5px;
              color: #5C5248;
              font-weight: 700;
            }
            .table-number {
              font-size: 24px;
              font-weight: 900;
              color: #C84B27;
              line-height: 1.1;
            }
            .area-text {
              font-size: 9px;
              color: #5C5248;
              font-weight: 600;
            }
            .qr-wrapper {
              margin: 6px 0;
            }
            .qr-img {
              width: 130px;
              height: 130px;
              display: block;
              margin: 0 auto;
            }
            .scan-hint {
              font-size: 8.5px;
              font-family: monospace;
              color: #5C5248;
              margin-top: 3px;
              font-weight: bold;
            }
            .steps-box {
              background: #FAF7F2;
              border: 1px solid #EAE2D8;
              border-radius: 8px;
              padding: 6px 10px;
              text-align: left;
              font-size: 8.5px;
              margin: 6px 0;
            }
            .steps-title {
              font-weight: bold;
              color: #1F1A16;
              margin-bottom: 2px;
            }
            .steps-list {
              margin: 0;
              padding-left: 14px;
              color: #5C5248;
              line-height: 1.35;
            }
            .wifi-box {
              border-top: 1px dashed #CCC;
              padding-top: 6px;
              display: flex;
              justify-content: space-between;
              font-size: 8.5px;
              font-family: monospace;
              color: #333;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="grid-container">
            ${cardsHtml}
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl border border-[#EAE2D8] w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#EAE2D8] flex items-center justify-between gap-3 bg-[#FAF7F2]">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0 shadow-xs">
                <QrCode className="w-5 h-5 text-[#C84B27]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-black text-sm sm:text-base text-[#1F1A16] truncate">
                    Generator QR Akrilik Meja
                  </h3>
                  <span className="hidden sm:inline-block px-2 py-0.2 rounded-full text-[9px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 uppercase">
                    Table Tent
                  </span>
                </div>
                <p className="text-[11px] text-[#5C5248] truncate">
                  Cetak kartu akrilik meja untuk pemesanan mandiri & pembayaran QRIS
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white hover:bg-stone-200 border border-[#EAE2D8] text-[#5C5248] hover:text-[#1F1A16] flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Tabs & Format Controls */}
          <div className="px-4 sm:px-5 py-3 border-b border-[#EAE2D8] bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-2xl border border-[#EAE2D8] shrink-0">
              <button
                onClick={() => setActiveTab('single')}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer text-xs ${
                  activeTab === 'single' ? 'bg-[#C84B27] text-white shadow-xs' : 'text-[#5C5248] hover:text-[#1F1A16]'
                }`}
              >
                Pratinjau Meja #{currentTable.tableNumber}
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs ${
                  activeTab === 'all' ? 'bg-[#C84B27] text-white shadow-xs' : 'text-[#5C5248] hover:text-[#1F1A16]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Cetak Semua ({tables.length})</span>
              </button>
            </div>

            {activeTab === 'single' && (
              <div className="flex items-center gap-2 min-w-0 flex-1 sm:justify-end">
                <span className="font-bold text-[#5C5248] text-xs shrink-0">Pilih Meja:</span>
                <select
                  value={activeTableNumber}
                  onChange={(e) => setActiveTableNumber(e.target.value)}
                  className="w-full sm:w-auto max-w-xs px-3 py-1.5 rounded-xl border border-[#EAE2D8] bg-[#FAF7F2] font-bold text-xs text-[#1F1A16] cursor-pointer focus:outline-none focus:border-[#C84B27] shadow-2xs truncate"
                >
                  {tables.map(t => (
                    <option key={t.id} value={t.tableNumber}>
                      Meja #{t.tableNumber} ({t.name} - {t.area})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Preview Container (Scrollable, never clips top) */}
          <div className="p-4 sm:p-6 overflow-y-auto bg-stone-100 flex-1 flex flex-col items-center justify-start scrollbar-none">
            {activeTab === 'single' ? (
              /* Single Table Card Preview */
              <div className="w-full max-w-xs sm:max-w-sm bg-white rounded-3xl p-5 sm:p-6 border-2 border-stone-800 shadow-xl space-y-3.5 text-center my-auto shrink-0">
                {/* Cafe Header */}
                <div className="space-y-1">
                  <div className="inline-flex items-center justify-center w-9 h-9 rounded-2xl bg-[#C84B27] text-white mx-auto shadow-md">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <h4 className="font-display font-black text-base sm:text-lg text-[#1F1A16] tracking-tight">
                    {CAFE_INFO.name.toUpperCase()}
                  </h4>
                  <p className="text-[10px] text-[#5C5248] uppercase font-mono tracking-wider">
                    Coffee • Kitchen • Community
                  </p>
                </div>

                {/* Table Number Badge */}
                <div className="py-2 px-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8] inline-block">
                  <span className="text-[10px] text-[#5C5248] block font-bold uppercase tracking-wider">NOMOR MEJA</span>
                  <span className="font-display font-black text-2xl sm:text-3xl text-[#C84B27] leading-tight block">
                    #{currentTable.tableNumber}
                  </span>
                  <span className="text-[10px] text-[#5C5248] block font-medium mt-0.5">
                    Area: {currentTable.areaLabel || currentTable.area.toUpperCase()}
                  </span>
                </div>

                {/* QR Code */}
                <div className="bg-white p-3 rounded-2xl border-2 border-dashed border-stone-300 inline-block mx-auto shadow-xs">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(getTableUrl(currentTable))}`}
                    alt={`QR Code Meja ${currentTable.tableNumber}`}
                    className="w-36 h-36 sm:w-40 sm:h-40 object-contain mx-auto"
                  />
                  <span className="text-[10px] font-mono font-bold text-[#5C5248] block mt-1.5 uppercase tracking-wider">
                    SCAN UNTUK BUKA MENU
                  </span>
                </div>

                {/* 3 Step Guide */}
                <div className="text-left bg-[#FAF7F2] p-3 rounded-2xl border border-[#EAE2D8] text-[11px] space-y-1 text-[#5C5248]">
                  <div className="flex items-center gap-1.5 font-bold text-[#1F1A16]">
                    <Sparkles className="w-3.5 h-3.5 text-[#C84B27]" />
                    <span>Cara Pemesanan Mandiri:</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-0.5 text-[10px] leading-relaxed pl-0.5">
                    <li>Arahkan kamera HP ke QR Code</li>
                    <li>Pilih menu & kustomisasi pesanan Anda</li>
                    <li>Bayar QRIS instan & pesanan diantar ke meja</li>
                  </ol>
                </div>

                {/* Wi-Fi Info */}
                <div className="flex items-center justify-between text-[10px] pt-2 border-t border-stone-200 text-stone-600 font-mono">
                  <div className="flex items-center gap-1">
                    <Wifi className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Wi-Fi: <strong>{CAFE_INFO.wifiSsid || 'HomieCozie_Guest'}</strong></span>
                  </div>
                  <span>Pass: <strong>{CAFE_INFO.wifiPassword || 'HomieCozie#2026'}</strong></span>
                </div>
              </div>
            ) : (
              /* Batch Grid Preview */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
                {tables.map(t => (
                  <div key={t.id} className="bg-white p-4 rounded-2xl border border-stone-400 shadow-xs text-center space-y-2">
                    <div className="font-display font-black text-base text-[#1F1A16]">
                      {CAFE_INFO.name}
                    </div>
                    <div className="font-black text-2xl text-[#C84B27]">
                      MEJA #{t.tableNumber}
                    </div>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(getTableUrl(t))}`}
                      alt={`QR Code Meja ${t.tableNumber}`}
                      className="w-28 h-28 mx-auto object-contain"
                    />
                    <div className="text-[10px] font-mono text-[#5C5248]">
                      {t.areaLabel || t.area.toUpperCase()} • Wi-Fi: {CAFE_INFO.wifiSsid || 'HomieCozie_Guest'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-3.5 sm:p-5 border-t border-[#EAE2D8] bg-white flex items-center justify-between gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-[#FAF7F2] hover:bg-stone-200 text-[#5C5248] hover:text-[#1F1A16] font-bold text-xs transition-colors border border-[#EAE2D8] cursor-pointer"
            >
              Tutup
            </button>

            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-5 sm:px-6 py-2.5 rounded-2xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>
                {activeTab === 'single' ? `Cetak QR (Meja #${currentTable.tableNumber})` : `Cetak Seluruh ${tables.length} Meja`}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
