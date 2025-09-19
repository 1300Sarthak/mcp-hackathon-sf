#!/usr/bin/env python3
"""
Redis Setup Script for Competitive Intelligence API
Helps verify Redis installation and configuration

This script is part of the redis-test branch implementation
"""

import os
import sys
import subprocess
import json
from typing import Dict, Any


def check_redis_installed():
    """Check if Redis Python package is installed"""
    try:
        import redis
        print("✅ Redis Python package is installed")
        return True
    except ImportError:
        print("❌ Redis Python package not found")
        return False


def install_redis_packages():
    """Install Redis Python packages"""
    print("📦 Installing Redis packages...")
    try:
        subprocess.check_call(
            [sys.executable, "-m", "pip", "install", "redis", "hiredis"])
        print("✅ Redis packages installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install Redis packages: {e}")
        return False


def check_redis_server():
    """Check if Redis server is running"""
    try:
        import redis
        client = redis.Redis(host='localhost', port=6379,
                             decode_responses=True, socket_connect_timeout=2)
        client.ping()
        print("✅ Redis server is running and accessible")
        return True
    except Exception as e:
        print(f"❌ Redis server connection failed: {e}")
        print("💡 Start Redis server with: docker run -d --name redis-cache -p 6379:6379 redis:7-alpine")
        return False


def test_cache_functionality():
    """Test basic cache operations"""
    try:
        from redis_cache import get_cache

        cache = get_cache()

        # Test set and get
        test_key = "ci:test:setup"
        test_data = {"test": "data", "timestamp": "2024-01-01"}

        success = cache.set(test_key, test_data, 60)  # 60 second TTL
        if not success:
            print("❌ Cache set operation failed")
            return False

        retrieved = cache.get(test_key)
        if not retrieved:
            print("❌ Cache get operation failed")
            return False

        # Cleanup
        cache.delete(test_key)

        print("✅ Cache functionality test passed")
        return True

    except Exception as e:
        print(f"❌ Cache functionality test failed: {e}")
        return False


def display_setup_instructions():
    """Display setup instructions based on operating system"""
    print("\n" + "="*60)
    print("🚀 REDIS SETUP INSTRUCTIONS")
    print("="*60)

    print("\n📋 Option 1: Docker (Recommended)")
    print("docker run -d --name redis-cache -p 6379:6379 redis:7-alpine")

    print("\n📋 Option 2: Local Installation")

    if sys.platform == "darwin":  # macOS
        print("brew install redis")
        print("brew services start redis")
    elif sys.platform.startswith("linux"):  # Linux
        print("sudo apt update && sudo apt install redis-server")
        print("sudo systemctl start redis-server")
    else:  # Windows
        print("Use Docker or WSL2 with Linux instructions")

    print("\n📋 Environment Configuration")
    print("Add to your .env file:")
    print("""
REDIS_ENABLED=true
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_DEFAULT_TTL=3600
REDIS_ANALYSIS_TTL=86400
REDIS_RESEARCH_TTL=7200
REDIS_GEMINI_TTL=86400
    """.strip())


def main():
    """Main setup verification"""
    print("🔧 Redis Setup Verification for Competitive Intelligence API")
    print("📋 Redis-Test Branch Implementation")
    print("="*70)

    all_good = True

    # Step 1: Check Redis Python package
    print("\n1. Checking Redis Python package...")
    if not check_redis_installed():
        print("   Installing Redis packages...")
        if not install_redis_packages():
            all_good = False
        else:
            print("   ✅ Redis packages ready")

    # Step 2: Check Redis server
    print("\n2. Checking Redis server connection...")
    if not check_redis_server():
        all_good = False
        display_setup_instructions()

    # Step 3: Test cache functionality (only if server is running)
    if all_good:
        print("\n3. Testing cache functionality...")
        if not test_cache_functionality():
            all_good = False

    # Results
    print("\n" + "="*70)
    if all_good:
        print("🎉 REDIS SETUP COMPLETE!")
        print("✅ All systems ready for caching")
        print("\n💡 Your API will now cache analysis results for faster responses")
        print("💡 Check cache stats at: GET /cache/stats")
        print(
            "💡 Test with: curl -X POST http://localhost:8000/analyze -d '{\"competitor_name\":\"TestCompany\"}'")
    else:
        print("⚠️  REDIS SETUP INCOMPLETE")
        print("❌ Some components need attention")
        print("💡 Follow the instructions above to complete setup")

    print("="*70)


if __name__ == "__main__":
    main()
