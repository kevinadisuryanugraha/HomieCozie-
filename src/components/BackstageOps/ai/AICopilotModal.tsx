import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  X, 
  Package, 
  MessageSquare, 
  TrendingUp, 
  RefreshCw, 
  Copy, 
  Check, 
  Send, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { aiCopilotService } from '../../../utils/aiCopilotService';
import { AICopilotInsight, Order, InventoryItem } from '../../../types';
import { DEFAULT_MENU_RECIPES } from '../../../data/recipeData';

interface AICopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  inventory: InventoryItem[];
  totalOmzet: number;
}

export const AICopilotModal: React.FC<AICopilotModalProps> = ({
  isOpen,
  onClose,
  orders,
  inventory,
  totalOmzet
}) => {
  const [activeTab, setActiveTab] = useState<'restock' | 'marketing' | 'digest'>('restock');
  const [loading, setLoading] = useState<boolean>(false);
  const [insight, setInsight] = useState<AICopilotInsight | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Marketing customizer
  const [targetTier, setTargetTier] = useState<'Gold Cozie' | 'Platinum Cozie' | 'All Members'>('Gold Cozie');
  const [discountPct, setDiscountPct] = useState<number>(20);

  const fetchInsight = async (tab: 'restock' | 'marketing' | 'digest') => {
    setLoading(true);
    try {
      if (tab === 'restock') {
        const res = await aiCopilotService.generatePredictiveRestock(orders, inventory, DEFAULT_MENU_RECIPES);
        setInsight(res);
      } else if (tab === 'marketing') {
        const res = await aiCopilotService.generateWhatsAppCampaign(targetTier, 'Weekend Live Music & Diskon Kopi', discountPct);
        setInsight(res);
      } else if (tab === 'digest') {
        const res = await aiCopilotService.generateExecutiveDigest(orders, totalOmzet);
        setInsight(res);
      }
    } catch (err) {
      console.warn('Error fetching insight:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetchInsight(activeTab);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, activeTab, targetTier, discountPct]);

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl border border-[#EAE2D8] w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-[#EAE2D8] bg-gradient-to-r from-amber-500/10 via-rose-500/5 to-transparent flex items-start sm:items-center justify-between gap-3 shrink-0">
            <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-2xl bg-[#1F1A16] text-amber-400 flex items-center justify-center shadow-md shrink-0 mt-0.5 sm:mt-0">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display font-black text-base sm:text-lg text-[#1F1A16] leading-tight">
                    AI Executive Copilot
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-950 border border-amber-300 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-2xs">
                    <Bot className="w-3 h-3 text-[#C84B27]" />
                    <span>Gemini 2.5 Intelligence</span>
                  </span>
                </div>
                <p className="text-xs text-[#5C5248] mt-0.5 leading-relaxed">
                  Asisten cerdas analisis stok prediktif, copywriting marketing & digest omzet
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-[#5C5248] flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 p-2.5 sm:px-6 bg-[#FAF7F2] border-b border-[#EAE2D8] overflow-x-auto scroll-smooth scrollbar-none no-scrollbar w-full min-w-0 shrink-0">
            <button
              onClick={() => setActiveTab('restock')}
              className={`px-3.5 py-2 rounded-xl sm:rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 whitespace-nowrap cursor-pointer ${
                activeTab === 'restock'
                  ? 'bg-[#C84B27] text-white shadow-xs'
                  : 'bg-white text-[#5C5248] hover:bg-stone-100 border border-[#EAE2D8]'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Prediksi Restock Bahan</span>
            </button>

            <button
              onClick={() => setActiveTab('marketing')}
              className={`px-3.5 py-2 rounded-xl sm:rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 whitespace-nowrap cursor-pointer ${
                activeTab === 'marketing'
                  ? 'bg-[#C84B27] text-white shadow-xs'
                  : 'bg-white text-[#5C5248] hover:bg-stone-100 border border-[#EAE2D8]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>AI WhatsApp Campaign</span>
            </button>

            <button
              onClick={() => setActiveTab('digest')}
              className={`px-3.5 py-2 rounded-xl sm:rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 whitespace-nowrap cursor-pointer ${
                activeTab === 'digest'
                  ? 'bg-[#C84B27] text-white shadow-xs'
                  : 'bg-white text-[#5C5248] hover:bg-stone-100 border border-[#EAE2D8]'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Executive Digest Omzet</span>
            </button>

            <button
              onClick={() => fetchInsight(activeTab)}
              disabled={loading}
              className="ml-auto p-2 rounded-xl bg-white hover:bg-stone-100 text-[#5C5248] border border-[#EAE2D8] transition-colors cursor-pointer shrink-0 shadow-2xs"
              title="Generate Ulang Analisis"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#C84B27]' : ''}`} />
            </button>
          </div>

          {/* Content Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 min-h-0">
            {loading ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mx-auto animate-bounce border border-amber-200">
                  <Sparkles className="w-6 h-6 text-[#C84B27]" />
                </div>
                <div className="text-sm font-bold text-[#1F1A16]">AI sedang menganalisis data kafe...</div>
                <p className="text-xs text-[#5C5248]">Memproses tren penjualan, burn rate bahan, dan parameter pelanggan.</p>
              </div>
            ) : insight ? (
              <div className="space-y-5">
                
                {/* 1. Metrics Pill Row */}
                {insight.metrics && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {Object.entries(insight.metrics).map(([key, val], idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8] space-y-1 shadow-2xs">
                        <div className="text-[10px] font-mono font-bold text-[#8C7E72] uppercase tracking-wider">{key}</div>
                        <div className="text-base sm:text-lg font-mono font-black text-[#1F1A16]">{val}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. Insight Title & Confidence */}
                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-50 via-amber-50/60 to-white border border-amber-200/80 space-y-2.5 shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-950 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shadow-2xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Keyakinan Prediksi: <strong>{insight.confidenceScore}%</strong></span>
                    </span>
                    <span className="text-[11px] font-mono text-amber-900 font-medium whitespace-nowrap">{insight.generatedAt}</span>
                  </div>
                  <h4 className="font-display font-black text-sm sm:text-base text-[#1F1A16] leading-snug">
                    {insight.title}
                  </h4>
                </div>

                {/* 3. Tab Specific Details */}
                {activeTab === 'marketing' && (
                  <div className="space-y-3">
                    {/* Customizer Filters */}
                    <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#5C5248]">Target:</span>
                        <select
                          value={targetTier}
                          onChange={(e) => setTargetTier(e.target.value as any)}
                          className="px-2.5 py-1 rounded-xl bg-white border border-[#EAE2D8] text-xs font-bold text-[#1F1A16] focus:outline-none"
                        >
                          <option value="Gold Cozie">Gold Cozie (142 Member)</option>
                          <option value="Platinum Cozie">Platinum Cozie (38 Member)</option>
                          <option value="All Members">Semua Member (280 Member)</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#5C5248]">Diskon:</span>
                        <select
                          value={discountPct}
                          onChange={(e) => setDiscountPct(Number(e.target.value))}
                          className="px-2.5 py-1 rounded-xl bg-white border border-[#EAE2D8] text-xs font-bold text-[#1F1A16] focus:outline-none"
                        >
                          <option value={15}>15% Off</option>
                          <option value={20}>20% Off</option>
                          <option value={25}>25% Off</option>
                        </select>
                      </div>
                    </div>

                    {/* Realistic WhatsApp Chat Balloon */}
                    <div className="p-4 sm:p-5 rounded-3xl bg-[#EFEAE2] border border-[#D9D0C5] space-y-3 shadow-xs">
                      <div className="text-[10px] font-mono font-bold text-[#8C7E72] uppercase flex items-center justify-between">
                        <span>Pratinjau Pesan WhatsApp</span>
                        <button
                          onClick={() => handleCopyText(insight.summary)}
                          className="flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-bold cursor-pointer transition-colors"
                        >
                          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
                        </button>
                      </div>

                      <div className="p-4 rounded-2xl bg-white text-[#1F1A16] text-xs leading-relaxed font-sans whitespace-pre-line shadow-xs border border-emerald-100">
                        {insight.summary}
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(insight.summary)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Kirim via WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Detailed Key Points List */}
                <div className="space-y-2.5">
                  <div className="text-xs font-mono font-bold text-[#5C5248] uppercase tracking-wider">Poin Rekomendasi Tindakan:</div>
                  <div className="space-y-2">
                    {insight.detailedPoints.map((pt, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8] flex items-start gap-3 text-xs text-[#1F1A16] hover:bg-[#FAF7F2]/90 transition-colors shadow-2xs">
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-950 border border-amber-300 font-mono font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed flex-1">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="p-4 sm:p-5 rounded-3xl bg-[#1F1A16] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 shadow-lg border border-stone-800">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">Saran Aksi Operasional</div>
                    <div className="text-xs sm:text-sm text-stone-200 font-medium leading-snug">{insight.recommendedAction}</div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl sm:rounded-2xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs active:scale-95 transition-all text-center"
                  >
                    Terapkan Aksi
                  </button>
                </div>

              </div>
            ) : null}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
