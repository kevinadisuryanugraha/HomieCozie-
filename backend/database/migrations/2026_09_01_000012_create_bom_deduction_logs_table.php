<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bom_deduction_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();
            $table->string('order_number');
            $table->string('customer_name');
            $table->json('deductions_payload'); // Snapshot of all deducted ingredients, remaining stock, etc.
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bom_deduction_logs');
    }
};
