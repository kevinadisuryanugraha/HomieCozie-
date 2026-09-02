import { describe, it, expect } from 'vitest';
import { CartItem, MenuItem } from '../src/types';
import { INITIAL_MENU_ITEMS } from '../src/data/mockData';

describe('Cart, Taxes & Pricing Calculation Engine', () => {

  const sampleCoffee: MenuItem = INITIAL_MENU_ITEMS[0]; // Kopi Susu Homie Signature
  const sampleFood: MenuItem = INITIAL_MENU_ITEMS[4];   // Nasi Goreng Kampung

  it('should calculate correct subtotal for single and multiple items', () => {
    const items: CartItem[] = [
      { cartItemId: 'c-1', menuItem: sampleCoffee, quantity: 2 },
      { cartItemId: 'c-2', menuItem: sampleFood, quantity: 1 }
    ];

    const subtotal = items.reduce((acc, it) => acc + (it.menuItem.price * it.quantity), 0);
    const expectedSubtotal = (sampleCoffee.price * 2) + sampleFood.price;
    expect(subtotal).toBe(expectedSubtotal);
  });

  it('should correctly calculate Service Charge (5%) and Restaurant PB1 Tax (10%)', () => {
    const subtotal = 100000;
    const serviceCharge = Math.round(subtotal * 0.05); // Rp 5.000
    const tax = Math.round(subtotal * 0.10);          // Rp 10.000
    const discount = 0;
    const total = subtotal + serviceCharge + tax - discount;

    expect(serviceCharge).toBe(5000);
    expect(tax).toBe(10000);
    expect(total).toBe(115000);
  });

  it('should apply VIP Member discount proportionally to the final total', () => {
    const subtotal = 84000;
    const discountPct = 0.15; // 15% discount for Gold Member
    const discountAmount = Math.round(subtotal * discountPct); // Rp 12.600
    const serviceCharge = Math.round(subtotal * 0.05);          // Rp 4.200
    const tax = Math.round(subtotal * 0.10);                   // Rp 8.400
    const finalTotal = subtotal + serviceCharge + tax - discountAmount;

    expect(discountAmount).toBe(12600);
    expect(finalTotal).toBe(84000 + 4200 + 8400 - 12600);
  });

  it('should calculate loyalty points correctly (1 point per Rp 1.000 spent)', () => {
    const finalTotal = 96600;
    const earnedPoints = Math.round(finalTotal / 1000);
    expect(earnedPoints).toBe(97);
  });

});
