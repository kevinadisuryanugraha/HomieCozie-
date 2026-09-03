import React, { useState } from 'react';
import { 
  Presentation, 
  Sparkles, 
  CheckCircle2, 
  Target, 
  TrendingUp, 
  Layers, 
  ShieldCheck, 
  DollarSign, 
  Calendar, 
  Users, 
  HelpCircle, 
  FileText,
  ChevronRight,
  ExternalLink,
  Zap,
  Lock,
  Key,
  Shield,
  Database,
  Server,
  ArrowRight,
  Code2,
  Clock,
  Smartphone,
  Eye,
  Edit3,
  Ban,
  Check,
  AlertTriangle,
  Lightbulb,
  Cpu
} from 'lucide-react';
import { 
  PRD_ROADMAP_SLIDES, 
  CAFE_INFO, 
  PRD_FULL_MODULES,
  RBAC_PERMISSION_MATRIX,
  MIDDLEWARE_CHAIN_STEPS,
  CORE_DATA_ENTITIES,
  API_ENDPOINT_SPECS,
  MOCK_SYSTEM_USERS
} from '../../data/mockData';
import { UserRole } from '../../types';

interface PitchDeckModalProps {
  onSwitchToCustomerDemo: () => void;
  onSwitchToBackstageDemo: () => void;
}

export const PitchDeckModal: React.FC<PitchDeckModalProps> = ({
  onSwitchToCustomerDemo,
  onSwitchToBackstageDemo
}) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [selectedBudgetPack, setSelectedBudgetPack] = useState<'starter' | 'pro' | 'enterprise'>('starter');
  const [selectedRBACTab, setSelectedRBACTab] = useState<'matrix' | 'middleware' | 'auth_strategy' | 'security'>('matrix');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<UserRole | 'all'>('all');
  const [selectedModuleCategory, setSelectedModuleCategory] = useState<string>('all');
  const [activeMiddlewareStep, setActiveMiddlewareStep] = useState<number>(1);
  const [apiFilterGroup, setApiFilterGroup] = useState<string>('all');

  const slides = [
    {
      id: 'exec-summary',
      title: '1. Ringkasan Eksekutif & Riset Bisnis',
      badge: 'Bagian 1–4 • 6 Tahun & KPI',
      icon: Target
    },
    {
      id: 'brand-fragmentation',
      title: '2. Temuan Kunci: Brand Fragmentation & Persona',
      badge: 'Bagian 2 & 5 • Kalisari vs Cijantung',
      icon: Sparkles
    },
    {
      id: 'full-modules',
      title: '3. 12 Modul Enterprise (Modul A – L)',
      badge: 'Bagian 6 • Peta Sistem Penuh',
      icon: Layers
    },
    {
      id: 'auth-rbac-middleware',
      title: '4. Deep Dive: Auth, RBAC & Middleware',
      badge: 'Bagian 8 • Fondasi Keamanan',
      icon: ShieldCheck
    },
    {
      id: 'schema-api',
      title: '5. Skema Data (15 Entitas) & REST API',
      badge: 'Bagian 9 & 10 • Arsitektur Teknis',
      icon: Database
    },
    {
      id: 'roadmap-phases',
      title: '6. Roadmap 4 Fase & Pemetaan Modul',
      badge: 'Bagian 11 & 12 • Fase 1 hingga 4',
      icon: TrendingUp
    },
    {
      id: 'package-pricing',
      title: '7. Pemetaan Paket & Kalkulator Investasi',
      badge: 'Starter vs Pro vs Enterprise',
      icon: DollarSign
    },
    {
      id: 'meeting-tactics',
      title: '8. Panduan Strategi Meeting dengan Owner',
      badge: 'Bagian 13 & 14 • Bahan Diskusi',
      icon: Users
    }
  ];

  const roleLabels: Record<UserRole, string> = {
    super_admin: 'Super Admin (Hansco)',
    owner: 'Owner (Pemilik)',
    manager: 'Manager / Supervisor',
    cashier: 'Kasir',
    reservation_staff: 'Staff Reservasi',
    kitchen_staff: 'Staff Dapur',
    marketing: 'Marketing / Sosmed',
    member: 'Member',
    guest: 'Guest'
  };

  const getPermissionBadge = (perm: 'F' | 'E' | 'L' | 'T') => {
    switch (perm) {
      case 'F':
        return <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">F (Full)</span>;
      case 'E':
        return <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">E (Edit)</span>;
      case 'L':
        return <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">L (Lihat)</span>;
      case 'T':
      default:
        return <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-400 border border-slate-200">T (Nol)</span>;
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 text-slate-800">
      
      {/* Presentation Ribbon Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-7 rounded-3xl border border-slate-700 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 text-white">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white uppercase tracking-wider">
              PRD Draft v2 • Bahan Diskusi Meeting
            </span>
            <span className="text-xs text-emerald-300 font-mono">Disiapkan oleh: Hansco Digital • 26 Agustus 2026</span>
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white">
            Ekosistem Digital Homie Cozie Coffee & Kitchen
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl font-light leading-relaxed">
            Full Restaurant Management System (Enterprise-Grade) — Working draft internal untuk memetakan reputasi 6 tahun dan rating 4.8 Google menjadi ekosistem digital mandiri, aman, dan meningkatkan omzet.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={onSwitchToCustomerDemo}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all shadow-sm"
          >
            ☕ Buka Demo Web Tamu
          </button>
          <button
            onClick={onSwitchToBackstageDemo}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold border border-emerald-500 shadow-md transition-all"
          >
            📊 Buka Demo Backstage POS
          </button>
        </div>
      </div>

      {/* Main Slide Deck Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-xs">
        {slides.map((s, idx) => {
          const Icon = s.icon;
          const isActive = activeSlide === idx;

          return (
            <button
              key={s.id}
              onClick={() => setActiveSlide(idx)}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                isActive
                  ? 'bg-emerald-600 border-emerald-700 text-white shadow-md font-semibold ring-2 ring-emerald-500/30'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
                <span className="text-[10px] opacity-75 font-mono">0{idx + 1}</span>
              </div>
              <span className="text-[11px] leading-tight line-clamp-2">{s.title}</span>
            </button>
          );
        })}
      </div>

      {/* SLIDE 1: Executive Summary, Business Context & KPIs */}
      {activeSlide === 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
          <div>
            <span className="text-xs font-semibold uppercase text-emerald-600 tracking-wider">Slide 01 • Ringkasan Eksekutif & Riset Bisnis</span>
            <h3 className="font-serif font-bold text-2xl text-slate-900 mt-1">
              Aset Besar 6 Tahun yang Belum Terkonversi Maksimal
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Homie Cozie memiliki kualitas produk dan reputasi teruji, namun masih beroperasi dengan cara manual yang membatasi pertumbuhan.
            </p>
          </div>

          {/* 3 Key Profil Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-emerald-50/60 p-4 sm:p-5 rounded-2xl border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-800 font-bold uppercase">Aset Kualitas Produk</span>
                <span className="text-xs font-mono font-bold text-emerald-900">± 6 Tahun</span>
              </div>
              <div className="font-serif text-3xl font-bold text-slate-900">4.8 ★ Google</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                250+ Ulasan Asli Google, harga terjangkau (± Rp 25k–50k/orang), dan konsistensi rasa yang sudah dicintai warga Pasar Rebo.
              </p>
            </div>

            <div className="bg-rose-50 p-4 sm:p-5 rounded-2xl border border-rose-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-rose-800 font-bold uppercase">Bottleneck Operasional</span>
                <span className="text-xs font-mono font-bold text-rose-700">100% Chat WA</span>
              </div>
              <div className="font-serif text-2xl font-bold text-rose-700">Manual & Tidak Scalable</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reservasi & tanya menu via Linktree (4 tombol). Admin kewalahan saat jam ramai, tanpa database pelanggan terpusat.
              </p>
            </div>

            <div className="bg-amber-50 p-4 sm:p-5 rounded-2xl border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-amber-800 font-bold uppercase">Diferensiasi Komunitas</span>
                <span className="text-xs font-mono font-bold text-amber-900">Tiap Weekend</span>
              </div>
              <div className="font-serif text-2xl font-bold text-amber-900">Live Music & #PITSTOP</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Event rutin komunitas motor dan live music belum terhubung langsung ke corong konversi reservasi meja otomatis.
              </p>
            </div>
          </div>

          {/* 6 Core Problems Grid */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-base text-slate-900">
              6 Masalah Utama Hasil Riset Bisnis Hansco Digital:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-mono text-[10px] flex items-center justify-center font-bold">1</span>
                  Brand Fragmentation
                </div>
                <p className="text-slate-600">Histori nama & lokasi ganda bikin pencarian lokal terpecah antara "Kalisari" vs "Cijantung".</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-mono text-[10px] flex items-center justify-center font-bold">2</span>
                  Semua Proses Manual
                </div>
                <p className="text-slate-600">Reservasi & tanya menu 100% via WA, tidak scalable saat jam padat akhir pekan.</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-mono text-[10px] flex items-center justify-center font-bold">3</span>
                  Tidak Ada CRM Database
                </div>
                <p className="text-slate-600">Sulit membangun program loyalitas/repeat order tanpa data pelanggan 6 tahun.</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-mono text-[10px] flex items-center justify-center font-bold">4</span>
                  Minim Kontrol Google Search
                </div>
                <p className="text-slate-600">Hanya mengandalkan listing pihak ketiga & IG, bukan properti digital milik sendiri.</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-mono text-[10px] flex items-center justify-center font-bold">5</span>
                  Event Belum Jadi Funnel
                </div>
                <p className="text-slate-600">Live music & komunitas masih sebatas konten feed IG, tidak terhubung ke booking.</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-mono text-[10px] flex items-center justify-center font-bold">6</span>
                  Tanpa Kontrol Akses (RBAC)
                </div>
                <p className="text-slate-600">Data omzet & pelanggan rawan bocor jika kasir, dapur, dan marketing berbagi akun.</p>
              </div>
            </div>
          </div>

          {/* Product Vision & KPI Target Table */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h4 className="font-semibold text-sm text-slate-900">Visi Produk & Target Keberhasilan (KPI)</h4>
                <p className="text-xs text-slate-500 italic">"Menjadikan Homie Cozie destinasi nongkrong #1 di kawasan Kalisari–Cijantung."</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Target Terukur
              </span>
            </div>

            <div className="overflow-x-auto scroll-smooth w-full">
              <table className="w-full text-left text-xs text-slate-700 min-w-[520px]">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 whitespace-nowrap">
                  <tr>
                    <th className="py-2.5 px-3">Tujuan Bisnis</th>
                    <th className="py-2.5 px-3">Metrik Pengukuran</th>
                    <th className="py-2.5 px-3 text-right">Target Indikatif</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Kurangi Beban Admin Manual</td>
                    <td className="py-2.5 px-3">% reservasi lewat sistem otomatis vs chat WA</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-900">≥60% dalam 3 bulan</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Perkuat Local SEO Pasar Rebo</td>
                    <td className="py-2.5 px-3">Halaman 1 Google "cafe Kalisari" & "cafe Cijantung"</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-900">Top 5 dalam 3–6 bulan</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Naikkan Repeat Visit Loyalitas</td>
                    <td className="py-2.5 px-3">% transaksi dari pelanggan terdaftar (member)</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-900">≥25% dalam 6 bulan</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Efisiensi Konfirmasi Booking</td>
                    <td className="py-2.5 px-3">Waktu rata-rata konfirmasi reservasi meja</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-900">Hitungan Jam → Instan</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Keamanan & Governance RBAC</td>
                    <td className="py-2.5 px-3">Insiden akses tidak sah / kebocoran data omzet</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-900">0 Insiden (Aman)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE 2: Brand Fragmentation & Persona Mapping */}
      {activeSlide === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
          <div>
            <span className="text-xs font-semibold uppercase text-emerald-600 tracking-wider">Slide 02 • Core Diagnosis & Persona</span>
            <h3 className="font-serif font-bold text-2xl text-slate-900 mt-1">
              Mengatasi Brand Fragmentation: Kalisari vs Cijantung
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Alasan utama kenapa setelah 6 tahun masih ada pelanggan yang belum menemukan lokasi aktif di Jl. H. Hasan No. 23.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-200 space-y-3">
              <div className="text-xs font-bold text-rose-800 uppercase flex items-center gap-1.5">
                <Ban className="w-4 h-4 text-rose-600" /> Kondisi Sebelum Solusi (Saat Ini):
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span>Histori nama lama <em>"Homie.Cozie Cafe & Eatery Kalisari II No. 74"</em> masih membingungkan pencari Google Maps.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span>Hanya punya Linktree (4 tombol), tidak terindeks kata kunci Google seperti "cafe live music Cijantung".</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span>Data menu dan harga tercecer di aplikasi pihak ketiga tanpa kontrol pemilik kafe.</span>
                </li>
              </ul>
            </div>

            <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200 space-y-3">
              <div className="text-xs font-bold text-emerald-800 uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Solusi Ekosistem Hansco (Website + Local SEO):
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Dual Keyword Targeting:</strong> Optimasi terstruktur mencakup kata kunci Kalisari & Cijantung di alamat aktif Jl. H. Hasan No. 23.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Website Resmi Milik Sendiri:</strong> Schema markup bisnis lokal, rating 4.8 tampil terpercaya di hasil pencarian Google.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Konversi Instan:</strong> Pengunjung pencarian Google langsung bisa melihat menu HD & booking meja real-time.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Persona Mapping Table (Bagian 5) */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-semibold text-sm text-slate-900">Target Pengguna & Persona (Bagian 5 PRD)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">Pelanggan Baru</div>
                <p className="text-slate-600 text-[11px]">Discovery via Google/IG, butuh info menu, suasana, dan booking cepat.</p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">Pelanggan Setia</div>
                <p className="text-slate-600 text-[11px]">Kemudahan booking ulang, Cozie Points, promo ultah, info live music.</p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">Owner/Manajemen</div>
                <p className="text-slate-600 text-[11px]">Dashboard omzet, data pelanggan, laporan operasional, kontrol RBAC.</p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">Staff (Kasir/Dapur)</div>
                <p className="text-slate-600 text-[11px]">Alat POS & KDS yang menyederhanakan tugas sesuai kewenangan.</p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">Tim Marketing</div>
                <p className="text-slate-600 text-[11px]">Kalender event #PITSTOP & WA broadcast promo terhubung ke data CRM.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE 3: 12 Enterprise Modules (Modul A - L) */}
      {activeSlide === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold uppercase text-emerald-600 tracking-wider">Slide 03 • Modul & Fitur — Full System</span>
              <h3 className="font-serif font-bold text-2xl text-slate-900 mt-1">
                12 Modul Arsitektur Restoran Skala Penuh (Modul A – L)
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Peta jalan lengkap sistem enterprise. Setiap modul ditandai fase pelaksanaannya.
              </p>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {['all', 'Fase 1', 'Fase 2', 'Fase 3', 'Fase 4'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedModuleCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                    selectedModuleCategory === cat
                      ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'Semua Modul (12)' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* 12 Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRD_FULL_MODULES
              .filter(m => selectedModuleCategory === 'all' || m.phase.includes(selectedModuleCategory))
              .map((mod) => (
                <div key={mod.code} className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold font-mono text-xs flex items-center justify-center">
                        {mod.code}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        mod.phaseNumber === 1
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : mod.phaseNumber === 2
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : mod.phaseNumber === 3
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-purple-100 text-purple-800 border border-purple-300'
                      }`}>
                        {mod.phase}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-sm text-slate-900">
                      Modul {mod.code}. {mod.name}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {mod.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Fitur Kunci:</span>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {mod.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-tight">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SLIDE 4: Deep Dive — Auth, RBAC & Middleware (Bagian 8) */}
      {activeSlide === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold uppercase text-emerald-600 tracking-wider">Slide 04 • Deep Dive Arsitektur Keamanan (Bagian 8)</span>
              <h3 className="font-serif font-bold text-2xl text-slate-900 mt-1">
                Autentikasi, Middleware Berlapis, & Role-Based Access Control (RBAC)
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Fondasi keamanan selevel jaringan resto besar untuk mencegah kebocoran data omzet & manipulasi kasir.
              </p>
            </div>

            {/* Sub-tabs for Section 8 */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
              {[
                { id: 'matrix', label: '8.3 Permission Matrix' },
                { id: 'middleware', label: '8.4 Middleware Chain' },
                { id: 'auth_strategy', label: '8.1–8.2 Auth & Roles' },
                { id: 'security', label: '8.5 Governance' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedRBACTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    selectedRBACTab === tab.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* SUB-VIEW 1: Interactive Permission Matrix (Section 8.3) */}
          {selectedRBACTab === 'matrix' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">Matriks Hak Akses (9 Roles x 9 Modul)</h4>
                  <p className="text-slate-500">Setiap endpoint API diverifikasi langsung terhadap matriks ini sebelum logika bisnis dijalankan.</p>
                </div>
                
                {/* Role Filter Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-semibold">Filter Peran:</span>
                  <select
                    value={selectedRoleFilter}
                    onChange={(e) => setSelectedRoleFilter(e.target.value as any)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all">Semua Peran (9 Roles)</option>
                    <option value="super_admin">Super Admin (Hansco)</option>
                    <option value="owner">Owner (Pemilik)</option>
                    <option value="manager">Manager / Supervisor</option>
                    <option value="cashier">Kasir Frontline</option>
                    <option value="reservation_staff">Staff Reservasi</option>
                    <option value="kitchen_staff">Staff Dapur (Kitchen)</option>
                    <option value="marketing">Marketing / Sosmed</option>
                    <option value="member">Member</option>
                    <option value="guest">Guest (Pengunjung)</option>
                  </select>
                </div>
              </div>

              {/* Matrix Table */}
              <div className="overflow-x-auto scroll-smooth border border-slate-200 rounded-2xl shadow-sm w-full">
                <table className="w-full text-left text-xs min-w-[750px]">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 whitespace-nowrap">
                    <tr>
                      <th className="py-3 px-3 min-w-[180px]">Modul & Ruang Lingkup</th>
                      {(selectedRoleFilter === 'all' || selectedRoleFilter === 'super_admin') && <th className="py-3 px-2 text-center">Super Admin</th>}
                      {(selectedRoleFilter === 'all' || selectedRoleFilter === 'owner') && <th className="py-3 px-2 text-center">Owner</th>}
                      {(selectedRoleFilter === 'all' || selectedRoleFilter === 'manager') && <th className="py-3 px-2 text-center">Manager</th>}
                      {(selectedRoleFilter === 'all' || selectedRoleFilter === 'cashier') && <th className="py-3 px-2 text-center">Kasir</th>}
                      {(selectedRoleFilter === 'all' || selectedRoleFilter === 'reservation_staff') && <th className="py-3 px-2 text-center">Reservasi</th>}
                      {(selectedRoleFilter === 'all' || selectedRoleFilter === 'kitchen_staff') && <th className="py-3 px-2 text-center">Dapur</th>}
                      {(selectedRoleFilter === 'all' || selectedRoleFilter === 'marketing') && <th className="py-3 px-2 text-center">Marketing</th>}
                      {(selectedRoleFilter === 'all' || selectedRoleFilter === 'member') && <th className="py-3 px-2 text-center">Member</th>}
                      {(selectedRoleFilter === 'all' || selectedRoleFilter === 'guest') && <th className="py-3 px-2 text-center">Guest</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {RBAC_PERMISSION_MATRIX.map((row) => (
                      <tr key={row.moduleCode} className="hover:bg-slate-50/80">
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900">{row.moduleName}</div>
                          <div className="text-[11px] text-slate-500">{row.description}</div>
                        </td>
                        {(selectedRoleFilter === 'all' || selectedRoleFilter === 'super_admin') && (
                          <td className="py-3 px-2 text-center">{getPermissionBadge(row.permissions.super_admin)}</td>
                        )}
                        {(selectedRoleFilter === 'all' || selectedRoleFilter === 'owner') && (
                          <td className="py-3 px-2 text-center">{getPermissionBadge(row.permissions.owner)}</td>
                        )}
                        {(selectedRoleFilter === 'all' || selectedRoleFilter === 'manager') && (
                          <td className="py-3 px-2 text-center">{getPermissionBadge(row.permissions.manager)}</td>
                        )}
                        {(selectedRoleFilter === 'all' || selectedRoleFilter === 'cashier') && (
                          <td className="py-3 px-2 text-center">{getPermissionBadge(row.permissions.cashier)}</td>
                        )}
                        {(selectedRoleFilter === 'all' || selectedRoleFilter === 'reservation_staff') && (
                          <td className="py-3 px-2 text-center">{getPermissionBadge(row.permissions.reservation_staff)}</td>
                        )}
                        {(selectedRoleFilter === 'all' || selectedRoleFilter === 'kitchen_staff') && (
                          <td className="py-3 px-2 text-center">{getPermissionBadge(row.permissions.kitchen_staff)}</td>
                        )}
                        {(selectedRoleFilter === 'all' || selectedRoleFilter === 'marketing') && (
                          <td className="py-3 px-2 text-center">{getPermissionBadge(row.permissions.marketing)}</td>
                        )}
                        {(selectedRoleFilter === 'all' || selectedRoleFilter === 'member') && (
                          <td className="py-3 px-2 text-center">{getPermissionBadge(row.permissions.member)}</td>
                        )}
                        {(selectedRoleFilter === 'all' || selectedRoleFilter === 'guest') && (
                          <td className="py-3 px-2 text-center">{getPermissionBadge(row.permissions.guest)}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Legend Explainer */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800">Legenda RBAC:</span>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span><strong>F (Full):</strong> Akses penuh membuat, mengubah, menghapus</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span><strong>E (Edit):</strong> Terbatas sesuai ruang lingkupnya</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span><strong>L (Lihat):</strong> Read-only tanpa izin modifikasi</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                  <span><strong>T (Tidak Ada):</strong> Akses ditolak sistem</span>
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW 2: Middleware Request Chain (Section 8.4) */}
          {selectedRBACTab === 'middleware' && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1 text-xs">
                <h4 className="font-bold text-slate-900 text-sm">Alur Eksekusi Middleware (Fail-Fast Architecture)</h4>
                <p className="text-slate-600">
                  Prinsip utama: Setiap request HTTP harus melewati 6 gerbang validasi. Jika satu gerbang gagal (misal token kedaluwarsa atau role tidak mencukupi), eksekusi langsung diputus sebelum menyentuh database F&B.
                </p>
              </div>

              {/* Interactive Step Navigator */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
                {MIDDLEWARE_CHAIN_STEPS.map((step) => (
                  <button
                    key={step.step}
                    onClick={() => setActiveMiddlewareStep(step.step)}
                    className={`p-3 rounded-2xl border text-left transition-all space-y-1 ${
                      activeMiddlewareStep === step.step
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">GERBANG {step.step}</span>
                    </div>
                    <div className="font-bold text-xs line-clamp-1">{step.name}</div>
                  </button>
                ))}
              </div>

              {/* Active Step Details */}
              {(() => {
                const current = MIDDLEWARE_CHAIN_STEPS.find(s => s.step === activeMiddlewareStep) || MIDDLEWARE_CHAIN_STEPS[0];
                return (
                  <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-lg space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-emerald-400 text-xs font-mono font-bold uppercase">Gerbang #{current.step} • {current.name}</span>
                        <h4 className="font-mono text-lg font-bold text-slate-100">{current.code}</h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Fail-Fast: {current.failAction}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <strong className="text-slate-400 block uppercase tracking-wider text-[10px]">Tujuan & Fungsi:</strong>
                        <p className="text-slate-200 text-sm leading-relaxed">{current.purpose}</p>
                      </div>

                      <div className="space-y-1 bg-slate-950/80 p-3 rounded-xl border border-slate-800 font-mono text-[11px]">
                        <strong className="text-slate-400 block uppercase tracking-wider text-[10px]">Respons Jika Ditolak:</strong>
                        <span className="text-rose-400 font-bold">{current.failAction}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* SUB-VIEW 3: Auth Strategy & Role Hierarchy (Section 8.1 & 8.2) */}
          {selectedRBACTab === 'auth_strategy' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Staff Strategy */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    <span>Autentikasi Internal (Staff, Manager, Owner)</span>
                  </div>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Login dengan Email + Password kuat. Hashing password menggunakan <strong>bcrypt / argon2</strong> (tidak pernah simpan plaintext).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>Dual Token:</strong> JWT access token pendek (15 menit) + Refresh token rotasi httpOnly cookie.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>2FA Opsional:</strong> Lapisan kode verifikasi kedua untuk role Owner & Super Admin.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>Session Control:</strong> Fitur force logout device lain saat ada staff yang resign.</span>
                    </li>
                  </ul>
                </div>

                {/* Member Strategy */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    <span>Autentikasi Pelanggan (Member & Guest)</span>
                  </div>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span><strong>WhatsApp OTP Login:</strong> Member login tanpa perlu mengingat password, sesuai kebiasaan F&B kasual di Indonesia.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span><strong>Guest Direct Booking:</strong> Tamu bisa langsung pesan meja tanpa daftar, data nama & nomor WA otomatis diproses.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span><strong>Profil Terisolasi:</strong> Member hanya memiliki hak akses `E` (edit) pada data profil dan reservasi miliknya sendiri.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Role Hierarchy Diagram (8.2) */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3 text-xs font-mono">
                <div className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">8.2 Diagram Hierarki Peran (Role Hierarchy)</div>
                <pre className="text-slate-300 leading-relaxed overflow-x-auto text-[11px]">
{`Super Admin  (Hansco Digital — Technical Control & Master Config)
   │
Owner  (Pemilik Homie Cozie — Full Business Control, P&L & Approval)
   │
Manager / Supervisor  (Operasional Harian, Void Approval, Shift)
   │
   ├── Kasir (POS, Input Poin, Pembayaran)
   ├── Staff Reservasi (Manajemen Meja, Konfirmasi WA)
   ├── Staff Dapur (Kitchen Display KDS, Input Penyesuaian Stok)
   └── Marketing / Admin Sosmed (Event #PITSTOP, WA Broadcast)
   
Member (Pelanggan Terdaftar — Poin Reward, History Order)
Guest  (Pengunjung Tanpa Akun — QR Order, Reservasi Meja)`}
                </pre>
              </div>
            </div>
          )}

          {/* SUB-VIEW 4: Governance & Security (Section 8.5) */}
          {selectedRBACTab === 'security' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <strong className="text-slate-900 font-bold block text-sm">Audit Log Aksi Sensitif (8.5)</strong>
                <p className="text-slate-600">
                  Semua tindakan krusial (void transaksi kasir, perubahan harga menu, penyesuaian role staff, penghapusan data meja) dicatat secara permanen di tabel `audit_logs` bersama ID staff, IP address, dan timestamp.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <strong className="text-slate-900 font-bold block text-sm">Auto-Revoke Saat Staff Resign</strong>
                <p className="text-slate-600">
                  Saat status karyawan diubah menjadi `inactive` di panel Admin, seluruh refresh token dan sesi aktif di perangkat HP/laptop staff tersebut otomatis hangus seketika tanpa perlu ganti password manual.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <strong className="text-slate-900 font-bold block text-sm">Enkripsi Data At Rest & In Transit</strong>
                <p className="text-slate-600">
                  Nomor telepon pelanggan dan data finansial dienkripsi pada basis data (at rest) dan dikomunikasikan secara aman melalui protokol HTTPS/TLS 1.3 modern (in transit).
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <strong className="text-slate-900 font-bold block text-sm">Backup Database Otomatis</strong>
                <p className="text-slate-600">
                  Cadangan basis data PostgreSQL/Supabase dilakukan otomatis setiap hari, menjamin histori transaksi 6 tahun aman dari kegagalan server.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SLIDE 5: Data Schema & RESTful API (Bagian 9 & 10) */}
      {activeSlide === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
          <div>
            <span className="text-xs font-semibold uppercase text-emerald-600 tracking-wider">Slide 05 • Skema Data & Endpoint REST API</span>
            <h3 className="font-serif font-bold text-2xl text-slate-900 mt-1">
              15 Entitas Basis Data Inti & Arsitektur API
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Struktur data relasional yang scalable dan siap menampung ribuan transaksi dari Fase 1 hingga ekspansi cabang.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: 15 Entities Table */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="font-bold text-sm text-slate-900">15 Entitas Basis Data (Bagian 9)</h4>
                <span className="text-xs text-slate-500 font-mono">PostgreSQL / Supabase</span>
              </div>

              <div className="overflow-x-auto max-h-[360px] overflow-y-auto border border-slate-200 rounded-2xl scroll-smooth w-full">
                <table className="w-full text-left text-xs min-w-[450px]">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 sticky top-0 whitespace-nowrap">
                    <tr>
                      <th className="py-2 px-3">Tabel Entitas</th>
                      <th className="py-2 px-3">Deskripsi Singkat</th>
                      <th className="py-2 px-3 text-right">Fase</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {CORE_DATA_ENTITIES.map((ent, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono font-bold text-emerald-800">{ent.name}</td>
                        <td className="py-2 px-3 text-slate-600">{ent.description}</td>
                        <td className="py-2 px-3 text-right font-mono text-[11px] text-slate-500">{ent.phase}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: API Endpoints Explorer */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="font-bold text-sm text-slate-900">Spesifikasi Endpoint API (Bagian 10)</h4>
                <div className="flex items-center gap-1 text-[11px]">
                  {['all', 'Auth', 'Reservasi', 'POS', 'CRM'].map((grp) => (
                    <button
                      key={grp}
                      onClick={() => setApiFilterGroup(grp)}
                      className={`px-2 py-0.5 rounded font-semibold transition-all ${
                        apiFilterGroup === grp
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {grp}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto max-h-[360px] overflow-y-auto border border-slate-200 rounded-2xl scroll-smooth w-full">
                <table className="w-full text-left text-xs min-w-[520px]">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 sticky top-0 whitespace-nowrap">
                    <tr>
                      <th className="py-2 px-2.5">Method & Path</th>
                      <th className="py-2 px-2.5">Deskripsi</th>
                      <th className="py-2 px-2.5 text-right">Role Minimum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {API_ENDPOINT_SPECS
                      .filter(ep => apiFilterGroup === 'all' || ep.moduleGroup.includes(apiFilterGroup))
                      .map((ep, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-2 px-2.5 font-mono">
                            <span className={`inline-block px-1.5 py-0.2 rounded font-bold text-[10px] mr-1.5 ${
                              ep.method === 'GET'
                                ? 'bg-blue-100 text-blue-800'
                                : ep.method === 'POST'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {ep.method}
                            </span>
                            <span className="text-slate-800 text-[11px]">{ep.path}</span>
                          </td>
                          <td className="py-2 px-2.5 text-slate-600 text-[11px]">{ep.description}</td>
                          <td className="py-2 px-2.5 text-right font-mono text-[10px] font-bold text-emerald-900">
                            {ep.minRoleLabel}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE 6: 4-Phase Roadmap (Bagian 11) */}
      {activeSlide === 5 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
          <div>
            <span className="text-xs font-semibold uppercase text-emerald-600 tracking-wider">Slide 06 • Roadmap Bertahap (Bagian 11 & 12)</span>
            <h3 className="font-serif font-bold text-2xl text-slate-900 mt-1">
              Peta Jalan 4 Fase: Dari Fondasi Hingga Enterprise
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pendekatan bertahap memastikan klien tidak terbebani anggaran di awal dan langsung mendapatkan hasil nyata sejak Fase 1.
            </p>
          </div>

          <div className="space-y-4">
            {PRD_ROADMAP_SLIDES.map((slide, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="font-serif font-bold text-base text-slate-900">
                      {slide.phase}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-slate-200 text-slate-800 font-semibold">
                      {slide.modules}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {slide.packageTarget}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600">
                  <strong className="text-slate-900">Masalah yang Diselesaikan:</strong> {slide.problemSolved}
                </p>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-800 block">Deliverables Kunci:</span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600">
                    {slide.deliverables.map((d, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-200 text-xs text-emerald-900 font-semibold">
                  🎯 <strong>Target KPI:</strong> {slide.kpi}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SLIDE 7: Investment Packages & Budget Mapping */}
      {activeSlide === 6 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
          <div>
            <span className="text-xs font-semibold uppercase text-emerald-600 tracking-wider">Slide 07 • Pemetaan Paket & Investasi Klien</span>
            <h3 className="font-serif font-bold text-2xl text-slate-900 mt-1">
              Paket Hansco Digital untuk Homie Cozie
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Menyesuaikan kebutuhan riil kafe dengan opsi investasi yang fleksibel dan terukur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Starter Pack */}
            <div className={`rounded-2xl p-5 border-2 transition-all flex flex-col justify-between space-y-4 ${
              selectedBudgetPack === 'starter'
                ? 'bg-slate-50 border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-white border-slate-200'
            }`}>
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-emerald-600 uppercase">Titik Awal Negosiasi (Fase 1)</span>
                <h4 className="font-serif font-bold text-xl text-slate-900">Fase 1 Starter Pack</h4>
                <div className="font-serif font-bold text-2xl text-emerald-900">Rp 1.250.000</div>
                <p className="text-xs text-slate-500">
                  Ideal untuk langsung menyelesaikan masalah SEO Kalisari/Cijantung, reservasi otomatis, dan auth dasar.
                </p>

                <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
                  <li className="flex items-center gap-1.5">✓ <strong>Modul A:</strong> Website Landing Page Resmi</li>
                  <li className="flex items-center gap-1.5">✓ <strong>Modul A:</strong> Dual Local SEO Pasar Rebo</li>
                  <li className="flex items-center gap-1.5">✓ <strong>Modul B:</strong> Reservasi Meja Real-time</li>
                  <li className="flex items-center gap-1.5">✓ <strong>Modul I:</strong> Social Proof Rating 4.8 Google</li>
                  <li className="flex items-center gap-1.5">✓ <strong>Modul L:</strong> Autentikasi & RBAC Dasar</li>
                </ul>
              </div>

              <button
                onClick={() => setSelectedBudgetPack('starter')}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                Pilih Paket Starter
              </button>
            </div>

            {/* Pro Pack */}
            <div className={`rounded-2xl p-5 border-2 transition-all flex flex-col justify-between space-y-4 ${
              selectedBudgetPack === 'pro'
                ? 'bg-slate-50 border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-white border-slate-200'
            }`}>
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-emerald-600 uppercase">Paling Direkomendasikan (Fase 1+2)</span>
                <h4 className="font-serif font-bold text-xl text-slate-900">Growth Pro Pack</h4>
                <div className="font-serif font-bold text-2xl text-emerald-900">Rp 2.850.000</div>
                <p className="text-xs text-slate-500">
                  Termasuk QR Order Meja, Homie Rewards CRM, Event Calendar #PITSTOP, dan Laporan Omzet.
                </p>

                <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
                  <li className="flex items-center gap-1.5">✓ Semua fitur Paket Starter</li>
                  <li className="flex items-center gap-1.5">✓ <strong>Modul C:</strong> QR Table Order di Meja</li>
                  <li className="flex items-center gap-1.5">✓ <strong>Modul E:</strong> CRM & Cozie Points Loyalty</li>
                  <li className="flex items-center gap-1.5">✓ <strong>Modul J:</strong> Event Hub Live Music / #PITSTOP</li>
                  <li className="flex items-center gap-1.5">✓ <strong>Modul H:</strong> Dashboard Analitik Omzet</li>
                </ul>
              </div>

              <button
                onClick={() => setSelectedBudgetPack('pro')}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                Pilih Paket Pro
              </button>
            </div>

            {/* Full Enterprise Suite */}
            <div className={`rounded-2xl p-5 border-2 transition-all flex flex-col justify-between space-y-4 ${
              selectedBudgetPack === 'enterprise'
                ? 'bg-slate-50 border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-white border-slate-200'
            }`}>
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-blue-600 uppercase">Sistem Komplit (Fase 1–3)</span>
                <h4 className="font-serif font-bold text-xl text-slate-900">Full Operations Suite</h4>
                <div className="font-serif font-bold text-2xl text-blue-700">Rp 5.500.000+</div>
                <p className="text-xs text-slate-500">
                  Cloud POS Kasir, Kitchen Display (KDS), Manajemen Stok COGS, dan Shift Pegawai.
                </p>

                <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
                  <li className="flex items-center gap-1.5">✓ Semua fitur Starter & Pro</li>
                  <li className="flex items-center gap-1.5">✓ <strong>Modul D:</strong> Cloud POS & Kasir Terintegrasi</li>
                  <li className="flex items-center gap-1.5">✓ <strong>Modul D:</strong> Layar Dapur KDS Live</li>
                  <li className="flex items-center gap-1.5">✓ <strong>Modul F:</strong> Stok Bahan Baku & COGS Control</li>
                  <li className="flex items-center gap-1.5">✓ <strong>Modul G:</strong> Jadwal Shift & HR Staf</li>
                </ul>
              </div>

              <button
                onClick={() => setSelectedBudgetPack('enterprise')}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                Pilih Full Suite
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SLIDE 8: Meeting Tactics & Next Steps (Bagian 13 & 14) */}
      {activeSlide === 7 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
          <div>
            <span className="text-xs font-semibold uppercase text-emerald-600 tracking-wider">Slide 08 • Catatan Strategi Meeting & Next Steps</span>
            <h3 className="font-serif font-bold text-2xl text-slate-900 mt-1">
              Panduan Taktis untuk Diskusi Meeting dengan Owner (Bagian 13 & 14)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Langkah-langkah strategis agar meeting Selasa siang berjalan meyakinkan dan langsung mengunci kesepakatan Fase 1.
            </p>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-700">
            
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">1</span>
              <div>
                <strong className="text-slate-900 block mb-0.5">Buka dengan Apresiasi 6 Tahun & Rating 4.8:</strong>
                <span>Puji pencapaian bisnis mereka yang sudah bertahan 6 tahun dengan 250+ ulasan positif. Tunjukkan bahwa masalahnya bukan di rasa kopi/makanan, melainkan di kehadiran digital yang belum mandiri.</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">2</span>
              <div>
                <strong className="text-slate-900 block mb-0.5">Gunakan "Brand Fragmentation" sebagai Hook Pembuka:</strong>
                <span>Jelaskan kebingungan warga antara "Kalisari" dan "Cijantung" pasca perpindahan alamat. Ini justifikasi kuat kenapa SEO Lokal masuk di Fase 1 (bukan sekadar bikin website biasa).</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">3</span>
              <div>
                <strong className="text-slate-900 block mb-0.5">Tunjukkan Full System sebagai Visi Jangka Panjang, Kunci di Fase 1:</strong>
                <span>Tunjukkan demo KDS, CRM, dan POS sebagai roadmap masa depan, lalu arahkan keputusan ke Fase 1 Starter Pack (Rp 1.250.000) sebagai langkah awal yang terjangkau agar langsung deal.</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">4</span>
              <div>
                <strong className="text-slate-900 block mb-0.5">Siapkan Jawaban Keamanan & RBAC (Bagian 8):</strong>
                <span>Jika owner bertanya soal keamanan data omzet atau pembagian akun kasir/dapur, tunjukkan Bagian 8 PRD ini sebagai bukti bahwa sistem dirancang rapi dengan isolasi peran dan audit trail.</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">5</span>
              <div>
                <strong className="text-slate-900 block mb-0.5">Catat Peluang Profil Personal Owner:</strong>
                <span>Owner sempat menyebut minat membuat profil personal juga. Catat ini sebagai peluang lanjutan (di luar scope Homie Cozie F&B ini).</span>
              </div>
            </div>

          </div>

          {/* 3 Langkah Selanjutnya (Bagian 14) */}
          <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 space-y-3">
            <h4 className="font-semibold text-sm text-emerald-950">3 Langkah Konkret Selanjutnya (Bagian 14):</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-1">
                <span className="font-mono font-bold text-emerald-900">Langkah 1</span>
                <p className="text-slate-700">Validasi prioritas modul langsung dengan owner saat meeting Selasa siang.</p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-1">
                <span className="font-mono font-bold text-emerald-900">Langkah 2</span>
                <p className="text-slate-700">Kunci scope & harga Fase 1 berdasarkan budget riil (acuan: Starter Rp 1.250.000).</p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-1">
                <span className="font-mono font-bold text-emerald-900">Langkah 3</span>
                <p className="text-slate-700">Tunjukkan demo visual web & reservasi meja (Modul A & B) secara interaktif.</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
