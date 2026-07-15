<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class BookmarksTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('bookmarks')->delete();
        
        
        
    }
}