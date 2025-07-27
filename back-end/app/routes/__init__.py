"""
API routes module
"""

from flask import Blueprint
from .auth import auth_bp
from .reservations import reservation_bp
from .menu import menu_bp
from .testimonials import testimonial_bp
from .restaurant import restaurant_bp
from .awards import award_bp
from .customers import customer_bp
from .profiles import profile_bp
from .gallery import gallery_bp
from .newsletter import newsletter_bp
from .admin import admin_bp

# Create main API blueprint
api_bp = Blueprint('api', __name__)

# Register all route blueprints
api_bp.register_blueprint(auth_bp, url_prefix='/auth')
api_bp.register_blueprint(reservation_bp, url_prefix='/reservations')
api_bp.register_blueprint(menu_bp, url_prefix='/menu')
api_bp.register_blueprint(testimonial_bp, url_prefix='/testimonials')
api_bp.register_blueprint(restaurant_bp, url_prefix='/restaurant')
api_bp.register_blueprint(award_bp, url_prefix='/awards')
api_bp.register_blueprint(customer_bp, url_prefix='/customers')
api_bp.register_blueprint(profile_bp, url_prefix='/profiles')
api_bp.register_blueprint(gallery_bp, url_prefix='/gallery')
api_bp.register_blueprint(newsletter_bp, url_prefix='/newsletter')
api_bp.register_blueprint(admin_bp, url_prefix='/admin')
