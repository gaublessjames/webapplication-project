"""
Admin routes
"""

from flask import Blueprint, request, jsonify
import logging
from app.models import Reservation, Testimonial
from app.utils import admin_required
from app.extensions import db

admin_bp = Blueprint('admin', __name__)
logger = logging.getLogger('cafe_fausse_api')

@admin_bp.route('/reservations', methods=['GET'])
@admin_required
def get_all_reservations_admin():
    """Admin: Get all reservations with pagination"""
    try:
        # Get pagination parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        # Validate parameters
        if page < 1:
            page = 1
        if per_page < 1 or per_page > 100:
            per_page = 10
        
        # Get total count
        total = Reservation.query.count()
        
        # Get paginated reservations
        reservations = Reservation.query.order_by(Reservation.date, Reservation.time).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        # Calculate pagination info
        total_pages = reservations.pages if reservations.pages > 0 else 1
        
        return jsonify({
            'reservations': [r.to_dict() for r in reservations.items],
            'current_page': page,
            'pages': total_pages,
            'total': total,
            'per_page': per_page,
            'has_next': reservations.has_next,
            'has_prev': reservations.has_prev
        }), 200
    except Exception as e:
        logger.error('Admin get reservations error: %s', str(e))
        return jsonify({'error': 'Failed to get reservations'}), 500

@admin_bp.route('/testimonials', methods=['GET'])
@admin_required
def get_all_testimonials_admin():
    """Admin: Get all testimonials"""
    try:
        testimonials = Testimonial.query.order_by(Testimonial.created_at.desc()).all()
        return jsonify([t.to_dict() for t in testimonials]), 200
    except Exception as e:
        logger.error('Admin get testimonials error: %s', str(e))
        return jsonify({'error': 'Failed to get testimonials'}), 500

@admin_bp.route('/testimonials/<uuid:testimonial_id>', methods=['PATCH'])
@admin_required
def approve_testimonial(testimonial_id):
    """Admin: Approve a testimonial"""
    try:
        testimonial = Testimonial.query.get_or_404(testimonial_id)
        testimonial.is_approved = True
        db.session.commit()
        return jsonify(testimonial.to_dict()), 200
    except Exception as e:
        logger.error('Admin approve testimonial error: %s', str(e))
        db.session.rollback()
        return jsonify({'error': 'Failed to approve testimonial'}), 500 