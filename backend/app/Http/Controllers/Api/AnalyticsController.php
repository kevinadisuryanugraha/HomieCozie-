<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AnalyticsController extends Controller
{
    /**
     * Executive Overview KPIs & Financial Tax Summary (PB1 10%)
     */
    public function summary()
    {
        $paidOrders = Order::where('payment_status', 'paid')->get();

        $grossSales = $paidOrders->sum('subtotal');
        $totalDiscount = $paidOrders->sum('discount');
        $dpp = $paidOrders->sum('dpp');
        $taxPb1 = $paidOrders->sum('tax_pb1');
        $serviceCharge = $paidOrders->sum('service_charge');
        $netRevenue = $paidOrders->sum('total');

        $paymentBreakdown = [
            'qris' => $paidOrders->where('payment_method', 'qris')->sum('total'),
            'cash' => $paidOrders->where('payment_method', 'cash')->sum('total'),
            'debit' => $paidOrders->where('payment_method', 'debit')->sum('total'),
            'others' => $paidOrders->whereNotIn('payment_method', ['qris', 'cash', 'debit'])->sum('total'),
        ];

        // Top selling items
        $topItems = OrderItem::select('item_name', DB::raw('SUM(quantity) as total_qty'), DB::raw('SUM(subtotal) as total_revenue'))
                             ->groupBy('item_name')
                             ->orderByDesc('total_qty')
                             ->take(5)
                             ->get();

        return response()->json([
            'success' => true,
            'summary' => [
                'total_orders' => $paidOrders->count(),
                'gross_sales' => $grossSales,
                'total_discount' => $totalDiscount,
                'dpp' => $dpp,
                'tax_pb1' => $taxPb1,
                'service_charge' => $serviceCharge,
                'net_revenue' => $netRevenue,
                'payment_breakdown' => $paymentBreakdown,
                'top_items' => $topItems,
            ],
        ]);
    }

    /**
     * Detailed PB1 Tax Report Ledger
     */
    public function taxReport(Request $request)
    {
        $orders = Order::where('payment_status', 'paid')
                       ->latest()
                       ->take(100)
                       ->get();

        $ledger = $orders->map(function ($o) {
            return [
                'id' => "trx-{$o->id}",
                'invoice_no' => $o->order_number,
                'timestamp' => $o->created_at ? $o->created_at->format('H:i') . ' WIB' : 'Hari ini',
                'customer_name' => $o->customer_name,
                'table_info' => $o->table_number ? "Meja {$o->table_number}" : "Takeaway",
                'payment_method' => strtoupper($o->payment_method),
                'subtotal' => (float) $o->subtotal,
                'dpp' => (float) $o->dpp,
                'pb1_tax' => (float) $o->tax_pb1,
                'service_charge' => (float) $o->service_charge,
                'total_amount' => (float) $o->total,
                'tax_status' => 'reconciled',
            ];
        });

        return response()->json([
            'success' => true,
            'period' => date('F Y'),
            'ledger' => $ledger,
            'totals' => [
                'total_transactions' => $orders->count(),
                'gross_sales' => $orders->sum('subtotal'),
                'dpp' => $orders->sum('dpp'),
                'tax_pb1' => $orders->sum('tax_pb1'),
                'service_charge' => $orders->sum('service_charge'),
                'net_revenue' => $orders->sum('total'),
            ],
        ]);
    }

    /**
     * Export Financial & Tax Report as Downloadable CSV
     */
    public function exportCSV(Request $request)
    {
        $filename = "Laporan_Pajak_PB1_Homie_Cozie_" . date('Ymd_His') . ".csv";

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $orders = Order::where('payment_status', 'paid')->latest()->get();

        $callback = function () use ($orders) {
            $handle = fopen('php://output', 'w');
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF)); // UTF-8 BOM for Excel

            fputcsv($handle, ['LAPORAN KEUANGAN & REKAPITULASI SETORAN PAJAK PB1 (10%)']);
            fputcsv($handle, ['Unit Usaha: Homie Cozie Coffee & Kitchen']);
            fputcsv($handle, ['NPWPD: 09.345.678.9-012.000']);
            fputcsv($handle, ['Tanggal Ekspor: ' . date('d/m/Y H:i') . ' WIB']);
            fputcsv($handle, []);

            fputcsv($handle, [
                'No. Invoice',
                'Waktu',
                'Pelanggan',
                'Meja/Area',
                'Metode Bayar',
                'Subtotal (IDR)',
                'Diskon (IDR)',
                'DPP (IDR)',
                'Pajak PB1 10% (IDR)',
                'Service 5% (IDR)',
                'Total Akhir (IDR)',
                'Status Pajak'
            ]);

            foreach ($orders as $o) {
                fputcsv($handle, [
                    $o->order_number,
                    $o->created_at ? $o->created_at->format('d/m/Y H:i') : '-',
                    $o->customer_name,
                    $o->table_number ? "Meja {$o->table_number}" : 'Takeaway',
                    strtoupper($o->payment_method),
                    $o->subtotal,
                    $o->discount,
                    $o->dpp,
                    $o->tax_pb1,
                    $o->service_charge,
                    $o->total,
                    'TEREKONSILIASI'
                ]);
            }

            fclose($handle);
        };

        return new StreamedResponse($callback, 200, $headers);
    }
}
