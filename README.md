# Info-Ninja: AI-Powered Competitive Intelligence Platform

## Inspiration

Companies spend weeks manually gathering competitive intelligence - scraping websites, analyzing reports, and synthesizing insights. **Info-Ninja** delivers executive-ready competitive intelligence in minutes, not weeks.

## What It Does

**Info-Ninja** is a multi-agent AI platform for competitive research:

### Niche-Specific Intelligence
- **Department Focus**: Analyze competitors through specific lenses (IT, Sales, Marketing, Finance, Product, HR)
- **Targeted Research**: Each analysis focuses on relevant metrics for your chosen business function
- **Comprehensive Mode**: "All Departments" option for complete overview

### Multi-Agent Architecture
- **Researcher Agent**: Gathers data from diverse sources using Bright Data MCP tools
- **Analyst Agent**: Performs strategic analysis with quantified metrics and SWOT assessment
- **Writer Agent**: Creates executive-ready reports with actionable recommendations

### Interactive Visualizations
- Real-time charts for key metrics
- Visual SWOT analysis breakdown
- Color-coded threat level indicators

### High-Performance Caching
- Redis integration with 90% cost reduction
- 600x speed improvement for cached results
- Niche-aware caching with separate entries per analysis focus

## Tech Stack

### Frontend
- React + TypeScript
- Tailwind CSS
- Recharts for visualizations
- Shadcn/UI components

### Backend
- FastAPI with streaming (SSE)
- Strands Agents framework
- Google Gemini 2.0
- Redis caching

### Data Collection
- Bright Data MCP integration
- 10+ source types (websites, SEC filings, job boards, reviews, social media)

## Quick Start

### Backend

```bash
cd api
pip install -r requirements.txt
export GEMINI_API_KEY="your_key"
export BRIGHTDATA_API_KEY="your_key"
python app.py
```

### Frontend

```bash
cd ci-agent-ui
npm install
npm run dev
```

### With Docker

```bash
docker-compose up
```

## Performance

| Metric | Value |
|--------|-------|
| First analysis | 30-60 seconds |
| Cached analysis | ~100ms |
| Speed improvement | 600x |
| API cost reduction | 90% |

## API Endpoints

```
POST /analyze/stream                  # Competitive analysis with streaming
POST /discover/competitors/stream     # Find competitors from business idea
GET  /cache/stats                     # Cache statistics
```

## Team

Sarthak, Tanzil, Edwin, Samson
