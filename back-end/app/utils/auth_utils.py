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
        
        # Check if token is blacklisted
        from app.models.blacklisted_token import BlacklistedToken
        from app.extensions import db
        
        blacklisted = BlacklistedToken.query.filter_by(token=token).first()
        if blacklisted:
            return None  # Token is blacklisted
            
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

def blacklist_token(token, user_id):
    """Add token to blacklist"""
    try:
        from app.models.blacklisted_token import BlacklistedToken
        from app.extensions import db
        from datetime import datetime, timedelta
        
        # Decode token to get expiration
        payload = pyjwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        
        # Calculate expiration time (default to 24 hours if not in payload)
        if 'exp' in payload:
            expires_at = datetime.fromtimestamp(payload['exp'])
        else:
            expires_at = datetime.utcnow() + timedelta(hours=24)
        
        # Add to blacklist
        blacklisted_token = BlacklistedToken(
            token=token,
            user_id=str(user_id),
            expires_at=expires_at
        )
        
        db.session.add(blacklisted_token)
        db.session.commit()
        
        return True
    except Exception as e:
        print(f"Error blacklisting token: {e}")
        return False

def cleanup_expired_tokens():
    """Remove expired blacklisted tokens"""
    try:
        from app.models.blacklisted_token import BlacklistedToken
        from app.extensions import db
        from datetime import datetime
        
        # Delete expired tokens
        expired_count = BlacklistedToken.query.filter(
            BlacklistedToken.expires_at < datetime.utcnow()
        ).delete()
        
        db.session.commit()
        
        if expired_count > 0:
            print(f"🧹 Cleaned up {expired_count} expired blacklisted tokens")
        
        return expired_count
    except Exception as e:
        print(f"Error cleaning up expired tokens: {e}")
        return 0

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