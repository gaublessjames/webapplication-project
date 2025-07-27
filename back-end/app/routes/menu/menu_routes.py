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

@menu_bp.route('/categories/<uuid:category_id>', methods=['PUT'])
@login_required
def update_menu_category(category_id):
    """Update a menu category"""
    try:
        category = MenuCategory.query.get_or_404(category_id)
        data = request.json
        
        # Update fields
        if 'name' in data:
            category.name = data['name']
        if 'description' in data:
            category.description = data['description']
        if 'display_order' in data:
            category.display_order = data['display_order']
        if 'is_active' in data:
            category.is_active = data['is_active']
        if 'icon' in data:
            category.icon = data['icon']
        
        db.session.commit()
        return jsonify(category.to_dict()), 200
        
    except Exception as e:
        logger.error('Update menu category error: %s', str(e))
        db.session.rollback()
        return jsonify({'error': 'Failed to update menu category'}), 500

@menu_bp.route('/items/<uuid:item_id>', methods=['PUT'])
@login_required
def update_menu_item(item_id):
    """Update a menu item"""
    try:
        item = MenuItem.query.get_or_404(item_id)
        data = request.json
        
        # Update fields
        if 'name' in data:
            item.name = data['name']
        if 'description' in data:
            item.description = data['description']
        if 'price' in data:
            item.price = data['price']
        if 'category_id' in data:
            item.category_id = data['category_id']
        if 'is_vegetarian' in data:
            item.is_vegetarian = data['is_vegetarian']
        if 'is_gluten_free' in data:
            item.is_gluten_free = data['is_gluten_free']
        if 'is_spicy' in data:
            item.is_spicy = data['is_spicy']
        if 'is_active' in data:
            item.is_active = data['is_active']
        
        db.session.commit()
        return jsonify(item.to_dict()), 200
        
    except Exception as e:
        logger.error('Update menu item error: %s', str(e))
        db.session.rollback()
        return jsonify({'error': 'Failed to update menu item'}), 500 