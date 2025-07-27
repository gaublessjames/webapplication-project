"""
Reservation schema for validation
"""

from marshmallow import Schema, fields, validate

class ReservationSchema(Schema):
    """Schema for reservation validation"""
    id = fields.UUID(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    email = fields.Email(required=True)
    phone = fields.Str(required=True, validate=validate.Length(min=10, max=20))
    date = fields.Date(required=True)
    time = fields.Time(required=True)
    party_size = fields.Int(required=True, validate=validate.Range(min=1, max=20))
    special_requests = fields.Str(allow_none=True)
    status = fields.Str(validate=validate.OneOf(['pending', 'confirmed', 'cancelled']))
    table_number = fields.Int(allow_none=True)
    created_at = fields.DateTime(dump_only=True)
    user_id = fields.UUID(allow_none=True) 