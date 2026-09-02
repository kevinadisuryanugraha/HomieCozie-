<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->string('item_code')->nullable()->index(); // e.g. 'm-1', 'm-2'
            $table->foreignId('category_id')->constrained('menu_categories')->onDelete('cascade');
            $table->string('name');
            $table->string('slug')->nullable();
            $table->decimal('price', 12, 2);
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->boolean('is_bestseller')->default(false);
            $table->boolean('is_chef_special')->default(false);
            $table->boolean('is_chef_recommended')->default(false);
            $table->boolean('is_new')->default(false);
            $table->boolean('available')->default(true);
            $table->integer('preparation_time_minutes')->default(5);
            $table->json('tags')->nullable();
            $table->string('taste_profile')->nullable();
            $table->json('options_config')->nullable(); // sugarLevels, iceLevels, beans, milkType, spiciness
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_items');
    }
};
