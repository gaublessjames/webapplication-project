"""
Customers routes
"""

from flask import Blueprint, request, jsonify
import logging
from app.models import Customer
from app.schemas import CustomerSchema
from app.extensions import db

customer_bp = Blueprint('customers', __name__)
logger = logging.getLogger('cafe_fausse_api')

@customer_bp.route('/', methods=['GET'])
def get_customers():
    """Get all customers or filter by email"""
    try:
        email_filter = request.args.get('email')
        
        if email_filter:
            # Filter by email
            customer = Customer.query.filter_by(email=email_filter).first()
            if customer:
                return jsonify({'customer': customer.to_dict()}), 200
            else:
                return jsonify({'customer': None}), 200
        else:
            # Get all customers
            customers = Customer.query.order_by(Customer.created_at.desc()).all()
            return jsonify([c.to_dict() for c in customers]), 200
    except Exception as e:
        logger.error('Get customers error: %s', str(e))
        return jsonify({'error': 'Failed to get customers'}), 500

@customer_bp.route('/', methods=['POST'])
def create_customer():
    """Create a new customer"""
    try:
        data = request.json
        customer = Customer(**data)
        db.session.add(customer)
        db.session.commit()
        return jsonify(customer.to_dict()), 201
    except Exception as e:
        logger.error('Create customer error: %s', str(e))
        db.session.rollback()
        return jsonify({'error': 'Failed to create customer'}), 500 