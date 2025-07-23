from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from datetime import datetime, date, time
from sqlalchemy import and_, or_
import uuid

from models import db, Reservation, NewsletterSubscriber, MenuCategory, MenuItem, Testimonial, RestaurantInfo, Award
from schemas import (
    ReservationSchema, NewsletterSchema, MenuCategorySchema, MenuItemSchema,
    TestimonialSchema, RestaurantInfoSchema, AwardSchema
)

api_bp = Blueprint('api', __name__)

# Reservation endpoints
@api_bp.route('/reservations', methods=['POST'])
def create_reservation():
    """Create a new table reservation"""
    try:
        schema = ReservationSchema()
        data = schema.load(request.json)
        
        # Check for existing reservation conflicts
        existing_reservation = Reservation.query.filter(
            and_(
                Reservation.date == data['date'],
                Reservation.time == data['time'],
                Reservation.status.in_(['pending', 'confirmed'])
            )
        ).first()
        
        if existing_reservation:
            return jsonify({'error': 'Time slot not available'}), 409
        
        # Create new reservation
        reservation = Reservation(**data)
        db.session.add(reservation)
        db.session.commit()
        
        return jsonify({
            'message': 'Reservation created successfully',
            'reservation': reservation.to_dict()
        }), 201
        
    except ValidationError as e:
        return jsonify({'error': 'Validation error', 'details': e.messages}), 400
    except Exception as e:
        print('error', e)
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@api_bp.route('/reservations', methods=['GET'])
def get_reservations():
    """Get all reservations (admin only)"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status')
        date_filter = request.args.get('date')
        
        query = Reservation.query
        
        if status:
            query = query.filter(Reservation.status == status)
        if date_filter:
            query = query.filter(Reservation.date == datetime.strptime(date_filter, '%Y-%m-%d').date())
        
        reservations = query.order_by(Reservation.date.desc(), Reservation.time.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'reservations': [r.to_dict() for r in reservations.items],
            'total': reservations.total,
            'pages': reservations.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@api_bp.route('/reservations/<uuid:reservation_id>', methods=['GET'])
def get_reservation(reservation_id):
    """Get a specific reservation"""
    try:
        reservation = Reservation.query.get_or_404(reservation_id)
        return jsonify(reservation.to_dict()), 200
    except Exception as e:
        return jsonify({'error': 'Reservation not found'}), 404

@api_bp.route('/reservations/<uuid:reservation_id>', methods=['PUT'])
def update_reservation(reservation_id):
    """Update reservation status (admin only)"""
    try:
        reservation = Reservation.query.get_or_404(reservation_id)
        data = request.json
        
        if 'status' in data:
            reservation.status = data['status']
        
        db.session.commit()
        return jsonify({
            'message': 'Reservation updated successfully',
            'reservation': reservation.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

# Newsletter endpoints
@api_bp.route('/newsletter/subscribe', methods=['POST'])
def subscribe_newsletter():
    """Subscribe to newsletter"""
    try:
        schema = NewsletterSchema()
        data = schema.load(request.json)
        
        # Check if already subscribed
        existing = NewsletterSubscriber.query.filter_by(email=data['email']).first()
        if existing:
            if existing.is_active:
                return jsonify({'error': 'Email already subscribed'}), 409
            else:
                existing.is_active = True
                existing.name = data.get('name', existing.name)
                db.session.commit()
                return jsonify({'message': 'Resubscribed successfully'}), 200
        
        # Create new subscription
        subscriber = NewsletterSubscriber(**data)
        db.session.add(subscriber)
        db.session.commit()
        
        return jsonify({'message': 'Subscribed successfully'}), 201
        
    except ValidationError as e:
        return jsonify({'error': 'Validation error', 'details': e.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@api_bp.route('/newsletter/unsubscribe', methods=['POST'])
def unsubscribe_newsletter():
    """Unsubscribe from newsletter"""
    try:
        email = request.json.get('email')
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        subscriber = NewsletterSubscriber.query.filter_by(email=email).first()
        if not subscriber:
            return jsonify({'error': 'Email not found'}), 404
        
        subscriber.is_active = False
        db.session.commit()
        
        return jsonify({'message': 'Unsubscribed successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

# Menu endpoints
@api_bp.route('/menu/categories', methods=['GET'])
def get_menu_categories():
    """Get all menu categories with items"""
    try:
        categories = MenuCategory.query.filter_by(is_active=True).order_by(MenuCategory.display_order).all()
        return jsonify([cat.to_dict() for cat in categories]), 200
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@api_bp.route('/menu/categories', methods=['POST'])
def create_menu_category():
    """Create a new menu category (admin only)"""
    try:
        schema = MenuCategorySchema()
        data = schema.load(request.json)
        
        category = MenuCategory(**data)
        db.session.add(category)
        db.session.commit()
        
        return jsonify({
            'message': 'Category created successfully',
            'category': category.to_dict()
        }), 201
        
    except ValidationError as e:
        return jsonify({'error': 'Validation error', 'details': e.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@api_bp.route('/menu/items', methods=['POST'])
def create_menu_item():
    """Create a new menu item (admin only)"""
    try:
        schema = MenuItemSchema()
        data = schema.load(request.json)
        
        item = MenuItem(**data)
        db.session.add(item)
        db.session.commit()
        
        return jsonify({
            'message': 'Menu item created successfully',
            'item': item.to_dict()
        }), 201
        
    except ValidationError as e:
        return jsonify({'error': 'Validation error', 'details': e.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

# Testimonial endpoints
@api_bp.route('/testimonials', methods=['GET'])
def get_testimonials():
    """Get approved testimonials"""
    try:
        featured_only = request.args.get('featured', 'false').lower() == 'true'
        query = Testimonial.query.filter_by(is_approved=True)
        
        if featured_only:
            query = query.filter_by(is_featured=True)
        
        testimonials = query.order_by(Testimonial.created_at.desc()).all()
        return jsonify([t.to_dict() for t in testimonials]), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@api_bp.route('/testimonials', methods=['POST'])
def create_testimonial():
    """Create a new testimonial"""
    try:
        schema = TestimonialSchema()
        data = schema.load(request.json)
        
        testimonial = Testimonial(**data)
        db.session.add(testimonial)
        db.session.commit()
        
        return jsonify({
            'message': 'Testimonial submitted successfully',
            'testimonial': testimonial.to_dict()
        }), 201
        
    except ValidationError as e:
        return jsonify({'error': 'Validation error', 'details': e.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

# Restaurant info endpoints
@api_bp.route('/restaurant/info', methods=['GET'])
def get_restaurant_info():
    """Get restaurant information"""
    try:
        info = RestaurantInfo.query.first()
        if not info:
            return jsonify({'error': 'Restaurant information not found'}), 404
        
        return jsonify(info.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@api_bp.route('/restaurant/info', methods=['PUT'])
def update_restaurant_info():
    """Update restaurant information (admin only)"""
    try:
        info = RestaurantInfo.query.first()
        if not info:
            info = RestaurantInfo()
            db.session.add(info)
        
        schema = RestaurantInfoSchema()
        data = schema.load(request.json)
        
        for key, value in data.items():
            setattr(info, key, value)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Restaurant information updated successfully',
            'info': info.to_dict()
        }), 200
        
    except ValidationError as e:
        return jsonify({'error': 'Validation error', 'details': e.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

# Awards endpoints
@api_bp.route('/awards', methods=['GET'])
def get_awards():
    """Get all awards"""
    try:
        featured_only = request.args.get('featured', 'false').lower() == 'true'
        query = Award.query
        
        if featured_only:
            query = query.filter_by(is_featured=True)
        
        awards = query.order_by(Award.display_order, Award.year.desc()).all()
        return jsonify([a.to_dict() for a in awards]), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@api_bp.route('/awards', methods=['POST'])
def create_award():
    """Create a new award (admin only)"""
    try:
        schema = AwardSchema()
        data = schema.load(request.json)
        
        award = Award(**data)
        db.session.add(award)
        db.session.commit()
        
        return jsonify({
            'message': 'Award created successfully',
            'award': award.to_dict()
        }), 201
        
    except ValidationError as e:
        return jsonify({'error': 'Validation error', 'details': e.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

# Availability check endpoint
@api_bp.route('/reservations/availability', methods=['GET'])
def check_availability():
    """Check reservation availability for a specific date and time"""
    try:
        date_str = request.args.get('date')
        time_str = request.args.get('time')
        
        if not date_str or not time_str:
            return jsonify({'error': 'Date and time are required'}), 400
        
        try:
            check_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            check_time = datetime.strptime(time_str, '%H:%M').time()
        except ValueError:
            return jsonify({'error': 'Invalid date or time format'}), 400
        
        # Check for existing reservations
        existing = Reservation.query.filter(
            and_(
                Reservation.date == check_date,
                Reservation.time == check_time,
                Reservation.status.in_(['pending', 'confirmed'])
            )
        ).first()
        
        return jsonify({
            'date': date_str,
            'time': time_str,
            'available': existing is None
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500 