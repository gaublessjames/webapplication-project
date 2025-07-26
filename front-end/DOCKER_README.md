# Docker Setup for Café Fausse Frontend

This document explains how to run the Café Fausse frontend application using Docker.

> **Note**: For complete application setup with frontend, backend, and database, see the main [DOCKER_README.md](../DOCKER_README.md) in the project root.

## Prerequisites

- Docker installed on your system
- Docker Compose (usually comes with Docker Desktop)

## Development Mode

### Option 1: Using Docker Compose (Recommended)

1. **Start the entire stack** (frontend + backend + database):
   ```bash
   cd /path/to/webapplication-project
   docker-compose up
   ```

2. **Access the application**:
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:5001
   - Database: localhost:5434

### Option 2: Using Docker directly

1. **Build the frontend image**:
   ```bash
   cd front-end
   docker build -t cafe-fausse-frontend .
   ```

2. **Run the container**:
   ```bash
   docker run --rm -p 8080:8080 cafe-fausse-frontend
   ```

3. **Access the application**: http://localhost:8080

## Production Mode

### Building Production Image

1. **Build the production image**:
   ```bash
   cd front-end
   docker build -f Dockerfile.prod -t cafe-fausse-frontend:prod .
   ```

2. **Run the production container**:
   ```bash
   docker run --rm -p 80:80 cafe-fausse-frontend:prod
   ```

3. **Access the application**: http://localhost

## Docker Configuration Details

### Development Dockerfile (`Dockerfile`)
- Uses Node.js 20 Alpine for smaller image size
- Installs dependencies and runs development server
- Exposes port 8080
- Includes hot reload for development

### Production Dockerfile (`Dockerfile.prod`)
- Multi-stage build for optimized production image
- Builds the application and serves with nginx
- Includes compression, caching, and security headers
- Exposes port 80

### Docker Compose Configuration
- Orchestrates frontend, backend, and database services
- Sets up proper networking between services
- Includes volume mounts for development
- Configures environment variables

## Environment Variables

The following environment variables can be configured:

- `VITE_LOCAL_API_URL`: Backend API URL (default: http://localhost:5001/api)
- `NODE_ENV`: Node environment (development/production)

## Troubleshooting

### Port Conflicts
If you get port binding errors:
```bash
# Check what's using the port
lsof -i :8080

# Use a different port
docker run --rm -p 3000:8080 cafe-fausse-frontend
```

### Build Issues
If the build fails:
```bash
# Clean up and rebuild
docker system prune -f
docker build --no-cache -t cafe-fausse-frontend .
```

### Container Not Starting
Check the logs:
```bash
docker logs <container_id>
```

## Development Workflow

1. **Start services**: `docker-compose up`
2. **Make code changes**: Files are mounted as volumes, so changes are reflected immediately
3. **View logs**: `docker-compose logs -f frontend`
4. **Stop services**: `docker-compose down`

## Production Deployment

For production deployment:

1. **Build production image**:
   ```bash
   docker build -f Dockerfile.prod -t cafe-fausse-frontend:prod .
   ```

2. **Run with proper environment variables**:
   ```bash
   docker run -d \
     -p 80:80 \
     -e VITE_LOCAL_API_URL=https://your-api-domain.com/api \
     cafe-fausse-frontend:prod
   ```

## Security Considerations

- Production image includes security headers
- Uses nginx for better performance and security
- Static assets are properly cached
- Gzip compression enabled for better performance

## Performance Optimization

- Multi-stage build reduces final image size
- Static assets are cached for 1 year
- Gzip compression reduces bandwidth usage
- Nginx serves static files efficiently 