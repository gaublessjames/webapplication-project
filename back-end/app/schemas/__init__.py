"""
Marshmallow schemas for request/response validation
"""

from .user_schema import UserSchema
from .reservation_schema import ReservationSchema
from .newsletter_schema import NewsletterSchema
from .menu_schema import MenuCategorySchema, MenuItemSchema
from .testimonial_schema import TestimonialSchema
from .restaurant_schema import RestaurantInfoSchema
from .award_schema import AwardSchema
from .customer_schema import CustomerSchema
from .profile_schema import ProfileSchema
from .gallery_schema import GalleryImageSchema

__all__ = [
    'UserSchema',
    'ReservationSchema',
    'NewsletterSchema', 
    'MenuCategorySchema',
    'MenuItemSchema',
    'TestimonialSchema',
    'RestaurantInfoSchema',
    'AwardSchema',
    'CustomerSchema',
    'ProfileSchema',
    'GalleryImageSchema'
]
