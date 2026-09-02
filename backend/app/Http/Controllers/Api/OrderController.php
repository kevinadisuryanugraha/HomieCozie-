<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\TableItem;
use App\Services\OrderBOMService;

class OrderController extends Controller
{
    protected OrderBOMService $bomService;

    public function __construct(OrderBOMService $bomService)
    {
        $this->bomService = $bomService;
    }

    /**
     * List all orders (filter by active/all)
     */
    public function index(Request $request)
    {
        $query = Order::with('items.menuItem', 'table')->latest();

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->boolean('active_only')) {
            $query->whereIn('status', ['pending', 'preparing', 'ready']);
        }

        $orders = $query->take(50)->get();

        return response()->json([
            'success' => true,
            'orders' => $orders,
        ]);
    }

    /**
     * Create Order with BOM Auto-Deduct
     */
    public function store(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string|max:100',
            'subtotal' => 'required|numeric|min:0',
            'items' => 'required|array|min:1',
            'payment_method' => 'nullable|string',
        ]);

        $order = $this->bomService->createOrderWithBOMDeduction($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil dibuat dan stok bahan baku otomatis terpotong.',
            'order' => $order,
        ], 201);
    }

    /**
     * Show single order details
     */
    public function show($id)
    {
        $order = Order::with('items.menuItem', 'table', 'bomDeductionLogs')->findOrFail($id);

        return response()->json([
            'success' => true,
            'order' => $order,
        ]);
    }

    /**
     * Update order status (KDS & POS progression)
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,preparing,ready,served,completed,paid,cancelled',
        ]);

        $order = Order::findOrFail($id);
        $order->status = $request->status;

        if ($request->status === 'completed' || $request->status === 'paid') {
            $order->payment_status = 'paid';
            if ($order->table_number) {
                TableItem::where('table_number', $order->table_number)->update(['status' => 'available', 'current_customer' => null]);
            }
        }

        $order->save();

        try {
            broadcast(new \App\Events\OrderStatusUpdatedEvent($order));
        } catch (\Throwable $e) {}

        return response()->json([
            'success' => true,
            'message' => "Status pesanan #{$order->order_number} diperbarui menjadi {$order->status}.",
            'order' => $order->load('items'),
        ]);
    }
}
