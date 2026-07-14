<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Opportunity;
use App\Models\Category;
use App\Models\Country;
use Illuminate\Support\Facades\DB;

class OpportunityController extends Controller
{
    public function search(Request $request)
    {
        $query = Opportunity::with(['category', 'country', 'university', 'organization'])
            ->where('status', 'published');

        if ($request->has('q') && !empty($request->q)) {
            $q = $request->q;
            $query->where(function ($qb) use ($q) {
                $qb->where('title', 'like', "%{$q}%")
                   ->orWhere('summary', 'like', "%{$q}%");
            });
        }

        if ($request->has('type') && !empty($request->type)) {
            $query->where('opportunity_type', $request->type);
        }

        if ($request->has('funding') && !empty($request->funding)) {
            $query->where('funding_type', $request->funding);
        }

        if ($request->has('degree') && !empty($request->degree)) {
            // MySQL json contains
            $degree = $request->degree;
            $query->whereJsonContains('degree_levels', $degree);
        }

        if ($request->has('category') && !empty($request->category)) {
            $cat = Category::where('slug', $request->category)->first();
            if ($cat) $query->where('category_id', $cat->id);
        }

        if ($request->has('country') && !empty($request->country)) {
            $country = Country::where('slug', $request->country)->first();
            if ($country) $query->where('country_id', $country->id);
        }

        $sort = $request->input('sort', 'latest');
        switch ($sort) {
            case 'deadline':
                $query->where('deadline', '>=', now())->orderBy('deadline', 'asc');
                break;
            case 'popular':
                $query->orderBy('views_count', 'desc');
                break;
            case 'featured':
                $query->orderBy('is_featured', 'desc')->orderBy('created_at', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }

        $pageSize = 12;
        $paginator = $query->paginate($pageSize);

        return response()->json([
            'items' => $paginator->items(),
            'count' => $paginator->total(),
            'page' => $paginator->currentPage() - 1, // Frontend expects 0-indexed page
            'pageSize' => $pageSize
        ]);
    }

    public function show($slug)
    {
        $opportunity = Opportunity::with(['category', 'country', 'university', 'organization', 'images'])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->first();

        if (!$opportunity) {
            return response()->json(['opportunity' => null, 'related' => [], 'images' => []], 404);
        }

        $related = Opportunity::with(['country', 'university', 'organization'])
            ->where('status', 'published')
            ->where('opportunity_type', $opportunity->opportunity_type)
            ->where('id', '!=', $opportunity->id)
            ->orderBy('views_count', 'desc')
            ->take(3)
            ->get();

        // Increment views
        $opportunity->increment('views_count');

        return response()->json([
            'opportunity' => $opportunity,
            'related' => $related,
            'images' => $opportunity->images
        ]);
    }
}
