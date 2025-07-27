#!/usr/bin/env python3
"""
Script to get a working remote PostgreSQL URL for Café Fausse
"""

def get_postgres_url():
    """Provide instructions for getting a remote PostgreSQL URL"""
    
    print("🌐 REMOTE POSTGRESQL SETUP FOR CAFÉ FAUSSE")
    print("=" * 50)
    
    print("\n📋 STEP 1: Get a free PostgreSQL database")
    print("Choose one of these services:")
    print("   🟢 Neon (Recommended): https://neon.tech")
    print("   🟡 Supabase: https://supabase.com")
    print("   🟠 Railway: https://railway.app")
    
    print("\n📋 STEP 2: Create a new database")
    print("• Sign up for a free account")
    print("• Create a new PostgreSQL database")
    print("• Note down the connection details")
    
    print("\n📋 STEP 3: Update your .env file")
    print("Replace the DATABASE_URL in .env with your actual URL")
    
    print("\n🔗 EXAMPLE DATABASE_URL FORMATS:")
    print("Neon:")
    print("  postgresql://username:password@ep-cool-forest-123456.us-east-1.aws.neon.tech/cafe_fausse_2?sslmode=require")
    print("\nSupabase:")
    print("  postgresql://postgres:password@db.supabase.co:5432/postgres")
    print("\nRailway:")
    print("  postgresql://postgres:password@containers-us-west-1.railway.app:5432/railway")
    print("\nLocal Development:")
    print("  postgresql://postgres:postgres@localhost:5432/cafe_fausse_2")
    
    print("\n⚠️  IMPORTANT:")
    print("• Never commit your .env file to version control")
    print("• Use strong passwords for your database")
    print("• Enable SSL for production databases")
    
    print("\n🚀 Once you have your DATABASE_URL:")
    print("1. Update the .env file")
    print("2. Run: python database.py")
    print("3. Run: python run.py")

if __name__ == "__main__":
    get_postgres_url() 