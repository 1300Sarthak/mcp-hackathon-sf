# Competitive Intelligence Frontend

React frontend for the Multi-Agent Competitive Intelligence API.

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS
- shadcn/ui components
- React Hook Form + Zod validation
- Recharts for visualizations

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend available at http://localhost:5173

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview build
npm run lint     # ESLint
```

## Configuration

Create `.env.local` to override API URL:

```bash
VITE_API_URL=http://localhost:8000
```

## Components

### Main Views
- `LandingPage` - Home page with search
- `DashboardRedesigned` - Analysis results
- `CompanyComparison` - Compare two competitors

### Features
- `CompetitorDiscoveryChat` - Find competitors from business idea
- `CompetitiveDashboard` - Metrics visualization
- `DemoScenarios` - Sample companies for testing

### UI
All shadcn/ui components in `components/ui/`

## API Integration

Connects to backend at `VITE_API_URL` (default: http://localhost:8000)

**Endpoints used:**
- `POST /analyze/stream` - Streaming analysis
- `POST /discover/competitors/stream` - Competitor discovery
- `GET /demo-scenarios` - Demo companies

## Build

```bash
npm run build
# Deploy dist/ folder
```
