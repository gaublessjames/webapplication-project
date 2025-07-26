"""
Menu routes
"""

from flask import Blueprint, request, jsonify
import logging
from app.models import MenuCategory, MenuItem
from app.schemas import MenuCategorySchema, MenuItemSchema
from app.utils import login_required
from app.extensions import db

menu_bp = Blueprint('menu', __name__)
logger = logging.getLogger('cafe_fausse_api')

@menu_bp.route('/categories', methods=['GET'])
def get_menu_categories():
    """Get all menu categories with their items"""
    try:
        categories = MenuCategory.query.filter_by(is_active=True).order_by(MenuCategory.display_order).all()
        return jsonify([category.to_dict() for category in categories]), 200
    except Exception as e:
        logger.error('Get menu categories error: %s', str(e))
        return jsonify({'error': 'Failed to get menu categories'}), 500

@menu_bp.route('/categories', methods=['POST'])
@login_required
def create_menu_category():
    """Create a new menu category"""
    try:
        data = request.json
        category = MenuCategory(**data)
        db.session.add(category)
        db.session.commit()
        return jsonify(category.to_dict()), 201
    except Exception as e:
        logger.error('Create menu category error: %s', str(e))
        db.session.rollback()
        return jsonify({'error': 'Failed to create menu category'}), 500

@menu_bp.route('/items', methods=['POST'])
@login_required
def create_menu_item():
    """Create a new menu item"""
    try:
        data = request.json
        item = MenuItem(**data)
        db.session.add(item)
        db.session.commit()
        return jsonify(item.to_dict()), 201
    except Exception as e:
        logger.error('Create menu item error: %s', str(e))
        db.session.rollback()
        return jsonify({'error': 'Failed to create menu item'}), 500 