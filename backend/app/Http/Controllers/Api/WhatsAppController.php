<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reservation;
use App\Models\Order;
use App\Services\WhatsAppNotificationService;

class WhatsAppController extends Controller
{
    protected WhatsAppNotificationService $waService;

    public function __construct(WhatsAppNotificationService $waService)
    {
        $this->waService = $waService;
    }

    public function sendReservationTicket(Request $request)
    {
        $request->validate([
            'reservation_id' => 'required',
        ]);

        $res = Reservation::where('id', $request->reservation_id)
                          ->orWhere('booking_code', $request->reservation_id)
                          ->firstOrFail();

        $result = $this->waService->sendReservationTicket($res);

        return response()->json([
            'success' => true,
            'message' => "Tiket WhatsApp berhasil dikirim ke nomor {$res->customer_phone}.",
            'data' => $result,
        ]);
    }

    public function sendReceipt(Request $request)
    {
        $request->validate([
            'order_id' => 'required',
            'phone' => 'nullable|string',
        ]);

        $order = Order::where('id', $request->order_id)
                      ->orWhere('order_number', $request->order_id)
                      ->firstOrFail();

        $result = $this->waService->sendDigitalReceipt($order, $request->phone);

        return response()->json([
            'success' => true,
            'message' => "Struk digital berhasil dikirim ke WhatsApp.",
            'data' => $result,
        ]);
    }

    public function sendDailyClosingReport(Request $request)
    {
        $shiftId = $request->input('shift_id');
        $shift = null;
        if ($shiftId) {
            $shift = \App\Models\CashShift::find($shiftId);
        } else {
            $shift = \App\Models\CashShift::latest()->first();
        }

        $result = $this->waService->sendDailyClosingReport($shift, $request->input('phone'));

        return response()->json([
            'success' => true,
            'message' => "Laporan penutupan harian eksekutif berhasil dikirim ke WhatsApp Owner.",
            'data' => $result,
        ]);
    }
}
