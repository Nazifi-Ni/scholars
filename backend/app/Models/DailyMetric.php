<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyMetric extends Model
{
    protected $fillable = ['date', 'views_count', 'visitors_count'];
    
    protected $casts = [
        'date' => 'date',
    ];
}
