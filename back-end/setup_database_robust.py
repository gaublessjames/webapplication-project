#!/usr/bin/env python3
"""
Robust database setup script for Café Fausse
Handles all scenarios: fresh install, existing database, migration conflicts
"""

import os
import sys
from app import create_app
from app.models import User, Reservation, Testimonial, MenuCategory, MenuItem, GalleryImage, Award
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
                    password_hash=hashed,
                    is_active=True
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

def ensure_demo_awards():
    """Ensure demo awards exist"""
    awards_data = [
        {
            "name": "Best French Restaurant",
            "description": "Awarded by Food & Wine Magazine for authentic French cuisine",
            "year": 2023,
            "category": "Cuisine",
            "image_url": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
            "is_featured": True,
            "display_order": 1
        },
        {
            "name": "Wine Spectator Award",
            "description": "Recognition for outstanding wine selection and service",
            "year": 2022,
            "category": "Wine",
            "image_url": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop",
            "is_featured": True,
            "display_order": 2
        },
        {
            "name": "Service Excellence Award",
            "description": "Recognized for exceptional customer service and hospitality",
            "year": 2023,
            "category": "Service",
            "image_url": "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop",
            "is_featured": False,
            "display_order": 3
        }
    ]
    
    for award_data in awards_data:
        try:
            existing = Award.query.filter_by(name=award_data["name"]).first()
            if not existing:
                award = Award(**award_data)
                db.session.add(award)
                print(f"✅ Created award: {award_data['name']}")
            else:
                print(f"ℹ️  Award already exists: {award_data['name']}")
        except Exception as e:
            print(f"⚠️  Error creating award {award_data['name']}: {e}")
    
    try:
        db.session.commit()
        print("✅ Awards setup completed!")
    except Exception as e:
        print(f"⚠️  Error committing awards: {e}")
        db.session.rollback()

def ensure_demo_gallery_images():
    """Ensure demo gallery images exist"""
    gallery_data = [
        {
            "url": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
            "alt": "Elegant restaurant interior with warm lighting",
            "category": "interior",
            "display_order": 1
        },
        {
            "url": "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
            "alt": "Coq au Vin dish with red wine sauce",
            "category": "food",
            "display_order": 2
        },
        {
            "url": "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
            "alt": "French onion soup with melted cheese",
            "category": "food",
            "display_order": 3
        },
        {
            "url": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop",
            "alt": "Fresh salad with French dressing",
            "category": "food",
            "display_order": 4
        },
        {
            "url": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop",
            "alt": "Crème brûlée dessert with caramelized top",
            "category": "dessert",
            "display_order": 5
        },
        {
            "url": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop",
            "alt": "French wine selection and glasses",
            "category": "beverages",
            "display_order": 6
        },
        {
            "url": "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop",
            "alt": "Restaurant bar with wine bottles",
            "category": "interior",
            "display_order": 7
        },
        {
            "url": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
            "alt": "Cozy dining area with candlelit tables",
            "category": "interior",
            "display_order": 8
        },
        {
            "url": "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
            "alt": "Duck confit with crispy skin",
            "category": "food",
            "display_order": 9
        },
        {
            "url": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop",
            "alt": "Tarte Tatin with caramelized apples",
            "category": "dessert",
            "display_order": 10
        },
        {
            "url": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop",
            "alt": "Chef preparing French cuisine",
            "category": "kitchen",
            "display_order": 11
        },
        {
            "url": "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop",
            "alt": "Outdoor terrace dining area",
            "category": "exterior",
            "display_order": 12
        }
    ]
    
    for img_data in gallery_data:
        try:
            existing = GalleryImage.query.filter_by(url=img_data["url"]).first()
            if not existing:
                gallery_image = GalleryImage(**img_data)
                db.session.add(gallery_image)
                print(f"✅ Created gallery image: {img_data['alt']}")
            else:
                print(f"ℹ️  Gallery image already exists: {img_data['alt']}")
        except Exception as e:
            print(f"⚠️  Error creating gallery image {img_data['alt']}: {e}")
    
    try:
        db.session.commit()
        print("✅ Gallery images setup completed!")
    except Exception as e:
        print(f"⚠️  Error committing gallery images: {e}")
        db.session.rollback()

def ensure_demo_menu_items():
    """Ensure demo menu items exist"""
    from decimal import Decimal
    
    # Get existing categories
    categories = {}
    for category in MenuCategory.query.all():
        categories[category.name] = category
    
    if not categories:
        print("⚠️  No menu categories found, skipping menu items")
        return
    
    # Menu items data
    menu_items_data = [
        # Starters
        {
            "name": "Bruschetta",
            "description": "Fresh tomatoes, basil, olive oil, and toasted baguette slices",
            "price": Decimal("8.50"),
            "category": "Starters",
            "is_vegetarian": True,
            "is_gluten_free": False,
            "is_spicy": False,
            "display_order": 1
        },
        {
            "name": "Caesar Salad",
            "description": "Crisp romaine with homemade Caesar dressing",
            "price": Decimal("9.00"),
            "category": "Starters",
            "is_vegetarian": False,
            "is_gluten_free": False,
            "is_spicy": False,
            "display_order": 2
        },
        
        # Main Courses
        {
            "name": "Grilled Salmon",
            "description": "Served with lemon butter sauce and seasonal vegetables",
            "price": Decimal("22.00"),
            "category": "Main Courses",
            "is_vegetarian": False,
            "is_gluten_free": True,
            "is_spicy": False,
            "display_order": 1
        },
        {
            "name": "Ribeye Steak",
            "description": "12 oz prime cut with garlic mashed potatoes",
            "price": Decimal("28.00"),
            "category": "Main Courses",
            "is_vegetarian": False,
            "is_gluten_free": False,
            "is_spicy": False,
            "display_order": 2
        },
        {
            "name": "Vegetable Risotto",
            "description": "Creamy Arborio rice with wild mushrooms",
            "price": Decimal("18.00"),
            "category": "Main Courses",
            "is_vegetarian": True,
            "is_gluten_free": False,
            "is_spicy": False,
            "display_order": 3
        },
        
        # Desserts
        {
            "name": "Tiramisu",
            "description": "Classic Italian dessert with mascarpone",
            "price": Decimal("7.50"),
            "category": "Desserts",
            "is_vegetarian": True,
            "is_gluten_free": False,
            "is_spicy": False,
            "display_order": 1
        },
        {
            "name": "Cheesecake",
            "description": "Creamy cheesecake with berry compote",
            "price": Decimal("7.00"),
            "category": "Desserts",
            "is_vegetarian": True,
            "is_gluten_free": False,
            "is_spicy": False,
            "display_order": 2
        },
        
        # Beverages
        {
            "name": "Red Wine (Glass)",
            "description": "A selection of Italian reds",
            "price": Decimal("10.00"),
            "category": "Beverages",
            "is_vegetarian": True,
            "is_gluten_free": True,
            "is_spicy": False,
            "display_order": 1
        },
        {
            "name": "White Wine (Glass)",
            "description": "Crisp and refreshing",
            "price": Decimal("9.00"),
            "category": "Beverages",
            "is_vegetarian": True,
            "is_gluten_free": True,
            "is_spicy": False,
            "display_order": 2
        },
        {
            "name": "Craft Beer",
            "description": "Local artisan brews",
            "price": Decimal("6.00"),
            "category": "Beverages",
            "is_vegetarian": True,
            "is_gluten_free": False,
            "is_spicy": False,
            "display_order": 3
        },
        {
            "name": "Espresso",
            "description": "Strong and aromatic",
            "price": Decimal("3.00"),
            "category": "Beverages",
            "is_vegetarian": True,
            "is_gluten_free": True,
            "is_spicy": False,
            "display_order": 4
        }
    ]
    
    # Create menu items
    for item_data in menu_items_data:
        try:
            category_name = item_data.pop("category")
            category = categories.get(category_name)
            
            if not category:
                print(f"⚠️  Category '{category_name}' not found, skipping item '{item_data['name']}'")
                continue
            
            existing_item = MenuItem.query.filter_by(
                name=item_data["name"],
                category_id=category.id
            ).first()
            
            if not existing_item:
                item_data["category_id"] = category.id
                menu_item = MenuItem(**item_data)
                db.session.add(menu_item)
                print(f"✅ Created menu item: {item_data['name']}")
            else:
                print(f"ℹ️  Menu item already exists: {item_data['name']}")
        except Exception as e:
            print(f"⚠️  Error creating menu item {item_data['name']}: {e}")
    
    try:
        db.session.commit()
        print("✅ Menu items setup completed!")
    except Exception as e:
        print(f"⚠️  Error committing menu items: {e}")
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
            ensure_demo_menu_items()
            ensure_demo_testimonials()
            ensure_demo_awards()
            ensure_demo_gallery_images()
            ensure_demo_reservations()
            
            # Final status report
            print("\n📋 Final Database Summary:")
            try:
                print(f"   • Users: {User.query.count()}")
                print(f"   • Menu Categories: {MenuCategory.query.count()}")
                print(f"   • Menu Items: {MenuItem.query.count()}")
                print(f"   • Testimonials: {Testimonial.query.count()}")
                print(f"   • Awards: {Award.query.count()}")
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