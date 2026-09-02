<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recipes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menu_item_id')->constrained('menu_items')->onDelete('cascade');
            $table->string('recipe_code')->nullable();
            $table->decimal('total_hpp', 12, 2)->default(0); // Cost of Goods Sold in IDR
            $table->decimal('gross_margin_pct', 5, 2)->default(0); // Gross margin %
            $table->text('preparation_notes')->nullable();
            $table->timestamps();
        });

        Schema::create('recipe_ingredients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recipe_id')->constrained('recipes')->onDelete('cascade');
            $table->foreignId('inventory_item_id')->nullable()->constrained('inventory_items')->nullOnDelete();
            $table->string('ingredient_name');
            $table->decimal('quantity', 10, 3); // e.g. 18 for grams, 120 for ml
            $table->string('unit'); // 'gram', 'ml', 'pcs', 'porsi', 'scoop'
            $table->decimal('cost_per_unit', 12, 2)->default(0);
            $table->decimal('subtotal_cost', 12, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recipe_ingredients');
        Schema::dropIfExists('recipes');
    }
};
