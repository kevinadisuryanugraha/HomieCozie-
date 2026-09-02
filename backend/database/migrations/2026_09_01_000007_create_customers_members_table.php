<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers_members', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone')->unique(); // 081298765432
            $table->string('email')->nullable();
            $table->enum('tier', ['Silver Cozie', 'Gold Cozie', 'Platinum Cozie'])->default('Silver Cozie');
            $table->integer('cozie_points')->default(0);
            $table->integer('stamps_count')->default(0); // 0-10
            $table->integer('total_visits')->default(0);
            $table->decimal('lifetime_spend', 14, 2)->default(0);
            $table->json('favorite_items')->nullable();
            $table->json('tags')->nullable();
            $table->date('birthday')->nullable();
            $table->timestamp('last_visit_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customers_members');
    }
};
