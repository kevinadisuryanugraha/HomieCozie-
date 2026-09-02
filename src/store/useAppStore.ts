import { create } from 'zustand';
import { 
  AppMode, 
  MenuItem, 
  CartItem, 
  Reservation, 
  TableItem, 
  Order, 
  OrderStatus, 
  SystemUser, 
  UserRole, 
  WaiterCallRequest,
  InventoryItem,
  MenuRecipe,
  BOMDeductionLog,
  BOMDeductionItem,
  BackstageThemeConfig
} from '../types';
import { 
  INITIAL_MENU_ITEMS, 
  INITIAL_TABLES, 
  INITIAL_RESERVATIONS, 
  INVENTORY_ITEMS,
  MOCK_SYSTEM_USERS, 
  INITIAL_AUDIT_LOGS, 
  AuditLogEntry 
} from '../data/mockData';
import { DEFAULT_MENU_RECIPES } from '../data/recipeData';
import { DEFAULT_BACKSTAGE_THEME } from '../data/themePresets';
import { getStoredThemeConfig, saveThemeConfig, applyThemeToDOM } from '../utils/themeEngine';
import { BackstageNavModuleId, getDefaultBackstageModuleForRole } from '../utils/rbac';
import { notificationService } from '../utils/notificationService';
import { soundService } from '../utils/audioChime';
import { api } from '../services/api';
import { realtimeService } from '../services/realtime';

// Helper to parse route from URL hash
const parseInitialRoute = (): { mode: AppMode; backstageModule: BackstageNavModuleId; customerTab: string } => {
  if (typeof window === 'undefined') {
    return { mode: 'customer', backstageModule: 'dashboard', customerTab: 'home' };
  }
  const hash = window.location.hash.replace(/^#\/?/, '').trim();
  const savedMode = (localStorage.getItem('homie_cozie_app_mode') as AppMode) || null;
  const savedModule = (localStorage.getItem('homie_cozie_backstage_module') as BackstageNavModuleId) || 'dashboard';

  if (!hash) {
    if (savedMode) {
      return { mode: savedMode, backstageModule: savedModule, customerTab: 'home' };
    }
    return { mode: 'customer', backstageModule: 'dashboard', customerTab: 'home' };
  }

  const parts = hash.split('/');
  const primary = parts[0].toLowerCase();
  const secondary = parts[1]?.toLowerCase();

  if (primary === 'backstage') {
    const validModules: BackstageNavModuleId[] = [
      'dashboard', 'pos', 'kds', 'floorplan', 'reservations',
      'inventory', 'recipe_bom', 'crm', 'cms', 'sales_revenue', 'rbac_matrix', 'ai_agent'
    ];
    let normalized = (secondary || '').toLowerCase();
    if (normalized === 'rbac' || normalized === 'users' || normalized === 'audit') normalized = 'rbac_matrix';
    if (normalized === 'stock') normalized = 'inventory';
    if (normalized === 'recipe' || normalized === 'bom' || normalized === 'hpp') normalized = 'recipe_bom';
    if (normalized === 'tables') normalized = 'floorplan';
    if (normalized === 'analytics' || normalized === 'pajak' || normalized === 'revenue') normalized = 'sales_revenue';
    if (normalized === 'members' || normalized === 'loyalty') normalized = 'crm';
    if (normalized === 'cms' || normalized === 'konten' || normalized === 'web') normalized = 'cms';
    if (normalized === 'ai' || normalized === 'chat' || normalized === 'agent' || normalized === 'copilot') normalized = 'ai_agent';

    const targetMod = validModules.includes(normalized as any) ? (normalized as BackstageNavModuleId) : savedModule;
    return { mode: 'backstage', backstageModule: targetMod, customerTab: 'home' };
  }

  if (primary === 'reservation' || primary === 'reservasi') {
    return { mode: 'reservation', backstageModule: 'dashboard', customerTab: 'home' };
  }

  if (primary === 'order' || primary === 'checkout') {
    return { mode: 'order', backstageModule: 'dashboard', customerTab: 'home' };
  }

  if (primary === 'member' || primary === 'loyalty') {
    return { mode: 'member', backstageModule: 'dashboard', customerTab: 'home' };
  }

  if (primary === 'auth' || primary === 'login') {
    return { mode: 'auth', backstageModule: 'dashboard', customerTab: 'home' };
  }

  if (primary === 'prd-pitch') {
    return { mode: 'prd-pitch', backstageModule: 'dashboard', customerTab: 'home' };
  }

  if (['menu', 'events', 'about', 'location', 'gallery', 'faq', 'hero'].includes(primary)) {
    return { mode: 'customer', backstageModule: 'dashboard', customerTab: primary };
  }

  return { mode: 'customer', backstageModule: 'dashboard', customerTab: 'home' };
};

const initialRoute = parseInitialRoute();

// Safe LocalStorage helpers
const loadFromStorage = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}
  return fallback;
};

const saveToStorage = (key: string, value: any) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

export interface AppState {
  // Navigation & Routing
  appMode: AppMode;
  customerTab: string;
  backstageModule: BackstageNavModuleId;
  toastMessage: string | null;
  isOnline: boolean;
  isApiConnected: boolean;

  // Authentication & RBAC Session
  currentSystemUser: SystemUser;
  auditLogs: AuditLogEntry[];

  // F&B Operations Core Data
  tables: TableItem[];
  reservations: Reservation[];
  orders: Order[];
  cartItems: CartItem[];
  waiterCalls: WaiterCallRequest[];
  customerActiveOrder: Order | null;
  isGlobalTrackerOpen: boolean;

  // Inventory & Recipe BOM Data
  inventory: InventoryItem[];
  recipes: MenuRecipe[];
  deductionLogs: BOMDeductionLog[];

  // Actions - Sync & Live Data
  fetchInitialDataFromAPI: () => Promise<void>;

  // Actions - Navigation & Network
  syncFromHash: (rawHash: string) => void;
  setAppMode: (mode: AppMode) => void;
  setCustomerTab: (tab: string) => void;
  setBackstageModule: (module: BackstageNavModuleId) => void;
  navigateToMode: (mode: AppMode, backstageModule?: BackstageNavModuleId, tab?: string) => void;
  showToast: (msg: string, durationMs?: number) => void;
  setIsGlobalTrackerOpen: (open: boolean) => void;
  setIsOnline: (online: boolean) => void;
  requestNotificationPermission: () => Promise<NotificationPermission>;

  // Actions - Auth & Staff
  setCurrentUser: (user: SystemUser) => void;
  switchRole: (role: UserRole) => void;
  loginStaff: (user: SystemUser, log?: AuditLogEntry, targetModule?: BackstageNavModuleId) => void;
  logoutStaff: () => void;
  addAuditLog: (log: AuditLogEntry) => void;

  // Actions - Table & Floor Plan
  updateTableStatus: (tableId: string, status: TableItem['status'], customerName?: string) => void;

  // Actions - Reservations
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt' | 'bookingCode' | 'status' | 'waConfirmed'>) => Reservation;
  updateReservationStatus: (resId: string, status: Reservation['status'], tableNumber?: string) => void;

  // Actions - Orders & POS
  addOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  setCustomerActiveOrder: (order: Order | null) => void;

  // Actions - Inventory & BOM
  updateInventoryStock: (itemId: string, newStock: number) => void;
  restockItem: (itemId: string, addedQty: number) => void;
  addRecipe: (recipe: MenuRecipe) => void;
  updateRecipe: (recipeId: string, updated: Partial<MenuRecipe>) => void;
  deleteRecipe: (recipeId: string) => void;

  // Actions - Cart
  addToCart: (menuItem: MenuItem, quantity?: number, options?: Record<string, string>, notes?: string) => void;
  updateCartQty: (cartItemId: string, newQty: number) => void;
  removeCartItem: (cartItemId: string) => void;
  clearCart: () => void;

  // Actions - Theme & Visual Customization
  backstageTheme: BackstageThemeConfig;
  updateBackstageTheme: (config: Partial<BackstageThemeConfig>) => void;
  resetBackstageTheme: () => void;

  // Actions - Waiter Assistance
  requestAssistance: (req: Omit<WaiterCallRequest, 'id' | 'createdAt' | 'status'>) => void;
  resolveWaiterCall: (callId: string) => void;
}

let toastTimer: any = null;

export const useAppStore = create<AppState>((set, get) => ({
  // Navigation State
  appMode: initialRoute.mode,
  customerTab: initialRoute.customerTab || 'home',
  backstageModule: initialRoute.backstageModule || 'dashboard',
  toastMessage: null,
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  isApiConnected: false,

  // Auth State
  currentSystemUser: loadFromStorage<SystemUser>(
    'homie_cozie_active_user', 
    initialRoute.mode === 'backstage' ? MOCK_SYSTEM_USERS[0] : MOCK_SYSTEM_USERS[8]
  ),
  auditLogs: loadFromStorage<AuditLogEntry[]>('homie_cozie_audit_logs', INITIAL_AUDIT_LOGS),

  // Operations Data
  tables: loadFromStorage<TableItem[]>('homie_cozie_tables', INITIAL_TABLES),
  reservations: loadFromStorage<Reservation[]>('homie_cozie_reservations', INITIAL_RESERVATIONS),
  orders: loadFromStorage<Order[]>('homie_cozie_orders', [
    {
      id: 'ord-init-1',
      orderNumber: 'HC-9421',
      orderType: 'dine-in',
      tableNumber: '06',
      customerName: 'Bima Satria',
      customerPhone: '081298765432',
      items: [
        {
          cartItemId: 'c-1',
          menuItem: INITIAL_MENU_ITEMS[0],
          quantity: 2,
          selectedOptions: { sugar: 'Less Sweet (70%)', ice: 'Normal Ice' }
        },
        {
          cartItemId: 'c-2',
          menuItem: INITIAL_MENU_ITEMS[4],
          quantity: 1,
          selectedOptions: { spiciness: 'Pedas Mantap' }
        }
      ],
      subtotal: 84000,
      serviceCharge: 4200,
      tax: 8400,
      discount: 0,
      total: 96600,
      paymentMethod: 'qris',
      paymentStatus: 'paid',
      status: 'preparing',
      createdAt: '20:12 WIB'
    }
  ]),
  cartItems: loadFromStorage<CartItem[]>('homie_cozie_cart', []),
  waiterCalls: [],
  customerActiveOrder: null,
  isGlobalTrackerOpen: false,

  // Inventory & Recipes State
  inventory: loadFromStorage<InventoryItem[]>('homie_cozie_inventory', INVENTORY_ITEMS),
  recipes: loadFromStorage<MenuRecipe[]>('homie_cozie_recipes', DEFAULT_MENU_RECIPES),
  deductionLogs: loadFromStorage<BOMDeductionLog[]>('homie_cozie_deduction_logs', [
    {
      id: 'deduct-1',
      timestamp: '19:42 WIB',
      orderNumber: 'HC-9421',
      customerName: 'Bima Satria',
      items: [
        {
          menuItemName: 'Kopi Susu Homie Signature',
          quantity: 2,
          deductions: [
            { ingredientName: 'Arabika House Blend Beans', deductAmount: 36, unit: 'gram', stockRemaining: 14.82, inventoryUnit: 'kg' },
            { ingredientName: 'Fresh Milk Pasteurized', deductAmount: 240, unit: 'ml', stockRemaining: 21.6, inventoryUnit: 'liter' },
            { ingredientName: 'Gula Aren Organik Cair', deductAmount: 50, unit: 'ml', stockRemaining: 8.4, inventoryUnit: 'liter' },
            { ingredientName: 'Paper Cup & Lid 12oz', deductAmount: 2, unit: 'pcs', stockRemaining: 180, inventoryUnit: 'pcs' }
          ]
        }
      ]
    }
  ]),

  // Backstage Custom Theme State
  backstageTheme: (() => {
    const theme = getStoredThemeConfig();
    applyThemeToDOM(theme);
    return theme;
  })(),

  // Live Data Synchronization from Laravel 11 Backend API
  fetchInitialDataFromAPI: async () => {
    try {
      const [tablesRes, ordersRes, invRes, resRes, auditRes] = await Promise.allSettled([
        api.tables.getAll(),
        api.orders.getAll(),
        api.inventory.getAll(),
        api.reservations.getAll(),
        api.auditLogs.getAll(),
      ]);

      set(state => {
        const nextState: Partial<AppState> = { isApiConnected: true };

        // Sync Tables
        if (tablesRes.status === 'fulfilled' && tablesRes.value?.tables) {
          const mappedTables: TableItem[] = tablesRes.value.tables.map((t: any) => ({
            id: String(t.id),
            tableNumber: t.table_number,
            name: t.name,
            area: t.area,
            areaLabel: t.area_label || t.area,
            capacity: t.capacity,
            status: t.status,
            currentOrderId: t.current_order_id ? String(t.current_order_id) : undefined,
            currentCustomer: t.current_customer || undefined,
            occupiedSince: t.occupied_since || undefined,
            reservedForTime: t.reserved_for_time || undefined,
          }));
          nextState.tables = mappedTables;
          saveToStorage('homie_cozie_tables', mappedTables);
        }

        // Sync Orders
        if (ordersRes.status === 'fulfilled' && ordersRes.value?.orders) {
          const mappedOrders: Order[] = ordersRes.value.orders.map((o: any) => ({
            id: String(o.id),
            orderNumber: o.order_number,
            orderType: o.order_type,
            tableNumber: o.table_number || (o.table ? o.table.table_number : undefined),
            customerName: o.customer_name,
            customerPhone: o.customer_phone || undefined,
            items: (o.items || []).map((it: any) => ({
              cartItemId: `c-${it.id}`,
              menuItem: {
                id: String(it.menu_item_id),
                name: it.item_name || (it.menu_item ? it.menu_item.name : 'Item'),
                category: it.menu_item ? it.menu_item.category?.slug || 'coffee' : 'coffee',
                categoryLabel: it.menu_item?.category?.name || 'Menu',
                price: Number(it.unit_price),
                description: it.menu_item?.description || '',
                image: it.menu_item?.image || '/photos/homie_cozie_008.jpg',
                tags: it.menu_item?.tags || [],
                available: true,
                preparationTimeMinutes: 5,
              },
              quantity: it.quantity,
              selectedOptions: it.selected_options || undefined,
              notes: it.notes || undefined,
            })),
            subtotal: Number(o.subtotal),
            discount: Number(o.discount || 0),
            serviceCharge: Number(o.service_charge || 0),
            tax: Number(o.tax_pb1 || 0),
            total: Number(o.total),
            paymentMethod: o.payment_method,
            paymentStatus: o.payment_status,
            status: o.status,
            createdAt: o.created_at ? new Date(o.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB' : 'Hari ini',
            notes: o.notes || undefined,
          }));
          nextState.orders = mappedOrders;
          saveToStorage('homie_cozie_orders', mappedOrders);
        }

        // Sync Inventory
        if (invRes.status === 'fulfilled' && invRes.value?.inventory) {
          const mappedInv: InventoryItem[] = invRes.value.inventory.map((inv: any) => ({
            id: String(inv.id),
            name: inv.name,
            category: inv.category,
            currentStock: Number(inv.current_stock),
            minStock: Number(inv.min_stock),
            unit: inv.unit,
            costPerUnit: Number(inv.cost_per_unit),
            supplier: inv.supplier || '',
            status: inv.status,
          }));
          nextState.inventory = mappedInv;
          saveToStorage('homie_cozie_inventory', mappedInv);
        }

        // Sync Reservations
        if (resRes.status === 'fulfilled' && resRes.value?.reservations) {
          const mappedRes: Reservation[] = resRes.value.reservations.map((r: any) => ({
            id: String(r.id),
            bookingCode: r.booking_code,
            customerName: r.customer_name,
            customerPhone: r.customer_phone,
            customerEmail: r.customer_email || undefined,
            guestCount: r.guest_count,
            date: r.reservation_date,
            timeSlot: r.time_slot,
            areaPreference: r.area_preference,
            tableNumber: r.table_number || undefined,
            specialOccasion: r.special_occasion || undefined,
            notes: r.notes || undefined,
            status: r.status,
            createdAt: r.created_at ? new Date(r.created_at).toLocaleDateString('id-ID') : 'Hari ini',
            waConfirmed: Boolean(r.wa_confirmed),
          }));
          nextState.reservations = mappedRes;
          saveToStorage('homie_cozie_reservations', mappedRes);
        }

        return nextState;
      });
    } catch (e) {
      console.warn('Live API sync offline, using local store:', e);
      set({ isApiConnected: false });
    }
  },

  // Toast Action
  showToast: (msg: string, durationMs: number = 3500) => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toastMessage: msg });
    toastTimer = setTimeout(() => {
      set({ toastMessage: null });
    }, durationMs);
  },

  setIsGlobalTrackerOpen: (open: boolean) => set({ isGlobalTrackerOpen: open }),
  setIsOnline: (online: boolean) => set({ isOnline: online }),

  requestNotificationPermission: async () => {
    const perm = await notificationService.requestPermission();
    if (perm === 'granted') {
      get().showToast('🔔 Notifikasi web telah diaktifkan untuk tiket pesanan & panggilan pelayan');
    } else {
      get().showToast('ℹ️ Izin notifikasi ditolak / diblokir oleh peramban');
    }
    return perm;
  },

  // Navigation Actions
  syncFromHash: (rawHash: string) => {
    const hash = (rawHash || '').replace(/^#\/?/, '').trim();
    if (!hash) {
      set({ appMode: 'customer', customerTab: 'home' });
      return;
    }
    const parts = hash.split('/');
    const primary = parts[0].toLowerCase();
    const secondary = parts[1]?.toLowerCase();

    if (primary === 'backstage') {
      const validModules: BackstageNavModuleId[] = [
        'dashboard', 'pos', 'kds', 'floorplan', 'reservations',
        'inventory', 'recipe_bom', 'crm', 'cms', 'sales_revenue', 'rbac_matrix', 'ai_agent'
      ];
      let normalized = (secondary || '').toLowerCase();
      if (normalized === 'rbac' || normalized === 'users' || normalized === 'audit') normalized = 'rbac_matrix';
      if (normalized === 'stock') normalized = 'inventory';
      if (normalized === 'recipe' || normalized === 'bom' || normalized === 'hpp') normalized = 'recipe_bom';
      if (normalized === 'tables') normalized = 'floorplan';
      if (normalized === 'analytics' || normalized === 'pajak' || normalized === 'revenue') normalized = 'sales_revenue';
      if (normalized === 'members' || normalized === 'loyalty') normalized = 'crm';
      if (normalized === 'cms' || normalized === 'konten' || normalized === 'web') normalized = 'cms';
      if (normalized === 'ai' || normalized === 'chat' || normalized === 'agent' || normalized === 'copilot') normalized = 'ai_agent';

      const targetMod = validModules.includes(normalized as any) ? (normalized as BackstageNavModuleId) : 'dashboard';
      const { currentSystemUser } = get();
      if (currentSystemUser.role === 'guest' || currentSystemUser.role === 'member') {
        const staffUser = MOCK_SYSTEM_USERS[0];
        set({ currentSystemUser: staffUser });
        saveToStorage('homie_cozie_active_user', staffUser);
      }
      set({ appMode: 'backstage', backstageModule: targetMod });
      if (typeof window !== 'undefined') {
        localStorage.setItem('homie_cozie_backstage_module', targetMod);
        localStorage.setItem('homie_cozie_app_mode', 'backstage');
      }
    } else if (['reservation', 'order', 'member', 'auth', 'prd-pitch'].includes(primary)) {
      set({ appMode: primary as AppMode });
      if (typeof window !== 'undefined') {
        localStorage.setItem('homie_cozie_app_mode', primary);
      }
    } else if (['menu', 'events', 'about', 'location', 'gallery', 'faq', 'hero'].includes(primary)) {
      set({ appMode: 'customer', customerTab: primary });
      if (typeof window !== 'undefined') {
        localStorage.setItem('homie_cozie_app_mode', 'customer');
      }
    } else {
      set({ appMode: 'customer', customerTab: 'home' });
      if (typeof window !== 'undefined') {
        localStorage.setItem('homie_cozie_app_mode', 'customer');
      }
    }
  },

  setAppMode: (mode: AppMode) => {
    set({ appMode: mode });
    if (typeof window !== 'undefined') {
      localStorage.setItem('homie_cozie_app_mode', mode);
      const target = mode === 'customer' ? '#' : `#${mode}`;
      if (window.location.hash !== target && !(mode === 'customer' && !window.location.hash)) {
        window.location.hash = target;
      }
    }
  },

  setCustomerTab: (tab: string) => set({ customerTab: tab }),

  setBackstageModule: (module: BackstageNavModuleId) => {
    set({ backstageModule: module });
    if (typeof window !== 'undefined') {
      localStorage.setItem('homie_cozie_backstage_module', module);
      const target = `#backstage/${module}`;
      if (window.location.hash !== target) {
        window.location.hash = target;
      }
    }
  },

  navigateToMode: (mode: AppMode, backstageModule?: BackstageNavModuleId, tab?: string) => {
    const { currentSystemUser, backstageModule: curMod, customerTab: curTab } = get();
    
    set({ appMode: mode });
    if (typeof window !== 'undefined') {
      localStorage.setItem('homie_cozie_app_mode', mode);
    }

    if (mode === 'backstage') {
      if (currentSystemUser.role === 'guest' || currentSystemUser.role === 'member') {
        const staffUser = MOCK_SYSTEM_USERS[0];
        set({ currentSystemUser: staffUser });
        saveToStorage('homie_cozie_active_user', staffUser);
      }
      const targetMod = backstageModule || curMod || 'dashboard';
      set({ backstageModule: targetMod });
      if (typeof window !== 'undefined') {
        localStorage.setItem('homie_cozie_backstage_module', targetMod);
        const target = `#backstage/${targetMod}`;
        if (window.location.hash !== target) {
          window.location.hash = target;
        }
      }
    } else if (mode === 'customer') {
      const targetTab = tab || curTab;
      if (targetTab && targetTab !== 'home' && targetTab !== 'hero' && typeof window !== 'undefined') {
        const target = `#${targetTab}`;
        if (window.location.hash !== target) {
          window.location.hash = target;
        }
      } else if (typeof window !== 'undefined') {
        if (window.location.hash && window.location.hash !== '#') {
          window.location.hash = '#';
        }
      }
    } else if (typeof window !== 'undefined') {
      const target = `#${mode}`;
      if (window.location.hash !== target) {
        window.location.hash = target;
      }
    }
  },

  // Auth & Staff Actions
  setCurrentUser: (user: SystemUser) => {
    set({ currentSystemUser: user });
    saveToStorage('homie_cozie_active_user', user);
  },

  switchRole: (role: UserRole) => {
    const targetUser = MOCK_SYSTEM_USERS.find(u => u.role === role) || MOCK_SYSTEM_USERS[0];
    const targetMod = getDefaultBackstageModuleForRole(targetUser.role);
    
    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID') + ' WIB',
      user: targetUser.name,
      role: targetUser.role,
      action: 'ROLE_SWITCH',
      targetModule: 'MOD-AUTH',
      status: 'SUCCESS',
      ip: '127.0.0.1',
      details: `Active role switched to: ${targetUser.roleLabel} ➜ Primary module: ${targetMod}`
    };

    set(state => {
      const nextLogs = [log, ...state.auditLogs];
      saveToStorage('homie_cozie_active_user', targetUser);
      saveToStorage('homie_cozie_audit_logs', nextLogs);
      return {
        currentSystemUser: targetUser,
        backstageModule: targetMod,
        auditLogs: nextLogs
      };
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem('homie_cozie_backstage_module', targetMod);
      window.location.hash = `#backstage/${targetMod}`;
    }
    get().showToast(`✓ Sesi staf aktif: ${targetUser.name} (${targetUser.roleLabel})`);
  },

  loginStaff: (user: SystemUser, log?: AuditLogEntry, targetModule?: BackstageNavModuleId) => {
    set(state => {
      const nextLogs = log ? [log, ...state.auditLogs] : state.auditLogs;
      saveToStorage('homie_cozie_active_user', user);
      saveToStorage('homie_cozie_audit_logs', nextLogs);
      return {
        currentSystemUser: user,
        auditLogs: nextLogs
      };
    });

    // Async Audit Log to API
    api.auditLogs.create({
      user_name: user.name,
      role: user.role,
      action: 'LOGIN_AUTH_SUCCESS',
      target_module: 'MOD-AUTH',
      status: 'SUCCESS',
      details: `Login staf via client UI (${user.roleLabel})`,
    }).catch(() => {});

    if (user.role === 'member') {
      get().navigateToMode('member');
      get().showToast(`✓ Selamat datang kembali, ${user.name}! Poin loyalitas Anda aktif.`);
    } else if (user.role === 'guest') {
      get().navigateToMode('customer');
    } else {
      const destination = targetModule || getDefaultBackstageModuleForRole(user.role);
      get().setBackstageModule(destination);
      get().navigateToMode('backstage', destination);
      get().showToast(`✓ Berhasil login sebagai ${user.name} (${user.roleLabel})`);
    }
  },

  logoutStaff: () => {
    const guestUser = MOCK_SYSTEM_USERS[8];
    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID') + ' WIB',
      user: get().currentSystemUser.name,
      role: get().currentSystemUser.role,
      action: 'LOGOUT_AUTH',
      targetModule: 'MOD-AUTH',
      status: 'SUCCESS',
      ip: '127.0.0.1',
      details: 'Sesi operasional ditutup manual oleh pengguna'
    };

    set(state => {
      const nextLogs = [log, ...state.auditLogs];
      saveToStorage('homie_cozie_active_user', guestUser);
      saveToStorage('homie_cozie_audit_logs', nextLogs);
      return {
        currentSystemUser: guestUser,
        auditLogs: nextLogs
      };
    });

    api.auth.logout().catch(() => {});

    get().navigateToMode('customer');
    get().showToast('✓ Anda telah keluar dari sesi staf backoffice');
  },

  addAuditLog: (log: AuditLogEntry) => {
    set(state => {
      const nextLogs = [log, ...state.auditLogs];
      saveToStorage('homie_cozie_audit_logs', nextLogs);
      return { auditLogs: nextLogs };
    });

    api.auditLogs.create({
      user_name: log.user,
      role: log.role,
      action: log.action,
      target_module: log.targetModule,
      status: log.status,
      details: log.details,
    }).catch(() => {});
  },

  // Table Management
  updateTableStatus: (tableId: string, status: TableItem['status'], customerName?: string) => {
    set(state => {
      const updated = state.tables.map(t => {
        if (t.id === tableId || t.tableNumber === tableId) {
          return {
            ...t,
            status,
            currentCustomer: customerName || (status === 'available' ? undefined : t.currentCustomer),
            occupiedSince: status === 'occupied' ? new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : t.occupiedSince
          };
        }
        return t;
      });
      saveToStorage('homie_cozie_tables', updated);
      return { tables: updated };
    });

    api.tables.updateStatus(tableId, status, customerName).catch(() => {});
  },

  // Reservation Management
  addReservation: (resData) => {
    const newRes: Reservation = {
      ...resData,
      id: `res-${Date.now()}`,
      bookingCode: `#HC-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'confirmed',
      waConfirmed: false
    };

    set(state => {
      const nextRes = [newRes, ...state.reservations];
      saveToStorage('homie_cozie_reservations', nextRes);
      return { reservations: nextRes };
    });

    if (resData.tableNumber) {
      get().updateTableStatus(resData.tableNumber, 'reserved', resData.customerName);
    }

    // Trigger API creation
    api.reservations.create({
      booking_code: newRes.bookingCode,
      customer_name: newRes.customerName,
      customer_phone: newRes.customerPhone,
      customer_email: newRes.customerEmail,
      guest_count: newRes.guestCount,
      reservation_date: newRes.date,
      time_slot: newRes.timeSlot,
      area_preference: newRes.areaPreference,
      table_number: newRes.tableNumber,
      special_occasion: newRes.specialOccasion,
      notes: newRes.notes,
    }).catch(() => {});

    // Trigger Notification
    notificationService.notifyReservationConfirmed(newRes.bookingCode, newRes.customerName, newRes.date, newRes.timeSlot);

    return newRes;
  },

  updateReservationStatus: (resId: string, status: Reservation['status'], tableNumber?: string) => {
    set(state => {
      const nextRes = state.reservations.map(r => {
        if (r.id === resId) {
          return { ...r, status, tableNumber: tableNumber || r.tableNumber };
        }
        return r;
      });
      saveToStorage('homie_cozie_reservations', nextRes);
      return { reservations: nextRes };
    });

    if (status === 'seated' && tableNumber) {
      get().updateTableStatus(tableNumber, 'occupied');
    }

    api.reservations.updateStatus(resId, status, tableNumber).catch(() => {});
  },

  // Inventory Management & BOM Auto-Deduct
  updateInventoryStock: (itemId: string, newStock: number) => {
    set(state => {
      const updated: InventoryItem[] = state.inventory.map(it => {
        if (it.id === itemId) {
          const status: 'critical' | 'warning' | 'optimal' = newStock <= it.minStock * 0.5 ? 'critical' : newStock <= it.minStock ? 'warning' : 'optimal';
          return { ...it, currentStock: newStock, status };
        }
        return it;
      });
      saveToStorage('homie_cozie_inventory', updated);
      return { inventory: updated };
    });

    api.inventory.updateStock(itemId, newStock).catch(() => {});
  },

  restockItem: (itemId: string, addedQty: number) => {
    set(state => {
      const updated: InventoryItem[] = state.inventory.map(it => {
        if (it.id === itemId) {
          const newQty = it.currentStock + addedQty;
          const status: 'critical' | 'warning' | 'optimal' = newQty >= it.minStock ? 'optimal' : 'warning';
          return { ...it, currentStock: newQty, status };
        }
        return it;
      });
      saveToStorage('homie_cozie_inventory', updated);
      return { inventory: updated };
    });

    api.inventory.restock(itemId, addedQty).catch(() => {});
    get().showToast('✓ Stok bahan baku berhasil ditambahkan');
  },

  // Recipe Management Actions
  addRecipe: (recipe) => {
    set(state => {
      const next = [recipe, ...state.recipes];
      saveToStorage('homie_cozie_recipes', next);
      return { recipes: next };
    });
    get().showToast(`✓ Resep ${recipe.menuItemName} berhasil ditambahkan`);
  },

  updateRecipe: (recipeId, updated) => {
    set(state => {
      const next = state.recipes.map(r => r.id === recipeId ? { ...r, ...updated, updatedAt: new Date().toISOString().slice(0, 10) } : r);
      saveToStorage('homie_cozie_recipes', next);
      return { recipes: next };
    });
    api.recipes.update(recipeId, updated).catch(() => {});
    get().showToast('✓ Komposisi bahan & HPP resep berhasil diperbarui');
  },

  deleteRecipe: (recipeId) => {
    set(state => {
      const next = state.recipes.filter(r => r.id !== recipeId);
      saveToStorage('homie_cozie_recipes', next);
      return { recipes: next };
    });
    get().showToast('✓ Resep BOM berhasil dihapus');
  },

  // Orders Management with BOM Auto-Deduction Engine
  addOrder: (orderData) => {
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `HC-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      status: 'pending'
    };

    // Recipe BOM Auto-Deduct execution & logging
    const currentInv: InventoryItem[] = [...get().inventory];
    const logItems: BOMDeductionLog['items'] = [];

    orderData.items.forEach(orderItem => {
      const recipe = get().recipes.find(r => r.menuItemId === orderItem.menuItem.id) || DEFAULT_MENU_RECIPES.find(r => r.menuItemId === orderItem.menuItem.id);
      if (recipe) {
        const itemDeductions: BOMDeductionItem[] = [];

        recipe.ingredients.forEach(ing => {
          const invIdx = currentInv.findIndex(inv => inv.id === ing.inventoryId || inv.name.toLowerCase().includes(ing.ingredientName.toLowerCase().slice(0, 8)));
          if (invIdx > -1) {
            const inv = currentInv[invIdx];
            // Unit conversion
            let deductAmount = ing.quantity * orderItem.quantity;
            if (ing.unit === 'gram' && inv.unit.toLowerCase() === 'kg') {
              deductAmount = deductAmount / 1000;
            } else if (ing.unit === 'ml' && inv.unit.toLowerCase() === 'liter') {
              deductAmount = deductAmount / 1000;
            }

            const updatedStock = Math.max(0, Math.round((inv.currentStock - deductAmount) * 100) / 100);
            const status: 'critical' | 'warning' | 'optimal' = updatedStock <= inv.minStock * 0.5 ? 'critical' : updatedStock <= inv.minStock ? 'warning' : 'optimal';
            currentInv[invIdx] = { ...inv, currentStock: updatedStock, status };

            itemDeductions.push({
              ingredientName: ing.ingredientName,
              deductAmount: Math.round(ing.quantity * orderItem.quantity * 10) / 10,
              unit: ing.unit,
              stockRemaining: updatedStock,
              inventoryUnit: inv.unit
            });
          }
        });

        if (itemDeductions.length > 0) {
          logItems.push({
            menuItemName: orderItem.menuItem.name,
            quantity: orderItem.quantity,
            deductions: itemDeductions
          });
        }
      }
    });

    const newDeductionLog: BOMDeductionLog | null = logItems.length > 0 ? {
      id: `deduct-${Date.now()}`,
      timestamp: newOrder.createdAt,
      orderNumber: newOrder.orderNumber,
      customerName: newOrder.customerName,
      items: logItems
    } : null;

    set(state => {
      const nextOrders = [newOrder, ...state.orders];
      const nextDeductionLogs = newDeductionLog ? [newDeductionLog, ...state.deductionLogs.slice(0, 49)] : state.deductionLogs;
      saveToStorage('homie_cozie_orders', nextOrders);
      saveToStorage('homie_cozie_inventory', currentInv);
      saveToStorage('homie_cozie_deduction_logs', nextDeductionLogs);
      return { 
        orders: nextOrders,
        inventory: currentInv,
        deductionLogs: nextDeductionLogs,
        customerActiveOrder: newOrder
      };
    });

    if (orderData.tableNumber) {
      get().updateTableStatus(orderData.tableNumber, 'occupied', orderData.customerName);
    }

    // Async Call to Laravel API
    api.orders.create({
      order_number: newOrder.orderNumber,
      order_type: newOrder.orderType,
      table_number: newOrder.tableNumber,
      customer_name: newOrder.customerName,
      customer_phone: newOrder.customerPhone,
      subtotal: newOrder.subtotal,
      discount: newOrder.discount,
      dpp: newOrder.subtotal - newOrder.discount,
      tax_pb1: newOrder.tax,
      service_charge: newOrder.serviceCharge,
      total: newOrder.total,
      payment_method: newOrder.paymentMethod,
      payment_status: newOrder.paymentStatus,
      status: newOrder.status,
      items: newOrder.items.map(it => ({
        menu_item_id: it.menuItem.id,
        item_name: it.menuItem.name,
        unit_price: it.menuItem.price,
        quantity: it.quantity,
        selected_options: it.selectedOptions,
        notes: it.notes,
      })),
    }).catch(e => console.warn('API order sync deferred (offline):', e));

    // Sound and Web Push Notification
    soundService.playNewOrderChime();
    notificationService.notifyNewOrder(newOrder.orderNumber, newOrder.tableNumber, newOrder.customerName);

    return newOrder;
  },

  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => {
    set(state => {
      const nextOrders = state.orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
      const nextActive = state.customerActiveOrder?.id === orderId 
        ? { ...state.customerActiveOrder, status: newStatus }
        : state.customerActiveOrder;
      
      saveToStorage('homie_cozie_orders', nextOrders);
      return {
        orders: nextOrders,
        customerActiveOrder: nextActive
      };
    });

    api.orders.updateStatus(orderId, newStatus).catch(() => {});
  },

  setCustomerActiveOrder: (order: Order | null) => set({ customerActiveOrder: order }),

  // Cart Management
  addToCart: (menuItem: MenuItem, quantity = 1, options?: Record<string, string>, notes?: string) => {
    set(state => {
      const existingIdx = state.cartItems.findIndex(
        it => it.menuItem.id === menuItem.id && JSON.stringify(it.selectedOptions) === JSON.stringify(options)
      );

      let nextCart: CartItem[];
      if (existingIdx > -1) {
        nextCart = [...state.cartItems];
        nextCart[existingIdx].quantity += quantity;
      } else {
        const newItem: CartItem = {
          cartItemId: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          menuItem,
          quantity,
          selectedOptions: options,
          notes
        };
        nextCart = [...state.cartItems, newItem];
      }

      saveToStorage('homie_cozie_cart', nextCart);
      return { cartItems: nextCart };
    });

    get().showToast(`✓ Ditambahkan ke pesanan: ${menuItem.name} (${quantity}x)`);
  },

  updateCartQty: (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      get().removeCartItem(cartItemId);
      return;
    }
    set(state => {
      const nextCart = state.cartItems.map(it => it.cartItemId === cartItemId ? { ...it, quantity: newQty } : it);
      saveToStorage('homie_cozie_cart', nextCart);
      return { cartItems: nextCart };
    });
  },

  removeCartItem: (cartItemId: string) => {
    set(state => {
      const nextCart = state.cartItems.filter(it => it.cartItemId !== cartItemId);
      saveToStorage('homie_cozie_cart', nextCart);
      return { cartItems: nextCart };
    });
    get().showToast('✓ Item dihapus dari keranjang pesanan');
  },

  clearCart: () => {
    set({ cartItems: [] });
    saveToStorage('homie_cozie_cart', []);
  },

  // Waiter Assistance
  requestAssistance: (req) => {
    const newCall: WaiterCallRequest = {
      ...req,
      id: `call-${Date.now()}`,
      createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      status: 'pending'
    };

    set(state => ({ waiterCalls: [newCall, ...state.waiterCalls] }));
    
    // Async API Call
    api.waiterCalls.create(req.tableNumber, req.callType, req.callTypeLabel, req.notes).catch(() => {});

    // Sound chime and Push Notification
    soundService.playWaiterCallChime();
    notificationService.notifyWaiterCall(req.tableNumber, req.callTypeLabel);

    get().showToast(`🛎️ Panggilan Meja #${req.tableNumber}: ${req.callTypeLabel} telah diteruskan ke pelayan!`);
  },

  resolveWaiterCall: (callId: string) => {
    set(state => ({
      waiterCalls: state.waiterCalls.map(c => c.id === callId ? { ...c, status: 'resolved' as const } : c)
    }));
    api.waiterCalls.resolve(callId).catch(() => {});
  },

  // Theme Customization Actions
  updateBackstageTheme: (updatedConfig) => {
    set(state => {
      const nextTheme: BackstageThemeConfig = { ...state.backstageTheme, ...updatedConfig };
      saveThemeConfig(nextTheme);
      applyThemeToDOM(nextTheme);
      return { backstageTheme: nextTheme };
    });
    get().showToast('🎨 Tema visual & branding Backstage berhasil diperbarui!');
  },

  resetBackstageTheme: () => {
    set(() => {
      saveThemeConfig(DEFAULT_BACKSTAGE_THEME);
      applyThemeToDOM(DEFAULT_BACKSTAGE_THEME);
      return { backstageTheme: DEFAULT_BACKSTAGE_THEME };
    });
    get().showToast('↺ Tema Backstage berhasil di-reset ke Homie Cozie Default!');
  }
}));

// Realtime WebSocket Listener Bindings (Automatic Fan-out)
if (typeof window !== 'undefined') {
  realtimeService.onNewOrder((newOrder: any) => {
    soundService.playNewOrderChime();
    const store = useAppStore.getState();
    notificationService.notifyNewOrder(
      newOrder.order_number || newOrder.orderNumber,
      newOrder.table_number || newOrder.tableNumber,
      newOrder.customer_name || newOrder.customerName
    );
    store.showToast(`🔔 Pesanan Baru Masuk: #${newOrder.order_number || newOrder.orderNumber}`);
    store.fetchInitialDataFromAPI();
  });

  realtimeService.onOrderStatusUpdated((order: any) => {
    useAppStore.getState().updateOrderStatus(String(order.id), order.status);
  });

  realtimeService.onTableStatusUpdated((table: any) => {
    useAppStore.getState().updateTableStatus(table.table_number || String(table.id), table.status, table.current_customer);
  });

  realtimeService.onWaiterCall((call: any) => {
    soundService.playWaiterCallChime();
    notificationService.notifyWaiterCall(call.table_number, call.call_type_label);
    useAppStore.getState().showToast(`🛎️ Panggilan Meja #${call.table_number}: ${call.call_type_label}`);
  });
}
