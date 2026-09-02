<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Recipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'menu_item_id',
        'recipe_code',
        'total_hpp',
        'gross_margin_pct',
        'preparation_notes',
    ];

    protected $casts = [
        'total_hpp' => 'float',
        'gross_margin_pct' => 'float',
    ];

    public function menuItem(): BelongsTo
    {
        return $this->belongsTo(MenuItem::class, 'menu_item_id');
    }

    public function ingredients(): HasMany
    {
        return $this->hasMany(RecipeIngredient::class, 'recipe_id');
    }

    public function recalculateHPP(): void
    {
        $this->load('ingredients', 'menuItem');
        $totalHpp = $this->ingredients->sum('subtotal_cost');
        $this->total_hpp = $totalHpp;

        if ($this->menuItem && $this->menuItem->price > 0) {
            $margin = (($this->menuItem->price - $totalHpp) / $this->menuItem->price) * 100;
            $this->gross_margin_pct = round($margin, 2);
        }

        $this->save();
    }
}
