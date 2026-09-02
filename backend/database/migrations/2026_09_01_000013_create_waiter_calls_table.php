<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('waiter_calls', function (Blueprint $table) {
            $table->id();
            $table->string('table_number');
            $table->enum('call_type', ['call_waiter', 'request_bill', 'water_refill', 'clean_table'])->default('call_waiter');
            $table->string('call_type_label')->default('Panggil Pelayan');
            $table->enum('status', ['pending', 'acknowledged', 'resolved'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('waiter_calls');
    }
};
