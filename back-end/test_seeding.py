#!/usr/bin/env python3
"""
Test script to verify database seeding
"""

import sys
from app import create_app
from models import (
    User, Reservation, Testimonial, MenuCategory, MenuItem, 
    GalleryImage, RestaurantInfo, Award, Customer, NewsletterSubscriber,
    Profile
)

def test_database_seeding():
    """Test that all tables have been properly seeded"""
    
    print("🧪 TESTING DATABASE SEEDING")
    print("=" * 40)
    
    app = create_app()
    
    with app.app_context():
        try:
            # Test each table
            tests = [
                ("Users", User, 3, "demo users"),
                ("Menu Categories", MenuCategory, 4, "menu categories"),
                ("Menu Items", MenuItem, 12, "menu items"),
                ("Testimonials", Testimonial, 6, "testimonials"),
                ("Gallery Images", GalleryImage, 12, "gallery images"),
                ("Awards", Award, 3, "awards"),
                ("Customers", Customer, 5, "customers"),
                ("Newsletter Subscribers", NewsletterSubscriber, 4, "newsletter subscribers"),
                ("Reservations", Reservation, 20, "reservations"),
                ("Restaurant Info", RestaurantInfo, 1, "restaurant info record"),
                ("Profiles", Profile, 3, "user profiles"),
            ]
            
            all_passed = True
            
            for table_name, model, expected_count, description in tests:
                count = model.query.count()
                status = "✅" if count >= expected_count else "❌"
                print(f"{status} {table_name}: {count} {description}")
                
                if count < expected_count:
                    all_passed = False
                    print(f"   ⚠️  Expected at least {expected_count}, got {count}")
            
            # Test specific data quality
            print("\n🔍 DATA QUALITY CHECKS:")
            
            # Check gallery images have valid URLs
            gallery_images = GalleryImage.query.all()
            valid_urls = sum(1 for img in gallery_images if img.url.startswith('http'))
            print(f"✅ Gallery Images with valid URLs: {valid_urls}/{len(gallery_images)}")
            
            # Check menu items have categories
            menu_items = MenuItem.query.all()
            items_with_categories = sum(1 for item in menu_items if item.category_id)
            print(f"✅ Menu Items with categories: {items_with_categories}/{len(menu_items)}")
            
            # Check testimonials are approved
            approved_testimonials = Testimonial.query.filter_by(is_approved=True).count()
            total_testimonials = Testimonial.query.count()
            print(f"✅ Approved Testimonials: {approved_testimonials}/{total_testimonials}")
            
            # Check users have password hashes
            users_with_passwords = User.query.filter(User.password_hash.isnot(None)).count()
            total_users = User.query.count()
            print(f"✅ Users with passwords: {users_with_passwords}/{total_users}")
            
            # Check restaurant info has complete data
            restaurant = RestaurantInfo.query.first()
            if restaurant:
                has_hours = restaurant.hours is not None
                has_social = restaurant.social_media is not None
                print(f"✅ Restaurant Info - Hours: {has_hours}, Social Media: {has_social}")
            
            print(f"\n{'🎉 ALL TESTS PASSED!' if all_passed else '❌ SOME TESTS FAILED'}")
            
            if all_passed:
                print("\n📊 FINAL SUMMARY:")
                print("=" * 20)
                for table_name, model, expected_count, description in tests:
                    count = model.query.count()
                    print(f"   {table_name}: {count} {description}")
                
                print("\n🔑 Demo Login Credentials:")
                print("   • demo@cafefausse.com / demo123456")
                print("   • admin@cafefausse.com / demo123456")
                print("   • chef@cafefausse.com / demo123456")
            
            return all_passed
            
        except Exception as e:
            print(f"❌ Error during testing: {str(e)}")
            import traceback
            traceback.print_exc()
            return False

if __name__ == "__main__":
    success = test_database_seeding()
    sys.exit(0 if success else 1) 