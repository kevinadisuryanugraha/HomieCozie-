export type AppMode = 
  | 'customer'      // Halaman Beranda & Menu Explorer
  | 'reservation'   // Halaman Khusus Reservasi Meja & Denah
  | 'order'         // Halaman Khusus Keranjang, Order & Checkout QRIS
  | 'member'        // Halaman Khusus Portal Member VIP & Cozie Points
  | 'auth'          // Halaman Khusus Autentikasi, 2FA & Manajemen Sesi RBAC
  | 'backstage'     // Halaman Khusus Operasional Backstage POS/KDS/CRM/Stok
  | 'prd-pitch';    // Halaman Khusus Dokumen PRD & Arsitektur Enterprise

export type CafeArea = 'indoor' | 'stage' | 'garden' | 'mezzanine';

export type MenuCategory = 'coffee' | 'manual-brew' | 'non-coffee' | 'kitchen-mains' | 'pasta-rice' | 'light-bites' | 'pastry-dessert';

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  categoryLabel: string;
  price: number;
  description: string;
  image: string;
  isBestSeller?: boolean;
  isChefSpecial?: boolean;
  isChefRecommended?: boolean;
  isNew?: boolean;
  tags: string[];
  tasteProfile?: string;
  available: boolean;
  preparationTimeMinutes: number;
  options?: {
    sugarLevels?: string[];
    iceLevels?: string[];
    beans?: string[];
    milkType?: string[];
    spiciness?: string[];
  };
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  selectedOptions?: {
    sugar?: string;
    ice?: string;
    bean?: string;
    milk?: string;
    spiciness?: string;
  };
  notes?: string;
}

export type OrderType = 'dine-in' | 'takeaway';
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'paid' | 'cancelled';
export type PaymentMethod = 'qris' | 'cash' | 'debit' | 'gopay_shopee';

export interface Order {
  id: string;
  orderNumber: string;
  orderType: OrderType;
  tableNumber?: string;
  customerName: string;
  customerPhone?: string;
  items: CartItem[];
  subtotal: number;
  serviceCharge: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod?: PaymentMethod;
  paymentStatus: 'unpaid' | 'paid';
  status: OrderStatus;
  createdAt: string;
  estimatedReadyTime?: string;
  notes?: string;
}

export interface TableItem {
  id: string;
  tableNumber: string;
  name: string;
  area: CafeArea;
  areaLabel: string;
  capacity: number;
  status: 'available' | 'reserved' | 'occupied' | 'billing' | 'cleaning';
  currentOrderId?: string;
  currentCustomer?: string;
  occupiedSince?: string;
  reservedForTime?: string;
}

export interface Reservation {
  id: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  guestCount: number;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:MM
  areaPreference: CafeArea;
  tableNumber?: string;
  specialOccasion?: 'birthday' | 'anniversary' | 'gathering' | 'community' | 'casual' | 'meeting';
  notes?: string;
  status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled';
  createdAt: string;
  waConfirmed: boolean;
}

export interface CommunityEvent {
  id: string;
  title: string;
  tag: string;
  date: string;
  time: string;
  performerOrHost: string;
  description: string;
  image: string;
  seatsTotal: number;
  seatsBooked: number;
  entryPrice?: number;
  isFeatured?: boolean;
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  tier: 'Silver Cozie' | 'Gold Cozie' | 'Platinum Cozie';
  coziePoints: number;
  stampsCount: number; // 0-10
  totalVisits: number;
  lifetimeSpend: number;
  favoriteItems: string[];
  lastVisit: string;
  birthday?: string;
  tags: string[];
}

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  source: 'google' | 'instagram' | 'internal';
  content: string;
  avatar: string;
  tag?: string;
  verifiedVisit: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'coffee_beans' | 'dairy' | 'syrups' | 'kitchen_meat' | 'produce' | 'packaging';
  currentStock: number;
  minStock: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  status: 'optimal' | 'warning' | 'critical';
}

// PRD v2 — RBAC, Middleware, Entity & Architecture Types
export type UserRole = 
  | 'super_admin' 
  | 'owner' 
  | 'manager' 
  | 'cashier' 
  | 'reservation_staff' 
  | 'kitchen_staff' 
  | 'marketing' 
  | 'member' 
  | 'guest';

export type PermissionLevel = 'F' | 'E' | 'L' | 'T'; // Full, Edit, Lihat, Tidak Ada

export interface RBACModulePermission {
  moduleName: string;
  moduleCode: string;
  category: 'Website & Reservasi' | 'Operasional & Kasir' | 'CRM & Marketing' | 'Sistem & Governance';
  permissions: Record<UserRole, PermissionLevel>;
  description: string;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  avatar: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  twoFactorEnabled?: boolean;
}

export interface ApiEndpointSpec {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  path: string;
  description: string;
  minRole: UserRole;
  minRoleLabel: string;
  moduleGroup: string;
}

export interface DataEntitySpec {
  name: string;
  description: string;
  primaryKey: string;
  relations: string;
  phase: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'all' | 'ambience' | 'music' | 'coffee' | 'food';
  categoryLabel: string;
  imageUrl: string;
  areaTag: string;
  description: string;
}

export interface FAQItem {
  id: string;
  category: 'fasilitas' | 'acara' | 'menu' | 'reservasi' | 'pembayaran';
  question: string;
  answer: string;
  tag?: string;
}

export interface CafeFeature {
  icon: string;
  title: string;
  description: string;
  highlight: string;
}

export type WaiterCallType = 'call_waiter' | 'request_bill' | 'water_refill' | 'clean_table';

export interface WaiterCallRequest {
  id: string;
  tableNumber: string;
  callType: WaiterCallType;
  callTypeLabel: string;
  createdAt: string;
  status: 'pending' | 'acknowledged' | 'resolved';
  notes?: string;
}

// Recipe & Bill of Materials (BOM) Types
export interface RecipeIngredient {
  inventoryId: string;
  ingredientName: string;
  quantity: number; // e.g. 18 for grams, 120 for ml
  unit: string; // 'gram' | 'ml' | 'pcs' | 'porsi'
  costPerUnit: number; // Cost in IDR per base unit
  subtotalCost: number; // quantity * costPerUnit
}

export interface MenuRecipe {
  id: string;
  menuItemId: string;
  menuItemName: string;
  category: string;
  salePrice: number;
  ingredients: RecipeIngredient[];
  totalHPP: number; // Cost of Goods Sold in IDR
  grossMarginPct: number; // ((salePrice - totalHPP) / salePrice) * 100
  preparationNotes?: string;
  updatedAt: string;
}

export interface BOMDeductionItem {
  ingredientName: string;
  deductAmount: number;
  unit: string;
  stockRemaining: number;
  inventoryUnit: string;
}

export interface BOMDeductionLog {
  id: string;
  timestamp: string;
  orderNumber: string;
  customerName: string;
  items: Array<{
    menuItemName: string;
    quantity: number;
    deductions: BOMDeductionItem[];
  }>;
}

// Thermal Receipt Types
export type ThermalPaperWidth = '58mm' | '80mm';
export type ThermalSlipType = 'customer' | 'kitchen' | 'bar';

export interface ThermalSlipConfig {
  cafeName: string;
  address: string;
  phone: string;
  footerNote: string;
  paperWidth: ThermalPaperWidth;
  slipType: ThermalSlipType;
  showLogo: boolean;
  showTaxBreakdown: boolean;
  showWiFiInfo: boolean;
}

// Backstage Theme & Branding Customization Types
export type ThemeColorPreset = 'terracotta' | 'espresso' | 'nordic' | 'matcha' | 'sunset' | 'midnight' | 'monochrome';
export type ThemeFontFamily = 'outfit' | 'jakarta' | 'inter' | 'playfair' | 'space';
export type ThemeMode = 'warm' | 'light' | 'dark' | 'espresso' | 'slate';
export type ThemeBorderRadius = 'sharp' | 'rounded' | 'pill';
export type ThemeDensity = 'compact' | 'comfortable' | 'spacious';

export interface BackstageThemeConfig {
  colorPreset: ThemeColorPreset;
  primaryColor: string;
  primaryHover: string;
  accentColor: string;
  themeMode: ThemeMode;
  fontFamily: ThemeFontFamily;
  borderRadius: ThemeBorderRadius;
  uiDensity: ThemeDensity;
  cardGlassmorphism: boolean;
  highContrast: boolean;
  customBrandingName?: string;
}

// AI Copilot Types
export type AICopilotCategory = 'restock' | 'marketing' | 'digest';

export interface AICopilotInsight {
  id: string;
  category: AICopilotCategory;
  title: string;
  summary: string;
  confidenceScore: number; // 0 - 100%
  recommendedAction: string;
  detailedPoints: string[];
  metrics?: Record<string, string | number>;
  generatedAt: string;
}



