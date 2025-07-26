# Setup Verification Guide

This guide confirms that your Café Fausse application is properly set up and running with complete demo data.

---

## ✅ What Should Be Working

After following either the **Docker** or **Manual** setup, you should have:

### 1. Services Running
- **Backend API**: http://localhost:5000 (manual) or http://localhost:5001 (Docker)
- **Frontend App**: http://localhost:5173 (manual) or http://localhost:8080 (Docker)
- **Database**: PostgreSQL with demo data

### 2. Demo Data Available
- **3 Demo Users**: demo@cafefausse.com, admin@cafefausse.com, chef@cafefausse.com
- **4 Menu Categories**: Appetizers, Main Courses, Desserts, Beverages
- **12 Menu Items**: French dishes with prices and descriptions
- **12 Gallery Images**: High-quality restaurant and food photos
- **6 Testimonials**: Customer reviews and ratings
- **3 Awards**: Restaurant accolades
- **Sample Data**: Customers, reservations, newsletter subscribers

### 3. API Endpoints Working
- Health check: `GET /health`
- Menu: `GET /api/menu/categories`
- Gallery: `GET /api/gallery/images`
- Testimonials: `GET /api/testimonials`
- Reservations: `POST /api/reservations`
- Authentication: `POST /api/auth/login`

---

## 🔍 Verification Steps

### Step 1: Check Backend Health

**Manual Setup:**
```bash
curl http://localhost:5000/health
```

**Docker Setup:**
```bash
curl http://localhost:5001/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### Step 2: Verify Demo Data

**Check Menu Categories:**
```bash
# Manual
curl http://localhost:5000/api/menu/categories | jq '.[0].name'

# Docker
curl http://localhost:5001/api/menu/categories | jq '.[0].name'
```
**Expected:** `"Appetizers"`

**Check Testimonials Count:**
```bash
# Manual
curl http://localhost:5000/api/testimonials | jq 'length'

# Docker
curl http://localhost:5001/api/testimonials | jq 'length'
```
**Expected:** `6`

**Check Gallery Images Count:**
```bash
# Manual
curl http://localhost:5000/api/gallery/images | jq 'length'

# Docker
curl http://localhost:5001/api/gallery/images | jq 'length'
```
**Expected:** `12`

### Step 3: Test Frontend

1. **Open the frontend URL:**
   - Manual: http://localhost:5173
   - Docker: http://localhost:8080

2. **Verify pages load:**
   - Homepage displays Café Fausse branding
   - Menu page shows 4 categories with items
   - Gallery page displays 12 images
   - Testimonials page shows 6 reviews

### Step 4: Test Authentication

1. **Navigate to login page**
2. **Use demo credentials:**
   - Email: `admin@cafefausse.com`
   - Password: `demo123456`
3. **Verify successful login**
4. **Check admin features are accessible**

### Step 5: Test Database (Optional)

**Manual Setup:**
```bash
cd back-end
python test_seeding.py
```

**Docker Setup:**
```bash
docker-compose exec backend python test_seeding.py
```

**Expected Output:**
```
✅ Database seeding verification completed successfully!
✅ All tables have the expected number of records
✅ Data quality checks passed
```

---

## 🚨 Troubleshooting

### If Backend Health Check Fails

**Manual Setup:**
```bash
cd back-end
# Check if backend is running
ps aux | grep python

# Restart backend
python run.py
```

**Docker Setup:**
```bash
# Check container status
docker-compose ps

# Restart backend
docker-compose restart backend

# Check logs
docker-compose logs backend
```

### If Demo Data is Missing

**Manual Setup:**
```bash
cd back-end
python init_database.py
```

**Docker Setup:**
```bash
docker-compose exec backend python init_database.py
```

### If Frontend Can't Connect to Backend

**Check API URL configuration:**
- Manual: Ensure `VITE_API_URL=http://localhost:5000` in `front-end/.env`
- Docker: Ensure `VITE_API_URL=http://localhost:5001` in `front-end/.env`

### If Database Connection Fails

**Manual Setup:**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection string in back-end/.env
cat back-end/.env | grep DATABASE_URL
```

**Docker Setup:**
```bash
# Check database container
docker-compose ps db

# Check database logs
docker-compose logs db
```

---

## 🎯 Success Criteria

Your setup is **complete and working** when:

1. ✅ Backend health check returns `{"status": "healthy"}`
2. ✅ Menu categories API returns 4 categories
3. ✅ Testimonials API returns 6 testimonials
4. ✅ Gallery API returns 12 images
5. ✅ Frontend loads without errors
6. ✅ Login works with demo credentials
7. ✅ All pages display demo data correctly

---

## 📞 Need Help?

If you're still having issues:

1. **Check the main documentation:**
   - [README.md](README.md) - Manual setup guide
   - [DOCKER_README.md](DOCKER_README.md) - Docker setup guide

2. **Review troubleshooting sections** in both guides

3. **Verify your environment:**
   - Node.js 18+ and npm
   - Python 3.8+ and pip
   - PostgreSQL (manual) or Docker (Docker setup)

4. **Create an issue** in the repository with:
   - Setup method used (Docker/Manual)
   - Error messages
   - Environment details

---

**🎉 Congratulations!** If all verification steps pass, your Café Fausse application is fully operational with complete demo data. 