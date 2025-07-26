"""
Gallery schema for validation
"""

from marshmallow import Schema, fields, validate

class GalleryImageSchema(Schema):
    """Schema for gallery image validation"""
    id = fields.UUID(dump_only=True)
    url = fields.Url(required=True)
    alt = fields.Str(required=True, validate=validate.Length(min=1, max=255))
    category = fields.Str(validate=validate.Length(max=100))
    display_order = fields.Int()
    is_active = fields.Bool()
    created_at = fields.DateTime(dump_only=True) 