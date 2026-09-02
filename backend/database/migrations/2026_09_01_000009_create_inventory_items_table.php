<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->string('item_code')->nullable()->index(); // e.g. 'inv-1'
            $table->string('name');
            $table->string('sku')->nullable();
            $table->enum('category', ['coffee_beans', 'dairy', 'syrups', 'kitchen_meat', 'produce', 'packaging']);
            $table->decimal('current_stock', 12, 3)->default(0);
            $table->decimal('min_stock', 12, 3)->default(0);
            $table->string('unit'); // 'kg', 'liter', 'karton', 'pcs', 'gram', 'ml'
            $table->decimal('cost_per_unit', 12, 2)->default(0);
            $table->string('supplier')->nullable();
            $table->enum('status', ['optimal', 'warning', 'critical'])->default('optimal');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_items');
    }
};
