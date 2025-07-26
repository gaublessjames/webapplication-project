"""
Newsletter schema for validation
"""

from marshmallow import Schema, fields, validate

class NewsletterSchema(Schema):
    """Schema for newsletter subscription validation"""
    id = fields.UUID(dump_only=True)
    email = fields.Email(required=True)
    name = fields.Str(validate=validate.Length(max=100))
    is_active = fields.Bool()
    subscribed_at = fields.DateTime(dump_only=True) 