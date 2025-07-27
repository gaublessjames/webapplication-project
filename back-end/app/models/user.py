"""
User model for authentication and reservation tracing
"""

from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.extensions import db

class User(db.Model):
    """User model for authentication and reservation tracing"""
    __tablename__ = 'users'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = db.Column(db.String(120), unique=True, nullable=False)
    full_name = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    role = db.Column(db.String(20), default='user')  # user, admin
    password_hash = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=False)

    # Relationships
    reservations = db.relationship('Reservation', backref='user', lazy=True)
    profile = db.relationship('Profile', backref='user', uselist=False, lazy=True)

    def to_dict(self):
        return {
            'id': str(self.id),
            'email': self.email,
            'full_name': self.full_name,
            'phone': self.phone,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_active': self.is_active,
        }

    def __repr__(self):
        return f'<User {self.email}>' 