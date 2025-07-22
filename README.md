# Café Fausse Backend API

A Flask-based REST API backend for the Café Fausse restaurant website. This backend handles table reservations, newsletter subscriptions, menu management, testimonials, and restaurant information.

## Features

- **Table Reservations**: Complete reservation system with availability checking
- **Newsletter Management**: Subscribe/unsubscribe functionality
- **Menu Management**: Categories and items with dietary information
- **Testimonials**: Customer reviews and ratings
- **Restaurant Information**: Contact details, hours, and social media
- **Awards**: Restaurant accolades and recognition
- **Data Validation**: Comprehensive input validation using Marshmallow
- **PostgreSQL Database**: Robust data persistence
- **CORS Support**: Cross-origin resource sharing enabled

## Tech Stack

- **Framework**: Flask 3.0.0
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Validation**: Marshmallow schemas
- **Migration**: Flask-Migrate
- **CORS**: Flask-CORS

## Project Structure

```
cafe-fausse-backend/
├── app.py                 # Main Flask application
├── models.py             # Database models
├── routes.py             # API endpoints
├── schemas.py            # Request/response validation
├── database.py           # Database initialization
├── requirements.txt      # Python dependencies
├── env.example           # Environment variables template
└── README.md            # This file
```

## Setup Instructions

### Prerequisites

- Python 3.8+
- PostgreSQL database
- pip (Python package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd webapplication-project
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Configure PostgreSQL database**
   - Create a new database: `cafe_fausse`
   - Update `DATABASE_URL` in `.env` file

6. **Initialize database**
   ```bash
   python database.py
   ```

7. **Run the application**
   ```bash
   python app.py
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /health` - API health status

### Reservations
- `POST /api/reservations` - Create a new reservation
- `GET /api/reservations` - Get all reservations (admin)
- `GET /api/reservations/<id>` - Get specific reservation
- `PUT /api/reservations/<id>` - Update reservation status
- `GET /api/reservations/availability` - Check availability

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe from newsletter

### Menu
- `GET /api/menu/categories` - Get all menu categories with items
- `POST /api/menu/categories` - Create menu category (admin)
- `POST /api/menu/items` - Create menu item (admin)

### Testimonials
- `GET /api/testimonials` - Get approved testimonials
- `POST /api/testimonials` - Submit new testimonial

### Restaurant Information
- `GET /api/restaurant/info` - Get restaurant information
- `PUT /api/restaurant/info` - Update restaurant info (admin)

### Awards
- `GET /api/awards` - Get all awards
- `POST /api/awards` - Create new award (admin)

## API Usage Examples

### Create a Reservation
```bash
curl -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "(555) 123-4567",
    "date": "2024-02-15",
    "time": "19:00",
    "party_size": 4,
    "special_requests": "Window seat preferred"
  }'
```

### Subscribe to Newsletter
```bash
curl -X POST http://localhost:5000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "John Doe"
  }'
```

### Get Menu Categories
```bash
curl http://localhost:5000/api/menu/categories
```

### Check Reservation Availability
```bash
curl "http://localhost:5000/api/reservations/availability?date=2024-02-15&time=19:00"
```

## Database Schema

### Tables
- **reservations**: Table reservations with status tracking
- **newsletter_subscribers**: Email subscriptions
- **menu_categories**: Menu sections (Appetizers, Main Courses, etc.)
- **menu_items**: Individual menu items with dietary info
- **testimonials**: Customer reviews and ratings
- **restaurant_info**: Restaurant details and hours
- **awards**: Restaurant accolades and recognition

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `FLASK_ENV` | Flask environment | `development` |
| `SECRET_KEY` | Flask secret key | `dev-secret-key` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://localhost/cafe_fausse` |
| `DEBUG` | Enable debug mode | `True` |

## Development

### Running in Development
```bash
export FLASK_ENV=development
python app.py
```

### Database Migrations
```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

### Testing
```bash
# Run with pytest (when tests are added)
pytest
```

## Production Deployment

### Using Gunicorn
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:create_app()
```

### Environment Setup
- Set `FLASK_ENV=production`
- Use strong `SECRET_KEY`
- Configure production `DATABASE_URL`
- Set `DEBUG=False`

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional error details (if applicable)"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `409`: Conflict (duplicate data)
- `500`: Internal Server Error

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team or create an issue in the repository. 