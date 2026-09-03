import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  Database, 
  Sliders, 
  Mic, 
  MicOff, 
  ChevronDown, 
  ChevronRight, 
  Search, 
  MessageSquare, 
  Key, 
  Globe, 
  ShieldCheck, 
  TrendingUp, 
  Package, 
  Coffee, 
  Layers, 
  X, 
  CheckCircle2, 
  AlertCircle,
  BrainCircuit,
  CornerDownLeft,
  Share2,
  ExternalLink,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  aiAgentService, 
  AI_MODELS_CATALOG, 
  AIModelOption, 
  AIChatSession, 
  AIChatMessage, 
  AIProviderId, 
  AIProviderConfig 
} from '../../../services/aiAgentService';
import { useAppStore } from '../../../store/useAppStore';

export const AIChatAgentView: React.FC = () => {
  const storeState = useAppStore();
  const { currentSystemUser, showToast } = storeState;

  // Session & Message States
  const [sessions, setSessions] = useState<AIChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState<boolean>(false);

  // Settings & Configuration Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [configs, setConfigs] = useState<Record<AIProviderId, AIProviderConfig>>(aiAgentService.getConfigs());
  const [activeConfigTab, setActiveConfigTab] = useState<AIProviderId>('gemini');
  const [showApiKeyMap, setShowApiKeyMap] = useState<Record<string, boolean>>({});

  // Renaming Session State
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState<string>('');

  // UI Interactive States
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<string | null>(null);
  const [expandedThinkingMap, setExpandedThinkingMap] = useState<Record<string, boolean>>({});
  const [isListeningVoice, setIsListeningVoice] = useState<boolean>(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState<boolean>(false);
  const [showContextPreview, setShowContextPreview] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load Sessions & Active Session on mount
  useEffect(() => {
    const loadedSessions = aiAgentService.getSessions();
    setSessions(loadedSessions);
    const activeId = aiAgentService.getActiveSession()?.id || loadedSessions[0]?.id || '';
    setActiveSessionId(activeId);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, activeSessionId, isLoading]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const activeModel = AI_MODELS_CATALOG.find(m => m.id === activeSession?.modelId) || AI_MODELS_CATALOG[0];

  // =========================================================================
  // HANDLERS
  // =========================================================================

  const handleCreateNewSession = () => {
    const newSession = aiAgentService.createSession({
      title: 'Percakapan Baru',
      providerId: activeModel.provider,
      modelId: activeModel.id,
      contextEnabled: true
    });
    setSessions(aiAgentService.getSessions());
    setActiveSessionId(newSession.id);
    setIsSidebarOpenMobile(false);
    if (textareaRef.current) textareaRef.current.focus();
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    aiAgentService.setActiveSessionId(id);
    setIsSidebarOpenMobile(false);
  };

  const handleDeleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    aiAgentService.deleteSession(id);
    const updated = aiAgentService.getSessions();
    setSessions(updated);
    setActiveSessionId(aiAgentService.getActiveSession()?.id || updated[0]?.id || '');
    showToast('✓ Sesi percakapan berhasil dihapus');
  };

  const handleStartRename = (e: React.MouseEvent, s: AIChatSession) => {
    e.stopPropagation();
    setEditingSessionId(s.id);
    setEditTitleText(s.title);
  };

  const handleSaveRename = (id: string) => {
    if (editTitleText.trim()) {
      aiAgentService.updateSession(id, { title: editTitleText.trim() });
      setSessions(aiAgentService.getSessions());
    }
    setEditingSessionId(null);
  };

  const handleToggleContext = () => {
    if (!activeSession) return;
    const nextVal = !activeSession.contextEnabled;
    aiAgentService.updateSession(activeSession.id, { contextEnabled: nextVal });
    setSessions(aiAgentService.getSessions());
    showToast(nextVal ? '🟢 Data Kafe Real-Time Diaktifkan (Live RAG)' : '⚪ Mode Umum Diaktifkan');
  };

  const handleSelectModel = (model: AIModelOption) => {
    if (!activeSession) return;
    aiAgentService.updateSession(activeSession.id, {
      modelId: model.id,
      providerId: model.provider
    });
    setSessions(aiAgentService.getSessions());
    setIsModelDropdownOpen(false);
    showToast(`✓ Model dialihkan ke ${model.name}`);
  };

  const handleSendMessage = async (promptToSend?: string) => {
    const text = promptToSend || inputPrompt;
    if (!text.trim() || !activeSession || isLoading) return;

    setInputPrompt('');
    setIsLoading(true);

    try {
      await aiAgentService.sendMessage({
        sessionId: activeSession.id,
        prompt: text.trim(),
        appState: storeState
      });
      setSessions(aiAgentService.getSessions());
    } catch (err: any) {
      showToast(`⚠️ Gagal mengirim pesan: ${err.message}`);
    } finally {
      setIsLoading(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
    showToast('✓ Teks respon AI disalin ke clipboard');
  };

  const handleCopyCode = (codeKey: string, codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeIdx(codeKey);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
    showToast('✓ Kode berhasil disalin');
  };

  const handleExportSession = () => {
    if (!activeSession) return;
    const lines = [
      `# ${activeSession.title}`,
      `Tanggal: ${new Date(activeSession.createdAt).toLocaleString('id-ID')} WIB`,
      `Model AI: ${activeSession.modelId} (${activeSession.providerId})`,
      `Data Kafe Terhubung: ${activeSession.contextEnabled ? 'Ya' : 'Tidak'}`,
      `----------------------------------------\n`,
      ...activeSession.messages.map(m => {
        const header = m.role === 'user' ? `### 👤 Anda (${m.timestamp})` : `### 🤖 AI Assistant (${m.modelUsed || activeSession.modelId} - ${m.timestamp})`;
        const thinking = m.thinkingContent ? `\n> **Proses Berpikir (Reasoning):**\n> ${m.thinkingContent.replace(/\n/g, '\n> ')}\n` : '';
        return `${header}\n${thinking}\n${m.content}\n\n---\n`;
      })
    ].join('\n');

    const blob = new Blob([lines], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `homie-cozie-ai-${activeSession.id}.md`;
    link.click();
    showToast('✓ Transkrip percakapan berhasil diunduh (.md)');
  };

  const handleSaveConfigs = () => {
    aiAgentService.saveConfigs(configs);
    setIsSettingsOpen(false);
    showToast('✓ Pengaturan API Key & Model berhasil disimpan!');
  };

  // Voice Input (Web Speech API)
  const handleToggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      showToast('⚠️ Browser Anda tidak mendukung Web Speech API');
      return;
    }

    if (isListeningVoice) {
      setIsListeningVoice(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'id-ID';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListeningVoice(true);
        showToast('🎙️ Mendengarkan suara Anda... (Bahasa Indonesia)');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputPrompt(prev => (prev ? prev + ' ' + transcript : transcript));
        setIsListeningVoice(false);
      };

      recognition.onerror = () => {
        setIsListeningVoice(false);
      };

      recognition.onend = () => {
        setIsListeningVoice(false);
      };

      recognition.start();
    } catch {
      setIsListeningVoice(false);
    }
  };

  // Quick Starter Prompt Cards
  const QUICK_PROMPT_CARDS = [
    {
      title: 'Audit Omzet & Laba Bersih',
      subtitle: 'Analisis profitabilitas, HPP resep BOM & PB1 10%',
      icon: TrendingUp,
      prompt: 'Bagaimana rincian omzet, estimasi HPP, dan proyeksi laba bersih restoran hari ini?',
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-900'
    },
    {
      title: 'Peringatan Stok Gudang Kritis',
      subtitle: 'Bahan baku yang menipis & rekomendasi PO restock',
      icon: Package,
      prompt: 'Bahan baku apa saja yang kritis atau mendekati batas minimum stok di gudang saat ini?',
      color: 'from-rose-500/20 to-pink-500/20 border-rose-500/40 text-rose-900'
    },
    {
      title: 'Strategi Promo Bundling Weekend',
      subtitle: 'Ide racikan menu kombo untuk dongkrak basket size',
      icon: Sparkles,
      prompt: 'Buatkan 2 rekomendasi paket bundling menu kopi dan makanan untuk mendongkrak penjualan akhir pekan ini beserta estimasi marginnya.',
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-900'
    },
    {
      title: 'SOP Barista & SLA Dapur KDS',
      subtitle: 'Standar kalibrasi espresso dan target waktu saji',
      icon: Coffee,
      prompt: 'Tuliskan panduan SOP kalibrasi espresso untuk barista dan standar SLA waktu penyajian KDS dapur.',
      color: 'from-sky-500/20 to-indigo-500/20 border-sky-500/40 text-sky-900'
    }
  ];

  // Helper for inline markdown elements (bold, italic, inline code)
  const formatInlineText = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return <strong key={idx} className="font-bold text-[#1F1A16]">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
        return <em key={idx} className="italic text-stone-600">{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        return (
          <code key={idx} className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-300/40 font-mono text-[11px] text-[#B23812] font-semibold">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  // Helper Markdown formatter
  const renderFormattedContent = (content: string, msgId: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, pIdx) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const firstLineBreak = part.indexOf('\n');
        const lang = part.slice(3, firstLineBreak).trim() || 'code';
        const code = part.slice(firstLineBreak + 1, -3);
        const codeKey = `${msgId}-code-${pIdx}`;

        return (
          <div key={pIdx} className="my-3 rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 text-stone-100 font-mono text-xs shadow-md">
            <div className="flex items-center justify-between px-4 py-2 bg-stone-900 border-b border-stone-800 text-[11px] text-stone-400">
              <span className="uppercase font-bold tracking-wider">{lang}</span>
              <button
                onClick={() => handleCopyCode(codeKey, code)}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer py-0.5 px-2 rounded-md hover:bg-stone-800"
              >
                {copiedCodeIdx === codeKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCodeIdx === codeKey ? 'Tersalin' : 'Salin Kode'}</span>
              </button>
            </div>
            <pre className="p-4 overflow-x-auto scrollbar-none leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Parse text lines sequentially
      const rawLines = part.split('\n');
      const elements: React.ReactNode[] = [];
      let i = 0;

      while (i < rawLines.length) {
        const line = rawLines[i];
        const trimmed = line.trim();

        // 1. Empty line
        if (!trimmed) {
          i++;
          continue;
        }

        // 2. Horizontal Rule (--- or ***)
        if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
          elements.push(
            <div key={`hr-${i}`} className="my-3.5 border-t border-[#EAE2D8]" />
          );
          i++;
          continue;
        }

        // 3. Markdown Table
        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
          const tableLines: string[] = [];
          while (i < rawLines.length && rawLines[i].trim().startsWith('|')) {
            tableLines.push(rawLines[i].trim());
            i++;
          }

          if (tableLines.length >= 2) {
            const headerRow = tableLines[0];
            const dataRows = tableLines.slice(2); // skip separator |---|
            const headers = headerRow.split('|').filter(c => c.trim().length > 0).map(c => c.trim());
            const rows = dataRows.map(r => r.split('|').filter(c => c.trim().length > 0).map(c => c.trim()));

            elements.push(
              <div key={`tbl-${i}`} className="my-3.5 overflow-x-auto rounded-2xl border border-[#EAE2D8] bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] text-[#5C5248] font-mono text-[10px] uppercase border-b border-[#EAE2D8]">
                    <tr>
                      {headers.map((h, hIdx) => (
                        <th key={hIdx} className="p-2.5 sm:p-3 font-bold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE2D8]">
                    {rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-[#FAF7F2]/60 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-2.5 sm:p-3 font-sans text-[#1F1A16]">
                            {formatInlineText(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
            continue;
          }
        }

        // 4. Headings
        if (trimmed.startsWith('### ')) {
          elements.push(
            <div key={`h3-${i}`} className="mt-3.5 mb-2 pb-1.5 border-b border-[#EAE2D8]/80">
              <h4 className="font-display font-black text-sm sm:text-base text-[#1F1A16] flex items-center gap-1.5 tracking-tight">
                {formatInlineText(trimmed.replace('### ', ''))}
              </h4>
            </div>
          );
          i++;
          continue;
        }

        if (trimmed.startsWith('#### ')) {
          elements.push(
            <div key={`h4-${i}`} className="mt-3 mb-1.5">
              <h5 className="font-display font-bold text-xs sm:text-sm text-[#B23812] flex items-center gap-1.5">
                {formatInlineText(trimmed.replace('#### ', ''))}
              </h5>
            </div>
          );
          i++;
          continue;
        }

        if (trimmed.startsWith('# ') || trimmed.startsWith('## ')) {
          elements.push(
            <div key={`h2-${i}`} className="mt-4 mb-2 pb-1 border-b-2 border-amber-500/30">
              <h3 className="font-display font-black text-base sm:text-lg text-[#1F1A16]">
                {formatInlineText(trimmed.replace(/^#+\s*/, ''))}
              </h3>
            </div>
          );
          i++;
          continue;
        }

        // 5. Blockquotes (> ...)
        if (trimmed.startsWith('> ')) {
          const quoteLines: string[] = [];
          while (i < rawLines.length && rawLines[i].trim().startsWith('>')) {
            quoteLines.push(rawLines[i].trim().replace(/^>\s*/, ''));
            i++;
          }
          elements.push(
            <div key={`quote-${i}`} className="my-2.5 pl-3.5 pr-3 py-2 rounded-r-xl border-l-3 border-[#C84B27] bg-amber-500/10 text-stone-700 text-xs leading-relaxed">
              {quoteLines.map((ql, qIdx) => (
                <p key={qIdx}>{formatInlineText(ql)}</p>
              ))}
            </div>
          );
          continue;
        }

        // 6. Numbered Lists (1. 2. 3.) -> Rendered as structured cards
        if (/^\d+\.\s/.test(trimmed)) {
          const numItems: { num: string; text: string }[] = [];
          while (i < rawLines.length && /^\d+\.\s/.test(rawLines[i].trim())) {
            const itemTrimmed = rawLines[i].trim();
            const match = itemTrimmed.match(/^(\d+)\.\s*(.*)/);
            if (match) {
              numItems.push({ num: match[1], text: match[2] });
            }
            i++;
          }
          elements.push(
            <div key={`numlist-${i}`} className="space-y-2 my-2.5">
              {numItems.map((item, lIdx) => (
                <div key={lIdx} className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-2xl bg-white/90 border border-[#EAE2D8] shadow-2xs hover:border-amber-400/60 transition-colors">
                  <span className="w-5 h-5 rounded-lg bg-amber-100 text-[#B23812] font-mono font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-amber-300/60">
                    {item.num}
                  </span>
                  <div className="flex-1 text-xs sm:text-sm leading-relaxed text-[#1F1A16]">
                    {formatInlineText(item.text)}
                  </div>
                </div>
              ))}
            </div>
          );
          continue;
        }

        // 7. Bullet Lists (- or *)
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const bulletItems: string[] = [];
          while (i < rawLines.length && (rawLines[i].trim().startsWith('- ') || rawLines[i].trim().startsWith('* '))) {
            bulletItems.push(rawLines[i].trim().replace(/^[-*]\s*/, ''));
            i++;
          }
          elements.push(
            <ul key={`bullets-${i}`} className="space-y-1.5 my-2 pl-1">
              {bulletItems.map((bItem, bIdx) => (
                <li key={bIdx} className="flex items-start gap-2 text-xs sm:text-sm leading-relaxed text-[#1F1A16]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C84B27] mt-2 shrink-0" />
                  <div className="flex-1">{formatInlineText(bItem)}</div>
                </li>
              ))}
            </ul>
          );
          continue;
        }

        // 8. Normal Paragraph
        elements.push(
          <p key={`p-${i}`} className="text-xs sm:text-sm leading-relaxed text-[#1F1A16] my-1">
            {formatInlineText(trimmed)}
          </p>
        );
        i++;
      }

      return (
        <div key={pIdx} className="space-y-1 text-xs sm:text-sm leading-relaxed">
          {elements}
        </div>
      );
    });
  };

  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-full min-h-0 flex-1 bg-[#FAF7F2] rounded-none sm:rounded-3xl border-0 sm:border border-[#EAE2D8] overflow-hidden shadow-xs relative">
      
      {/* ===================================================================== */}
      {/* 1. LEFT THREADS & SESSION SIDEBAR (DESKTOP & MOBILE DRAWER) */}
      {/* ===================================================================== */}
      
      {/* Mobile Backdrop */}
      {isSidebarOpenMobile && (
        <div 
          onClick={() => setIsSidebarOpenMobile(false)} 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 lg:z-auto
        w-72 sm:w-80 bg-white border-r border-[#EAE2D8] flex flex-col transition-transform duration-300
        ${isSidebarOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-3.5 sm:p-4 border-b border-[#EAE2D8] space-y-2.5 bg-[#FAF7F2]/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#C84B27] text-white flex items-center justify-center shadow-xs">
                <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <h3 className="font-display font-black text-xs sm:text-sm text-[#1F1A16] leading-tight">
                  AI Cozie Agent
                </h3>
                <span className="text-[9px] sm:text-[10px] font-mono text-emerald-900 bg-emerald-50 px-1.5 py-0.2 rounded font-bold border border-emerald-200">
                  v2.5 Intelligence
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsSidebarOpenMobile(false)}
              className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-500 lg:hidden cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleCreateNewSession}
            className="w-full py-2 px-3 rounded-xl sm:rounded-2xl bg-[#1F1A16] hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Percakapan Baru</span>
          </button>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Cari percakapan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-[#EAE2D8] text-xs text-[#1F1A16] placeholder:text-stone-400 focus:outline-hidden focus:border-amber-500"
            />
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-2.5 space-y-1.5 scrollbar-none no-scrollbar">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5C5248] px-2 py-1">
            Riwayat ({filteredSessions.length})
          </div>

          {filteredSessions.length === 0 ? (
            <div className="text-center py-8 text-stone-400 text-xs">
              Tidak ada percakapan.
            </div>
          ) : (
            filteredSessions.map((s) => {
              const isActive = s.id === activeSessionId;
              const isEditing = editingSessionId === s.id;

              return (
                <div
                  key={s.id}
                  onClick={() => handleSelectSession(s.id)}
                  className={`group relative p-2 sm:p-2.5 rounded-2xl transition-all cursor-pointer border ${
                    isActive 
                      ? 'bg-amber-50/80 border-amber-300/80 shadow-2xs text-[#1F1A16]' 
                      : 'bg-white hover:bg-stone-50 border-transparent text-[#5C5248]'
                  }`}
                >
                  {isEditing ? (
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editTitleText}
                        onChange={(e) => setEditTitleText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveRename(s.id);
                          if (e.key === 'Escape') setEditingSessionId(null);
                        }}
                        autoFocus
                        className="w-full p-1 text-xs border border-amber-400 rounded-lg bg-white"
                      />
                      <button
                        onClick={() => handleSaveRename(s.id)}
                        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#B23812]' : 'text-stone-400'}`} />
                          <h4 className="text-xs font-bold truncate leading-tight">
                            {s.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-stone-400 font-mono">
                          <span>{s.messages.length} pesan</span>
                          <span>•</span>
                          <span className="truncate">{s.modelId.split('-')[0]}</span>
                        </div>
                      </div>

                      {/* Quick Action Buttons */}
                      <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
                        <button
                          onClick={(e) => handleStartRename(e, s)}
                          className="p-1 hover:bg-stone-200 text-stone-500 hover:text-stone-800 rounded-md transition-colors"
                          title="Ganti Judul"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteSession(e, s.id)}
                          className="p-1 hover:bg-rose-100 text-stone-500 hover:text-rose-700 rounded-md transition-colors"
                          title="Hapus Sesi"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer (Settings & User Info) */}
        <div className="p-2.5 sm:p-3 border-t border-[#EAE2D8] bg-[#FAF7F2] space-y-2 shrink-0">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full py-2 px-2.5 rounded-xl bg-white hover:bg-stone-100 text-xs font-bold text-[#1F1A16] border border-[#EAE2D8] flex items-center justify-between shadow-2xs transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-stone-600" />
              <span>Pengaturan API</span>
            </span>
            <span className="text-[9px] font-mono text-amber-900 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              Config
            </span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. MAIN CONVERSATIONAL CHAT AREA */}
      {/* ===================================================================== */}

      <div className="flex-1 flex flex-col min-w-0 bg-white h-full overflow-hidden">
        
        {/* Top Chat Header Toolbar */}
        <div className="p-2.5 sm:px-5 border-b border-[#EAE2D8] bg-[#FAF7F2]/95 flex items-center justify-between gap-2 shrink-0 z-10">
          
          {/* Left: Mobile Toggle & Title */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button
              onClick={() => setIsSidebarOpenMobile(true)}
              className="p-1.5 sm:p-2 rounded-xl bg-white border border-[#EAE2D8] text-stone-700 hover:bg-stone-100 lg:hidden cursor-pointer shrink-0 shadow-2xs"
              title="Lihat Riwayat Percakapan"
            >
              <MessageSquare className="w-4 h-4 text-[#B23812]" />
            </button>

            <div className="min-w-0 flex-1">
              <h3 className="font-display font-black text-xs sm:text-base text-[#1F1A16] truncate max-w-[130px] sm:max-w-[220px] md:max-w-md">
                {activeSession?.title || 'AI Cozie Assistant'}
              </h3>
              <p className="text-[10px] text-[#5C5248] truncate hidden sm:block">
                <span>Pengguna: <strong>{currentSystemUser.name}</strong></span>
              </p>
            </div>
          </div>

          {/* Right: Model Switcher & Cafe Context Toggle */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            
            {/* Model Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className="px-2 sm:px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-[#EAE2D8] text-xs font-bold text-[#1F1A16] flex items-center gap-1 sm:gap-1.5 shadow-2xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#B23812] shrink-0" />
                <span className="truncate max-w-[70px] sm:max-w-none">{activeModel.name.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-stone-400 shrink-0" />
              </button>

              {/* Model Dropdown Menu */}
              {isModelDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-[#EAE2D8] p-2 z-50 space-y-1.5 max-h-96 overflow-y-auto">
                  <div className="text-[10px] font-mono font-bold uppercase text-[#5C5248] px-2 py-1">
                    Pilih Model Intelligence AI
                  </div>
                  {AI_MODELS_CATALOG.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleSelectModel(m)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors cursor-pointer border ${
                        m.id === activeModel.id
                          ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold'
                          : 'hover:bg-stone-50 border-transparent text-[#1F1A16]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1.5">
                          {m.name}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                          {m.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#5C5248] mt-0.5 line-clamp-1 font-normal">
                        {m.description}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Smart Cafe Context Toggle */}
            <button
              onClick={handleToggleContext}
              className={`px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 sm:gap-1.5 border transition-all cursor-pointer shadow-2xs ${
                activeSession?.contextEnabled
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-50'
              }`}
              title={activeSession?.contextEnabled ? 'Konteks Data Live Kafe Aktif' : 'Mode Umum (Tanpa Data Kafe)'}
            >
              <Database className={`w-3.5 h-3.5 ${activeSession?.contextEnabled ? 'text-emerald-600' : 'text-stone-400'}`} />
              <span className="hidden sm:inline">
                {activeSession?.contextEnabled ? 'Data Kafe: Aktif' : 'Mode Umum'}
              </span>
            </button>

            {/* Quick Settings Icon */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-1.5 sm:p-2 rounded-xl bg-white hover:bg-stone-100 border border-[#EAE2D8] text-stone-600 hover:text-[#1F1A16] transition-colors cursor-pointer shadow-2xs"
              title="Pengaturan API & Parameter"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>

            {/* Export Transkrip Button */}
            <button
              onClick={handleExportSession}
              className="p-1.5 sm:p-2 rounded-xl bg-white hover:bg-stone-100 border border-[#EAE2D8] text-stone-600 hover:text-[#1F1A16] transition-colors cursor-pointer shadow-2xs"
              title="Unduh Transkrip (.md)"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Message Stream Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 scrollbar-none no-scrollbar">
          
          {/* Welcome Screen / Empty State */}
          {(!activeSession || activeSession.messages.length === 0) && (
            <div className="max-w-2xl mx-auto py-8 space-y-6 text-center">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 border-2 border-amber-200 text-[#B23812] flex items-center justify-center mx-auto shadow-md">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-black text-xl sm:text-2xl text-[#1F1A16]">
                  Bagaimana saya bisa membantu kafe Anda hari ini?
                </h3>
                <p className="text-xs sm:text-sm text-[#5C5248] max-w-lg mx-auto">
                  Asisten AI terhubung secara live ke database omzet kasir, stok gudang, dan resep BOM Homie Cozie.
                </p>
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
                {QUICK_PROMPT_CARDS.map((card, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(card.prompt)}
                    className="p-4 rounded-2xl bg-white hover:bg-stone-50 border border-[#EAE2D8] shadow-2xs hover:shadow-xs transition-all text-left space-y-1.5 cursor-pointer group active:scale-95"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-xl bg-stone-100 group-hover:bg-[#C84B27] group-hover:text-white transition-colors">
                        <card.icon className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#1F1A16] group-hover:text-[#B23812] transition-colors">
                        {card.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-[#5C5248] line-clamp-2 leading-relaxed">
                      {card.subtitle}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages Feed */}
          {activeSession?.messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isThinkingExpanded = !!expandedThinkingMap[msg.id];

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs text-xs font-bold ${
                  isUser 
                    ? 'bg-[#C84B27] text-white' 
                    : 'bg-[#1F1A16] text-amber-400 border border-amber-500/30'
                }`}>
                  {isUser ? '👤' : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Content Container */}
                <div className={`space-y-1.5 max-w-[85%] sm:max-w-[90%]`}>
                  <div className={`flex items-center gap-2 text-[10px] text-stone-400 font-mono ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <span>{isUser ? currentSystemUser.name : (msg.modelUsed || activeModel.name)}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Thinking Process Accordion (Reasoning Models) */}
                  {!isUser && msg.thinkingContent && (
                    <div className="rounded-2xl border border-purple-200 bg-purple-50/70 p-3 space-y-2 text-xs">
                      <button
                        onClick={() => setExpandedThinkingMap(prev => ({ ...prev, [msg.id]: !prev[msg.id] }))}
                        className="w-full flex items-center justify-between text-purple-900 font-bold cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          <BrainCircuit className="w-3.5 h-3.5 text-purple-700" />
                          <span>Proses Berpikir & Penalaran (Chain of Thought)</span>
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isThinkingExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      {isThinkingExpanded && (
                        <div className="pt-2 text-[11px] text-purple-950 font-mono whitespace-pre-wrap leading-relaxed border-t border-purple-200">
                          {msg.thinkingContent}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className={`p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xs ${
                    isUser
                      ? 'bg-[#C84B27] text-white rounded-tr-xs'
                      : 'bg-[#FAF7F2] text-[#1F1A16] border border-[#EAE2D8] rounded-tl-xs'
                  }`}>
                    {isUser ? (
                      <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </p>
                    ) : (
                      renderFormattedContent(msg.content, msg.id)
                    )}
                  </div>

                  {/* Assistant Message Quick Actions */}
                  {!isUser && (
                    <div className="flex items-center gap-2 pt-0.5">
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.content)}
                        className="text-[10px] font-mono text-stone-500 hover:text-stone-800 flex items-center gap-1 py-0.5 px-2 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
                      >
                        {copiedMsgId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedMsgId === msg.id ? 'Tersalin' : 'Salin Respon'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2.5 max-w-3xl mr-auto"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#1F1A16] text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-2xs">
                <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
              </div>
              <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-[#FAF7F2] border border-[#EAE2D8] rounded-tl-xs flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#C84B27] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#C84B27] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#C84B27] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs font-mono text-stone-500 ml-1.5">
                  Memproses via {activeModel.name}...
                </span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-2 sm:p-3 border-t border-[#EAE2D8] bg-white shrink-0">
          <div className="max-w-4xl mx-auto space-y-1.5">
            
            {/* Quick Context / Model Indicator Pill */}
            <div className="flex items-center justify-between text-[10px] text-[#5C5248] px-1 font-mono">
              <span className="flex items-center gap-1.5 truncate">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeSession?.contextEnabled ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                <span className="truncate">{activeSession?.contextEnabled ? 'Live Context Injected' : 'Mode Umum'}</span>
              </span>
              <span className="shrink-0 text-stone-500">Model: <strong className="text-stone-700">{activeModel.name.split(' ')[0]}</strong></span>
            </div>

            <div className="flex items-end gap-1.5 sm:gap-2 bg-[#FAF7F2] border border-[#EAE2D8] rounded-2xl p-1.5 sm:p-2 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all shadow-2xs">
              
              {/* Voice Speech-to-Text Button */}
              <button
                onClick={handleToggleVoice}
                className={`p-2 rounded-xl transition-colors cursor-pointer shrink-0 ${
                  isListeningVoice 
                    ? 'bg-rose-500 text-white animate-pulse' 
                    : 'bg-white hover:bg-stone-200 text-stone-600 border border-[#EAE2D8]'
                }`}
                title={isListeningVoice ? 'Sedang mendengarkan... Klik untuk berhenti' : 'Input Suara (Bahasa Indonesia)'}
              >
                {isListeningVoice ? <MicOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </button>

              {/* Textarea Input */}
              <textarea
                ref={textareaRef}
                value={inputPrompt}
                onChange={(e) => {
                  setInputPrompt(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                }}
                onKeyDown={handleKeyDown}
                placeholder="Tanyakan omzet, stok, resep, atau apa saja..."
                rows={1}
                className="flex-1 bg-transparent border-0 text-xs sm:text-sm text-[#1F1A16] placeholder:text-stone-400 focus:outline-hidden resize-none py-1 sm:py-1.5 px-1.5 max-h-32 leading-relaxed"
              />

              {/* Send Button */}
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputPrompt.trim() || isLoading}
                className="p-2 sm:p-2.5 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] disabled:bg-stone-300 text-white transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed shrink-0 shadow-xs"
                title="Kirim Pesan (Enter)"
              >
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ===================================================================== */}
      {/* 3. API & MODEL SETTINGS MODAL */}
      {/* ===================================================================== */}
      
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-[#EAE2D8] w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-[#EAE2D8] bg-[#FAF7F2] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#1F1A16] text-amber-400 flex items-center justify-center shadow-xs">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-base text-[#1F1A16]">
                      Konfigurasi Provider & API Keys
                    </h3>
                    <p className="text-xs text-[#5C5248]">
                      Gunakan API Key Anda sendiri atau manfaatkan Smart Simulation Mode
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-2 rounded-xl bg-white hover:bg-stone-100 text-stone-500 border border-[#EAE2D8] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Provider Tabs Switcher */}
              <div className="p-3 bg-[#FAF7F2] border-b border-[#EAE2D8] flex gap-1.5 overflow-x-auto scrollbar-none no-scrollbar">
                {(['gemini', 'openai', 'claude', 'deepseek', 'custom'] as AIProviderId[]).map((pid) => (
                  <button
                    key={pid}
                    onClick={() => setActiveConfigTab(pid)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                      activeConfigTab === pid
                        ? 'bg-[#C84B27] text-white shadow-xs'
                        : 'bg-white text-[#5C5248] hover:bg-stone-100 border border-[#EAE2D8]'
                    }`}
                  >
                    {pid === 'custom' ? 'Custom / Local LLM' : pid}
                  </button>
                ))}
              </div>

              {/* Config Form Body */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 scrollbar-none no-scrollbar">
                
                {/* Notice Card */}
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-900 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold block">Smart Fallback Simulation Aktif</span>
                    <p className="text-[#5C5248] leading-relaxed">
                      Jika kolom API Key dibiarkan kosong, AI Agent tetap dapat menjawab pertanyaan bisnis dan analisis kafe secara akurat menggunakan data riil Homie Cozie.
                    </p>
                  </div>
                </div>

                {/* API Key Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1F1A16]">
                    API Key ({activeConfigTab.toUpperCase()}):
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKeyMap[activeConfigTab] ? 'text' : 'password'}
                      placeholder={`Masukkan API Key ${activeConfigTab.toUpperCase()}...`}
                      value={configs[activeConfigTab]?.apiKey || ''}
                      onChange={(e) => setConfigs({
                        ...configs,
                        [activeConfigTab]: {
                          ...configs[activeConfigTab],
                          apiKey: e.target.value
                        }
                      })}
                      className="w-full p-2.5 pr-10 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] text-xs font-mono text-[#1F1A16] focus:outline-hidden focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKeyMap(prev => ({ ...prev, [activeConfigTab]: !prev[activeConfigTab] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                    >
                      {showApiKeyMap[activeConfigTab] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Custom / DeepSeek Base URL */}
                {(activeConfigTab === 'custom' || activeConfigTab === 'deepseek') && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#1F1A16]">
                      Custom Base URL:
                    </label>
                    <input
                      type="text"
                      placeholder={activeConfigTab === 'custom' ? 'http://localhost:11434/v1' : 'https://api.deepseek.com'}
                      value={configs[activeConfigTab]?.baseUrl || ''}
                      onChange={(e) => setConfigs({
                        ...configs,
                        [activeConfigTab]: {
                          ...configs[activeConfigTab],
                          baseUrl: e.target.value
                        }
                      })}
                      className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] text-xs font-mono text-[#1F1A16] focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                )}

                {/* Custom Model Name */}
                {activeConfigTab === 'custom' && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#1F1A16]">
                      Model Name / Identifier:
                    </label>
                    <input
                      type="text"
                      placeholder="llama3.2 / mistral / qwen2.5"
                      value={configs.custom?.customModelName || ''}
                      onChange={(e) => setConfigs({
                        ...configs,
                        custom: {
                          ...configs.custom,
                          customModelName: e.target.value
                        }
                      })}
                      className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] text-xs font-mono text-[#1F1A16] focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                )}

                {/* Temperature & Max Output Tokens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Kreativitas (Temperature):</span>
                      <span className="font-mono text-[#B23812]">{configs[activeConfigTab]?.temperature}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={configs[activeConfigTab]?.temperature}
                      onChange={(e) => setConfigs({
                        ...configs,
                        [activeConfigTab]: {
                          ...configs[activeConfigTab],
                          temperature: Number(e.target.value)
                        }
                      })}
                      className="w-full accent-[#C84B27] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                      <span>Presisi (0.0)</span>
                      <span>Kreatif (1.0)</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Maksimal Token Output:</span>
                      <span className="font-mono text-[#B23812]">{configs[activeConfigTab]?.maxOutputTokens}</span>
                    </div>
                    <input
                      type="range"
                      min="512"
                      max="8192"
                      step="512"
                      value={configs[activeConfigTab]?.maxOutputTokens}
                      onChange={(e) => setConfigs({
                        ...configs,
                        [activeConfigTab]: {
                          ...configs[activeConfigTab],
                          maxOutputTokens: Number(e.target.value)
                        }
                      })}
                      className="w-full accent-[#C84B27] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                      <span>512</span>
                      <span>8192</span>
                    </div>
                  </div>
                </div>

                {/* Custom System Prompt */}
                <div className="space-y-1.5 pt-2">
                  <label className="block text-xs font-bold text-[#1F1A16]">
                    Instruksi Khusus / Custom System Prompt (Opsional):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Selalu jawab dalam bahasa Indonesia santai tapi profesional dan sertakan rekomendasi taktis..."
                    value={configs[activeConfigTab]?.customSystemPrompt || ''}
                    onChange={(e) => setConfigs({
                      ...configs,
                      [activeConfigTab]: {
                        ...configs[activeConfigTab],
                        customSystemPrompt: e.target.value
                      }
                    })}
                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] text-xs text-[#1F1A16] focus:outline-hidden focus:border-amber-500 leading-relaxed"
                  />
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-[#EAE2D8] bg-[#FAF7F2] flex items-center justify-between">
                <button
                  onClick={() => {
                    aiAgentService.clearAllSessions();
                    setSessions(aiAgentService.getSessions());
                    setActiveSessionId(aiAgentService.getActiveSession()?.id || '');
                    showToast('✓ Semua riwayat percakapan berhasil dibersihkan');
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Bersihkan Semua Riwayat</span>
                </button>

                <button
                  onClick={handleSaveConfigs}
                  className="px-6 py-2 rounded-xl bg-[#1F1A16] hover:bg-black text-white text-xs font-bold shadow-md transition-transform active:scale-95 cursor-pointer"
                >
                  Simpan Pengaturan
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
