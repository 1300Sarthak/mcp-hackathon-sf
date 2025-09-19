# Redis Caching Setup for Competitive Intelligence API

## Overview

This document explains how to set up Redis caching for the Competitive Intelligence API to improve performance, reduce API costs, and provide faster response times.

**Branch**: This Redis implementation is designed for the `redis-test` branch.

## Why Redis Caching?

1. **Cost Reduction**: Gemini API calls are expensive - caching prevents redundant API calls
2. **Performance**: Cached analyses return in milliseconds instead of seconds
3. **Reliability**: System works even when APIs are temporarily unavailable
4. **Data Persistence**: Analysis results are preserved and can be reused

## Redis Configuration

### Environment Variables

Add these variables to your `.env` file:

```bash
# Redis Cache Configuration
REDIS_ENABLED=true
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# For cloud Redis (Railway, Heroku, etc.)
REDIS_URL=redis://username:password@hostname:port/database

# Cache TTL Settings (in seconds)
REDIS_DEFAULT_TTL=3600        # 1 hour - default cache TTL
REDIS_ANALYSIS_TTL=86400      # 24 hours - full analysis results
REDIS_RESEARCH_TTL=7200       # 2 hours - research data
REDIS_GEMINI_TTL=86400        # 24 hours - Gemini API responses
```

### Local Redis Setup

#### Option 1: Docker (Recommended)

```bash
# Start Redis with Docker
docker run -d --name redis-cache -p 6379:6379 redis:7-alpine

# With password protection
docker run -d --name redis-cache -p 6379:6379 redis:7-alpine redis-server --requirepass yourpassword
```

#### Option 2: Direct Installation

**macOS:**

```bash
brew install redis
brew services start redis
```

**Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
```

**Windows:**
Use Docker or WSL2 with Ubuntu instructions.

### Cloud Redis Options

#### Railway (Recommended for deployment)

1. Go to [Railway.app](https://railway.app)
2. Add Redis service to your project
3. Copy the `REDIS_URL` from Railway dashboard
4. Set `REDIS_URL` in your environment

#### Redis Cloud

1. Sign up at [Redis Cloud](https://redis.com/redis-enterprise-cloud/)
2. Create a free database
3. Get connection details and set `REDIS_URL`

## Installation

1. **Install Redis dependencies:**

```bash
cd /Users/sarthak/mcp-hackathon-sf/api
pip install redis hiredis
```

2. **Update your `.env` file:**

```bash
# Add Redis configuration to api/.env
REDIS_ENABLED=true
REDIS_HOST=localhost
REDIS_PORT=6379
# ... other Redis settings
```

3. **Start Redis server** (if using local installation)

4. **Test the setup:**

```bash
python -c "from redis_cache import get_cache; print(get_cache().get_cache_stats())"
```

## Cache Behavior

### What Gets Cached

1. **Complete Analysis Results** (24h TTL)

   - Full competitive intelligence reports
   - Structured metrics and SWOT analysis
   - Visualization data

2. **Gemini API Responses** (24h TTL)

   - Individual agent responses
   - Reduces expensive API calls

3. **Research Data** (2h TTL)
   - Web scraping results
   - Shorter TTL as data becomes outdated faster

### Cache Keys

The system generates unique cache keys based on:

- Competitor name (normalized)
- Website URL
- Analysis parameters

### Cache Management

#### API Endpoints

**Get cache statistics:**

```bash
GET /cache/stats
```

**Clear competitor cache:**

```bash
DELETE /cache/competitor/Notion
```

**Force refresh analysis:**

```bash
POST /cache/refresh/Notion?competitor_website=https://notion.so
```

**Check system status (includes cache):**

```bash
GET /status
```

## Usage Examples

### First Analysis (Cache Miss)

```bash
curl -X POST "http://localhost:8000/analyze" \
  -H "Content-Type: application/json" \
  -d '{"competitor_name": "Notion", "competitor_website": "https://notion.so"}'

# Response includes: "cache_stored": true
# Takes ~30-60 seconds for full analysis
```

### Subsequent Analysis (Cache Hit)

```bash
curl -X POST "http://localhost:8000/analyze" \
  -H "Content-Type: application/json" \
  -d '{"competitor_name": "Notion", "competitor_website": "https://notion.so"}'

# Response includes cached data
# Returns in ~100-500ms
```

### Check Cache Status

```bash
curl "http://localhost:8000/cache/stats"

# Response:
{
  "enabled": true,
  "connected": true,
  "total_keys": 15,
  "analysis_cached": 5,
  "research_cached": 8,
  "gemini_cached": 12,
  "memory_used": "2.1M"
}
```

## Performance Benefits

| Scenario        | Without Cache | With Cache     | Improvement        |
| --------------- | ------------- | -------------- | ------------------ |
| First analysis  | 30-60s        | 30-60s         | -                  |
| Repeat analysis | 30-60s        | 0.1-0.5s       | **60-600x faster** |
| API costs       | Full cost     | ~90% reduction | **10x savings**    |
| System load     | High          | Low            | Significant        |

## Implementation Details

### Files Added/Modified

1. **`redis_cache.py`** - New Redis cache manager
2. **`ci_agent.py`** - Added caching to workflow
3. **`app.py`** - Added cache management endpoints
4. **`requirements.txt`** - Added Redis dependencies

### Cache Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Request   │───▶│   Check Cache   │───▶│   Return Data   │
│                 │    │                 │    │   (100ms)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼ Cache Miss
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Run Analysis  │───▶│   Store Cache   │
                       │   (30-60s)      │    │   Return Data   │
                       └─────────────────┘    └─────────────────┘
```

## Troubleshooting

### Redis Connection Issues

1. **Check Redis is running:**

```bash
redis-cli ping
# Should return: PONG
```

2. **Check environment variables:**

```bash
python -c "import os; print(os.getenv('REDIS_HOST', 'Not set'))"
```

3. **Test connection:**

```bash
python -c "from redis_cache import get_cache; cache = get_cache(); print('Connected!' if cache.redis_client else 'Failed')"
```

### Cache Not Working

1. **Verify REDIS_ENABLED=true** in `.env`
2. **Check logs** for Redis connection errors
3. **Verify TTL settings** are reasonable
4. **Test with simple cache operations**

### Performance Issues

1. **Monitor memory usage:** `GET /cache/stats`
2. **Clear old cache:** `DELETE /cache/competitor/{name}`
3. **Adjust TTL values** based on your needs
4. **Use Redis monitoring tools**

## Security Considerations

1. **Use passwords** for production Redis instances
2. **Restrict network access** to Redis server
3. **Consider encryption** for sensitive data
4. **Regular backups** of important cached data
5. **Monitor access logs**

## Redis Access & Management

### 🔍 Current Redis Location

Your Redis is running in a Docker container with these details:

- **Container Name**: `redis-cache`
- **Image**: `redis:7-alpine`
- **Host Port**: `6379` (mapped to container port 6379)
- **Container IP**: `172.17.0.3` (accessible via localhost:6379)
- **Status**: Check with `docker ps | grep redis`

### 🔧 How to Access Redis

#### **1. Command Line Access**

```bash
# Connect using Docker exec (recommended)
docker exec -it redis-cache redis-cli

# Or connect from host (if you have redis-cli installed locally)
redis-cli -h localhost -p 6379
```

#### **2. Check Current Cache Data**

```bash
# See all keys in your competitive intelligence cache
docker exec redis-cache redis-cli keys "ci:*"

# View all Redis keys
docker exec redis-cache redis-cli keys "*"

# Get a specific cached analysis (replace hash with actual key)
docker exec redis-cache redis-cli get "ci:analysis:abc123..."

# Count total keys
docker exec redis-cache redis-cli dbsize
```

#### **3. Redis Management Commands**

```bash
# Get Redis server info
docker exec redis-cache redis-cli info

# Check memory usage
docker exec redis-cache redis-cli info memory

# Monitor Redis commands in real-time
docker exec redis-cache redis-cli monitor

# Test connection
docker exec redis-cache redis-cli ping
# Should return: PONG
```

#### **4. Cache Management**

```bash
# Clear all cache data
docker exec redis-cache redis-cli flushall

# Clear specific competitor cache (via API)
curl -X DELETE http://localhost:8000/cache/competitor/Notion

# View cache statistics (via API)
curl http://localhost:8000/cache/stats | python -m json.tool
```

#### **5. Container Management**

```bash
# Check if Redis container is running
docker ps | grep redis-cache

# Stop Redis container
docker stop redis-cache

# Start Redis container
docker start redis-cache

# Restart Redis container
docker restart redis-cache

# View Redis logs
docker logs redis-cache

# Remove container (⚠️ will lose all cached data)
docker rm redis-cache
```

### 💾 Data Storage Details

- **Container Storage**: `/data` (inside container)
- **Persistence**: Data persists between container restarts
- **Host Access**: Data not directly accessible from host filesystem
- **Backup**: Use `docker exec redis-cache redis-cli save` to create snapshot

### 🔍 Monitoring Cache Usage

#### **Real-time Monitoring**

```bash
# Watch cache statistics
watch -n 2 "curl -s http://localhost:8000/cache/stats | python -m json.tool"

# Monitor Redis memory usage
watch -n 5 "docker exec redis-cache redis-cli info memory | grep used_memory_human"

# Monitor active keys
watch -n 10 "docker exec redis-cache redis-cli dbsize"
```

#### **Cache Analysis**

```bash
# See what types of data are cached
docker exec redis-cache redis-cli keys "ci:analysis:*" | wc -l  # Analysis count
docker exec redis-cache redis-cli keys "ci:research:*" | wc -l  # Research count
docker exec redis-cache redis-cli keys "ci:gemini:*" | wc -l    # Gemini response count

# Check TTL (time to live) for keys
docker exec redis-cache redis-cli ttl "ci:analysis:some-key"
```

### 🔒 Security & Access Control

- **Current Setup**: No password (suitable for local development)
- **Network Access**: Only accessible from localhost
- **Container Isolation**: Protected by Docker's network isolation

**For Production**: Add password protection:

```bash
# Start Redis with password
docker run -d --name redis-cache -p 6379:6379 redis:7-alpine redis-server --requirepass yourpassword

# Then update your .env file:
REDIS_PASSWORD=yourpassword
```

### 🚨 Troubleshooting Redis Issues

#### **Connection Problems**

```bash
# 1. Check if container is running
docker ps | grep redis-cache

# 2. Test Redis connection
docker exec redis-cache redis-cli ping

# 3. Check port binding
docker port redis-cache

# 4. Restart if needed
docker restart redis-cache
```

#### **Performance Issues**

```bash
# Check memory usage
docker exec redis-cache redis-cli info memory

# Monitor slow queries
docker exec redis-cache redis-cli slowlog get 10

# Check Redis configuration
docker exec redis-cache redis-cli config get "*"
```

#### **Data Issues**

```bash
# Check if keys exist
docker exec redis-cache redis-cli exists "ci:analysis:some-key"

# Check key expiration
docker exec redis-cache redis-cli ttl "ci:analysis:some-key"

# View key type and size
docker exec redis-cache redis-cli type "ci:analysis:some-key"
docker exec redis-cache redis-cli memory usage "ci:analysis:some-key"
```

## Monitoring

### Key Metrics to Track

1. **Cache Hit Rate**: Higher is better (target: >80%)
2. **Memory Usage**: Monitor Redis memory consumption
3. **Response Times**: Compare cached vs uncached requests
4. **API Cost Reduction**: Track Gemini API usage reduction

### Logging

The system logs cache operations:

- `🎯 Cache HIT` - Successful cache retrieval
- `❌ Cache MISS` - Cache not found, will generate fresh
- `💾 Cache SET` - Data stored in cache
- `⚠️ Cache error` - Connection or operation issues

## Best Practices

1. **Start with longer TTL** and adjust based on data freshness needs
2. **Monitor cache hit rates** and optimize accordingly
3. **Use appropriate Redis instance size** for your data volume
4. **Implement cache warming** for frequently accessed competitors
5. **Regular cleanup** of unused cache entries
6. **Backup important analysis results** outside of cache

## Integration with Visualization

The cached analysis results include structured metrics that power the dashboard charts:

```json
{
  "metrics": {
    "competitive_metrics": {
      "threat_level": 4,
      "market_position": 8,
      "innovation": 9
    },
    "swot_scores": {
      "strengths": 8,
      "weaknesses": 3,
      "opportunities": 7,
      "threats": 5
    }
  }
}
```

This ensures that charts and graphs load instantly from cached data, providing a smooth user experience.

## Branch Information

This Redis caching implementation is designed for the `redis-test` branch. To use this implementation:

1. Create and switch to the redis-test branch:

```bash
git checkout -b redis-test
```

2. Install dependencies and configure Redis as described above

3. Test the caching functionality with the provided endpoints

4. Monitor performance improvements and cache hit rates

The implementation is backward-compatible and will gracefully fall back to non-cached operation if Redis is unavailable.
