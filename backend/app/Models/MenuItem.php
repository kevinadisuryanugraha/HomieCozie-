<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MenuItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_code',
        'category_id',
        'name',
        'slug',
        'price',
        'description',
        'image',
        'is_bestseller',
        'is_chef_special',
        'is_chef_recommended',
        'is_new',
        'available',
        'preparation_time_minutes',
        'tags',
        'taste_profile',
        'options_config',
    ];

    protected $casts = [
        'price' => 'float',
        'is_bestseller' => 'boolean',
        'is_chef_special' => 'boolean',
        'is_chef_recommended' => 'boolean',
        'is_new' => 'boolean',
        'available' => 'boolean',
        'preparation_time_minutes' => 'integer',
        'tags' => 'array',
        'options_config' => 'array',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(MenuCategory::class, 'category_id');
    }

    public function recipe(): HasOne
    {
        return $this->hasOne(Recipe::class, 'menu_item_id');
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'menu_item_id');
    }
}
