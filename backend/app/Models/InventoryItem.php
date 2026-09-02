<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_code',
        'name',
        'sku',
        'category',
        'current_stock',
        'min_stock',
        'unit',
        'cost_per_unit',
        'supplier',
        'status',
    ];

    protected $casts = [
        'current_stock' => 'float',
        'min_stock' => 'float',
        'cost_per_unit' => 'float',
    ];

    public function recipeIngredients(): HasMany
    {
        return $this->hasMany(RecipeIngredient::class, 'inventory_item_id');
    }

    public function updateStockStatus(): void
    {
        if ($this->current_stock <= ($this->min_stock * 0.5)) {
            $this->status = 'critical';
        } elseif ($this->current_stock <= $this->min_stock) {
            $this->status = 'warning';
        } else {
            $this->status = 'optimal';
        }
        $this->save();
    }
}
