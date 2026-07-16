<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BlogPost;
use Cloudinary\Cloudinary;

class BlogController extends Controller
{
    public function index()
    {
        return response()->json(BlogPost::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:blog_posts',
            'excerpt' => 'nullable|string',
            'content' => 'nullable|string',
            'category' => 'nullable|string',
            'tags' => 'nullable|array',
            'reading_minutes' => 'integer',
            'status' => 'required|in:draft,published,archived,closed',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
        ]);
        
        if ($request->hasFile('image')) {
            if (env('CLOUDINARY_URL')) {
                try {
                    $cloudinary = new Cloudinary(env('CLOUDINARY_URL'));
                    $uploadResult = $cloudinary->uploadApi()->upload($request->file('image')->getRealPath(), [
                        'folder' => 'scholarsconnect/blogs'
                    ]);
                    $validated['featured_image'] = $uploadResult['secure_url'];
                } catch (\Exception $e) {
                    $path = $request->file('image')->store('blogs', 'public');
                    $validated['featured_image'] = '/storage/' . $path;
                }
            } else {
                $path = $request->file('image')->store('blogs', 'public');
                $validated['featured_image'] = '/storage/' . $path;
            }
        }

        $validated['tags'] = $validated['tags'] ?? [];

        $post = BlogPost::create($validated);
        return response()->json($post, 201);
    }

    public function show($id)
    {
        $post = BlogPost::findOrFail($id);
        return response()->json($post);
    }

    public function update(Request $request, $id)
    {
        $post = BlogPost::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:blog_posts,slug,' . $post->id,
            'excerpt' => 'nullable|string',
            'content' => 'nullable|string',
            'category' => 'nullable|string',
            'tags' => 'nullable|array',
            'reading_minutes' => 'integer',
            'status' => 'required|in:draft,published,archived,closed',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
        ]);
        
        if ($request->hasFile('image')) {
            if (env('CLOUDINARY_URL')) {
                try {
                    $cloudinary = new Cloudinary(env('CLOUDINARY_URL'));
                    $uploadResult = $cloudinary->uploadApi()->upload($request->file('image')->getRealPath(), [
                        'folder' => 'scholarsconnect/blogs'
                    ]);
                    $validated['featured_image'] = $uploadResult['secure_url'];
                } catch (\Exception $e) {
                    $path = $request->file('image')->store('blogs', 'public');
                    $validated['featured_image'] = '/storage/' . $path;
                }
            } else {
                $path = $request->file('image')->store('blogs', 'public');
                $validated['featured_image'] = '/storage/' . $path;
            }
        }

        $validated['tags'] = $validated['tags'] ?? [];

        $post->update($validated);
        return response()->json($post);
    }

    public function destroy($id)
    {
        $post = BlogPost::findOrFail($id);
        $post->delete();
        return response()->json(null, 204);
    }
}
