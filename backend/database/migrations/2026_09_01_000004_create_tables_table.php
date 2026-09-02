<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tables', function (Blueprint $table) {
            $table->id();
            $table->string('table_number')->unique(); // '01', '02', '06', 'T-01'
            $table->string('name'); // 'Meja 01 - Meja Bar Utama'
            $table->enum('area', ['indoor', 'stage', 'garden', 'mezzanine'])->default('indoor');
            $table->string('area_label')->default('Indoor AC Utama');
            $table->integer('capacity')->default(4);
            $table->enum('status', ['available', 'reserved', 'occupied', 'billing', 'cleaning'])->default('available');
            $table->unsignedBigInteger('current_order_id')->nullable();
            $table->string('current_customer')->nullable();
            $table->string('occupied_since')->nullable();
            $table->string('reserved_for_time')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tables');
    }
};
