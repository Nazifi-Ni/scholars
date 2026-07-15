<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Opportunity;
use App\Models\User;
use App\Models\Category;
use App\Models\BlogPost;
use App\Models\DailyMetric;
use App\Models\NewsletterSubscriber;
use Carbon\Carbon;

class StatsController extends Controller
{
    public function index()
    {
        // Get chart data for the last 7 days
        $chartData = collect(range(6, 0))->map(function ($daysAgo) {
            $date = Carbon::today()->subDays($daysAgo);
            $metric = DailyMetric::where('date', $date->toDateString())->first();
            return [
                'name' => $date->format('D'), // e.g., 'Mon', 'Tue'
                'views' => $metric ? $metric->views_count : 0,
            ];
        })->values();

        return response()->json([
            'opportunities_count' => Opportunity::count(),
            'users_count' => User::count(),
            'subscribers_count' => NewsletterSubscriber::count(),
            'categories_count' => Category::count(),
            'blogs_count' => BlogPost::count(),
            'total_views' => Opportunity::sum('views_count'),
            'popular_opportunities' => Opportunity::orderBy('views_count', 'desc')->take(5)->get(['id', 'title', 'views_count', 'status']),
            'chart_data' => $chartData
        ]);
    }
}
