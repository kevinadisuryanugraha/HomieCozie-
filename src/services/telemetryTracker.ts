import { api } from './api';

export interface TelemetryEventPayload {
  eventType: 'page_view' | 'qr_scan' | 'menu_click' | 'add_to_cart' | 'checkout_start' | 'order_complete' | 'reservation_start';
  sectionName?: string;
  metadata?: Record<string, any>;
  customerPhone?: string;
}

class TelemetryTracker {
  private sessionId: string;
  private deviceType: string;
  private os: string;
  private browser: string;
  private referrerSource: string;
  private isInitialized = false;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.deviceType = this.detectDeviceType();
    this.os = this.detectOS();
    this.browser = this.detectBrowser();
    this.referrerSource = this.detectReferrer();
  }

  public init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    // Track initial page view
    const initialSection = window.location.hash.replace(/^#\/?/, '') || 'home';
    this.trackEvent({
      eventType: 'page_view',
      sectionName: initialSection,
      metadata: { url: window.location.href, referrer: document.referrer }
    });

    // Auto-listen to hash change
    window.addEventListener('hashchange', () => {
      const section = window.location.hash.replace(/^#\/?/, '') || 'home';
      this.trackEvent({
        eventType: 'page_view',
        sectionName: section
      });
    });
  }

  public trackEvent(payload: TelemetryEventPayload) {
    if (typeof window === 'undefined') return;

    const data = {
      session_id: this.sessionId,
      event_type: payload.eventType,
      section_name: payload.sectionName || window.location.hash.replace(/^#\/?/, '') || 'home',
      device_type: this.deviceType,
      os: this.os,
      browser: this.browser,
      referrer_source: this.referrerSource,
      location_city: 'Jakarta Timur',
      customer_phone: payload.customerPhone,
      metadata: payload.metadata
    };

    // Async fire and forget
    api.telemetry.trackEvent(data).catch(() => {});
  }

  public trackQRScan(tableNumber: string) {
    this.trackEvent({
      eventType: 'qr_scan',
      sectionName: `table-${tableNumber}`,
      metadata: { tableNumber, scannedAt: new Date().toISOString() }
    });
  }

  public trackMenuClick(menuItem: { id: string; name: string; price: number; category: string }) {
    this.trackEvent({
      eventType: 'menu_click',
      sectionName: 'menu',
      metadata: { menuId: menuItem.id, menuName: menuItem.name, price: menuItem.price, category: menuItem.category }
    });
  }

  public trackAddToCart(menuItem: { id: string; name: string; price: number }, quantity: number) {
    this.trackEvent({
      eventType: 'add_to_cart',
      sectionName: 'order',
      metadata: { menuId: menuItem.id, menuName: menuItem.name, price: menuItem.price, quantity }
    });
  }

  public trackCheckoutStart(totalAmount: number, itemCount: number, orderType: string) {
    this.trackEvent({
      eventType: 'checkout_start',
      sectionName: 'order',
      metadata: { totalAmount, itemCount, orderType }
    });
  }

  public trackOrderComplete(orderNumber: string, totalAmount: number, customerPhone?: string) {
    this.trackEvent({
      eventType: 'order_complete',
      sectionName: 'order_success',
      customerPhone,
      metadata: { orderNumber, totalAmount }
    });
  }

  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return 'sess-ssr';
    let id = sessionStorage.getItem('homie_cozie_telemetry_session');
    if (!id) {
      id = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem('homie_cozie_telemetry_session', id);
    }
    return id;
  }

  private detectDeviceType(): string {
    if (typeof navigator === 'undefined') return 'mobile';
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  }

  private detectOS(): string {
    if (typeof navigator === 'undefined') return 'Unknown';
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
    if (/Android/.test(ua)) return 'Android';
    if (/Windows/.test(ua)) return 'Windows';
    if (/Mac OS X/.test(ua)) return 'macOS';
    if (/Linux/.test(ua)) return 'Linux';
    return 'Unknown';
  }

  private detectBrowser(): string {
    if (typeof navigator === 'undefined') return 'Unknown';
    const ua = navigator.userAgent;
    if (/Chrome/.test(ua) && !/Edg/.test(ua)) return 'Google Chrome';
    if (/Safari/.test(ua) && !/Chrome/.test(ua)) return 'Safari';
    if (/Edg/.test(ua)) return 'Microsoft Edge';
    if (/Firefox/.test(ua)) return 'Mozilla Firefox';
    return 'Web Browser';
  }

  private detectReferrer(): string {
    if (typeof document === 'undefined') return 'Direct';
    const ref = document.referrer.toLowerCase();
    const url = window.location.href.toLowerCase();

    if (url.includes('table=') || url.includes('#order/table')) return 'Scan QR Fisik Meja Kafe';
    if (ref.includes('instagram.com')) return 'Instagram Bio Link (@homiecozie)';
    if (ref.includes('tiktok.com')) return 'TikTok Profile Link';
    if (ref.includes('google.com') || ref.includes('maps.google.com')) return 'Google Maps "Kopi Kalisari"';
    if (ref.includes('whatsapp.com') || ref.includes('wa.me')) return 'WhatsApp Share Link';
    return 'Direct / Organic Traffic';
  }
}

export const telemetryTracker = new TelemetryTracker();
