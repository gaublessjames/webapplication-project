"""
Newsletter subscription model
"""

from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.extensions import db

class NewsletterSubscriber(db.Model):
    """Newsletter subscription model"""
    __tablename__ = 'newsletter_subscribers'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(100))
    is_active = db.Column(db.Boolean, default=True)
    subscribed_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'email': self.email,
            'name': self.name,
            'is_active': self.is_active,
            'subscribed_at': self.subscribed_at.isoformat() if self.subscribed_at else None
        }

    def __repr__(self):
        return f'<NewsletterSubscriber {self.email}>' 