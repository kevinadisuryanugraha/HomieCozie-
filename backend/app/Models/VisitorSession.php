<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VisitorSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'ip_hash',
        'user_agent',
        'device_type',
        'os',
        'browser',
        'referrer_source',
        'location_city',
        'customer_phone',
        'is_active',
        'last_active_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'last_active_at' => 'datetime',
    ];

    public function events(): HasMany
    {
        return $this->hasMany(VisitorEvent::class, 'visitor_session_id');
    }
}
