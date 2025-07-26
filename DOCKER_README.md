# Café Fausse - Docker Setup Guide

This guide provides instructions for running the Café Fausse restaurant application using Docker and Docker Compose.

---

## 🚦 Quick Start: Docker vs Manual

| Setup Method | Guide |
|--------------|-------|
| **Docker**   | This guide (recommended) |
| **Manual**   | [README.md](README.md) |

> **Note:** Both methods deliver the **same demo data, endpoints, and user experience**. Docker is faster and requires no local dependencies.

---

## 🐳 Quick Start with Docker

### Prerequisites
- **Docker** (version 20.10+)
- **Docker Compose** (version 2.0+)
- **Git**

### One-Command Setup

```bash
# Clone the repository
git clone <repository-url>
cd webapplication-project

# Start all services with Docker Compose
docker-compose up -d
```

That's it! The application will be available at:
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5001
- **Database**: PostgreSQL on localhost:5434

---

## 🚀 Detailed Setup

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd webapplication-project
```

### 2. Environment Configuration (Optional)
The Docker setup works with default environment variables. For customization:

```bash
# Backend environment (optional)
cp back-end/env.example back-end/.env

# Frontend environment (optional)
cp front-end/.env.example front-end/.env
```

### 3. Start Services

#### Option A: Start All Services (Recommended)
```bash
docker-compose up -d
```

#### Option B: Start Services Individually
```bash
# Start database first
docker-compose up -d db

# Start backend
docker-compose up -d backend

# Start frontend
docker-compose up -d frontend
```

### 4. Verify Everything is Working ✅

#### Check Service Status
```bash
docker-compose ps
# All services should show "Up" status
```

#### Check Backend Health
```bash
curl http://localhost:5001/health
# Should return: {"status": "healthy", "database": "connected", ...}
```

#### Check Demo Data
```bash
# Check menu categories
curl http://localhost:5001/api/menu/categories | jq '.[0].name'
# Should return: "Appetizers"

# Check testimonials
curl http://localhost:5001/api/testimonials | jq 'length'
# Should return: 6

# Check gallery images
curl http://localhost:5001/api/gallery/images | jq 'length'
# Should return: 12
```

#### Check Frontend
- Open http://localhost:8080 in your browser
- You should see the Café Fausse homepage
- Navigate to Menu, Gallery, etc. to verify data is loading

#### Test Login
- Go to the login page
- Use: `admin@cafefausse.com` / `demo123456`
- You should be able to log in and access admin features

**🎉 Success!** Your Docker app is now running with complete demo data.

> **💡 Need to verify everything is working?** See [SETUP_VERIFICATION.md](SETUP_VERIFICATION.md) for detailed verification steps.

---

## 📊 Service Details

### Services Overview

| Service | Port | Description |
|---------|------|-------------|
| **frontend** | 8080 | React application |
| **backend** | 5001 | Flask API |
| **db** | 5434 | PostgreSQL database |

### Container Names
- `webapplication-project-frontend-1`
- `webapplication-project-backend-1`
- `webapplication-project-db-1`

---

## 🔧 Docker Commands

### Basic Operations

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs frontend
docker-compose logs backend
docker-compose logs db

# Restart a service
docker-compose restart backend

# Rebuild and start
docker-compose up -d --build
```

### Database Operations

```bash
# Access database shell
docker-compose exec db psql -U cafe_fausse_user -d cafe_fausse

# Backup database
docker-compose exec db pg_dump -U cafe_fausse_user cafe_fausse > backup.sql

# Restore database
docker-compose exec -T db psql -U cafe_fausse_user -d cafe_fausse < backup.sql

# Reset database
docker-compose down -v
docker-compose up -d
```

### Application Operations

```bash
# Run backend commands
docker-compose exec backend python init_database.py
docker-compose exec backend python seed_only.py
docker-compose exec backend python test_seeding.py

# Access backend shell
docker-compose exec backend python

# View backend logs
docker-compose logs -f backend
```

---

## 🌟 Demo Data

The Docker setup includes comprehensive demo data:

### Demo Users
- **Demo User**: `demo@cafefausse.com` / `demo123456`
- **Admin User**: `admin@cafefausse.com` / `demo123456`
- **Chef User**: `chef@cafefausse.com` / `demo123456`

### Included Data
- **Menu**: 4 categories with 12 French dishes
- **Gallery**: 12 high-quality restaurant images
- **Testimonials**: 6 customer reviews
- **Awards**: 3 restaurant awards
- **Sample Data**: Customers, reservations, newsletter subscribers

---

## 🔍 Monitoring and Debugging

### Health Checks

```bash
# Check if services are running
docker-compose ps

# Check service health
curl http://localhost:5001/health
curl http://localhost:8080

# View resource usage
docker stats
```

### Logs and Debugging

```bash
# Follow logs in real-time
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Access container shell
docker-compose exec backend bash
docker-compose exec frontend sh
```

### Database Debugging

```bash
# Connect to database
docker-compose exec db psql -U cafe_fausse_user -d cafe_fausse

# Check tables
\dt

# Check data
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM menu_items;
SELECT COUNT(*) FROM gallery_images;
```

---

## 🛠️ Development with Docker

### Development Mode

For development, you can mount source code volumes:

```bash
# Start in development mode
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### Hot Reloading

The development setup includes:
- **Frontend**: Hot reloading with Vite
- **Backend**: Auto-restart on code changes
- **Database**: Persistent data storage

### Code Changes

```bash
# Frontend changes are automatically reflected
# Backend changes trigger auto-restart
# Database changes persist between restarts
```

---

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```bash
FLASK_ENV=development
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://cafe_fausse_user:cafe_fausse_password@db:5432/cafe_fausse
DEBUG=True
```

#### Frontend (.env)
```bash
VITE_API_URL=http://localhost:5001
```

### Docker Compose Configuration

The `docker-compose.yml` file includes:
- **PostgreSQL**: Database with persistent volume
- **Backend**: Flask API with auto-restart
- **Frontend**: React app with hot reloading
- **Networks**: Internal communication between services

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
lsof -i :8080
lsof -i :5001
lsof -i :5434

# Stop conflicting services or change ports in docker-compose.yml
```

#### 2. Database Connection Issues
```bash
# Check if database is running
docker-compose ps db

# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

#### 3. Frontend Can't Connect to Backend
```bash
# Check if backend is running
docker-compose ps backend

# Check backend logs
docker-compose logs backend

# Verify API URL in frontend
docker-compose exec frontend cat .env
```

#### 4. Demo Data Not Loading
```bash
# Check if data seeding completed
docker-compose logs backend | grep -i "seed\|demo"

# Manually seed data
docker-compose exec backend python init_database.py

# Verify data
docker-compose exec backend python test_seeding.py
```

#### 5. Permission Issues
```bash
# Fix file permissions
sudo chown -R $USER:$USER .

# Rebuild containers
docker-compose down
docker-compose up -d --build
```

#### 6. Out of Disk Space
```bash
# Clean up Docker
docker system prune -a
docker volume prune

# Remove unused containers and images
docker container prune
docker image prune
```

### Reset Everything

```bash
# Stop and remove everything
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Start fresh
docker-compose up -d
```

---

## 📈 Production Deployment

### Production Configuration

For production deployment:

1. **Update environment variables**
   ```bash
   FLASK_ENV=production
   DEBUG=False
   SECRET_KEY=your-production-secret-key
   ```

2. **Use production Docker Compose**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

3. **Set up reverse proxy** (nginx/traefik)

4. **Configure SSL certificates**

5. **Set up monitoring and logging**

### Scaling

```bash
# Scale backend services
docker-compose up -d --scale backend=3

# Scale frontend services
docker-compose up -d --scale frontend=2
```

---

## 🔄 Updates and Maintenance

### Updating the Application

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Database Migrations

```bash
# Run migrations
docker-compose exec backend flask db upgrade

# Seed new data
docker-compose exec backend python seed_only.py
```

### Backup and Restore

```bash
# Create backup
docker-compose exec db pg_dump -U cafe_fausse_user cafe_fausse > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
docker-compose exec -T db psql -U cafe_fausse_user -d cafe_fausse < backup_file.sql
```

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Manual Setup Guide](README.md)
- [Database Seeding Guide](DATABASE_SEEDING_GUIDE.md)

---

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the logs: `docker-compose logs`
3. Verify your Docker and Docker Compose versions
4. Check the [Manual Setup Guide](README.md) for comparison
5. Create an issue in the repository with:
   - Docker version
   - Docker Compose version
   - Operating system
   - Error logs

---

**Happy Dockerizing! 🐳** 