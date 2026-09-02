<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TableItem;

class TableController extends Controller
{
    public function index()
    {
        $tables = TableItem::orderBy('table_number')->get();
        return response()->json([
            'success' => true,
            'tables' => $tables,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:available,reserved,occupied,billing,cleaning',
            'customer_name' => 'nullable|string',
        ]);

        $table = TableItem::where('id', $id)->orWhere('table_number', $id)->firstOrFail();
        $table->status = $request->status;

        if ($request->filled('customer_name')) {
            $table->current_customer = $request->customer_name;
        } elseif ($request->status === 'available') {
            $table->current_customer = null;
            $table->occupied_since = null;
        }

        if ($request->status === 'occupied' && !$table->occupied_since) {
            $table->occupied_since = now()->format('H:i') . ' WIB';
        }

        $table->save();

        try {
            broadcast(new \App\Events\TableStatusUpdatedEvent($table));
        } catch (\Throwable $e) {}

        return response()->json([
            'success' => true,
            'message' => "Status Meja #{$table->table_number} berhasil diperbarui menjadi {$table->status}.",
            'table' => $table,
        ]);
    }
}
