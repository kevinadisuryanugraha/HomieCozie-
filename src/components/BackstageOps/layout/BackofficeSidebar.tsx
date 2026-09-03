import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  UtensilsCrossed, 
  Store, 
  CalendarDays, 
  Package, 
  Layers,
  Users, 
  TrendingUp, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Lock,
  Plus,
  Globe,
  Bot,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../../../types';
import { BackstageNavModuleId, checkRBACPermission } from '../../../utils/rbac';

export interface NavCategoryItem {
  id: BackstageNavModuleId;
  label: string;
  icon: any;
  moduleCode: string;
  badge?: string;
}

export interface NavCategoryGroup {
  title: string;
  items: NavCategoryItem[];
}

export const BACKOFFICE_NAV_GROUPS: NavCategoryGroup[] = [
  {
    title: 'COMMAND CENTER',
    items: [
      { id: 'dashboard', label: 'Dashboard Ringkasan', icon: LayoutDashboard, moduleCode: 'MOD-ANA' },
      { id: 'ai_agent', label: 'AI Cozie Assistant', icon: Bot, moduleCode: 'MOD-AI-CHAT', badge: 'AI' }
    ]
  },
  {
    title: 'OPERASIONAL LAPANGAN',
    items: [
      { id: 'pos', label: 'Kasir & POS Order', icon: ShoppingBag, moduleCode: 'MOD-POS' },
      { id: 'kds', label: 'Dapur & Bar KDS', icon: UtensilsCrossed, moduleCode: 'MOD-POS' },
      { id: 'floorplan', label: 'Denah Meja & Sesi', icon: Store, moduleCode: 'MOD-POS' },
      { id: 'reservations', label: 'Reservasi & Waitlist', icon: CalendarDays, moduleCode: 'MOD-RES' }
    ]
  },
  {
    title: 'MANAJEMEN & CRM',
    items: [
      { id: 'inventory', label: 'Stok Bahan Baku', icon: Package, moduleCode: 'MOD-INV' },
      { id: 'recipe_bom', label: 'Resep & BOM HPP', icon: Layers, moduleCode: 'MOD-INV' },
      { id: 'crm', label: 'Database CRM & Poin', icon: Users, moduleCode: 'MOD-CRM' },
      { id: 'cms', label: 'CMS & Konten Web', icon: Globe, moduleCode: 'MOD-WEB' }
    ]
  },
  {
    title: 'FINANSIAL & TATA KELOLA',
    items: [
      { id: 'sales_revenue', label: 'Analitik & Laporan Pajak', icon: TrendingUp, moduleCode: 'MOD-ANA' },
      { id: 'rbac_matrix', label: 'Pengaturan RBAC & Staf', icon: ShieldCheck, moduleCode: 'MOD-USR' }
    ]
  }
];

interface BackofficeSidebarProps {
  activeModule: BackstageNavModuleId;
  onSelectModule: (mod: BackstageNavModuleId) => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  userRole: UserRole;
  onOpenQuickAction: () => void;
}

export const BackofficeSidebar: React.FC<BackofficeSidebarProps> = ({
  activeModule,
  onSelectModule,
  isSidebarCollapsed,
  onToggleSidebar,
  userRole,
  onOpenQuickAction
}) => {
  return (
    <aside className={`hidden lg:flex flex-col justify-between h-full max-h-full bg-white border-r border-[#EAE2D8] transition-all duration-300 z-30 shrink-0 select-none overflow-hidden ${
      isSidebarCollapsed ? 'w-20' : 'w-64'
    }`}>
      
      {/* Top Section: Header & Categorized Nav */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-4 scrollbar-none">
        
        {/* Sidebar Header & Toggle */}
        <div className="flex items-center justify-between px-2 py-1.5 border-b border-[#EAE2D8] pb-2">
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5C5248]">
                Shift Aktif • Pos 1
              </span>
            </div>
          ) : (
            <div className="w-2 h-2 rounded-full bg-emerald-500 mx-auto mb-1 animate-pulse" title="Sistem Online" />
          )}
          
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-xl hover:bg-[#FAF7F2] text-[#5C5248] hover:text-[#1F1A16] transition-colors border border-transparent hover:border-[#EAE2D8] cursor-pointer"
            title={isSidebarCollapsed ? 'Perluas Sidebar' : 'Kecilkan Sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Categorized Nav Groups */}
        <div className="space-y-4">
          {BACKOFFICE_NAV_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!isSidebarCollapsed ? (
                <div className="text-[10px] font-mono font-bold tracking-wider text-[#5C5248] px-2.5 py-1 uppercase flex items-center justify-between">
                  <span>{group.title}</span>
                </div>
              ) : (
                <div className="h-px bg-[#EAE2D8] my-2 mx-2" />
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeModule === item.id;
                  const perm = checkRBACPermission(userRole, item.moduleCode, 'L');
                  const hasAccess = perm.allowed;

                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectModule(item.id)}
                      title={isSidebarCollapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all relative cursor-pointer group ${
                        isActive
                          ? 'bg-[#C84B27] text-white shadow-xs'
                          : hasAccess
                            ? 'text-[#5C5248] hover:text-[#1F1A16] hover:bg-[#FAF7F2]'
                            : 'text-stone-400 hover:bg-stone-50/50 opacity-60'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 transition-transform ${
                        isActive ? 'scale-110 text-white' : 'text-[#5C5248] group-hover:text-[#1F1A16]'
                      }`} />

                      {!isSidebarCollapsed && (
                        <div className="flex-1 flex items-center justify-between text-left truncate">
                          <span className="truncate">{item.label}</span>
                          {!hasAccess && (
                            <Lock className="w-3 h-3 text-stone-400 shrink-0 ml-1" />
                          )}
                          {hasAccess && perm.level === 'F' && !isActive && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
                              Full
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Floating Quick Action Button */}
      <div className="p-3 border-t border-[#EAE2D8] shrink-0">
        <button
          onClick={onOpenQuickAction}
          className="w-full py-2.5 px-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {!isSidebarCollapsed && <span>Aksi Cepat Resto</span>}
        </button>
      </div>

    </aside>
  );
};
