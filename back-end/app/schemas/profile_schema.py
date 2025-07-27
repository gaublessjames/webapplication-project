"""
Profile schema for validation
"""

from marshmallow import Schema, fields, validate

class ProfileSchema(Schema):
    """Schema for profile validation"""
    id = fields.UUID(dump_only=True)
    user_id = fields.UUID(required=True)
    full_name = fields.Str(validate=validate.Length(max=100))
    phone = fields.Str(validate=validate.Length(min=10, max=20))
    role = fields.Str(validate=validate.OneOf(['user', 'admin']))
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True) 