/**
 * Web Notifications & Service Worker Push Helper
 * Provides native push notifications for kitchen orders, waiter calls, and booking confirmations.
 */

export class NotificationService {
  private static instance: NotificationService;
  private permission: NotificationPermission = 'default';

  private constructor() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public getPermission(): NotificationPermission {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.permission = Notification.permission;
    }
    return this.permission;
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }

    try {
      const perm = await Notification.requestPermission();
      this.permission = perm;
      return perm;
    } catch (e) {
      console.warn('Error requesting notification permission:', e);
      return 'denied';
    }
  }

  /**
   * Sends a native web notification with Homie Cozie branding
   */
  public sendNotification(
    title: string, 
    options?: { 
      body?: string; 
      icon?: string; 
      badge?: string; 
      tag?: string; 
      data?: any; 
      requireInteraction?: boolean 
    }
  ): void {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    if (this.permission !== 'granted') {
      return;
    }

    const defaultIcon = '/logo_homie_cozie.png';
    const notifOptions: NotificationOptions = {
      icon: options?.icon || defaultIcon,
      badge: options?.badge || defaultIcon,
      body: options?.body || '',
      tag: options?.tag || 'homie-cozie-alert',
      data: options?.data,
      requireInteraction: options?.requireInteraction ?? false
    };

    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        // Try showing via service worker registration
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(title, notifOptions);
        }).catch(() => {
          new Notification(title, notifOptions);
        });
      } else {
        new Notification(title, notifOptions);
      }
    } catch (e) {
      console.warn('Notification trigger error:', e);
    }
  }

  /**
   * Trigger notification for New Kitchen Order
   */
  public notifyNewOrder(orderNumber: string, tableNumber?: string, customerName?: string): void {
    this.sendNotification(`☕ Pesanan Masuk #${orderNumber}`, {
      body: `Meja #${tableNumber || 'Takeaway'} • ${customerName || 'Tamu'} telah mengirim pesanan baru ke KDS dapur.`,
      tag: `order-${orderNumber}`,
      requireInteraction: true
    });
  }

  /**
   * Trigger notification for Waiter Assistance
   */
  public notifyWaiterCall(tableNumber: string, callType: string): void {
    this.sendNotification(`🛎️ Panggilan Meja #${tableNumber}`, {
      body: `Permintaan: ${callType}. Pelayan mohon segera mendekat ke meja.`,
      tag: `waiter-call-${tableNumber}`,
      requireInteraction: true
    });
  }

  /**
   * Trigger notification for Confirmed Reservation
   */
  public notifyReservationConfirmed(bookingCode: string, name: string, date: string, time: string): void {
    this.sendNotification(`📅 Reservasi Terkonfirmasi #${bookingCode}`, {
      body: `${name} • ${date} pukul ${time} WIB telah masuk ke jadwal reservasi.`,
      tag: `res-${bookingCode}`
    });
  }
}

export const notificationService = NotificationService.getInstance();
