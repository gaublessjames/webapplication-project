"""
Newsletter routes
"""

from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
import logging
from app.models import NewsletterSubscriber
from app.schemas import NewsletterSchema
from app.extensions import db

newsletter_bp = Blueprint('newsletter', __name__)
logger = logging.getLogger('cafe_fausse_api')

@newsletter_bp.route('/subscribe', methods=['POST'])
def subscribe():
    """Subscribe to newsletter"""
    try:
        data = request.json
        
        # Validate input data
        schema = NewsletterSchema()
        try:
            validated_data = schema.load(data)
        except ValidationError as e:
            return jsonify({'error': 'Validation error', 'details': e.messages}), 400
        
        # Check if email already exists
        existing_subscriber = NewsletterSubscriber.query.filter_by(
            email=validated_data['email']
        ).first()
        
        if existing_subscriber:
            # Update existing subscriber
            existing_subscriber.name = validated_data.get('name', existing_subscriber.name)
            existing_subscriber.is_active = True
            db.session.commit()
            return jsonify({
                'message': 'Newsletter subscription updated successfully',
                'subscriber': existing_subscriber.to_dict()
            }), 200
        
        # Create new subscriber
        subscriber = NewsletterSubscriber(
            email=validated_data['email'],
            name=validated_data.get('name'),
            is_active=True
        )
        
        db.session.add(subscriber)
        db.session.commit()
        
        return jsonify({
            'message': 'Newsletter subscription successful',
            'subscriber': subscriber.to_dict()
        }), 201
        
    except Exception as e:
        logger.error('Newsletter subscription error: %s', str(e))
        db.session.rollback()
        return jsonify({'error': 'Failed to subscribe to newsletter'}), 500

@newsletter_bp.route('/subscribers', methods=['GET'])
def get_subscribers():
    """Get all newsletter subscribers (admin only)"""
    try:
        subscribers = NewsletterSubscriber.query.filter_by(is_active=True).all()
        return jsonify([s.to_dict() for s in subscribers]), 200
    except Exception as e:
        logger.error('Get subscribers error: %s', str(e))
        return jsonify({'error': 'Failed to get subscribers'}), 500 