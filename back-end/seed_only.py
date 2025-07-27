#!/usr/bin/env python3
"""
Data seeding script for Café Fausse (tables only)
Use this to add demo data to an existing database without recreating tables
"""

import sys
from seed_database import seed_database

def main():
    """Seed the database with demo data only"""
    
    print("🌱 SEEDING CAFÉ FAUSSE DATABASE (DATA ONLY)")
    print("=" * 50)
    print("This will add demo data to existing tables without recreating them.")
    print()
    
    success = seed_database()
    
    if success:
        print("\n🎉 Data seeding completed successfully!")
        return True
    else:
        print("\n❌ Data seeding failed!")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 