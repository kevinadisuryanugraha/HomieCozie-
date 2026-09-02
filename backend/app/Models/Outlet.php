<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Outlet extends Model
{
    protected $fillable = [
        'code',
        'name',
        'address',
        'city',
        'phone',
        'is_main_branch',
        'is_active',
    ];

    protected $casts = [
        'is_main_branch' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function tables(): HasMany
    {
        return $this->hasMany(Table::class);
    }

    public function inventoryItems(): HasMany
    {
        return $this->hasMany(InventoryItem::class);
    }

    public function shifts(): HasMany
    {
        return $this->hasMany(CashShift::class);
    }
}
