<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BlogPost;

class BlogController extends Controller
{
    public function index()
    {
        $posts = BlogPost::where('status', 'published')
            ->orderBy('published_at', 'desc')
            ->get();

        return response()->json([
            'posts' => $posts
        ]);
    }

    public function show($slug)
    {
        $post = BlogPost::where('slug', $slug)
            ->where('status', 'published')
            ->with(['comments' => function ($query) {
                $query->orderBy('created_at', 'desc');
            }])
            ->first();

        if (!$post) {
            return response()->json(['post' => null, 'related' => []], 404);
        }

        $related = BlogPost::select('title', 'slug', 'excerpt', 'category', 'reading_minutes', 'published_at')
            ->where('status', 'published')
            ->where('slug', '!=', $slug)
            ->take(3)
            ->get();

        return response()->json([
            'post' => $post,
            'related' => $related
        ]);
    }

    public function storeComment(Request $request, $slug)
    {
        $post = BlogPost::where('slug', $slug)->where('status', 'published')->firstOrFail();
        
        $data = $request->validate([
            'author_name' => 'required|string|max:100',
            'content' => 'required|string|max:1000'
        ]);

        $comment = $post->comments()->create($data);

        return response()->json(['comment' => $comment], 201);
    }
}
