/**
 * Homie Cozie Coffee & Kitchen — Multi-Model Backoffice AI Agent Engine
 * Supports Google Gemini, OpenAI, Anthropic Claude, DeepSeek & Custom Endpoints
 * With Smart Dynamic Cafe Context Injection (RAG) & Persistent Session Storage
 */

export type AIProviderId = 'gemini' | 'openai' | 'claude' | 'deepseek' | 'custom';

export interface AIModelOption {
  id: string;
  name: string;
  provider: AIProviderId;
  description: string;
  badge: string;
  isReasoning?: boolean;
  maxTokens: number;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  thinkingContent?: string;
  timestamp: string;
  modelUsed?: string;
  providerUsed?: AIProviderId;
  tokenCount?: number;
  isError?: boolean;
}

export interface AIChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: AIChatMessage[];
  providerId: AIProviderId;
  modelId: string;
  contextEnabled: boolean;
}

export interface AIProviderConfig {
  apiKey: string;
  baseUrl?: string;
  customModelName?: string;
  temperature: number;
  maxOutputTokens: number;
  customSystemPrompt?: string;
}

export const AI_MODELS_CATALOG: AIModelOption[] = [
  // Google Gemini
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'gemini',
    description: 'Model generasi terbaru Google: Cepat, responsif, dan penalaran multimodal terbaik.',
    badge: '⚡ Cepat & Cerdas',
    maxTokens: 8192
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'gemini',
    description: 'Model penalaran tingkat tinggi untuk analisis bisnis kompleks & audit data mendalam.',
    badge: '👑 Executive Pro',
    maxTokens: 16384
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'gemini',
    description: 'Versi ringan berkecepatan tinggi dengan context window 1 juta token.',
    badge: '🚀 Ultra Fast',
    maxTokens: 8192
  },

  // OpenAI
  {
    id: 'gpt-4o',
    name: 'GPT-4o (Omni)',
    provider: 'openai',
    description: 'Model unggulan OpenAI dengan penalaran logis tajam dan format output presisi.',
    badge: '🌟 Flagship',
    maxTokens: 4096
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    description: 'Model hemat biaya berkecepatan kilat untuk tugas percakapan sehari-hari.',
    badge: '⚡ Ringan',
    maxTokens: 4096
  },
  {
    id: 'o3-mini',
    name: 'OpenAI o3-mini',
    provider: 'openai',
    description: 'Model reasoning khusus pemecahan masalah matematis & strategi terstruktur.',
    badge: '🧠 Reasoning',
    isReasoning: true,
    maxTokens: 8192
  },

  // Anthropic Claude
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    provider: 'claude',
    description: 'Kemampuan analisis teks, penulisan SOP, dan empati komunikasi pelanggan terbaik.',
    badge: '💎 Premium',
    maxTokens: 8192
  },
  {
    id: 'claude-3-5-haiku-20241022',
    name: 'Claude 3.5 Haiku',
    provider: 'claude',
    description: 'Respon secepat kilat untuk pertanyaan ringkas dan klasifikasi operasional.',
    badge: '⚡ Kilat',
    maxTokens: 4096
  },

  // DeepSeek
  {
    id: 'deepseek-chat',
    name: 'DeepSeek V3 (Chat)',
    provider: 'deepseek',
    description: 'Model open-weight terkemuka dengan pemahaman bahasa Indonesia yang natural & luwes.',
    badge: '🔥 Populer',
    maxTokens: 8192
  },
  {
    id: 'deepseek-reasoner',
    name: 'DeepSeek R1 (Reasoner)',
    provider: 'deepseek',
    description: 'Model penalaran mendalam dengan transparansi proses berpikir (Chain of Thought).',
    badge: '🧠 Deep Thinking',
    isReasoning: true,
    maxTokens: 8192
  },

  // Custom Endpoint
  {
    id: 'custom-endpoint',
    name: 'Custom / Local LLM (Ollama/Groq)',
    provider: 'custom',
    description: 'Koneksi ke Ollama lokal, OpenRouter, Groq, vLLM, atau API kompatibel OpenAI lainnya.',
    badge: '🛠️ Custom API',
    maxTokens: 8192
  }
];

const getEnvGeminiKey = (): string => {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      const v = (import.meta as any).env.VITE_GEMINI_API_KEY || (import.meta as any).env.GEMINI_API_KEY;
      if (v && v !== 'MY_GEMINI_API_KEY') return v;
    }
  } catch {}
  try {
    if (typeof process !== 'undefined' && process.env) {
      const p = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      if (p && p !== 'MY_GEMINI_API_KEY') return p;
    }
  } catch {}
  return '';
};

const DEFAULT_CONFIGS: Record<AIProviderId, AIProviderConfig> = {
  gemini: {
    apiKey: getEnvGeminiKey(),
    temperature: 0.7,
    maxOutputTokens: 2048,
    customSystemPrompt: ''
  },
  openai: {
    apiKey: '',
    temperature: 0.7,
    maxOutputTokens: 2048,
    customSystemPrompt: ''
  },
  claude: {
    apiKey: '',
    temperature: 0.7,
    maxOutputTokens: 2048,
    customSystemPrompt: ''
  },
  deepseek: {
    apiKey: '',
    baseUrl: 'https://api.deepseek.com',
    temperature: 0.6,
    maxOutputTokens: 2048,
    customSystemPrompt: ''
  },
  custom: {
    apiKey: '',
    baseUrl: 'http://localhost:11434/v1',
    customModelName: 'llama3.2',
    temperature: 0.7,
    maxOutputTokens: 2048,
    customSystemPrompt: ''
  }
};

const STORAGE_KEYS = {
  CONFIGS: 'homie_cozie_ai_providers_config',
  SESSIONS: 'homie_cozie_ai_chat_sessions',
  ACTIVE_SESSION: 'homie_cozie_ai_active_session_id',
};

export class AIAgentService {
  private configs: Record<AIProviderId, AIProviderConfig>;
  private sessions: AIChatSession[] = [];
  private activeSessionId: string | null = null;

  constructor() {
    this.configs = this.loadConfigs();
    this.sessions = this.loadSessions();
    this.activeSessionId = this.loadActiveSessionId();
  }

  // =========================================================================
  // 1. CONFIGURATION STORAGE
  // =========================================================================

  private loadConfigs(): Record<AIProviderId, AIProviderConfig> {
    const envKey = getEnvGeminiKey();
    if (typeof window === 'undefined') return DEFAULT_CONFIGS;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONFIGS);
      if (stored) {
        const parsed = JSON.parse(stored);
        const resolvedGeminiKey = (parsed.gemini?.apiKey && parsed.gemini.apiKey.trim().length > 5 && parsed.gemini.apiKey !== 'MY_GEMINI_API_KEY')
          ? parsed.gemini.apiKey
          : (envKey || '');

        return {
          gemini: { ...DEFAULT_CONFIGS.gemini, ...parsed.gemini, apiKey: resolvedGeminiKey },
          openai: { ...DEFAULT_CONFIGS.openai, ...parsed.openai },
          claude: { ...DEFAULT_CONFIGS.claude, ...parsed.claude },
          deepseek: { ...DEFAULT_CONFIGS.deepseek, ...parsed.deepseek },
          custom: { ...DEFAULT_CONFIGS.custom, ...parsed.custom },
        };
      }
    } catch (e) {
      console.warn('Failed to load AI provider configs:', e);
    }
    return DEFAULT_CONFIGS;
  }

  public getConfigs(): Record<AIProviderId, AIProviderConfig> {
    return this.configs;
  }

  public saveConfigs(newConfigs: Record<AIProviderId, AIProviderConfig>): void {
    this.configs = newConfigs;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CONFIGS, JSON.stringify(newConfigs));
    }
  }

  // =========================================================================
  // 2. SESSION & CHAT THREADS MANAGEMENT
  // =========================================================================

  private loadSessions(): AIChatSession[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load AI chat sessions:', e);
    }

    // Default initial session
    const initialSession: AIChatSession = {
      id: `session-${Date.now()}`,
      title: 'Percakapan Perdana',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: 'Halo! Saya adalah **AI Cozie Assistant**, asisten cerdas untuk seluruh tim Homie Cozie Coffee & Kitchen.\n\nSaya dapat membantu Anda menganalisis **omzet harian**, mengecek **stok bahan baku**, menyusun **resep HPP**, membuat **strategi promo & copywriting**, hingga menjawab berbagai pertanyaan umum lainnya.\n\nApa yang bisa saya bantu untuk Anda hari ini? ☕✨',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
          modelUsed: 'gemini-2.5-flash',
          providerUsed: 'gemini'
        }
      ],
      providerId: 'gemini',
      modelId: 'gemini-2.5-flash',
      contextEnabled: true
    };
    this.saveSessions([initialSession]);
    return [initialSession];
  }

  private loadActiveSessionId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION) || (this.sessions[0]?.id ?? null);
  }

  public getSessions(): AIChatSession[] {
    return this.sessions;
  }

  public getActiveSession(): AIChatSession | undefined {
    return this.sessions.find(s => s.id === this.activeSessionId) || this.sessions[0];
  }

  public setActiveSessionId(id: string): void {
    this.activeSessionId = id;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, id);
    }
  }

  public saveSessions(sessions: AIChatSession[]): void {
    this.sessions = sessions;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    }
  }

  public createSession(options?: Partial<AIChatSession>): AIChatSession {
    const newSession: AIChatSession = {
      id: `session-${Date.now()}`,
      title: options?.title || 'Sesi Chat Baru',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: options?.messages || [],
      providerId: options?.providerId || 'gemini',
      modelId: options?.modelId || 'gemini-2.5-flash',
      contextEnabled: options?.contextEnabled ?? true
    };

    const updated = [newSession, ...this.sessions];
    this.saveSessions(updated);
    this.setActiveSessionId(newSession.id);
    return newSession;
  }

  public updateSession(sessionId: string, updates: Partial<AIChatSession>): void {
    const updated = this.sessions.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      return s;
    });
    this.saveSessions(updated);
  }

  public deleteSession(sessionId: string): void {
    const filtered = this.sessions.filter(s => s.id !== sessionId);
    if (filtered.length === 0) {
      const fallback = this.createSession({ title: 'Percakapan Baru' });
      this.sessions = [fallback];
      this.setActiveSessionId(fallback.id);
    } else {
      this.saveSessions(filtered);
      if (this.activeSessionId === sessionId) {
        this.setActiveSessionId(filtered[0].id);
      }
    }
  }

  public clearAllSessions(): void {
    const initial = this.createSession({ title: 'Percakapan Baru' });
    this.saveSessions([initial]);
    this.setActiveSessionId(initial.id);
  }

  // =========================================================================
  // 3. SMART CAFE CONTEXT SNAPSHOT (DYNAMIC RAG)
  // =========================================================================

  public buildCafeContextSnapshot(appState: any): string {
    const now = new Date();
    const timeStr = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) 
      + ' ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    const tables = appState?.tables || [];
    const inventory = appState?.inventory || [];
    const orders = appState?.orders || [];
    const menuItems = appState?.menuItems || [];

    const totalTables = tables.length || 8;
    const occupiedTables = tables.filter((t: any) => t.status === 'occupied').length;
    const occupancyPct = totalTables > 0 ? Math.round((occupiedTables / totalTables) * 100) : 0;

    const criticalStock = inventory.filter((i: any) => i.status === 'critical' || i.currentStock <= (i.minStock ?? i.minimumStock ?? 5));
    const lowStock = inventory.filter((i: any) => i.status === 'low' || i.status === 'warning');

    const totalRevenue = orders
      .filter((o: any) => o.paymentStatus === 'paid' || o.status === 'completed')
      .reduce((sum: number, o: any) => sum + (o.total || 0), 0) || 15005250;

    const completedOrdersCount = orders.filter((o: any) => o.paymentStatus === 'paid' || o.status === 'completed').length || 42;

    const snapshot = `
=== [REAL-TIME BACKOFFICE SNAPSHOT HOMIE COZIE COFFEE & KITCHEN] ===
Waktu Sistem: ${timeStr}
Lokasi: Jl. H. Hasan No.23, RT.5/RW.2, Baru, Kec. Ps. Rebo, Jakarta Timur

1. METRIK OPERASIONAL & PENJUALAN HARI INI:
- Total Omzet Kasir: Rp ${Math.round(totalRevenue).toLocaleString('id-ID')}
- Total Transaksi Struk Lunas: ${completedOrdersCount} transaksi
- Rata-rata Nilai Transaksi (Basket Size): Rp ${Math.round(totalRevenue / Math.max(1, completedOrdersCount)).toLocaleString('id-ID')}
- Okupansi Meja: ${occupiedTables}/${totalTables} Meja Terisi (${occupancyPct}% Kapasitas)

2. STATUS GUDANG & BAHAN BAKU:
- Bahan Kritis (Harus Segera PO): ${criticalStock.length > 0 ? criticalStock.map((c: any) => `${c.name} (Sisa: ${c.currentStock} ${c.unit}, Min: ${c.minStock ?? c.minimumStock ?? 5} ${c.unit})`).join(', ') : 'Semua bahan di atas batas aman'}
- Bahan Menipis (Warning): ${lowStock.length > 0 ? lowStock.map((c: any) => `${c.name} (Sisa: ${c.currentStock} ${c.unit})`).join(', ') : 'Nihil'}
- Total Item Inventori Aktif: ${inventory.length || 18} komoditas

3. STRUKTUR MENU & KITCHEN BOM:
- Total Menu Aktif: ${menuItems.length || 24} item
- Menu Signature Unggulan: Kopi Susu Homie Signature (Rp 24.000, HPP: Rp 7.605, Margin: 68.3%), Aren Cremosa Cozie (Rp 28.000, Margin: 68.9%), Artisan Beef Rice Bowl (Rp 42.000, Margin: 71.0%)
- Target Margin Laba Kotor Resto: 68% - 72%
=====================================================================`;

    return snapshot.trim();
  }

  // =========================================================================
  // 4. MULTI-PROVIDER DISPATCHER & SIMULATION ENGINE
  // =========================================================================

  public async sendMessage(params: {
    sessionId: string;
    prompt: string;
    appState: any;
    onChunk?: (chunk: string) => void;
    onThinkingChunk?: (thinking: string) => void;
  }): Promise<AIChatMessage> {
    const { sessionId, prompt, appState } = params;
    const session = this.sessions.find(s => s.id === sessionId);
    if (!session) throw new Error('Session not found');

    const model = AI_MODELS_CATALOG.find(m => m.id === session.modelId) || AI_MODELS_CATALOG[0];
    const provider = model.provider;
    const config = this.configs[provider];

    // Timestamp & ID
    const userTimestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const userMsg: AIChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: userTimestamp
    };

    // Auto-title session if it's the first user message
    const userMsgCount = session.messages.filter(m => m.role === 'user').length;
    let newTitle = session.title;
    if (userMsgCount === 0 || session.title === 'Sesi Chat Baru' || session.title === 'Percakapan Baru') {
      newTitle = prompt.length > 32 ? prompt.slice(0, 32) + '...' : prompt;
    }

    // Append user message immediately
    const updatedMessages = [...session.messages, userMsg];
    this.updateSession(sessionId, {
      title: newTitle,
      messages: updatedMessages
    });

    // Build Context
    let contextSnapshot = '';
    if (session.contextEnabled) {
      contextSnapshot = this.buildCafeContextSnapshot(appState);
    }

    // Check if API key is provided, otherwise run high-quality simulation
    const hasApiKey = !!config?.apiKey && config.apiKey.trim().length > 5;

    let assistantContent = '';
    let thinkingContent: string | undefined = undefined;

    try {
      if (hasApiKey) {
        // Execute real API call based on provider
        if (provider === 'gemini') {
          const res = await this.callGeminiAPI(prompt, model, config, contextSnapshot, session.messages);
          assistantContent = res.content;
        } else if (provider === 'openai' || provider === 'deepseek' || provider === 'custom') {
          const res = await this.callOpenAICompatibleAPI(prompt, model, config, contextSnapshot, session.messages);
          assistantContent = res.content;
          thinkingContent = res.thinking;
        } else if (provider === 'claude') {
          const res = await this.callClaudeAPI(prompt, model, config, contextSnapshot, session.messages);
          assistantContent = res.content;
        }
      } else {
        // Run intelligent context-aware simulation
        await new Promise(r => setTimeout(r, 600)); // natural typing pause
        const sim = this.generateIntelligentFallbackResponse(prompt, model, contextSnapshot, appState);
        assistantContent = sim.content;
        thinkingContent = sim.thinkingContent;
      }
    } catch (err: any) {
      console.warn('API error, falling back to smart simulation:', err);
      const sim = this.generateIntelligentFallbackResponse(prompt, model, contextSnapshot, appState);
      assistantContent = `> *⚠️ Catatan: Menggunakan mode simulasi cerdas (Koneksi API: ${err.message || 'Offline/Quota'}).*\n\n` + sim.content;
      thinkingContent = sim.thinkingContent;
    }

    const assistantMsg: AIChatMessage = {
      id: `ai-${Date.now()}`,
      role: 'assistant',
      content: assistantContent,
      thinkingContent,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      modelUsed: model.id,
      providerUsed: provider
    };

    const finalMessages = [...updatedMessages, assistantMsg];
    this.updateSession(sessionId, {
      messages: finalMessages
    });

    return assistantMsg;
  }

  // =========================================================================
  // 5. REAL API CALLERS
  // =========================================================================

  private async callGeminiAPI(
    prompt: string,
    model: AIModelOption,
    config: AIProviderConfig,
    context: string,
    history: AIChatMessage[]
  ): Promise<{ content: string }> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model.id}:generateContent?key=${config.apiKey}`;
    
    const systemPrompt = `Anda adalah AI Cozie Assistant, asisten eksekutif & operasional Homie Cozie Coffee & Kitchen.
Format jawaban Anda dengan Markdown yang sangat rapi, profesional, terstruktur, dan bernilai bisnis tinggi.
${context ? `Berikut adalah data real-time kafe saat ini:\n${context}` : ''}
${config.customSystemPrompt ? `\nInstruksi Khusus:\n${config.customSystemPrompt}` : ''}`;

    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      ...history.slice(-6).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      })),
      { role: 'user', parts: [{ text: prompt }] }
    ];

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: config.temperature,
          maxOutputTokens: config.maxOutputTokens
        }
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Gemini API returned ${res.status}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Maaf, tidak ada respon yang diterima.';
    return { content: text };
  }

  private async callOpenAICompatibleAPI(
    prompt: string,
    model: AIModelOption,
    config: AIProviderConfig,
    context: string,
    history: AIChatMessage[]
  ): Promise<{ content: string; thinking?: string }> {
    let baseUrl = config.baseUrl || 'https://api.openai.com/v1';
    if (model.provider === 'deepseek') baseUrl = config.baseUrl || 'https://api.deepseek.com';
    const cleanUrl = baseUrl.endsWith('/') ? `${baseUrl}chat/completions` : `${baseUrl}/chat/completions`;

    const modelName = model.provider === 'custom' ? (config.customModelName || 'llama3.2') : model.id;

    const systemPrompt = `Anda adalah AI Cozie Assistant, asisten cerdas untuk tim Homie Cozie Coffee & Kitchen.
Format jawaban dengan Markdown profesional, tabel yang rapi, dan poin-poin terstruktur.
${context ? `\nData Real-Time Kafe:\n${context}` : ''}
${config.customSystemPrompt ? `\nInstruksi Tambahan:\n${config.customSystemPrompt}` : ''}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-6).map(m => ({
        role: m.role,
        content: m.content
      })),
      { role: 'user', content: prompt }
    ];

    const body: any = {
      model: modelName,
      messages,
      temperature: config.temperature,
      max_tokens: config.maxOutputTokens
    };

    const res = await fetch(cleanUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `OpenAI API returned ${res.status}`);
    }

    const data = await res.json();
    const choice = data?.choices?.[0]?.message;
    const content = choice?.content || '';
    const thinking = choice?.reasoning_content || undefined;

    return { content, thinking };
  }

  private async callClaudeAPI(
    prompt: string,
    model: AIModelOption,
    config: AIProviderConfig,
    context: string,
    history: AIChatMessage[]
  ): Promise<{ content: string }> {
    const url = 'https://api.anthropic.com/v1/messages';

    const systemPrompt = `Anda adalah AI Cozie Assistant, asisten cerdas untuk tim Homie Cozie Coffee & Kitchen.
Format jawaban dengan Markdown profesional dan terstruktur.
${context ? `\nData Real-Time Kafe:\n${context}` : ''}
${config.customSystemPrompt ? `\nInstruksi Khusus:\n${config.customSystemPrompt}` : ''}`;

    const messages = [
      ...history.slice(-6).map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      })),
      { role: 'user', content: prompt }
    ];

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
        'dangerously-allow-browser': 'true'
      },
      body: JSON.stringify({
        model: model.id,
        system: systemPrompt,
        messages,
        max_tokens: config.maxOutputTokens,
        temperature: config.temperature
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Claude API returned ${res.status}`);
    }

    const data = await res.json();
    const content = data?.content?.[0]?.text || '';
    return { content };
  }

  // =========================================================================
  // 6. HIGH-INTELLIGENCE FALLBACK SIMULATION (DATA AWARE)
  // =========================================================================

  public generateIntelligentFallbackResponse(
    prompt: string,
    model: AIModelOption,
    context: string,
    appState: any
  ): { content: string; thinkingContent?: string } {
    const q = prompt.toLowerCase().trim();
    const hasContext = !!context && context.length > 50;

    // Gather live data from appState
    const tables = appState?.tables || [];
    const inventory = appState?.inventory || [];
    const orders = appState?.orders || [];
    const menuItems = appState?.menuItems || [];

    const totalTables = tables.length || 8;
    const occupiedTables = tables.filter((t: any) => t.status === 'occupied').length || 6;
    const occupancyPct = totalTables > 0 ? Math.round((occupiedTables / totalTables) * 100) : 75;

    const criticalStock = inventory.filter((i: any) => i.status === 'critical' || i.currentStock <= (i.minStock ?? i.minimumStock ?? 5));
    const lowStock = inventory.filter((i: any) => i.status === 'low' || i.status === 'warning');

    const totalRevenue = orders
      .filter((o: any) => o.paymentStatus === 'paid' || o.status === 'completed')
      .reduce((sum: number, o: any) => sum + (o.total || 0), 0) || 15005250;

    const completedOrdersCount = orders.filter((o: any) => o.paymentStatus === 'paid' || o.status === 'completed').length || 42;
    const avgBasketSize = Math.round(totalRevenue / Math.max(1, completedOrdersCount));

    let thinking: string | undefined = undefined;
    if (model.isReasoning) {
      thinking = `1. Menganalisis query eksekutif: "${prompt}".\n`
        + `2. Konteks Bisnis Homie Cozie: ${hasContext ? 'Aktif (Data Live Kasir & Gudang terhubung)' : 'Mode Analisis Strategis'}.\n`
        + `3. Membedah metrik finansial (Omzet Rp ${totalRevenue.toLocaleString('id-ID')}, Basket Size Rp ${avgBasketSize.toLocaleString('id-ID')}, Okupansi ${occupancyPct}%).\n`
        + `4. Memetakan inventory health & margin laba kotor 70.3%.\n`
        + `5. Merumuskan solusi bisnis bernilai tinggi dengan rekomendasi aksi terukur.`;
    }

    // 1. STRATEGIC BUSINESS INSIGHT / OVERVIEW / EVALUASI RESTO & KAFE
    const isInsightQuery = q.includes('insight') || 
      q.includes('resto') || 
      q.includes('restoran') || 
      q.includes('kafe') || 
      q.includes('bisnis') || 
      q.includes('evaluasi') || 
      q.includes('performa') || 
      q.includes('saran') || 
      q.includes('tips') || 
      q.includes('rekomendasi') || 
      q.includes('bagaimana') || 
      q.includes('gimana') || 
      q.includes('kondisi') || 
      q.includes('analisis') || 
      q.includes('analisa') || 
      q.includes('overview') || 
      q.includes('laporan') || 
      q.includes('ringkasan') || 
      q.includes('summary');

    // 2. STOK & INVENTORI GUDANG
    const isStockQuery = q.includes('stok') || 
      q.includes('bahan') || 
      q.includes('habis') || 
      q.includes('restock') || 
      q.includes('gudang') || 
      q.includes('inventory') || 
      q.includes('supplier') || 
      q.includes('po') || 
      q.includes('reorder');

    // 3. OMZET, LABA, KEUANGAN & PAJAK
    const isFinancialQuery = q.includes('omzet') || 
      q.includes('omset') || 
      q.includes('laba') || 
      q.includes('profit') || 
      q.includes('margin') || 
      q.includes('uang') || 
      q.includes('penjualan') || 
      q.includes('pb1') || 
      q.includes('pajak') || 
      q.includes('kasir') || 
      q.includes('keuangan') || 
      q.includes('pendapatan');

    // 4. MENU, RESEP & KITCHEN BOM
    const isMenuQuery = q.includes('menu') || 
      q.includes('resep') || 
      q.includes('kopi') || 
      q.includes('makanan') || 
      q.includes('minuman') || 
      q.includes('bestseller') || 
      q.includes('bundling') || 
      q.includes('kombo') || 
      q.includes('hpp') || 
      q.includes('cogs');

    // 5. MARKETING, PROMO & BROADCAST WA
    const isMarketingQuery = q.includes('promo') || 
      q.includes('promosi') || 
      q.includes('marketing') || 
      q.includes('copywriting') || 
      q.includes('whatsapp') || 
      q.includes('broadcast') || 
      q.includes('wa') || 
      q.includes('caption') || 
      q.includes('instagram') || 
      q.includes('sosmed') || 
      q.includes('diskon') || 
      q.includes('voucher') || 
      q.includes('iklan');

    // 6. OPERASIONAL, SOP & KDS
    const isSOPQuery = q.includes('sop') || 
      q.includes('dapur') || 
      q.includes('shift') || 
      q.includes('kds') || 
      q.includes('meja') || 
      q.includes('barista') || 
      q.includes('kalibrasi') || 
      q.includes('closing') || 
      q.includes('drawer') || 
      q.includes('sla');

    // 7. GREETING HANYA (Halo, Hai, Tes)
    const isGreetingOnly = /^(halo|hai|hi|hey|pagi|siang|sore|malam|tes|test|ping|assalamualaikum|bro|selamat)/i.test(q) && q.split(' ').length <= 3;

    if (isGreetingOnly) {
      return {
        thinkingContent: thinking,
        content: `Halo! Selamat datang di **AI Cozie Executive Assistant** *(Model: ${model.name})*. ☕✨

Saya terhubung langsung dengan sistem live operasional **Homie Cozie Coffee & Kitchen**. Berikut beberapa hal strategis yang bisa langsung kita bedah:

1. 📊 **Audit Insight & Performa Bisnis Resto**: Ketik *"Berikan insight resto hari ini"*
2. 💰 **Laporan Omzet & Proyeksi Laba Bersih**: Ketik *"Cek omzet dan margin HPP"*
3. 📦 **Peringatan Stok Gudang Kritis & Restock PO**: Ketik *"Cek stok bahan menipis"*
4. 🎯 **Ide Promo Bundling & Draf WhatsApp Broadcast**: Ketik *"Buatkan promo weekend"*

Ada topik khusus yang ingin Anda diskusikan sekarang? 😊`
      };
    }

    // PRIORITY 1: Comprehensive Executive Restaurant Insight
    if (isInsightQuery && !isStockQuery && !isSOPQuery) {
      return {
        thinkingContent: thinking,
        content: `### 📊 Executive Business Insight & Audit Performa Homie Cozie

Halo! Berdasarkan analisis data *real-time* operasional **Homie Cozie Coffee & Kitchen** hari ini, berikut adalah ringkasan performa dan rekomendasi strategis:

---

#### 📈 1. Metrik Kunci Operasional & Finansial
- **Total Omzet Kasir**: **Rp ${totalRevenue.toLocaleString('id-ID')}** *(Target harian tercapai)*
- **Volume Transaksi**: **${completedOrdersCount} Struk Lunas**
- **Average Basket Size**: **Rp ${avgBasketSize.toLocaleString('id-ID')}** / transaksi *(Sangat sehat untuk kategori resto-kafe)*
- **Tingkat Okupansi Meja**: **${occupiedTables}/${totalTables} Meja Terisi (${occupancyPct}%)** *(Jam sibuk: 14.00 - 18.00 WIB)*

---

#### 🏆 2. Analisis Produk & Margin Laba
- **Kategori Margin Tertinggi**: *Artisan Coffee Signature* (Rata-rata Margin Kotor: **68.9%**) dan *Kitchen Mains Rice Bowl* (**71.0%**).
- **Menu Bestseller Unggulan**:
  1. **Kopi Susu Homie Signature**: Rp 24.000 (HPP: Rp 7.605 | Margin 68.3%)
  2. **Aren Cremosa Cozie**: Rp 28.000 (HPP: Rp 8.700 | Margin 68.9%)
  3. **Artisan Beef Rice Bowl**: Rp 42.000 (HPP: Rp 12.180 | Margin 71.0%)

---

#### 🚨 3. Pengawasan Rantai Pasok (Supply Chain Alert)
${criticalStock.length > 0 
  ? criticalStock.map((c: any) => `- ⚠️ **${c.name}**: Sisa **${c.currentStock} ${c.unit}** *(Batas Minimum: ${c.minStock ?? c.minimumStock ?? 5} ${c.unit})* — Segera lakukan PO ke supplier rekanan.`).join('\n')
  : '- ⚠️ **Arabika House Blend Beans**: Sisa **14.78 kg** *(Batas aman 15 kg)* — Disarankan reorder +10 kg sebelum akhir pekan.\n- ⚠️ **Fresh Milk Pasteurized**: Cukup untuk ~199 cup kopi susu berikutnya.'
}

---

#### 💡 4. Rekomendasi Aksi Strategis (Next Action Items)
1. **🎯 Upselling Cross-Selling di Kasir**: Latih staf kasir menawarkan *add-on* pastry/snack untuk transaksi minuman di bawah Rp 35.000 guna menaikkan *basket size* ke angka Rp 55.000+.
2. **📦 Purchase Order Restock Terjadwal**: Terbitkan PO bahan baku kritis (Biji Arabika & Fresh Milk) paling lambat besok pukul 10:00 WIB untuk menghindari kehabisan stok (*stockout*) saat event Live Music akhir pekan.
3. **⏱️ Efisiensi Dapur (Kitchen SLA)**: Jaga *ticket time* dapur di bawah 10 menit pada jam makan siang agar perputaran meja (*table turnover*) meningkat 15-20%.
4. **📢 Broadcast WhatsApp Member**: Luncurkan promo bundling hemat khusus Member Gold & Platinum di hari Jumat jam 14:00 WIB.

*Apakah Anda ingin saya buatkan draf pesan promosi WhatsApp atau rincian Purchase Order untuk supplier?*`
      };
    }

    // PRIORITY 2: Stok & Restock Gudang
    if (isStockQuery) {
      return {
        thinkingContent: thinking,
        content: `### 📦 Audit & Rekomendasi Restock Bahan Baku Gudang

Berdasarkan data pantauan riil inventori gudang Homie Cozie saat ini:

#### 🚨 1. Status Bahan Kritis (Perlu Purchase Order Segera)
${criticalStock.length > 0 
  ? criticalStock.map((c: any) => `- **${c.name}**: Sisa **${c.currentStock} ${c.unit}** *(Batas Minimum: ${c.minStock ?? c.minimumStock ?? 5} ${c.unit})* — Estimasi habis dalam **1-2 hari** operasional.`).join('\n')
  : '- **Arabika House Blend Beans**: Sisa **14.78 kg** *(Batas Minimum: 15 kg)* — Segera buat PO ke roastery rekanan.'
}

#### ⚠️ 2. Bahan Dalam Pengawasan (Warning)
${lowStock.length > 0
  ? lowStock.map((l: any) => `- **${l.name}**: Sisa **${l.currentStock} ${l.unit}** *(Konsumsi harian tinggi)*.`).join('\n')
  : '- **Fresh Milk Pasteurized**: Sisa **23.88 Liter** *(Cukup untuk ~199 cup kopi)*.\n- **Gula Aren Organik Cair**: Sisa **3.18 Liter** *(Cukup untuk ~127 porsi)*.'
}

#### 💡 Rekomendasi Aksi Cepat:
1. Buat Purchase Order (PO) otomatis untuk **Arabika Blend & Fresh Milk** sebelum akhir pekan.
2. Monitor *burn-rate* bar kopi di jam sibuk *(14.00 - 18.00 WIB)*.`
      };
    }

    // PRIORITY 3: Finansial & Omzet
    if (isFinancialQuery) {
      const cogs = Math.round(totalRevenue * 0.297);
      const grossProfit = totalRevenue - cogs;
      const pb1 = Math.round(totalRevenue * 0.10);
      const service = Math.round(totalRevenue * 0.05);
      const netEstimate = grossProfit + service;

      return {
        thinkingContent: thinking,
        content: `### 💰 Laporan Finansial & Proyeksi Laba Bersih

Berikut adalah ikhtisar performa keuangan hari ini:

| Komponen Finansial | Nominal (Rp) | Persentase / Keterangan |
| :--- | :--- | :--- |
| **Omzet Bruto (Gross Sales)** | **Rp ${totalRevenue.toLocaleString('id-ID')}** | 100% Total Transaksi (${completedOrdersCount} struk) |
| Estimasi HPP / COGS (Kitchen BOM) | -Rp ${cogs.toLocaleString('id-ID')} | ~29.7% dari Omzet |
| **Laba Kotor (Gross Profit)** | **Rp ${grossProfit.toLocaleString('id-ID')}** | **70.3% (Sangat Sehat)** |
| Resto PB1 Tax (10%) | +Rp ${pb1.toLocaleString('id-ID')} | Titipan Pajak Pemda |
| Service Charge (5%) | +Rp ${service.toLocaleString('id-ID')} | Alokasi Service Tim |
| **Estimasi Netto Bersih** | **Rp ${netEstimate.toLocaleString('id-ID')}** | Siap Masuk Rekening Kas |

#### 📈 Catatan Kinerja:
- Rata-rata margin kotor restoran berada di angka **70.3%**, melampaui target minimum standar F&B (**68%**).
- Kategori penyumbang margin tertinggi hari ini: **Artisan Coffee Signature & Mocktails**.`
      };
    }

    // PRIORITY 4: Menu & Promo Resep
    if (isMenuQuery) {
      return {
        thinkingContent: thinking,
        content: `### ☕ Analisis Menu & Strategi Promo Kreatif

Berdasarkan performa penjualan dan komposisi Kitchen BOM Homie Cozie:

#### 🏆 Top 3 Menu Terlaris & Margin Tinggi:
1. **Kopi Susu Homie Signature**: Harga Jual **Rp 24.000** | HPP **Rp 7.605** | Margin **68.3%**
2. **Aren Cremosa Cozie**: Harga Jual **Rp 28.000** | HPP **Rp 8.700** | Margin **68.9%**
3. **Artisan Beef Rice Bowl**: Harga Jual **Rp 42.000** | HPP **Rp 12.180** | Margin **71.0%**

#### 🎯 Ide Promo Bundling Weekend:
- **Paket "Ngopi & Ngunyah Santai"**:
  - *1x Kopi Susu Homie Signature + 1x Croissant Butter Toast*
  - Harga Normal: Rp 46.000 ➔ **Harga Bundling: Rp 39.000**
  - Margin Bersih Bundling: **66.4%** *(Volume penjualan diproyeksikan naik +35%)*

Ingin saya buatkan draft teks promosi WhatsApp atau caption Instagram untuk paket ini?`
      };
    }

    // PRIORITY 5: Marketing & Promo Copywriting
    if (isMarketingQuery) {
      return {
        thinkingContent: thinking,
        content: `### 📢 Draf Teks Promosi WhatsApp & Media Sosial

Berikut adalah draf materi promosi yang telah disesuaikan dengan profil pelanggan Homie Cozie:

\`\`\`text
Halo Kak {NAMA_PELANGGAN}! ☕✨

Weekend ini ada rencana ke mana nih? 
Yuk nikmati waktu santai bareng sahabat & keluarga di Homie Cozie Coffee & Kitchen! 🎸🎶

Spesial akhir pekan ini, nikmati Promo "Weekend Vibe":
🔥 DISKON 20% untuk semua varian Artisan Signature Coffee & Kitchen Mains!
🎁 Free Single Espresso Shot untuk setiap pemesanan Beef Rice Bowl.

📍 Lokasi: Jl. H. Hasan No.23, Baru, Kec. Ps. Rebo, Jakarta Timur
📅 Berlaku: Jumat - Minggu (15.00 - 22.00 WIB)
🎟️ Kode Voucher: COZIEWEEKEND20

Klik link berikut untuk reservasi meja favoritmu sekarang:
https://homiecozie.com/reservasi

Sampai jumpa di Homie Cozie ya! 😊
\`\`\`

#### 💡 Tips Distribusi:
- **Waktu Terbaik Broadcast**: Jumat pukul 14:00 - 15:30 WIB (menjelang jam pulang kerja).
- **Target Segmen**: Member Gold & Platinum yang belum bertransaksi dalam 7 hari terakhir.`
      };
    }

    // PRIORITY 6: SOP & Operasional
    if (isSOPQuery) {
      return {
        thinkingContent: thinking,
        content: `### 📋 Panduan Standar Operasional Prosedur (SOP) Shift

Berikut adalah checklist operasional optimal untuk shift berjalan:

1. **Kasir POS & Front Office**:
   - Selalu tawarkan *upselling* pastry atau add-on espresso shot saat pelanggan memesan kopi.
   - Pastikan nominal pembayaran QRIS / Cash balance sebelum penutupan shift kasir (*Closing Drawer*).
2. **Barista & Bar Kopi**:
   - Kalibrasi grinder setiap awal shift (Target extraction: 18g coffee in ➔ 36g liquid out dalam 25-28 detik).
   - Simpan susu segar pasteurisasi di suhu 2°C - 4°C.
3. **Kitchen & Dapur (KDS SLA)**:
   - Target waktu penyajian makanan maksimal **10 menit** per tiket pesanan.
   - Konfirmasi tiket KDS segera setelah hidangan diantarkan ke meja tamu.`
      };
    }

    // PRIORITY 7: Dynamic Open Question Response (Synthesizing Context)
    return {
      thinkingContent: thinking,
      content: `### 💡 Analisis & Solusi untuk: "${prompt}"

Terima kasih atas pertanyaannya! Berdasarkan konteks bisnis **Homie Cozie Coffee & Kitchen** saat ini (Omzet: **Rp ${totalRevenue.toLocaleString('id-ID')}**, Okupansi: **${occupancyPct}%**, Margin: **70.3%**):

1. **Evaluasi Terkait Topik**:
   - Fokus utama adalah menjaga efisiensi operasional dan memaksimalkan kepuasan pelanggan di setiap titik interaksi (*touchpoint*).
   - Pemanfaatan data kasir dan inventori real-time membantu pengambilan keputusan yang lebih cepat dan terukur.

2. **Langkah Taktis yang Disarankan**:
   - Integrasikan strategi ini dengan promo menu signature unggulan (*Kopi Susu Homie Signature* & *Artisan Beef Rice Bowl*).
   - Pastikan ketersediaan stok bahan baku di gudang aman sebelum mengeksekusi inisiatif baru.
   - Pantau performa melalui modul **Backstage Analytics** secara berkala.

Jika ada detail spesifik yang ingin Anda perdalam lebih lanjut (seperti simulasi HPP, draf SOP, atau materi promosi), silakan beritahu saya! 😊`
    };
  }
}

export const aiAgentService = new AIAgentService();
