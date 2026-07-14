<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::updateOrCreate(
            ['email' => 'nazifiibrahimni5@gmail.com'],
            [
                'name' => 'Nazifi Ibrahim',
                'password' => Hash::make('password'),
            ]
        );

        UserRole::updateOrCreate(
            ['user_id' => $user->id, 'role' => 'admin'],
            ['role' => 'admin']
        );
    }
}
