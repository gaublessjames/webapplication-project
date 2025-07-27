"""
Restaurant routes
"""

from flask import Blueprint, request, jsonify
import logging
from app.models import RestaurantInfo
from app.schemas import RestaurantInfoSchema
from app.extensions import db

restaurant_bp = Blueprint('restaurant', __name__)
logger = logging.getLogger('cafe_fausse_api')

@restaurant_bp.route('/info', methods=['GET'])
def get_restaurant_info():
    """Get restaurant information"""
    try:
        info = RestaurantInfo.query.first()
        if not info:
            return jsonify({'error': 'Restaurant information not found'}), 404
        return jsonify(info.to_dict()), 200
    except Exception as e:
        logger.error('Get restaurant info error: %s', str(e))
        return jsonify({'error': 'Failed to get restaurant info'}), 500

@restaurant_bp.route('/info', methods=['PUT'])
def update_restaurant_info():
    """Update restaurant information"""
    try:
        info = RestaurantInfo.query.first()
        if not info:
            info = RestaurantInfo()
            db.session.add(info)
        
        data = request.json
        for key, value in data.items():
            if hasattr(info, key):
                setattr(info, key, value)
        
        db.session.commit()
        return jsonify(info.to_dict()), 200
    except Exception as e:
        logger.error('Update restaurant info error: %s', str(e))
        db.session.rollback()
        return jsonify({'error': 'Failed to update restaurant info'}), 500 