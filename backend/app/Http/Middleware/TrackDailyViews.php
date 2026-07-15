<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackDailyViews
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only track GET requests that are not coming from the admin panel
        if ($request->isMethod('GET') && !$request->is('api/admin/*')) {
            $today = \Carbon\Carbon::today()->toDateString();
            
            \App\Models\DailyMetric::firstOrCreate(
                ['date' => $today],
                ['views_count' => 0, 'visitors_count' => 0]
            )->increment('views_count');
        }

        return $next($request);
    }
}
