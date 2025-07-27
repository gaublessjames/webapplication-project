"""
Reservation routes
"""

from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from datetime import datetime, date, time
from sqlalchemy import and_, or_
import logging
from app.models import Reservation, Customer
from app.schemas import ReservationSchema
from app.utils import login_required, validate_date, validate_time, validate_party_size, validate_business_hours
from app.extensions import db

reservation_bp = Blueprint('reservations', __name__)
logger = logging.getLogger('cafe_fausse_api')

@reservation_bp.route('/', methods=['POST'])
def create_reservation():
    """Create a new reservation"""
    try:
        data = request.json
        
        # Validate required fields - support both guest and customer_id scenarios
        if 'customer_id' in data:
            # Existing customer making reservation
            required_fields = ['customer_id', 'date', 'time', 'party_size']
        else:
            # Guest making reservation - need customer details
            required_fields = ['name', 'email', 'phone', 'date', 'time', 'party_size']
            
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate data types
        if not validate_date(data['date']):
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
            
        if not validate_time(data['time']):
            return jsonify({'error': 'Invalid time format. Use HH:MM'}), 400
            
        if not validate_party_size(data['party_size']):
            return jsonify({'error': 'Party size must be between 1 and 20'}), 400
        
        # Validate business hours
        if not validate_business_hours(data['date'], data['time']):
            return jsonify({'error': 'Reservation time is outside of business hours. Monday–Saturday: 5:00 PM – 11:00 PM; Sunday: 5:00 PM – 9:00 PM'}), 400
        
        # Parse date and time
        reservation_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        reservation_time = datetime.strptime(data['time'], '%H:%M').time()
        
        # Check if reservation is in the past
        if reservation_date < date.today():
            return jsonify({'error': 'Cannot make reservations in the past'}), 400
        
        # Check availability and assign table
        existing_reservations = Reservation.query.filter(
            and_(
                Reservation.date == reservation_date,
                Reservation.status != 'cancelled'
            )
        ).all()
        
        total_reserved_seats = sum(r.party_size for r in existing_reservations)
        max_capacity = 30  # Restaurant has 30 tables
        available_seats = max_capacity - total_reserved_seats
        
        if available_seats < data['party_size']:
            return jsonify({'error': 'No available tables for the requested party size'}), 400
        
        # Assign random table number
        import random
        assigned_table = random.randint(1, 30)
        
        # Handle customer creation/lookup for guest reservations
        customer_id = data.get('customer_id')
        if not customer_id:
            # Guest reservation - create or find customer
            from app.models import Customer
            
            # Check if customer already exists
            existing_customer = Customer.query.filter_by(email=data['email']).first()
            if existing_customer:
                customer_id = existing_customer.id
            else:
                # Create new customer
                customer = Customer(
                    name=data['name'],
                    email=data['email'],
                    phone=data['phone'],
                    newsletter_signup=data.get('newsletter_signup', False)
                )
                db.session.add(customer)
                db.session.flush()  # Get the ID without committing
                customer_id = customer.id
        
        # Extract user_id from token if present
        user_id = None
        auth_header = request.headers.get('Authorization', None)
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            from app.utils import decode_jwt
            payload = decode_jwt(token)
            if payload and 'user_id' in payload:
                user_id = payload['user_id']
        
        # Create reservation
        reservation = Reservation(
            customer_id=customer_id,
            date=reservation_date,
            time=reservation_time,
            party_size=data['party_size'],
            special_requests=data.get('special_requests'),
            table_number=assigned_table,
            user_id=user_id
        )
        
        db.session.add(reservation)
        db.session.commit()
        
        return jsonify({
            'message': 'Reservation created successfully',
            'reservation': reservation.to_dict()
        }), 201
        
    except Exception as e:
        logger.error('Create reservation error: %s', str(e))
        db.session.rollback()
        return jsonify({'error': 'Failed to create reservation'}), 500

@reservation_bp.route('/user', methods=['GET'])
def get_user_reservations():
    """Get reservations for a specific user by email"""
    try:
        email = request.args.get('email')
        if not email:
            return jsonify({'error': 'Email parameter is required'}), 400
        
        # Find customer by email
        customer = Customer.query.filter_by(email=email).first()
        if not customer:
            return jsonify({'reservations': []}), 200
        
        # Get all reservations for this customer (both guest and user reservations)
        reservations = Reservation.query.filter_by(customer_id=customer.id).order_by(Reservation.date, Reservation.time).all()
        
        return jsonify({
            'reservations': [r.to_dict() for r in reservations]
        }), 200
        
    except Exception as e:
        logger.error('Get user reservations error: %s', str(e))
        return jsonify({'error': 'Failed to get user reservations'}), 500

@reservation_bp.route('/', methods=['GET'])
def get_reservations():
    """Get all reservations (with optional filtering)"""
    try:
        # Get query parameters
        date_filter = request.args.get('date')
        status_filter = request.args.get('status')
        
        query = Reservation.query
        
        # Apply filters
        if date_filter:
            try:
                filter_date = datetime.strptime(date_filter, '%Y-%m-%d').date()
                query = query.filter(Reservation.date == filter_date)
            except ValueError:
                return jsonify({'error': 'Invalid date format'}), 400
                
        if status_filter:
            query = query.filter(Reservation.status == status_filter)
        
        # Order by date and time
        reservations = query.order_by(Reservation.date, Reservation.time).all()
        
        return jsonify([r.to_dict() for r in reservations]), 200
        
    except Exception as e:
        logger.error('Get reservations error: %s', str(e))
        return jsonify({'error': 'Failed to get reservations'}), 500

@reservation_bp.route('/<uuid:reservation_id>', methods=['GET'])
def get_reservation(reservation_id):
    """Get a specific reservation"""
    try:
        reservation = Reservation.query.get_or_404(reservation_id)
        return jsonify(reservation.to_dict()), 200
        
    except Exception as e:
        logger.error('Get reservation error: %s', str(e))
        return jsonify({'error': 'Failed to get reservation'}), 500

@reservation_bp.route('/<uuid:reservation_id>', methods=['PUT'])
@login_required
def update_reservation(reservation_id):
    """Update a reservation"""
    try:
        reservation = Reservation.query.get_or_404(reservation_id)
        data = request.json
        
        # Update fields
        if 'name' in data:
            reservation.name = data['name']
        if 'email' in data:
            reservation.email = data['email']
        if 'phone' in data:
            reservation.phone = data['phone']
        if 'date' in data:
            if not validate_date(data['date']):
                return jsonify({'error': 'Invalid date format'}), 400
            reservation.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        if 'time' in data:
            if not validate_time(data['time']):
                return jsonify({'error': 'Invalid time format'}), 400
            reservation.time = datetime.strptime(data['time'], '%H:%M').time()
        if 'party_size' in data:
            if not validate_party_size(data['party_size']):
                return jsonify({'error': 'Invalid party size'}), 400
            reservation.party_size = data['party_size']
        if 'special_requests' in data:
            reservation.special_requests = data['special_requests']
        if 'status' in data:
            reservation.status = data['status']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Reservation updated successfully',
            'reservation': reservation.to_dict()
        }), 200
        
    except Exception as e:
        logger.error('Update reservation error: %s', str(e))
        db.session.rollback()
        return jsonify({'error': 'Failed to update reservation'}), 500

@reservation_bp.route('/cancel/<uuid:reservation_id>', methods=['POST'])
def cancel_reservation(reservation_id):
    """Cancel a reservation"""
    try:
        reservation = Reservation.query.get_or_404(reservation_id)
        reservation.status = 'cancelled'
        db.session.commit()
        
        return jsonify({
            'message': 'Reservation cancelled successfully',
            'reservation': reservation.to_dict()
        }), 200
        
    except Exception as e:
        logger.error('Cancel reservation error: %s', str(e))
        db.session.rollback()
        return jsonify({'error': 'Failed to cancel reservation'}), 500

@reservation_bp.route('/availability', methods=['GET'])
def check_availability():
    """Check table availability for a given date and time"""
    try:
        date_str = request.args.get('date')
        time_str = request.args.get('time')
        party_size = request.args.get('party_size', type=int)
        
        if not date_str or not time_str:
            return jsonify({'error': 'Date and time are required'}), 400
            
        if not validate_date(date_str):
            return jsonify({'error': 'Invalid date format'}), 400
            
        if not validate_time(time_str):
            return jsonify({'error': 'Invalid time format'}), 400
        
        # Parse date and time
        check_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        check_time = datetime.strptime(time_str, '%H:%M').time()
        
        # Get existing reservations for the date and time
        existing_reservations = Reservation.query.filter(
            and_(
                Reservation.date == check_date,
                Reservation.status != 'cancelled'
            )
        ).all()
        
        # Simple availability check (can be enhanced with actual table management)
        total_reserved_seats = sum(r.party_size for r in existing_reservations)
        max_capacity = 30  # Restaurant has 30 tables
        
        available_seats = max_capacity - total_reserved_seats
        is_available = available_seats >= (party_size or 1)
        
        # Assign random table number if available
        assigned_table = None
        if is_available:
            import random
            # Generate a random table number between 1-30
            assigned_table = random.randint(1, 30)
        
        return jsonify({
            'date': date_str,
            'time': time_str,
            'party_size': party_size,
            'available_seats': available_seats,
            'is_available': is_available,
            'assigned_table': assigned_table,
            'existing_reservations': len(existing_reservations)
        }), 200
        
    except Exception as e:
        logger.error('Check availability error: %s', str(e))
        return jsonify({'error': 'Failed to check availability'}), 500 