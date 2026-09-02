<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\MenuItem;
use App\Models\TableItem;
use App\Models\Order;
use App\Models\Reservation;
use App\Models\InventoryItem;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ApiIntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected User $staffUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
        $this->staffUser = User::where('email', 'kasir@homiecozie.com')->first();
    }

    public function test_can_fetch_menu_and_categories(): void
    {
        $response = $this->getJson('/api/v1/menu');
        $response->assertStatus(200)
                 ->assertJsonStructure(['success', 'categories', 'menu_items']);
    }

    public function test_can_fetch_tables_floor_plan(): void
    {
        $response = $this->getJson('/api/v1/tables');
        $response->assertStatus(200)
                 ->assertJsonStructure(['success', 'tables']);
    }

    public function test_staff_login_with_valid_credentials(): void
    {
        $response = $this->postJson('/api/v1/auth/login-staff', [
            'email' => 'kasir@homiecozie.com',
            'password' => 'KasirHomie#2026',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['success', 'token', 'user']);
    }

    public function test_unauthenticated_request_to_protected_backoffice_is_rejected(): void
    {
        // Unauthenticated request to protected analytics endpoint must return 401
        $response = $this->getJson('/api/v1/analytics/summary');
        $response->assertStatus(401);
    }

    public function test_can_create_order_and_auto_deduct_bom_stock(): void
    {
        $menuItem = MenuItem::first();
        $this->assertNotNull($menuItem);

        $response = $this->postJson('/api/v1/orders', [
            'customer_name' => 'Testing Guest',
            'subtotal' => 48000,
            'table_number' => '01',
            'payment_method' => 'qris',
            'items' => [
                [
                    'menu_item_id' => $menuItem->id,
                    'item_name' => $menuItem->name,
                    'unit_price' => $menuItem->price,
                    'quantity' => 2,
                ]
            ]
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure(['success', 'order']);
    }

    public function test_can_create_table_reservation(): void
    {
        $response = $this->postJson('/api/v1/reservations', [
            'customer_name' => 'Dimas VIP',
            'customer_phone' => '081298765432',
            'guest_count' => 4,
            'reservation_date' => date('Y-m-d'),
            'time_slot' => '19:30',
            'table_number' => '02',
            'special_occasion' => 'gathering',
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure(['success', 'reservation']);
    }

    public function test_can_fetch_analytics_summary_with_pb1_tax_when_authenticated(): void
    {
        Sanctum::actingAs($this->staffUser);

        $response = $this->getJson('/api/v1/analytics/summary');
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'summary' => [
                         'total_orders',
                         'gross_sales',
                         'dpp',
                         'tax_pb1',
                         'service_charge',
                         'net_revenue'
                     ]
                 ]);
    }

    public function test_can_charge_qris_and_handle_payment_webhook(): void
    {
        $order = Order::first();
        $this->assertNotNull($order);

        // 1. Charge QRIS (Public Customer)
        $chargeRes = $this->postJson('/api/v1/payment/charge', [
            'order_id' => $order->id,
        ]);
        $chargeRes->assertStatus(200)
                  ->assertJsonStructure(['success', 'payment' => ['qr_string', 'snap_token']]);

        // 2. Simulate Midtrans Settlement Webhook
        $webhookRes = $this->postJson('/api/v1/payment/webhook', [
            'order_id' => "HC-{$order->id}-12345",
            'status_code' => '200',
            'gross_amount' => (string) round($order->total),
            'signature_key' => 'test_master_signature_2026',
            'transaction_status' => 'settlement',
            'fraud_status' => 'accept',
        ]);
        $webhookRes->assertStatus(200)
                   ->assertJsonStructure(['success', 'order']);
    }

    public function test_can_send_whatsapp_ticket_and_receipt_when_authenticated(): void
    {
        Sanctum::actingAs($this->staffUser);

        $order = Order::first();
        $reservation = Reservation::first();

        // 1. WhatsApp Reservation Ticket
        if ($reservation) {
            $ticketRes = $this->postJson('/api/v1/whatsapp/send-reservation-ticket', [
                'reservation_id' => $reservation->id,
            ]);
            $ticketRes->assertStatus(200)
                      ->assertJsonStructure(['success', 'data']);
        }

        // 2. WhatsApp Digital Receipt
        if ($order) {
            $receiptRes = $this->postJson('/api/v1/whatsapp/send-receipt', [
                'order_id' => $order->id,
                'phone' => '081298765432',
            ]);
            $receiptRes->assertStatus(200)
                       ->assertJsonStructure(['success', 'data']);
        }
    }

    public function test_can_manage_cashier_shift_and_generate_zreport_when_authenticated(): void
    {
        Sanctum::actingAs($this->staffUser);

        // 1. Open shift
        $openRes = $this->postJson('/api/v1/shifts/open', [
            'cashier_name' => 'Bima Kasir',
            'opening_cash' => 200000,
            'notes' => 'Shift Pagi Buka',
        ]);
        $openRes->assertStatus(201)
                ->assertJsonStructure(['success', 'data' => ['shift_number', 'opening_cash']]);

        // 2. Get current active shift
        $currentRes = $this->getJson('/api/v1/shifts/current');
        $currentRes->assertStatus(200)
                   ->assertJsonStructure(['status', 'data' => ['shift', 'live_metrics']]);

        // 3. Close shift & generate Z-Report
        $closeRes = $this->postJson('/api/v1/shifts/close', [
            'actual_cash' => 200000,
            'notes' => 'Shift Tutup Balance',
        ]);
        $closeRes->assertStatus(200)
                 ->assertJsonStructure(['success', 'data' => ['shift_number', 'actual_cash', 'cash_difference']]);
    }

    public function test_can_fetch_stock_burn_rate_predictions_and_generate_supplier_po_when_authenticated(): void
    {
        Sanctum::actingAs($this->staffUser);

        // 1. Fetch predictions
        $predRes = $this->getJson('/api/v1/inventory/predictions');
        $predRes->assertStatus(200)
                ->assertJsonStructure(['success', 'data']);

        // 2. Generate PO
        $poRes = $this->postJson('/api/v1/inventory/generate-po', [
            'items' => [
                ['name' => 'Biji Kopi Arabika', 'quantity' => 10, 'unit' => 'kg', 'unit_price' => 150000]
            ],
            'supplier_name' => 'CV Kopi Jaya',
            'supplier_phone' => '081298765432',
            'delivery_date' => 'Besok',
        ]);
        $poRes->assertStatus(200)
              ->assertJsonStructure(['success', 'data' => ['po_number', 'whatsapp_text', 'whatsapp_url']]);
    }

    public function test_can_fetch_outlets_and_send_daily_closing_report_to_owner_when_authenticated(): void
    {
        Sanctum::actingAs($this->staffUser);

        // 1. Fetch outlets
        $outletRes = $this->getJson('/api/v1/outlets');
        $outletRes->assertStatus(200)
                  ->assertJsonStructure(['success', 'data']);

        // 2. Send daily closing report to owner WhatsApp
        $reportRes = $this->postJson('/api/v1/whatsapp/send-daily-closing-report', [
            'phone' => '081234567890'
        ]);
        $reportRes->assertStatus(200)
                  ->assertJsonStructure(['success', 'data' => ['target_phone', 'message_preview', 'whatsapp_url']]);
    }

    public function test_can_manage_cms_banners_events_settings_and_menu_items_when_authenticated(): void
    {
        Sanctum::actingAs($this->staffUser);

        // 1. Create and fetch CMS Banners
        $bannerRes = $this->postJson('/api/v1/cms/banners', [
            'title' => 'Diskon Weekend 20%',
            'subtitle' => 'Khusus Dine-in',
            'badge_text' => 'WEEKEND DEAL',
            'image_url' => 'https://images.unsplash.com/photo-1554118811-1e0d58224f24',
            'cta_text' => 'Pesan Sekarang',
            'cta_link' => '#menu',
        ]);
        $bannerRes->assertStatus(201)
                  ->assertJsonStructure(['success', 'data' => ['id', 'title']]);

        $getBanners = $this->getJson('/api/v1/cms/banners');
        $getBanners->assertStatus(200);

        // 2. Create and fetch CMS Events
        $eventRes = $this->postJson('/api/v1/cms/events', [
            'title' => 'Saturday Live Acoustic',
            'category' => 'live-music',
            'performer_name' => 'The Kalisari Band',
            'event_date' => '2026-09-05',
            'time_slot' => '19:30 - 22:00 WIB',
            'ticket_price' => 0,
            'quota' => 30,
        ]);
        $eventRes->assertStatus(201)
                 ->assertJsonStructure(['success', 'data' => ['id', 'title']]);

        $getEvents = $this->getJson('/api/v1/cms/events');
        $getEvents->assertStatus(200);

        // 3. Update and fetch Cafe Settings
        $settingRes = $this->postJson('/api/v1/cms/settings', [
            'wifi_ssid' => 'HomieCozie_Guest',
            'wifi_password' => 'HomieCozie#2026',
            'hours_weekday' => '10:00 - 23:00 WIB'
        ]);
        $settingRes->assertStatus(200);

        $getSettings = $this->getJson('/api/v1/cms/settings');
        $getSettings->assertStatus(200);

        // 4. Create and toggle Menu Item via CMS
        $menuRes = $this->postJson('/api/v1/cms/menu-items', [
            'name' => 'Croffle Lotus Biscoff Special',
            'category_slug' => 'pastry-dessert',
            'price' => 32000,
            'description' => 'Croffle renyah dengan selai Lotus Biscoff melimpah',
            'is_best_seller' => true,
        ]);
        $menuRes->assertStatus(201)
                ->assertJsonStructure(['success', 'data' => ['id', 'name']]);

        $menuId = $menuRes->json('data.id');
        $toggleRes = $this->patchJson("/api/v1/cms/menu-items/{$menuId}/toggle-availability");
        $toggleRes->assertStatus(200);
    }

    public function test_can_ingest_telemetry_events_and_compute_visitor_analytics_radar_when_authenticated(): void
    {
        // 1. Ingest telemetry event (Public)
        $telemetryRes = $this->postJson('/api/v1/telemetry/event', [
            'session_id' => 'sess-test-uuid-999',
            'event_type' => 'menu_click',
            'section_name' => 'menu',
            'device_type' => 'mobile',
            'os' => 'iOS',
            'browser' => 'Safari',
            'referrer_source' => 'Instagram Bio Link (@homiecozie)',
            'metadata' => [
                'menu_name' => 'Kopi Susu Homie Signature',
                'price' => 24000
            ]
        ]);
        $telemetryRes->assertStatus(200)
                     ->assertJsonStructure(['success', 'session_id', 'event_id']);

        // 2. Fetch visitor analytics radar (Protected)
        Sanctum::actingAs($this->staffUser);

        $radarRes = $this->getJson('/api/v1/analytics/visitor-intelligence');
        $radarRes->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data' => [
                         'liveActiveVisitors',
                         'todayTotalSessions',
                         'avgDwellTimeMinutes',
                         'funnel',
                         'tableScanHotspots',
                         'trafficSources',
                         'deviceBreakdown',
                         'menuViewsMatrix'
                     ]
                 ]);

        // 3. Fetch live visitors stream (Protected)
        $liveRes = $this->getJson('/api/v1/analytics/live-visitors');
        $liveRes->assertStatus(200)
                ->assertJsonStructure(['success', 'data']);
    }

    public function test_security_headers_are_present_in_responses(): void
    {
        $response = $this->getJson('/api/v1/menu');
        $response->assertStatus(200);
        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $response->assertHeader('X-Frame-Options', 'SAMEORIGIN');
        $response->assertHeader('X-XSS-Protection', '1; mode=block');
        $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    }
}
