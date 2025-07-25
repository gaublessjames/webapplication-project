from app import create_app
from models import db, RestaurantInfo, MenuCategory, MenuItem, Award, Testimonial
from datetime import datetime, time

def init_database():
    """Initialize database with sample data"""
    app = create_app()
    
    with app.app_context():
        # DO NOT CREATE TABLES HERE! Only insert data after migrations.
        # db.create_all()  # <-- REMOVED
        
        # Add restaurant information
        restaurant_info = RestaurantInfo(
            name="Café Fausse",
            address="123 Gourmet Avenue, Culinary District, Foodie City, FC 12345",
            phone="(555) 123-4567",
            email="info@cafefausse.com",
            website="https://cafefausse.com",
            description="Café Fausse is a fine-dining establishment that combines traditional French cuisine with modern culinary techniques. Our award-winning chefs create unforgettable dining experiences in an elegant, intimate atmosphere.",
            mission="To provide exceptional dining experiences through innovative cuisine, impeccable service, and a warm, welcoming atmosphere that celebrates the art of fine dining.",
            history="Founded in 2010 by Chef Marie Dubois, Café Fausse began as a small bistro with big dreams. Over the years, we've grown into one of the city's most celebrated restaurants, earning numerous awards and the loyalty of food enthusiasts from around the world.",
            hours={
                "monday": {"open": "11:00", "close": "22:00"},
                "tuesday": {"open": "11:00", "close": "22:00"},
                "wednesday": {"open": "11:00", "close": "22:00"},
                "thursday": {"open": "11:00", "close": "22:00"},
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
        
        # Check if restaurant info already exists
        existing_info = RestaurantInfo.query.first()
        if not existing_info:
            db.session.add(restaurant_info)
        
        # Add or update menu categories
        menu_categories_data = [
            {"name": "Starters", "description": "Fresh beginnings", "display_order": 1, "is_active": True, "icon": "🥗"},
            {"name": "Main Courses", "description": "Hearty & exquisite mains", "display_order": 2, "is_active": True, "icon": "🍽️"},
            {"name": "Desserts", "description": "Sweet finishes", "display_order": 3, "is_active": True, "icon": "🍰"},
            {"name": "Beverages", "description": "Wines, beer & more", "display_order": 4, "is_active": True, "icon": "🍷"}
        ]
        for cat_data in menu_categories_data:
            cat = MenuCategory.query.filter_by(name=cat_data["name"]).first()
            if cat:
                for k, v in cat_data.items():
                    setattr(cat, k, v)
            else:
                cat = MenuCategory(**cat_data)
                db.session.add(cat)
        db.session.commit()
        
        # Add or update awards
        awards_data = [
            {"name": "Culinary Excellence Award", "description": "Multiple culinary awards and recognition for outstanding service and innovation.", "year": 2022, "category": "General", "is_featured": True, "display_order": 1},
            {"name": "Restaurant of the Year", "description": "Recognized for outstanding service and innovation.", "year": 2023, "category": "General", "is_featured": True, "display_order": 2},
            {"name": "Best Fine Dining Experience", "description": "Best Fine Dining Experience by Foodie Magazine.", "year": 2023, "category": "Foodie Magazine", "is_featured": True, "display_order": 3}
        ]
        for award_data in awards_data:
            award = Award.query.filter_by(name=award_data["name"], year=award_data["year"]).first()
            if award:
                for k, v in award_data.items():
                    setattr(award, k, v)
            else:
                award = Award(**award_data)
                db.session.add(award)
        db.session.commit()
        
        # Add testimonials
        # testimonials_data = [
        #     {"customer_name": "Sarah Johnson", "rating": 5, "comment": "Absolutely incredible dining experience! The Coq au Vin was perfection, and the service was impeccable. We'll definitely be back!", "is_featured": True, "is_approved": True},
        #     {"customer_name": "Michael Chen", "rating": 5, "comment": "The best French cuisine I've had outside of Paris. The wine pairing suggestions were spot on, and the atmosphere is so romantic.", "is_featured": True, "is_approved": True},
        #     {"customer_name": "Emily Rodriguez", "rating": 4, "comment": "Wonderful food and great service. The crème brûlée was divine! Highly recommend for special occasions.", "is_featured": False, "is_approved": True},
        #     {"customer_name": "David Thompson", "rating": 5, "comment": "Chef Marie's attention to detail is remarkable. Every dish was a work of art. The tasting menu was an unforgettable experience.", "is_featured": True, "is_approved": True}
        # ]
        # for testimonial_data in testimonials_data:
        #     existing_testimonial = Testimonial.query.filter_by(customer_name=testimonial_data["customer_name"], comment=testimonial_data["comment"]).first()
        #     if not existing_testimonial:
        #         testimonial = Testimonial(**testimonial_data)
        #         db.session.add(testimonial)
        # db.session.commit()
        
        # Add menu items for each category
        menu_items_data = [
            # Starters
            {"name": "Bruschetta", "description": "Fresh tomatoes, basil, olive oil, and toasted baguette slices", "price": 8.50, "category": "Starters"},
            {"name": "Caesar Salad", "description": "Crisp romaine with homemade Caesar dressing", "price": 9.00, "category": "Starters"},
            # Main Courses
            {"name": "Grilled Salmon", "description": "Served with lemon butter sauce and seasonal vegetables", "price": 22.00, "category": "Main Courses"},
            {"name": "Ribeye Steak", "description": "12 oz prime cut with garlic mashed potatoes", "price": 28.00, "category": "Main Courses"},
            {"name": "Vegetable Risotto", "description": "Creamy Arborio rice with wild mushrooms", "price": 18.00, "category": "Main Courses"},
            # Desserts
            {"name": "Tiramisu", "description": "Classic Italian dessert with mascarpone", "price": 7.50, "category": "Desserts"},
            {"name": "Cheesecake", "description": "Creamy cheesecake with berry compote", "price": 7.00, "category": "Desserts"},
            # Beverages
            {"name": "Red Wine (Glass)", "description": "A selection of Italian reds", "price": 10.00, "category": "Beverages"},
            {"name": "White Wine (Glass)", "description": "Crisp and refreshing", "price": 9.00, "category": "Beverages"},
            {"name": "Craft Beer", "description": "Local artisan brews", "price": 6.00, "category": "Beverages"},
            {"name": "Espresso", "description": "Strong and aromatic", "price": 3.00, "category": "Beverages"},
        ]
        for item_data in menu_items_data:
            category = MenuCategory.query.filter_by(name=item_data["category"]).first()
            if not category:
                continue
            existing_item = MenuItem.query.filter_by(name=item_data["name"], category_id=category.id).first()
            if not existing_item:
                item = MenuItem(
                    name=item_data["name"],
                    description=item_data["description"],
                    price=item_data["price"],
                    category_id=category.id
                )
                db.session.add(item)
        db.session.commit()
        
        # Commit all changes
        db.session.commit()
        print("Database initialized successfully with sample data!")

if __name__ == "__main__":
    init_database() 