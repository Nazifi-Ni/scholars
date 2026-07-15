<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OpportunityController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\PublicDataController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\BookmarkController;

use App\Http\Controllers\Admin\OpportunityController as AdminOpportunityController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\BlogController as AdminBlogController;
use App\Http\Controllers\Admin\FaqController as AdminFaqController;
use App\Http\Controllers\Admin\TestimonialController as AdminTestimonialController;
use App\Http\Controllers\Admin\StatsController as AdminStatsController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\SubscriberController as AdminSubscriberController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::get('/run-seeders-secret', function() {
    \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]);
    return "Seeders completed successfully!";
});

use App\Http\Controllers\Api\NewsletterController;

// Public Data
Route::get('/home', [PublicDataController::class, 'home']);
Route::get('/filters', [PublicDataController::class, 'filters']);
Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe']);

// Opportunities
Route::get('/opportunities/search', [OpportunityController::class, 'search']);
Route::get('/opportunities/{slug}', [OpportunityController::class, 'show']);

// Blog
Route::get('/blog', [BlogController::class, 'index']);
Route::get('/blog/{slug}', [BlogController::class, 'show']);
Route::post('/blog/{slug}/comments', [BlogController::class, 'storeComment']);

// FAQs
Route::get('/faqs', [FaqController::class, 'index']);

// Auth
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    
    // User Profile
    Route::get('/user', [UserController::class, 'show']);
    Route::put('/user', [UserController::class, 'update']);
    
    // Bookmarks
    Route::get('/bookmarks', [BookmarkController::class, 'index']);
    Route::post('/bookmarks/{opportunity_id}', [BookmarkController::class, 'store']);
    Route::delete('/bookmarks/{opportunity_id}', [BookmarkController::class, 'destroy']);
});

// Admin Routes
Route::middleware(['auth:sanctum', \App\Http\Middleware\IsAdmin::class])->prefix('admin')->group(function () {
    Route::get('/stats', [AdminStatsController::class, 'index']);
    Route::get('/subscribers', [AdminSubscriberController::class, 'index']);
    
    Route::apiResource('opportunities', AdminOpportunityController::class);
    Route::apiResource('categories', AdminCategoryController::class);
    Route::apiResource('blogs', AdminBlogController::class);
    Route::apiResource('faqs', AdminFaqController::class);
    Route::apiResource('testimonials', AdminTestimonialController::class);
});
