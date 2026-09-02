# Technical Design Specification: Backoffice Multi-Model Chat AI Agent Subsystem

**Date:** 2026-09-02  
**Target Product:** Homie Cozie Coffee & Kitchen Backoffice  
**Module Identifier:** `MOD-AI-CHAT` (`ai_chat` / `ai_agent`)  
**Route:** `#backstage/ai_agent`  

---

## 1. Overview & Objectives

Provide a unified, highly adaptable, enterprise-grade **Chat AI Agent Interface** inside the Homie Cozie Backoffice. The system empowers the cafe owner, management, and operational staff to engage in intelligent dialogues for both cafe-specific business intelligence (dynamic context injection from live POS, inventory, recipe BOM, and table data) and open-ended general intelligence (marketing ideas, translation, business strategy, coding, etc.).

---

## 2. Core Functional Requirements

### 2.1 Multi-Provider & Model Switcher
Support direct API key integration and model switching across leading providers:
1. **Google Gemini**:
   - `gemini-2.5-flash` (Default, ultra-fast & smart)
   - `gemini-2.5-pro` (Deep reasoning & executive summaries)
   - `gemini-1.5-flash` / `gemini-1.5-pro`
2. **OpenAI**:
   - `gpt-4o`
   - `gpt-4o-mini`
   - `o3-mini` (High speed reasoning)
3. **Anthropic Claude**:
   - `claude-3-5-sonnet-20241022`
   - `claude-3-5-haiku-20241022`
4. **DeepSeek**:
   - `deepseek-chat` (DeepSeek-V3)
   - `deepseek-reasoner` (DeepSeek-R1 with chain of thought)
5. **Custom / Local / OpenRouter / Groq**:
   - Custom Base URL (e.g., `http://localhost:11434/v1`, `https://openrouter.ai/api/v1`, `https://api.groq.com/openai/v1`)
   - Custom Model Name string
6. **Smart Built-in Simulation Fallback**:
   - Works immediately out-of-the-box even before API keys are entered, delivering accurate, data-aware responses tailored to Homie Cozie's live database.

### 2.2 Persistent Conversation History (Session Management)
- Store all conversation threads persistently in `localStorage` under `homie_cozie_ai_chat_sessions`.
- **Thread Management**:
  - `+ Sesi Baru (New Chat)`
  - Auto-generated conversation titles based on the user's opening prompt.
  - Manual rename thread capability.
  - Delete individual thread with confirmation.
  - Clear all chat history.
  - Export chat transcript as Markdown (`.md`) or JSON.
  - Persistent active thread state (`homie_cozie_ai_active_session_id`).

### 2.3 Smart Cafe Context Injection (Dynamic RAG)
- **Context Injection Toggle (`🟢 Data Kafe: Aktif` / `⚪ Mode Umum`)**:
  - When **Active**: Injects live snapshot from `useAppStore` into system prompt:
    - Today's sales revenue & transaction counts.
    - Low stock and critical inventory ingredients.
    - Kitchen BOM recipe costings and profit margins.
    - Floor plan table occupancy and waitlist status.
    - Menu categories and top-selling artisan coffee items.
  - When **Inactive**: Operates in pure general assistant mode with zero cafe constraints.

### 2.4 Conversational UI & Rich Formatting
- **Full-Screen Responsive Chat Interface**:
  - Left collapsible sidebar for thread history & provider settings.
  - Main message stream with smooth auto-scroll.
  - Rich Markdown renderer (Markdown tables, lists, bold/italic, code blocks with syntax highlighting and Copy Code action).
  - Chain-of-Thought / Reasoning Accordion (`🧠 Proses Berpikir (Thinking)`) for reasoning models.
  - Quick action buttons on messages: *Salin Teks (Copy)*, *Regenerate*, *Edit Prompt*.
  - Voice Speech-to-Text mic input (Web Speech API).
  - Quick Prompt suggestion chips.

---

## 3. Data Schema & State Architecture

### 3.1 Types (`src/types.ts` & `src/services/aiAgentService.ts`)

```typescript
export type AIProviderId = 'gemini' | 'openai' | 'claude' | 'deepseek' | 'custom';

export interface AIModelOption {
  id: string;
  name: string;
  provider: AIProviderId;
  description: string;
  isReasoning?: boolean;
  maxTokens?: number;
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
  systemPrompt?: string;
}
```

---

## 4. Navigation & RBAC Integration

- Add `ai_agent` (`MOD-AI-CHAT`) to `BackstageNavModuleId` in `src/types.ts`.
- Add module metadata in `src/components/BackstageOps/EnterpriseBackoffice.tsx`:
  - Label: `"AI Cozie Assistant"`
  - Description: `"Chat Agent Cerdas Multi-Model dengan Konteks Live Kafe"`
  - Category: `"MANAJEMEN & CRM"`
- Configure permission in `src/utils/rbac.ts` so `super_admin`, `owner`, `manager`, `cashier`, `kitchen_staff`, `marketing`, and `reservation_staff` can access the assistant.

---

## 5. Verification Plan

1. **Model Switcher & Config**:
   - Verify selecting Gemini, OpenAI, Claude, DeepSeek, and Custom API Endpoint.
   - Verify saving API keys and custom Base URLs.
2. **Persistent Conversation History**:
   - Verify creating new chats, auto-titling, switching between chats, refreshing the page, and confirming history persistence.
3. **Smart Context Injection**:
   - Verify querying cafe-specific data (e.g., omzet, stok kopi, margin resep) with context enabled.
4. **Markdown & Code Rendering**:
   - Verify formatting of lists, tables, code snippets with copy button, and thinking process accordion.
5. **Responsive Viewports**:
   - Verify on Mobile (375x667) with collapsible thread drawer and Desktop (1280x800).
