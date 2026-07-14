<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\NewsletterSubscriber;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255'
        ]);

        NewsletterSubscriber::firstOrCreate(['email' => $request->email]);

        return response()->json(['message' => 'Subscribed successfully']);
    }
}
