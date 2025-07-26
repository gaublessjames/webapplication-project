#!/usr/bin/env python3
"""
Setup script to configure the .env file with remote PostgreSQL URL
"""

import os

def setup_env():
    """Create .env file with remote PostgreSQL configuration"""
    
    # Remote PostgreSQL URL (using a free service)
    # This is a sample URL - you should replace it with your actual database URL
    remote_postgres_url = "postgresql://postgres:postgres@localhost:5432/cafe_fausse_2"
    
    env_content = f"""# Flask Configuration
FLASK_ENV=development
SECRET_KEY=cafe-fausse-secret-key-2024-dev
DEBUG=True

# Database Configuration - Remote PostgreSQL
# IMPORTANT: Replace the DATABASE_URL below with your actual remote PostgreSQL URL
# You can get a free PostgreSQL database from:
# - Neon: https://neon.tech (recommended)
# - Supabase: https://supabase.com
# - Railway: https://railway.app
DATABASE_URL={remote_postgres_url}

# Email Configuration (for future newsletter functionality)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Application Configuration
RESTAURANT_NAME=Café Fausse
RESTAURANT_ADDRESS=123 Main Street, City, State 12345
RESTAURANT_PHONE=(555) 123-4567
RESTAURANT_EMAIL=info@cafefausse.com
RESTAURANT_WEBSITE=https://cafefausse.com
"""
    
    # Write to .env file
    with open('.env', 'w') as f:
        f.write(env_content)
    
    print("✅ .env file created successfully!")
    print("\n📝 IMPORTANT: You need to update the DATABASE_URL in .env with your actual remote PostgreSQL URL")
    print("\n🔗 Get a free PostgreSQL database from:")
    print("   • Neon: https://neon.tech")
    print("   • Supabase: https://supabase.com")
    print("   • Railway: https://railway.app")
    print("\n📋 Example DATABASE_URL format:")
    print("   postgresql://username:password@host:5432/cafe_fausse_2")

if __name__ == "__main__":
    setup_env() 