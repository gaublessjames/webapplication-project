#!/usr/bin/env python3
"""
Database initialization script for Café Fausse
"""

import os
import sys
from app import create_app
from app.extensions import db
from seed_database import seed_database

def init_database():
    """Initialize the database with all tables and comprehensive demo data"""
    
    print("🗄️  INITIALIZING CAFÉ FAUSSE DATABASE")
    print("=" * 50)
    
    # Create Flask app
    app = create_app()
    
    with app.app_context():
        try:
            print("🔄 Creating database tables...")
            
            # Check if tables already exist
            try:
                # Try to query a table to see if it exists
                db.session.execute(db.text("SELECT 1 FROM users LIMIT 1"))
                print("ℹ️  Tables already exist, proceeding with data seeding...")
            except Exception:
                # Tables don't exist, create them
                db.create_all()
                print("✅ Database tables created successfully!")
            
            # Seed the database with comprehensive data
            print("🔄 Seeding database with comprehensive demo data...")
            success = seed_database()
            
            if success:
                print("\n🎉 Database initialization completed successfully!")
                return True
            else:
                print("\n❌ Database seeding failed!")
                return False
            
        except Exception as e:
            print(f"❌ Error during database initialization: {str(e)}")
            import traceback
            traceback.print_exc()
            return False

if __name__ == "__main__":
    success = init_database()
    sys.exit(0 if success else 1) 