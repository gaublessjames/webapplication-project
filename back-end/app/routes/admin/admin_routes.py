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
    """Admin: Get all reservations"""
    try:
        reservations = Reservation.query.order_by(Reservation.date, Reservation.time).all()
        return jsonify([r.to_dict() for r in reservations]), 200
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