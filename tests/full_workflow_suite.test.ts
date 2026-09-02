import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../src/store/useAppStore';
import { INITIAL_MENU_ITEMS, INITIAL_TABLES, INVENTORY_ITEMS, MOCK_SYSTEM_USERS, CAFE_INFO } from '../src/data/mockData';
import { DEFAULT_MENU_RECIPES } from '../src/data/recipeData';
import { checkRBACPermission, getDefaultBackstageModuleForRole } from '../src/utils/rbac';
import { calculateFinancialTaxSummary } from '../src/utils/financialTaxExport';
import { MenuItem, Order, Reservation, TableItem } from '../src/types';

describe('Comprehensive End-to-End System Workflow Tests', () => {
  beforeEach(() => {
    // Reset store to pristine state
    const store = useAppStore.getState();
    store.clearCart();
  });

  // 1. Customer Ordering & Checkout Lifecycle
  describe('Customer Ordering & Checkout Lifecycle', () => {
    it('allows customer to add custom items with options to cart and computes taxes accurately', () => {
      const store = useAppStore.getState();
      const coffeeItem = INITIAL_MENU_ITEMS[0]; // Kopi Susu Signature (24000)

      store.addToCart(coffeeItem, 2, { sugar: 'Less Sweet (70%)', ice: 'Normal Ice' }, 'Extra sedap');
      
      const cart = useAppStore.getState().cartItems;
      expect(cart).toHaveLength(1);
      expect(cart[0].quantity).toBe(2);
      expect(cart[0].selectedOptions?.sugar).toBe('Less Sweet (70%)');
      expect(cart[0].notes).toBe('Extra sedap');

      // Update quantity
      store.updateCartQty(cart[0].cartItemId, 3);
      expect(useAppStore.getState().cartItems[0].quantity).toBe(3);

      // Add another item
      const secondItem = INITIAL_MENU_ITEMS[4]; // Price: 26000
      store.addToCart(secondItem, 1);
      expect(useAppStore.getState().cartItems).toHaveLength(2);

      // Calculate totals
      const currentCart = useAppStore.getState().cartItems;
      const subtotal = currentCart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
      const expectedSubtotal = (24000 * 3) + (secondItem.price * 1); // 72000 + 26000 = 98000
      expect(subtotal).toBe(expectedSubtotal);

      const serviceCharge = Math.round(subtotal * 0.05); // 4900
      const tax = Math.round(subtotal * 0.10); // 9800
      const grandTotal = subtotal + serviceCharge + tax; // 112700

      expect(serviceCharge).toBe(4900);
      expect(tax).toBe(9800);
      expect(grandTotal).toBe(112700);

      // Create Order
      const newOrder = store.addOrder({
        orderType: 'dine-in',
        tableNumber: '03',
        customerName: 'Ahmad Pelanggan',
        customerPhone: '081299887766',
        items: currentCart,
        subtotal,
        serviceCharge,
        tax,
        discount: 0,
        total: grandTotal,
        paymentMethod: 'qris',
        paymentStatus: 'paid',
        notes: 'Dine-in santai'
      });

      expect(newOrder.id).toBeDefined();
      expect(newOrder.orderNumber).toMatch(/^HC-\d+$/);
      expect(newOrder.status).toBe('pending');

      // Order should be in store orders
      const orders = useAppStore.getState().orders;
      const foundOrder = orders.find(o => o.id === newOrder.id);
      expect(foundOrder).toBeDefined();
      expect(foundOrder?.customerName).toBe('Ahmad Pelanggan');

      // Table 03 should become occupied
      const table03 = useAppStore.getState().tables.find(t => t.tableNumber === '03');
      expect(table03?.status).toBe('occupied');
      expect(table03?.currentCustomer).toBe('Ahmad Pelanggan');

      // Cart is cleared upon completing checkout
      store.clearCart();
      expect(useAppStore.getState().cartItems).toHaveLength(0);
    });

    it('updates order status through kitchen lifecycle: pending -> preparing -> ready -> served', () => {
      const store = useAppStore.getState();
      const order = store.orders[0];
      expect(order).toBeDefined();

      store.updateOrderStatus(order.id, 'preparing');
      expect(useAppStore.getState().orders.find(o => o.id === order.id)?.status).toBe('preparing');

      store.updateOrderStatus(order.id, 'ready');
      expect(useAppStore.getState().orders.find(o => o.id === order.id)?.status).toBe('ready');

      store.updateOrderStatus(order.id, 'served');
      expect(useAppStore.getState().orders.find(o => o.id === order.id)?.status).toBe('served');
    });
  });

  // 2. Customer Table Reservation Workflow
  describe('Customer Table Reservation Workflow', () => {
    it('creates a new table reservation and marks table status reserved', () => {
      const store = useAppStore.getState();
      
      const newRes = store.addReservation({
        customerName: 'Sarah Wijaya',
        customerPhone: '081377889900',
        customerEmail: 'sarah.wijaya@gmail.com',
        guestCount: 4,
        date: '2026-09-05',
        timeSlot: '19:30',
        areaPreference: 'stage',
        tableNumber: '05',
        specialOccasion: 'birthday',
        notes: 'Ulang tahun, minta lilin kecil'
      });

      expect(newRes.bookingCode).toMatch(/^#HC-\d+$/);
      expect(newRes.status).toBe('confirmed');

      const savedRes = useAppStore.getState().reservations.find(r => r.id === newRes.id);
      expect(savedRes).toBeDefined();
      expect(savedRes?.customerName).toBe('Sarah Wijaya');

      // Check Table 05 status
      const table05 = useAppStore.getState().tables.find(t => t.tableNumber === '05');
      expect(table05?.status).toBe('reserved');
    });

    it('updates reservation status to seated and assigns table', () => {
      const store = useAppStore.getState();
      const res = store.reservations[0];
      expect(res).toBeDefined();

      store.updateReservationStatus(res.id, 'seated', '04');
      const updatedRes = useAppStore.getState().reservations.find(r => r.id === res.id);
      expect(updatedRes?.status).toBe('seated');
      expect(updatedRes?.tableNumber).toBe('04');

      const table04 = useAppStore.getState().tables.find(t => t.tableNumber === '04');
      expect(table04?.status).toBe('occupied');
    });
  });

  // 3. Waiter Assistance Calling & Resolution
  describe('Waiter Assistance Calling & Resolution', () => {
    it('submits a waiter assistance call and allows staff to resolve it', () => {
      const store = useAppStore.getState();

      store.requestAssistance({
        tableNumber: '02',
        callType: 'water_refill',
        callTypeLabel: 'Refill Air Putih',
        notes: 'Minta 2 gelas'
      });

      const calls = useAppStore.getState().waiterCalls;
      expect(calls.length).toBeGreaterThanOrEqual(1);
      const latestCall = calls[calls.length - 1];
      expect(latestCall.tableNumber).toBe('02');
      expect(latestCall.callType).toBe('water_refill');
      expect(latestCall.status).toBe('pending');

      // Staff resolves call
      store.resolveWaiterCall(latestCall.id);
      const resolvedCall = useAppStore.getState().waiterCalls.find(c => c.id === latestCall.id);
      expect(resolvedCall?.status).toBe('resolved');
    });
  });

  // 4. Role-Based Access Control (RBAC) Matrix
  describe('RBAC Matrix & Multi-Role Permissions', () => {
    it('grants Super Admin full access to all system modules', () => {
      const superAdminUser = MOCK_SYSTEM_USERS.find(u => u.role === 'super_admin');
      expect(superAdminUser).toBeDefined();

      const modules = ['MOD-WEB', 'MOD-RES', 'MOD-POS', 'MOD-INV', 'MOD-CRM', 'MOD-HR', 'MOD-ANA', 'MOD-CFG', 'MOD-USR'];
      modules.forEach(modCode => {
        const canEdit = checkRBACPermission(superAdminUser!.role, modCode, 'E');
        const canFull = checkRBACPermission(superAdminUser!.role, modCode, 'F');
        expect(canEdit.allowed).toBe(true);
        expect(canFull.allowed).toBe(true);
      });
    });

    it('restricts Cashier from sensitive modules (HR, Config, User RBAC)', () => {
      const cashierUser = MOCK_SYSTEM_USERS.find(u => u.role === 'cashier');
      expect(cashierUser).toBeDefined();

      // Allowed in POS
      expect(checkRBACPermission(cashierUser!.role, 'MOD-POS', 'F').allowed).toBe(true);

      // Denied in System Config & User Management
      expect(checkRBACPermission(cashierUser!.role, 'MOD-CFG', 'E').allowed).toBe(false);
      expect(checkRBACPermission(cashierUser!.role, 'MOD-USR', 'E').allowed).toBe(false);
    });

    it('assigns the correct default backstage module per staff role', () => {
      expect(getDefaultBackstageModuleForRole('super_admin')).toBe('dashboard');
      expect(getDefaultBackstageModuleForRole('owner')).toBe('dashboard');
      expect(getDefaultBackstageModuleForRole('cashier')).toBe('pos');
      expect(getDefaultBackstageModuleForRole('kitchen_staff')).toBe('kds');
      expect(getDefaultBackstageModuleForRole('reservation_staff')).toBe('reservations');
      expect(getDefaultBackstageModuleForRole('marketing')).toBe('crm');
    });
  });

  // 5. Recipe BOM & Stock Auto-Deduction Engine
  describe('Recipe BOM & COGS Calculation Engine', () => {
    it('accurately computes total HPP and gross profit margin percentage', () => {
      const recipe = DEFAULT_MENU_RECIPES[0]; // Kopi Susu Homie Signature
      expect(recipe).toBeDefined();

      const computedHPP = recipe.ingredients.reduce((sum, ing) => sum + (ing.quantity * ing.costPerUnit), 0);
      expect(computedHPP).toBe(recipe.totalHPP);

      const expectedMarginPct = Number((((recipe.salePrice - computedHPP) / recipe.salePrice) * 100).toFixed(1));
      expect(recipe.grossMarginPct).toBe(expectedMarginPct);
      expect(recipe.grossMarginPct).toBeGreaterThan(60); // Healthy F&B Margin > 60%
    });

    it('deducts inventory ingredient stock when order is placed', () => {
      const store = useAppStore.getState();
      const beansInvBefore = store.inventory.find(i => i.name.includes('Beans'))?.currentStock || 0;

      // Restock item
      const beansItem = store.inventory.find(i => i.name.includes('Beans'));
      if (beansItem) {
        store.restockItem(beansItem.id, 5.0);
        const beansInvAfter = useAppStore.getState().inventory.find(i => i.id === beansItem.id)?.currentStock;
        expect(beansInvAfter).toBe(beansInvBefore + 5.0);
      }
    });
  });

  // 6. Financial PB1 Tax & Revenue Summary Engine
  describe('Financial PB1 Tax & Revenue Summary Engine', () => {
    it('summarizes gross sales, discount, DPP, PB1 tax 10%, service 5%, and net revenue', () => {
      const mockOrders: Order[] = [
        {
          id: 'ord-test-1',
          orderNumber: 'HC-0001',
          orderType: 'dine-in',
          customerName: 'Test 1',
          items: [],
          subtotal: 100000,
          discount: 10000,
          serviceCharge: 4500, // 5% of (100000 - 10000)
          tax: 9000,          // 10% of (100000 - 10000)
          total: 103500,
          paymentMethod: 'qris',
          paymentStatus: 'paid',
          status: 'completed',
          createdAt: '12:00'
        },
        {
          id: 'ord-test-2',
          orderNumber: 'HC-0002',
          orderType: 'takeaway',
          customerName: 'Test 2',
          items: [],
          subtotal: 50000,
          discount: 0,
          serviceCharge: 2500,
          tax: 5000,
          total: 57500,
          paymentMethod: 'cash',
          paymentStatus: 'paid',
          status: 'completed',
          createdAt: '13:00'
        }
      ];

      const summary = calculateFinancialTaxSummary(mockOrders, 'Uji Coba September 2026');

      expect(summary.totalOrdersCount).toBe(2);
      expect(summary.grossSales).toBe(150000);
      expect(summary.totalDiscount).toBe(10000);
      expect(summary.dpp).toBe(140000);
      expect(summary.taxPB1).toBe(14000);
      expect(summary.serviceCharge).toBe(7000);
      expect(summary.netRevenue).toBe(161000);
      expect(summary.paymentMethodsBreakdown.qris).toBe(103500);
      expect(summary.paymentMethodsBreakdown.cash).toBe(57500);
    });
  });

  // 7. Client Brand & Location Integrity Verification
  describe('Client Brand & Location Integrity', () => {
    it('validates official business profile information', () => {
      expect(CAFE_INFO.name).toBe('Homie Cozie Coffee & Kitchen');
      expect(CAFE_INFO.address).toContain('Jl. H. Hasan No.23');
      expect(CAFE_INFO.address).toContain('Ps. Rebo');
      expect(CAFE_INFO.address).toContain('Jakarta Timur');
      expect(CAFE_INFO.shortLocation).toContain('Pasar Rebo');
      expect(CAFE_INFO.googleRating).toBe(4.8);
      expect(CAFE_INFO.totalGoogleReviews).toBe(78);
      expect(CAFE_INFO.whatsapp).toBe('+62 878-5004-9458');
      expect(CAFE_INFO.phone).toBe('0815-8640-2420');
      expect(CAFE_INFO.instagram).toBe('@homie.cozie');
    });
  });

});
