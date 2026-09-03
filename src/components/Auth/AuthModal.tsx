import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Mail, 
  Smartphone, 
  Key, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  RefreshCw, 
  X, 
  Eye, 
  EyeOff, 
  Clock, 
  Fingerprint,
  Users,
  Shield,
  Layers,
  HelpCircle,
  Zap,
  Check
} from 'lucide-react';
import { UserRole, SystemUser } from '../../types';
import { MOCK_SYSTEM_USERS, AuditLogEntry } from '../../data/mockData';
import { getRoleDisplayInfo } from '../../utils/rbac';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: SystemUser;
  onLoginSuccess: (user: SystemUser, logEntry?: AuditLogEntry) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess
}) => {
  const [authMode, setAuthMode] = useState<'staff' | 'member' | 'quick_roles'>('staff');

  // Staff Login Form State
  const [email, setEmail] = useState<string>('owner@homiecozie.com');
  const [password, setPassword] = useState<string>('HomieCozie@2026');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [staffError, setStaffError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [rateLimitCountdown, setRateLimitCountdown] = useState<number>(0);

  // 2FA TOTP State
  const [requires2FA, setRequires2FA] = useState<boolean>(false);
  const [twoFactorCode, setTwoFactorCode] = useState<string>('');
  const [pendingUser, setPendingUser] = useState<SystemUser | null>(null);

  // Member WhatsApp OTP State
  const [waPhone, setWaPhone] = useState<string>('081298765432');
  const [otpStep, setOtpStep] = useState<'phone' | 'otp_verify'>('phone');
  const [otpCode, setOtpCode] = useState<string>('');
  const [otpResendCountdown, setOtpResendCountdown] = useState<number>(0);
  const [memberError, setMemberError] = useState<string | null>(null);

  // Loading animation state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Countdown timer for rate limiting
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (rateLimitCountdown > 0) {
      timer = setInterval(() => {
        setRateLimitCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [rateLimitCountdown]);

  // Countdown timer for OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpResendCountdown > 0) {
      timer = setInterval(() => {
        setOtpResendCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpResendCountdown]);

  if (!isOpen) return null;

  // Strict Password Strength Evaluation
  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score; // 0 to 4
  };

  const passScore = calculatePasswordStrength(password);
  const passLabels = ['Sangat Lemah', 'Lemah', 'Sedang', 'Kuat', 'Sangat Kuat (Enterprise)'];
  const passColors = ['bg-rose-500', 'bg-orange-500', 'bg-amber-500', 'bg-emerald-500', 'bg-emerald-600'];

  // Handle Staff Email + Password Submission
  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStaffError(null);

    // Rate Limiter Check (Gerbang 1)
    if (rateLimitCountdown > 0) {
      setStaffError(`HTTP 429 Too Many Requests: Akun dikunci sementara. Tunggu ${rateLimitCountdown} detik.`);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setStaffError('Format alamat email tidak valid (contoh: staff@homiecozie.com).');
      return;
    }

    if (password.length < 6) {
      setStaffError('Password minimal 6 karakter.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      // Look up user in mock directory
      const matched = MOCK_SYSTEM_USERS.find(
        u => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!matched) {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        if (newAttempts >= 3) {
          setRateLimitCountdown(30);
          setStaffError('HTTP 429 Rate Limit Terpicu: 3x Percobaan login gagal. Sistem terkunci 30 detik untuk mencegah brute-force attack.');
        } else {
          setStaffError(`Kredensial tidak ditemukan (${3 - newAttempts} percobaan tersisa sebelum rate limiter aktif).`);
        }
        return;
      }

      // Check if 2FA is required for Owner or Super Admin
      if (matched.twoFactorEnabled || matched.role === 'owner' || matched.role === 'super_admin') {
        setPendingUser(matched);
        setRequires2FA(true);
        setTwoFactorCode('849201'); // default mock code for convenience
        return;
      }

      // Successful Direct Login
      setFailedAttempts(0);
      const auditLog: AuditLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('id-ID') + ' WIB',
        user: matched.name,
        role: matched.role,
        action: 'LOGIN_AUTH_SUCCESS',
        targetModule: 'MOD-AUTH',
        status: 'SUCCESS',
        ip: '180.252.112.4',
        details: `JWT Access Token (15m) issued for role: ${matched.role}`
      };

      onLoginSuccess(matched, auditLog);
      onClose();
    }, 600);
  };

  // Handle 2FA Verification
  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorCode || twoFactorCode.length < 6) {
      setStaffError('Masukkan 6 digit kode OTP Google Authenticator.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (pendingUser) {
        const auditLog: AuditLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('id-ID') + ' WIB',
          user: pendingUser.name,
          role: pendingUser.role,
          action: 'LOGIN_2FA_SUCCESS',
          targetModule: 'MOD-AUTH',
          status: 'SUCCESS',
          ip: '180.252.112.4',
          details: `2FA Authenticator TOTP verified for ${pendingUser.roleLabel}`
        };

        onLoginSuccess(pendingUser, auditLog);
        setRequires2FA(false);
        setPendingUser(null);
        onClose();
      }
    }, 500);
  };

  // Handle Member WhatsApp Request OTP
  const handleRequestWaOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setMemberError(null);

    const cleanPhone = waPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 14) {
      setMemberError('Format nomor WhatsApp tidak valid (minimal 10 digit, contoh: 081298765432).');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setOtpStep('otp_verify');
      setOtpCode('582910'); // Simulated received OTP
      setOtpResendCountdown(60);
    }, 600);
  };

  // Handle Member OTP Submission
  const handleVerifyMemberOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setMemberError(null);

    if (otpCode.length !== 6) {
      setMemberError('Masukkan 6 digit kode OTP yang dikirimkan ke WhatsApp Anda.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const memberUser = MOCK_SYSTEM_USERS.find(u => u.role === 'member') || {
        id: `member-${Date.now()}`,
        name: 'Member Cozie (Dimas)',
        email: 'member.cozie@gmail.com',
        role: 'member' as UserRole,
        roleLabel: 'Member Pelanggan Setia',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        status: 'active' as const,
        lastLogin: 'Baru saja'
      };

      const auditLog: AuditLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('id-ID') + ' WIB',
        user: memberUser.name,
        role: 'member',
        action: 'MEMBER_OTP_LOGIN',
        targetModule: 'MOD-AUTH',
        status: 'SUCCESS',
        ip: '114.125.40.88',
        details: `WhatsApp OTP login verified for phone: ${waPhone}`
      };

      onLoginSuccess(memberUser, auditLog);
      onClose();
    }, 500);
  };

  // Quick Switch to Any of the 9 Roles (1-Click Test Bench)
  const handleQuickRoleSwitch = (usr: SystemUser) => {
    const auditLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID') + ' WIB',
      user: usr.name,
      role: usr.role,
      action: 'ROLE_QUICK_SWITCH',
      targetModule: 'MOD-AUTH',
      status: 'SUCCESS',
      ip: '127.0.0.1 (Localhost / Sandbox)',
      details: `Active role switched to: ${usr.roleLabel} (${usr.role})`
    };

    onLoginSuccess(usr, auditLog);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#1a1614] border border-[#3e342c] rounded-3xl w-full max-w-2xl text-stone-100 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#3e342c] flex items-center justify-between bg-[#1f1a17]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-amber-100">
                  Gerbang Autentikasi & RBAC
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  JWT 15m + Fail-Fast
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Sistem login tersentralisasi sesuai PRD v2 Bagian 8 (Autentikasi & RBAC 9 Role)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Logged-in Info Strip */}
        <div className="bg-[#120f0d] px-6 py-2.5 border-b border-[#2e2620] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Sesi Aktif Saat Ini:</span>
            <span className="font-semibold text-amber-200">{currentUser.name}</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-stone-800 text-stone-300 border border-stone-700">
              {currentUser.roleLabel}
            </span>
          </div>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Token Aktif: 14m 58s
          </span>
        </div>

        {/* Navigation Mode Tabs */}
        <div className="grid grid-cols-3 gap-1 p-2 bg-[#120f0d] border-b border-[#2e2620] text-xs">
          <button
            onClick={() => {
              setAuthMode('staff');
              setRequires2FA(false);
            }}
            className={`py-2.5 px-3 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all ${
              authMode === 'staff'
                ? 'bg-amber-900 text-white shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Staff & Manajemen</span>
          </button>

          <button
            onClick={() => {
              setAuthMode('member');
              setRequires2FA(false);
            }}
            className={`py-2.5 px-3 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all ${
              authMode === 'member'
                ? 'bg-amber-900 text-white shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Member WhatsApp OTP</span>
          </button>

          <button
            onClick={() => setAuthMode('quick_roles')}
            className={`py-2.5 px-3 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all ${
              authMode === 'quick_roles'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-400 hover:text-emerald-300 hover:bg-white/5'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulasi 9 Role (1-Klik)</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: Staff / Management Login */}
          {authMode === 'staff' && !requires2FA && (
            <form onSubmit={handleStaffLogin} className="space-y-4 text-xs">
              <div className="bg-[#241e1a] p-4 rounded-2xl border border-[#3e342c] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-amber-300">Form Login Internal (Email & Hash Bcrypt)</span>
                  <span className="text-[10px] text-stone-400 font-mono">Fail-Fast Gerbang 1 & 2</span>
                </div>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  Digunakan oleh Owner, Manager, Kasir, Staff Dapur, Staff Reservasi, dan Tim Marketing untuk mengakses Backstage POS & CRM sesuai hak akses perannya.
                </p>
              </div>

              {staffError && (
                <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-800/80 text-rose-200 flex items-start gap-2.5 animate-in shake duration-200">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="text-xs">{staffError}</span>
                </div>
              )}

              {rateLimitCountdown > 0 && (
                <div className="p-3.5 rounded-2xl bg-amber-950/80 border border-amber-700/80 text-amber-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                    <span>Rate Limiter Aktif (Gerbang 1): Tunggu cooldown</span>
                  </div>
                  <span className="font-mono font-bold text-amber-300 text-sm">{rateLimitCountdown}s</span>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-stone-300 font-medium">Alamat Email Karyawan / Owner</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contoh: owner@homiecozie.com"
                    disabled={rateLimitCountdown > 0 || isProcessing}
                    className="w-full bg-[#120f0d] border border-[#3e342c] rounded-xl pl-10 pr-4 py-2.5 text-stone-100 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-stone-300 font-medium">Kata Sandi (Argon2 / Bcrypt Hash)</label>
                  <span className="text-[10px] text-stone-400">Min. 8 Karakter + Simbol</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    disabled={rateLimitCountdown > 0 || isProcessing}
                    className="w-full bg-[#120f0d] border border-[#3e342c] rounded-xl pl-10 pr-10 py-2.5 text-stone-100 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {password && (
                  <div className="pt-1.5 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-stone-400">Kekuatan Sandi:</span>
                      <span className="font-semibold text-amber-300">{passLabels[passScore]}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 h-1.5">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`rounded-full transition-all ${
                            passScore >= step ? passColors[passScore] : 'bg-stone-800'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Fill Helper for Demo Evaluation */}
              <div className="pt-2">
                <span className="text-[10px] text-stone-400 block mb-1.5 font-mono">Pilih Cepat Akun Uji Coba:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: '👑 Owner (Pak Hendra)', email: 'owner@homiecozie.com' },
                    { label: '💼 Manager (Rahmat)', email: 'manager@homiecozie.com' },
                    { label: '💳 Kasir (Sinta)', email: 'kasir@homiecozie.com' },
                    { label: '🍳 Dapur (Doni)', email: 'dapur@homiecozie.com' },
                    { label: '📢 Marketing (Clarissa)', email: 'marketing@homiecozie.com' }
                  ].map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => {
                        setEmail(acc.email);
                        setPassword('HomieCozie@2026');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 text-[11px] border border-stone-700 transition-colors"
                    >
                      {acc.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={rateLimitCountdown > 0 || isProcessing}
                className="w-full mt-4 py-2.5 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi Token & Rate Limiter...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Masuk ke Sistem (Verifikasi Kredensial)</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 1 (Step 2): Two-Factor Authentication Prompt (2FA) */}
          {authMode === 'staff' && requires2FA && pendingUser && (
            <form onSubmit={handleVerify2FA} className="space-y-4 text-xs animate-in fade-in">
              <div className="bg-amber-950/40 p-4 rounded-2xl border border-amber-800/60 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <Fingerprint className="w-4 h-4" />
                  <span>Verifikasi Keamanan Ganda (2FA TOTP Diperlukan)</span>
                </div>
                <p className="text-[11px] text-stone-300 leading-relaxed">
                  Peran level tinggi (<strong>{pendingUser.roleLabel}</strong>) mewajibkan autentikasi 2 faktor untuk mencegah penyusupan data keuangan & omzet resto.
                </p>
              </div>

              {staffError && (
                <div className="p-3 rounded-xl bg-rose-950 border border-rose-800 text-rose-300 text-xs">
                  {staffError}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-stone-300 font-medium">
                  Masukkan 6-Digit Kode Google Authenticator / SMS
                </label>
                <div className="flex items-center justify-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="849201"
                    className="w-48 text-center tracking-[0.5em] font-mono text-xl font-bold bg-[#120f0d] border border-amber-500/60 rounded-xl py-3 text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <p className="text-[11px] text-stone-400 text-center">
                  Demo Code Mock: <code className="text-amber-300 font-mono font-bold">849201</code> (otomatis terisi)
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setRequires2FA(false);
                    setPendingUser(null);
                  }}
                  className="w-1/2 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-2 shadow-md shadow-emerald-950/40"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  <span>Verifikasi & Masuk</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Member / Customer WhatsApp OTP Login */}
          {authMode === 'member' && (
            <div className="space-y-4 text-xs">
              <div className="bg-[#241e1a] p-4 rounded-2xl border border-[#3e342c] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-amber-300">Login Member via WhatsApp OTP</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Tanpa Ingat Password</span>
                </div>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  Pelanggan cukup memasukkan nomor WhatsApp untuk login, melihat saldo Cozie Points, riwayat reservasi meja, dan mengklaim voucher ulang tahun.
                </p>
              </div>

              {memberError && (
                <div className="p-3 rounded-xl bg-rose-950 border border-rose-800 text-rose-300">
                  {memberError}
                </div>
              )}

              {otpStep === 'phone' ? (
                <form onSubmit={handleRequestWaOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-stone-300 font-medium">Nomor WhatsApp Aktif</label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={waPhone}
                        onChange={(e) => setWaPhone(e.target.value)}
                        placeholder="contoh: 081298765432"
                        className="w-full bg-[#120f0d] border border-[#3e342c] rounded-xl pl-10 pr-4 py-2.5 text-stone-100 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all"
                  >
                    {isProcessing ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Smartphone className="w-4 h-4" />
                        <span>Kirim Kode OTP WhatsApp (Instan)</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyMemberOtp} className="space-y-4 animate-in fade-in">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-stone-300 font-medium">
                        Masukkan 6-Digit OTP Terkirim ke WhatsApp:
                      </label>
                      <span className="text-emerald-400 font-mono">{waPhone}</span>
                    </div>

                    <div className="flex items-center justify-center">
                      <input
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-48 text-center tracking-[0.5em] font-mono text-xl font-bold bg-[#120f0d] border border-emerald-500 rounded-xl py-3 text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <p className="text-[11px] text-stone-400 text-center">
                      Simulated OTP Code: <code className="text-emerald-300 font-mono font-bold">582910</code>
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-400">
                    <span>Tidak menerima kode?</span>
                    {otpResendCountdown > 0 ? (
                      <span>Kirim ulang dalam {otpResendCountdown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setOtpResendCountdown(60)}
                        className="text-amber-400 hover:underline font-semibold"
                      >
                        Kirim Ulang OTP
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setOtpStep('phone')}
                      className="w-1/3 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300"
                    >
                      Ubah No. WA
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-2"
                    >
                      {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      <span>Konfirmasi & Masuk Member</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: Quick Role Simulator (All 9 Roles from PRD Section 8.3) */}
          {authMode === 'quick_roles' && (
            <div className="space-y-3 text-xs">
              <div className="bg-[#241e1a] p-3.5 rounded-2xl border border-[#3e342c] space-y-1">
                <span className="font-semibold text-emerald-300">Test Bench Hak Akses 9 Role (1-Klik Switch)</span>
                <p className="text-[11px] text-stone-400">
                  Ganti peran secara instan untuk menguji bagaimana sistem membatasi halaman, menu, dan izin aksi sesuai matriks PRD Bagian 8.3.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {MOCK_SYSTEM_USERS.map((usr) => {
                  const roleInfo = getRoleDisplayInfo(usr.role);
                  const isCurrent = currentUser.id === usr.id;

                  return (
                    <div
                      key={usr.id}
                      onClick={() => handleQuickRoleSwitch(usr)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isCurrent
                          ? 'bg-amber-950/60 border-amber-500/80 ring-2 ring-amber-500/30'
                          : 'bg-[#14100e] border-stone-800 hover:border-stone-600 hover:bg-stone-900'
                      }`}
                    >
                      <img
                        src={usr.avatar}
                        alt={usr.name}
                        className="w-9 h-9 rounded-xl object-cover border border-stone-700 shrink-0 mt-0.5"
                      />
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-stone-100 truncate text-[11px]">
                            {usr.name}
                          </span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-stone-950 shrink-0">
                              Aktif
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-xs">{roleInfo.icon}</span>
                          <span className="text-[10px] font-semibold text-amber-300 truncate">
                            {usr.roleLabel}
                          </span>
                        </div>

                        <p className="text-[10px] text-stone-400 line-clamp-2 leading-tight">
                          {roleInfo.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#120f0d] border-t border-[#2e2620] flex flex-wrap items-center justify-between gap-3 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px]">Enkripsi TLS 1.3 & Argon2 Hash • Sesuai Standar F&B Enterprise</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium text-xs transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
