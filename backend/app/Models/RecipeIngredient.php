<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecipeIngredient extends Model
{
    use HasFactory;

    protected $fillable = [
        'recipe_id',
        'inventory_item_id',
        'ingredient_name',
        'quantity',
        'unit',
        'cost_per_unit',
        'subtotal_cost',
    ];

    protected $casts = [
        'quantity' => 'float',
        'cost_per_unit' => 'float',
        'subtotal_cost' => 'float',
    ];

    public function recipe(): BelongsTo
    {
        return $this->belongsTo(Recipe::class, 'recipe_id');
    }

    public function inventoryItem(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class, 'inventory_item_id');
    }
}
