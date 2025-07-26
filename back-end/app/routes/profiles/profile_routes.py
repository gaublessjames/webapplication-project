"""
Profiles routes
"""

from flask import Blueprint, request, jsonify
import logging
from app.models import Profile
from app.schemas import ProfileSchema
from app.extensions import db

profile_bp = Blueprint('profiles', __name__)
logger = logging.getLogger('cafe_fausse_api')

@profile_bp.route('/', methods=['GET'])
def get_profiles():
    """Get all profiles"""
    try:
        profiles = Profile.query.order_by(Profile.created_at.desc()).all()
        return jsonify([p.to_dict() for p in profiles]), 200
    except Exception as e:
        logger.error('Get profiles error: %s', str(e))
        return jsonify({'error': 'Failed to get profiles'}), 500

@profile_bp.route('/', methods=['POST'])
def create_profile():
    """Create a new profile"""
    try:
        data = request.json
        profile = Profile(**data)
        db.session.add(profile)
        db.session.commit()
        return jsonify(profile.to_dict()), 201
    except Exception as e:
        logger.error('Create profile error: %s', str(e))
        db.session.rollback()
        return jsonify({'error': 'Failed to create profile'}), 500 