import React, { useState, useEffect } from 'react';
import { 
  TableItem, 
  Order, 
  Reservation, 
  SystemUser
} from '../../types';
import { AuditLogEntry } from '../../data/mockData';
import { 
  checkRBACPermission, 
  getDefaultBackstageModuleForRole, 
  BackstageNavModuleId 
} from '../../utils/rbac';
import { useAppStore } from '../../store/useAppStore';

// Layout & Dashboard Sub-Components
import { BackofficeHeader } from './layout/BackofficeHeader';
import { BackofficeSidebar } from './layout/BackofficeSidebar';
import { BackofficeNotificationDrawer } from './layout/BackofficeNotificationDrawer';
import { BackofficeQuickActionModal } from './layout/BackofficeQuickActionModal';
import { BackofficeMobileDrawer } from './layout/BackofficeMobileDrawer';
import { BackofficeMobileBottomBar } from './layout/BackofficeMobileBottomBar';
import { BackofficeDashboardOverview } from './dashboard/BackofficeDashboardOverview';

// Sub-Module Operations (Lazy Loaded for Modular Performance)
const FloorPlanManager = React.lazy(() => import('./FloorPlanManager').then(m => ({ default: m.FloorPlanManager })));
const KitchenDisplaySystem = React.lazy(() => import('./KitchenDisplaySystem').then(m => ({ default: m.KitchenDisplaySystem })));
const POSRegister = React.lazy(() => import('./POSRegister').then(m => ({ default: m.POSRegister })));
const ReservationManagement = React.lazy(() => import('./ReservationManagement').then(m => ({ default: m.ReservationManagement })));
const CRMDatabase = React.lazy(() => import('./CRMDatabase').then(m => ({ default: m.CRMDatabase })));
const InventoryStock = React.lazy(() => import('./InventoryStock').then(m => ({ default: m.InventoryStock })));
const RecipeBOMManager = React.lazy(() => import('./RecipeBOMManager').then(m => ({ default: m.RecipeBOMManager })));
const AnalyticsReports = React.lazy(() => import('./AnalyticsReports').then(m => ({ default: m.AnalyticsReports })));
const UserRBACManager = React.lazy(() => import('./UserRBACManager').then(m => ({ default: m.UserRBACManager })));
const CMSManager = React.lazy(() => import('./CMSManager').then(m => ({ default: m.CMSManager })));
import { RBACGuard } from '../Auth/RBACGuard';

// AI & Thermal Slip Modals (Lazy Loaded)
const AICopilotModal = React.lazy(() => import('./ai/AICopilotModal').then(m => ({ default: m.AICopilotModal })));
const AIChatAgentView = React.lazy(() => import('./ai/AIChatAgentView').then(m => ({ default: m.AIChatAgentView })));
const ThermalReceiptModal = React.lazy(() => import('./pos/ThermalReceiptModal').then(m => ({ default: m.ThermalReceiptModal })));
const ThemeCustomizerDrawer = React.lazy(() => import('./theme/ThemeCustomizerDrawer').then(m => ({ default: m.ThemeCustomizerDrawer })));
const OwnerRadarModal = React.lazy(() => import('./analytics/OwnerRadarModal').then(m => ({ default: m.OwnerRadarModal })));

const SubmoduleFallback: React.FC = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
    <div className="w-8 h-8 border-2 border-amber-600/20 border-t-[#C84B27] rounded-full animate-spin mb-3" />
    <span className="text-[11px] font-mono font-bold text-[#5C5248] uppercase">Memuat Modul Operasional...</span>
  </div>
);

export type NavModuleId = BackstageNavModuleId;

interface EnterpriseBackofficeProps {
  currentSystemUser: SystemUser;
  onSwitchUser: (user: SystemUser) => void;
  tables: TableItem[];
  orders: Order[];
  reservations: Reservation[];
  auditLogs: AuditLogEntry[];
  onUpdateTableStatus: (tableId: string, newStatus: TableItem['status'], customerName?: string) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  onUpdateReservationStatus: (resId: string, newStatus: Reservation['status']) => void;
  onSubmitOrder: (order: any) => void;
  onAddAuditLog: (log: AuditLogEntry) => void;
  onNavigateToCustomerPortal: () => void;
  onNavigateToAuthPage: () => void;
  onOpenPitchDeck?: () => void;
  showToast: (msg: string) => void;
  initialModule?: NavModuleId;
}

export const EnterpriseBackoffice: React.FC<EnterpriseBackofficeProps> = ({
  currentSystemUser,
  onSwitchUser,
  tables,
  orders,
  reservations,
  auditLogs,
  onUpdateTableStatus,
  onUpdateOrderStatus,
  onUpdateReservationStatus,
  onSubmitOrder,
  onAddAuditLog,
  onNavigateToCustomerPortal,
  onNavigateToAuthPage,
  onOpenPitchDeck,
  showToast,
  initialModule
}) => {
  // Global Store States
  const isOnline = useAppStore(s => s.isOnline);
  const inventory = useAppStore(s => s.inventory);
  const requestNotificationPermission = useAppStore(s => s.requestNotificationPermission);

  // Navigation State directly synced from global AppStore
  const activeModule = (useAppStore(s => s.backstageModule) || 'dashboard') as NavModuleId;
  const setActiveModule = useAppStore(s => s.setBackstageModule);

  // Sync active module if initialModule prop changes
  useEffect(() => {
    if (initialModule && initialModule !== activeModule) {
      setActiveModule(initialModule);
    }
  }, [initialModule, activeModule, setActiveModule]);

  // Adjust activeModule if user role changes and doesn't have permission
  useEffect(() => {
    const defaultMod = getDefaultBackstageModuleForRole(currentSystemUser.role);
    const moduleCodeMap: Record<NavModuleId, { code: string; minLevel: 'F' | 'E' | 'L' }> = {
      dashboard: { code: 'MOD-ANA', minLevel: 'L' },
      pos: { code: 'MOD-POS', minLevel: 'E' },
      kds: { code: 'MOD-POS', minLevel: 'L' },
      floorplan: { code: 'MOD-POS', minLevel: 'L' },
      reservations: { code: 'MOD-RES', minLevel: 'L' },
      inventory: { code: 'MOD-INV', minLevel: 'L' },
      recipe_bom: { code: 'MOD-INV', minLevel: 'L' },
      crm: { code: 'MOD-CRM', minLevel: 'L' },
      cms: { code: 'MOD-WEB', minLevel: 'L' },
      sales_revenue: { code: 'MOD-ANA', minLevel: 'L' },
      ai_agent: { code: 'MOD-AI-CHAT', minLevel: 'L' },
      rbac_matrix: { code: 'MOD-USR', minLevel: 'L' }
    };
    const target = moduleCodeMap[activeModule] || { code: 'MOD-POS', minLevel: 'L' };
    const perm = checkRBACPermission(currentSystemUser.role, target.code, target.minLevel);
    if (!perm.allowed) {
      setActiveModule(defaultMod);
    }
  }, [currentSystemUser.role]);

  // UI Drawer, AI Copilot & Modal States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [isQuickActionModalOpen, setIsQuickActionModalOpen] = useState<boolean>(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState<boolean>(false);
  const [isAICopilotOpen, setIsAICopilotOpen] = useState<boolean>(false);
  const [selectedThermalOrder, setSelectedThermalOrder] = useState<Order | null>(null);
  const [isThermalModalOpen, setIsThermalModalOpen] = useState<boolean>(false);
  const [isThemeDrawerOpen, setIsThemeDrawerOpen] = useState<boolean>(false);
  const [isOwnerRadarOpen, setIsOwnerRadarOpen] = useState<boolean>(false);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [posInitialTable, setPosInitialTable] = useState<string>('01');

  const [notifPerm, setNotifPerm] = useState<NotificationPermission>(() => 
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  const handleEnableNotifs = async () => {
    const perm = await requestNotificationPermission();
    setNotifPerm(perm);
  };

  // Trigger manual refresh with animation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('✓ Data transaksi, meja, dan KDS berhasil diperbarui live');
    }, 600);
  };

  const handleOpenPOSForTable = (tableNumber: string) => {
    setPosInitialTable(tableNumber);
    setActiveModule('pos');
  };

  const handleOpenThermalReceipt = (order: Order) => {
    setSelectedThermalOrder(order);
    setIsThermalModalOpen(true);
  };

  const activeOrders = orders.filter(o => o.status === 'preparing' || o.status === 'pending');
  const totalOmzetToday = orders.filter(o => o.paymentStatus === 'paid').reduce((acc, o) => acc + o.total, 0) + 14850000;

  return (
    <div className="backstage-container h-screen max-h-screen w-full bg-[#FAF7F2] text-[#1F1A16] flex flex-col font-sans selection:bg-[#C84B27] selection:text-white overflow-hidden">
      
      {/* 1. TOP SYSTEM BAR */}
      <BackofficeHeader
        currentSystemUser={currentSystemUser}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        activeOrdersCount={activeOrders.length}
        showNotificationDrawer={showNotificationDrawer}
        onToggleNotificationDrawer={() => setShowNotificationDrawer(!showNotificationDrawer)}
        onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
        onNavigateToCustomerPortal={onNavigateToCustomerPortal}
        onNavigateToAuthPage={onNavigateToAuthPage}
        isOnline={isOnline}
        onEnableNotifications={handleEnableNotifs}
        notificationPermission={notifPerm}
        onOpenAICopilot={() => setIsAICopilotOpen(true)}
        onOpenThemeCustomizer={() => setIsThemeDrawerOpen(true)}
        onOpenOwnerRadar={() => setIsOwnerRadarOpen(true)}
      />

      {/* 2. MAIN SPLIT LAYOUT (SIDEBAR + WORKSPACE) */}
      <div className="flex-1 flex overflow-hidden min-h-0 h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)]">
        
        {/* Left Desktop Sidebar */}
        <BackofficeSidebar
          activeModule={activeModule}
          onSelectModule={setActiveModule}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          userRole={currentSystemUser.role}
          onOpenQuickAction={() => setIsQuickActionModalOpen(true)}
        />

        {/* Center Main Workspace */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#FAF7F2] overflow-y-auto overflow-x-hidden max-h-full">
          <React.Suspense fallback={<SubmoduleFallback />}>
            {/* Module 1: Dashboard Overview */}
            {activeModule === 'dashboard' && (
              <RBACGuard currentUser={currentSystemUser} moduleCode="MOD-ANA" minRequiredLevel="L" onOpenLoginModal={onNavigateToAuthPage}>
                <BackofficeDashboardOverview
                  tables={tables}
                  orders={orders}
                  reservations={reservations}
                  onNavigateToModule={setActiveModule}
                  onOpenPOSForTable={handleOpenPOSForTable}
                />
              </RBACGuard>
            )}

            {/* Module 2: POS Billing Register */}
            {activeModule === 'pos' && (
              <RBACGuard currentUser={currentSystemUser} moduleCode="MOD-POS" minRequiredLevel="E" onOpenLoginModal={onNavigateToAuthPage}>
                <POSRegister
                  tables={tables}
                  orders={orders}
                  onSubmitOrder={onSubmitOrder}
                  onUpdateOrderStatus={onUpdateOrderStatus}
                  onUpdateTableStatus={onUpdateTableStatus}
                  initialTableNumber={posInitialTable}
                />
              </RBACGuard>
            )}

            {/* Module 3: Kitchen Display System (KDS) */}
            {activeModule === 'kds' && (
              <RBACGuard currentUser={currentSystemUser} moduleCode="MOD-POS" minRequiredLevel="L" onOpenLoginModal={onNavigateToAuthPage}>
                <KitchenDisplaySystem
                  orders={orders}
                  onUpdateOrderStatus={onUpdateOrderStatus}
                />
              </RBACGuard>
            )}

            {/* Module 4: Floor Plan & Table Management */}
            {activeModule === 'floorplan' && (
              <RBACGuard currentUser={currentSystemUser} moduleCode="MOD-POS" minRequiredLevel="L" onOpenLoginModal={onNavigateToAuthPage}>
                <FloorPlanManager
                  tables={tables}
                  onUpdateTableStatus={onUpdateTableStatus}
                  onOpenPOSForTable={handleOpenPOSForTable}
                />
              </RBACGuard>
            )}

            {/* Module 5: Reservation & Waitlist */}
            {activeModule === 'reservations' && (
              <RBACGuard currentUser={currentSystemUser} moduleCode="MOD-RES" minRequiredLevel="L" onOpenLoginModal={onNavigateToAuthPage}>
                <ReservationManagement
                  reservations={reservations}
                  tables={tables}
                  onUpdateStatus={onUpdateReservationStatus}
                  onAddAuditLog={onAddAuditLog}
                />
              </RBACGuard>
            )}

            {/* Module 6: Inventory Stock */}
            {activeModule === 'inventory' && (
              <RBACGuard currentUser={currentSystemUser} moduleCode="MOD-INV" minRequiredLevel="L" onOpenLoginModal={onNavigateToAuthPage}>
                <InventoryStock />
              </RBACGuard>
            )}

            {/* Module 7: Recipe & Bill of Materials (BOM) */}
            {activeModule === 'recipe_bom' && (
              <RBACGuard currentUser={currentSystemUser} moduleCode="MOD-INV" minRequiredLevel="L" onOpenLoginModal={onNavigateToAuthPage}>
                <RecipeBOMManager />
              </RBACGuard>
            )}

            {/* Module 8: CRM Database & Loyalty */}
            {activeModule === 'crm' && (
              <RBACGuard currentUser={currentSystemUser} moduleCode="MOD-CRM" minRequiredLevel="L" onOpenLoginModal={onNavigateToAuthPage}>
                <CRMDatabase />
              </RBACGuard>
            )}

            {/* Module 9: Sales Revenue & PB1 Tax Reports */}
            {activeModule === 'sales_revenue' && (
              <RBACGuard currentUser={currentSystemUser} moduleCode="MOD-ANA" minRequiredLevel="L" onOpenLoginModal={onNavigateToAuthPage}>
                <AnalyticsReports
                  orders={orders}
                  reservations={reservations}
                />
              </RBACGuard>
            )}

            {/* Module 10: User RBAC Matrix & Audit Trail */}
            {activeModule === 'rbac_matrix' && (
              <RBACGuard currentUser={currentSystemUser} moduleCode="MOD-USR" minRequiredLevel="L" onOpenLoginModal={onNavigateToAuthPage}>
                <UserRBACManager
                  currentUser={currentSystemUser}
                  currentSystemUser={currentSystemUser}
                  onSwitchUser={onSwitchUser}
                  auditLogs={auditLogs}
                  onAddAuditLog={onAddAuditLog}
                />
              </RBACGuard>
            )}

            {/* Module 11: Professional Content Management System (CMS) */}
            {activeModule === 'cms' && (
              <RBACGuard currentUser={currentSystemUser} moduleCode="MOD-WEB" minRequiredLevel="L" onOpenLoginModal={onNavigateToAuthPage}>
                <CMSManager showToast={showToast} />
              </RBACGuard>
            )}

            {/* Module 12: AI Cozie Assistant (Chat Agent) */}
            {activeModule === 'ai_agent' && (
              <RBACGuard currentUser={currentSystemUser} moduleCode="MOD-AI-CHAT" minRequiredLevel="L" onOpenLoginModal={onNavigateToAuthPage}>
                <div className="flex-1 flex flex-col min-h-0 h-full p-0 sm:p-4 pb-16 lg:pb-0 overflow-hidden">
                  <AIChatAgentView />
                </div>
              </RBACGuard>
            )}
          </React.Suspense>
        </main>

      </div>

      {/* 3. MODALS & DRAWERS */}
      <BackofficeNotificationDrawer
        isOpen={showNotificationDrawer}
        onClose={() => setShowNotificationDrawer(false)}
        orders={orders}
        tables={tables}
        onNavigateToModule={setActiveModule}
      />

      <BackofficeQuickActionModal
        isOpen={isQuickActionModalOpen}
        onClose={() => setIsQuickActionModalOpen(false)}
        onNavigateToModule={setActiveModule}
      />

      <BackofficeMobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        userRole={currentSystemUser.role}
        onNavigateToCustomerPortal={onNavigateToCustomerPortal}
        onOpenPitchDeck={onOpenPitchDeck}
        onOpenThemeCustomizer={() => setIsThemeDrawerOpen(true)}
        onOpenAICopilot={() => setIsAICopilotOpen(true)}
        onOpenOwnerRadar={() => setIsOwnerRadarOpen(true)}
      />

      {/* AI Executive Copilot Modal */}
      {isAICopilotOpen && (
        <React.Suspense fallback={null}>
          <AICopilotModal
            isOpen={isAICopilotOpen}
            onClose={() => setIsAICopilotOpen(false)}
            orders={orders}
            inventory={inventory}
            totalOmzet={totalOmzetToday}
          />
        </React.Suspense>
      )}

      {/* Dual Thermal Receipt Modal */}
      {isThermalModalOpen && (
        <React.Suspense fallback={null}>
          <ThermalReceiptModal
            isOpen={isThermalModalOpen}
            onClose={() => setIsThermalModalOpen(false)}
            order={selectedThermalOrder}
            cashierName={currentSystemUser.name}
          />
        </React.Suspense>
      )}

      {/* Theme Customizer Drawer */}
      {isThemeDrawerOpen && (
        <React.Suspense fallback={null}>
          <ThemeCustomizerDrawer
            isOpen={isThemeDrawerOpen}
            onClose={() => setIsThemeDrawerOpen(false)}
          />
        </React.Suspense>
      )}

      {/* Live Owner Radar Modal */}
      {isOwnerRadarOpen && (
        <React.Suspense fallback={null}>
          <OwnerRadarModal
            isOpen={isOwnerRadarOpen}
            onClose={() => setIsOwnerRadarOpen(false)}
            tables={tables}
            orders={orders}
          />
        </React.Suspense>
      )}

      {/* 4. MOBILE BOTTOM NAVIGATION BAR */}
      <BackofficeMobileBottomBar
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        onOpenDrawer={() => setIsMobileDrawerOpen(true)}
        onOpenAICopilot={() => setIsAICopilotOpen(true)}
        orders={orders}
      />

    </div>
  );
};
