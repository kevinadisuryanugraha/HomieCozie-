import { describe, it, expect } from 'vitest';
import { checkRBACPermission, getDefaultBackstageModuleForRole } from '../src/utils/rbac';

describe('RBAC Security & Permission Matrix Suite', () => {
  
  describe('Super Admin & Owner Permissions', () => {
    it('should grant full access (Level F) to Super Admin on all modules', () => {
      const modules = ['MOD-WEB', 'MOD-RES', 'MOD-POS', 'MOD-INV', 'MOD-CRM', 'MOD-ANA', 'MOD-USR'];
      modules.forEach(mod => {
        const result = checkRBACPermission('super_admin', mod, 'F');
        expect(result.allowed).toBe(true);
      });
    });

    it('should grant Owner full operational visibility and at least Read (Level L) on all reports and RBAC', () => {
      const modules = ['MOD-POS', 'MOD-RES', 'MOD-INV', 'MOD-ANA', 'MOD-USR'];
      modules.forEach(mod => {
        const result = checkRBACPermission('owner', mod, 'L');
        expect(result.allowed).toBe(true);
      });
    });
  });

  describe('Operational Staff Role Isolation', () => {
    it('should allow Cashier to access POS (MOD-POS) but block User/RBAC management (MOD-USR)', () => {
      const posPerm = checkRBACPermission('cashier', 'MOD-POS', 'E');
      expect(posPerm.allowed).toBe(true);

      const usrPerm = checkRBACPermission('cashier', 'MOD-USR', 'L');
      expect(usrPerm.allowed).toBe(false);
      expect(usrPerm.reason).toContain('tidak memiliki izin');
    });

    it('should allow Kitchen Staff to view and update KDS/POS but block Analytics & Tax Reports (MOD-ANA)', () => {
      const kdsPerm = checkRBACPermission('kitchen_staff', 'MOD-POS', 'L');
      expect(kdsPerm.allowed).toBe(true);

      const anaPerm = checkRBACPermission('kitchen_staff', 'MOD-ANA', 'L');
      expect(anaPerm.allowed).toBe(false);
    });

    it('should allow Reservation Staff to manage bookings (MOD-RES) but block Inventory (MOD-INV)', () => {
      const resPerm = checkRBACPermission('reservation_staff', 'MOD-RES', 'E');
      expect(resPerm.allowed).toBe(true);

      const invPerm = checkRBACPermission('reservation_staff', 'MOD-INV', 'L');
      expect(invPerm.allowed).toBe(false);
    });
  });

  describe('Public & Guest Roles', () => {
    it('should block Guest from internal backstage management modules (MOD-INV, MOD-CRM, MOD-ANA, MOD-USR)', () => {
      const internalModules = ['MOD-INV', 'MOD-CRM', 'MOD-ANA', 'MOD-USR'];
      internalModules.forEach(mod => {
        const result = checkRBACPermission('guest', mod, 'L');
        expect(result.allowed).toBe(false);
      });
    });
  });

  describe('Default Route Mapping', () => {
    it('should route each role to their designated operational primary module', () => {
      expect(getDefaultBackstageModuleForRole('super_admin')).toBe('dashboard');
      expect(getDefaultBackstageModuleForRole('cashier')).toBe('pos');
      expect(getDefaultBackstageModuleForRole('kitchen_staff')).toBe('kds');
      expect(getDefaultBackstageModuleForRole('reservation_staff')).toBe('reservations');
      expect(getDefaultBackstageModuleForRole('manager')).toBe('floorplan');
      expect(getDefaultBackstageModuleForRole('marketing')).toBe('crm');
    });
  });

});
