<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Opportunity;
use App\Models\Category;
use App\Models\Country;
use App\Models\University;
use App\Models\Testimonial;
use App\Models\Faq;
use App\Models\SiteSetting;

class PublicDataController extends Controller
{
    public function home()
    {
        $featured = Opportunity::with(['country', 'university', 'organization'])
            ->where('status', 'published')
            ->where('is_featured', true)
            ->orderBy('created_at', 'desc')
            ->take(6)
            ->get();

        $latest = Opportunity::with(['country', 'university', 'organization'])
            ->where('status', 'published')
            ->orderBy('created_at', 'desc')
            ->take(6)
            ->get();

        $trending = Opportunity::with(['country', 'university', 'organization'])
            ->where('status', 'published')
            ->orderBy('views_count', 'desc')
            ->take(6)
            ->get();

        $closingSoon = Opportunity::with(['country', 'university', 'organization'])
            ->where('status', 'published')
            ->where('deadline', '>=', now())
            ->orderBy('deadline', 'asc')
            ->take(4)
            ->get();

        $categories = Category::orderBy('sort_order')->get();
        $countries = Country::orderBy('name')->get();
        $universities = University::with('country')->orderBy('world_ranking', 'asc')->take(8)->get();
        
        $testimonials = Testimonial::where('is_published', true)->orderBy('sort_order')->take(4)->get();
        $faqs = Faq::where('is_published', true)->orderBy('sort_order')->take(6)->get();
        
        $settings = SiteSetting::all()->pluck('value', 'key')->toArray();

        return response()->json([
            'featured' => $featured,
            'latest' => $latest,
            'trending' => $trending,
            'closingSoon' => $closingSoon,
            'categories' => $categories,
            'countries' => $countries,
            'universities' => $universities,
            'testimonials' => $testimonials,
            'faqs' => $faqs,
            'settings' => $settings,
        ]);
    }

    public function filters()
    {
        return response()->json([
            'categories' => Category::orderBy('sort_order')->get(),
            'countries' => Country::orderBy('name')->get(),
        ]);
    }
}
