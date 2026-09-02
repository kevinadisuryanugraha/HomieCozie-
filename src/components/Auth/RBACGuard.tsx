import React from 'react';
import { 
  ShieldAlert, 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  RotateCcw, 
  AlertCircle, 
  Eye, 
  Key, 
  Layers,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { UserRole, PermissionLevel, SystemUser } from '../../types';
import { checkRBACPermission, getPermissionLabel, getRoleDisplayInfo } from '../../utils/rbac';
import { RBAC_PERMISSION_MATRIX } from '../../data/mockData';

interface RBACGuardProps {
  currentUser: SystemUser;
  moduleCode: string;
  minRequiredLevel?: PermissionLevel;
  onOpenLoginModal: () => void;
  children: React.ReactNode;
}

export const RBACGuard: React.FC<RBACGuardProps> = ({
  currentUser,
  moduleCode,
  minRequiredLevel = 'L',
  onOpenLoginModal,
  children
}: RBACGuardProps) => {
  const reqLevel: PermissionLevel = minRequiredLevel as PermissionLevel;
  const result = checkRBACPermission(currentUser.role, moduleCode, reqLevel);
  const modulePerm = RBAC_PERMISSION_MATRIX.find(m => m.moduleCode === moduleCode);
  const roleInfo = getRoleDisplayInfo(currentUser.role);

  // If role has NO ACCESS (T) or doesn't meet minimum level -> Display 403 Forbidden Gate
  if (!result.allowed) {
    return (
      <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
        {/* 403 Error Container */}
        <div className="bg-[#1c1714] border-2 border-rose-900/60 rounded-3xl p-6 sm:p-8 text-stone-100 shadow-2xl space-y-6 relative overflow-hidden">
          
          {/* Top Decorative Alert Ribbon */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-rose-600"></div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#3e342c] pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-950/80 border border-rose-700/80 flex items-center justify-center text-rose-400 shadow-lg shrink-0">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">
                    HTTP 403 FORBIDDEN
                  </span>
                  <span className="text-xs text-stone-400 font-mono">
                    Middleware Gerbang 3 (requirePermission)
                  </span>
                </div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-rose-100 mt-1">
                  Akses Ditolak: Hak Akses Tidak Mencukupi
                </h2>
              </div>
            </div>

            <button
              onClick={onOpenLoginModal}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-amber-950/40 transition-transform active:scale-95"
            >
              <Key className="w-4 h-4" />
              <span>Ganti Akun / Login Role Lain</span>
            </button>
          </div>

          {/* Diagnostic Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#120f0d] p-4 rounded-2xl border border-stone-800 space-y-3">
              <span className="font-semibold text-stone-300 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-rose-400" />
                <span>Status Kredensial Saat Ini</span>
              </span>

              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between border-b border-stone-800 pb-1.5">
                  <span className="text-stone-400">Pengguna Login:</span>
                  <span className="font-semibold text-stone-200">{currentUser.name}</span>
                </div>
                <div className="flex justify-between border-b border-stone-800 pb-1.5">
                  <span className="text-stone-400">Role Aktif:</span>
                  <span className="font-mono font-bold text-amber-300">{currentUser.roleLabel}</span>
                </div>
                <div className="flex justify-between border-b border-stone-800 pb-1.5">
                  <span className="text-stone-400">Tingkat Izin Anda:</span>
                  <span className="font-mono font-bold text-rose-400">
                    Level '{result.level}' ({result.levelLabel})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Izin Minimum Dibutuhkan:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    Level '{reqLevel}' ({getPermissionLabel(reqLevel)})
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#120f0d] p-4 rounded-2xl border border-stone-800 space-y-3">
              <span className="font-semibold text-stone-300 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-amber-400" />
                <span>Ketentuan Matriks PRD Section 8.3</span>
              </span>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Modul <strong>{result.moduleName} ({result.moduleCode})</strong> diproteksi secara ketat. Sesuai kebijakan F&B Enterprise Homie Cozie, staf dengan peran <strong>{roleInfo.name}</strong> tidak diizinkan membuka modul ini guna menjaga kerahasiaan omzet, margin, dan data operasional sensitif.
              </p>
              <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-300 flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Untuk mengakses menu ini, silakan login sebagai <strong>Owner</strong>, <strong>Manager</strong>, atau <strong>Super Admin</strong>.</span>
              </div>
            </div>
          </div>

          {/* Module Permission Matrix Inspector */}
          {modulePerm && (
            <div className="bg-[#120f0d] p-4 rounded-2xl border border-stone-800 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-300">
                  Matriks Hak Akses untuk Modul: {modulePerm.moduleName}
                </span>
                <span className="text-[10px] text-stone-500 font-mono">
                  PRD v2 Tabel 8.3
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5 pt-1">
                {(Object.entries(modulePerm.permissions) as [UserRole, PermissionLevel][]).map(([r, lvl]) => {
                  const isCurrentRole = r === currentUser.role;
                  const lvlColor = 
                    lvl === 'F' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                    lvl === 'E' ? 'bg-blue-950 text-blue-300 border-blue-800' :
                    lvl === 'L' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                    'bg-stone-900 text-stone-500 border-stone-800';

                  return (
                    <div
                      key={r}
                      className={`p-2 rounded-xl border text-center text-[10px] space-y-1 ${
                        isCurrentRole ? 'ring-2 ring-rose-500 bg-rose-950/40 border-rose-700' : 'bg-[#181310] border-stone-800'
                      }`}
                    >
                      <span className="font-mono block truncate text-stone-400 capitalize">{r.replace('_', ' ')}</span>
                      <span className={`inline-block px-1.5 py-0.5 rounded font-mono font-bold border ${lvlColor}`}>
                        {lvl}
                      </span>
                      {isCurrentRole && (
                        <span className="block text-[8px] text-rose-300 font-bold">Anda</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Action Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Sistem Audit Log otomatis mencatat insiden percobaan akses (IP: 192.168.1.xxx)</span>
            </div>

            <button
              onClick={onOpenLoginModal}
              className="px-4 py-2 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-semibold text-xs shadow-xs flex items-center gap-2 transition-colors"
            >
              <span>Login Akun Berwenang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    );
  }

  // If permission is READ-ONLY (L), render warning banner above content
  const isReadOnly = result.level === 'L';

  return (
    <div className="space-y-4">
      {isReadOnly && (
        <div className="mx-4 sm:mx-6 mt-4 p-3.5 rounded-2xl bg-amber-950/70 border border-amber-700/80 text-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg">
          <div className="flex items-center gap-2.5">
            <Eye className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold">Mode Baca Saja (Read-Only) Aktif</span>
              <span className="text-stone-300 text-[11px] block sm:inline sm:ml-2">
                Role Anda ({currentUser.roleLabel}) memiliki izin 'L' (Lihat Saja). Tombol manipulasi data dinonaktifkan.
              </span>
            </div>
          </div>
          <button
            onClick={onOpenLoginModal}
            className="px-3 py-1.5 rounded-lg bg-amber-800/80 hover:bg-amber-700 text-amber-100 font-semibold text-[11px] border border-amber-600 transition-colors"
          >
            Upgrade Role / Login Owner
          </button>
        </div>
      )}

      {children}
    </div>
  );
};
