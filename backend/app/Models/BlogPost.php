<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'featured_image',
        'category',
        'tags',
        'reading_minutes',
        'status',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'published_at',
    ];

    protected $casts = [
        'tags' => 'array',
        'published_at' => 'datetime',
    ];

    public function comments()
    {
        return $this->hasMany(BlogComment::class, 'blog_post_id');
    }

    public function getFeaturedImageAttribute($value)
    {
        if ($value && !str_starts_with($value, 'http')) {
            return rtrim(config('app.url'), '/') . $value;
        }
        return $value;
    }

    public function getReadingMinutesAttribute($value)
    {
        $text = $this->content ?: $this->excerpt ?: '';
        $clean = preg_replace('/!\[.*?\]\(.*?\)/', '', $text);
        $clean = preg_replace('/\[(.*?)\]\(.*?\)/', '$1', $clean);
        $clean = preg_replace('/```[\s\S]*?```/', '', $clean);
        $clean = strip_tags($clean);
        $clean = preg_replace('/[#*`_~>-]/', ' ', $clean);
        $words = str_word_count(trim($clean));
        return max(1, (int) ceil($words / 220));
    }
}
