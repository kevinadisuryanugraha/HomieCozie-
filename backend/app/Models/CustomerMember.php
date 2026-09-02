<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerMember extends Model
{
    use HasFactory;

    protected $table = 'customers_members';

    protected $fillable = [
        'name',
        'phone',
        'email',
        'tier',
        'cozie_points',
        'stamps_count',
        'total_visits',
        'lifetime_spend',
        'favorite_items',
        'tags',
        'birthday',
        'last_visit_at',
    ];

    protected $casts = [
        'cozie_points' => 'integer',
        'stamps_count' => 'integer',
        'total_visits' => 'integer',
        'lifetime_spend' => 'float',
        'favorite_items' => 'array',
        'tags' => 'array',
        'birthday' => 'date',
        'last_visit_at' => 'datetime',
    ];
}
