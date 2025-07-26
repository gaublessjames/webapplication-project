"""
Menu item model
"""

from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.extensions import db

class MenuItem(db.Model):
    """Menu item model"""
    __tablename__ = 'menu_items'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    category_id = db.Column(UUID(as_uuid=True), db.ForeignKey('menu_categories.id'), nullable=False)
    is_vegetarian = db.Column(db.Boolean, default=False)
    is_gluten_free = db.Column(db.Boolean, default=False)
    is_spicy = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    display_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'description': self.description,
            'price': float(self.price) if self.price else None,
            'category_id': str(self.category_id),
            'is_vegetarian': self.is_vegetarian,
            'is_gluten_free': self.is_gluten_free,
            'is_spicy': self.is_spicy,
            'is_active': self.is_active,
            'display_order': self.display_order
        }

    def __repr__(self):
        return f'<MenuItem {self.name}>' 