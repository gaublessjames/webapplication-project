#!/usr/bin/env python3
"""
Configuration settings for Café Fausse backend
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Base configuration class"""
    
    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'cafe-fausse-secret-key-2024-dev')
    DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    
    # Database Configuration
    # Standard PostgreSQL connection string format:
    # postgresql://username:password@host:port/database_name
    DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/cafe_fausse_3')
    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Email Configuration
    SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    SMTP_PORT = int(os.getenv('SMTP_PORT', '587'))
    SMTP_USERNAME = os.getenv('SMTP_USERNAME', 'your-email@gmail.com')
    SMTP_PASSWORD = os.getenv('SMTP_PASSWORD', 'your-app-password')
    
    # Application Configuration
    RESTAURANT_NAME = os.getenv('RESTAURANT_NAME', 'Café Fausse')
    RESTAURANT_ADDRESS = os.getenv('RESTAURANT_ADDRESS', '123 Main Street, City, State 12345')
    RESTAURANT_PHONE = os.getenv('RESTAURANT_PHONE', '(555) 123-4567')
    RESTAURANT_EMAIL = os.getenv('RESTAURANT_EMAIL', 'info@cafefausse.com')
    RESTAURANT_WEBSITE = os.getenv('RESTAURANT_WEBSITE', 'https://cafefausse.com')

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    FLASK_ENV = 'development'

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    FLASK_ENV = 'production'

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/cafe_fausse_3_test'
    SQLALCHEMY_DATABASE_URI = DATABASE_URL

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

# Standard database URL examples
DATABASE_URL_EXAMPLES = {
    'local': 'postgresql://postgres:postgres@localhost:5432/cafe_fausse_3',
    'neon': 'postgresql://username:password@ep-cool-forest-123456.us-east-1.aws.neon.tech/cafe_fausse_3?sslmode=require',
    'supabase': 'postgresql://postgres:password@db.supabase.co:5432/postgres',
    'railway': 'postgresql://postgres:password@containers-us-west-1.railway.app:5432/railway',
    'docker': 'postgresql://cafe_fausse_user:cafe_fausse_pass@db:5432/cafe_fausse_3'
}

def get_database_url_examples():
    """Return formatted database URL examples"""
    return {
        'Local Development': DATABASE_URL_EXAMPLES['local'],
        'Neon (Recommended)': DATABASE_URL_EXAMPLES['neon'],
        'Supabase': DATABASE_URL_EXAMPLES['supabase'],
        'Railway': DATABASE_URL_EXAMPLES['railway'],
        'Docker Compose': DATABASE_URL_EXAMPLES['docker']
    } 