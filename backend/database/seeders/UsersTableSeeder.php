<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('users')->delete();
        
        \DB::table('users')->insert(array (
            0 => 
            array (
                'id' => 1,
                'name' => 'Nazifi Ibrahim',
                'email' => 'nazifiibrahimni5@gmail.com',
                'email_verified_at' => NULL,
                'password' => '$2y$12$SbCckcFqdNG4QhfjEO7QLOu.AWFXJ.qsW4lVbYnY3G7pTa3i45S9a',
                'remember_token' => NULL,
                'created_at' => '2026-07-11 12:54:44',
                'updated_at' => '2026-07-11 12:54:44',
            ),
        ));
        
        
    }
}