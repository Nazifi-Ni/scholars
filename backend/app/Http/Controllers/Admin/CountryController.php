<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Country;

class CountryController extends Controller
{
    public function index()
    {
        return response()->json(Country::orderBy('name')->get());
    }

    public function toggleFeatured(Country $country)
    {
        $country->is_featured = !$country->is_featured;
        $country->save();
        return response()->json($country);
    }
}
