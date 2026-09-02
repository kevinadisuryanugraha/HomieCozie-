<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Create Outlets Table
        Schema::create('outlets', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // e.g. HC-JKT-01
            $table->string('name'); // e.g. Homie Cozie Kalisari (Flagship)
            $table->string('address');
            $table->string('city')->default('Jakarta Timur');
            $table->string('phone')->nullable();
            $table->boolean('is_main_branch')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. Add outlet_id foreign keys to core operational tables
        $tablesToUpdate = ['users', 'tables', 'orders', 'inventory_items', 'reservations', 'cash_shifts'];
        foreach ($tablesToUpdate as $tbl) {
            if (Schema::hasTable($tbl) && !Schema::hasColumn($tbl, 'outlet_id')) {
                Schema::table($tbl, function (Blueprint $table) {
                    $table->foreignId('outlet_id')->nullable()->after('id')->constrained('outlets')->nullOnDelete();
                });
            }
        }
    }

    public function down(): void
    {
        $tablesToUpdate = ['users', 'tables', 'orders', 'inventory_items', 'reservations', 'cash_shifts'];
        foreach ($tablesToUpdate as $tbl) {
            if (Schema::hasTable($tbl) && Schema::hasColumn($tbl, 'outlet_id')) {
                Schema::table($tbl, function (Blueprint $table) {
                    $table->dropForeign(['outlet_id']);
                    $table->dropColumn('outlet_id');
                });
            }
        }
        Schema::dropIfExists('outlets');
    }
};
