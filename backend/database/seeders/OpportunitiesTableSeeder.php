<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class OpportunitiesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('opportunities')->delete();
        
        \DB::table('opportunities')->insert(array (
            0 => 
            array (
                'id' => 3,
                'title' => 'King Fahad Scholarshi[pp',
                'slug' => 'kingfahd_schol',
                'summary' => 'This scholarship This scholarship This scholarship This scholarship This scholarship This scholarship This scholarshipThis scholarship This scholarship',
                'category_id' => NULL,
                'opportunity_type' => 'scholarship',
                'country_id' => NULL,
                'university_id' => NULL,
                'organization_id' => NULL,
                'funding_type' => 'fully_funded',
                'degree_levels' => '["Phd","Masters"]',
                'eligible_countries' => NULL,
                'deadline' => '2026-08-14 00:00:00',
                'benefits' => '-This scholarship222
- This scholarship444',
                'eligibility' => '-This scholarshipThis scholarship
- This scholarshipThis scholarship',
                'required_documents' => '* This scholarship8888
* This scholarship9999',
                'application_procedure' => 'This scholarshipThis scholarship
This scholarship',
                'official_website' => 'https://www.mecca.com',
                'application_link' => 'https://www.saudi.com',
                'contact_email' => NULL,
                'featured_image' => '/storage/opportunities/QiFTgFExMd5aBCKcX6Srj6QRCVhoNNU6tmIdQqFA.png',
                'is_verified' => 0,
                'is_featured' => 1,
                'views_count' => 8,
                'bookmarks_count' => 0,
                'shares_count' => 0,
                'difficulty_rating' => NULL,
                'scholar_rating' => NULL,
                'status' => 'published',
                'meta_title' => NULL,
                'meta_description' => NULL,
                'created_at' => '2026-07-13 21:06:43',
                'updated_at' => '2026-07-14 10:32:43',
            ),
        ));
        
        
    }
}