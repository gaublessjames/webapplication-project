"""
Authentication routes
"""

from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
import bcrypt
import logging
from app.models import User
from app.schemas import UserSchema
from app.utils import generate_jwt, decode_jwt, login_required
from app.extensions import db

auth_bp = Blueprint('auth', __name__)
logger = logging.getLogger('cafe_fausse_api')

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
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
        user = User(email=email, full_name=full_name, password_hash=hashed.decode('utf-8'))
        db.session.add(user)
        db.session.commit()
        
        return jsonify({'message': 'User registered successfully'}), 201
        
    except Exception as e:
        logger.error('Registration error: %s', str(e))
        return jsonify({'error': 'Registration failed'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
            
        user = User.query.filter_by(email=email).first()
        if not user or not bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
            return jsonify({'error': 'Invalid credentials'}), 401
            
        token = generate_jwt(user.id)
        return jsonify({
            'token': token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        logger.error('Login error: %s', str(e))
        return jsonify({'error': 'Login failed'}), 500

@auth_bp.route('/user', methods=['GET'])
@login_required
def get_current_user():
    """Get current user information"""
    try:
        user = User.query.get(request.user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        return jsonify(user.to_dict()), 200
        
    except Exception as e:
        logger.error('Get user error: %s', str(e))
        return jsonify({'error': 'Failed to get user'}), 500 