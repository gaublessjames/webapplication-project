"""
Testimonial schema for validation
"""

from marshmallow import Schema, fields, validate

class TestimonialSchema(Schema):
    """Schema for testimonial validation"""
    id = fields.UUID(dump_only=True)
    title = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    rating = fields.Int(required=True, validate=validate.Range(min=1, max=5))
    comment = fields.Str(required=True)
    is_featured = fields.Bool()
    is_approved = fields.Bool()
    created_at = fields.DateTime(dump_only=True) 