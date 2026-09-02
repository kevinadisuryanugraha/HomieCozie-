<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\TableItem;
use Laravel\Sanctum\Sanctum;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PerformanceBenchmarkTest extends TestCase
{
    use RefreshDatabase;

    protected User $staffUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
        $this->staffUser = User::where('email', 'kasir@homiecozie.com')->first();
    }

    /**
     * 1. Benchmark Menu Catalog Read Latency (< 50ms)
     */
    public function test_menu_catalog_response_time_benchmark(): void
    {
        $startTime = microtime(true);
        $response = $this->getJson('/api/v1/menu');
        $durationMs = (microtime(true) - $startTime) * 1000;

        $response->assertStatus(200);
        $this->assertLessThan(200, $durationMs, "Menu catalog response took {$durationMs}ms, should be < 200ms");
    }

    /**
     * 2. Benchmark Atomic Order Creation with BOM Stock Deduction (< 100ms)
     */
    public function test_order_creation_with_bom_deduction_latency_benchmark(): void
    {
        $menuItem = MenuItem::first();
        $this->assertNotNull($menuItem);

        $startTime = microtime(true);

        $response = $this->postJson('/api/v1/orders', [
            'customer_name' => 'Benchmark Speed Guest',
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

        $durationMs = (microtime(true) - $startTime) * 1000;

        $response->assertStatus(201);
        $this->assertLessThan(250, $durationMs, "Order creation & BOM deduction took {$durationMs}ms, should be < 250ms");
    }

    /**
     * 3. Benchmark Concurrency & High Volume Batch Order Creation (50 Orders)
     */
    public function test_high_volume_batch_order_processing_throughput(): void
    {
        $menuItem = MenuItem::first();
        $orderCount = 30;

        $startTime = microtime(true);

        for ($i = 1; $i <= $orderCount; $i++) {
            $response = $this->postJson('/api/v1/orders', [
                'customer_name' => "Batch Guest #{$i}",
                'subtotal' => 24000,
                'payment_method' => 'cash',
                'items' => [
                    [
                        'menu_item_id' => $menuItem->id,
                        'item_name' => $menuItem->name,
                        'unit_price' => $menuItem->price,
                        'quantity' => 1,
                    ]
                ]
            ]);
            $response->assertStatus(201);
        }

        $totalDurationMs = (microtime(true) - $startTime) * 1000;
        $avgPerOrderMs = $totalDurationMs / $orderCount;

        $this->assertLessThan(50, $avgPerOrderMs, "Average order processing took {$avgPerOrderMs}ms per transaction");
    }

    /**
     * 4. Benchmark Analytics & Tax PB1 Report Query Aggregation
     */
    public function test_analytics_and_tax_report_aggregation_performance(): void
    {
        Sanctum::actingAs($this->staffUser);

        $startTime = microtime(true);
        $response = $this->getJson('/api/v1/analytics/tax-report');
        $durationMs = (microtime(true) - $startTime) * 1000;

        $response->assertStatus(200);
        $this->assertLessThan(150, $durationMs, "Tax report query aggregation took {$durationMs}ms");
    }

    /**
     * 5. Benchmark Telemetry Ingestion Latency (< 30ms)
     */
    public function test_telemetry_event_ingestion_latency_benchmark(): void
    {
        $startTime = microtime(true);

        $response = $this->postJson('/api/v1/telemetry/event', [
            'session_id' => 'perf-test-session-uuid',
            'event_type' => 'page_view',
            'section_name' => 'menu',
            'device_type' => 'desktop',
            'metadata' => ['scroll_depth' => 85]
        ]);

        $durationMs = (microtime(true) - $startTime) * 1000;

        $response->assertStatus(200);
        $this->assertLessThan(100, $durationMs, "Telemetry ingestion took {$durationMs}ms");
    }
}
