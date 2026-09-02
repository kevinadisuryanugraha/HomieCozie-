<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cash_shifts', function (Blueprint $table) {
            $table->id();
            $table->string('shift_number')->unique(); // e.g. SHIFT-20260902-01
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('cashier_name');
            $table->timestamp('started_at');
            $table->timestamp('closed_at')->nullable();
            
            $table->decimal('opening_cash', 12, 2)->default(0); // Modal awal laci
            $table->decimal('expected_cash', 12, 2)->default(0); // Modal awal + Penjualan Tunai
            $table->decimal('actual_cash', 12, 2)->nullable(); // Uang fisik saat dihitung
            $table->decimal('cash_difference', 12, 2)->default(0); // Selisih kas (Over / Short)

            // Rekap Penjualan per Metode Bayar
            $table->decimal('total_sales', 12, 2)->default(0);
            $table->decimal('total_cash', 12, 2)->default(0);
            $table->decimal('total_qris', 12, 2)->default(0);
            $table->decimal('total_debit', 12, 2)->default(0);
            $table->integer('total_transactions_count')->default(0);

            $table->enum('status', ['open', 'closed'])->default('open');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cash_shifts');
    }
};
