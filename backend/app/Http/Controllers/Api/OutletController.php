<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Outlet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OutletController extends Controller
{
    public function index(): JsonResponse
    {
        $outlets = Outlet::all();

        // If no outlets, create default flagship
        if ($outlets->isEmpty()) {
            $outlets = collect([
                Outlet::create([
                    'code' => 'HC-JKT-01',
                    'name' => 'Homie Cozie Kalisari (Main Flagship)',
                    'address' => 'Jl. H. Hasan No.23, RT.5/RW.2, Baru, Kec. Ps. Rebo, Kota Jakarta Timur, DKI Jakarta 13780',
                    'city' => 'Jakarta Timur',
                    'phone' => '0815-8640-2420',
                    'is_main_branch' => true,
                    'is_active' => true,
                ]),
                Outlet::create([
                    'code' => 'HC-JKT-02',
                    'name' => 'Homie Cozie Tebet (Branch 2)',
                    'address' => 'Jl. Tebet Timur Dalam Raya No. 45',
                    'city' => 'Jakarta Selatan',
                    'phone' => '+62 813-9876-5432',
                    'is_main_branch' => false,
                    'is_active' => true,
                ]),
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $outlets,
        ]);
    }

    public function show($id): JsonResponse
    {
        $outlet = Outlet::findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $outlet,
        ]);
    }
}
