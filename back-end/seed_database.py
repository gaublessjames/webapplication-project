#!/usr/bin/env python3
"""
Comprehensive database seeding script for Café Fausse
Populates all tables with realistic data including gallery images
"""

import os
import sys
from datetime import datetime, timedelta
from decimal import Decimal
import random
from app import create_app
from app.models import (
    User, Reservation, Testimonial, MenuCategory, MenuItem, 
    GalleryImage, RestaurantInfo, Award, Customer, NewsletterSubscriber,
    Profile
)
from app.extensions import db
import bcrypt

def seed_database():
    """Seed the database with comprehensive demo data"""
    
    print("🌱 SEEDING CAFÉ FAUSSE DATABASE")
    print("=" * 50)
    
    app = create_app()
    
    with app.app_context():
        try:
            # Clear existing data (optional - comment out if you want to preserve existing data)
            # print("🧹 Clearing existing data...")
            # db.drop_all()
            # db.create_all()
            
            print("🔄 Creating users...")
            create_users()
            
            print("🔄 Creating restaurant info...")
            create_restaurant_info()
            
            print("🔄 Creating menu categories and items...")
            create_menu_data()
            
            print("🔄 Creating testimonials...")
            create_testimonials()
            
            print("🔄 Creating gallery images...")
            create_gallery_images()
            
            print("🔄 Creating awards...")
            create_awards()
            
            print("🔄 Creating customers...")
            create_customers()
            
            print("🔄 Creating newsletter subscribers...")
            create_newsletter_subscribers()
            
            # print("🔄 Creating sample reservations...")
            # create_sample_reservations()
            
            print("🔄 Creating user profiles...")
            create_user_profiles()
            
            db.session.commit()
            
            print("\n🎉 Database seeding completed successfully!")
            print_database_summary()
            
            return True
            
        except Exception as e:
            print(f"❌ Error during database seeding: {str(e)}")
            import traceback
            traceback.print_exc()
            db.session.rollback()
            return False

def create_users():
    """Create demo users"""
    users_data = [
        {
            "email": "demo@cafefausse.com",
            "full_name": "Demo User",
            "role": "user",
            "phone": "+1-555-0123"
        },
        {
            "email": "admin@cafefausse.com",
            "full_name": "Admin User",
            "role": "admin",
            "phone": "+1-555-0124"
        },
        {
            "email": "chef@cafefausse.com",
            "full_name": "Chef Marie",
            "role": "admin",
            "phone": "+1-555-0125"
        }
    ]
    
    password = "demo123456"
    
    for user_info in users_data:
        user = User.query.filter_by(email=user_info["email"]).first()
        if not user:
            hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            user = User(
                email=user_info["email"],
                full_name=user_info["full_name"],
                role=user_info["role"],
                phone=user_info["phone"],
                password_hash=hashed,
                is_active=True
            )
            db.session.add(user)
            print(f"✅ Created user: {user_info['email']}")
        else:
            print(f"ℹ️  User already exists: {user_info['email']}")

def create_restaurant_info():
    """Create restaurant information"""
    restaurant = RestaurantInfo.query.first()
    if not restaurant:
        restaurant = RestaurantInfo(
            name="Café Fausse",
            address="123 Gourmet Street, Culinary District, Foodie City, FC 12345",
            phone="+1-555-0123",
            email="info@cafefausse.com",
            website="https://cafefausse.com",
            description="An elegant French-inspired café offering authentic cuisine in a warm, inviting atmosphere.",
            mission="To provide exceptional dining experiences through authentic French cuisine, warm hospitality, and a commitment to quality ingredients.",
            history="Founded in 2010, Café Fausse began as a small family-owned restaurant with a passion for French cuisine. Over the years, we've grown into a beloved establishment known for our authentic dishes and warm atmosphere.",
            hours={
                "monday": {"open": "11:00", "close": "22:00"},
                "tuesday": {"open": "11:00", "close": "22:00"},
                "wednesday": {"open": "11:00", "close": "22:00"},
                "thursday": {"open": "11:00", "close": "23:00"},
                "friday": {"open": "11:00", "close": "23:00"},
                "saturday": {"open": "10:00", "close": "23:00"},
                "sunday": {"open": "10:00", "close": "21:00"}
            },
            social_media={
                "facebook": "https://facebook.com/cafefausse",
                "instagram": "https://instagram.com/cafefausse",
                "twitter": "https://twitter.com/cafefausse"
            }
        )
        db.session.add(restaurant)
        print("✅ Created restaurant info")
    else:
        print("ℹ️  Restaurant info already exists")

def create_menu_data():
    """Create menu categories and items"""
    categories_data = [
        {
            "name": "Starters",
            "description": "Fresh beginnings with our delicious French appetizers",
            "icon": "🥗",
            "display_order": 1
        },
        {
            "name": "Main Courses",
            "description": "Our signature French main dishes",
            "icon": "🍽️",
            "display_order": 2
        },
        {
            "name": "Desserts",
            "description": "Sweet endings to your meal",
            "icon": "🍰",
            "display_order": 3
        },
        {
            "name": "Beverages",
            "description": "Refreshing drinks and French wines",
            "icon": "🍷",
            "display_order": 4
        }
    ]
    
    # Create categories
    categories = {}
    for cat_data in categories_data:
        category = MenuCategory.query.filter_by(name=cat_data["name"]).first()
        if not category:
            category = MenuCategory(**cat_data)
            db.session.add(category)
            db.session.flush()  # Get the ID
            print(f"✅ Created category: {cat_data['name']}")
        categories[cat_data["name"]] = category
    
    # Menu items data
    menu_items_data = [
        # Starters
        {
            "name": "Escargots de Bourgogne",
            "description": "Traditional Burgundy snails in garlic herb butter",
            "price": Decimal("12.50"),
            "category": "Starters",
            "is_vegetarian": False,
            "is_gluten_free": True,
            "is_spicy": False,
            "display_order": 1
        },
        {
            "name": "Soupe à l'Oignon",
            "description": "Classic French onion soup with melted Gruyère cheese",
            "price": Decimal("9.50"),
            "category": "Starters",
            "is_vegetarian": True,
            "is_gluten_free": False,
            "is_spicy": False,
            "display_order": 2
        },
        {
            "name": "Salade Niçoise",
            "description": "Fresh tuna, eggs, olives, and vegetables with Dijon vinaigrette",
            "price": Decimal("14.00"),
            "category": "Starters",
            "is_vegetarian": False,
            "is_gluten_free": True,
            "is_spicy": False,
            "display_order": 3
        },
        
        # Main Courses
        {
            "name": "Coq au Vin",
            "description": "Braised chicken in red wine with mushrooms and pearl onions",
            "price": Decimal("28.00"),
            "category": "Main Courses",
            "is_vegetarian": False,
            "is_gluten_free": False,
            "is_spicy": False,
            "display_order": 1
        },
        {
            "name": "Boeuf Bourguignon",
            "description": "Slow-cooked beef stew in red wine with vegetables",
            "price": Decimal("32.00"),
            "category": "Main Courses",
            "is_vegetarian": False,
            "is_gluten_free": False,
            "is_spicy": False,
            "display_order": 2
        },
        {
            "name": "Ratatouille",
            "description": "Provençal vegetable stew with eggplant, zucchini, and tomatoes",
            "price": Decimal("22.00"),
            "category": "Main Courses",
            "is_vegetarian": True,
            "is_gluten_free": True,
            "is_spicy": False,
            "display_order": 3
        },
        {
            "name": "Duck Confit",
            "description": "Confit duck leg with crispy skin and roasted potatoes",
            "price": Decimal("35.00"),
            "category": "Main Courses",
            "is_vegetarian": False,
            "is_gluten_free": True,
            "is_spicy": False,
            "display_order": 4
        },
        
        # Desserts
        {
            "name": "Crème Brûlée",
            "description": "Classic vanilla custard with caramelized sugar top",
            "price": Decimal("12.00"),
            "category": "Desserts",
            "is_vegetarian": True,
            "is_gluten_free": True,
            "is_spicy": False,
            "display_order": 1
        },
        {
            "name": "Tarte Tatin",
            "description": "Upside-down caramelized apple tart",
            "price": Decimal("13.50"),
            "category": "Desserts",
            "is_vegetarian": True,
            "is_gluten_free": False,
            "is_spicy": False,
            "display_order": 2
        },
        {
            "name": "Mousse au Chocolat",
            "description": "Rich dark chocolate mousse with whipped cream",
            "price": Decimal("11.00"),
            "category": "Desserts",
            "is_vegetarian": True,
            "is_gluten_free": True,
            "is_spicy": False,
            "display_order": 3
        },
        
        # Beverages
        {
            "name": "French Red Wine",
            "description": "Selection of fine French red wines by the glass",
            "price": Decimal("12.00"),
            "category": "Beverages",
            "is_vegetarian": True,
            "is_gluten_free": True,
            "is_spicy": False,
            "display_order": 1
        },
        {
            "name": "Café au Lait",
            "description": "Traditional French coffee with steamed milk",
            "price": Decimal("4.50"),
            "category": "Beverages",
            "is_vegetarian": True,
            "is_gluten_free": True,
            "is_spicy": False,
            "display_order": 2
        },
        {
            "name": "Kir Royale",
            "description": "Champagne with crème de cassis",
            "price": Decimal("14.00"),
            "category": "Beverages",
            "is_vegetarian": True,
            "is_gluten_free": True,
            "is_spicy": False,
            "display_order": 3
        }
    ]
    
    # Create menu items
    for item_data in menu_items_data:
        category_name = item_data.pop("category")
        category = categories[category_name]
        
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

def create_testimonials():
    """Create sample testimonials"""
    testimonials_data = [
        {
            "title": "Outstanding French Cuisine",
            "rating": 5,
            "comment": "The Coq au Vin was absolutely divine! Authentic French flavors and perfect service. Will definitely return.",
            "is_featured": True,
            "is_approved": True
        },
        {
            "title": "Perfect for Date Night",
            "rating": 5,
            "comment": "Romantic atmosphere, excellent wine selection, and the duck confit was incredible. Highly recommended!",
            "is_featured": True,
            "is_approved": True
        },
        {
            "title": "Best French Restaurant in Town",
            "rating": 4,
            "comment": "Great food and authentic French experience. The crème brûlée was perfect. Service was attentive.",
            "is_featured": False,
            "is_approved": True
        },
        {
            "title": "Wonderful Anniversary Dinner",
            "rating": 5,
            "comment": "Celebrated our anniversary here and it was perfect. The staff went above and beyond to make it special.",
            "is_featured": True,
            "is_approved": True
        },
        {
            "title": "Excellent Wine Pairing",
            "rating": 4,
            "comment": "The sommelier helped us choose the perfect wine for our meal. Great knowledge and service.",
            "is_featured": False,
            "is_approved": True
        },
        {
            "title": "Authentic French Experience",
            "rating": 5,
            "comment": "Felt like we were dining in Paris! The escargots were delicious and the atmosphere was perfect.",
            "is_featured": False,
            "is_approved": True
        }
    ]
    
    for test_data in testimonials_data:
        existing = Testimonial.query.filter_by(
            title=test_data["title"],
            comment=test_data["comment"]
        ).first()
        
        if not existing:
            testimonial = Testimonial(**test_data)
            db.session.add(testimonial)
            print(f"✅ Created testimonial: {test_data['title']}")
        else:
            print(f"ℹ️  Testimonial already exists: {test_data['title']}")

def create_gallery_images():
    """Create gallery images with viewable URLs from Unsplash"""
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
        existing = GalleryImage.query.filter_by(url=img_data["url"]).first()
        if not existing:
            gallery_image = GalleryImage(**img_data)
            db.session.add(gallery_image)
            print(f"✅ Created gallery image: {img_data['alt']}")
        else:
            print(f"ℹ️  Gallery image already exists: {img_data['alt']}")

def create_awards():
    """Create restaurant awards"""
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
        existing = Award.query.filter_by(name=award_data["name"]).first()
        if not existing:
            award = Award(**award_data)
            db.session.add(award)
            print(f"✅ Created award: {award_data['name']}")
        else:
            print(f"ℹ️  Award already exists: {award_data['name']}")

def create_customers():
    """Create sample customers"""
    customers_data = [
        {
            "email": "john.doe@email.com",
            "name": "John Doe",
            "phone": "+1-555-0101",
            "newsletter_signup": True
        },
        {
            "email": "jane.smith@email.com",
            "name": "Jane Smith",
            "phone": "+1-555-0102",
            "newsletter_signup": True
        },
        {
            "email": "mike.johnson@email.com",
            "name": "Mike Johnson",
            "phone": "+1-555-0103",
            "newsletter_signup": False
        },
        {
            "email": "sarah.wilson@email.com",
            "name": "Sarah Wilson",
            "phone": "+1-555-0104",
            "newsletter_signup": True
        },
        {
            "email": "david.brown@email.com",
            "name": "David Brown",
            "phone": "+1-555-0105",
            "newsletter_signup": False
        }
    ]
    
    for customer_data in customers_data:
        existing = Customer.query.filter_by(email=customer_data["email"]).first()
        if not existing:
            customer = Customer(**customer_data)
            db.session.add(customer)
            print(f"✅ Created customer: {customer_data['name']}")
        else:
            print(f"ℹ️  Customer already exists: {customer_data['name']}")

def create_newsletter_subscribers():
    """Create newsletter subscribers"""
    subscribers_data = [
        {
            "email": "foodie@email.com",
            "name": "Foodie Fan",
            "is_active": True
        },
        {
            "email": "wine.lover@email.com",
            "name": "Wine Lover",
            "is_active": True
        },
        {
            "email": "french.cuisine@email.com",
            "name": "French Cuisine Enthusiast",
            "is_active": True
        },
        {
            "email": "dinner.planner@email.com",
            "name": "Dinner Planner",
            "is_active": False
        }
    ]
    
    for sub_data in subscribers_data:
        existing = NewsletterSubscriber.query.filter_by(email=sub_data["email"]).first()
        if not existing:
            subscriber = NewsletterSubscriber(**sub_data)
            db.session.add(subscriber)
            print(f"✅ Created newsletter subscriber: {sub_data['name']}")
        else:
            print(f"ℹ️  Newsletter subscriber already exists: {sub_data['name']}")

def create_sample_reservations():
    """Create sample reservations"""
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

def create_user_profiles():
    """Create user profiles"""
    users = User.query.all()
    
    for user in users:
        existing_profile = Profile.query.filter_by(user_id=user.id).first()
        if not existing_profile:
            profile = Profile(
                user_id=user.id,
                full_name=user.full_name,
                phone=user.phone,
                role=user.role
            )
            db.session.add(profile)
            print(f"✅ Created profile for user: {user.email}")
        else:
            print(f"ℹ️  Profile already exists for user: {user.email}")

def print_database_summary():
    """Print a summary of the database contents"""
    print("\n📊 DATABASE SUMMARY:")
    print("=" * 30)
    print(f"   👥 Users: {User.query.count()}")
    print(f"   📋 Profiles: {Profile.query.count()}")
    print(f"   🍽️  Menu Categories: {MenuCategory.query.count()}")
    print(f"   🍴 Menu Items: {MenuItem.query.count()}")
    print(f"   ⭐ Testimonials: {Testimonial.query.count()}")
    print(f"   🖼️  Gallery Images: {GalleryImage.query.count()}")
    print(f"   🏆 Awards: {Award.query.count()}")
    print(f"   👤 Customers: {Customer.query.count()}")
    print(f"   📧 Newsletter Subscribers: {NewsletterSubscriber.query.count()}")
    print(f"   📅 Reservations: {Reservation.query.count()}")
    print(f"   🏪 Restaurant Info: {RestaurantInfo.query.count()}")
    
    print("\n🔑 Demo Login Credentials:")
    print("   • Email: demo@cafefausse.com")
    print("   • Password: demo123456")
    print("   • Email: admin@cafefausse.com")
    print("   • Password: demo123456")
    print("   • Email: chef@cafefausse.com")
    print("   • Password: demo123456")

if __name__ == "__main__":
    success = seed_database()
    sys.exit(0 if success else 1) 