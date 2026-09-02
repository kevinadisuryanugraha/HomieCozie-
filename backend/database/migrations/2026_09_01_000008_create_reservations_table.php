<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->string('booking_code')->unique(); // e.g. '#HC-942182'
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('customer_email')->nullable();
            $table->integer('guest_count')->default(2);
            $table->date('reservation_date');
            $table->string('time_slot'); // '19:30'
            $table->enum('area_preference', ['indoor', 'stage', 'garden', 'mezzanine'])->default('indoor');
            $table->foreignId('table_id')->nullable()->constrained('tables')->nullOnDelete();
            $table->string('table_number')->nullable();
            $table->string('special_occasion')->nullable(); // 'birthday', 'anniversary', 'gathering', 'community', 'casual', 'meeting'
            $table->text('notes')->nullable();
            $table->enum('status', ['pending', 'confirmed', 'seated', 'completed', 'cancelled'])->default('confirmed');
            $table->boolean('wa_confirmed')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
