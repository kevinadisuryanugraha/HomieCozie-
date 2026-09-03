import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scan, 
  Camera, 
  Barcode, 
  CheckCircle2, 
  Plus, 
  X, 
  RefreshCw, 
  Package,
  Sparkles
} from 'lucide-react';
import { triggerConfetti } from "../../../utils/confettiHelper";
import { InventoryItem } from '../../../types';
import { soundService } from '../../../utils/audioChime';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryItems: InventoryItem[];
  onRestockItem: (itemId: string, addedQty: number) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  inventoryItems,
  onRestockItem
}) => {
  const [scannedCode, setScannedCode] = useState<string>('');
  const [matchedItem, setMatchedItem] = useState<InventoryItem | null>(null);
  const [restockQty, setRestockQty] = useState<number>(10);
  const [isScanningActive, setIsScanningActive] = useState<boolean>(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Hardware USB Barcode Scanner input listener
  useEffect(() => {
    if (!isOpen) return;

    let buffer = '';
    let lastKeyTime = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentTime = Date.now();

      // USB barcode scanners type very rapidly (< 50ms per key)
      if (currentTime - lastKeyTime > 100) {
        buffer = '';
      }
      lastKeyTime = currentTime;

      if (e.key === 'Enter') {
        if (buffer.length > 2) {
          handleLookupBarcode(buffer);
          buffer = '';
        }
      } else if (e.key.length === 1) {
        buffer += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, inventoryItems]);

  const handleLookupBarcode = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    setScannedCode(trimmed);

    // Match by SKU or ID or keyword
    const found = inventoryItems.find(
      it => it.sku?.toUpperCase() === trimmed || it.id.toUpperCase() === trimmed || it.name.toUpperCase().includes(trimmed)
    ) || inventoryItems[0];

    setMatchedItem(found);
    soundService.playNewOrderChime();
  };

  const handleConfirmRestock = () => {
    if (!matchedItem) return;

    onRestockItem(matchedItem.id, restockQty);
    soundService.playCashRegisterSound();
    try {
      triggerConfetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch {}

    setSuccessMessage(`Berhasil restock +${restockQty} ${matchedItem.unit} untuk ${matchedItem.name}!`);
    setTimeout(() => {
      setSuccessMessage(null);
      setMatchedItem(null);
      setScannedCode('');
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl border border-[#EAE2D8] w-full max-w-md overflow-hidden flex flex-col my-auto"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#EAE2D8] bg-[#FAF7F2] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200 text-[#B23812] flex items-center justify-center shadow-xs">
                <Scan className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-black text-base text-[#1F1A16]">
                  Scanner Barcode Restock Gudang
                </h3>
                <p className="text-xs text-[#5C5248]">
                  Scan barcode kemasan atau gunakan scanner USB kasir
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-stone-200 text-[#5C5248] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 space-y-4">
            {successMessage ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-sm text-emerald-950">{successMessage}</h4>
                <p className="text-xs text-[#5C5248]">Siap memindai item bahan baku berikutnya...</p>
              </div>
            ) : matchedItem ? (
              /* Matched Item Restock Form */
              <div className="space-y-4 bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE2D8]">
                <div className="flex items-center justify-between border-b border-[#EAE2D8] pb-2">
                  <span className="text-[10px] font-mono text-emerald-900 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                    ITEM TERDETEKSI ✅
                  </span>
                  <span className="font-mono text-xs text-[#5C5248]">{matchedItem.sku}</span>
                </div>

                <div>
                  <h4 className="font-display font-black text-base text-[#1F1A16]">{matchedItem.name}</h4>
                  <p className="text-xs text-[#5C5248] mt-0.5">
                    Stok Saat Ini: <strong>{matchedItem.currentStock} {matchedItem.unit}</strong> (Min: {matchedItem.minStock} {matchedItem.unit})
                  </p>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-[11px] font-bold text-[#1F1A16] block">
                    Jumlah Barang Masuk (+ Restock):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={restockQty}
                      onChange={(e) => setRestockQty(parseFloat(e.target.value) || 1)}
                      className="flex-1 p-2.5 rounded-xl bg-white border border-[#EAE2D8] font-mono font-bold text-sm text-[#B23812]"
                    />
                    <span className="font-mono font-bold text-xs text-[#5C5248] px-2">{matchedItem.unit}</span>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {[5, 10, 20, 50].map((qty) => (
                      <button
                        key={qty}
                        onClick={() => setRestockQty(qty)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer ${
                          restockQty === qty ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-[#EAE2D8] text-[#5C5248]'
                        }`}
                      >
                        +{qty}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => setMatchedItem(null)}
                    className="py-2.5 rounded-xl bg-white border border-[#EAE2D8] text-xs font-bold text-[#5C5248] cursor-pointer"
                  >
                    Scan Ulang
                  </button>
                  <button
                    onClick={handleConfirmRestock}
                    className="py-2.5 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Konfirmasi Masuk</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Scanning Viewfinder */
              <>
                <div className="relative w-full h-52 bg-stone-900 rounded-2xl overflow-hidden border-2 border-stone-700 flex flex-col items-center justify-center p-4 text-center">
                  {/* Laser Scanning Beam */}
                  <motion.div
                    animate={{ y: [-70, 70, -70] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_12px_#f43f5e]"
                  />

                  <Barcode className="w-16 h-16 text-stone-500 mb-2 opacity-60" />
                  <span className="text-xs font-mono text-stone-300 font-bold">
                    Arahkan Barcode ke Kamera
                  </span>
                  <span className="text-[10px] text-stone-500 mt-1">
                    atau ketik SKU / scan barcode fisik
                  </span>
                </div>

                {/* Manual SKU Input */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-bold text-[#5C5248] block">
                    Atau Masukkan SKU / Nama Bahan Manual:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Contoh: SKU-COF-01 atau Arabika..."
                      value={scannedCode}
                      onChange={(e) => setScannedCode(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLookupBarcode(scannedCode)}
                      className="flex-1 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] text-xs font-bold text-[#1F1A16]"
                    />
                    <button
                      onClick={() => handleLookupBarcode(scannedCode || 'SKU-COF-01')}
                      className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold cursor-pointer"
                    >
                      Cari
                    </button>
                  </div>
                </div>

                {/* Quick Test Barcode Pills */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-[#5C5248] block">Simulasi Barcode Cepat:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {inventoryItems.slice(0, 4).map((it) => (
                      <button
                        key={it.id}
                        onClick={() => handleLookupBarcode(it.sku || it.name)}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 border border-[#EAE2D8] text-[10px] font-mono text-[#1F1A16] cursor-pointer"
                      >
                        {it.sku || it.name}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
