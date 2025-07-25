"""seed gallery images

Revision ID: 0b3317de9251
Revises: 61521e19b253
Create Date: 2025-07-25 01:42:58.733092

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0b3317de9251'
down_revision = '61521e19b253'
branch_labels = None
depends_on = None


def upgrade():
    from sqlalchemy.sql import table, column
    import sqlalchemy as sa
    import uuid, datetime
    gallery_images = table('gallery_images',
        column('id', sa.String()),
        column('url', sa.String()),
        column('alt', sa.String()),
        column('category', sa.String()),
        column('display_order', sa.Integer()),
        column('is_active', sa.Boolean()),
        column('created_at', sa.DateTime()),
    )
    images = [
        {"url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop", "alt": "Elegant dining room with crystal chandeliers and warm ambiance", "category": "Interior Design"},
        {"url": "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop", "alt": "Signature truffle pasta with aged parmesan", "category": "Signature Dishes"},
        {"url": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop", "alt": "Fine dining table setting with premium silverware", "category": "Table Settings"},
        {"url": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop", "alt": "Pan-seared salmon with seasonal vegetables", "category": "Signature Dishes"},
        {"url": "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop", "alt": "Chef Laurent preparing fresh handmade pasta", "category": "Kitchen Stories"},
        {"url": "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop", "alt": "Artisan tiramisu with gold leaf garnish", "category": "Dessert Artistry"},
        {"url": "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&h=600&fit=crop", "alt": "Intimate dining area with fireplace", "category": "Interior Design"},
        {"url": "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&h=600&fit=crop", "alt": "Anniversary celebration with champagne service", "category": "Special Events"},
        {"url": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop", "alt": "Wagyu beef preparation with molecular techniques", "category": "Kitchen Stories"},
        {"url": "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=600&fit=crop", "alt": "Chocolate soufflé with vanilla bean ice cream", "category": "Dessert Artistry"},
        {"url": "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=800&h=600&fit=crop", "alt": "Wine cellar with vintage collection", "category": "Wine Collection"},
        {"url": "https://images.unsplash.com/photo-1515669097368-22e68403d87b?w=800&h=600&fit=crop", "alt": "Private dining room for intimate gatherings", "category": "Private Events"},
    ]
    now = datetime.datetime.utcnow()
    for i, img in enumerate(images):
        op.execute(gallery_images.insert().values(
            id=str(uuid.uuid4()),
            url=img["url"],
            alt=img["alt"],
            category=img["category"],
            display_order=i,
            is_active=True,
            created_at=now
        ))


def downgrade():
    pass
