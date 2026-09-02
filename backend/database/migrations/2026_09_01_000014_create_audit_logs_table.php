<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('user_name')->default('System');
            $table->string('role')->default('guest');
            $table->string('action'); // 'LOGIN_AUTH_SUCCESS', 'ROLE_SWITCH', 'TRANSACTION_PAID_QRIS', etc.
            $table->string('target_module')->default('MOD-AUTH');
            $table->enum('status', ['SUCCESS', 'BLOCKED_403', 'RATE_LIMITED_429', 'WARN'])->default('SUCCESS');
            $table->string('ip_address', 45)->nullable();
            $table->text('details')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
