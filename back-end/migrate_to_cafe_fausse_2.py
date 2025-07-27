#!/usr/bin/env python3
"""
Migration script to help transition from cafe_fausse to cafe_fausse_2 database
"""

import os
import sys
from app import create_app
from app.extensions import db
from flask_migrate import upgrade, init, migrate

def migrate_to_cafe_fausse_2():
    """Migrate to the new cafe_fausse_2 database"""
    
    print("🔄 MIGRATING TO CAFÉ FAUSSE 2 DATABASE")
    print("=" * 50)
    
    # Check if .env exists
    if not os.path.exists('.env'):
        print("❌ .env file not found!")
        print("Please run: python setup_env.py first")
        return False
    
    # Read current DATABASE_URL
    with open('.env', 'r') as f:
        content = f.read()
        current_url = None
        for line in content.split('\n'):
            if line.startswith('DATABASE_URL='):
                current_url = line.split('=', 1)[1]
                break
    
    if not current_url:
        print("❌ DATABASE_URL not found in .env file!")
        return False
    
    print(f"📝 Current DATABASE_URL: {current_url}")
    
    # Check if URL already points to cafe_fausse_2
    if 'cafe_fausse_2' in current_url:
        print("✅ Already using cafe_fausse_2 database!")
        return True
    
    # Update DATABASE_URL to use cafe_fausse_2
    new_url = current_url.replace('cafe_fausse', 'cafe_fausse_2')
    
    print(f"🔄 Updating DATABASE_URL to: {new_url}")
    
    # Update .env file
    new_content = content.replace(current_url, new_url)
    with open('.env', 'w') as f:
        f.write(new_content)
    
    print("✅ .env file updated successfully!")
    
    # Create Flask app with new configuration
    app = create_app()
    
    with app.app_context():
        try:
            print("\n🔄 Running database migrations...")
            upgrade()
            print("✅ Database migrations completed successfully!")
            
            print("\n🔄 Setting up demo users...")
            from setup_database import setup_demo_users
            setup_demo_users()
            print("✅ Demo users created successfully!")
            
            print("\n🎉 Migration to cafe_fausse_2 completed successfully!")
            print("\n📋 Next steps:")
            print("1. Test the application: python test_api.py")
            print("2. Start the server: python run.py")
            print("3. Or use Docker: docker-compose up")
            
            return True
            
        except Exception as e:
            print(f"❌ Error during migration: {str(e)}")
            print("\n🔧 Troubleshooting:")
            print("1. Make sure your database server is running")
            print("2. Check that the database 'cafe_fausse_2' exists")
            print("3. Verify your database credentials")
            print("4. Try running: flask db upgrade")
            return False

def create_new_database():
    """Instructions for creating a new database"""
    
    print("🗄️  CREATING NEW DATABASE: cafe_fausse_2")
    print("=" * 50)
    
    print("\n📋 For Local PostgreSQL:")
    print("1. Connect to PostgreSQL:")
    print("   psql -U postgres")
    print("2. Create the database:")
    print("   CREATE DATABASE cafe_fausse_2;")
    print("3. Create a user (optional):")
    print("   CREATE USER cafe_fausse_user WITH PASSWORD 'your_password';")
    print("   GRANT ALL PRIVILEGES ON DATABASE cafe_fausse_2 TO cafe_fausse_user;")
    
    print("\n📋 For Remote Services:")
    print("1. Go to your database provider (Neon, Supabase, Railway)")
    print("2. Create a new database named 'cafe_fausse_2'")
    print("3. Update the DATABASE_URL in .env file")
    print("4. Run this script again")
    
    print("\n📋 For Docker:")
    print("The docker-compose.yml has been updated to use cafe_fausse_2")
    print("Just run: docker-compose up")
    
    print("\n🔗 Standard DATABASE_URL format:")
    print("  postgresql://username:password@host:5432/cafe_fausse_2")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--create":
        create_new_database()
    else:
        migrate_to_cafe_fausse_2() 