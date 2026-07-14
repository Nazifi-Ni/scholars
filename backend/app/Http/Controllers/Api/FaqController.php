<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faq;

class FaqController extends Controller
{
    public function index()
    {
        $faqs = Faq::select('question', 'answer')
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'faqs' => $faqs
        ]);
    }
}
