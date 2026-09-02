<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WaiterCall;

class WaiterCallController extends Controller
{
    public function index()
    {
        $calls = WaiterCall::where('status', '!=', 'resolved')->latest()->get();
        return response()->json([
            'success' => true,
            'waiter_calls' => $calls,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'table_number' => 'required|string',
            'call_type' => 'required|string',
            'call_type_label' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $call = WaiterCall::create([
            'table_number' => $request->table_number,
            'call_type' => $request->call_type,
            'call_type_label' => $request->call_type_label,
            'notes' => $request->notes,
            'status' => 'pending',
        ]);

        try {
            broadcast(new \App\Events\WaiterCallEvent($call));
        } catch (\Throwable $e) {}

        return response()->json([
            'success' => true,
            'message' => "Panggilan meja #{$call->table_number} ({$call->call_type_label}) diteruskan ke staf.",
            'waiter_call' => $call,
        ], 201);
    }

    public function resolve($id)
    {
        $call = WaiterCall::findOrFail($id);
        $call->status = 'resolved';
        $call->resolved_at = now();
        $call->save();

        return response()->json([
            'success' => true,
            'message' => "Panggilan meja #{$call->table_number} telah diselesaikan.",
            'waiter_call' => $call,
        ]);
    }
}
