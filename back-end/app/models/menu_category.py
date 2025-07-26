"""
Menu category model
"""

from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.extensions import db

class MenuCategory(db.Model):
    """Menu category model"""
    __tablename__ = 'menu_categories'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    display_order = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    icon = db.Column(db.String(10), default='🍽️')
    
    # Relationship
    items = db.relationship('MenuItem', backref='category', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'description': self.description,
            'display_order': self.display_order,
            'is_active': self.is_active,
            'icon': self.icon,
            'items': [item.to_dict() for item in self.items if item.is_active]
        }

    def __repr__(self):
        return f'<MenuCategory {self.name}>' 