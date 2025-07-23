#!/usr/bin/env python3
"""
Database connection checker for Café Fausse Flask API
"""

import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError, OperationalError
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def check_database_connection():
    """
    Check if the database is accessible and connected
    Returns: tuple (is_connected: bool, message: str)
    """
    database_url = os.getenv('DATABASE_URL')
    
    if not database_url:
        return False, "DATABASE_URL environment variable is not set"
    
    try:
        # Create engine without connecting to app context
        engine = create_engine(database_url)
        
        # Test connection
        with engine.connect() as connection:
            # Execute a simple query to test connection
            result = connection.execute(text("SELECT 1"))
            result.fetchone()
            
        return True, "Database connection successful"
        
    except OperationalError as e:
        error_msg = str(e)
        if "password authentication failed" in error_msg.lower():
            return False, "Database authentication failed - check username and password"
        elif "connection refused" in error_msg.lower():
            return False, "Database connection refused - check if database server is running"
        elif "database" in error_msg.lower() and "does not exist" in error_msg.lower():
            return False, "Database does not exist - create the database first"
        else:
            return False, f"Database connection error: {error_msg}"
            
    except SQLAlchemyError as e:
        return False, f"SQLAlchemy error: {str(e)}"
        
    except Exception as e:
        return False, f"Unexpected error: {str(e)}"

def test_database_tables():
    """
    Test if database tables exist and are accessible
    Returns: tuple (tables_exist: bool, message: str)
    """
    database_url = os.getenv('DATABASE_URL')
    
    if not database_url:
        return False, "DATABASE_URL environment variable is not set"
    
    try:
        engine = create_engine(database_url)
        
        with engine.connect() as connection:
            # Check if tables exist by querying information_schema
            result = connection.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """))
            
            tables = [row[0] for row in result.fetchall()]
            
            if not tables:
                return False, "No tables found in database - run migrations first"
            
            return True, f"Database tables found: {', '.join(tables)}"
            
    except Exception as e:
        return False, f"Error checking database tables: {str(e)}"

def main():
    """
    Main function to run database checks
    """
    print("=" * 50)
    print("Database Connection Checker")
    print("=" * 50)
    
    # Check basic connection
    print("1. Checking database connection...")
    is_connected, connection_msg = check_database_connection()
    
    if is_connected:
        print(f"✅ {connection_msg}")
        
        # Check tables if connection is successful
        print("\n2. Checking database tables...")
        tables_exist, tables_msg = test_database_tables()
        
        if tables_exist:
            print(f"✅ {tables_msg}")
            print("\n🎉 Database is ready!")
            return True
        else:
            print(f"⚠️  {tables_msg}")
            print("\n💡 Run migrations to create tables:")
            print("   flask db upgrade")
            return False
    else:
        print(f"❌ {connection_msg}")
        print("\n🔧 Please check your database configuration:")
        print("   1. Ensure DATABASE_URL is set in .env file")
        print("   2. Verify database server is running")
        print("   3. Check username, password, and database name")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 