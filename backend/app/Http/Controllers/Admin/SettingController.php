<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SettingController extends Controller
{
    /**
     * Get all site settings
     */
    public function index()
    {
        $settings = DB::table('site_settings')->pluck('value', 'key');
        return response()->json($settings);
    }

    /**
     * Save/Update site settings
     */
    public function store(Request $request)
    {
        $data = $request->all();

        foreach ($data as $key => $value) {
            DB::table('site_settings')->updateOrInsert(
                ['key' => $key],
                ['value' => $value, 'updated_at' => now()]
            );
        }

        return response()->json(['message' => 'Settings saved successfully']);
    }
}
