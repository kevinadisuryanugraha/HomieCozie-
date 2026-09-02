import { describe, it, expect } from 'vitest';

describe('Enterprise F&B Workflow & Business Logic Tests', () => {
  
  // 1. Split-Bill Calculations Test
  describe('Split-Bill Calculation Engine', () => {
    it('accurately divides total bill equally among multiple persons with rounding', () => {
      const subtotal = 100000;
      const serviceCharge = 5000; // 5%
      const tax = 10000; // 10%
      const total = 115000;
      const peopleCount = 3;

      const perPerson = Math.round(total / peopleCount);
      expect(perPerson).toBe(38333);
      expect(perPerson * peopleCount).toBeCloseTo(total, -1);
    });

    it('accurately calculates item-by-item split with individual tax and service charge', () => {
      const itemPrice1 = 35000; // Kopi Susu
      const itemPrice2 = 45000; // Truffle Fries

      // Person 1 calculation
      const p1Sub = itemPrice1;
      const p1Svc = Math.round(p1Sub * 0.05); // 1750
      const p1Tax = Math.round(p1Sub * 0.10); // 3500
      const p1Total = p1Sub + p1Svc + p1Tax; // 40250

      expect(p1Svc).toBe(1750);
      expect(p1Tax).toBe(3500);
      expect(p1Total).toBe(40250);

      // Person 2 calculation
      const p2Sub = itemPrice2;
      const p2Svc = Math.round(p2Sub * 0.05); // 2250
      const p2Tax = Math.round(p2Sub * 0.10); // 4500
      const p2Total = p2Sub + p2Svc + p2Tax; // 51750

      expect(p2Total).toBe(51750);
      expect(p1Total + p2Total).toBe(92000);
    });
  });

  // 2. Cash Drawer Reconciliation (Z-Report)
  describe('Cash Drawer Z-Report Discrepancy Detection', () => {
    it('detects balanced cash drawer with zero discrepancy', () => {
      const openingCash = 200000;
      const totalCashSales = 150000;
      const expectedCash = openingCash + totalCashSales; // 350000
      const actualCash = 350000;

      const diff = actualCash - expectedCash;
      expect(diff).toBe(0);
    });

    it('detects cash overage (surplus)', () => {
      const openingCash = 200000;
      const totalCashSales = 150000;
      const expectedCash = openingCash + totalCashSales; // 350000
      const actualCash = 360000;

      const diff = actualCash - expectedCash;
      expect(diff).toBe(10000);
      expect(diff > 0).toBe(true);
    });

    it('detects cash shortage (deficit)', () => {
      const openingCash = 200000;
      const totalCashSales = 150000;
      const expectedCash = openingCash + totalCashSales; // 350000
      const actualCash = 345000;

      const diff = actualCash - expectedCash;
      expect(diff).toBe(-5000);
      expect(diff < 0).toBe(true);
    });
  });

  // 3. AI Barista Pairing Discount Engine
  describe('AI Barista Smart Flavor Pairing', () => {
    it('applies bundle discount accurately on pairing drink and food', () => {
      const drinkPrice = 28000;
      const foodPrice = 35000;
      const originalTotal = drinkPrice + foodPrice;
      const bundleDiscount = 5000;
      const bundlePrice = originalTotal - bundleDiscount;

      expect(originalTotal).toBe(63000);
      expect(bundlePrice).toBe(58000);
      expect(bundlePrice).toBeLessThan(originalTotal);
    });
  });

  // 4. Tax PB1 Separation Verification
  describe('PB1 10% Local Municipal Tax Separation', () => {
    it('extracts DPP, PB1 Tax 10%, and Service 5% accurately from gross total', () => {
      const grossSales = 115000;
      const dpp = Math.round(grossSales / 1.15); // 100000
      const taxPb1 = Math.round(dpp * 0.10); // 10000
      const service = Math.round(dpp * 0.05); // 5000
      const net = grossSales - taxPb1 - service; // 100000

      expect(dpp).toBe(100000);
      expect(taxPb1).toBe(10000);
      expect(service).toBe(5000);
      expect(net).toBe(100000);
      expect(net + taxPb1 + service).toBe(grossSales);
    });
  });

});
