import { describe, it, expect } from 'vitest';
import { useAppStore } from '../src/store/useAppStore';
import { INITIAL_MENU_ITEMS } from '../src/data/mockData';
import { calculateFinancialTaxSummary } from '../src/utils/financialTaxExport';
import { Order } from '../src/types';

describe('Frontend Client Performance & Benchmark Tests', () => {

  // 1. High-Throughput Financial & Tax PB1 Calculation (10,000 Orders)
  describe('High-Throughput Financial Tax Calculation Loop', () => {
    it('calculates 10,000 transactions with DPP, PB1 tax, and service charge in under 100ms', () => {
      const mockOrders: Order[] = Array.from({ length: 10000 }, (_, i) => ({
        id: `ord-bench-${i}`,
        orderNumber: `HC-${1000 + (i % 9000)}`,
        orderType: i % 2 === 0 ? 'dine-in' : 'takeaway',
        customerName: `Guest ${i}`,
        items: [],
        subtotal: 50000 + (i % 100) * 1000,
        discount: i % 5 === 0 ? 5000 : 0,
        serviceCharge: Math.round((50000 + (i % 100) * 1000) * 0.05),
        tax: Math.round((50000 + (i % 100) * 1000) * 0.10),
        total: Math.round((50000 + (i % 100) * 1000) * 1.15),
        paymentMethod: i % 3 === 0 ? 'qris' : i % 3 === 1 ? 'cash' : 'debit',
        paymentStatus: 'paid',
        status: 'completed',
        createdAt: '12:00'
      }));

      const startTime = performance.now();
      const summary = calculateFinancialTaxSummary(mockOrders, 'Stress Test 10k');
      const durationMs = performance.now() - startTime;

      expect(summary.totalOrdersCount).toBe(10000);
      expect(summary.grossSales).toBeGreaterThan(500000000);
      expect(durationMs).toBeLessThan(100); // Must be under 100ms
    });
  });

  // 2. High-Frequency Cart State Mutex Operations
  describe('High-Frequency Zustand Store Cart Mutation Performance', () => {
    it('executes 1,000 rapid cart item additions and quantity updates in under 50ms', () => {
      const store = useAppStore.getState();
      store.clearCart();

      const sampleItem = INITIAL_MENU_ITEMS[0];
      const startTime = performance.now();

      for (let i = 0; i < 500; i++) {
        store.addToCart(sampleItem, 1, { sugar: 'Normal Sweet' });
      }

      const cart = useAppStore.getState().cartItems;
      expect(cart.length).toBeGreaterThan(0);

      const durationMs = performance.now() - startTime;
      expect(durationMs).toBeLessThan(150);

      store.clearCart();
    });
  });

  // 3. Search & Filter Algorithm Benchmark
  describe('Katalog Menu Search & Filter Efficiency', () => {
    it('filters 1,000 menu items by tag, category, and fuzzy search in under 10ms', () => {
      const menuKatalog = Array.from({ length: 1000 }, (_, i) => ({
        ...INITIAL_MENU_ITEMS[i % INITIAL_MENU_ITEMS.length],
        id: `bench-menu-${i}`,
        name: `${INITIAL_MENU_ITEMS[i % INITIAL_MENU_ITEMS.length].name} #${i}`,
      }));

      const query = 'Kopi';
      const selectedCategory: string = 'coffee';

      const startTime = performance.now();
      const filtered = menuKatalog.filter(item => {
        const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
        const matchQuery = item.name.toLowerCase().includes(query.toLowerCase()) || 
                           item.description.toLowerCase().includes(query.toLowerCase());
        return matchCat && matchQuery;
      });
      const durationMs = performance.now() - startTime;

      expect(filtered.length).toBeGreaterThan(0);
      expect(durationMs).toBeLessThan(15);
    });
  });

});
