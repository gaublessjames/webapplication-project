"""
Restaurant information model
"""

from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.extensions import db

class RestaurantInfo(db.Model):
    """Restaurant information model"""
    __tablename__ = 'restaurant_info'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.Text, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120))
    website = db.Column(db.String(200))
    description = db.Column(db.Text)
    mission = db.Column(db.Text)
    history = db.Column(db.Text)
    hours = db.Column(db.JSON)  # Store hours as JSON
    social_media = db.Column(db.JSON)  # Store social media links as JSON
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'address': self.address,
            'phone': self.phone,
            'email': self.email,
            'website': self.website,
            'description': self.description,
            'mission': self.mission,
            'history': self.history,
            'hours': self.hours,
            'social_media': self.social_media,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f'<RestaurantInfo {self.name}>' 