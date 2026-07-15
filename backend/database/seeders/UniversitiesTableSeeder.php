<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class UniversitiesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('universities')->delete();
        
        
        
    }
}