<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WaiterCall extends Model
{
    use HasFactory;

    protected $fillable = [
        'table_number',
        'call_type',
        'call_type_label',
        'status',
        'notes',
        'resolved_at',
    ];

    protected $casts = [
        'resolved_at' => 'datetime',
    ];
}
