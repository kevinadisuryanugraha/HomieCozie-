<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Promotional Banners Table
        Schema::create('cms_banners', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('badge_text')->nullable();
            $table->string('image_url');
            $table->string('cta_text')->default('Pesan Sekarang');
            $table->string('cta_link')->default('#menu');
            $table->boolean('is_active')->default(true);
            $table->integer('display_order')->default(1);
            $table->timestamps();
        });

        // 2. Community Events & Live Music Schedule Table
        Schema::create('cms_events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category')->default('live-music'); // live-music, cupping, workshop, gathering
            $table->string('performer_name')->nullable();
            $table->date('event_date');
            $table->string('time_slot'); // e.g. "19:30 - 22:00 WIB"
            $table->decimal('ticket_price', 12, 2)->default(0); // 0 = Free Entry
            $table->integer('quota')->default(30);
            $table->string('poster_url')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 3. Cafe Settings & Operational Info Table
        Schema::create('cafe_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('group')->default('general'); // general, schedule, wifi, social
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cafe_settings');
        Schema::dropIfExists('cms_events');
        Schema::dropIfExists('cms_banners');
    }
};
