<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class CategoriesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('categories')->delete();
        
        \DB::table('categories')->insert(array (
            0 => 
            array (
                'id' => 1,
                'name' => 'Scholarships in USA',
                'slug' => '#',
                'icon' => NULL,
                'description' => 'Explore this Full List of Ongoing Scholarships in USA. These Scholarships offers Full Funding, monetary stipends, accommodation and many more benefits to International Students.

Scholarships in USA are sponsored by the United States Government, Organizations as well as Universities such as Universities in Washington, New York, California, Ottawa, Texas and many more. This page gets live updates of Scholarships in Africa, so save the link and always come to check for updates.',
                'sort_order' => 0,
                'created_at' => '2026-07-12 17:53:16',
                'updated_at' => '2026-07-12 17:53:16',
            ),
            1 => 
            array (
                'id' => 2,
                'name' => 'Study in saudi',
                'slug' => 'www.kingfahd.com',
                'icon' => NULL,
                'description' => 'Study In saudi Arabia',
                'sort_order' => 1,
                'created_at' => '2026-07-13 21:08:26',
                'updated_at' => '2026-07-13 21:08:26',
            ),
        ));
        
        
    }
}