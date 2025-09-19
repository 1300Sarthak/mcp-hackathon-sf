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

## Data Visualization System (ADDED)

### Problem Solved
The original system returned only text-based analysis which was hard to digest and not executive-ready. Added comprehensive data visualization to transform competitive intelligence into interactive charts and dashboards.

### Implementation Details

#### 1. Backend Data Extraction Enhancement
**Modified AI Agent Prompts** (`ci_agent.py`):
```python
ANALYST_PROMPT = """...
IMPORTANT: Structure your response with these EXACT sections for data extraction:

## METRICS
- Competitive Threat Level: [1-5]
- Market Position Score: [1-10]
- Innovation Score: [1-10]
- Financial Strength: [1-10]
- Brand Recognition: [1-10]

## SWOT SCORES
- Strengths: [1-10]
- Weaknesses: [1-10] 
- Opportunities: [1-10]
- Threats: [1-10]
..."""
```

**Added Metrics Extraction Function**:
```python
def extract_metrics_from_analysis(analysis_text: str) -> Dict[str, Any]:
    """Extract structured metrics from AI analysis text"""
    # Uses regex to parse competitive metrics and SWOT scores
    # Returns structured data for visualization
```

**Enhanced API Response Model** (`app.py`):
```python
class AnalysisResponse(BaseModel):
    # ... existing fields ...
    metrics: Optional[Dict[str, Any]] = None  # NEW FIELD
```

#### 2. Frontend Visualization Components
**Installed Recharts**: `npm install recharts`

**Created CompetitiveDashboard.tsx**:
- **Chart Types Implemented**:
  - Bar Charts (competitive metrics overview)
  - Pie Charts (SWOT analysis breakdown)  
  - Radial Gauge (threat level indicator)
  - Metric Cards (key performance indicators)
  - Horizontal Bar Charts (SWOT comparison)

**Enhanced CompetitiveIntelligenceForm.tsx**:
- Added metrics interface types
- Integrated dashboard component above text reports
- Real-time chart updates during analysis

#### 3. Data Structure
```typescript
interface AnalysisResult {
  // ... existing fields ...
  metrics?: {
    competitive_metrics?: {
      threat_level?: number        // 1-5 scale
      market_position?: number     // 1-10 scale
      innovation?: number          // 1-10 scale
      financial_strength?: number  // 1-10 scale
      brand_recognition?: number   // 1-10 scale
    }
    swot_scores?: {
      strengths?: number           // 1-10 scale
      weaknesses?: number          // 1-10 scale
      opportunities?: number       // 1-10 scale
      threats?: number             // 1-10 scale
    }
  }
}
```

### Visual Features
- **Color-Coded Threat Levels**: Green (Low 1-2), Yellow (Medium 3), Red (High 4-5)
- **Interactive Tooltips**: Hover for detailed information
- **Responsive Design**: Works on all device sizes
- **Professional Styling**: Consistent with existing Tailwind CSS
- **Real-Time Updates**: Charts populate as analysis completes

### Chart Types & Business Value

1. **Competitive Metrics Bar Chart**
   - Visual comparison of market position, innovation, financial strength, brand recognition
   - Easy executive-level overview

2. **SWOT Analysis Pie Chart** 
   - Immediate visual breakdown of company strengths vs. weaknesses
   - Color-coded for quick insight

3. **Threat Level Gauge**
   - Radial progress indicator for competitive threat (1-5 scale)
   - Color changes based on threat level for immediate assessment

4. **Metric Cards Dashboard**
   - Key numbers displayed with professional icons
   - Quick scanning of competitor strengths

5. **SWOT Scores Comparison**
   - Horizontal bar chart showing relative SWOT element strength
   - Identifies dominant strategic factors

### Files Modified/Created

**Backend Changes**:
1. `api/ci_agent.py` - Enhanced prompts + metrics extraction
2. `api/app.py` - Updated response model

**Frontend Additions**:
1. `ci-agent-ui/src/components/CompetitiveDashboard.tsx` - NEW (main dashboard)
2. `ci-agent-ui/src/components/DashboardDemo.tsx` - NEW (demo component)
3. `ci-agent-ui/src/components/CompetitiveIntelligenceForm.tsx` - Enhanced with dashboard
4. `package.json` - Added recharts dependency

### Business Impact Transformation

**Before**: Text wall → hard to digest → not executive-ready
**After**: Interactive visuals → immediate insights → board-presentation ready

**Key Benefits**:
- **Immediate Insight**: Threat level visible at a glance
- **Comparative Analysis**: Easy competitor strength/weakness identification
- **Executive Ready**: Professional charts for presentations  
- **Actionable Data**: Visual patterns reveal strategic opportunities

## Notes
- System works with placeholder keys (for basic testing)
- Real competitive intelligence requires actual API keys
- No hardcoded company data - completely dynamic analysis
- Frontend streams real-time updates from backend during analysis
- Bright Data zone set to "datacenter" (most reliable)
- **NEW**: Interactive visualization dashboard transforms text analysis into executive-ready charts
- **NEW**: Structured metrics extraction from AI responses enables quantified competitive intelligence
