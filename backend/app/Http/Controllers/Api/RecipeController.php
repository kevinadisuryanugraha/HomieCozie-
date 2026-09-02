<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Recipe;
use App\Models\RecipeIngredient;
use App\Models\MenuItem;

class RecipeController extends Controller
{
    public function index()
    {
        $recipes = Recipe::with('menuItem.category', 'ingredients.inventoryItem')->get();
        return response()->json([
            'success' => true,
            'recipes' => $recipes,
        ]);
    }

    public function show($id)
    {
        $recipe = Recipe::with('menuItem', 'ingredients.inventoryItem')->findOrFail($id);
        return response()->json([
            'success' => true,
            'recipe' => $recipe,
        ]);
    }

    public function update(Request $request, $id)
    {
        $recipe = Recipe::findOrFail($id);

        if ($request->filled('preparation_notes')) {
            $recipe->preparation_notes = $request->preparation_notes;
        }

        if ($request->has('ingredients') && is_array($request->ingredients)) {
            // Replace ingredients
            $recipe->ingredients()->delete();

            foreach ($request->ingredients as $ing) {
                RecipeIngredient::create([
                    'recipe_id' => $recipe->id,
                    'inventory_item_id' => $ing['inventory_item_id'] ?? null,
                    'ingredient_name' => $ing['ingredient_name'],
                    'quantity' => (float) $ing['quantity'],
                    'unit' => $ing['unit'],
                    'cost_per_unit' => (float) $ing['cost_per_unit'],
                    'subtotal_cost' => (float) ($ing['quantity'] * $ing['cost_per_unit']),
                ]);
            }

            $recipe->recalculateHPP();
        }

        $recipe->save();

        return response()->json([
            'success' => true,
            'message' => 'Resep BOM dan HPP berhasil diperbarui.',
            'recipe' => $recipe->load('ingredients.inventoryItem', 'menuItem'),
        ]);
    }
}
