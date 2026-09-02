<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique(); // e.g. 'HC-9421'
            $table->enum('order_type', ['dine-in', 'takeaway'])->default('dine-in');
            $table->foreignId('table_id')->nullable()->constrained('tables')->nullOnDelete();
            $table->string('table_number')->nullable();
            $table->string('customer_name');
            $table->string('customer_phone')->nullable();
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('discount', 12, 2)->default(0);
            $table->decimal('dpp', 12, 2)->default(0); // Dasar Pengenaan Pajak
            $table->decimal('tax_pb1', 12, 2)->default(0); // PB1 10%
            $table->decimal('service_charge', 12, 2)->default(0); // 5%
            $table->decimal('total', 12, 2)->default(0);
            $table->enum('payment_method', ['qris', 'cash', 'debit', 'gopay_shopee'])->default('qris');
            $table->enum('payment_status', ['unpaid', 'paid'])->default('unpaid');
            $table->enum('status', ['pending', 'preparing', 'ready', 'served', 'completed', 'paid', 'cancelled'])->default('pending');
            $table->foreignId('cashier_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamp('estimated_ready_time')->nullable();
            $table->timestamps();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('menu_item_id')->constrained('menu_items')->onDelete('cascade');
            $table->string('item_name');
            $table->decimal('unit_price', 12, 2);
            $table->integer('quantity')->default(1);
            $table->decimal('subtotal', 12, 2);
            $table->json('selected_options')->nullable(); // sugar, ice, bean, milk, spiciness
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
