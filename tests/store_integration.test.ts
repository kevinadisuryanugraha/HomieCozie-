import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../src/store/useAppStore';
import { INITIAL_MENU_ITEMS } from '../src/data/mockData';

describe('Zustand Central Store Integration Suite', () => {

  beforeEach(() => {
    // Reset cart before each test
    useAppStore.getState().clearCart();
  });

  it('should add items to cart and update quantities', () => {
    const store = useAppStore.getState();
    const item = INITIAL_MENU_ITEMS[0];

    store.addToCart(item, 1, { sugar: 'Normal (100%)' });
    expect(useAppStore.getState().cartItems.length).toBe(1);
    expect(useAppStore.getState().cartItems[0].quantity).toBe(1);

    const cartId = useAppStore.getState().cartItems[0].cartItemId;
    store.updateCartQty(cartId, 3);
    expect(useAppStore.getState().cartItems[0].quantity).toBe(3);

    store.removeCartItem(cartId);
    expect(useAppStore.getState().cartItems.length).toBe(0);
  });

  it('should create an order, update table status to occupied, and deduct BOM inventory', () => {
    const store = useAppStore.getState();
    const initialOrderCount = store.orders.length;
    const initialBeansStock = store.inventory.find(i => i.name.includes('Beans'))?.currentStock || 10;

    const newOrder = store.addOrder({
      orderType: 'dine-in',
      tableNumber: '04',
      customerName: 'Test Customer Vitest',
      customerPhone: '08123456789',
      items: [
        {
          cartItemId: 'test-c-1',
          menuItem: INITIAL_MENU_ITEMS[0], // Kopi Susu (uses 18g beans)
          quantity: 2
        }
      ],
      subtotal: 48000,
      serviceCharge: 2400,
      tax: 4800,
      discount: 0,
      total: 55200,
      paymentMethod: 'qris',
      paymentStatus: 'paid'
    });

    expect(newOrder.orderNumber).toMatch(/^HC-\d{4}$/);
    expect(useAppStore.getState().orders.length).toBe(initialOrderCount + 1);

    // Table status check
    const table04 = useAppStore.getState().tables.find(t => t.tableNumber === '04');
    expect(table04?.status).toBe('occupied');

    // BOM Stock auto-deduct check (18g * 2 = 36g = 0.036 kg)
    const updatedBeans = useAppStore.getState().inventory.find(i => i.name.includes('Beans'));
    expect(updatedBeans?.currentStock).toBeLessThan(initialBeansStock);
  });

  it('should update table status when seating reservations', () => {
    const store = useAppStore.getState();
    
    store.updateTableStatus('05', 'reserved', 'Pak Hendra (19:00)');
    const reservedTable = useAppStore.getState().tables.find(t => t.tableNumber === '05');
    expect(reservedTable?.status).toBe('reserved');
    expect(reservedTable?.currentCustomer).toBe('Pak Hendra (19:00)');

    store.updateTableStatus('05', 'available');
    const availableTable = useAppStore.getState().tables.find(t => t.tableNumber === '05');
    expect(availableTable?.status).toBe('available');
    expect(availableTable?.currentCustomer).toBeUndefined();
  });

  it('should record audit logs upon system actions', () => {
    const store = useAppStore.getState();
    const initialLogCount = store.auditLogs.length;

    store.addAuditLog({
      id: `log-test-${Date.now()}`,
      timestamp: '14:00 WIB',
      user: 'Super Admin',
      role: 'super_admin',
      action: 'SYSTEM_DIAGNOSTIC',
      targetModule: 'MOD-USR',
      status: 'SUCCESS',
      ip: '127.0.0.1',
      details: 'Automated Vitest Test Run'
    });

    expect(useAppStore.getState().auditLogs.length).toBe(initialLogCount + 1);
  });

});
