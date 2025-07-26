#!/bin/bash

echo "🐳 Testing Docker Setup for Café Fausse Frontend"
echo "================================================"

# Test 1: Development build
echo "1. Testing development build..."
if docker build -t cafe-fausse-frontend-test . > /dev/null 2>&1; then
    echo "✅ Development build successful"
else
    echo "❌ Development build failed"
    exit 1
fi

# Test 2: Production build
echo "2. Testing production build..."
if docker build -f Dockerfile.prod -t cafe-fausse-frontend-prod-test . > /dev/null 2>&1; then
    echo "✅ Production build successful"
else
    echo "❌ Production build failed"
    exit 1
fi

# Test 3: Development container startup
echo "3. Testing development container startup..."
DEV_CONTAINER=$(docker run -d --rm -p 8082:8080 cafe-fausse-frontend-test)
sleep 10

if docker ps | grep -q $DEV_CONTAINER; then
    echo "✅ Development container started successfully"
    docker stop $DEV_CONTAINER > /dev/null 2>&1
else
    echo "❌ Development container failed to start"
    docker stop $DEV_CONTAINER > /dev/null 2>&1
    exit 1
fi

# Test 4: Production container startup
echo "4. Testing production container startup..."
PROD_CONTAINER=$(docker run -d --rm -p 8083:80 cafe-fausse-frontend-prod-test)
sleep 5

if docker ps | grep -q $PROD_CONTAINER; then
    echo "✅ Production container started successfully"
    docker stop $PROD_CONTAINER > /dev/null 2>&1
else
    echo "❌ Production container failed to start"
    docker stop $PROD_CONTAINER > /dev/null 2>&1
    exit 1
fi

# Cleanup
echo "5. Cleaning up test images..."
docker rmi cafe-fausse-frontend-test cafe-fausse-frontend-prod-test > /dev/null 2>&1

echo ""
echo "🎉 All Docker tests passed!"
echo ""
echo "To run the application:"
echo "  Development: docker run --rm -p 8080:8080 cafe-fausse-frontend"
echo "  Production:  docker run --rm -p 80:80 cafe-fausse-frontend:prod"
echo "  Full stack:   docker-compose up" 