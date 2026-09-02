<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CmsEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'category',
        'performer_name',
        'event_date',
        'time_slot',
        'ticket_price',
        'quota',
        'poster_url',
        'description',
        'is_active',
    ];

    protected $casts = [
        'ticket_price' => 'float',
        'quota' => 'integer',
        'is_active' => 'boolean',
    ];
}
