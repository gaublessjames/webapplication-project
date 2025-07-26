"""
Authentication utilities
"""

import os
import jwt as pyjwt
from functools import wraps
from flask import request, jsonify, current_app

# JWT configuration
SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
TOKEN_SALT = 'cafe-fausse-auth-salt'

def generate_jwt(user_id, purpose=None):
    """Generate JWT token for user"""
    payload = {'user_id': str(user_id)}
    if purpose:
        payload['purpose'] = purpose
    return pyjwt.encode(payload, SECRET_KEY, algorithm='HS256')

def decode_jwt(token):
    """Decode and validate JWT token"""
    try:
        payload = pyjwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except Exception:
        return None

def login_required(f):
    """Decorator to require authentication"""
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

def admin_required(f):
    """Decorator to require admin role"""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', None)
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing or invalid token'}), 401
        token = auth_header.split(' ')[1]
        payload = decode_jwt(token)
        if not payload or 'user_id' not in payload:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        # Check if user is admin
        from app.models.user import User
        user = User.query.get(payload['user_id'])
        if not user or user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        request.user_id = payload['user_id']
        return f(*args, **kwargs)
    return decorated 