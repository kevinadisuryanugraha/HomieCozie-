<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Recipe;
use App\Models\InventoryItem;
use App\Models\TableItem;
use App\Models\BOMDeductionLog;
use Illuminate\Support\Facades\DB;
use Exception;

class OrderBOMService
{
    /**
     * Creates an order atomically inside a database transaction
     * and performs automated BOM inventory stock deduction with audit logging.
     */
    public function createOrderWithBOMDeduction(array $data): Order
    {
        return DB::transaction(function () use ($data) {
            // 1. Generate Order Header
            $orderNumber = $data['order_number'] ?? 'HC-' . mt_rand(1000, 9999);
            
            $subtotal = (float) $data['subtotal'];
            $discount = (float) ($data['discount'] ?? 0);
            $dpp = max(0, $subtotal - $discount);
            $taxPb1 = (float) ($data['tax_pb1'] ?? round($dpp * 0.10));
            $serviceCharge = (float) ($data['service_charge'] ?? round($dpp * 0.05));
            $total = (float) ($data['total'] ?? ($dpp + $taxPb1 + $serviceCharge));

            // Resolve table_id and table_number safely
            $tableId = null;
            $tableNumber = $data['table_number'] ?? null;
            if (!empty($data['table_id']) && is_numeric($data['table_id'])) {
                $tableId = (int) $data['table_id'];
            } elseif (!empty($data['table_id']) && is_string($data['table_id'])) {
                $tableObj = TableItem::where('table_number', $data['table_id'])->orWhere('id', $data['table_id'])->first();
                if ($tableObj) {
                    $tableId = $tableObj->id;
                    $tableNumber = $tableNumber ?: $tableObj->table_number;
                } else {
                    $tableNumber = $tableNumber ?: $data['table_id'];
                }
            } elseif (!empty($tableNumber)) {
                $tableObj = TableItem::where('table_number', $tableNumber)->first();
                if ($tableObj) {
                    $tableId = $tableObj->id;
                }
            }

            // Resolve cashier_id safely
            $cashierId = null;
            if (!empty($data['cashier_id']) && is_numeric($data['cashier_id'])) {
                $cashierId = (int) $data['cashier_id'];
            }

            $order = Order::create([
                'order_number' => $orderNumber,
                'order_type' => $data['order_type'] ?? 'dine-in',
                'table_id' => $tableId,
                'table_number' => $tableNumber,
                'customer_name' => $data['customer_name'] ?? 'Tamu Walk-in',
                'customer_phone' => $data['customer_phone'] ?? null,
                'subtotal' => $subtotal,
                'discount' => $discount,
                'dpp' => $dpp,
                'tax_pb1' => $taxPb1,
                'service_charge' => $serviceCharge,
                'total' => $total,
                'payment_method' => $data['payment_method'] ?? 'qris',
                'payment_status' => $data['payment_status'] ?? 'paid',
                'status' => $data['status'] ?? 'pending',
                'cashier_id' => $cashierId,
                'notes' => $data['notes'] ?? null,
            ]);

            // 2. Insert Order Items & Track Deductions
            $deductionItemsList = [];

            if (!empty($data['items']) && is_array($data['items'])) {
                foreach ($data['items'] as $itemData) {
                    $rawItemId = $itemData['menu_item_id'] ?? $itemData['menuItem']['id'] ?? null;
                    $menuItemId = is_numeric($rawItemId) ? (int) $rawItemId : null;
                    $qty = (int) ($itemData['quantity'] ?? 1);
                    $price = (float) ($itemData['unit_price'] ?? $itemData['menuItem']['price'] ?? 0);
                    $name = $itemData['item_name'] ?? $itemData['menuItem']['name'] ?? 'Item';

                    $orderItem = OrderItem::create([
                        'order_id' => $order->id,
                        'menu_item_id' => $menuItemId,
                        'item_name' => $name,
                        'unit_price' => $price,
                        'quantity' => $qty,
                        'subtotal' => $price * $qty,
                        'selected_options' => $itemData['selected_options'] ?? $itemData['selectedOptions'] ?? null,
                        'notes' => $itemData['notes'] ?? null,
                    ]);

                    // 3. Process BOM Recipe Deductions
                    $recipe = null;
                    if ($menuItemId) {
                        $recipe = Recipe::with('ingredients.inventoryItem')->where('menu_item_id', $menuItemId)->first();
                    }
                    if (!$recipe && $name) {
                        $recipe = Recipe::with('ingredients.inventoryItem')->where('menu_item_name', 'like', "%{$name}%")->first();
                    }
                    if ($recipe && $recipe->ingredients->isNotEmpty()) {
                        $itemDeductions = [];

                        foreach ($recipe->ingredients as $ing) {
                            $inv = $ing->inventoryItem;
                            if ($inv) {
                                $deductAmount = $ing->quantity * $qty;

                                // Unit conversions (e.g. gram -> kg, ml -> liter)
                                $unitRatio = 1.0;
                                if (strtolower($ing->unit) === 'gram' && strtolower($inv->unit) === 'kg') {
                                    $unitRatio = 0.001;
                                } elseif (strtolower($ing->unit) === 'ml' && strtolower($inv->unit) === 'liter') {
                                    $unitRatio = 0.001;
                                }

                                $actualStockDeduct = $deductAmount * $unitRatio;
                                $newStock = max(0, round($inv->current_stock - $actualStockDeduct, 3));
                                
                                $inv->current_stock = $newStock;
                                $inv->updateStockStatus();

                                $itemDeductions[] = [
                                    'ingredient_name' => $ing->ingredient_name,
                                    'deduct_amount' => $deductAmount,
                                    'unit' => $ing->unit,
                                    'stock_remaining' => $newStock,
                                    'inventory_unit' => $inv->unit,
                                ];
                            }
                        }

                        if (!empty($itemDeductions)) {
                            $deductionItemsList[] = [
                                'menu_item_name' => $name,
                                'quantity' => $qty,
                                'deductions' => $itemDeductions,
                            ];
                        }
                    }
                }
            }

            // 4. Log BOM Deduction Audit
            if (!empty($deductionItemsList)) {
                BOMDeductionLog::create([
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer_name' => $order->customer_name,
                    'deductions_payload' => $deductionItemsList,
                ]);
            }

            // 5. Update Table Status if Dine-In
            if (!empty($order->table_number)) {
                TableItem::where('table_number', $order->table_number)->update([
                    'status' => 'occupied',
                    'current_customer' => $order->customer_name,
                    'current_order_id' => $order->id,
                    'occupied_since' => now()->format('H:i') . ' WIB',
                ]);
            }

            // 6. Broadcast Real-time Event via Reverb WebSocket
            try {
                broadcast(new \App\Events\OrderCreatedEvent($order));
            } catch (\Throwable $e) {
                // Ignore broadcast error in environments without reverb worker
            }

            return $order->load('items', 'table', 'bomDeductionLogs');
        });
    }
}
