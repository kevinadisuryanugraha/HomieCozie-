<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BOMDeductionLog extends Model
{
    use HasFactory;

    protected $table = 'bom_deduction_logs';

    protected $fillable = [
        'order_id',
        'order_number',
        'customer_name',
        'deductions_payload',
    ];

    protected $casts = [
        'deductions_payload' => 'array',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
}
