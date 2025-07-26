"""
Awards routes
"""

from flask import Blueprint, request, jsonify
import logging
from app.models import Award
from app.schemas import AwardSchema
from app.utils import login_required
from app.extensions import db

award_bp = Blueprint('awards', __name__)
logger = logging.getLogger('cafe_fausse_api')

@award_bp.route('/', methods=['GET'])
def get_awards():
    """Get all awards"""
    try:
        awards = Award.query.order_by(Award.display_order).all()
        return jsonify([a.to_dict() for a in awards]), 200
    except Exception as e:
        logger.error('Get awards error: %s', str(e))
        return jsonify({'error': 'Failed to get awards'}), 500

@award_bp.route('/', methods=['POST'])
@login_required
def create_award():
    """Create a new award"""
    try:
        data = request.json
        award = Award(**data)
        db.session.add(award)
        db.session.commit()
        return jsonify(award.to_dict()), 201
    except Exception as e:
        logger.error('Create award error: %s', str(e))
        db.session.rollback()
        return jsonify({'error': 'Failed to create award'}), 500 