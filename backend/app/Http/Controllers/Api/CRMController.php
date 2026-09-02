<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CustomerMember;

class CRMController extends Controller
{
    public function index()
    {
        $customers = CustomerMember::orderByDesc('lifetime_spend')->get();
        return response()->json([
            'success' => true,
            'customers' => $customers,
        ]);
    }

    public function addPoints(Request $request, $id)
    {
        $request->validate([
            'points' => 'required|integer',
            'spend_amount' => 'nullable|numeric',
        ]);

        $member = CustomerMember::findOrFail($id);
        $member->cozie_points += $request->points;
        $member->total_visits += 1;
        $member->stamps_count = ($member->stamps_count + 1) % 10;

        if ($request->filled('spend_amount')) {
            $member->lifetime_spend += (float) $request->spend_amount;
        }

        // Auto Tier Progression
        if ($member->lifetime_spend >= 1500000) {
            $member->tier = 'Platinum Cozie';
        } elseif ($member->lifetime_spend >= 500000) {
            $member->tier = 'Gold Cozie';
        }

        $member->last_visit_at = now();
        $member->save();

        return response()->json([
            'success' => true,
            'message' => "Poin dan stamp member {$member->name} berhasil ditambahkan.",
            'member' => $member,
        ]);
    }
}
