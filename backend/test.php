<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$request = Illuminate\Http\Request::create(
    '/api/admin/opportunities', 'POST',
    [
        'title' => 'Test Opp',
        'slug' => 'test-opp',
        'opportunity_type' => 'scholarship',
        'funding_type' => 'fully_funded',
        'degree_levels' => '["Bachelors"]',
        'status' => 'published'
    ]
);

$response = $kernel->handle($request);
echo "Status: " . $response->getStatusCode() . "\n";
echo "Content: " . $response->getContent() . "\n";
