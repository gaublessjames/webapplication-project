#!/usr/bin/env python3
"""
Database migration runner for Café Fausse Flask API
"""

import os
import sys
import subprocess
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def run_migration_command(command, description):
    """
    Run a migration command and handle errors
    """
    print(f"\n🔄 {description}...")
    print(f"   Running: {command}")
    
    try:
        result = subprocess.run(
            command,
            shell=True,
            check=True,
            capture_output=True,
            text=True,
            cwd=os.path.dirname(os.path.abspath(__file__))
        )
        print(f"✅ {description} completed successfully")
        if result.stdout.strip():
            print(f"   Output: {result.stdout.strip()}")
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed")
        print(f"   Error: {e.stderr.strip()}")
        return False, e.stderr

def main():
    """
    Main migration sequence
    """
    print("=" * 50)
    print("🗄️  Database Migration Runner")
    print("=" * 50)
    
    # Get the path to the virtual environment's executables
    python_executable = sys.executable
    # venv_bin_dir = os.path.dirname(python_executable)
    # flask_executable = os.path.join(venv_bin_dir, 'flask')

    # Check environment
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        print("❌ DATABASE_URL not found in environment variables")
        print("   Please set DATABASE_URL in your .env file")
        return False
    
    print(f"✅ Database URL configured")
    
    # Set Flask app environment variable
    os.environ['FLASK_APP'] = 'app.py'
    
    # Step 1: Check current migration status
    print("\n📊 Checking current migration status...")
    status_success, status_output = run_migration_command(
        f"{python_executable} -m flask db current",
        "Checking current migration version"
    )
    
    if not status_success:
        # Try alternative approach
        status_success, status_output = run_migration_command(
            f"{python_executable} -m flask db current",
            "Checking current migration version (alternative)"
        )
    
    # Step 2: Run migrations
    print("\n🚀 Running database migrations...")
    migration_success, migration_output = run_migration_command(
        f"{python_executable} -m flask db upgrade",
        "Running database migrations"
    )
    
    if not migration_success:
        # Try alternative approach
        migration_success, migration_output = run_migration_command(
            f"{python_executable} -m flask db upgrade",
            "Running database migrations (alternative)"
        )
    
    if migration_success:
        print("\n🎉 Database migrations completed successfully!")
        
        # Step 3: Show final status
        print("\n📊 Final migration status:")
        final_success, final_output = run_migration_command(
            f"{python_executable} -m flask db current",
            "Checking final migration version"
        )
        
        return True
    else:
        print("\n❌ Database migrations failed")
        print("   Please check your database configuration and permissions")
        return False

if __name__ == "__main__":
    try:
        success = main()
        if not success:
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n\n🛑 Migration process interrupted by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Unexpected error during migration: {e}")
        sys.exit(1)