"""
Gallery image model
"""

from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.extensions import db

class GalleryImage(db.Model):
    """Gallery image model"""
    __tablename__ = 'gallery_images'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    url = db.Column(db.String(500), nullable=False)
    alt = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(100), nullable=True)
    display_order = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': str(self.id),
            'url': self.url,
            'alt': self.alt,
            'category': self.category,
            'display_order': self.display_order,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f'<GalleryImage {self.alt}>' 