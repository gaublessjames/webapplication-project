"""
Café Fausse API Application Factory
"""

from flask import Flask, jsonify
from datetime import datetime
import os
import logging

from .extensions import init_extensions
from .routes import api_bp
from config import config

def create_app(config_name=None):
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Load configuration
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    init_extensions(app)
    
    # Register blueprints
    app.register_blueprint(api_bp, url_prefix='/api')

    # Health check endpoint
    @app.route('/health')
    def health_check():
        try:
            # Test database connection
            from app.extensions import db
            from sqlalchemy import text
            db.session.execute(text('SELECT 1'))
            db_status = 'connected'
        except Exception as e:
            db_status = f'error: {str(e)}'
        
        return jsonify({
            'status': 'healthy' if db_status == 'connected' else 'degraded',
            'message': 'Café Fausse API is running',
            'database': db_status,
            'timestamp': datetime.now().isoformat()
        })
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        # Return the real error message for debugging
        import traceback
        return jsonify({
            'error': 'Internal server error',
            'message': str(error),
            'trace': traceback.format_exc()
        }), 500
    
    return app
