from flask import Flask, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv
from datetime import datetime
import os

from models import db
from routes import api_bp
from sqlalchemy import text

# Load environment variables
load_dotenv()

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
        if not user:
            hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            user = User(email=user_info["email"], full_name=user_info["full_name"], role=user_info["role"])
            user.password_hash = hashed.decode('utf-8')
            db.session.add(user)
    db.session.commit()

def create_app():
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://localhost/cafe_fausse')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions
    db.init_app(app)
    CORS(app)
    Migrate(app, db)
    
    # Register blueprints
    app.register_blueprint(api_bp, url_prefix='/api')

    # Ensure demo users exist (only in local/dev mode)
    app.has_run_demo_setup = False
    @app.before_request
    def setup_demo_users():
        if not app.has_run_demo_setup:
            with app.app_context():
                ensure_demo_users()
            app.has_run_demo_setup = True
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        try:
            # Test database connection
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

if __name__ == '__main__':
    app = create_app()
    app.run(debug=os.getenv('FLASK_ENV') == 'development', host='0.0.0.0', port=5000) 