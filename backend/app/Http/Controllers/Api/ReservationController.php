<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reservation;
use App\Models\TableItem;

class ReservationController extends Controller
{
    public function index()
    {
        $reservations = Reservation::with('table')->latest()->get();
        return response()->json([
            'success' => true,
            'reservations' => $reservations,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string|max:100',
            'customer_phone' => 'required|string|max:30',
            'guest_count' => 'required|integer|min:1',
            'reservation_date' => 'required|date',
            'time_slot' => 'required|string',
            'area_preference' => 'nullable|string',
            'table_number' => 'nullable|string',
        ]);

        $bookingCode = '#HC-' . mt_rand(100000, 999999);

        $table = null;
        if ($request->filled('table_number')) {
            $table = TableItem::where('table_number', $request->table_number)->first();
            if ($table) {
                $table->update(['status' => 'reserved', 'current_customer' => $request->customer_name]);
            }
        }

        $res = Reservation::create([
            'booking_code' => $bookingCode,
            'customer_name' => $request->customer_name,
            'customer_phone' => $request->customer_phone,
            'customer_email' => $request->customer_email,
            'guest_count' => $request->guest_count,
            'reservation_date' => $request->reservation_date,
            'time_slot' => $request->time_slot,
            'area_preference' => $request->area_preference ?? 'indoor',
            'table_id' => $table ? $table->id : null,
            'table_number' => $request->table_number,
            'special_occasion' => $request->special_occasion,
            'notes' => $request->notes,
            'status' => 'confirmed',
            'wa_confirmed' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Reservasi berhasil diamankan.',
            'reservation' => $res,
        ], 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,seated,completed,cancelled',
            'table_number' => 'nullable|string',
        ]);

        $res = Reservation::findOrFail($id);
        $res->status = $request->status;

        if ($request->filled('table_number')) {
            $res->table_number = $request->table_number;
        }

        if ($request->status === 'seated' && $res->table_number) {
            TableItem::where('table_number', $res->table_number)->update(['status' => 'occupied', 'current_customer' => $res->customer_name]);
        }

        $res->save();

        return response()->json([
            'success' => true,
            'message' => "Status reservasi {$res->booking_code} diperbarui menjadi {$res->status}.",
            'reservation' => $res,
        ]);
    }
}
