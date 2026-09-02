<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AuditLog;

class AuditLogController extends Controller
{
    public function index()
    {
        $logs = AuditLog::latest()->take(100)->get();
        return response()->json([
            'success' => true,
            'audit_logs' => $logs,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'action' => 'required|string',
            'target_module' => 'required|string',
            'status' => 'required|in:SUCCESS,BLOCKED_403,RATE_LIMITED_429,WARN',
        ]);

        $log = AuditLog::create([
            'user_id' => $request->user_id,
            'user_name' => $request->user_name ?? 'System User',
            'role' => $request->role ?? 'guest',
            'action' => $request->action,
            'target_module' => $request->target_module,
            'status' => $request->status,
            'ip_address' => $request->ip(),
            'details' => $request->details,
        ]);

        return response()->json([
            'success' => true,
            'audit_log' => $log,
        ], 201);
    }
}
