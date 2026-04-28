#!/bin/sh
set -e

if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL nao definida. Configure em variaveis de ambiente do servico."
  exit 1
fi

echo "Applying database migrations..."
npm run db:migrate:deploy

echo "Starting backend..."
node dist/main.js
