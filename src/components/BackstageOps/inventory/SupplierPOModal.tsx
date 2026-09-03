import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Send, 
  Copy, 
  Check, 
  X, 
  Calendar, 
  Truck, 
  AlertCircle, 
  Plus, 
  Trash2, 
  FileText,
  Sparkles
} from 'lucide-react';
import { api } from '../../../services/api';
import { InventoryItem } from '../../../types';

interface SupplierPOModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryItems: InventoryItem[];
}

export const SupplierPOModal: React.FC<SupplierPOModalProps> = ({
  isOpen,
  onClose,
  inventoryItems
}) => {
  const [supplierName, setSupplierName] = useState<string>('CV Berkah F&B Supplier');
  const [supplierPhone, setSupplierPhone] = useState<string>('+6281234567890');
  const [deliveryDate, setDeliveryDate] = useState<string>('Besok Pagi (Pukul 09:00 WIB)');
  const [poItems, setPoItems] = useState<Array<{ name: string; quantity: number; unit: string; unit_price: number }>>([]);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [generatedResult, setGeneratedResult] = useState<any>(null);

  const formatRp = (v: number) => `Rp ${Math.round(v).toLocaleString('id-ID')}`;

  useEffect(() => {
    if (!isOpen) return;

    // Filter items that need restock
    const needsRestock = inventoryItems
      .filter(it => it.currentStock <= it.minStock * 1.5)
      .map(it => ({
        name: it.name,
        quantity: Math.max(5, Math.round(it.minStock * 2.5 - it.currentStock)),
        unit: it.unit,
        unit_price: it.unit === 'kg' ? 120000 : it.unit === 'liter' ? 22000 : 45000,
      }));

    if (needsRestock.length > 0) {
      setPoItems(needsRestock);
    } else {
      setPoItems([
        { name: 'Biji Kopi Arabika House Blend', quantity: 15, unit: 'kg', unit_price: 150000 },
        { name: 'Susu Segar Pasteurisasi (Fresh Milk)', quantity: 30, unit: 'liter', unit_price: 22000 },
        { name: 'Gula Aren Cair Organik', quantity: 10, unit: 'liter', unit_price: 35000 },
      ]);
    }
  }, [isOpen, inventoryItems]);

  const totalEstimatedCost = poItems.reduce((acc, it) => acc + it.quantity * it.unit_price, 0);

  const handleGenerateAndSend = async () => {
    try {
      const res = await api.inventory.generatePO({
        items: poItems,
        supplier_name: supplierName,
        supplier_phone: supplierPhone,
        delivery_date: deliveryDate,
      });

      if (res?.data) {
        setGeneratedResult(res.data);
        if (res.data.whatsapp_url) {
          window.open(res.data.whatsapp_url, '_blank');
        }
      }
    } catch {
      // Local fallback
      const poNum = `PO-HC-${Date.now().toString().slice(-6)}`;
      let msg = `📦 *SURAT PESANAN BAHAN BAKU (PURCHASE ORDER)* 📦\n`
        + `No. PO: *${poNum}*\n`
        + `Toko: *Homie Cozie Coffee & Kitchen*\n`
        + `----------------------------------------\n`
        + `Kepada Yth: *${supplierName}*\n`
        + `Tgl Kirim: *${deliveryDate}*\n\n`
        + `Daftar Item:\n`;
      poItems.forEach((it, idx) => {
        msg += `${idx + 1}. ${it.name}: *${it.quantity} ${it.unit}*\n`;
      });
      msg += `\nEstimasi Total: *${formatRp(totalEstimatedCost)}*\n`
        + `----------------------------------------\n`
        + `Mohon konfirmasi kesediaan pesanan. Terima kasih! 🙏☕`;

      setGeneratedResult({
        po_number: poNum,
        whatsapp_text: msg,
        whatsapp_url: `https://wa.me/${supplierPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`
      });
      window.open(`https://wa.me/${supplierPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };

  const handleCopyText = () => {
    if (generatedResult?.whatsapp_text) {
      navigator.clipboard.writeText(generatedResult.whatsapp_text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl border border-[#EAE2D8] w-full max-w-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#EAE2D8] bg-[#FAF7F2] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center shadow-xs">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-black text-base sm:text-lg text-[#1F1A16]">
                  Purchase Order (PO) Bahan Baku Supplier
                </h3>
                <p className="text-xs text-[#5C5248]">
                  Buat surat pesanan stok resmi dan kirim langsung via WhatsApp ke vendor
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

          {/* Form Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
            {/* Vendor Details Form */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#5C5248] block mb-1">Nama Supplier / Vendor:</label>
                <input
                  type="text"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] text-xs font-bold text-[#1F1A16]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#5C5248] block mb-1">No. WhatsApp Vendor:</label>
                <input
                  type="text"
                  value={supplierPhone}
                  onChange={(e) => setSupplierPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] text-xs font-mono font-bold text-[#1F1A16]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#5C5248] block mb-1">Tgl Pengiriman Diharapkan:</label>
                <input
                  type="text"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] text-xs font-bold text-[#1F1A16]"
                />
              </div>
            </div>

            {/* PO Line Items */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1F1A16]">Item Bahan Baku yang Dipesan:</span>
                <span className="text-[11px] text-[#5C5248] font-mono font-bold">
                  Estimasi Total: <strong className="text-[#C84B27]">{formatRp(totalEstimatedCost)}</strong>
                </span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {poItems.map((it, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8] flex items-center justify-between gap-3 text-xs">
                    <div className="flex-1">
                      <span className="font-bold text-[#1F1A16] block">{it.name}</span>
                      <span className="text-[10px] text-[#5C5248] font-mono">
                        Estimasi @ {formatRp(it.unit_price)} / {it.unit}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={it.quantity}
                        onChange={(e) => {
                          const next = [...poItems];
                          next[idx].quantity = parseFloat(e.target.value) || 1;
                          setPoItems(next);
                        }}
                        className="w-16 p-1.5 text-center font-mono font-bold bg-white border border-[#EAE2D8] rounded-xl"
                      />
                      <span className="font-mono text-[11px] text-[#5C5248] w-8">{it.unit}</span>
                      <span className="font-mono font-bold text-[#C84B27] w-24 text-right">
                        {formatRp(it.quantity * it.unit_price)}
                      </span>
                      <button
                        onClick={() => setPoItems(poItems.filter((_, i) => i !== idx))}
                        className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Generated WhatsApp Text Preview */}
            {generatedResult && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span>Pratinjau Pesan WhatsApp Terkirim:</span>
                  <button
                    onClick={handleCopyText}
                    className="flex items-center gap-1 text-[11px] text-emerald-800 hover:underline cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3 text-emerald-700" />}
                    <span>{isCopied ? 'Tersalin' : 'Salin Teks'}</span>
                  </button>
                </div>
                <pre className="text-[11px] font-mono text-emerald-950 whitespace-pre-wrap bg-white/70 p-3 rounded-xl max-h-32 overflow-y-auto">
                  {generatedResult.whatsapp_text}
                </pre>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 border-t border-[#EAE2D8] bg-[#FAF7F2] flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 font-bold text-xs border border-[#EAE2D8] cursor-pointer"
            >
              Tutup
            </button>

            <button
              onClick={handleGenerateAndSend}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Generate & Kirim PO via WhatsApp</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
