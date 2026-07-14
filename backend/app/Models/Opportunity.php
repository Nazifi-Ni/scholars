<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Opportunity extends Model
{
    protected $guarded = [];

    protected $casts = [
        'degree_levels' => 'array',
        'eligible_countries' => 'array',
        'deadline' => 'datetime',
    ];

    public function category() { return $this->belongsTo(Category::class); }
    public function country() { return $this->belongsTo(Country::class); }
    public function university() { return $this->belongsTo(University::class); }
    public function organization() { return $this->belongsTo(Organization::class); }
    public function images() { return $this->hasMany(OpportunityImage::class); }
}
