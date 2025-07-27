#!/usr/bin/env python3
"""
Local database setup script for Café Fausse
Runs outside Docker with proper environment configuration
"""

import os
import sys

# Set up environment variables for local development
os.environ.setdefault('FLASK_ENV', 'development')
os.environ.setdefault('SECRET_KEY', 'cafe-fausse-secret-key-2024-dev')
os.environ.setdefault('DEBUG', 'True')
os.environ.setdefault('DATABASE_URL', 'postgresql://cafe_fausse_user:cafe_fausse_pass@localhost:5434/cafe_fausse_3')

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import and run the robust setup
from setup_database_robust import setup_database_robust

if __name__ == "__main__":
    print("🚀 Running local database setup...")
    print("Make sure PostgreSQL is running on localhost:5434")
    print("Database: cafe_fausse_3")
    print("User: cafe_fausse_user")
    print("Password: cafe_fausse_pass")
    print("=" * 50)
    
    try:
        success = setup_database_robust()
        if success:
            print("\n🎉 Local database setup completed successfully!")
            sys.exit(0)
        else:
            print("\n❌ Local database setup failed!")
            sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error during local setup: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1) 