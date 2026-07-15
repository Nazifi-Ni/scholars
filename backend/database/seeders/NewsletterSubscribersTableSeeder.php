<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class NewsletterSubscribersTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('newsletter_subscribers')->delete();
        
        
        
    }
}