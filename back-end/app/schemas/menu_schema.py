"""
Menu schemas for validation
"""

from marshmallow import Schema, fields, validate

class MenuItemSchema(Schema):
    """Schema for menu item validation"""
    id = fields.UUID(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    description = fields.Str(allow_none=True)
    price = fields.Decimal(required=True, places=2)
    category_id = fields.UUID(required=True)
    is_vegetarian = fields.Bool()
    is_gluten_free = fields.Bool()
    is_spicy = fields.Bool()
    is_active = fields.Bool()
    display_order = fields.Int()

class MenuCategorySchema(Schema):
    """Schema for menu category validation"""
    id = fields.UUID(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    description = fields.Str(allow_none=True)
    display_order = fields.Int()
    is_active = fields.Bool()
    icon = fields.Str(validate=validate.Length(max=10))
    items = fields.Nested(MenuItemSchema, many=True, dump_only=True) 