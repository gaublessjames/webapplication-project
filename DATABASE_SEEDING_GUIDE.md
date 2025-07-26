# Database Seeding Guide for Café Fausse

This guide explains how to set up and populate the Café Fausse database with comprehensive demo data.

## Overview

The database seeding system ensures that all tables are populated with realistic, viewable data including:
- **Gallery images** with high-quality, viewable URLs from Unsplash
- **Complete menu** with French cuisine items
- **Customer testimonials** and reviews
- **Restaurant information** and awards
- **Sample reservations** and users
- **Newsletter subscribers** and customer data

## Quick Start

### Option 1: Full Database Setup (Recommended for new installations)

```bash
cd back-end
python init_database.py
```

This will:
- Create all database tables
- Populate all tables with comprehensive demo data
- Set up demo users with login credentials

### Option 2: Data Seeding Only (for existing databases)

```bash
cd back-end
python seed_only.py
```

This will:
- Add demo data to existing tables
- Preserve existing data
- Not recreate tables

### Option 3: Test Your Seeding

```bash
cd back-end
python test_seeding.py
```

This will:
- Verify all tables are properly populated
- Check data quality and relationships
- Show a summary of all data

## Demo Data Included

### Users (3 accounts)
- **Demo User**: `demo@cafefausse.com` / `demo123456`
- **Admin User**: `admin@cafefausse.com` / `demo123456`
- **Chef User**: `chef@cafefausse.com` / `demo123456`

### Menu (4 categories, 12 items)
- **Appetizers**: Escargots, Onion Soup, Salade Niçoise
- **Main Courses**: Coq au Vin, Boeuf Bourguignon, Ratatouille, Duck Confit
- **Desserts**: Crème Brûlée, Tarte Tatin, Chocolate Mousse
- **Beverages**: French Red Wine, Café au Lait, Kir Royale

### Gallery Images (12 high-quality images)
All images are sourced from Unsplash and are immediately viewable:
- Restaurant interiors and exteriors
- French cuisine dishes
- Desserts and beverages
- Kitchen and dining areas

### Testimonials (6 reviews)
- 5-star and 4-star reviews
- Featured and approved testimonials
- Realistic customer feedback

### Awards (3 awards)
- Best French Restaurant (2023)
- Wine Spectator Award (2022)
- Service Excellence Award (2023)

### Other Data
- **Customers**: 5 sample customers
- **Newsletter Subscribers**: 4 subscribers
- **Reservations**: 20 sample reservations
- **Restaurant Info**: Complete restaurant details with hours and social media
- **User Profiles**: 3 user profiles

## Gallery Images Details

All gallery images use Unsplash URLs with the following format:
```
https://images.unsplash.com/photo-[ID]?w=800&h=600&fit=crop
```

Images include:
1. **Interior shots**: Restaurant dining areas, bars, cozy atmospheres
2. **Food photography**: French dishes, desserts, beverages
3. **Exterior shots**: Restaurant facades, outdoor dining
4. **Kitchen shots**: Chef preparation, cooking scenes

All images are:
- ✅ High quality (800x600 resolution)
- ✅ Immediately viewable
- ✅ Properly categorized
- ✅ Optimized for web display

## Database Schema

The seeding covers all tables in the database:

| Table | Records | Description |
|-------|---------|-------------|
| `users` | 3 | Demo users with login credentials |
| `profiles` | 3 | User profile information |
| `menu_categories` | 4 | Menu sections (Appetizers, Main Courses, etc.) |
| `menu_items` | 12 | Individual menu items with dietary info |
| `testimonials` | 6 | Customer reviews and ratings |
| `gallery_images` | 12 | High-quality restaurant and food images |
| `awards` | 3 | Restaurant accolades and recognition |
| `customers` | 5 | Customer information |
| `newsletter_subscribers` | 4 | Email newsletter subscriptions |
| `reservations` | 20 | Sample table reservations |
| `restaurant_info` | 1 | Restaurant details, hours, social media |

## Data Quality Features

### Relationships
- Menu items are properly linked to categories
- Reservations can be linked to users
- User profiles are created for all users
- All foreign key relationships are maintained

### Data Validation
- All required fields are populated
- Email addresses are properly formatted
- Phone numbers follow consistent format
- Dates and times are realistic

### Content Quality
- Realistic French restaurant data
- Proper dietary information (vegetarian, gluten-free, spicy)
- Authentic French dish names and descriptions
- Professional testimonials and reviews

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```bash
   # Check your .env file has correct DATABASE_URL
   cat .env | grep DATABASE_URL
   ```

2. **Tables Already Exist**
   ```bash
   # Use seed_only.py instead
   python seed_only.py
   ```

3. **Permission Errors**
   ```bash
   # Make sure you're in the back-end directory
   cd back-end
   ```

4. **Missing Dependencies**
   ```bash
   # Install requirements
   pip install -r requirements.txt
   ```

### Verification Commands

```bash
# Test the seeding
python test_seeding.py

# Check specific table counts
python -c "
from app import create_app
from models import User, MenuItem, GalleryImage
app = create_app()
with app.app_context():
    print(f'Users: {User.query.count()}')
    print(f'Menu Items: {MenuItem.query.count()}')
    print(f'Gallery Images: {GalleryImage.query.count()}')
"
```

## Customization

### Adding More Data

To add more data, edit the `seed_database.py` file:

1. **Add more menu items**:
   ```python
   # In create_menu_data() function
   menu_items_data.append({
       "name": "Your New Dish",
       "description": "Description here",
       "price": Decimal("25.00"),
       "category": "Main Courses",
       # ... other fields
   })
   ```

2. **Add more gallery images**:
   ```python
   # In create_gallery_images() function
   gallery_data.append({
       "url": "https://images.unsplash.com/your-image-url",
       "alt": "Your image description",
       "category": "your-category",
       "display_order": 13
   })
   ```

### Modifying Existing Data

To modify existing data, update the data arrays in `seed_database.py` and re-run the seeding script.

## Best Practices

1. **Always test after seeding**: Run `python test_seeding.py`
2. **Backup before major changes**: Export your database if needed
3. **Use seed_only.py for updates**: Don't recreate tables unnecessarily
4. **Check image URLs**: Ensure all gallery images are accessible
5. **Verify relationships**: Make sure foreign keys are properly set

## Support

If you encounter issues with database seeding:

1. Check the error messages in the console
2. Verify your database connection
3. Ensure all dependencies are installed
4. Run the test script to identify specific issues
5. Check the logs for detailed error information

For additional help, refer to the main README.md file or contact the development team. 