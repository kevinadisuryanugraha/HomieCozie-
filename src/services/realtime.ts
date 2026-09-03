import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Configure global Pusher object required by Laravel Echo
if (typeof window !== 'undefined') {
  Pusher.logToConsole = false;
  (window as any).Pusher = Pusher;
}

const REVERB_HOST = (typeof process !== 'undefined' && process.env && (process.env as any).VITE_REVERB_HOST) || '127.0.0.1';
const REVERB_PORT = (typeof process !== 'undefined' && process.env && (process.env as any).VITE_REVERB_PORT) || 8080;
const REVERB_KEY = (typeof process !== 'undefined' && process.env && (process.env as any).VITE_REVERB_APP_KEY) || 'mg8wbjpib3ge4mb2gh6q';
const REVERB_SCHEME = (typeof process !== 'undefined' && process.env && (process.env as any).VITE_REVERB_SCHEME) || 'http';

class RealtimeService {
  private echo: Echo<any> | null = null;
  private isConnected = false;
  private failedAttempts = 0;
  private readonly maxFailedAttempts = 2;

  constructor() {
    this.init();
  }

  public init() {
    if (typeof window === 'undefined' || this.echo) return;

    // Avoid connecting to local ws://127.0.0.1 on remote production domains (e.g. pages.dev) to prevent mixed content errors
    const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocalHost && (REVERB_HOST === '127.0.0.1' || REVERB_HOST === 'localhost')) {
      return;
    }

    try {
      Pusher.logToConsole = false;

      const isHttps = REVERB_SCHEME === 'https';

      this.echo = new Echo({
        broadcaster: 'reverb',
        key: REVERB_KEY,
        wsHost: REVERB_HOST,
        wsPort: Number(REVERB_PORT),
        wssPort: Number(REVERB_PORT),
        forceTLS: isHttps,
        enabledTransports: isHttps ? ['wss'] : ['ws'],
        disabledTransports: isHttps ? ['ws', 'sockjs'] : ['wss', 'sockjs'],
        disableStats: true,
        unavailableTimeout: 1500,
        activityTimeout: 60000,
        pongTimeout: 5000,
      });

      const connection = this.echo?.connector?.pusher?.connection;

      if (connection) {
        connection.bind('connected', () => {
          this.isConnected = true;
          this.failedAttempts = 0;
          console.log('⚡ [Realtime] Laravel Reverb WebSocket Connected (Port ' + REVERB_PORT + ')');
        });

        connection.bind('disconnected', () => {
          this.isConnected = false;
        });

        connection.bind('unavailable', () => {
          this.isConnected = false;
          this.failedAttempts++;

          if (this.failedAttempts >= this.maxFailedAttempts) {
            // Stop endless reconnection spam if local Reverb server is offline
            this.echo?.connector?.pusher?.disconnect();
            console.info('ℹ️ [Realtime] WebSocket server offline (port ' + REVERB_PORT + '). Menggunakan sinkronisasi live REST API otomatis.');
          }
        });

        connection.bind('error', () => {
          this.isConnected = false;
        });
      }
    } catch {
      this.isConnected = false;
      this.echo = null;
    }
  }

  public reconnect() {
    this.failedAttempts = 0;
    if (this.echo?.connector?.pusher) {
      this.echo.connector.pusher.connect();
    } else {
      this.init();
    }
  }

  public getEcho(): Echo<any> | null {
    return this.echo;
  }

  public getIsConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Listen to KDS Kitchen Display System orders channel
   */
  public onNewOrder(callback: (order: any) => void) {
    if (!this.echo) return;
    this.echo.channel('kds-channel').listen('.OrderCreated', (e: { order: any }) => {
      callback(e.order);
    });
  }

  /**
   * Listen to Order status updates
   */
  public onOrderStatusUpdated(callback: (order: any) => void) {
    if (!this.echo) return;
    this.echo.channel('orders-channel').listen('.OrderStatusUpdated', (e: { order: any }) => {
      callback(e.order);
    });
  }

  /**
   * Listen to Table status changes on Floor Plan
   */
  public onTableStatusUpdated(callback: (table: any) => void) {
    if (!this.echo) return;
    this.echo.channel('floorplan-channel').listen('.TableStatusUpdated', (e: { table: any }) => {
      callback(e.table);
    });
  }

  /**
   * Listen to Waiter assistance calls
   */
  public onWaiterCall(callback: (call: any) => void) {
    if (!this.echo) return;
    this.echo.channel('pos-channel').listen('.WaiterCalled', (e: { waiterCall: any }) => {
      callback(e.waiterCall);
    });
  }
}

export const realtimeService = new RealtimeService();
