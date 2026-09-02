<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'role_id',
        'name',
        'email',
        'password',
        'phone',
        'avatar',
        'is_active',
        'two_factor_enabled',
        'two_factor_secret',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'two_factor_enabled' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class);
    }

    public function hasRole(string|array $roles): bool
    {
        if (!$this->role) return false;
        if (is_string($roles)) {
            return $this->role->name === $roles;
        }
        return in_array($this->role->name, $roles, true);
    }

    public function getPermissionLevel(string $moduleCode): string
    {
        if (!$this->role) return 'T';
        $permission = $this->role->permissions()->where('module_code', $moduleCode)->first();
        return $permission ? $permission->pivot->permission_level : 'T';
    }

    public function canAccessModule(string $moduleCode, string $minLevel = 'L'): bool
    {
        $levels = ['T' => 0, 'L' => 1, 'E' => 2, 'F' => 3];
        $userLevel = $this->getPermissionLevel($moduleCode);
        return ($levels[$userLevel] ?? 0) >= ($levels[$minLevel] ?? 1);
    }
}
