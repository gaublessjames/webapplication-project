from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from datetime import datetime, date, time
from sqlalchemy import and_, or_
import uuid
import traceback
import os
import bcrypt
import jwt as pyjwt
from flask import current_app
from functools import wraps
import logging
from werkzeug.security import generate_password_hash
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from flask import url_for
from werkzeug.utils import secure_filename
import mimetypes

ALLOWED_IMAGE_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif', 'webp'}
GALLERY_UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'static', 'gallery')

from models import db, Reservation, NewsletterSubscriber, MenuCategory, MenuItem, Testimonial, RestaurantInfo, Award, User, Customer, Profile, GalleryImage
from schemas import (
    ReservationSchema, NewsletterSchema, MenuCategorySchema, MenuItemSchema,
    TestimonialSchema, RestaurantInfoSchema, AwardSchema, UserSchema, CustomerSchema, ProfileSchema, GalleryImageSchema
)

api_bp = Blueprint('api', __name__)

# JWT helper functions
SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
TOKEN_SALT = 'cafe-fausse-auth-salt'

def generate_jwt(user_id, purpose=None):
    payload = {'user_id': str(user_id)}
    if purpose:
        payload['purpose'] = purpose
    return pyjwt.encode(payload, SECRET_KEY, algorithm='HS256')

def decode_jwt(token):
    try:
        payload = pyjwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except Exception:
        return None

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', None)
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing or invalid token'}), 401
        token = auth_header.split(' ')[1]
        payload = decode_jwt(token)
        if not payload or 'user_id' not in payload:
            return jsonify({'error': 'Invalid or expired token'}), 401
        request.user_id = payload['user_id']
        return f(*args, **kwargs)
    return decorated

# Set up logger
logger = logging.getLogger('cafe_fausse_api')
logging.basicConfig(level=logging.INFO)

def ensure_demo_users():
    from models import db, User
    import bcrypt
    demo_users = [
        {"email": "demo@cafefausse.com", "full_name": "Demo User", "role": "user"},
        {"email": "admin@cafefausse.com", "full_name": "Admin User", "role": "admin"},
    ]
    password = "demo123456"
    for user_info in demo_users:
        user = User.query.filter_by(email=user_info["email"]).first()
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        if not user:
            user = User(email=user_info["email"], full_name=user_info["full_name"], role=user_info["role"])
            user.password_hash = hashed
            db.session.add(user)
        else:
            # Always set the correct role and password hash
            user.role = user_info["role"]
            if not hasattr(user, 'password_hash') or not user.password_hash:
                user.password_hash = hashed
    db.session.commit()

# Auth endpoints
@api_bp.route('/auth/register', methods=['POST'])
def register():
    try:
        logger.info('Register payload: %s', request.json)
        data = request.json
        email = data.get('email')
        password = data.get('password')
        full_name = data.get('full_name')
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already registered'}), 409
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        user = User(email=email, full_name=full_name, role='user', is_active=False)
        user.password_hash = hashed.decode('utf-8')
        db.session.add(user)
        db.session.commit()
        # Simulate email verification link
        verify_token = generate_jwt(user.id, purpose='verify')
        verify_url = url_for('api.verify_email', token=verify_token, _external=True)
        return jsonify({
            'message': 'User registered. Please verify your email (simulation).',
            'token': generate_jwt(user.id),
            'user': user.to_dict(),
            'verification_link': verify_url,
            'note': 'This is a simulation. Click the link to verify your email.'
        }), 201
    except Exception as e:
        logger.exception('Internal server error during registration')
        db.session.rollback()
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500

# Simulated email verification endpoint
@api_bp.route('/auth/verify/<token>', methods=['GET'])
def verify_email(token):
    try:
        payload = decode_jwt(token)
        if not payload or payload.get('purpose') != 'verify':
            return jsonify({'error': 'Invalid or expired verification link.'}), 400
        user_id = payload.get('user_id')
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found.'}), 404
        if user.is_active:
            return jsonify({'message': 'User already verified.'}), 200
        user.is_active = True
        db.session.commit()
        logger.info(f'User {user.email} (id={user.id}) marked as verified (is_active=True) via simulation.')
        return jsonify({'message': 'Email verified (simulation). You can now log in.'}), 200
    except Exception as e:
        logger.exception('Error during email verification')
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500

# Update login to require is_active
@api_bp.route('/auth/login', methods=['POST'])
def login():
    try:
        logger.info('Login payload: %s', request.json)
        data = request.json
        email = data.get('email')
        password = data.get('password')
        user = User.query.filter_by(email=email).first()
        if not user or not hasattr(user, 'password_hash'):
            logger.warning(f"Login failed: User not found or missing password_hash for email={email}")
            return jsonify({'error': 'Invalid credentials'}), 401
        if not bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
            logger.warning(f"Login failed: Incorrect password for email={email}")
            return jsonify({'error': 'Invalid credentials'}), 401
        token = generate_jwt(user.id)
        return jsonify({'message': 'Login successful', 'token': token, 'user': user.to_dict()}), 200
    except Exception as e:
        logger.exception(f'Internal server error during login for email={request.json.get("email") if request.json else None}')
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500

@api_bp.route('/auth/user', methods=['GET'])
@login_required
def get_current_user():
    try:
        user = User.query.get(request.user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify({'user': user.to_dict()}), 200
    except Exception as e:
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500

# User endpoints
@api_bp.route('/users', methods=['POST'])
def create_user():
    """Create a new user"""
    try:
        schema = UserSchema()
        data = schema.load(request.json)
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 409
        user = User(**data)
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'User created successfully', 'user': user.to_dict()}), 201
    except ValidationError as e:
        return jsonify({'error': 'Validation error', 'details': e.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500

@api_bp.route('/users', methods=['GET'])
def get_users():
    """Get all users (admin only)"""
    try:
        users = User.query.all()
        return jsonify({'users': [u.to_dict() for u in users]}), 200
    except Exception as e:
        import traceback
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500

@api_bp.route('/users/<uuid:user_id>', methods=['GET'])
def get_user(user_id):
    """Get a specific user"""
    try:
        user = User.query.get_or_404(user_id)
        return jsonify(user.to_dict()), 200
    except Exception as e:
        return jsonify({'error': 'User not found'}), 404

@api_bp.route('/users/<uuid:user_id>', methods=['PUT'])
def update_user(user_id):
    """Update a user (admin only)"""
    try:
        user = User.query.get_or_404(user_id)
        data = request.json
        for key, value in data.items():
            if hasattr(user, key):
                setattr(user, key, value)
        db.session.commit()
        return jsonify({'message': 'User updated successfully', 'user': user.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@api_bp.route('/users/<uuid:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Delete a user (admin only)"""
    try:
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

# Reservation endpoints
@api_bp.route('/reservations/user/<uuid:user_id>', methods=['GET'])
def get_user_reservations(user_id):
    """Get all reservations for a specific user"""
    try:
        reservations = Reservation.query.filter_by(user_id=user_id).order_by(Reservation.date.desc(), Reservation.time.desc()).all()
        return jsonify({'reservations': [r.to_dict() for r in reservations]}), 200
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@api_bp.route('/reservations', methods=['POST'])
def create_reservation():
    try:
        logger.info('Reservation payload: %s', request.json)
        schema = ReservationSchema()
        data = schema.load(request.json)
        # Ensure required fields are present after mapping
        required = ['date', 'time', 'party_size', 'customer_id', 'name', 'email', 'phone']
        for field in required:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
                
        # Check if we've reached the maximum number of tables for the day (30)
        reservation_date = data['date']
        active_reservations = Reservation.query.filter(
            Reservation.date == reservation_date,
            Reservation.status.in_(['pending', 'confirmed'])
        ).count()
        
        if active_reservations >= 30:
            return jsonify({
                'error': 'No tables available for this date',
                'tables_remaining': 0
            }), 400
            
        # Find an available table number (1-30)
        used_table_numbers = db.session.query(Reservation.table_number).filter(
            Reservation.date == reservation_date,
            Reservation.status.in_(['pending', 'confirmed']),
            Reservation.table_number.isnot(None)
        ).all()
        
        used_table_numbers = [t[0] for t in used_table_numbers if t[0] is not None]
        available_table_numbers = [i for i in range(1, 31) if i not in used_table_numbers]
        
        if not available_table_numbers:
            # This shouldn't happen if we check the count above, but just in case
            return jsonify({
                'error': 'No tables available for this date',
                'tables_remaining': 0
            }), 400
            
        # Assign the first available table number
        assigned_table = available_table_numbers[0]
        
        # Create new reservation
        reservation = Reservation(
            name=data['name'],
            email=data['email'],
            phone=data['phone'],
            date=data['date'],
            time=data['time'],
            party_size=data['party_size'],
            special_requests=data.get('special_requests'),
            status='pending',
            user_id=data.get('user_id'),
            table_number=assigned_table
        )
        # Optionally link customer_id if Reservation model supports it
        if hasattr(reservation, 'customer_id'):
            reservation.customer_id = data['customer_id']
        db.session.add(reservation)
        db.session.commit()

        # --- Newsletter logic ---
        if data.get('newsletter_signup'):
            email = data['email']
            name = data.get('name')
            existing = NewsletterSubscriber.query.filter_by(email=email).first()
            if existing:
                if not existing.is_active:
                    existing.is_active = True
                    existing.name = name or existing.name
                    db.session.commit()
            else:
                subscriber = NewsletterSubscriber(email=email, name=name, is_active=True)
                db.session.add(subscriber)
                db.session.commit()
        # --- End newsletter logic ---

        # Calculate tables remaining
        tables_remaining = 30 - (active_reservations + 1)

        return jsonify({
            'message': 'Reservation created successfully',
            'reservation': reservation.to_dict(),
            'tables_remaining': tables_remaining
        }), 201
    except ValidationError as e:
        logger.error('Validation error: %s', e.messages)
        return jsonify({'error': 'Validation error', 'details': e.messages}), 400
    except Exception as e:
        logger.exception('Internal server error during reservation creation')
        db.session.rollback()
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500

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
        import traceback
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500

@api_bp.route('/reservations/<uuid:reservation_id>', methods=['GET'])
def get_reservation(reservation_id):
    """Get a specific reservation"""
    import logging
    try:
        logging.info(f"Fetching reservation with id: {reservation_id}")
        reservation = Reservation.query.get_or_404(reservation_id)
        return jsonify(reservation.to_dict()), 200
    except Exception as e:
        logging.exception(f"Error fetching reservation with id: {reservation_id}")
        return jsonify({'error': 'Reservation not found'}), 404

@api_bp.route('/reservations/<reservation_id>', methods=['GET'])
def get_reservation_fallback(reservation_id):
    from uuid import UUID
    import logging
    try:
        # Try to parse as UUID
        UUID(reservation_id)
        # If this succeeds, the <uuid:reservation_id> route should have matched, so this is a fallback for malformed UUIDs only
        logging.warning(f"Fallback route hit for valid UUID: {reservation_id}")
        return jsonify({'error': 'Reservation not found'}), 404
    except Exception:
        logging.warning(f"Invalid reservation ID format: {reservation_id}")
        return jsonify({'error': 'Invalid reservation ID format. Please check your link or contact support.'}), 400

@api_bp.route('/reservations/<uuid:reservation_id>', methods=['PUT'])
def update_reservation(reservation_id):
    """Update reservation fields (admin only)"""
    try:
        logger.info(f"Update reservation {reservation_id} payload: {request.json}")
        reservation = Reservation.query.get_or_404(reservation_id)
        data = request.json

        if 'party_size' in data:
            reservation.party_size = data['party_size']
        if 'date' in data:
            reservation.date = data['date']
        if 'time' in data:
            reservation.time = data['time']
        if 'table_number' in data:
            reservation.table_number = data['table_number']
        if 'status' in data:
            reservation.status = data['status']

        db.session.commit()
        logger.info(f"Reservation {reservation_id} updated successfully.")
        return jsonify({
            'message': 'Reservation updated successfully',
            'reservation': reservation.to_dict()
        }), 200
    except Exception as e:
        logger.exception(f"Error updating reservation {reservation_id}: {e}")
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@api_bp.route('/admin/reservations/<uuid:reservation_id>', methods=['PUT'])
@login_required
def admin_update_reservation(reservation_id):
    user = User.query.get(request.user_id)
    if not user or user.role != 'admin':
        logger.warning(f"Admin update denied for reservation {reservation_id} by user {getattr(user, 'email', None)}")
        return jsonify({'error': 'Admin access required'}), 403
    logger.info(f"Admin update for reservation {reservation_id} by {user.email}")
    return update_reservation(reservation_id)

@api_bp.route('/reservations/cancel/<uuid:reservation_id>', methods=['GET', 'POST', 'PATCH'])
def cancel_reservation(reservation_id):
    import logging
    from datetime import datetime
    try:
        if request.method == 'GET':
            logging.info(f"Fetch reservation for cancel by id: {reservation_id}")
            reservation = Reservation.query.filter_by(id=reservation_id).first()
            if not reservation:
                return jsonify({'error': 'Reservation not found'}), 404
            return jsonify({'reservation': reservation.to_dict()}), 200
        # POST/PATCH: cancel logic
        logging.info(f"Cancel request for reservation_id: {reservation_id}")
        data = request.get_json(silent=True) or {}
        email = data.get('email')
        reservation = Reservation.query.filter_by(id=reservation_id).first()
        logging.info(f"Reservation found: {reservation is not None}")
        if not reservation:
            return jsonify({'error': 'Reservation not found'}), 404
        # Optional: check email matches for extra security
        if email and reservation.email and reservation.email != email:
            return jsonify({'error': 'Email does not match reservation'}), 403
        now = datetime.utcnow().date()
        if reservation.date == now:
            return jsonify({'error': 'Reservations can only be cancelled before the day of the event.'}), 403
        reservation_date = reservation.date
        reservation.status = 'cancelled'
        db.session.commit()
        active_reservations = Reservation.query.filter(
            Reservation.date == reservation_date,
            Reservation.status.in_(['pending', 'confirmed'])
        ).count()
        tables_remaining = 30 - active_reservations
        return jsonify({
            'message': 'Reservation cancelled successfully',
            'reservation_id': str(reservation_id),
            'tables_remaining': tables_remaining
        }), 200
    except Exception as e:
        logging.exception(f"Error in cancel_reservation with id: {reservation_id}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Newsletter endpoints
@api_bp.route('/newsletter/subscribe', methods=['POST'])
def subscribe_newsletter():
    try:
        logger.info('Newsletter subscribe payload: %s', request.json)
        schema = NewsletterSchema()
        data = schema.load(request.json)
        # Always create or update in newsletter_subscribers
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
        logger.error('Validation error: %s', e.messages)
        return jsonify({'error': 'Validation error', 'details': e.messages}), 400
    except Exception as e:
        logger.exception('Internal server error during newsletter subscribe')
        db.session.rollback()
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500

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
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500

@api_bp.route('/menu/categories/<uuid:category_id>', methods=['PUT'])
@login_required
def update_menu_category(category_id):
    """Update a menu category (admin only)"""
    try:
        category = MenuCategory.query.get_or_404(category_id)
        data = request.json or {}
        for field in ['name', 'description', 'display_order', 'is_active']:
            if field in data:
                setattr(category, field, data[field])
        db.session.commit()
        return jsonify(category.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

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
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500

@api_bp.route('/menu/items/<uuid:item_id>', methods=['PUT'])
@login_required
def update_menu_item(item_id):
    """Update a menu item (admin only)"""
    try:
        item = MenuItem.query.get_or_404(item_id)
        schema = MenuItemSchema(partial=True)
        data = schema.load(request.json)
        for key, value in data.items():
            setattr(item, key, value)
        db.session.commit()
        return jsonify({'message': 'Menu item updated successfully', 'item': item.to_dict()}), 200
    except ValidationError as e:
        return jsonify({'error': 'Validation error', 'details': e.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500

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
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500

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
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500

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
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500

@api_bp.route('/awards/<uuid:award_id>', methods=['PUT'])
@login_required
def update_award(award_id):
    """Update an award (admin only)"""
    try:
        award = Award.query.get_or_404(award_id)
        data = request.json or {}
        for field in ['name', 'description', 'year', 'category', 'image_url', 'is_featured', 'display_order']:
            if field in data:
                setattr(award, field, data[field])
        db.session.commit()
        return jsonify(award.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

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
        
        # Count active reservations for the date
        active_reservations = Reservation.query.filter(
            Reservation.date == check_date,
            Reservation.status.in_(['pending', 'confirmed'])
        ).count()
        
        # Check if we've reached the maximum number of tables (30)
        tables_remaining = 30 - active_reservations
        is_available = tables_remaining > 0
        
        return jsonify({
            'date': date_str,
            'time': time_str,
            'available': is_available,
            'tables_remaining': tables_remaining
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500 

# Customer endpoints
@api_bp.route('/customers', methods=['POST'])
def create_customer():
    try:
        logger.info('Create customer payload: %s', request.json)
        schema = CustomerSchema()
        data = schema.load(request.json)
        if Customer.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 409
        customer = Customer(**data)
        db.session.add(customer)
        db.session.commit()
        return jsonify({'message': 'Customer created successfully', 'customer': customer.to_dict()}), 201
    except ValidationError as e:
        logger.error('Validation error: %s', e.messages)
        return jsonify({'error': 'Validation error', 'details': e.messages}), 400
    except Exception as e:
        logger.exception('Internal server error during customer creation')
        db.session.rollback()
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500

@api_bp.route('/customers', methods=['GET'])
def get_customers():
    email = request.args.get('email')
    if email:
        customer = Customer.query.filter_by(email=email).first()
        if not customer:
            return jsonify({'error': 'Customer not found'}), 404
        # Fetch reservations for this customer
        reservations = []
        try:
            reservations = Reservation.query.filter_by(customer_id=customer.id).all()
        except Exception:
            # Fallback: try by email if customer_id is not set
            reservations = Reservation.query.filter_by(email=customer.email).all()
        customer_data = customer.to_dict()
        customer_data['reservations'] = [r.to_dict() for r in reservations]
        return jsonify({'customer': customer_data})
    customers = Customer.query.all()
    return jsonify({'customers': [c.to_dict() for c in customers]}), 200

@api_bp.route('/customers/<uuid:customer_id>', methods=['PATCH'])
def update_customer(customer_id):
    try:
        logger.info('Update customer payload: %s', request.json)
        customer = Customer.query.get_or_404(customer_id)
        data = request.json
        for key, value in data.items():
            if hasattr(customer, key):
                setattr(customer, key, value)
        db.session.commit()
        return jsonify({'message': 'Customer updated successfully', 'customer': customer.to_dict()}), 200
    except Exception as e:
        logger.exception('Internal server error during customer update')
        db.session.rollback()
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500

@api_bp.route('/customers/upsert', methods=['POST'])
def upsert_customer():
    try:
        logger.info('Upsert customer payload: %s', request.json)
        schema = CustomerSchema()
        data = schema.load(request.json)
        customer = Customer.query.filter_by(email=data['email']).first()
        if customer:
            for key, value in data.items():
                if hasattr(customer, key):
                    setattr(customer, key, value)
            db.session.commit()
        else:
            customer = Customer(**data)
            db.session.add(customer)
            db.session.commit()
        # --- Newsletter logic ---
        if data.get('newsletter_signup'):
            email = data['email']
            name = data.get('name')
            existing = NewsletterSubscriber.query.filter_by(email=email).first()
            if existing:
                if not existing.is_active:
                    existing.is_active = True
                    existing.name = name or existing.name
                    db.session.commit()
            else:
                subscriber = NewsletterSubscriber(email=email, name=name, is_active=True)
                db.session.add(subscriber)
                db.session.commit()
        # --- End newsletter logic ---
        return jsonify({'message': 'Customer upserted', 'customer': customer.to_dict()}), 200
    except ValidationError as e:
        logger.error('Validation error: %s', e.messages)
        return jsonify({'error': 'Validation error', 'details': e.messages}), 400
    except Exception as e:
        logger.exception('Internal server error during customer upsert')
        db.session.rollback()
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500 

# Profile endpoints
@api_bp.route('/profiles', methods=['POST'])
def create_profile():
    try:
        logger.info('Create profile payload: %s', request.json)
        schema = ProfileSchema()
        data = schema.load(request.json)
        profile = Profile(**data)
        db.session.add(profile)
        db.session.commit()
        return jsonify({'message': 'Profile created successfully', 'profile': profile.to_dict()}), 201
    except ValidationError as e:
        logger.error('Validation error: %s', e.messages)
        return jsonify({'error': 'Validation error', 'details': e.messages}), 400
    except Exception as e:
        logger.exception('Internal server error during profile creation')
        db.session.rollback()
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500

@api_bp.route('/profiles', methods=['GET'])
def get_profiles():
    try:
        user_id = request.args.get('user_id')
        if user_id:
            profile = Profile.query.filter_by(user_id=user_id).first()
            if not profile:
                return jsonify({'error': 'Profile not found'}), 404
            return jsonify({'profile': profile.to_dict()}), 200
        profiles = Profile.query.all()
        return jsonify({'profiles': [p.to_dict() for p in profiles]}), 200
    except Exception as e:
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500

@api_bp.route('/profiles/<uuid:profile_id>', methods=['PATCH'])
def update_profile(profile_id):
    try:
        logger.info('Update profile payload: %s', request.json)
        profile = Profile.query.get_or_404(profile_id)
        data = request.json
        for key, value in data.items():
            if hasattr(profile, key):
                setattr(profile, key, value)
        db.session.commit()
        return jsonify({'message': 'Profile updated successfully', 'profile': profile.to_dict()}), 200
    except Exception as e:
        logger.exception('Internal server error during profile update')
        db.session.rollback()
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500 

@api_bp.route('/admin/reservations', methods=['GET'])
@login_required
def get_all_reservations_admin():
    user = User.query.get(request.user_id)
    if not user or user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403

    # Pagination
    try:
        page = int(request.args.get('page', 1))
        per_page = 10
    except Exception:
        page = 1
        per_page = 10

    query = Reservation.query.order_by(Reservation.date.desc(), Reservation.time.desc())
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    reservations = pagination.items
    reservations_data = []
    for r in reservations:
        res_dict = r.to_dict()
        customer = Customer.query.filter_by(email=r.email).first()
        res_dict['customers'] = customer.to_dict() if customer else None
        reservations_data.append(res_dict)
    return jsonify({
        'current_page': pagination.page,
        'pages': pagination.pages,
        'total': pagination.total,
        'reservations': reservations_data
    }), 200 

# Endpoint to fetch the verification link for a user by email (for simulation)
@api_bp.route('/auth/verification-link', methods=['GET'])
def get_verification_link():
    email = request.args.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    if user.is_active:
        return jsonify({'error': 'User already verified'}), 400
    verify_token = generate_jwt(user.id, purpose='verify')
    verify_url = url_for('api.verify_email', token=verify_token, _external=True)
    return jsonify({'verification_link': verify_url}), 200 

@api_bp.route('/admin/testimonials', methods=['GET'])
@login_required
def get_all_testimonials_admin():
    """Admin: Get all testimonials (approved and unapproved)"""
    try:
        testimonials = Testimonial.query.order_by(Testimonial.created_at.desc()).all()
        return jsonify([t.to_dict() for t in testimonials]), 200
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@api_bp.route('/admin/testimonials/<uuid:testimonial_id>', methods=['PATCH'])
@login_required
def approve_testimonial(testimonial_id):
    """Admin: Approve or reject a testimonial"""
    try:
        data = request.json or {}
        is_approved = data.get('is_approved')
        if is_approved is None:
            return jsonify({'error': 'is_approved is required'}), 400
        testimonial = Testimonial.query.get_or_404(testimonial_id)
        testimonial.is_approved = bool(is_approved)
        db.session.commit()
        return jsonify({'message': 'Testimonial updated', 'testimonial': testimonial.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 

@api_bp.route('/gallery/images', methods=['GET'])
def get_gallery_images():
    """Get all active gallery images, ordered by display_order and created_at desc"""
    images = GalleryImage.query.filter_by(is_active=True).order_by(GalleryImage.display_order, GalleryImage.created_at.desc()).all()
    return jsonify([img.to_dict() for img in images]), 200

@api_bp.route('/gallery/images', methods=['POST'])
@login_required
def create_gallery_image():
    """Add a new gallery image (admin only)"""
    try:
        schema = GalleryImageSchema()
        data = schema.load(request.json)
        img = GalleryImage(**data)
        db.session.add(img)
        db.session.commit()
        return jsonify({'message': 'Gallery image created', 'image': img.to_dict()}), 201
    except ValidationError as e:
        return jsonify({'error': 'Validation error', 'details': e.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api_bp.route('/gallery/images/<uuid:image_id>', methods=['PUT'])
@login_required
def update_gallery_image(image_id):
    """Update a gallery image (admin only)"""
    try:
        img = GalleryImage.query.get_or_404(image_id)
        schema = GalleryImageSchema(partial=True)
        data = schema.load(request.json)
        for key, value in data.items():
            setattr(img, key, value)
        db.session.commit()
        return jsonify({'message': 'Gallery image updated', 'image': img.to_dict()}), 200
    except ValidationError as e:
        return jsonify({'error': 'Validation error', 'details': e.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api_bp.route('/gallery/images/<uuid:image_id>', methods=['DELETE'])
@login_required
def delete_gallery_image(image_id):
    """Delete a gallery image (admin only)"""
    try:
        img = GalleryImage.query.get_or_404(image_id)
        db.session.delete(img)
        db.session.commit()
        return jsonify({'message': 'Gallery image deleted'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 

@api_bp.route('/gallery/upload', methods=['POST'])
@login_required
def upload_gallery_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    ext = file.filename.rsplit('.', 1)[-1].lower()
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        return jsonify({'error': 'Invalid file type'}), 400
    filename = secure_filename(file.filename)
    # Ensure upload folder exists
    os.makedirs(GALLERY_UPLOAD_FOLDER, exist_ok=True)
    save_path = os.path.join(GALLERY_UPLOAD_FOLDER, filename)
    file.save(save_path)
    # Build public URL (assuming /static/gallery/ is served at /static/gallery/)
    public_url = f"/static/gallery/{filename}"
    return jsonify({'url': public_url}), 201 