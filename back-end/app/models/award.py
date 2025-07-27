"""
Restaurant awards model
"""

from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.extensions import db

class Award(db.Model):
    """Restaurant awards model"""
    __tablename__ = 'awards'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    year = db.Column(db.Integer)
    category = db.Column(db.String(100))
    image_url = db.Column(db.String(500))
    is_featured = db.Column(db.Boolean, default=False)
    display_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'description': self.description,
            'year': self.year,
            'category': self.category,
            'image_url': self.image_url,
            'is_featured': self.is_featured,
            'display_order': self.display_order
        }

    def __repr__(self):
        return f'<Award {self.name}>' 