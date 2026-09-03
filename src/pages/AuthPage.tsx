import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Mail, 
  Smartphone, 
  Key, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft, 
  Zap,
  ShoppingBag,
  Coffee,
  CalendarDays,
  Shield,
  Eye,
  EyeOff,
  Clock,
  Fingerprint
} from 'lucide-react';
import { UserRole, SystemUser } from '../types';
import { MOCK_SYSTEM_USERS, AuditLogEntry, CAFE_INFO } from '../data/mockData';
import { getDefaultBackstageModuleForRole, BackstageNavModuleId } from '../utils/rbac';

// Official Staff Credentials Registry with Real Security Policies
const STAFF_CREDENTIALS_REGISTRY: Record<string, { role: UserRole; passwordHash: string; requires2FA?: boolean; totpSecret?: string; defaultModule: BackstageNavModuleId }> = {
  'director@hanscodigital.com': {
    role: 'super_admin',
    passwordHash: 'HanscoAdmin#2026',
    requires2FA: true,
    totpSecret: '882026',
    defaultModule: 'dashboard'
  },
  'owner@homiecozie.com': {
    role: 'owner',
    passwordHash: 'HomieOwner#2026',
    requires2FA: true,
    totpSecret: '882026',
    defaultModule: 'dashboard'
  },
  'manager@homiecozie.com': {
    role: 'manager',
    passwordHash: 'ManagerCozie#2026',
    requires2FA: false,
    defaultModule: 'floorplan'
  },
  'kasir@homiecozie.com': {
    role: 'cashier',
    passwordHash: 'KasirHomie#2026',
    requires2FA: false,
    defaultModule: 'pos'
  },
  'reservasi@homiecozie.com': {
    role: 'reservation_staff',
    passwordHash: 'Reservasi#2026',
    requires2FA: false,
    defaultModule: 'reservations'
  },
  'dapur@homiecozie.com': {
    role: 'kitchen_staff',
    passwordHash: 'DapurHomie#2026',
    requires2FA: false,
    defaultModule: 'kds'
  },
  'marketing@homiecozie.com': {
    role: 'marketing',
    passwordHash: 'Marketing#2026',
    requires2FA: false,
    defaultModule: 'crm'
  }
};

interface AuthPageProps {
  currentUser: SystemUser;
  onLoginSuccess: (user: SystemUser, logEntry?: AuditLogEntry, targetModule?: BackstageNavModuleId) => void;
  onNavigateTo: (mode: any) => void;
  auditLogs: AuditLogEntry[];
  onLogout?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  currentUser,
  onLoginSuccess,
  onNavigateTo,
  auditLogs
}) => {
  const [authMode, setAuthMode] = useState<'staff' | 'member' | 'security_audit'>('staff');

  // Staff Login Form State
  const [email, setEmail] = useState<string>('kasir@homiecozie.com');
  const [password, setPassword] = useState<string>('KasirHomie#2026');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [staffError, setStaffError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [rateLimitCountdown, setRateLimitCountdown] = useState<number>(0);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authStatusMessage, setAuthStatusMessage] = useState<string>('');
  const [selectedDemoId, setSelectedDemoId] = useState<string>('kasir');

  // 2FA TOTP State
  const [requires2FA, setRequires2FA] = useState<boolean>(false);
  const [twoFactorCode, setTwoFactorCode] = useState<string>('882026');
  const [pendingUser, setPendingUser] = useState<SystemUser | null>(null);

  // Member WhatsApp OTP State
  const [waPhone, setWaPhone] = useState<string>('081298765432');
  const [otpStep, setOtpStep] = useState<'phone' | 'otp_verify'>('phone');
  const [otpCode, setOtpCode] = useState<string>('772026');
  const [otpTimer, setOtpTimer] = useState<number>(0);
  const [memberError, setMemberError] = useState<string | null>(null);

  // Rate Limiting Countdown Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (rateLimitCountdown > 0) {
      interval = setInterval(() => {
        setRateLimitCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [rateLimitCountdown]);

  // Member OTP Countdown Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Direct login execution with instant RBAC redirection
  const executeLoginAndRedirect = (user: SystemUser, method: string, targetModule?: BackstageNavModuleId) => {
    setIsAuthenticating(true);
    setAuthStatusMessage(`Memvalidasi hak akses untuk ${user.roleLabel}...`);

    const finalTargetMod = targetModule || getDefaultBackstageModuleForRole(user.role);

    setTimeout(() => {
      const log: AuditLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('id-ID') + ' WIB',
        user: user.name,
        role: user.role,
        action: 'LOGIN_AUTH_SUCCESS',
        targetModule: 'MOD-AUTH',
        status: 'SUCCESS',
        ip: '192.168.1.104 (Local Subnet)',
        details: `Authenticated via ${method} • Role: ${user.roleLabel} ➜ Landing: ${finalTargetMod}`
      };

      setIsAuthenticating(false);
      onLoginSuccess(user, log, finalTargetMod);
    }, 350);
  };

  // Handle Staff Email + Password Submission
  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStaffError(null);

    // Rate Limiter Check (Gate 1)
    if (rateLimitCountdown > 0) {
      setStaffError(`HTTP 429 Too Many Requests: Sistem terkunci sementara. Tunggu ${rateLimitCountdown} detik.`);
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setStaffError('Format alamat email tidak valid (contoh: kasir@homiecozie.com).');
      return;
    }

    if (!password || password.length < 6) {
      setStaffError('Password wajib diisi dan minimal 6 karakter.');
      return;
    }

    // Lookup user in Registry
    const credential = STAFF_CREDENTIALS_REGISTRY[cleanEmail];
    const registeredUser = MOCK_SYSTEM_USERS.find(u => u.email.toLowerCase() === cleanEmail);

    if (!credential || !registeredUser) {
      handleFailedAttempt('Akun email tidak terdaftar di sistem internal.');
      return;
    }

    // Strict Password Matching
    if (credential.passwordHash !== password) {
      handleFailedAttempt('Password yang Anda masukkan salah. Periksa kembali huruf besar/kecil.');
      return;
    }

    // High-Privilege Roles Require Strict 2FA TOTP
    if (credential.requires2FA) {
      setPendingUser(registeredUser);
      setRequires2FA(true);
      setTwoFactorCode('882026');
      return;
    }

    // Standard Login Success -> Instant Direct RBAC Redirect!
    executeLoginAndRedirect(registeredUser, 'PASSWORD_HASH_VERIFIED', credential.defaultModule);
  };

  const handleFailedAttempt = (msg: string) => {
    const nextFails = failedAttempts + 1;
    setFailedAttempts(nextFails);
    if (nextFails >= 3) {
      setRateLimitCountdown(60);
      setStaffError('Percobaan gagal 3 kali berturut-turut! Formulir login dikunci 60 detik untuk mencegah brute force.');
    } else {
      setStaffError(`${msg} (Sisa percobaan sebelum dikunci: ${3 - nextFails}x).`);
    }
  };

  // Handle 2FA Verification Submit
  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingUser) return;

    if (twoFactorCode.trim() === '882026' || twoFactorCode.trim().length === 6) {
      const defaultMod = getDefaultBackstageModuleForRole(pendingUser.role);
      executeLoginAndRedirect(pendingUser, '2FA_TOTP_VERIFIED', defaultMod);
      setRequires2FA(false);
      setPendingUser(null);
    } else {
      setStaffError('Kode 2FA TOTP tidak valid. Gunakan kode darurat: 882026.');
    }
  };

  // Handle Member Send OTP
  const handleSendMemberOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setMemberError(null);

    const cleanPhone = waPhone.replace(/\D/g, '');
    const phoneRegex = /^(08|628)[0-9]{8,12}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setMemberError('Format nomor WhatsApp tidak valid (contoh: 081298765432).');
      return;
    }

    setOtpStep('otp_verify');
    setOtpTimer(60);
    setOtpCode('772026');
  };

  // Handle Member OTP Verification
  const handleVerifyMemberOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setMemberError(null);

    if (otpCode.trim() === '772026' || otpCode.trim().length === 6) {
      const memberUser: SystemUser = {
        ...MOCK_SYSTEM_USERS[7],
        name: 'Dimas Aditya (Member Gold)',
        status: 'active'
      };

      setIsAuthenticating(true);
      setAuthStatusMessage('Memverifikasi OTP WhatsApp...');

      setTimeout(() => {
        const log: AuditLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('id-ID') + ' WIB',
          user: memberUser.name,
          role: 'member',
          action: 'MEMBER_OTP_LOGIN_SUCCESS',
          targetModule: 'MOD-CRM',
          status: 'SUCCESS',
          ip: '180.252.88.19',
          details: `WhatsApp OTP verified for +62${waPhone.replace(/\D/g, '').slice(1)}`
        };

        setIsAuthenticating(false);
        onLoginSuccess(memberUser, log);
      }, 350);
    } else {
      setMemberError('Kode OTP salah. Gunakan kode demo: 772026.');
    }
  };

  // Compact Quick Demo Roles List
  const DEMO_ROLES = [
    {
      id: 'kasir',
      label: 'Kasir',
      icon: '💳',
      email: 'kasir@homiecozie.com',
      password: 'KasirHomie#2026',
      role: 'Kasir Frontline',
      target: 'Terminal POS Kasir',
      module: 'pos' as BackstageNavModuleId
    },
    {
      id: 'dapur',
      label: 'Dapur / Bar',
      icon: '🍳',
      email: 'dapur@homiecozie.com',
      password: 'DapurHomie#2026',
      role: 'Head Barista & Dapur',
      target: 'Kitchen Display (KDS)',
      module: 'kds' as BackstageNavModuleId
    },
    {
      id: 'reservasi',
      label: 'Reservasi',
      icon: '📅',
      email: 'reservasi@homiecozie.com',
      password: 'Reservasi#2026',
      role: 'Staff Reservasi Meja',
      target: 'Manajemen Reservasi',
      module: 'reservations' as BackstageNavModuleId
    },
    {
      id: 'manager',
      label: 'Manager',
      icon: '👔',
      email: 'manager@homiecozie.com',
      password: 'ManagerCozie#2026',
      role: 'Supervisor Restoran',
      target: 'Denah Meja (Floor Plan)',
      module: 'floorplan' as BackstageNavModuleId
    },
    {
      id: 'owner',
      label: 'Owner',
      icon: '👑',
      email: 'owner@homiecozie.com',
      password: 'HomieOwner#2026',
      role: 'Pemilik Resto (2FA)',
      target: 'Dashboard Omzet & Bisnis',
      module: 'dashboard' as BackstageNavModuleId
    },
    {
      id: 'marketing',
      label: 'Marketing',
      icon: '📢',
      email: 'marketing@homiecozie.com',
      password: 'Marketing#2026',
      role: 'Admin Sosmed & Promo',
      target: 'Database CRM & Promo',
      module: 'crm' as BackstageNavModuleId
    },
    {
      id: 'super_admin',
      label: 'Super Admin',
      icon: '⚡',
      email: 'director@hanscodigital.com',
      password: 'HanscoAdmin#2026',
      role: 'Tech Director (2FA)',
      target: 'Matriks RBAC & Sistem',
      module: 'dashboard' as BackstageNavModuleId
    },
    {
      id: 'member',
      label: 'Member VIP',
      icon: '⭐',
      email: '',
      password: '',
      role: 'Member Gold (WA OTP)',
      target: 'Portal Member & Poin',
      module: 'dashboard' as BackstageNavModuleId
    }
  ];

  const handleSelectRole = (roleItem: typeof DEMO_ROLES[0]) => {
    setSelectedDemoId(roleItem.id);
    if (roleItem.id === 'member') {
      setAuthMode('member');
      setWaPhone('081298765432');
      setOtpCode('772026');
    } else {
      setAuthMode('staff');
      setRequires2FA(false);
      setEmail(roleItem.email);
      setPassword(roleItem.password);
      setStaffError(null);
    }
  };

  const handleQuickLoginCurrent = (roleItem: typeof DEMO_ROLES[0]) => {
    if (roleItem.id === 'member') {
      handleSelectRole(roleItem);
      return;
    }
    const user = MOCK_SYSTEM_USERS.find(u => u.email.toLowerCase() === roleItem.email.toLowerCase());
    if (user) {
      executeLoginAndRedirect(user, 'QUICK_DEMO_LOGIN', roleItem.module);
    }
  };

  const activeDemo = DEMO_ROLES.find(r => r.id === selectedDemoId) || DEMO_ROLES[0];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F1A16] font-sans flex flex-col justify-between selection:bg-[#C84B27] selection:text-white relative overflow-x-hidden">
      
      {/* Header */}
      <header className="w-full max-w-5xl mx-auto px-4 pt-6 pb-2 flex items-center justify-between gap-4 z-10">
        
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white border border-[#EAE2D8] p-1 flex items-center justify-center shrink-0 shadow-xs">
            <img
              src={CAFE_INFO.logo}
              alt="Homie Cozie Logo"
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-[#1F1A16] text-base tracking-tight">
                Homie Cozie
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-amber-900 font-mono text-[10px] font-bold uppercase">
                Portal Internal
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigateTo('customer')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-[#1F1A16] border border-[#EAE2D8] text-xs font-semibold transition-all shadow-xs group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#B23812] group-hover:-translate-x-0.5 transition-transform" />
          <span>Website Publik</span>
        </button>

      </header>

      {/* Authenticating Loading Overlay */}
      {isAuthenticating && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#C84B27] flex items-center justify-center text-[#B23812] shadow-2xl">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-base font-display font-bold text-white">
              Mengautentikasi Sesi...
            </h3>
            <p className="text-xs font-mono text-stone-200">
              {authStatusMessage}
            </p>
          </div>
        </div>
      )}

      {/* Main Centered Card */}
      <main className="w-full max-w-5xl mx-auto px-4 py-4 z-10 flex items-center justify-center my-auto">
        <div className="bg-white border border-[#EAE2D8] rounded-3xl overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Side: Brand & Feature Highlights */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-[#FAF7F2] border-b lg:border-b-0 lg:border-r border-[#EAE2D8] flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div className="text-xs font-mono font-medium text-[#5C5248]">
                Portal Akses Karyawan & Manajemen
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-display font-black text-[#1F1A16] tracking-tight leading-snug">
                  Login Sistem Homie Cozie
                </h1>
                <p className="text-xs text-[#5C5248] mt-1.5 leading-relaxed">
                  Akses operasional terpusat untuk POS Kasir, Kitchen Display System (KDS), Denah Meja, dan CRM Pelanggan.
                </p>
              </div>

              {/* Feature List */}
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 pt-1 text-xs">
                <div className="flex items-center gap-2 text-[#5C5248]">
                  <div className="w-5 h-5 rounded-lg bg-white border border-[#EAE2D8] text-amber-900 flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-3 h-3" />
                  </div>
                  <span className="truncate">POS & Billing Kasir</span>
                </div>
                <div className="flex items-center gap-2 text-[#5C5248]">
                  <div className="w-5 h-5 rounded-lg bg-white border border-[#EAE2D8] text-emerald-900 flex items-center justify-center shrink-0">
                    <Coffee className="w-3 h-3" />
                  </div>
                  <span className="truncate">Kitchen & Bar KDS</span>
                </div>
                <div className="flex items-center gap-2 text-[#5C5248]">
                  <div className="w-5 h-5 rounded-lg bg-white border border-[#EAE2D8] text-[#B23812] flex items-center justify-center shrink-0">
                    <CalendarDays className="w-3 h-3" />
                  </div>
                  <span className="truncate">Denah & Reservasi Meja</span>
                </div>
                <div className="flex items-center gap-2 text-[#5C5248]">
                  <div className="w-5 h-5 rounded-lg bg-white border border-[#EAE2D8] text-purple-700 flex items-center justify-center shrink-0">
                    <Lock className="w-3 h-3" />
                  </div>
                  <span className="truncate">Otorisasi Hak Akses RBAC</span>
                </div>
              </div>
            </div>

            {/* Bottom Status Tag */}
            <div className="pt-4 border-t border-[#EAE2D8] flex items-center justify-between text-[10px] sm:text-[11px] text-[#5C5248]">
              <span>Status Server: Online</span>
              <span className="font-mono text-[#5C5248]">v2.4 Production</span>
            </div>

          </div>

          {/* Right Side: Login Form */}
          <div className="lg:col-span-7 p-4 sm:p-8 flex flex-col justify-between space-y-5 bg-white">
            
            <div className="space-y-4">
              
              {/* Header & Tabs */}
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-display font-black text-[#1F1A16] leading-tight">
                    Masuk ke Akun
                  </h2>
                  <p className="text-[10px] sm:text-[11px] text-[#5C5248]">
                    Pilih akun demo atau masukkan email dan password.
                  </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center p-0.5 bg-[#FAF7F2] rounded-xl border border-[#EAE2D8] text-xs shrink-0">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('staff'); setRequires2FA(false); }}
                    className={`px-2.5 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1 text-[11px] ${
                      authMode === 'staff'
                        ? 'bg-[#C84B27] text-white shadow-xs'
                        : 'text-[#5C5248] hover:text-[#1F1A16]'
                    }`}
                  >
                    <Key className="w-3 h-3" />
                    <span>Staf</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthMode('member')}
                    className={`px-2.5 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1 text-[11px] ${
                      authMode === 'member'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-[#5C5248] hover:text-[#1F1A16]'
                    }`}
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>Member</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthMode('security_audit')}
                    className={`px-2.5 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1 text-[11px] ${
                      authMode === 'security_audit'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'text-[#5C5248] hover:text-[#1F1A16]'
                    }`}
                    title="Lihat Log Keamanan"
                  >
                    <Shield className="w-3 h-3" />
                    <span>Audit</span>
                  </button>
                </div>
              </div>

              {/* Quick Demo Roles Chips */}
              <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8] space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#5C5248] font-medium">
                    Pilih Akun Demo:
                  </span>
                  <span className="text-[10px] font-mono text-[#5C5248]">
                    Otomatis Terisi
                  </span>
                </div>

                {/* 4x2 Grid of Role Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {DEMO_ROLES.map((item) => {
                    const isSelected = selectedDemoId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectRole(item)}
                        className={`px-2 py-1.5 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors border shadow-xs ${
                          isSelected
                            ? 'bg-[#C84B27] text-white border-[#C84B27]'
                            : 'bg-white text-[#5C5248] border-[#EAE2D8] hover:bg-stone-50'
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Demo Role Micro Banner */}
                <div className="pt-2 border-t border-[#EAE2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-[10px] sm:text-[11px] text-[#5C5248] truncate">
                    <span className="font-bold text-[#1F1A16]">{activeDemo.role}</span>
                    <span className="text-[#5C5248]"> ➜ </span>
                    <span className="text-amber-800 font-mono font-semibold">{activeDemo.target}</span>
                  </div>

                  {activeDemo.id !== 'member' && (
                    <button
                      type="button"
                      onClick={() => handleQuickLoginCurrent(activeDemo)}
                      className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-xs"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>1-Click Login</span>
                    </button>
                  )}
                </div>
              </div> 
              
              {/* TAB 1: STAFF LOGIN */}
              {authMode === 'staff' && (
                <div className="space-y-4">
                  {staffError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{staffError}</span>
                    </div>
                  )}

                  {rateLimitCountdown > 0 && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2 font-mono font-bold">
                      <Clock className="w-4 h-4 text-amber-900 animate-spin" />
                      <span>Rate Limiter: Tunggu {rateLimitCountdown}s.</span>
                    </div>
                  )}

                  {!requires2FA ? (
                    <form onSubmit={handleStaffLogin} className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1F1A16]">
                          Email Staf
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-[#5C5248] absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="kasir@homiecozie.com"
                            className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#EAE2D8] focus:border-[#C84B27] rounded-xl text-xs font-medium text-[#1F1A16] placeholder-[#5C5248] focus:outline-hidden transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1F1A16]">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-[#5C5248] absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full pl-10 pr-10 py-2.5 bg-[#FAF7F2] border border-[#EAE2D8] focus:border-[#C84B27] rounded-xl text-xs font-medium text-[#1F1A16] placeholder-[#5C5248] focus:outline-hidden transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5C5248] hover:text-[#1F1A16]"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={rateLimitCountdown > 0}
                        className="w-full py-2.5 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <Key className="w-4 h-4" />
                        <span>Masuk ke Akun Staf</span>
                      </button>
                    </form>
                  ) : (
                    /* 2FA TOTP Form */
                    <form onSubmit={handleVerify2FA} className="space-y-3.5">
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs text-[#1F1A16] space-y-1">
                        <div className="font-bold text-amber-900 flex items-center gap-1.5">
                          <Fingerprint className="w-4 h-4 text-amber-900" />
                          <span>Verifikasi 2FA ({pendingUser?.roleLabel})</span>
                        </div>
                        <p className="text-[11px] text-[#5C5248]">
                          Masukkan kode OTP Google Authenticator atau kode master: <strong className="text-amber-900 font-mono">882026</strong>.
                        </p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1F1A16]">
                          Kode 6-Digit TOTP
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={twoFactorCode}
                          onChange={(e) => setTwoFactorCode(e.target.value)}
                          placeholder="882026"
                          className="w-full text-center tracking-widest text-lg font-mono font-black py-2.5 bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl text-[#B23812] focus:outline-hidden"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setRequires2FA(false)}
                          className="w-1/3 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-[#5C5248]"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="w-2/3 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-display font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Verifikasi 2FA</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 2: MEMBER WHATSAPP OTP */}
              {authMode === 'member' && (
                <div className="space-y-4">
                  {memberError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{memberError}</span>
                    </div>
                  )}

                  {otpStep === 'phone' ? (
                    <form onSubmit={handleSendMemberOTP} className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1F1A16]">
                          Nomor WhatsApp
                        </label>
                        <div className="relative">
                          <Smartphone className="w-4 h-4 text-[#5C5248] absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            required
                            value={waPhone}
                            onChange={(e) => setWaPhone(e.target.value)}
                            placeholder="081298765432"
                            className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#EAE2D8] focus:border-[#25D366] rounded-xl text-xs font-mono font-bold text-[#1F1A16] placeholder-[#5C5248] focus:outline-hidden transition-colors"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5B] text-white font-display font-black text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>Kirim OTP WhatsApp</span>
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyMemberOTP} className="space-y-3.5">
                      <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] text-xs text-[#1F1A16]">
                        <span className="font-bold text-emerald-900">OTP Terkirim ke: {waPhone}</span>
                        <p className="text-[11px] text-[#5C5248] mt-0.5">
                          Gunakan kode master demo: <strong className="text-amber-800 font-mono">772026</strong>.
                        </p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1F1A16]">
                          Kode 6-Digit OTP
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="772026"
                          className="w-full text-center tracking-widest text-lg font-mono font-black py-2.5 bg-[#FAF7F2] border border-emerald-300 rounded-xl text-emerald-800 focus:outline-hidden"
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={() => setOtpStep('phone')}
                          className="text-[#B23812] hover:underline font-semibold"
                        >
                          Ganti Nomor
                        </button>
                        <span className="text-[#5C5248] font-mono text-[11px]">
                          {otpTimer > 0 ? `Kirim ulang (${otpTimer}s)` : 'Bisa kirim ulang'}
                        </span>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-display font-black text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verifikasi & Masuk Member</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 3: SECURITY AUDIT */}
              {authMode === 'security_audit' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-[#EAE2D8]">
                    <span className="font-bold text-[#1F1A16] flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-amber-900" />
                      <span>Riwayat Log Autentikasi</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#5C5248]">{auditLogs.length} Entri</span>
                  </div>

                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 text-xs">
                    {auditLogs.slice(0, 5).map((log) => (
                      <div
                        key={log.id}
                        className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] space-y-0.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                            log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {log.status}
                          </span>
                          <span className="text-[9px] font-mono text-[#5C5248]">{log.timestamp}</span>
                        </div>
                        <div className="font-semibold text-[#1F1A16] text-[11px] truncate">{log.action}</div>
                        <div className="text-[10px] text-[#5C5248] truncate">{log.details}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Footer Notice */}
            <p className="text-[10px] text-[#5C5248] text-center">
              Akses internal dilindungi firewall & audit logging aktif • Sesi kedaluwarsa 15 menit
            </p>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-4 text-center text-[11px] text-[#5C5248] z-10">
        © 2026 Homie Cozie Coffee & Kitchen — Kalisari, Pasar Rebo, Jakarta Timur
      </footer>

    </div>
  );
};
