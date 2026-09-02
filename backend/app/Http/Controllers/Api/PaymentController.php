<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\TableItem;
use App\Models\AuditLog;
use App\Services\MidtransService;

class PaymentController extends Controller
{
    protected MidtransService $midtransService;

    public function __construct(MidtransService $midtransService)
    {
        $this->midtransService = $midtransService;
    }

    /**
     * Generate Dynamic QRIS Charge for Order
     */
    public function chargeQRIS(Request $request)
    {
        $request->validate([
            'order_id' => 'required',
        ]);

        $order = Order::where('id', $request->order_id)
                      ->orWhere('order_number', $request->order_id)
                      ->firstOrFail();

        $paymentData = $this->midtransService->createQRISTransaction($order);

        return response()->json([
            'success' => true,
            'message' => 'QRIS Dinamis berhasil digenerate.',
            'payment' => $paymentData,
            'order' => $order,
        ]);
    }

    /**
     * Midtrans Webhook Callback Handler
     */
    public function handleWebhook(Request $request)
    {
        $orderIdRaw = $request->input('order_id');
        $statusCode = (string) $request->input('status_code', '200');
        $grossAmount = (string) $request->input('gross_amount');
        $signatureKey = (string) $request->input('signature_key');
        $transactionStatus = $request->input('transaction_status'); // 'settlement', 'capture', 'pending', 'cancel', 'expire'
        $fraudStatus = $request->input('fraud_status', 'accept');

        // Extract internal Order ID from string like "HC-12-169357421" or plain "HC-9421"
        $order = null;
        if (preg_match('/HC-(\d+)-/', $orderIdRaw, $matches)) {
            $order = Order::find($matches[1]);
        }
        if (!$order) {
            $order = Order::where('order_number', $orderIdRaw)->orWhere('id', $orderIdRaw)->first();
        }

        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found.'], 404);
        }

        // Verify Signature
        if ($signatureKey && !$this->midtransService->verifySignature($orderIdRaw, $statusCode, $grossAmount, $signatureKey)) {
            AuditLog::create([
                'user_name' => 'Midtrans Webhook',
                'role' => 'system',
                'action' => 'PAYMENT_WEBHOOK_SIGNATURE_MISMATCH',
                'target_module' => 'MOD-PAYMENT',
                'status' => 'BLOCKED_403',
                'ip_address' => $request->ip(),
                'details' => "Signature mismatch for order {$orderIdRaw}",
            ]);

            return response()->json(['success' => false, 'message' => 'Invalid signature.'], 403);
        }

        // Handle Settlement / Success
        if ($transactionStatus === 'settlement' || $transactionStatus === 'capture' || $transactionStatus === 'paid') {
            if ($fraudStatus === 'accept') {
                $order->payment_status = 'paid';
                $order->payment_method = 'qris';
                
                if ($order->status === 'pending') {
                    $order->status = 'preparing';
                }
                
                $order->save();

                // Broadcast Event via Reverb WebSocket
                try {
                    broadcast(new \App\Events\OrderStatusUpdatedEvent($order));
                } catch (\Throwable $e) {}

                AuditLog::create([
                    'user_name' => $order->customer_name,
                    'role' => 'customer',
                    'action' => 'PAYMENT_QRIS_SETTLED',
                    'target_module' => 'MOD-PAYMENT',
                    'status' => 'SUCCESS',
                    'ip_address' => $request->ip(),
                    'details' => "Pembayaran QRIS Rp" . number_format($order->total, 0, ',', '.') . " sukses via Midtrans Callback.",
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Pembayaran pesanan berhasil dikonfirmasi.',
                    'order' => $order,
                ]);
            }
        } elseif (in_array($transactionStatus, ['cancel', 'deny', 'expire'])) {
            $order->payment_status = 'unpaid';
            $order->status = 'cancelled';
            $order->save();

            try {
                broadcast(new \App\Events\OrderStatusUpdatedEvent($order));
            } catch (\Throwable $e) {}

            return response()->json([
                'success' => true,
                'message' => 'Status pembayaran dibatalkan / kadaluarsa.',
                'order' => $order,
            ]);
        }

        return response()->json(['success' => true, 'message' => 'Webhook received.']);
    }

    /**
     * Check Order Payment Status
     */
    public function checkStatus($id)
    {
        $order = Order::where('id', $id)->orWhere('order_number', $id)->firstOrFail();
        return response()->json([
            'success' => true,
            'payment_status' => $order->payment_status,
            'order_status' => $order->status,
            'order' => $order,
        ]);
    }
}
