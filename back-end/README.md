# Café Fausse Backend API

A modular Flask REST API backend for the Café Fausse restaurant application. Handles reservations, menu, testimonials, gallery, newsletter, awards, and more.

---

## 🚦 Quick Start: Backend Setup Options

| Setup Method | Guide |
|--------------|-------|
| **Docker**   | [DOCKER_README.md](../DOCKER_README.md) |
| **Manual**   | See below |

> **Note:** Both methods deliver the **same demo data, endpoints, and experience**. Choose whichever fits your workflow.

---

## 🏗️ Backend Structure (Modular)

```
back-end/
├── app/                # Modular Flask app (models, routes, schemas, etc.)
├── run.py              # Main entrypoint (use this to run the API)
├── requirements.txt    # Python dependencies
├── env.example         # Environment variable template
├── init_database.py    # Creates tables and seeds demo data
├── seed_only.py        # Seeds demo data only
├── test_seeding.py     # Verifies data seeding
├── README.md           # This file
```

---

## 🖥️ Manual Backend Setup (No Docker)

### Prerequisites
- **Python 3.8+** and pip
- **PostgreSQL**
- **Git**

### 1. Configure Environment
```bash
cp env.example .env
# Edit .env with your PostgreSQL credentials
```

### 2. Set Up the Database
- Create a PostgreSQL database (e.g., `cafe_fausse`).
- Update `DATABASE_URL` in `.env`.

### 3. Install Dependencies
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Initialize Database with Demo Data
```bash
python init_database.py  # Creates tables and seeds demo data
# Or, to only seed data (if tables already exist):
python seed_only.py
```

### 5. Run the Backend API
```bash
python run.py
# API available at http://localhost:5000
```

---

## 🐳 Docker Backend Setup
See [DOCKER_README.md](../DOCKER_README.md) for full instructions.
- Docker Compose will run the backend using the same modular structure and entrypoint as above.
- Demo data is seeded automatically on first run.

---

## 🔑 Demo Login Credentials
- **Demo User:** `demo@cafefausse.com` / `demo123456`
- **Admin User:** `admin@cafefausse.com` / `demo123456`
- **Chef User:** `chef@cafefausse.com` / `demo123456`

---

## 🔗 API Endpoints (Sample)
- `GET /health` — API health check
- `POST /api/reservations` — Create reservation
- `GET /api/menu/categories` — Get menu
- `GET /api/testimonials` — Get testimonials
- `GET /api/gallery/images` — Get gallery images
- `POST /api/auth/login` — Login

See below for more endpoints and usage examples.

---

## 📚 Full API Reference & Usage Examples

### Health Check
- `GET /health` — API health status

### Reservations
- `POST /api/reservations` — Create a new reservation
- `GET /api/reservations` — Get all reservations (admin)
- `GET /api/reservations/<id>` — Get specific reservation
- `PUT /api/reservations/<id>` — Update reservation status
- `GET /api/reservations/availability` — Check availability

### Newsletter
- `POST /api/newsletter/subscribe` — Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` — Unsubscribe from newsletter

### Menu
- `GET /api/menu/categories` — Get all menu categories with items
- `POST /api/menu/categories` — Create menu category (admin)
- `POST /api/menu/items` — Create menu item (admin)

### Testimonials
- `GET /api/testimonials` — Get approved testimonials
- `POST /api/testimonials` — Submit new testimonial

### Restaurant Information
- `GET /api/restaurant/info` — Get restaurant information
- `PUT /api/restaurant/info` — Update restaurant info (admin)

### Awards
- `GET /api/awards` — Get all awards
- `POST /api/awards` — Create new award (admin)

### Authentication
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login
- `GET /api/auth/user` — Get current user info (requires Authorization: Bearer <token>)

### Customers
- `POST /api/customers` — Create a new customer
- `GET /api/customers?email=...` — Get customer by email
- `PATCH /api/customers/<id>` — Update customer
- `POST /api/customers/upsert` — Upsert customer (for newsletter signup)

### Profiles
- `POST /api/profiles` — Create a new profile
- `GET /api/profiles?user_id=...` — Get profile by user ID
- `PATCH /api/profiles/<id>` — Update profile

### Gallery
- `GET /api/gallery/images` — Get all gallery images
- `POST /api/gallery/images` — Add a new gallery image (admin)

---

## 🛠️ Troubleshooting & FAQ

### Common Issues
- **Database connection error:**
  - Check `DATABASE_URL` in `.env` and ensure PostgreSQL is running.
- **Port conflicts:**
  - Use `lsof -i :5000` to find and stop conflicting processes.
- **Missing dependencies:**
  - Run `pip install -r requirements.txt`.
- **Demo data not present:**
  - Run `python init_database.py` (manual) or `docker-compose exec backend python init_database.py` (Docker).

### FAQ
- **Q: Is the manual backend setup identical to Docker?**
  - **A:** Yes! Both methods deliver the same demo data, endpoints, and experience.
- **Q: How do I reset demo data?**
  - **A:** Run `python init_database.py` (manual) or `docker-compose exec backend python init_database.py` (Docker).
- **Q: Where are the admin features?**
  - **A:** Log in as `admin@cafefausse.com` to access admin endpoints.
- **Q: How do I test data seeding?**
  - **A:** Run `python test_seeding.py` (manual) or `docker-compose exec backend python test_seeding.py` (Docker).

---

## 🗺️ Documentation Map
- **[../README.md](../README.md):** Main project overview & setup
- **[../DOCKER_README.md](../DOCKER_README.md):** Docker setup
- **[DATABASE_SEEDING_GUIDE.md](../DATABASE_SEEDING_GUIDE.md):** Data seeding details

---

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License
MIT License

---

## 🆘 Support
- Review the docs above
- Check troubleshooting/FAQ
- Create an issue in the repository 