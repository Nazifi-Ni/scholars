<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        $this->call(UsersTableSeeder::class);
        $this->call(ProfilesTableSeeder::class);
        $this->call(UserRolesTableSeeder::class);
        $this->call(CategoriesTableSeeder::class);
        $this->call(CountriesTableSeeder::class);
        $this->call(UniversitiesTableSeeder::class);
        $this->call(OrganizationsTableSeeder::class);
        $this->call(OpportunitiesTableSeeder::class);
        $this->call(OpportunityImagesTableSeeder::class);
        $this->call(BookmarksTableSeeder::class);
        $this->call(ApplicationsTableSeeder::class);
        $this->call(NotificationsTableSeeder::class);
        $this->call(NewsletterSubscribersTableSeeder::class);
        $this->call(TestimonialsTableSeeder::class);
        $this->call(FaqsTableSeeder::class);
        $this->call(BlogPostsTableSeeder::class);
        $this->call(BlogCommentsTableSeeder::class);
        $this->call(SiteSettingsTableSeeder::class);
    }
}
