#!/usr/bin/env python3
"""
Comprehensive startup script for Café Fausse Flask API
Handles database connection checking, migrations, and application startup
"""

import os
import sys
import subprocess
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def run_command(command, description):
    """
    Run a shell command and handle errors
    """
    print(f"\n🔄 {description}...")
    print(f"   Running: {command}")
    
    try:
        result = subprocess.run(
            command,
            shell=True,
            check=True,
            capture_output=True,
            text=True
        )
        print(f"✅ {description} completed successfully")
        if result.stdout.strip():
            print(f"   Output: {result.stdout.strip()}")
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed")
        print(f"   Error: {e.stderr.strip()}")
        return False, e.stderr

def check_database_connection():
    """
    Run the database connection checker
    """
    return run_command(
        "python database_check.py",
        "Checking database connection"
    )

def run_migrations():
    """
    Run database migrations
    """
    # First, check if we're in a Flask app context
    flask_app = os.getenv('FLASK_APP', 'app.py')
    
    # Run migrations
    success, output = run_command(
        f"flask db upgrade",
        "Running database migrations"
    )
    
    if not success:
        # Try alternative approach if flask command fails
        print("   Trying alternative migration approach...")
        success, output = run_command(
            f"python -m flask db upgrade",
            "Running database migrations (alternative)"
        )
    
    return success, output

def initialize_database():
    """
    Initialize database with sample data
    """
    return run_command(
        "python database.py",
        "Initializing database with sample data"
    )

def start_application():
    """
    Start the Flask application
    """
    print("\n🚀 Starting Café Fausse API Server...")
    print("=" * 50)
    
    # Set environment variables if not already set
    if not os.getenv('FLASK_ENV'):
        os.environ['FLASK_ENV'] = 'development'
    
    # Start the application
    try:
        subprocess.run([
            sys.executable, "run.py"
        ], check=True)
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Failed to start application: {e}")
        return False
    
    return True

def main():
    """
    Main startup sequence
    """
    print("=" * 60)
    print("🏪 Café Fausse API - Startup Sequence")
    print("=" * 60)
    
    # Step 1: Check environment
    print("\n📋 Environment Check:")
    flask_env = os.getenv('FLASK_ENV', 'development')
    database_url = os.getenv('DATABASE_URL')
    
    print(f"   Environment: {flask_env}")
    print(f"   Database URL: {'✅ Set' if database_url else '❌ Not set'}")
    
    if not database_url:
        print("\n❌ DATABASE_URL not found in environment variables")
        print("   Please create a .env file with your database configuration")
        print("   See env.example for reference")
        return False
    
    # Step 2: Check database connection
    db_connected, db_output = check_database_connection()
    if not db_connected:
        print("\n❌ Database connection failed")
        print("   Please fix database configuration before continuing")
        return False
    
    # Step 3: Run migrations
    migrations_success, migrations_output = run_migrations()
    if not migrations_success:
        print("\n❌ Database migrations failed")
        print("   Please check database permissions and try again")
        return False
    
    # Step 4: Initialize database (optional - only if no data exists)
    print("\n📊 Checking if database needs initialization...")
    init_success, init_output = initialize_database()
    if init_success:
        print("   Database initialized with sample data")
    else:
        print("   Database already contains data (or initialization failed)")
    
    # Step 5: Start application
    print("\n" + "=" * 60)
    print("🎉 All checks passed! Starting application...")
    print("=" * 60)
    
    return start_application()

if __name__ == "__main__":
    try:
        success = main()
        if not success:
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n\n🛑 Startup interrupted by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Unexpected error during startup: {e}")
        sys.exit(1) 