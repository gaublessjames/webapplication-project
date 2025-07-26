#!/usr/bin/env python3
"""
Database setup script for Café Fausse
"""

import os
import sys
from app import create_app
from models import db, User
import bcrypt

app = create_app()

with app.app_context():
    demo_users = [
        {"email": "demo@cafefausse.com", "full_name": "Demo User", "role": "user"},
        {"email": "admin@cafefausse.com", "full_name": "Admin User", "role": "admin"},
    ]
    password = "demo123456"
    for user_info in demo_users:
        user = User.query.filter_by(email=user_info["email"]).first()
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        if not user:
            user = User(email=user_info["email"], full_name=user_info["full_name"], role=user_info["role"])
            user.password_hash = hashed
            db.session.add(user)
        else:
            user.password_hash = hashed
    db.session.commit()
    print("Demo users ensured with password hashes.")


def setup_database():
    """Guide user through database setup"""
    
    print("🍽️  CAFÉ FAUSSE DATABASE SETUP")
    print("=" * 40)
    
    print("\n📋 STEP 1: Get a Remote PostgreSQL Database")
    print("Choose one of these free services:")
    print("   🟢 Neon (Recommended): https://neon.tech")
    print("   🟡 Supabase: https://supabase.com")
    print("   🟠 Railway: https://railway.app")
    
    print("\n📋 STEP 2: Create Database")
    print("• Sign up and create a new project")
    print("• Create a database named 'cafe_fausse_2'")
    print("• Copy the connection string")
    
    print("\n📋 STEP 3: Update .env File")
    print("Replace the DATABASE_URL in .env with your actual URL")
    
    # Check if .env exists
    if not os.path.exists('.env'):
        print("\n❌ .env file not found!")
        print("Run: python setup_env.py first")
        return
    
    # Show current DATABASE_URL
    with open('.env', 'r') as f:
        content = f.read()
        for line in content.split('\n'):
            if line.startswith('DATABASE_URL='):
                current_url = line.split('=', 1)[1]
                print(f"\n📝 Current DATABASE_URL: {current_url}")
                break
    
    print("\n🔗 EXAMPLE URL FORMATS:")
    print("Neon:")
    print("  postgresql://username:password@ep-cool-forest-123456.us-east-1.aws.neon.tech/cafe_fausse_2?sslmode=require")
    print("\nSupabase:")
    print("  postgresql://postgres:password@db.supabase.co:5432/postgres")
    print("\nLocal Development:")
    print("  postgresql://postgres:postgres@localhost:5432/cafe_fausse_2")
    
    print("\n⚠️  IMPORTANT NOTES:")
    print("• Never commit .env to version control")
    print("• Use strong passwords")
    print("• Enable SSL for production")
    
    print("\n🚀 NEXT STEPS:")
    print("1. Update DATABASE_URL in .env")
    print("2. Run: python database.py")
    print("3. Run: python run.py")
    print("4. Test: python test_api.py")

if __name__ == "__main__":
    setup_database() 