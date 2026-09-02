<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'order_type',
        'table_id',
        'table_number',
        'customer_name',
        'customer_phone',
        'subtotal',
        'discount',
        'dpp',
        'tax_pb1',
        'service_charge',
        'total',
        'payment_method',
        'payment_status',
        'status',
        'cashier_id',
        'notes',
        'estimated_ready_time',
    ];

    protected $casts = [
        'subtotal' => 'float',
        'discount' => 'float',
        'dpp' => 'float',
        'tax_pb1' => 'float',
        'service_charge' => 'float',
        'total' => 'float',
        'estimated_ready_time' => 'datetime',
    ];

    public function table(): BelongsTo
    {
        return $this->belongsTo(TableItem::class, 'table_id');
    }

    public function cashier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cashier_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }

    public function bomDeductionLogs(): HasMany
    {
        return $this->hasMany(BOMDeductionLog::class, 'order_id');
    }
}
