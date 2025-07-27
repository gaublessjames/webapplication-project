"""
Flask extensions initialization
"""

from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate

# Initialize extensions
db = SQLAlchemy()
cors = CORS()
migrate = Migrate()

def init_extensions(app):
    """Initialize all Flask extensions"""
    db.init_app(app)
    cors.init_app(app, supports_credentials=True, origins=["http://localhost:8080", "http://localhost:8081", "http://192.168.0.100:8081", "http://192.168.0.100:8080"])
    migrate.init_app(app, db)
