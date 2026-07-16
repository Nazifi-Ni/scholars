<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Opportunity;
use Cloudinary\Cloudinary;

class OpportunityController extends Controller
{
    public function index()
    {
        return response()->json(Opportunity::with('category', 'country')->latest()->get());
    }

    private function handleJsonInput($input)
    {
        if (is_string($input)) {
            $decoded = json_decode($input, true);
            return is_array($decoded) ? $decoded : [];
        }
        return is_array($input) ? $input : [];
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'title' => 'required|string|max:255',
                'slug' => 'required|string|unique:opportunities,slug',
                'summary' => 'nullable|string',
                'eligibility' => 'nullable|string',
                'benefits' => 'nullable|string',
                'category_id' => 'nullable|exists:categories,id',
                'country_id' => 'nullable|exists:countries,id',
                'opportunity_type' => 'required|string',
                'funding_type' => 'required|string',
                'degree_levels' => 'required', // Can be string or array
                'eligible_countries' => 'nullable', // Can be string or array
                'deadline' => 'nullable|date',
                'status' => 'required|string',
                'is_featured' => 'boolean',
                'image' => 'nullable|image|max:2048', // 2MB Max
                'application_link' => 'nullable|url',
                'official_website' => 'nullable|url',
                'required_documents' => 'nullable|string',
                'application_procedure' => 'nullable|string'
            ]);

            $data['degree_levels'] = $this->handleJsonInput($data['degree_levels']);
            if (isset($data['eligible_countries'])) {
                $data['eligible_countries'] = $this->handleJsonInput($data['eligible_countries']);
            }
            $data['is_featured'] = filter_var($request->input('is_featured', false), FILTER_VALIDATE_BOOLEAN);

            if ($request->hasFile('image')) {
                if (env('CLOUDINARY_URL')) {
                    $cloudinary = new Cloudinary(env('CLOUDINARY_URL'));
                    $uploadResult = $cloudinary->uploadApi()->upload($request->file('image')->getRealPath(), [
                        'folder' => 'scholarsconnect/opportunities'
                    ]);
                    $data['featured_image'] = $uploadResult['secure_url'];
                } else {
                    $path = $request->file('image')->store('opportunities', 'public');
                    $data['featured_image'] = '/storage/' . $path;
                }
                unset($data['image']);
            }

            $opportunity = Opportunity::create($data);
            return response()->json($opportunity, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation error', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Exception: ' . $e->getMessage() . ' at ' . basename($e->getFile()) . ':' . $e->getLine()], 500);
        }
    }

    public function show($id)
    {
        return response()->json(Opportunity::with('category', 'country')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $opportunity = Opportunity::findOrFail($id);
        
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|unique:opportunities,slug,'.$id,
            'summary' => 'nullable|string',
            'eligibility' => 'nullable|string',
            'benefits' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'country_id' => 'nullable|exists:countries,id',
            'opportunity_type' => 'required|string',
            'funding_type' => 'required|string',
            'degree_levels' => 'required',
            'eligible_countries' => 'nullable',
            'deadline' => 'nullable|date',
            'status' => 'required|string',
            'is_featured' => 'boolean',
            'image' => 'nullable|image|max:2048',
            'application_link' => 'nullable|url',
            'official_website' => 'nullable|url',
            'required_documents' => 'nullable|string',
            'application_procedure' => 'nullable|string'
        ]);

        $data['degree_levels'] = $this->handleJsonInput($data['degree_levels']);
        if (isset($data['eligible_countries'])) {
            $data['eligible_countries'] = $this->handleJsonInput($data['eligible_countries']);
        }
        $data['is_featured'] = filter_var($request->input('is_featured', false), FILTER_VALIDATE_BOOLEAN);

        if ($request->hasFile('image')) {
            if (env('CLOUDINARY_URL')) {
                $cloudinary = new Cloudinary(env('CLOUDINARY_URL'));
                $uploadResult = $cloudinary->uploadApi()->upload($request->file('image')->getRealPath(), [
                    'folder' => 'scholarsconnect/opportunities'
                ]);
                $data['featured_image'] = $uploadResult['secure_url'];
            } else {
                $path = $request->file('image')->store('opportunities', 'public');
                $data['featured_image'] = '/storage/' . $path;
            }
            unset($data['image']);
        }

        $opportunity->update($data);
        return response()->json($opportunity);
    }

    public function destroy($id)
    {
        Opportunity::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
