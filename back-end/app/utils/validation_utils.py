"""
Validation utilities
"""

import re
from datetime import datetime, date, time

def validate_email(email):
    """Validate email format"""
    if not email:
        return False
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    """Validate phone number format"""
    if not phone:
        return False
    # Remove all non-digit characters
    digits_only = re.sub(r'\D', '', phone)
    # Check if it has 10-15 digits
    return 10 <= len(digits_only) <= 15

def validate_date(date_str):
    """Validate date format (YYYY-MM-DD)"""
    try:
        datetime.strptime(date_str, '%Y-%m-%d')
        return True
    except ValueError:
        return False

def validate_time(time_str):
    """Validate time format (HH:MM)"""
    try:
        datetime.strptime(time_str, '%H:%M')
        return True
    except ValueError:
        return False

def validate_business_hours(date_str, time_str):
    """Validate that the reservation time is within business hours"""
    try:
        reservation_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        reservation_time = datetime.strptime(time_str, '%H:%M').time()
        
        # Get day of week (0 = Monday, 6 = Sunday in Python)
        day_of_week = reservation_date.weekday()
        
        # Sunday (6 in Python weekday) has different hours
        if day_of_week == 6:  # Sunday
            # Sunday: 5:00 PM – 9:00 PM (last reservation at 8:30 PM)
            return time(17, 0) <= reservation_time <= time(20, 30)
        else:
            # Monday–Saturday: 5:00 PM – 11:00 PM (last reservation at 10:30 PM)
            return time(17, 0) <= reservation_time <= time(22, 30)
            
    except ValueError:
        return False

def validate_party_size(size):
    """Validate party size (1-20 people)"""
    try:
        size_int = int(size)
        return 1 <= size_int <= 20
    except (ValueError, TypeError):
        return False

def validate_rating(rating):
    """Validate rating (1-5 stars)"""
    try:
        rating_int = int(rating)
        return 1 <= rating_int <= 5
    except (ValueError, TypeError):
        return False 