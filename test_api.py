#!/usr/bin/env python3
"""
Simple test script to verify Café Fausse API functionality
"""

import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:5000"

def test_health_check():
    """Test the health check endpoint"""
    print("Testing health check...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_restaurant_info():
    """Test restaurant information endpoint"""
    print("Testing restaurant info...")
    response = requests.get(f"{BASE_URL}/api/restaurant/info")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Restaurant: {data.get('name')}")
        print(f"Phone: {data.get('phone')}")
        print(f"Address: {data.get('address')}")
    else:
        print(f"Error: {response.json()}")
    print()

def test_menu_categories():
    """Test menu categories endpoint"""
    print("Testing menu categories...")
    response = requests.get(f"{BASE_URL}/api/menu/categories")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        categories = response.json()
        print(f"Found {len(categories)} categories:")
        for cat in categories:
            print(f"  - {cat['name']}: {len(cat.get('items', []))} items")
    else:
        print(f"Error: {response.json()}")
    print()

def test_testimonials():
    """Test testimonials endpoint"""
    print("Testing testimonials...")
    response = requests.get(f"{BASE_URL}/api/testimonials")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        testimonials = response.json()
        print(f"Found {len(testimonials)} testimonials")
        for testimonial in testimonials[:2]:  # Show first 2
            print(f"  - {testimonial['customer_name']}: {testimonial['rating']} stars")
    else:
        print(f"Error: {response.json()}")
    print()

def test_awards():
    """Test awards endpoint"""
    print("Testing awards...")
    response = requests.get(f"{BASE_URL}/api/awards")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        awards = response.json()
        print(f"Found {len(awards)} awards")
        for award in awards[:2]:  # Show first 2
            print(f"  - {award['name']} ({award['year']})")
    else:
        print(f"Error: {response.json()}")
    print()

def test_availability_check():
    """Test reservation availability check"""
    print("Testing availability check...")
    tomorrow = datetime.now() + timedelta(days=1)
    date_str = tomorrow.strftime('%Y-%m-%d')
    
    response = requests.get(f"{BASE_URL}/api/reservations/availability", 
                          params={'date': date_str, 'time': '19:00'})
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Date: {data['date']}, Time: {data['time']}, Available: {data['available']}")
    else:
        print(f"Error: {response.json()}")
    print()

def test_newsletter_subscription():
    """Test newsletter subscription"""
    print("Testing newsletter subscription...")
    test_email = f"test_{datetime.now().strftime('%Y%m%d_%H%M%S')}@example.com"
    
    data = {
        'email': test_email,
        'name': 'Test User'
    }
    
    response = requests.post(f"{BASE_URL}/api/newsletter/subscribe", 
                           json=data)
    print(f"Status: {response.status_code}")
    if response.status_code in [200, 201]:
        print(f"Successfully subscribed: {test_email}")
    else:
        print(f"Error: {response.json()}")
    print()

def test_reservation_creation():
    """Test reservation creation"""
    print("Testing reservation creation...")
    tomorrow = datetime.now() + timedelta(days=1)
    date_str = tomorrow.strftime('%Y-%m-%d')
    
    data = {
        'name': 'Test Customer',
        'email': 'test@example.com',
        'phone': '(555) 123-4567',
        'date': date_str,
        'time': '18:00',
        'party_size': 2,
        'special_requests': 'Test reservation'
    }
    
    response = requests.post(f"{BASE_URL}/api/reservations", json=data)
    print(f"Status: {response.status_code}")
    if response.status_code == 201:
        reservation = response.json()['reservation']
        print(f"Reservation created: {reservation['id']}")
        print(f"Name: {reservation['name']}, Date: {reservation['date']}")
    else:
        print(f"Error: {response.json()}")
    print()

def main():
    """Run all tests"""
    print("=" * 50)
    print("Café Fausse API Test Suite")
    print("=" * 50)
    print()
    
    try:
        test_health_check()
        test_restaurant_info()
        test_menu_categories()
        test_testimonials()
        test_awards()
        test_availability_check()
        test_newsletter_subscription()
        test_reservation_creation()
        
        print("=" * 50)
        print("All tests completed!")
        print("=" * 50)
        
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the API server.")
        print("Make sure the Flask application is running on http://localhost:5000")
    except Exception as e:
        print(f"Error during testing: {e}")

if __name__ == "__main__":
    main() 