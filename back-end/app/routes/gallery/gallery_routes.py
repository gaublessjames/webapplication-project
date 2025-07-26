"""
Gallery routes
"""

from flask import Blueprint, request, jsonify
import logging
from app.models import GalleryImage
from app.schemas import GalleryImageSchema
from app.extensions import db

gallery_bp = Blueprint('gallery', __name__)
logger = logging.getLogger('cafe_fausse_api')

@gallery_bp.route('/images', methods=['GET'])
def get_gallery_images():
    """Get all gallery images"""
    try:
        images = GalleryImage.query.filter_by(is_active=True).order_by(GalleryImage.display_order).all()
        return jsonify([img.to_dict() for img in images]), 200
    except Exception as e:
        logger.error('Get gallery images error: %s', str(e))
        return jsonify({'error': 'Failed to get gallery images'}), 500

@gallery_bp.route('/images', methods=['POST'])
def create_gallery_image():
    """Create a new gallery image"""
    try:
        data = request.json
        image = GalleryImage(**data)
        db.session.add(image)
        db.session.commit()
        return jsonify(image.to_dict()), 201
    except Exception as e:
        logger.error('Create gallery image error: %s', str(e))
        db.session.rollback()
        return jsonify({'error': 'Failed to create gallery image'}), 500 