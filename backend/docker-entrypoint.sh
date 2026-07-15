#!/bin/bash

echo "Starting deployment setup..."

# Run migrations. Since this runs on every boot, we use --force for production.
echo "Running database migrations..."
php artisan migrate --force

# Create the storage link
echo "Creating storage link..."
php artisan storage:link

# Clear and cache configurations
echo "Caching configuration and routes..."
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Setup complete. Starting Apache..."

# Execute the main container command (apache2-foreground)
exec "$@"
