# Backoffice Multi-Model Chat AI Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-featured, persistent, multi-model Chat AI Agent subsystem inside the Homie Cozie Backoffice (`#backstage/ai_agent`) supporting Gemini, OpenAI, Claude, DeepSeek, Custom APIs, smart live cafe context injection, and conversation history.

**Architecture:** A standalone reactive engine service (`aiAgentService.ts`) manages provider configs, dynamic system prompt RAG injection, multi-thread persistence (`localStorage`), and multi-provider dispatching with intelligent local simulation fallback. A high-end full-page component (`AIChatAgentView.tsx`) delivers an artisan chat interface with Markdown formatting, code block actions, reasoning accordions, and session history management.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Lucide React, Motion, LocalStorage Persistence, Web Speech API.

**Spec:** `docs/superpowers/specs/2026-09-02-backoffice-ai-agent-chat-design.md`

## Global Constraints
- High-contrast, WCAG-compliant artisan design aligned with Homie Cozie brand guidelines.
- Persistent session storage in `localStorage` (`homie_cozie_ai_chat_sessions`, `homie_cozie_ai_providers_config`).
- Zero console errors; graceful fallback simulation if no API keys are provided.
- Fully responsive on mobile (375x667) and desktop (1280x800).

---

### Task 1: Core Types & AI Agent Engine Service

**Files:**
- Create: `src/services/aiAgentService.ts`
- Modify: `src/types.ts`

**Interfaces:**
- Produces:
  - `AIProviderId`, `AIModelOption`, `AIChatMessage`, `AIChatSession`, `AIProviderConfig`
  - `aiAgentService.getSessions()`, `aiAgentService.createSession()`, `aiAgentService.saveMessage()`
  - `aiAgentService.sendMessage({ sessionId, prompt, modelId, providerId, withCafeContext })`
  - `aiAgentService.buildCafeContextSnapshot(appState)`

- [ ] **Step 1: Update types in `src/types.ts` with `BackstageNavModuleId` updated to include `ai_agent`**
- [ ] **Step 2: Implement `src/services/aiAgentService.ts` with model catalogs, localStorage persistence, RAG snapshot generator, and multi-provider API caller with fallback simulator**
- [ ] **Step 3: Verify TypeScript compilation passes with zero errors**

---

### Task 2: RBAC & Backoffice Navigation Registration

**Files:**
- Modify: `src/utils/rbac.ts`
- Modify: `src/components/BackstageOps/EnterpriseBackoffice.tsx`

**Interfaces:**
- Consumes: `BackstageNavModuleId` from `src/types.ts`
- Produces: `ai_agent` navigation item under `MANAJEMEN & CRM`, role access entries for all roles in RBAC matrix.

- [ ] **Step 1: Add `ai_agent` module metadata, label ("AI Cozie Assistant"), and icon (`Bot` / `Sparkles`) to navigation menu in `EnterpriseBackoffice.tsx`**
- [ ] **Step 2: Add permission definition in `rbac.ts` allowing Backoffice roles access to `ai_agent`**
- [ ] **Step 3: Verify router hash `#backstage/ai_agent` activates the module**

---

### Task 3: Build Chat AI Agent UI Component (`AIChatAgentView.tsx`)

**Files:**
- Create: `src/components/BackstageOps/ai/AIChatAgentView.tsx`

**Interfaces:**
- Consumes: `aiAgentService`, `useAppStore`
- Produces: Full-page chat UI with session drawer, model switcher, prompt suggestions, markdown renderer, reasoning accordion, and settings modal.

- [ ] **Step 1: Create `AIChatAgentView.tsx` with collapsible sessions sidebar, search, new chat, rename, and delete actions**
- [ ] **Step 2: Implement main message stream with Markdown parser, code copy buttons, and DeepSeek-R1 reasoning accordions**
- [ ] **Step 3: Implement bottom input bar with speech-to-text voice input, model switcher chip, quick starter pills, and API settings modal**
- [ ] **Step 4: Verify responsive styling on mobile (375x667) and desktop (1280x800)**

---

### Task 4: Mount Component in Backoffice & End-to-End Verification

**Files:**
- Modify: `src/components/BackstageOps/EnterpriseBackoffice.tsx`

**Interfaces:**
- Consumes: `AIChatAgentView` from `src/components/BackstageOps/ai/AIChatAgentView.tsx`

- [ ] **Step 1: Mount `<AIChatAgentView />` inside `EnterpriseBackoffice.tsx` under `activeModule === 'ai_agent'`**
- [ ] **Step 2: Test sending prompts with Cafe Context enabled (e.g. asking about revenue, low stocks, menu margins)**
- [ ] **Step 3: Test multi-model selection (Gemini, OpenAI, Claude, DeepSeek, Custom API)**
- [ ] **Step 4: Test creating multiple chat sessions, switching threads, refreshing page, and confirming history persistence**
- [ ] **Step 5: Verify build & compilation with zero errors**
