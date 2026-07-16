<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->bootstrap();
echo json_encode(\App\Models\DailyMetric::all());
echo "\n";
echo "Total Opportunity Views: " . \App\Models\Opportunity::sum('views_count') . "\n";
