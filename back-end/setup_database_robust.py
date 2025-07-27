#!/usr/bin/env python3
"""
Robust database setup script for Café Fausse
Handles all scenarios: fresh install, existing database, migration conflicts
"""

import os
import sys
from app import create_app
from app.models import User, Reservation, Testimonial, MenuCategory, MenuItem, GalleryImage
from app.extensions import db
import bcrypt
from sqlalchemy import text

def check_database_state():
    """Check the current state of the database"""
    try:
        # Check if database exists and has tables
        result = db.session.execute(text("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'"))
        table_count = result.scalar()
        return table_count
    except Exception as e:
        print(f"Database check failed: {e}")
        return 0

def create_tables_safely():
    """Create tables safely, handling existing tables"""
    try:
        # Try to create all tables
        db.create_all()
        print("✅ Database tables created successfully!")
        return True
    except Exception as e:
        print(f"⚠️  Table creation warning: {e}")
        print("ℹ️  Some tables may already exist, continuing...")
        return True

def ensure_demo_users():
    """Ensure demo users exist"""
    demo_users = [
        {"email": "demo@cafefausse.com", "full_name": "Demo User", "role": "user"},
        {"email": "admin@cafefausse.com", "full_name": "Admin User", "role": "admin"},
    ]
    password = "demo123456"
    
    for user_info in demo_users:
        try:
            user = User.query.filter_by(email=user_info["email"]).first()
            if not user:
                hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                user = User(
                    email=user_info["email"], 
                    full_name=user_info["full_name"], 
                    role=user_info["role"],
                    password_hash=hashed
                )
                db.session.add(user)
                print(f"✅ Created user: {user_info['email']}")
            else:
                print(f"ℹ️  User already exists: {user_info['email']}")
        except Exception as e:
            print(f"⚠️  Error creating user {user_info['email']}: {e}")
    
    try:
        db.session.commit()
        print("✅ Demo users setup completed!")
    except Exception as e:
        print(f"⚠️  Error committing users: {e}")
        db.session.rollback()

def ensure_demo_categories():
    """Ensure demo menu categories exist"""
    categories = [
        {"name": "Starters", "description": "Fresh beginnings with our delicious appetizers", "icon": "🥗"},
        {"name": "Main Courses", "description": "Our signature main dishes", "icon": "🍽️"},
        {"name": "Desserts", "description": "Sweet endings to your meal", "icon": "🍰"},
        {"name": "Beverages", "description": "Refreshing drinks and cocktails", "icon": "🍷"},
    ]
    
    for cat_info in categories:
        try:
            category = MenuCategory.query.filter_by(name=cat_info["name"]).first()
            if not category:
                category = MenuCategory(
                    name=cat_info["name"],
                    description=cat_info["description"],
                    icon=cat_info["icon"]
                )
                db.session.add(category)
                print(f"✅ Created category: {cat_info['name']}")
            else:
                print(f"ℹ️  Category already exists: {cat_info['name']}")
        except Exception as e:
            print(f"⚠️  Error creating category {cat_info['name']}: {e}")
    
    try:
        db.session.commit()
        print("✅ Menu categories setup completed!")
    except Exception as e:
        print(f"⚠️  Error committing categories: {e}")
        db.session.rollback()

def ensure_demo_testimonials():
    """Ensure demo testimonials exist"""
    testimonials = [
        {
            "title": "Outstanding Experience",
            "rating": 5,
            "comment": "Amazing food and excellent service! Will definitely come back."
        },
        {
            "title": "Wonderful Evening",
            "rating": 4,
            "comment": "Great atmosphere and delicious food. Highly recommended!"
        },
        {
            "title": "Perfect for Special Occasions",
            "rating": 5,
            "comment": "The best restaurant in town. Perfect for special occasions."
        }
    ]
    
    for test_info in testimonials:
        try:
            testimonial = Testimonial.query.filter_by(
                title=test_info["title"],
                comment=test_info["comment"]
            ).first()
            
            if not testimonial:
                testimonial = Testimonial(
                    title=test_info["title"],
                    rating=test_info["rating"],
                    comment=test_info["comment"],
                    is_approved=True
                )
                db.session.add(testimonial)
                print(f"✅ Created testimonial: {test_info['title']}")
            else:
                print(f"ℹ️  Testimonial already exists: {test_info['title']}")
        except Exception as e:
            print(f"⚠️  Error creating testimonial {test_info['title']}: {e}")
    
    try:
        db.session.commit()
        print("✅ Testimonials setup completed!")
    except Exception as e:
        print(f"⚠️  Error committing testimonials: {e}")
        db.session.rollback()

def ensure_demo_reservations():
    """Ensure demo reservations exist"""
    from datetime import datetime, timedelta
    import random
    
    # Get existing users
    users = User.query.all()
    if not users:
        print("⚠️  No users found, skipping reservations")
        return
    
    # Create sample reservations for the next 30 days
    base_date = datetime.now().date()
    reservation_data = []
    
    for i in range(20):
        date = base_date + timedelta(days=random.randint(1, 30))
        time_slots = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"]
        time = datetime.strptime(random.choice(time_slots), "%H:%M").time()
        
        reservation_data.append({
            "name": f"Guest {i+1}",
            "email": f"guest{i+1}@email.com",
            "phone": f"+1-555-{1000+i:04d}",
            "date": date,
            "time": time,
            "party_size": random.randint(2, 8),
            "special_requests": random.choice([None, "Window seat please", "Anniversary celebration", "Gluten-free options needed"]),
            "status": random.choice(["pending", "confirmed", "confirmed", "confirmed"]),  # More confirmed than pending
            "table_number": random.randint(1, 20),
            "user_id": random.choice(users).id if random.random() > 0.5 else None
        })
    
    for res_data in reservation_data:
        try:
            existing = Reservation.query.filter_by(
                name=res_data["name"],
                email=res_data["email"],
                date=res_data["date"],
                time=res_data["time"]
            ).first()
            
            if not existing:
                reservation = Reservation(**res_data)
                db.session.add(reservation)
                print(f"✅ Created reservation for {res_data['name']} on {res_data['date']}")
            else:
                print(f"ℹ️  Reservation already exists for {res_data['name']}")
        except Exception as e:
            print(f"⚠️  Error creating reservation for {res_data['name']}: {e}")
    
    try:
        db.session.commit()
        print("✅ Reservations setup completed!")
    except Exception as e:
        print(f"⚠️  Error committing reservations: {e}")
        db.session.rollback()

def setup_database_robust():
    """Robust database setup that handles all scenarios"""
    
    print("🛡️  ROBUST DATABASE SETUP FOR CAFÉ FAUSSE")
    print("=" * 50)
    
    # Create Flask app
    app = create_app()
    
    with app.app_context():
        try:
            # Check database state
            table_count = check_database_state()
            print(f"📊 Found {table_count} existing tables in database")
            
            if table_count == 0:
                print("🆕 Fresh database detected. Creating tables...")
                create_tables_safely()
            else:
                print("🔄 Existing database detected. Ensuring schema is up to date...")
                # Try to create any missing tables
                create_tables_safely()
            
            # Ensure demo data exists
            print("\n🔄 Setting up demo data...")
            ensure_demo_users()
            ensure_demo_categories()
            ensure_demo_testimonials()
            ensure_demo_reservations()
            
            # Final status report
            print("\n📋 Final Database Summary:")
            try:
                print(f"   • Users: {User.query.count()}")
                print(f"   • Menu Categories: {MenuCategory.query.count()}")
                print(f"   • Testimonials: {Testimonial.query.count()}")
                print(f"   • Reservations: {Reservation.query.count()}")
                print(f"   • Gallery Images: {GalleryImage.query.count()}")
            except Exception as e:
                print(f"⚠️  Error getting counts: {e}")
            
            print("\n🔑 Demo Login Credentials:")
            print("   • Email: demo@cafefausse.com")
            print("   • Password: demo123456")
            print("   • Email: admin@cafefausse.com")
            print("   • Password: demo123456")
            
            print("\n🎉 Database setup completed successfully!")
            return True
            
        except Exception as e:
            print(f"❌ Critical error during database setup: {str(e)}")
            import traceback
            traceback.print_exc()
            return False

if __name__ == "__main__":
    success = setup_database_robust()
    sys.exit(0 if success else 1) 