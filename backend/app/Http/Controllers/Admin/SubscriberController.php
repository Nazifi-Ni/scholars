<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;

class SubscriberController extends Controller
{
    public function index()
    {
        return response()->json(NewsletterSubscriber::orderBy('created_at', 'desc')->get());
    }
}
