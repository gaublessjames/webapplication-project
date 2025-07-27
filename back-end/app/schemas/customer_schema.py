"""
Customer schema for validation
"""

from marshmallow import Schema, fields, validate

class CustomerSchema(Schema):
    """Schema for customer validation"""
    id = fields.UUID(dump_only=True)
    email = fields.Email(required=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    phone = fields.Str(validate=validate.Length(min=10, max=20))
    newsletter_signup = fields.Bool()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True) 