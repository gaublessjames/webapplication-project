#!/bin/sh
set -e

# Wait for Postgres to be ready
until pg_isready -h db -p 5432 -U cafe_fausse_user; do
  echo "Waiting for postgres..."
  sleep 2
done

# Run robust database setup
echo "Setting up database..."
/venv/bin/python setup_database_robust.py

# Start Gunicorn
exec /venv/bin/gunicorn -w 4 -b 0.0.0.0:5000 "app:create_app()" 