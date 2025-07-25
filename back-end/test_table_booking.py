import requests
import json
from datetime import datetime, timedelta
import uuid

# Configuration
BASE_URL = "http://localhost:5000/api"
HEADERS = {"Content-Type": "application/json"}

def test_table_booking_flow():
    """Test the complete table booking and cancellation flow"""
    print("Starting table booking flow test...")
    
    # 1. Create a test customer
    customer_email = f"test_{uuid.uuid4()}@example.com"
    customer_data = {
        "email": customer_email,
        "name": "Test Customer",
        "phone": "1234567890",
        "newsletter_signup": False
    }
    
    print("\n1. Creating test customer...")
    customer_response = requests.post(
        f"{BASE_URL}/customers/upsert",
        headers=HEADERS,
        json=customer_data
    )
    
    if customer_response.status_code != 200:
        print(f"Failed to create customer: {customer_response.text}")
        return
    
    customer = customer_response.json().get("customer")
    print(f"Customer created with ID: {customer.get('id')}")
    
    # 2. Check availability for tomorrow
    tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
    
    print(f"\n2. Checking availability for {tomorrow}...")
    availability_response = requests.get(
        f"{BASE_URL}/reservations/availability?date={tomorrow}&time=18:00"
    )
    
    if availability_response.status_code != 200:
        print(f"Failed to check availability: {availability_response.text}")
        return
    
    availability = availability_response.json()
    print(f"Availability: {json.dumps(availability, indent=2)}")
    
    if not availability.get("available"):
        print("No tables available for tomorrow. Test cannot continue.")
        return
    
    # 3. Create a reservation
    reservation_data = {
        "name": "Test Customer",
        "email": customer_email,
        "phone": "1234567890",
        "reservation_date": tomorrow,
        "reservation_time": "18:00",
        "number_of_guests": 4,
        "customer_id": customer.get("id"),
        "special_requests": "Test reservation"
    }
    
    print("\n3. Creating reservation...")
    reservation_response = requests.post(
        f"{BASE_URL}/reservations",
        headers=HEADERS,
        json=reservation_data
    )
    
    if reservation_response.status_code != 201:
        print(f"Failed to create reservation: {reservation_response.text}")
        return
    
    reservation = reservation_response.json()
    print(f"Reservation created: {json.dumps(reservation, indent=2)}")
    
    # Verify table number and tables remaining
    if not reservation.get("reservation", {}).get("table_number"):
        print("ERROR: Table number not assigned!")
    else:
        print(f"Table number assigned: {reservation.get('reservation', {}).get('table_number')}")
    
    if "tables_remaining" not in reservation:
        print("ERROR: Tables remaining not returned!")
    else:
        print(f"Tables remaining: {reservation.get('tables_remaining')}")
    
    reservation_id = reservation.get("reservation", {}).get("id")
    
    # 4. Check availability again (should be one less table)
    print("\n4. Checking availability again...")
    availability_response = requests.get(
        f"{BASE_URL}/reservations/availability?date={tomorrow}&time=18:00"
    )
    
    if availability_response.status_code != 200:
        print(f"Failed to check availability: {availability_response.text}")
    else:
        availability = availability_response.json()
        print(f"Updated availability: {json.dumps(availability, indent=2)}")
    
    # 5. Cancel the reservation
    print("\n5. Cancelling reservation...")
    cancel_data = {
        "email": customer_email
    }
    
    cancel_response = requests.post(
        f"{BASE_URL}/reservations/cancel/{reservation_id}",
        headers=HEADERS,
        json=cancel_data
    )
    
    if cancel_response.status_code != 200:
        print(f"Failed to cancel reservation: {cancel_response.text}")
        return
    
    cancel_result = cancel_response.json()
    print(f"Cancellation result: {json.dumps(cancel_result, indent=2)}")
    
    # Verify tables remaining after cancellation
    if "tables_remaining" not in cancel_result:
        print("ERROR: Tables remaining not returned after cancellation!")
    else:
        print(f"Tables remaining after cancellation: {cancel_result.get('tables_remaining')}")
    
    # 6. Check availability one more time (should be back to original)
    print("\n6. Checking availability after cancellation...")
    availability_response = requests.get(
        f"{BASE_URL}/reservations/availability?date={tomorrow}&time=18:00"
    )
    
    if availability_response.status_code != 200:
        print(f"Failed to check availability: {availability_response.text}")
    else:
        availability = availability_response.json()
        print(f"Final availability: {json.dumps(availability, indent=2)}")
    
    print("\nTest completed successfully!")

if __name__ == "__main__":
    test_table_booking_flow()