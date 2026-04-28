#!/bin/sh
set -e

echo "Applying database migrations..."
npm run db:migrate:deploy

echo "Starting backend..."
node dist/main.js
