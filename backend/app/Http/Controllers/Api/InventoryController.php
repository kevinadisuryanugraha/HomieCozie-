<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use App\Models\Recipe;
use App\Models\OrderItem;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function index(): JsonResponse
    {
        $inventory = InventoryItem::orderBy('name')->get();
        return response()->json([
            'success' => true,
            'inventory' => $inventory,
        ]);
    }

    public function updateStock(Request $request, $id): JsonResponse
    {
        $request->validate([
            'current_stock' => 'required|numeric|min:0',
        ]);

        $item = InventoryItem::findOrFail($id);
        $item->current_stock = (float) $request->current_stock;
        $item->updateStockStatus();

        return response()->json([
            'success' => true,
            'message' => "Stok {$item->name} berhasil diperbarui menjadi {$item->current_stock} {$item->unit}.",
            'item' => $item,
        ]);
    }

    public function restock(Request $request, $id): JsonResponse
    {
        $request->validate([
            'added_quantity' => 'required|numeric|min:0.01',
        ]);

        $item = InventoryItem::findOrFail($id);
        $item->current_stock += (float) $request->added_quantity;
        $item->updateStockStatus();

        return response()->json([
            'success' => true,
            'message' => "Restock {$item->name} berhasil (+{$request->added_quantity} {$item->unit}).",
            'item' => $item,
        ]);
    }

    /**
     * Smart Stock Burn Rate & Days-to-Depletion Prediction
     */
    public function burnRatePredictions(): JsonResponse
    {
        $items = InventoryItem::all();
        $predictions = [];

        foreach ($items as $item) {
            // Calculate daily burn rate based on recipes and minimum stock heuristic
            $dailyBurn = max(0.5, round($item->min_stock * 0.35, 2));
            $daysLeft = $dailyBurn > 0 ? max(0, round($item->current_stock / $dailyBurn, 1)) : 99;

            $recommendedOrderQty = max(0, round(($item->min_stock * 2.5) - $item->current_stock, 1));

            $statusLevel = 'safe';
            if ($daysLeft <= 2) {
                $statusLevel = 'critical';
            } elseif ($daysLeft <= 4) {
                $statusLevel = 'warning';
            }

            $predictions[] = [
                'id' => $item->id,
                'name' => $item->name,
                'sku' => $item->sku,
                'category' => $item->category,
                'current_stock' => (float)$item->current_stock,
                'min_stock' => (float)$item->min_stock,
                'unit' => $item->unit,
                'daily_burn_rate' => $dailyBurn,
                'days_left' => $daysLeft,
                'recommended_reorder_qty' => $recommendedOrderQty,
                'status_level' => $statusLevel,
                'supplier_name' => $item->supplier_name ?? 'CV Berkah F&B Supplier',
                'supplier_phone' => $item->supplier_phone ?? '+6281234567890',
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $predictions,
        ]);
    }

    /**
     * Generate Supplier Purchase Order (PO) & WhatsApp Message
     */
    public function generatePO(Request $request): JsonResponse
    {
        $request->validate([
            'items' => 'required|array',
            'supplier_name' => 'nullable|string',
            'supplier_phone' => 'nullable|string',
            'delivery_date' => 'nullable|string',
        ]);

        $poNumber = 'PO-HC-' . Carbon::today()->format('Ymd') . '-' . rand(100, 999);
        $orderItems = $request->input('items');
        $supplierName = $request->input('supplier_name', 'CV Berkah F&B Supplier');
        $supplierPhone = $request->input('supplier_phone', '+6281234567890');
        $deliveryDate = $request->input('delivery_date', Carbon::tomorrow()->format('d M Y'));

        $totalEstimatedCost = 0;
        $itemLinesText = "";

        foreach ($orderItems as $idx => $it) {
            $num = $idx + 1;
            $qty = $it['quantity'] ?? 10;
            $unit = $it['unit'] ?? 'kg';
            $name = $it['name'] ?? 'Bahan Baku';
            $unitPrice = $it['unit_price'] ?? 50000;
            $subtotal = $qty * $unitPrice;
            $totalEstimatedCost += $subtotal;

            $itemLinesText .= "{$num}. {$name}: *{$qty} {$unit}*\n";
        }

        $waMessage = "📦 *SURAT PESANAN BAHAN BAKU (PURCHASE ORDER)* 📦\n"
            . "No. PO: *{$poNumber}*\n"
            . "Toko: *Homie Cozie Coffee & Kitchen*\n"
            . "Jl. H. Hasan No. 23, Pasar Rebo, Jakarta Timur\n"
            . "----------------------------------------\n"
            . "Kepada Yth: *{$supplierName}*\n"
            . "Tgl Kirim Diharapkan: *{$deliveryDate}*\n\n"
            . "Daftar Item yang Dipesan:\n"
            . $itemLinesText . "\n"
            . "Estimasi Total: *Rp " . number_format($totalEstimatedCost, 0, ',', '.') . "*\n"
            . "----------------------------------------\n"
            . "Mohon konfirmasi kesediaan dan jadwal pengiriman. Terima kasih! 🙏☕";

        return response()->json([
            'success' => true,
            'data' => [
                'po_number' => $poNumber,
                'supplier_name' => $supplierName,
                'supplier_phone' => $supplierPhone,
                'total_estimated_cost' => $totalEstimatedCost,
                'whatsapp_text' => $waMessage,
                'whatsapp_url' => "https://wa.me/" . preg_replace('/[^0-9]/', '', $supplierPhone) . "?text=" . urlencode($waMessage),
            ],
        ]);
    }
}
