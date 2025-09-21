#!/bin/bash

# Quick start script for local development
echo "🚀 Starting Competitive Intelligence System Locally..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if .env file exists in api directory
if [ ! -f "api/.env" ]; then
    echo "⚠️  No .env file found in api/ directory."
    echo "Creating example .env file..."
    cat > api/.env << EOF
GEMINI_API_KEY=your_gemini_api_key_here
BRIGHTDATA_API_KEY=your_brightdata_api_key_here
REDIS_URL=redis://localhost:6379
ENVIRONMENT=development
EOF
    echo "📝 Please edit api/.env with your actual API keys"
    echo "💡 Get Gemini API key from: https://makersuite.google.com/app/apikey"
    echo "💡 Get Bright Data API key from: https://brightdata.com"
    exit 1
fi

# Start services with Docker Compose
echo "🐳 Starting services with Docker Compose..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are healthy
echo "🔍 Checking service health..."

# Check Redis
if docker-compose exec redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is running"
else
    echo "❌ Redis failed to start"
fi

# Check API
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend API is running"
else
    echo "❌ Backend API failed to start"
    echo "📋 Check logs with: docker-compose logs api"
fi

echo ""
echo "🎉 System is ready!"
echo "📊 Backend API: http://localhost:8000"
echo "🌐 API Health: http://localhost:8000/health"
echo "📖 API Docs: http://localhost:8000/docs"
echo ""
echo "To start the frontend:"
echo "  cd ci-agent-ui"
echo "  npm install"
echo "  npm run dev"
echo ""
echo "To stop services: docker-compose down"
echo "To view logs: docker-compose logs -f"
