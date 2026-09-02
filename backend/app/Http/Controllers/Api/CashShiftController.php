<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CashShift;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CashShiftController extends Controller
{
    /**
     * Get currently active open shift
     */
    public function current(): JsonResponse
    {
        $shift = CashShift::where('status', 'open')->latest()->first();

        if (!$shift) {
            return response()->json([
                'status' => 'no_open_shift',
                'message' => 'Belum ada shift kasir yang aktif.',
                'data' => null,
            ]);
        }

        // Live calculate sales during this shift
        $orders = Order::where('payment_status', 'paid')
            ->where('created_at', '>=', $shift->started_at)
            ->get();

        $totalSales = $orders->sum('total_amount');
        $totalCash = $orders->where('payment_method', 'cash')->sum('total_amount');
        $totalQris = $orders->where('payment_method', 'qris')->sum('total_amount');
        $totalDebit = $orders->where('payment_method', 'debit')->sum('total_amount');
        $txCount = $orders->count();

        $expectedCash = $shift->opening_cash + $totalCash;

        return response()->json([
            'status' => 'open',
            'data' => [
                'shift' => $shift,
                'live_metrics' => [
                    'opening_cash' => (float)$shift->opening_cash,
                    'total_sales' => (float)$totalSales,
                    'total_cash' => (float)$totalCash,
                    'total_qris' => (float)$totalQris,
                    'total_debit' => (float)$totalDebit,
                    'expected_cash' => (float)$expectedCash,
                    'transactions_count' => $txCount,
                ],
            ],
        ]);
    }

    /**
     * Open a new cashier shift
     */
    public function open(Request $request): JsonResponse
    {
        $request->validate([
            'cashier_name' => 'required|string',
            'opening_cash' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        // Close any lingering open shift
        CashShift::where('status', 'open')->update([
            'status' => 'closed',
            'closed_at' => now(),
        ]);

        $shiftCountToday = CashShift::whereDate('created_at', Carbon::today())->count() + 1;
        $shiftNumber = 'SHIFT-' . Carbon::today()->format('Ymd') . '-' . str_pad($shiftCountToday, 2, '0', STR_PAD_LEFT);

        $shift = CashShift::create([
            'shift_number' => $shiftNumber,
            'user_id' => $request->user()?->id,
            'cashier_name' => $request->input('cashier_name', 'Kasir Utama'),
            'started_at' => now(),
            'opening_cash' => $request->input('opening_cash', 200000),
            'expected_cash' => $request->input('opening_cash', 200000),
            'status' => 'open',
            'notes' => $request->input('notes'),
        ]);

        return response()->json([
            'success' => true,
            'message' => "Shift Kasir {$shiftNumber} berhasil dibuka.",
            'data' => $shift,
        ], 201);
    }

    /**
     * Close shift and generate Z-Report
     */
    public function close(Request $request): JsonResponse
    {
        $request->validate([
            'actual_cash' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $shift = CashShift::where('status', 'open')->latest()->first();

        if (!$shift) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ditemukan shift aktif untuk ditutup.',
            ], 404);
        }

        // Calculate sales during shift
        $orders = Order::where('payment_status', 'paid')
            ->where('created_at', '>=', $shift->started_at)
            ->get();

        $totalSales = $orders->sum('total_amount');
        $totalCash = $orders->where('payment_method', 'cash')->sum('total_amount');
        $totalQris = $orders->where('payment_method', 'qris')->sum('total_amount');
        $totalDebit = $orders->where('payment_method', 'debit')->sum('total_amount');
        $txCount = $orders->count();

        $actualCash = (float)$request->input('actual_cash');
        $expectedCash = (float)$shift->opening_cash + (float)$totalCash;
        $difference = $actualCash - $expectedCash;

        $shift->update([
            'closed_at' => now(),
            'actual_cash' => $actualCash,
            'expected_cash' => $expectedCash,
            'cash_difference' => $difference,
            'total_sales' => $totalSales,
            'total_cash' => $totalCash,
            'total_qris' => $totalQris,
            'total_debit' => $totalDebit,
            'total_transactions_count' => $txCount,
            'status' => 'closed',
            'notes' => $request->input('notes', $shift->notes),
        ]);

        return response()->json([
            'success' => true,
            'message' => "Shift {$shift->shift_number} berhasil ditutup (Z-Report diterbitkan).",
            'data' => $shift,
        ]);
    }

    /**
     * Get shift history
     */
    public function history(): JsonResponse
    {
        $shifts = CashShift::latest()->take(20)->get();
        return response()->json([
            'success' => true,
            'data' => $shifts,
        ]);
    }
}
