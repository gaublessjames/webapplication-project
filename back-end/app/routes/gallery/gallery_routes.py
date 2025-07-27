"""
Gallery routes
"""

from flask import Blueprint, request, jsonify
import logging
import uuid
from app.models import GalleryImage
from app.schemas import GalleryImageSchema
from app.extensions import db
from app.utils.auth_utils import admin_required

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
@admin_required
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

@gallery_bp.route('/images/<string:image_id>', methods=['PUT'])
@admin_required
def update_gallery_image(image_id):
    """Update a gallery image"""
    try:
        # Convert string ID to UUID
        image_uuid = uuid.UUID(image_id)
        image = GalleryImage.query.get_or_404(image_uuid)
        data = request.json
        
        # Update fields
        if 'url' in data:
            image.url = data['url']
        if 'alt' in data:
            image.alt = data['alt']
        if 'category' in data:
            image.category = data['category']
        if 'display_order' in data:
            image.display_order = data['display_order']
        if 'is_active' in data:
            image.is_active = data['is_active']
        
        db.session.commit()
        return jsonify(image.to_dict()), 200
        
    except Exception as e:
        logger.error('Update gallery image error: %s', str(e))
        db.session.rollback()
        return jsonify({'error': 'Failed to update gallery image'}), 500

@gallery_bp.route('/images/<string:image_id>', methods=['DELETE'])
@admin_required
def delete_gallery_image(image_id):
    """Delete a gallery image"""
    try:
        # Convert string ID to UUID
        image_uuid = uuid.UUID(image_id)
        image = GalleryImage.query.get_or_404(image_uuid)
        db.session.delete(image)
        db.session.commit()
        return jsonify({'message': 'Gallery image deleted successfully'}), 200
        
    except Exception as e:
        logger.error('Delete gallery image error: %s', str(e))
        db.session.rollback()
        return jsonify({'error': 'Failed to delete gallery image'}), 500 