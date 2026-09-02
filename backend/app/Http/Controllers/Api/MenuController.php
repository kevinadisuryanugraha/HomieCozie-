<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MenuCategory;
use App\Models\MenuItem;

class MenuController extends Controller
{
    public function index()
    {
        $categories = MenuCategory::where('is_active', true)->orderBy('sort_order')->get();
        $menuItems = MenuItem::with('category', 'recipe.ingredients.inventoryItem')
                             ->where('available', true)
                             ->get();

        return response()->json([
            'success' => true,
            'categories' => $categories,
            'menu_items' => $menuItems,
        ]);
    }

    public function show($id)
    {
        $item = MenuItem::with('category', 'recipe.ingredients.inventoryItem')->findOrFail($id);
        return response()->json([
            'success' => true,
            'menu_item' => $item,
        ]);
    }
}
