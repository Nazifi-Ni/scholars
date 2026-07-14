<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Opportunity;
use App\Models\User;
use App\Models\Category;
use App\Models\BlogPost;

class StatsController extends Controller
{
    public function index()
    {
        return response()->json([
            'opportunities_count' => Opportunity::count(),
            'users_count' => User::count(),
            'categories_count' => Category::count(),
            'blogs_count' => BlogPost::count(),
            'total_views' => Opportunity::sum('views_count'),
            'popular_opportunities' => Opportunity::orderBy('views_count', 'desc')->take(5)->get(['id', 'title', 'views_count', 'status'])
        ]);
    }
}
