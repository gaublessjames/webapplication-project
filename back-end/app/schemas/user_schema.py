"""
User schema for validation
"""

from marshmallow import Schema, fields, validate

class UserSchema(Schema):
    """Schema for user validation"""
    id = fields.UUID(dump_only=True)
    email = fields.Email(required=True)
    full_name = fields.Str(validate=validate.Length(min=1, max=100))
    phone = fields.Str(validate=validate.Length(min=10, max=20))
    role = fields.Str(validate=validate.OneOf(['user', 'admin']))
    password = fields.Str(load_only=True, validate=validate.Length(min=6))
    password_hash = fields.Str(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    is_active = fields.Bool() 