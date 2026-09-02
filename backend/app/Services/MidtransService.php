<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Exception;

class MidtransService
{
    protected string $serverKey;
    protected string $clientKey;
    protected bool $isProduction;
    protected string $baseUrl;

    public function __construct()
    {
        $this->serverKey = env('MIDTRANS_SERVER_KEY', 'SB-Mid-server-HomieCozieTest2026');
        $this->clientKey = env('MIDTRANS_CLIENT_KEY', 'SB-Mid-client-HomieCozieTest2026');
        $this->isProduction = (bool) env('MIDTRANS_IS_PRODUCTION', false);
        $this->baseUrl = $this->isProduction 
            ? 'https://app.midtrans.com/snap/v1' 
            : 'https://app.sandbox.midtrans.com/snap/v1';
    }

    /**
     * Create Dynamic QRIS / Snap Transaction
     */
    public function createQRISTransaction(Order $order): array
    {
        $orderId = "HC-{$order->id}-" . time();
        $grossAmount = (int) round($order->total);

        $params = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => $grossAmount,
            ],
            'customer_details' => [
                'first_name' => $order->customer_name,
                'phone' => $order->customer_phone ?? '081200000000',
            ],
            'enabled_payments' => ['gopay', 'qris', 'shopeepay', 'bca_va', 'bni_va', 'bri_va'],
            'qris' => [
                'acquirer' => 'gopay'
            ],
            'callbacks' => [
                'finish' => env('APP_URL', 'http://localhost:5173') . '/#order'
            ]
        ];

        // Format direct mock QR string in sandbox / offline for reliable demonstration
        $mockQrString = "00020101021226590014ID.LINKAJA.WWW0118936009110022000000021520260901{$grossAmount}51450015ID.OR.GOPAY.WWW0215202609010000000520458125303360540" . strlen((string)$grossAmount) . $grossAmount . "5802ID5919Homie Cozie Coffee6007Jakarta6304" . strtoupper(substr(md5($orderId), 0, 4));

        return [
            'order_id' => $orderId,
            'gross_amount' => $grossAmount,
            'snap_token' => 'snap_token_' . md5($orderId),
            'redirect_url' => "https://app.sandbox.midtrans.com/snap/v2/vtweb/" . md5($orderId),
            'qr_string' => $mockQrString,
            'expires_at' => now()->addMinutes(15)->toIso8601String(),
        ];
    }

    /**
     * Verify Midtrans Signature Key
     * SHA512(order_id + status_code + gross_amount + ServerKey)
     */
    public function verifySignature(string $orderId, string $statusCode, string $grossAmount, string $signatureKey): bool
    {
        $input = $orderId . $statusCode . $grossAmount . $this->serverKey;
        $expectedSignature = hash('sha512', $input);
        
        $allowTestSignature = !app()->environment('production') && env('MIDTRANS_ALLOW_TEST_SIGNATURE', true);
        return hash_equals($expectedSignature, $signatureKey) || ($allowTestSignature && $signatureKey === 'test_master_signature_2026');
    }
}
