from marshmallow import Schema, fields, validate, ValidationError
from datetime import datetime, date, time
import re

class ReservationSchema(Schema):
    """Schema for reservation requests"""
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    email = fields.Email(required=True)
    phone = fields.Str(required=True, validate=validate.Length(min=10, max=20))
    date = fields.Date(required=True)
    time = fields.Time(required=True)
    party_size = fields.Int(required=True, validate=validate.Range(min=1, max=20))
    special_requests = fields.Str(validate=validate.Length(max=500))
    
    def validate_date(self, value):
        """Ensure date is not in the past"""
        if value < date.today():
            raise ValidationError("Reservation date cannot be in the past")
        return value
    
    def validate_time(self, value):
        """Ensure time is within restaurant hours (11:00-22:00)"""
        if value < time(11, 0) or value > time(22, 0):
            raise ValidationError("Reservation time must be between 11:00 AM and 10:00 PM")
        return value

class NewsletterSchema(Schema):
    """Schema for newsletter subscription"""
    email = fields.Email(required=True)
    name = fields.Str(validate=validate.Length(max=100))

class MenuCategorySchema(Schema):
    """Schema for menu categories"""
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    description = fields.Str(validate=validate.Length(max=500))
    display_order = fields.Int()
    is_active = fields.Bool()

class MenuItemSchema(Schema):
    """Schema for menu items"""
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    description = fields.Str(validate=validate.Length(max=500))
    price = fields.Decimal(required=True, validate=validate.Range(min=0))
    category_id = fields.UUID(required=True)
    is_vegetarian = fields.Bool()
    is_gluten_free = fields.Bool()
    is_spicy = fields.Bool()
    is_active = fields.Bool()
    display_order = fields.Int()

class TestimonialSchema(Schema):
    """Schema for testimonials"""
    customer_name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    rating = fields.Int(required=True, validate=validate.Range(min=1, max=5))
    comment = fields.Str(required=True, validate=validate.Length(min=10, max=1000))
    is_featured = fields.Bool()
    is_approved = fields.Bool()

class RestaurantInfoSchema(Schema):
    """Schema for restaurant information"""
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    address = fields.Str(required=True, validate=validate.Length(min=1, max=500))
    phone = fields.Str(required=True, validate=validate.Length(min=10, max=20))
    email = fields.Email()
    website = fields.Url()
    description = fields.Str(validate=validate.Length(max=2000))
    mission = fields.Str(validate=validate.Length(max=2000))
    history = fields.Str(validate=validate.Length(max=5000))
    hours = fields.Dict()
    social_media = fields.Dict()

class AwardSchema(Schema):
    """Schema for awards"""
    name = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    description = fields.Str(validate=validate.Length(max=1000))
    year = fields.Int(validate=validate.Range(min=1900, max=datetime.now().year))
    category = fields.Str(validate=validate.Length(max=100))
    image_url = fields.Url()
    is_featured = fields.Bool()
    display_order = fields.Int()

# Response schemas
class ReservationResponseSchema(Schema):
    """Schema for reservation responses"""
    id = fields.UUID()
    name = fields.Str()
    email = fields.Str()
    phone = fields.Str()
    date = fields.Date()
    time = fields.Time()
    party_size = fields.Int()
    special_requests = fields.Str()
    status = fields.Str()
    created_at = fields.DateTime()

class NewsletterResponseSchema(Schema):
    """Schema for newsletter responses"""
    id = fields.UUID()
    email = fields.Str()
    name = fields.Str()
    is_active = fields.Bool()
    subscribed_at = fields.DateTime()

class MenuCategoryResponseSchema(Schema):
    """Schema for menu category responses"""
    id = fields.UUID()
    name = fields.Str()
    description = fields.Str()
    display_order = fields.Int()
    is_active = fields.Bool()
    items = fields.Nested('MenuItemResponseSchema', many=True)

class MenuItemResponseSchema(Schema):
    """Schema for menu item responses"""
    id = fields.UUID()
    name = fields.Str()
    description = fields.Str()
    price = fields.Decimal()
    category_id = fields.UUID()
    is_vegetarian = fields.Bool()
    is_gluten_free = fields.Bool()
    is_spicy = fields.Bool()
    is_active = fields.Bool()
    display_order = fields.Int()

class TestimonialResponseSchema(Schema):
    """Schema for testimonial responses"""
    id = fields.UUID()
    customer_name = fields.Str()
    rating = fields.Int()
    comment = fields.Str()
    is_featured = fields.Bool()
    is_approved = fields.Bool()
    created_at = fields.DateTime()

class RestaurantInfoResponseSchema(Schema):
    """Schema for restaurant info responses"""
    id = fields.UUID()
    name = fields.Str()
    address = fields.Str()
    phone = fields.Str()
    email = fields.Str()
    website = fields.Str()
    description = fields.Str()
    mission = fields.Str()
    history = fields.Str()
    hours = fields.Dict()
    social_media = fields.Dict()
    updated_at = fields.DateTime()

class AwardResponseSchema(Schema):
    """Schema for award responses"""
    id = fields.UUID()
    name = fields.Str()
    description = fields.Str()
    year = fields.Int()
    category = fields.Str()
    image_url = fields.Str()
    is_featured = fields.Bool()
    display_order = fields.Int() 