from app import create_app
from models import db, RestaurantInfo, MenuCategory, MenuItem, Award, Testimonial
from datetime import datetime, time

def init_database():
    """Initialize database with sample data"""
    app = create_app()
    
    with app.app_context():
        # Create all tables
        db.create_all()
        
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
        
        # Add menu categories
        categories_data = [
            {"name": "Appetizers", "description": "Start your culinary journey with our carefully crafted appetizers", "display_order": 1},
            {"name": "Main Courses", "description": "Our signature dishes prepared with the finest ingredients", "display_order": 2},
            {"name": "Desserts", "description": "Sweet endings to perfect your dining experience", "display_order": 3},
            {"name": "Beverages", "description": "Fine wines, craft cocktails, and specialty drinks", "display_order": 4}
        ]
        
        for cat_data in categories_data:
            existing_cat = MenuCategory.query.filter_by(name=cat_data["name"]).first()
            if not existing_cat:
                category = MenuCategory(**cat_data)
                db.session.add(category)
                db.session.flush()  # Get the ID
                
                # Add menu items for each category
                if cat_data["name"] == "Appetizers":
                    items = [
                        {"name": "Escargots de Bourgogne", "description": "Traditional Burgundy snails in garlic herb butter", "price": 18.00, "category_id": category.id, "is_vegetarian": False},
                        {"name": "Soupe à l'Oignon", "description": "Classic French onion soup with melted Gruyère", "price": 14.00, "category_id": category.id, "is_vegetarian": True},
                        {"name": "Salade Niçoise", "description": "Fresh tuna, olives, eggs, and vegetables", "price": 16.00, "category_id": category.id, "is_vegetarian": False}
                    ]
                elif cat_data["name"] == "Main Courses":
                    items = [
                        {"name": "Coq au Vin", "description": "Braised chicken in red wine with mushrooms and pearl onions", "price": 32.00, "category_id": category.id, "is_vegetarian": False},
                        {"name": "Filet de Boeuf", "description": "8oz filet mignon with red wine reduction", "price": 45.00, "category_id": category.id, "is_vegetarian": False},
                        {"name": "Ratatouille", "description": "Provençal vegetable stew with herbs de Provence", "price": 24.00, "category_id": category.id, "is_vegetarian": True, "is_gluten_free": True}
                    ]
                elif cat_data["name"] == "Desserts":
                    items = [
                        {"name": "Crème Brûlée", "description": "Classic vanilla custard with caramelized sugar", "price": 12.00, "category_id": category.id, "is_vegetarian": True},
                        {"name": "Tarte Tatin", "description": "Upside-down caramelized apple tart", "price": 14.00, "category_id": category.id, "is_vegetarian": True},
                        {"name": "Mousse au Chocolat", "description": "Rich dark chocolate mousse", "price": 13.00, "category_id": category.id, "is_vegetarian": True, "is_gluten_free": True}
                    ]
                elif cat_data["name"] == "Beverages":
                    items = [
                        {"name": "French 75", "description": "Gin, champagne, lemon juice, and sugar", "price": 16.00, "category_id": category.id},
                        {"name": "Kir Royale", "description": "Champagne with crème de cassis", "price": 18.00, "category_id": category.id},
                        {"name": "House Red Wine", "description": "Selection of French red wines", "price": 12.00, "category_id": category.id}
                    ]
                
                for item_data in items:
                    item = MenuItem(**item_data)
                    db.session.add(item)
        
        # Add awards
        awards_data = [
            {"name": "Best Fine Dining Restaurant", "description": "Awarded by Food & Wine Magazine", "year": 2023, "category": "Fine Dining", "is_featured": True, "display_order": 1},
            {"name": "Chef of the Year", "description": "Chef Marie Dubois recognized for culinary excellence", "year": 2022, "category": "Chef Recognition", "is_featured": True, "display_order": 2},
            {"name": "Wine Spectator Award", "description": "Excellence in wine service and selection", "year": 2021, "category": "Wine Service", "is_featured": False, "display_order": 3},
            {"name": "Michelin Star", "description": "One-star Michelin rating for exceptional cuisine", "year": 2020, "category": "Michelin Guide", "is_featured": True, "display_order": 4}
        ]
        
        for award_data in awards_data:
            existing_award = Award.query.filter_by(name=award_data["name"], year=award_data["year"]).first()
            if not existing_award:
                award = Award(**award_data)
                db.session.add(award)
        
        # Add testimonials
        testimonials_data = [
            {"customer_name": "Sarah Johnson", "rating": 5, "comment": "Absolutely incredible dining experience! The Coq au Vin was perfection, and the service was impeccable. We'll definitely be back!", "is_featured": True, "is_approved": True},
            {"customer_name": "Michael Chen", "rating": 5, "comment": "The best French cuisine I've had outside of Paris. The wine pairing suggestions were spot on, and the atmosphere is so romantic.", "is_featured": True, "is_approved": True},
            {"customer_name": "Emily Rodriguez", "rating": 4, "comment": "Wonderful food and great service. The crème brûlée was divine! Highly recommend for special occasions.", "is_featured": False, "is_approved": True},
            {"customer_name": "David Thompson", "rating": 5, "comment": "Chef Marie's attention to detail is remarkable. Every dish was a work of art. The tasting menu was an unforgettable experience.", "is_featured": True, "is_approved": True}
        ]
        
        for testimonial_data in testimonials_data:
            existing_testimonial = Testimonial.query.filter_by(customer_name=testimonial_data["customer_name"], comment=testimonial_data["comment"]).first()
            if not existing_testimonial:
                testimonial = Testimonial(**testimonial_data)
                db.session.add(testimonial)
        
        # Commit all changes
        db.session.commit()
        print("Database initialized successfully with sample data!")

if __name__ == "__main__":
    init_database() 