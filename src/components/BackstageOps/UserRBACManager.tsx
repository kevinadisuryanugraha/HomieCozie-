import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  Key, 
  Lock, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Sparkles, 
  UserPlus, 
  RotateCcw, 
  Search, 
  Filter, 
  Fingerprint, 
  Globe, 
  Layers,
  Smartphone,
  Eye,
  Check,
  X,
  Shield,
  Download,
  Upload
} from 'lucide-react';
import { SystemUser, UserRole, PermissionLevel, RBACModulePermission } from '../../types';
import { MOCK_SYSTEM_USERS, INITIAL_AUDIT_LOGS, RBAC_PERMISSION_MATRIX, AuditLogEntry } from '../../data/mockData';
import { getRoleDisplayInfo, getPermissionLabel } from '../../utils/rbac';
import { DataTable, ColumnDef, FilterConfig, BulkAction } from '../Common/DataTable';

interface UserRBACManagerProps {
  currentUser?: SystemUser;
  currentSystemUser?: SystemUser;
  onSwitchUser?: (user: SystemUser) => void;
  auditLogs: AuditLogEntry[];
  onAddAuditLog: (log: AuditLogEntry) => void;
}

export const UserRBACManager: React.FC<UserRBACManagerProps> = ({
  currentUser: propUser,
  currentSystemUser,
  onSwitchUser,
  auditLogs,
  onAddAuditLog
}) => {
  const currentUser = propUser || currentSystemUser || MOCK_SYSTEM_USERS[0];
  const [usersList, setUsersList] = useState<SystemUser[]>(MOCK_SYSTEM_USERS);
  const [activeTab, setActiveTab] = useState<'users' | 'matrix' | 'audit_trail' | 'middleware'>('users');

  // New User Form State
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
  const [newUserName, setNewUserName] = useState<string>('');
  const [newUserEmail, setNewUserEmail] = useState<string>('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('cashier');
  const [newUser2FA, setNewUser2FA] = useState<boolean>(false);

  // Handle Adding New Staff User
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const roleInfo = getRoleDisplayInfo(newUserRole);
    const createdUser: SystemUser = {
      id: `usr-${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      roleLabel: roleInfo.name,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      status: 'active',
      lastLogin: 'Belum pernah login',
      twoFactorEnabled: newUser2FA
    };

    setUsersList([createdUser, ...usersList]);

    // Record audit trail log
    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID') + ' WIB',
      user: currentUser.name,
      role: currentUser.role,
      action: 'USER_CREATED_RBAC',
      targetModule: 'MOD-USR',
      status: 'SUCCESS',
      ip: '192.168.1.100',
      details: `Created new staff account: ${createdUser.name} (${createdUser.roleLabel})`
    };
    onAddAuditLog(log);

    // Reset Form
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('cashier');
    setNewUser2FA(false);
  };

  const handleResetPassword = (targetUser: SystemUser) => {
    const tempPass = Math.random().toString(36).slice(-8);
    alert(`Password sementara untuk ${targetUser.name}: ${tempPass}\nSilakan minta user mengubah password saat login berikutnya.`);
    
    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID') + ' WIB',
      user: currentUser.name,
      role: currentUser.role,
      action: 'RESET_PASSWORD',
      targetModule: 'MOD-USR',
      status: 'SUCCESS',
      ip: '192.168.1.100',
      details: `Admin ${currentUser.name} triggered password reset for ${targetUser.name}`
    };
    onAddAuditLog(log);
  };

  const handleRevokeUserToken = (targetUser: SystemUser) => {
    alert(`Token akses JWT untuk ${targetUser.name} berhasil dicabut. User akan di-force logout seketika.`);
    
    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID') + ' WIB',
      user: currentUser.name,
      role: currentUser.role,
      action: 'REVOKE_TOKEN_FORCE_LOGOUT',
      targetModule: 'MOD-USR',
      status: 'WARN',
      ip: '192.168.1.100',
      details: `Force revocation of all JWT session tokens for user: ${targetUser.name}`
    };
    onAddAuditLog(log);
  };

  const handleImportStaff = (importedRows: Record<string, any>[]) => {
    const newStaff: SystemUser[] = importedRows.map((row, idx) => {
      const role = (row.role || row['Peran'] || 'cashier') as UserRole;
      const roleInfo = getRoleDisplayInfo(role);
      return {
        id: row.id || `usr-${Date.now()}-${idx}`,
        name: row.name || row['Nama Karyawan'] || 'Karyawan Baru',
        email: row.email || row['Email'] || `staff${idx + 1}@homiecozie.com`,
        role,
        roleLabel: roleInfo.name,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        status: 'active',
        lastLogin: 'Baru diimpor',
        twoFactorEnabled: row.twoFactorEnabled === true || row['2FA'] === 'Ya'
      };
    });

    setUsersList((prev) => [...newStaff, ...prev]);
  };

  // 1. Staff DataTable Columns
  const userColumns: ColumnDef<SystemUser>[] = [
    {
      header: 'Profil Karyawan',
      accessorKey: 'name',
      sortable: true,
      minWidth: '220px',
      cell: ({ row }) => {
        const isCurrent = currentUser?.id === row.id;
        return (
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={row.avatar}
              alt={row.name}
              className="w-10 h-10 rounded-2xl object-cover border border-[#EAE2D8] shadow-2xs shrink-0"
            />
            <div className="min-w-0">
              <div className="font-bold text-sm text-[#1F1A16] flex items-center gap-1.5 truncate">
                <span>{row.name}</span>
                {isCurrent && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#C84B27] text-white shrink-0">
                    Anda
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#5C5248] font-mono block truncate">{row.email}</span>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Peran & Akses RBAC',
      accessorKey: 'role',
      sortable: true,
      minWidth: '170px',
      cell: ({ row }) => {
        const roleInfo = getRoleDisplayInfo(row.role);
        return (
          <div className="whitespace-nowrap space-y-0.5">
            <span className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold border inline-flex items-center gap-1.5 shadow-2xs ${roleInfo.badgeColor}`}>
              <span>{roleInfo.icon}</span>
              <span>{row.role}</span>
            </span>
            <div className="text-[10px] text-[#5C5248] font-medium mt-0.5">{roleInfo.name}</div>
          </div>
        );
      }
    },
    {
      header: '2FA Authenticator',
      accessorKey: 'twoFactorEnabled',
      sortable: true,
      minWidth: '130px',
      align: 'center',
      cell: ({ row }) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border whitespace-nowrap inline-block ${
          row.twoFactorEnabled ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-stone-100 text-stone-600 border-stone-200'
        }`}>
          {row.twoFactorEnabled ? 'Aktif (OTP)' : 'Non-Aktif'}
        </span>
      )
    },
    {
      header: 'Aktivitas Terakhir',
      accessorKey: 'lastLogin',
      sortable: true,
      minWidth: '140px',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-[#5C5248] whitespace-nowrap block">{row.lastLogin}</span>
      )
    },
    {
      header: 'Aksi Keamanan',
      align: 'center',
      minWidth: '120px',
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap">
          <button
            onClick={() => handleResetPassword(row)}
            className="p-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors cursor-pointer"
            title="Reset Password Karyawan"
          >
            <Key className="w-3.5 h-3.5 text-[#C84B27]" />
          </button>
          <button
            onClick={() => handleRevokeUserToken(row)}
            className="p-1.5 rounded-xl bg-stone-100 hover:bg-rose-100 text-rose-700 border border-stone-200 transition-colors cursor-pointer"
            title="Cabut Sesi / Force Logout"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  const userFilters: FilterConfig<SystemUser>[] = [
    {
      id: 'role',
      label: 'Peran RBAC',
      options: [
        { label: 'Super Admin', value: 'super_admin' },
        { label: 'Owner (Pemilik)', value: 'owner' },
        { label: 'Manager / SPV', value: 'manager' },
        { label: 'Kasir Frontline', value: 'cashier' },
        { label: 'Staff Reservasi', value: 'reservation_staff' },
        { label: 'Staff Dapur & Barista', value: 'kitchen_staff' },
        { label: 'Marketing', value: 'marketing' }
      ],
      filterFn: (row, val) => row.role === val
    }
  ];

  // 2. Audit Trail DataTable Columns
  const auditColumns: ColumnDef<AuditLogEntry>[] = [
    {
      header: 'Status & Aksi',
      accessorKey: 'action',
      sortable: true,
      minWidth: '170px',
      cell: ({ row }) => {
        const statusColor = 
          row.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
          row.status === 'BLOCKED_403' ? 'bg-rose-50 text-rose-800 border-rose-300' :
          row.status === 'RATE_LIMITED_429' ? 'bg-amber-50 text-amber-800 border-amber-300' :
          'bg-stone-100 text-stone-700 border-stone-300';

        return (
          <div className="space-y-1 whitespace-nowrap">
            <div className="flex items-center gap-1.5">
              <span className={`px-2 py-0.5 rounded font-mono font-bold text-[9px] border ${statusColor}`}>
                {row.status}
              </span>
              <span className="font-mono text-amber-800 font-bold text-xs">
                {row.action}
              </span>
            </div>
            <span className="text-[10px] text-[#5C5248] font-mono block">Modul: [{row.targetModule}]</span>
          </div>
        );
      }
    },
    {
      header: 'Detail Aktivitas',
      accessorKey: 'details',
      minWidth: '240px',
      cell: ({ row }) => (
        <span className="text-xs text-[#5C5248] leading-relaxed max-w-md block">{row.details}</span>
      )
    },
    {
      header: 'Pengguna & Role',
      accessorKey: 'user',
      sortable: true,
      minWidth: '150px',
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          <div className="font-bold text-xs text-[#1F1A16]">{row.user}</div>
          <span className="text-[10px] text-[#5C5248] font-mono block">({row.role})</span>
        </div>
      )
    },
    {
      header: 'Waktu & IP Address',
      sortable: true,
      minWidth: '140px',
      accessorFn: (row) => `${row.timestamp} ${row.ip}`,
      cell: ({ row }) => (
        <div className="font-mono text-[11px] text-[#5C5248] whitespace-nowrap">
          <div className="font-bold text-[#1F1A16]">{row.timestamp}</div>
          <span className="text-[10px] text-[#5C5248] block">IP: {row.ip}</span>
        </div>
      )
    }
  ];

  const auditFilters: FilterConfig<AuditLogEntry>[] = [
    {
      id: 'status',
      label: 'Status Log',
      options: [
        { label: 'SUCCESS (Berhasil)', value: 'SUCCESS' },
        { label: 'BLOCKED_403 (Izin Ditolak)', value: 'BLOCKED_403' },
        { label: 'RATE_LIMITED_429 (Brute Force)', value: 'RATE_LIMITED_429' },
        { label: 'WARN (Peringatan)', value: 'WARN' }
      ],
      filterFn: (row, val) => row.status === val
    }
  ];

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-7xl mx-auto w-full pb-24 lg:pb-8 min-w-0">
      
      {/* Top Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#EAE2D8] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full min-w-0">
        <div className="space-y-1.5 min-w-0 w-full flex-1">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-amber-800 min-w-0 w-full overflow-hidden">
            <ShieldCheck className="w-4 h-4 text-[#C84B27] shrink-0" />
            <span className="truncate">Manajemen Autentikasi & Otorisasi RBAC Terintegrasi</span>
          </div>
          <h3 className="font-display font-black text-lg sm:text-xl text-[#1F1A16] leading-tight break-words">
            Kontrol Akses 9 Peran & Log Keamanan
          </h3>
          <p className="text-xs text-[#5C5248] max-w-xl leading-relaxed">
            Sistem Role-Based Access Control (RBAC) granular dengan arsitektur fail-fast 6 gerbang middleware dan audit trail terenkripsi.
          </p>
        </div>

        <button
          onClick={() => setShowAddUserModal(true)}
          className="w-full sm:w-auto px-4.5 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs shrink-0 transition-all cursor-pointer active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Akun Karyawan</span>
        </button>
      </div>

      {/* Tabs Navigation (Responsive Horizontal Scroll) */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scroll-smooth pb-1.5 pt-0.5 text-xs border-b border-[#EAE2D8] scrollbar-none no-scrollbar w-full min-w-0">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-[#C84B27] text-white shadow-xs'
              : 'text-[#5C5248] hover:text-[#1F1A16] hover:bg-stone-100'
          }`}
        >
          <Users className="w-4 h-4 shrink-0" />
          <span>Daftar Karyawan ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer whitespace-nowrap ${
            activeTab === 'matrix'
              ? 'bg-[#C84B27] text-white shadow-xs'
              : 'text-[#5C5248] hover:text-[#1F1A16] hover:bg-stone-100'
          }`}
        >
          <Layers className="w-4 h-4 shrink-0" />
          <span>Matriks Hak Akses (9 Role)</span>
        </button>

        <button
          onClick={() => setActiveTab('audit_trail')}
          className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer whitespace-nowrap ${
            activeTab === 'audit_trail'
              ? 'bg-[#C84B27] text-white shadow-xs'
              : 'text-[#5C5248] hover:text-[#1F1A16] hover:bg-stone-100'
          }`}
        >
          <Clock className="w-4 h-4 shrink-0" />
          <span>Audit Trail Log ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('middleware')}
          className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer whitespace-nowrap ${
            activeTab === 'middleware'
              ? 'bg-[#C84B27] text-white shadow-xs'
              : 'text-[#5C5248] hover:text-[#1F1A16] hover:bg-stone-100'
          }`}
        >
          <Fingerprint className="w-4 h-4 shrink-0" />
          <span>6 Gerbang Middleware</span>
        </button>
      </div>

      {/* TAB 1: USERS & ACTIVE SESSIONS DATA TABLE */}
      {activeTab === 'users' && (
        <DataTable<SystemUser>
          data={usersList}
          columns={userColumns}
          title="Daftar Akun Karyawan & Akses RBAC"
          subtitle="Manajemen kredensial login, peran hak akses, dan status 2FA Authenticator"
          searchPlaceholder="Cari nama karyawan, email, peran..."
          searchableKeys={['name', 'email', 'role', 'roleLabel']}
          filters={userFilters}
          enableSelection={true}
          initialPageSize={10}
          pageSizeOptions={[5, 10, 25, 50]}
          exportFileName="HomieCozie_Staff_RBAC"
          enableExport={true}
          enableImport={true}
          onImport={handleImportStaff}
          enableViewSwitcher={true}
          renderCardView={(usr, _, isSelected, toggleSelect) => {
            const roleInfo = getRoleDisplayInfo(usr.role);
            const isCurrentUser = currentUser.id === usr.id;

            return (
              <div
                className={`bg-white border rounded-3xl p-4 sm:p-5 space-y-3.5 transition-all shadow-xs w-full min-w-0 ${
                  isSelected ? 'border-[#C84B27] ring-2 ring-[#C84B27]/20 bg-amber-50/20' : 'border-[#EAE2D8] hover:border-[#C84B27]'
                }`}
              >
                <div className="flex items-start justify-between gap-2.5 min-w-0">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={toggleSelect}
                      className="w-4 h-4 rounded-md accent-[#C84B27] cursor-pointer shrink-0"
                    />
                    <img
                      src={usr.avatar}
                      alt={usr.name}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover border border-[#EAE2D8] shadow-xs shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h4 className="font-bold text-[#1F1A16] text-xs truncate">
                          {usr.name}
                        </h4>
                        {isCurrentUser && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#C84B27] text-white shrink-0">
                            Aktif
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#5C5248] font-mono truncate">
                        {usr.email}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold border inline-flex items-center gap-1.5 shrink-0 shadow-2xs ${roleInfo.badgeColor}`}>
                    <span>{roleInfo.icon}</span>
                    <span>{usr.role}</span>
                  </span>
                </div>

                <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EAE2D8] space-y-1 text-[11px]">
                  <div className="flex justify-between text-[#5C5248]">
                    <span>Label Peran:</span>
                    <span className="text-[#1F1A16] font-medium">{usr.roleLabel}</span>
                  </div>
                  <div className="flex justify-between text-[#5C5248]">
                    <span>2FA Keamanan:</span>
                    <span className={usr.twoFactorEnabled ? 'text-emerald-700 font-semibold' : 'text-[#5C5248]'}>
                      {usr.twoFactorEnabled ? 'Aktif (OTP)' : 'Non-Aktif'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#5C5248]">
                    <span>Aktivitas Terakhir:</span>
                    <span className="text-amber-800">{usr.lastLogin}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleResetPassword(usr)}
                    className="flex-1 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all bg-[#FAF7F2] hover:bg-stone-200 text-[#1F1A16] border border-[#EAE2D8] shadow-xs cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5 text-[#C84B27]" />
                    <span>Reset Password</span>
                  </button>

                  <button
                    onClick={() => handleRevokeUserToken(usr)}
                    className="p-1.5 rounded-xl bg-[#FAF7F2] hover:bg-rose-100 hover:text-rose-700 text-[#5C5248] border border-[#EAE2D8] transition-colors cursor-pointer"
                    title="Cabut Token JWT / Force Logout"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          }}
        />
      )}

      {/* TAB 2: GRANULAR RBAC PERMISSION MATRIX (PRD TABLE 8.3) */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#EAE2D8] p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
            <div>
              <h3 className="font-bold text-[#1F1A16]">Matriks Hak Akses Peran Granular (PRD Tabel 8.3)</h3>
              <p className="text-[11px] text-[#5C5248]">
                Memetakan 9 modul utama terhadap 9 tingkatan peran. Kode hak akses: <strong className="text-emerald-700">F (Full)</strong>, <strong className="text-blue-700">E (Edit/Terbatas)</strong>, <strong className="text-amber-700">L (Lihat Saja)</strong>, dan <strong className="text-stone-400">T (Tidak Ada)</strong>.
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">F = Full</span>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-mono">E = Edit</span>
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-mono">L = Lihat</span>
              <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200 font-mono">T = Blokir</span>
            </div>
          </div>

          <div className="bg-white border border-[#EAE2D8] rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto scroll-smooth w-full">
              <table className="w-full text-left text-xs border-collapse min-w-[920px]">
                <thead>
                  <tr className="bg-[#FAF7F2] border-b border-[#EAE2D8] text-[#5C5248] font-mono text-[11px] whitespace-nowrap">
                    <th className="p-3.5 font-semibold text-[#1F1A16] min-w-[200px]">Modul & Kode</th>
                    <th className="p-3.5 font-semibold text-[#1F1A16] min-w-[130px]">Kategori</th>
                    <th className="p-2.5 text-center text-purple-800 min-w-[75px]">Super Admin</th>
                    <th className="p-2.5 text-center text-amber-800 min-w-[70px]">Owner</th>
                    <th className="p-2.5 text-center text-blue-800 min-w-[70px]">Manager</th>
                    <th className="p-2.5 text-center text-emerald-800 min-w-[70px]">Kasir</th>
                    <th className="p-2.5 text-center text-teal-800 min-w-[75px]">Staff Res.</th>
                    <th className="p-2.5 text-center text-orange-800 min-w-[75px]">Staff Dapur</th>
                    <th className="p-2.5 text-center text-pink-800 min-w-[75px]">Marketing</th>
                    <th className="p-2.5 text-center text-indigo-800 min-w-[70px]">Member</th>
                    <th className="p-2.5 text-center text-stone-600 min-w-[70px]">Guest</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE2D8]">
                  {RBAC_PERMISSION_MATRIX.map((row) => (
                    <tr key={row.moduleCode} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="font-semibold text-[#1F1A16]">{row.moduleName}</div>
                        <div className="font-mono text-[10px] text-[#C84B27]">{row.moduleCode}</div>
                      </td>
                      <td className="p-3.5 text-[#5C5248] text-[11px] whitespace-nowrap">
                        {row.category}
                      </td>
                      {(['super_admin', 'owner', 'manager', 'cashier', 'reservation_staff', 'kitchen_staff', 'marketing', 'member', 'guest'] as UserRole[]).map((r) => {
                        const lvl = row.permissions[r];
                        const isCurrent = currentUser.role === r;
                        const lvlStyle =
                          lvl === 'F' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                          lvl === 'E' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                          lvl === 'L' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                          'bg-stone-100 text-stone-400 border-stone-200';

                        return (
                          <td key={r} className={`p-2.5 text-center whitespace-nowrap ${isCurrent ? 'bg-amber-50' : ''}`}>
                            <span className={`inline-block w-7 py-0.5 rounded font-mono font-bold text-[11px] border ${lvlStyle}`}>
                              {lvl}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT TRAIL LOG REAL-TIME DATA TABLE */}
      {activeTab === 'audit_trail' && (
        <DataTable<AuditLogEntry>
          data={auditLogs}
          columns={auditColumns}
          title="Log Jejak Audit & Keamanan Real-Time"
          subtitle="Pencatatan mutasi data sensitif, akses modul, kegagalan autentikasi, dan deteksi brute-force"
          searchPlaceholder="Cari aksi audit, nama user, detail, modul..."
          searchableKeys={['action', 'user', 'details', 'targetModule', 'status', 'ip']}
          filters={auditFilters}
          initialPageSize={10}
          pageSizeOptions={[5, 10, 25, 50]}
          exportFileName="HomieCozie_Audit_Trail_Log"
          enableExport={true}
        />
      )}

      {/* TAB 4: 6-GATE MIDDLEWARE EXECUTION PIPELINE */}
      {activeTab === 'middleware' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#EAE2D8] p-6 rounded-3xl space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#C84B27]">
                <Fingerprint className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-[#1F1A16]">
                  Alur Eksekusi Middleware 6 Gerbang (PRD Bagian 8.4)
                </h3>
                <p className="text-xs text-[#5C5248]">
                  Mekanisme Fail-Fast: Request dibatalkan seketika pada gerbang pertama yang gagal sebelum menyentuh database.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
              {[
                { gate: 'Gerbang 1', name: 'Rate Limiter Middleware', desc: 'Membatasi request per IP. Jika melebihi batas, langsung tolak dengan HTTP 429 Too Many Requests sebelum menyentuh CPU backend.' },
                { gate: 'Gerbang 2', name: 'Auth Middleware (JWT)', desc: 'Validasi Access Token (15 menit). Jika kedaluwarsa, otomatis rotasi via httpOnly Refresh Token atau tolak HTTP 401 Unauthorized.' },
                { gate: 'Gerbang 3', name: 'Role & Permission Middleware', desc: 'Mengevaluasi role user terhadap matriks Section 8.3 (requireRole / requirePermission). Jika T/tidak cukup, tolak HTTP 403 Forbidden.' },
                { gate: 'Gerbang 4', name: 'Validation DTO Middleware', desc: 'Validasi integritas format payload JSON request (Zod / Joi). Mencegah SQL Injection & data sampah masuk ke sistem.' },
                { gate: 'Gerbang 5', name: 'Business Controller', desc: 'Eksekusi transaksi utama: kalkulasi diskon, update status meja, cetak struk POS, dan mutasi stok bahan baku.' },
                { gate: 'Gerbang 6', name: 'Audit Logging & Response', desc: 'Merekam jejak mutasi data sensitif (void, diskon manual, perubahan harga menu) ke tabel audit_logs dengan IP address.' }
              ].map((g, idx) => (
                <div key={g.gate} className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE2D8] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {g.gate}
                    </span>
                    <span className="text-emerald-700 font-mono text-[10px] flex items-center gap-1 font-bold">
                      <Check className="w-3 h-3" /> Aktif
                    </span>
                  </div>
                  <h4 className="font-bold text-[#1F1A16] text-xs">{g.name}</h4>
                  <p className="text-[11px] text-[#5C5248] leading-relaxed">{g.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW USER MODAL */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#EAE2D8] rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-[#EAE2D8] pb-3">
              <h3 className="font-display font-bold text-base text-[#1F1A16] flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#C84B27]" />
                <span>Tambah Akun Karyawan Baru</span>
              </h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-[#5C5248] hover:text-[#1F1A16] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-[#5C5248] font-medium">Nama Lengkap Karyawan</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="contoh: Agung (Barista Malam)"
                  className="w-full bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl px-3 py-2 text-[#1F1A16] text-xs focus:outline-none focus:border-[#C84B27]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[#5C5248] font-medium">Email Login</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="contoh: barista2@homiecozie.com"
                  className="w-full bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl px-3 py-2 text-[#1F1A16] text-xs focus:outline-none focus:border-[#C84B27]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[#5C5248] font-medium">Assign Peran (Role RBAC)</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="w-full bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl px-3 py-2 text-[#1F1A16] text-xs focus:outline-none focus:border-[#C84B27]"
                >
                  <option value="cashier">Kasir Frontline</option>
                  <option value="kitchen_staff">Staff Dapur & Barista</option>
                  <option value="reservation_staff">Staff Reservasi Meja</option>
                  <option value="manager">Manager / Supervisor</option>
                  <option value="marketing">Marketing & Sosmed</option>
                  <option value="owner">Owner (Pemilik)</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] cursor-pointer">
                <input
                  type="checkbox"
                  checked={newUser2FA}
                  onChange={(e) => setNewUser2FA(e.target.checked)}
                  className="rounded text-[#C84B27] focus:ring-[#C84B27]"
                />
                <div>
                  <span className="font-semibold text-[#1F1A16] block text-xs">Wajibkan 2FA Authenticator</span>
                  <span className="text-[10px] text-[#5C5248] block">Mengharuskan OTP 6 digit saat login</span>
                </div>
              </label>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="w-1/3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#5C5248] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-semibold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Simpan & Beri Akses</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
