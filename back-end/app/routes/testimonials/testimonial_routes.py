"""
Testimonials routes
"""

from flask import Blueprint, request, jsonify
import logging
from app.models import Testimonial
from app.schemas import TestimonialSchema
from app.utils import validate_rating
from app.extensions import db

testimonial_bp = Blueprint('testimonials', __name__)
logger = logging.getLogger('cafe_fausse_api')

@testimonial_bp.route('/', methods=['GET'])
def get_testimonials():
    """Get all approved testimonials"""
    try:
        testimonials = Testimonial.query.filter_by(is_approved=True).order_by(Testimonial.created_at.desc()).all()
        return jsonify([t.to_dict() for t in testimonials]), 200
    except Exception as e:
        logger.error('Get testimonials error: %s', str(e))
        return jsonify({'error': 'Failed to get testimonials'}), 500

@testimonial_bp.route('/', methods=['POST'])
def create_testimonial():
    """Create a new testimonial"""
    try:
        data = request.json
        if not validate_rating(data.get('rating')):
            return jsonify({'error': 'Rating must be between 1 and 5'}), 400
            
        testimonial = Testimonial(**data)
        db.session.add(testimonial)
        db.session.commit()
        return jsonify(testimonial.to_dict()), 201
    except Exception as e:
        logger.error('Create testimonial error: %s', str(e))
        db.session.rollback()
        return jsonify({'error': 'Failed to create testimonial'}), 500 