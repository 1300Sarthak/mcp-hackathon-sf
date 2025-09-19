#!/bin/bash

# Script to start the API with Python 3.12.10
echo "Starting Competitive Intelligence API..."

# Navigate to the API directory
cd "$(dirname "$0")"

# Check if Redis is running, start it if not
if ! redis-cli ping > /dev/null 2>&1; then
    echo "Starting Redis..."
    brew services start redis
    sleep 2
fi

# Activate virtual environment
source venv/bin/activate

# Set Python version
pyenv local 3.12.10

# Start the API
python app.py
