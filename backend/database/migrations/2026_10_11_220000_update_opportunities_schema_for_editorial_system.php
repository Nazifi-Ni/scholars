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
        Schema::table('opportunities', function (Blueprint $table) {
            if (!Schema::hasColumn('opportunities', 'provider')) {
                $table->string('provider')->nullable();
            }
            if (!Schema::hasColumn('opportunities', 'application_fee')) {
                $table->string('application_fee')->nullable();
            }
            if (!Schema::hasColumn('opportunities', 'application_open_date')) {
                $table->date('application_open_date')->nullable();
            }
            if (!Schema::hasColumn('opportunities', 'verification_status')) {
                $table->string('verification_status')->default('unverified');
            }
            if (!Schema::hasColumn('opportunities', 'official_source_url')) {
                $table->string('official_source_url')->nullable();
            }
            if (!Schema::hasColumn('opportunities', 'last_verified_at')) {
                $table->timestamp('last_verified_at')->nullable();
            }
            if (!Schema::hasColumn('opportunities', 'verified_by')) {
                $table->string('verified_by')->nullable();
            }
            if (!Schema::hasColumn('opportunities', 'application_difficulty')) {
                $table->string('application_difficulty')->nullable();
            }
            if (!Schema::hasColumn('opportunities', 'best_for')) {
                $table->text('best_for')->nullable();
            }
            if (!Schema::hasColumn('opportunities', 'not_suitable_for')) {
                $table->text('not_suitable_for')->nullable();
            }
            if (!Schema::hasColumn('opportunities', 'common_mistakes')) {
                $table->text('common_mistakes')->nullable();
            }
            if (!Schema::hasColumn('opportunities', 'editorial_verdict')) {
                $table->text('editorial_verdict')->nullable();
            }
            if (!Schema::hasColumn('opportunities', 'is_sponsored')) {
                $table->boolean('is_sponsored')->default(false);
            }
            if (!Schema::hasColumn('opportunities', 'is_expired')) {
                $table->boolean('is_expired')->default(false);
            }
            if (!Schema::hasColumn('opportunities', 'focus_keyword')) {
                $table->string('focus_keyword')->nullable();
            }
        });

        // Drop rigid legacy check constraints on PostgreSQL so new types and funding models are allowed
        if (\Illuminate\Support\Facades\DB::getDriverName() === 'pgsql') {
            \Illuminate\Support\Facades\DB::statement("ALTER TABLE opportunities DROP CONSTRAINT IF EXISTS opportunities_funding_type_check;");
            \Illuminate\Support\Facades\DB::statement("ALTER TABLE opportunities DROP CONSTRAINT IF EXISTS opportunities_opportunity_type_check;");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('opportunities', function (Blueprint $table) {
            $table->dropColumn([
                'provider',
                'application_fee',
                'application_open_date',
                'verification_status',
                'official_source_url',
                'last_verified_at',
                'verified_by',
                'application_difficulty',
                'best_for',
                'not_suitable_for',
                'common_mistakes',
                'editorial_verdict',
                'is_sponsored',
                'is_expired',
                'focus_keyword',
            ]);
        });
    }
};
