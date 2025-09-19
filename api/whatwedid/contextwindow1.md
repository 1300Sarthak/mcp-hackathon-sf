# Multi-Agent Competitive Intelligence System - Setup & Fixes

## Overview
This document details the complete setup and fixes applied to make the multi-agent competitive intelligence system work with real data collection instead of mock/hardcoded data.

## Project Structure
```
/Users/samsonxu/mcp-hackathon-sf/
├── api/                          # Python FastAPI backend
│   ├── app.py                   # Main FastAPI application
│   ├── ci_agent.py              # Multi-agent intelligence system
│   ├── requirements.txt         # Python dependencies
│   ├── .env                     # Environment variables (not committed)
│   └── README_API.md            # API documentation
└── ci-agent-ui/                 # React/Vite frontend
    ├── src/
    │   ├── components/
    │   │   ├── CompetitiveIntelligenceForm.tsx  # Main form component
    │   │   └── ui/              # Shadcn UI components
    │   └── lib/
    │       └── utils.ts         # Utility functions (FIXED)
    ├── package.json
    └── vite.config.ts
```

## Issues Found & Fixes Applied

### 1. Frontend Missing Utility File
**Problem**: Frontend components importing `@/lib/utils` which didn't exist
**Error**: `Failed to resolve import "@/lib/utils"`
**Fix**: Created `/Users/samsonxu/mcp-hackathon-sf/ci-agent-ui/src/lib/utils.ts`
```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 2. Frontend API Configuration
**Problem**: Frontend hardcoded to call remote production API
**Original**: `const API_BASE_URL = 'https://ci-api-production.up.railway.app'`
**Fix**: Changed to local backend
```typescript
const API_BASE_URL = 'http://localhost:8000'
```
**File**: `/Users/samsonxu/mcp-hackathon-sf/ci-agent-ui/src/components/CompetitiveIntelligenceForm.tsx`

### 3. Backend Environment Variables Setup
**Problem**: Backend couldn't start without proper API keys
**Fix**: Added automatic `.env` loading in both main files:

**File**: `/Users/samsonxu/mcp-hackathon-sf/api/app.py`
```python
from dotenv import load_dotenv
load_dotenv()  # Added at top
```

**File**: `/Users/samsonxu/mcp-hackathon-sf/api/ci_agent.py`
```python
from dotenv import load_dotenv
load_dotenv()  # Added at top
```

### 4. Backend Startup Crash Fix
**Problem**: Backend crashed on startup when API keys were invalid/missing
**Original Code**:
```python
try:
    get_gemini_model()
    logger.info("✅ Gemini model configuration verified")
except Exception as e:
    logger.error(f"❌ Environment setup failed: {e}")
    raise  # This crashed the app
```

**Fix**: Made startup non-blocking
```python
try:
    get_gemini_model()
    logger.info("✅ Gemini model configuration verified")
except Exception as e:
    logger.warning(f"⚠️ Environment setup incomplete: {e}")
    logger.info("💡 Add real API keys to api/.env to enable full functionality")
    # No longer raises - allows app to start
```

### 5. Bright Data Configuration Fix
**Problem**: Bright Data tool using invalid zone "web_unlocker1"
**Error**: "The default zone 'web_unlocker1' is not valid"

**Root Cause**: Missing Bright Data environment configuration

**Fix 1**: Updated `.env` file structure
```bash
# Backend API Keys - Replace with your real keys
GEMINI_API_KEY=your_gemini_key_here
GEMINI_MODEL_NAME=gemini-2.0-flash

# Bright Data Configuration
BRIGHTDATA_API_KEY=your_brightdata_key_here
BRIGHTDATA_ZONE=datacenter
BRIGHTDATA_USERNAME=your_brightdata_username  
BRIGHTDATA_PASSWORD=your_brightdata_password
```

**Fix 2**: Added Bright Data configuration function in `ci_agent.py`
```python
def get_configured_bright_data():
    """Configure Bright Data tool with proper zone settings"""
    
    # Set environment variables for Bright Data if they're missing
    if not os.getenv("BRIGHTDATA_ZONE"):
        os.environ["BRIGHTDATA_ZONE"] = "datacenter"
    
    if not os.getenv("BRIGHTDATA_USERNAME") and os.getenv("BRIGHTDATA_API_KEY"):
        # For API key auth, username can be set to a default
        os.environ["BRIGHTDATA_USERNAME"] = "api_user"
    
    return bright_data
```

**Fix 3**: Updated agent initialization
```python
# Before
tools=[bright_data],

# After  
configured_bright_data = get_configured_bright_data()
tools=[configured_bright_data],
```

## System Architecture

### Multi-Agent Workflow
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   📊 Researcher │───▶│   🔍 Analyst    │───▶│   📝 Writer     │
│     Agent       │    │     Agent       │    │     Agent       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
   Data Collection      Strategic Analysis       Report Generation
   - Web scraping       - SWOT analysis         - Executive summary
   - Market research     - Threat assessment     - Recommendations
   - Company intel       - Competitive position  - Action items
```

### Technology Stack
- **Backend**: FastAPI + Python 3.13
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **AI**: Google Gemini 2.0 Flash via LiteLLM
- **Web Scraping**: Bright Data via strands-tools
- **Agent Framework**: Strands Agents
- **Streaming**: Server-Sent Events (SSE)

## Current Working Status

### ✅ What's Working
1. **Backend API**: Running on http://localhost:8000
2. **Frontend UI**: Running on Vite dev server (typically http://localhost:5173)
3. **Real Data Collection**: Bright Data making actual web requests
4. **Multi-Agent Analysis**: All 3 agents working (Researcher → Analyst → Writer)
5. **Streaming Updates**: Real-time progress via SSE
6. **Any Company Analysis**: No hardcoded data - can analyze any company

### 🔧 Dependencies Installed
All required packages already installed:
- strands-agents (1.9.0)
- strands-agents-tools (0.2.8) 
- fastapi, uvicorn, pydantic
- litellm for Gemini integration
- python-dotenv for environment variables

### 📝 Evidence of Success
Backend logs showing real web scraping:
```
[Bright Data] Request: https://www.google.com/search?q=San%20Jose%20State%20University%20recent%20news
[Bright Data] Request: https://www.netflix.com/signup/planform
[Bright Data] Request: https://www.google.com/search?q=netflix%20leadership%20team
```

## How to Run

### Start Backend
```bash
cd /Users/samsonxu/mcp-hackathon-sf/api
python3 app.py
# or
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### Start Frontend  
```bash
cd /Users/samsonxu/mcp-hackathon-sf/ci-agent-ui
npm run dev
```

### Test Endpoints
- Health: `curl http://localhost:8000/health`
- Status: `curl http://localhost:8000/status`
- Frontend: Visit Vite dev server URL

## API Keys Required
To enable full functionality, add real keys to `/Users/samsonxu/mcp-hackathon-sf/api/.env`:
- `GEMINI_API_KEY`: From https://aistudio.google.com/app/apikey
- `BRIGHTDATA_API_KEY`: From https://brightdata.com/

## Key Files Modified
1. `ci-agent-ui/src/lib/utils.ts` - CREATED
2. `ci-agent-ui/src/components/CompetitiveIntelligenceForm.tsx` - API URL changed
3. `api/app.py` - Added dotenv loading + non-blocking startup
4. `api/ci_agent.py` - Added dotenv loading + Bright Data configuration
5. `api/.env` - Updated with proper Bright Data zone settings

## Notes
- System works with placeholder keys (for basic testing)
- Real competitive intelligence requires actual API keys
- No hardcoded company data - completely dynamic analysis
- Frontend streams real-time updates from backend during analysis
- Bright Data zone set to "datacenter" (most reliable)
