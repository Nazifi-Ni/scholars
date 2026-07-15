<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class BlogPostsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('blog_posts')->delete();
        
        \DB::table('blog_posts')->insert(array (
            0 => 
            array (
                'id' => 1,
            'title' => 'UK Universities That Accept International Students Without IELTS (2026)',
                'slug' => '#',
            'excerpt' => 'UK Universities That Accept International Students Without IELTS (2026)UK Universities That Accept International Students Without IELTS (2026)UK Universities That Accept International Students Without IELTS (2026)',
                'content' => 'Learning does not have to be a struggle. With SmartBukites, get access to the right tools, resources, and learn from the best. Boost your academic journey by 99.9%. Learning does not have to be a struggle. With SmartBukites, get access to the right tools, resources, and learn from the best. Boost your academic journey by 99.9%.Learning does not have to be a struggle. With SmartBukites, get access to the right tools, resources, and learn from the best. Boost your academic journey by 99.9%.',
                'featured_image' => '/storage/blogs/vEtrBP18i4km2f8tP8XBd5LmfbjVPbAbmiqKcx9g.png',
                'category' => 'school',
                'tags' => '["scholarships","google"]',
                'reading_minutes' => 10,
                'status' => 'published',
                'meta_title' => NULL,
                'meta_description' => NULL,
                'published_at' => '2026-07-12 18:55:36',
                'created_at' => '2026-07-12 17:55:36',
                'updated_at' => '2026-07-12 21:07:07',
            ),
        ));
        
        
    }
}