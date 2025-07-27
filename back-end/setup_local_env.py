#!/usr/bin/env python3
"""
Setup local environment for development outside Docker
"""

import os

def setup_local_env():
    """Set up environment for local development"""
    
    print("🔧 SETTING UP LOCAL ENVIRONMENT")
    print("=" * 40)
    
    # Check if .env exists
    if not os.path.exists('.env'):
        print("❌ .env file not found!")
        print("Please copy env.example to .env first:")
        print("cp env.example .env")
        return False
    
    # Read current .env
    with open('.env', 'r') as f:
        content = f.read()
    
    # Update DATABASE_URL for local development
    old_url = "postgresql://cafe_fausse_user:cafe_fausse_pass@db:5432/cafe_fausse_2"
    new_url = "postgresql://cafe_fausse_user:cafe_fausse_pass@localhost:5434/cafe_fausse_3"
    
    if old_url in content:
        content = content.replace(old_url, new_url)
        print("✅ Updated DATABASE_URL for local development")
        print(f"   From: {old_url}")
        print(f"   To:   {new_url}")
    else:
        print("⚠️  DATABASE_URL not found in expected format")
        print("   Please manually update .env with:")
        print(f"   DATABASE_URL={new_url}")
        return False
    
    # Write updated content
    with open('.env', 'w') as f:
        f.write(content)
    
    print("\n🎉 Local environment setup complete!")
    print("\n📋 Next steps:")
    print("1. Start PostgreSQL (if using Docker): docker-compose up db")
    print("2. Initialize database: python init_database.py")
    print("3. Run the API: python run.py")
    
    return True

if __name__ == "__main__":
    setup_local_env() 