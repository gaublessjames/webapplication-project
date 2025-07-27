"""
Table reservation model
"""

from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.extensions import db

class Reservation(db.Model):
    """Table reservation model"""
    __tablename__ = 'reservations'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = db.Column(UUID(as_uuid=True), db.ForeignKey('customers.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    party_size = db.Column(db.Integer, nullable=False)
    special_requests = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')  # pending, confirmed, cancelled
    table_number = db.Column(db.Integer, nullable=True)  # Table number assigned to this reservation
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=True)
    
    # Relationship to Customer
    customer = db.relationship('Customer', backref='reservations')
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'customer_id': str(self.customer_id),
            'customer': self.customer.to_dict() if self.customer else None,
            'date': self.date.isoformat() if self.date else None,
            'time': self.time.strftime('%H:%M') if self.time else None,
            'party_size': self.party_size,
            'special_requests': self.special_requests,
            'status': self.status,
            'table_number': self.table_number,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'user_id': str(self.user_id) if self.user_id else None
        }

    def __repr__(self):
        return f'<Reservation {self.name} - {self.date} {self.time}>' 