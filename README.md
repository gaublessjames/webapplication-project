# Café Fausse Restaurant Application

A full-stack restaurant management system for Café Fausse, featuring a React frontend and a modular Flask backend API. Supports reservations, menu management, testimonials, gallery, newsletter, and more.

---

## 🚦 Quick Start: Choose Your Setup

| Setup Method | Recommended For | Guide |
|--------------|-----------------|-------|
| **Docker**   | Easiest, fastest, no local dependencies | [DOCKER_README.md](DOCKER_README.md) |
| **Manual**   | Customization, local dev, no Docker | See below |

> **Note:** Both methods deliver the **same demo data, endpoints, and user experience**. Choose whichever fits your workflow.

---

## 📦 What You Get (Demo Data & Experience)
- **Demo Users:** demo@cafefausse.com, admin@cafefausse.com, chef@cafefausse.com (all: demo123456)
- **Menu:** 4 categories, 12 French dishes
- **Gallery:** 12 high-quality images
- **Testimonials:** 6 customer reviews
- **Awards:** 3 restaurant awards
- **Sample Data:** Customers, reservations, newsletter subscribers
- **Consistent API & UI:** Same endpoints, ports, and features for Docker/manual

---

## 🏗️ Project Structure

```
webapplication-project/
├── front-end/           # React frontend
├── back-end/            # Flask backend (modular)
├── docker-compose.yml   # Docker orchestration
├── README.md            # This file (start here)
├── DOCKER_README.md     # Docker setup guide
└── DATABASE_SEEDING_GUIDE.md # Data seeding details
```

---

## 🖥️ Manual Setup (No Docker)

### Prerequisites
- **Node.js 18+** and npm
- **Python 3.8+** and pip
- **PostgreSQL**
- **Git**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd webapplication-project
```

### 2. Configure Environment
- **Backend:**
  ```bash
  cd back-end
  cp env.example .env
  # Edit .env with your PostgreSQL credentials
  ```
- **Frontend:**
  ```bash
  cd ../front-end
  cp .env.example .env  # If present
  # Set VITE_API_URL to http://localhost:5000
  ```

### 3. Set Up the Database
- Create a PostgreSQL database (e.g., `cafe_fausse`).
- Update `DATABASE_URL` in `back-end/.env`.

### 4. Install Dependencies
- **Backend:**
  ```bash
  cd ../back-end
  python -m venv venv
  source venv/bin/activate  # On Windows: venv\Scripts\activate
  pip install -r requirements.txt
  ```
- **Frontend:**
  ```bash
  cd ../front-end
  npm install
  ```

### 5. Initialize Database with Demo Data
```bash
cd ../back-end
python init_database.py  # Creates tables and seeds demo data
# Or, to only seed data (if tables already exist):
python seed_only.py
```

### 6. Run the Applications
- **Backend:**
  ```bash
  python run.py
  # API available at http://localhost:5000
  ```
- **Frontend:**
  ```bash
  cd ../front-end
  npm run dev
  # App available at http://localhost:5173
  ```

### 7. Verify Everything is Working ✅

#### Check Backend Health
```bash
curl http://localhost:5000/health
# Should return: {"status": "healthy", "database": "connected", ...}
```

#### Check Demo Data
```bash
# Check menu categories
curl http://localhost:5000/api/menu/categories | jq '.[0].name'
# Should return: "Appetizers"

# Check testimonials
curl http://localhost:5000/api/testimonials | jq 'length'
# Should return: 6

# Check gallery images
curl http://localhost:5000/api/gallery/images | jq 'length'
# Should return: 12
```

#### Check Frontend
- Open http://localhost:5173 in your browser
- You should see the Café Fausse homepage
- Navigate to Menu, Gallery, etc. to verify data is loading

#### Test Login
- Go to the login page
- Use: `admin@cafefausse.com` / `demo123456`
- You should be able to log in and access admin features

**🎉 Success!** Your app is now running with complete demo data.

> **💡 Need to verify everything is working?** See [SETUP_VERIFICATION.md](SETUP_VERIFICATION.md) for detailed verification steps.

---

## 🐳 Docker Setup (Recommended)
See [DOCKER_README.md](DOCKER_README.md) for full instructions.

- One-command setup: `docker-compose up -d`
- All services (frontend, backend, database) start automatically
- Demo data is seeded on first run
- URLs:
  - **Frontend:** http://localhost:8080 (or 3000/5173 if configured)
  - **Backend:** http://localhost:5001

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

See [back-end/README.md](back-end/README.md) for full API docs and usage examples.

---

## ⚙️ Environment Variables

### Backend (`back-end/.env`)
```
FLASK_ENV=development
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://username:password@localhost/cafe_fausse
DEBUG=True
```

### Frontend (`front-end/.env`)
```
VITE_API_URL=http://localhost:5000
```

---

## 🛠️ Troubleshooting & FAQ

### Common Issues
- **Database connection error:**
  - Check `DATABASE_URL` in `.env` and ensure PostgreSQL is running.
- **Frontend can't connect to backend:**
  - Check `VITE_API_URL` and backend port.
- **Missing dependencies:**
  - Run `npm install` (frontend) and `pip install -r requirements.txt` (backend).
- **Port conflicts:**
  - Use `lsof -i :PORT` to find and stop conflicting processes.
- **Demo data not loading:**
  - Run `python init_database.py` (manual) or `docker-compose exec backend python init_database.py` (Docker).

### FAQ
- **Q: Is the manual setup identical to Docker?**
  - **A:** Yes! Both methods deliver the same demo data, endpoints, and experience.
- **Q: Can I use my own database?**
  - **A:** Yes, just update `DATABASE_URL` in `.env`.
- **Q: How do I reset demo data?**
  - **A:** Run `python init_database.py` (manual) or `docker-compose exec backend python init_database.py` (Docker).
- **Q: Where are the admin features?**
  - **A:** Log in as `admin@cafefausse.com` to access admin endpoints.
- **Q: How do I verify everything is working?**
  - **A:** Follow the verification steps in section 7 above.

---

## 🗺️ Documentation Map
- **[README.md](README.md):** Start here (manual & overview)
- **[DOCKER_README.md](DOCKER_README.md):** Docker setup
- **[back-end/README.md](back-end/README.md):** Backend API & dev details
- **[DATABASE_SEEDING_GUIDE.md](DATABASE_SEEDING_GUIDE.md):** Data seeding details
- **[SETUP_VERIFICATION.md](SETUP_VERIFICATION.md):** Verify your setup is working

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