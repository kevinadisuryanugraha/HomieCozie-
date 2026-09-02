import { UserRole, PermissionLevel, RBACModulePermission } from '../types';
import { RBAC_PERMISSION_MATRIX } from '../data/mockData';

export interface RBACCheckResult {
  allowed: boolean;
  level: PermissionLevel;
  levelLabel: string;
  moduleCode: string;
  moduleName: string;
  userRole: UserRole;
  requiredLevel: PermissionLevel;
  reason?: string;
}

export const getPermissionLabel = (level: PermissionLevel): string => {
  switch (level) {
    case 'F':
      return 'Full (Akses Penuh - Buat, Edit, Hapus, Setujui)';
    case 'E':
      return 'Edit / Terbatas (Sesuai Ruang Lingkup Peran)';
    case 'L':
      return 'Lihat Saja (Read-Only)';
    case 'T':
    default:
      return 'Tidak Ada Akses (Akses Ditolak)';
  }
};

export const getRoleDisplayInfo = (role: UserRole): { name: string; badgeColor: string; icon: string; description: string } => {
  switch (role) {
    case 'super_admin':
      return {
        name: 'Super Admin (Hansco)',
        badgeColor: 'bg-purple-100 text-purple-950 border-purple-300 font-bold',
        icon: '⚡',
        description: 'Kontrol teknis penuh sistem, konfigurasi server & master database'
      };
    case 'owner':
      return {
        name: 'Owner (Pemilik Homie Cozie)',
        badgeColor: 'bg-amber-100 text-amber-950 border-amber-400 font-bold',
        icon: '👑',
        description: 'Pemilik bisnis: Laporan laba-rugi, persetujuan diskon/void, kontrol penuh resto'
      };
    case 'manager':
      return {
        name: 'Manager / Supervisor',
        badgeColor: 'bg-sky-100 text-sky-950 border-sky-300 font-bold',
        icon: '💼',
        description: 'Operasional harian: Manajemen shift, stok, void kasir, analitik harian'
      };
    case 'cashier':
      return {
        name: 'Kasir Frontline',
        badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-300 font-bold',
        icon: '💳',
        description: 'Proses pembayaran meja, cetak struk thermal, input poin member saat bayar'
      };
    case 'reservation_staff':
      return {
        name: 'Staff Reservasi Meja',
        badgeColor: 'bg-teal-100 text-teal-950 border-teal-300 font-bold',
        icon: '🗓️',
        description: 'Manajemen ketersediaan meja, alokasi kursi, konfirmasi WhatsApp reservasi'
      };
    case 'kitchen_staff':
      return {
        name: 'Staff Dapur & Bar',
        badgeColor: 'bg-orange-100 text-orange-950 border-orange-300 font-bold',
        icon: '🍳',
        description: 'Layar KDS (Kitchen Display), status racikan pesanan, laporan stok menipis'
      };
    case 'marketing':
      return {
        name: 'Marketing & Admin Sosmed',
        badgeColor: 'bg-pink-100 text-pink-950 border-pink-300 font-bold',
        icon: '📢',
        description: 'Broadcast promosi WhatsApp, kalender event #PITSTOP & Live Music'
      };
    case 'member':
      return {
        name: 'Member Pelanggan Setia',
        badgeColor: 'bg-indigo-100 text-indigo-950 border-indigo-300 font-bold',
        icon: '⭐',
        description: 'Pelanggan terdaftar: Cozie Points, riwayat transaksi, voucher promo'
      };
    case 'guest':
    default:
      return {
        name: 'Guest (Tamu / Pengunjung)',
        badgeColor: 'bg-stone-100 text-stone-900 border-stone-300 font-bold',
        icon: '👤',
        description: 'Pengunjung tanpa akun: Lihat menu, booking meja, scan QR order'
      };
  }
};

/**
 * Validates whether a user role has permission to access a specific module
 * Evaluates against PRD Section 8.3 Permission Matrix
 */
export const checkRBACPermission = (
  role: UserRole,
  moduleCode: string,
  minRequiredLevel: PermissionLevel = 'L'
): RBACCheckResult => {
  const modulePerm = RBAC_PERMISSION_MATRIX.find(m => m.moduleCode === moduleCode);
  
  if (!modulePerm) {
    return {
      allowed: false,
      level: 'T',
      levelLabel: 'Modul Tidak Dikenal',
      moduleCode,
      moduleName: 'Unknown Module',
      userRole: role,
      requiredLevel: minRequiredLevel,
      reason: `Modul '${moduleCode}' tidak terdaftar di Section 8.3 PRD.`
    };
  }

  const userLevel = modulePerm.permissions[role] || 'T';

  // Permission level hierarchy: F > E > L > T
  const levelRank: Record<PermissionLevel, number> = {
    'F': 3,
    'E': 2,
    'L': 1,
    'T': 0
  };

  const allowed = levelRank[userLevel] >= levelRank[minRequiredLevel];

  let reason = '';
  if (!allowed) {
    if (userLevel === 'T') {
      reason = `Role '${role}' tidak memiliki izin (T = Tidak Ada) untuk mengakses modul '${modulePerm.moduleName}'.`;
    } else {
      reason = `Izin role '${role}' saat ini adalah '${userLevel}' (${getPermissionLabel(userLevel)}), namun modul ini mensyaratkan izin minimum '${minRequiredLevel}' (${getPermissionLabel(minRequiredLevel)}).`;
    }
  }

  return {
    allowed,
    level: userLevel,
    levelLabel: getPermissionLabel(userLevel),
    moduleCode: modulePerm.moduleCode,
    moduleName: modulePerm.moduleName,
    userRole: role,
    requiredLevel: minRequiredLevel,
    reason: allowed ? undefined : reason
  };
};

export type BackstageNavModuleId = 
  | 'dashboard'
  | 'pos'
  | 'kds'
  | 'floorplan'
  | 'reservations'
  | 'inventory'
  | 'recipe_bom'
  | 'crm'
  | 'cms'
  | 'sales_revenue'
  | 'rbac_matrix'
  | 'ai_agent';

/**
 * Returns the default primary module in Backstage for a specific UserRole
 */
export const getDefaultBackstageModuleForRole = (role: UserRole): BackstageNavModuleId => {
  switch (role) {
    case 'super_admin':
      return 'dashboard';
    case 'owner':
      return 'dashboard';
    case 'manager':
      return 'floorplan';
    case 'cashier':
      return 'pos';
    case 'reservation_staff':
      return 'reservations';
    case 'kitchen_staff':
      return 'kds';
    case 'marketing':
      return 'crm';
    default:
      return 'dashboard';
  }
};

