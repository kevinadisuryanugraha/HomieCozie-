<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_code',
        'customer_name',
        'customer_phone',
        'customer_email',
        'guest_count',
        'reservation_date',
        'time_slot',
        'area_preference',
        'table_id',
        'table_number',
        'special_occasion',
        'notes',
        'status',
        'wa_confirmed',
    ];

    protected $casts = [
        'guest_count' => 'integer',
        'reservation_date' => 'date',
        'wa_confirmed' => 'boolean',
    ];

    public function table(): BelongsTo
    {
        return $this->belongsTo(TableItem::class, 'table_id');
    }
}
