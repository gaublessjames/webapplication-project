"""
BlacklistedToken model for JWT token invalidation
"""

from app.extensions import db
from datetime import datetime

class BlacklistedToken(db.Model):
    __tablename__ = 'blacklisted_tokens'
    
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(500), unique=True, nullable=False)
    user_id = db.Column(db.String(50), nullable=False)
    blacklisted_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)
    
    def __repr__(self):
        return f'<BlacklistedToken {self.token[:20]}...>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'token': self.token,
            'user_id': self.user_id,
            'blacklisted_at': self.blacklisted_at.isoformat() if self.blacklisted_at else None,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None
        } 