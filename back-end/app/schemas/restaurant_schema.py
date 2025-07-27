"""
Restaurant schema for validation
"""

from marshmallow import Schema, fields, validate

class RestaurantInfoSchema(Schema):
    """Schema for restaurant info validation"""
    id = fields.UUID(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    address = fields.Str(required=True)
    phone = fields.Str(required=True, validate=validate.Length(min=10, max=20))
    email = fields.Email(allow_none=True)
    website = fields.Url(allow_none=True)
    description = fields.Str(allow_none=True)
    mission = fields.Str(allow_none=True)
    history = fields.Str(allow_none=True)
    hours = fields.Dict(allow_none=True)
    social_media = fields.Dict(allow_none=True)
    updated_at = fields.DateTime(dump_only=True) 