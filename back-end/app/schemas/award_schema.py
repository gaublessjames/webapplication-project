"""
Award schema for validation
"""

from marshmallow import Schema, fields, validate

class AwardSchema(Schema):
    """Schema for award validation"""
    id = fields.UUID(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    description = fields.Str(allow_none=True)
    year = fields.Int(validate=validate.Range(min=1900, max=2100))
    category = fields.Str(validate=validate.Length(max=100))
    image_url = fields.Url(allow_none=True)
    is_featured = fields.Bool()
    display_order = fields.Int()
    created_at = fields.DateTime(dump_only=True) 