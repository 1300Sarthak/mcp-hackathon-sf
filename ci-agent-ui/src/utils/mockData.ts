// Mock data for testing UI/UX without API calls
// Trigger by entering "lol" or "lol.com" as company name

export const MOCK_COMPANY_NAME = 'lol'
export const MOCK_COMPANY_URL = 'lol.com'

export const isMockCompany = (name: string | undefined): boolean => {
  if (!name) return false
  const normalized = name.toLowerCase().trim()
  return normalized === 'lol' || normalized === 'lol.com' || normalized === 'https://lol.com'
}

export const getMockAnalysisData = () => ({
  competitor: "Lol Corp",
  competitor_website: "https://lol.com",
  research_findings: `# Research Findings for Lol Corp

## Company Overview
Lol Corp is a leading innovation company in the tech entertainment space, founded in 2020. They've quickly become a dominant player with their unique approach to digital experiences.

### Key Information
- **Founded**: 2020
- **Headquarters**: San Francisco, CA
- **Employees**: 500-1000
- **Funding**: Series B ($50M raised)
- **Revenue**: $25M ARR (estimated)

## Market Position
Lol Corp has established itself as a category leader in:
- Digital entertainment platforms
- User-generated content tools
- Social engagement solutions

### Product Offerings
1. **Lol Platform** - Main SaaS product with 100K+ active users
2. **Lol API** - Developer tools and integrations
3. **Lol Enterprise** - B2B solutions for large organizations

## Competitive Advantages
- **First-mover advantage** in their niche
- **Strong community** of 500K+ users
- **Patent portfolio** of 12 patents pending
- **Strategic partnerships** with Fortune 500 companies

## Technology Stack
- React/TypeScript frontend
- Python/FastAPI backend
- PostgreSQL + Redis
- AWS infrastructure
- Real-time WebSocket connections

## Customer Base
- 100,000+ active users
- 500+ enterprise clients
- 95% customer satisfaction rate
- NPS Score: 72

## Recent Activities
- Launched v3.0 with AI features (Q4 2024)
- Expanded to European markets (Q3 2024)
- Acquired competitor "Haha Inc" ($5M) (Q2 2024)
- Raised Series B funding (Q1 2024)`,

  strategic_analysis: `# Strategic Analysis of Lol Corp

## SWOT Analysis

### Strengths
- **Strong Brand Recognition**: 85% awareness in target market
- **Technical Innovation**: Industry-leading AI capabilities
- **User Growth**: 200% YoY growth rate
- **Financial Position**: Well-funded with 24+ months runway
- **Team Quality**: Executives from FAANG companies

### Weaknesses
- **Limited Geographic Reach**: Primarily US-focused
- **Customer Concentration**: Top 10 clients = 40% revenue
- **Profitability**: Not yet profitable, burn rate $2M/month
- **Market Dependency**: Heavy reliance on single market segment

### Opportunities
- **International Expansion**: Europe and Asia markets opening
- **Product Diversification**: Adjacent market opportunities
- **Enterprise Upsell**: Current SMB customers growing
- **Strategic M&A**: Consolidation opportunities in space
- **Platform Play**: Ecosystem development potential

### Threats
- **Well-funded Competitors**: 5+ startups raised $100M+
- **Market Saturation**: Core market becoming crowded
- **Tech Disruption**: AI/ML changing competitive landscape
- **Regulatory Risk**: Increasing data privacy regulations
- **Economic Headwinds**: VC funding environment tightening

## Competitive Positioning

### Market Share
- #2 player in core market (22% share)
- Growing faster than market leader
- 3x growth rate of competitors

### Differentiation Strategy
1. **AI-First Approach**: Leading in ML/AI integration
2. **User Experience**: Best-in-class interface design
3. **Integration Ecosystem**: 100+ integrations
4. **Community-Driven**: Strong user community engagement

## Go-to-Market Strategy
- **Freemium Model**: Free tier converting at 12%
- **Product-Led Growth**: Viral loops built into product
- **Content Marketing**: 500K+ monthly blog visitors
- **Developer Relations**: Active open source presence

## Key Partnerships
- **AWS**: Strategic cloud partner
- **Salesforce**: Integration partnership
- **HubSpot**: Co-marketing agreement
- **Y Combinator**: Alumni network benefits

## Competitive Threats Assessment

### Direct Competitors
1. **Hehe Co** - 30% market share, but legacy tech
2. **Rofl Inc** - Well-funded ($200M), aggressive growth
3. **Lmao Systems** - Enterprise-focused, slower moving

### Indirect Competitors
- Large tech platforms (Google, Microsoft) entering space
- Open source alternatives gaining traction
- Horizontal SaaS tools adding competitive features

## Strategic Recommendations

### Short-term (0-6 months)
- Accelerate enterprise sales motion
- Launch mobile app to capture new use cases
- Expand customer success team to improve retention

### Medium-term (6-18 months)
- International expansion to UK/Germany
- Platform partnerships with major SaaS vendors
- Develop marketplace for third-party extensions

### Long-term (18+ months)
- Consider strategic acquisitions for market consolidation
- Explore horizontal expansion opportunities
- IPO preparation or strategic exit options`,

  final_report: `# Executive Intelligence Report: Lol Corp

## Executive Summary

Lol Corp represents a **MODERATE TO HIGH** competitive threat in the digital entertainment platform space. They are well-positioned with strong fundamentals but face execution challenges in scaling and profitability.

### Key Findings
- 🟢 **Growth Trajectory**: 200% YoY growth, impressive traction
- 🟢 **Product Quality**: Best-in-class user experience
- 🟡 **Financial Health**: Well-funded but burning capital
- 🟡 **Market Position**: #2 player, growing share
- 🔴 **Profitability**: Not yet profitable, 24-month runway

---

## Company Snapshot

| Metric | Value |
|--------|-------|
| **Founded** | 2020 |
| **Funding** | $50M Series B |
| **Employees** | 500-1000 |
| **ARR** | $25M (estimated) |
| **Users** | 100,000+ active |
| **Growth Rate** | 200% YoY |
| **Market Position** | #2 (22% share) |

---

## Competitive Assessment

### Overall Threat Level: ⚠️ MODERATE-HIGH

**Strengths:**
- Rapid user acquisition and retention
- Superior technical architecture
- Strong team from top tech companies
- Healthy funding runway
- High customer satisfaction (95%)

**Vulnerabilities:**
- High burn rate ($2M/month)
- Customer concentration risk
- Limited international presence
- Not yet profitable
- Market becoming crowded

---

## Market Dynamics

### Our Position vs. Lol Corp

**Areas Where We Lead:**
- Market share (if we're #1)
- Profitability and unit economics
- International presence
- Enterprise relationships

**Areas Where They Lead:**
- User growth rate
- Product innovation speed
- Developer mindshare
- Community engagement

### Competitive Moats

**Their Moats:**
- Network effects (100K+ users)
- Technical patents (12 pending)
- Brand recognition (85% awareness)
- Integration ecosystem

**Our Moats:**
- [Need to assess based on our position]

---

## Strategic Implications

### Immediate Actions Required
1. **Monitor Product Launches**: They ship fast, track new features
2. **Defend Key Accounts**: Prevent customer poaching
3. **Accelerate Innovation**: Match their product velocity
4. **Strengthen Community**: Build competitive user engagement

### Defensive Strategies
- Enhance customer success to improve retention
- Lock in enterprise customers with longer contracts
- Invest in features where they're weak (international, compliance)
- Build switching costs through integrations

### Offensive Opportunities
- Target their SMB customers for upsell to enterprise
- Attack their weakness in profitability/sustainability
- Expand where they're not (international markets)
- Acquire their competitors before they do

---

## Risk Assessment

### High Risk Scenarios
1. **Acquisition by Big Tech**: 40% probability - would significantly strengthen them
2. **Breakthrough Product**: 30% probability - could accelerate their growth
3. **Market Consolidation**: 50% probability - likely M&A activity ahead

### Low Risk Scenarios
1. **Funding Issues**: 10% probability - well-capitalized currently
2. **Product Failure**: 15% probability - strong execution track record
3. **Key Personnel Loss**: 20% probability - solid retention

---

## Recommended Actions

### Priority 1: Defend & Strengthen
- [ ] Launch customer retention program
- [ ] Accelerate enterprise features roadmap
- [ ] Increase customer success investments

### Priority 2: Competitive Response
- [ ] Match or exceed their AI capabilities
- [ ] Develop superior mobile experience
- [ ] Build stronger integration ecosystem

### Priority 3: Strategic Positioning
- [ ] Evaluate acquisition targets before they do
- [ ] Expand international presence first
- [ ] Establish thought leadership in space

---

## Monitoring Plan

**Weekly Tracking:**
- Product releases and features
- Job postings (growth signals)
- Social media sentiment
- Customer reviews

**Monthly Analysis:**
- Market share changes
- Pricing adjustments
- Partnership announcements
- Funding activities

**Quarterly Review:**
- Strategic direction shifts
- Leadership changes
- Market position evolution
- Competitive landscape updates

---

## Conclusion

Lol Corp is a **formidable but beatable competitor**. They have momentum and strong fundamentals, but face profitability challenges and market saturation risks. 

**Key Takeaway**: Act now to defend market position while they're still scaling. Their 24-month runway creates a window of opportunity to solidify our competitive advantages before their next funding round.

**Confidence Level**: HIGH (85%)
- Based on public data, market analysis, and competitive intelligence
- Recommend deeper dive into customer win/loss analysis
- Consider direct customer research for validation

---

*Report Generated: ${new Date().toLocaleDateString()}*
*Next Update: 30 days*`,

  metrics: {
    competitive_metrics: {
      threat_level: 75,
      market_position: 68,
      innovation: 85,
      financial_strength: 72,
      brand_recognition: 78
    },
    swot_scores: {
      strengths: 82,
      weaknesses: 45,
      opportunities: 78,
      threats: 65
    }
  },
  
  timestamp: new Date().toISOString(),
  status: "complete",
  workflow: "mock_data"
})

export const getMockDiscoveryData = () => ({
  business_idea: "Testing with Lol",
  discovery_report: `# Competitor Discovery Report

## Discovered Competitors for Your Business

Based on your business idea, we've identified **6 potential competitors** across different competitive categories:

---

## Direct Competitors

### 1. **Hehe Co** - https://hehe.co
**Competitive Overlap**: 85%

Leading player in the space with 30% market share. They offer similar core features but use legacy technology. Strong brand recognition but slower innovation cycle.

- **Founded**: 2018
- **Funding**: $120M (Series C)
- **Employees**: 800-1200
- **Key Strength**: Market leader position
- **Key Weakness**: Technical debt, slow to innovate

---

### 2. **Rofl Inc** - https://rofl.com
**Competitive Overlap**: 78%

Well-funded aggressive competitor with modern tech stack. Growing rapidly through customer acquisition spend. Direct feature-for-feature competitor.

- **Founded**: 2021
- **Funding**: $200M (Series B)
- **Employees**: 400-600
- **Key Strength**: Well-funded, modern tech
- **Key Weakness**: High burn rate, unit economics unclear

---

## Indirect Competitors

### 3. **Lmao Systems** - https://lmao.systems
**Competitive Overlap**: 62%

Enterprise-focused solution with different go-to-market approach. More complex product but higher price point. Not direct threat to SMB segment.

- **Founded**: 2017
- **Funding**: $80M (Profitable)
- **Employees**: 1200-1500
- **Key Strength**: Enterprise relationships, profitability
- **Key Weakness**: Complex product, long sales cycles

---

### 4. **Kek Technologies** - https://kek.tech
**Competitive Overlap**: 55%

Developer-first platform with strong API offering. Popular in technical circles but limited mainstream appeal. Open source components.

- **Founded**: 2020
- **Funding**: $15M (Seed)
- **Employees**: 50-100
- **Key Strength**: Developer community, technical depth
- **Key Weakness**: Limited enterprise readiness

---

## Emerging Threats

### 5. **Omg Labs** - https://omg.io
**Competitive Overlap**: 45%

Stealth startup with strong team (ex-FAANG). Recently raised significant funding. Product in beta but generating buzz. Watch closely.

- **Founded**: 2023
- **Funding**: $30M (Series A)
- **Employees**: 80-120
- **Key Strength**: Strong team, fresh approach
- **Key Weakness**: Unproven product, early stage

---

### 6. **Brb Software** - https://brb.software
**Competitive Overlap**: 40%

Bootstrap company with profitable niche. Not direct competitor but serves adjacent market. Could expand into our space.

- **Founded**: 2019
- **Funding**: Bootstrapped ($5M revenue)
- **Employees**: 30-50
- **Key Strength**: Profitability, focused niche
- **Key Weakness**: Limited resources for expansion

---

## Market Landscape Summary

**Total Addressable Market**: $2.5B
**Market Growth Rate**: 35% CAGR
**Competitive Intensity**: HIGH

### Key Insights

1. **Fragmented Market**: No single dominant player (leader has 30% share)
2. **High Innovation Rate**: New features launching constantly
3. **Well-Funded Space**: $500M+ deployed in last 12 months
4. **Consolidation Likely**: Expect M&A activity in next 18 months

### Competitive Gaps (Opportunities)

- **International Markets**: Most competitors US-focused
- **Mobile Experience**: Underserved area across competitors
- **AI Integration**: Early innings, opportunity to lead
- **Vertical Solutions**: Generic products, vertical-specific opportunity

### Threats on the Horizon

- **Big Tech Entry**: Google/Microsoft watching space
- **Platform Risk**: Dependence on third-party platforms
- **Regulatory**: Increasing data privacy requirements
- **Market Saturation**: Core market filling up

---

## Strategic Recommendations

### Differentiation Strategy
Focus on areas where competitors are weak:
- Superior mobile experience
- AI-first approach
- International expansion
- Vertical-specific solutions

### Market Entry Approach
- Start with underserved segment
- Build strong community first
- Product-led growth motion
- Strategic partnerships

### Competitive Monitoring
Track these competitors weekly:
1. Rofl Inc (biggest threat)
2. Omg Labs (emerging threat)
3. Hehe Co (market leader)

---

*Discovery completed: ${new Date().toLocaleDateString()}*
*Competitors analyzed: 6*
*Confidence: HIGH (82%)*`,
  
  competitors: [
    {
      name: "Hehe Co",
      website: "https://hehe.co",
      description: "Market leader with 30% share but legacy tech",
      type: "direct",
      confidence: "high"
    },
    {
      name: "Rofl Inc",
      website: "https://rofl.com",
      description: "Well-funded aggressive competitor, modern stack",
      type: "direct",
      confidence: "high"
    },
    {
      name: "Lmao Systems",
      website: "https://lmao.systems",
      description: "Enterprise-focused, profitable but complex",
      type: "indirect",
      confidence: "medium"
    },
    {
      name: "Kek Technologies",
      website: "https://kek.tech",
      description: "Developer-first platform with strong API",
      type: "indirect",
      confidence: "medium"
    },
    {
      name: "Omg Labs",
      website: "https://omg.io",
      description: "Stealth startup, ex-FAANG team, watch closely",
      type: "emerging",
      confidence: "medium"
    },
    {
      name: "Brb Software",
      website: "https://brb.software",
      description: "Bootstrapped profitable niche player",
      type: "indirect",
      confidence: "low"
    }
  ]
})

// Simulate streaming events for mock data
export const generateMockStreamEvents = (type: 'analysis' | 'discovery') => {
  const getTimestamp = () => new Date().toISOString()
  const events = []
  
  events.push({
    type: 'session_start',
    message: 'Starting mock analysis...',
    timestamp: getTimestamp()
  })
  
  events.push({
    type: 'status_update',
    message: '🔍 Analyzing Lol Corp (MOCK DATA)',
    step: 'research_start',
    timestamp: getTimestamp()
  })
  
  events.push({
    type: 'tool_call',
    tool_name: 'web_search',
    message: 'Simulating web search...',
    timestamp: getTimestamp()
  })
  
  events.push({
    type: 'status_update',
    message: '📊 Generating strategic analysis...',
    step: 'analysis_start',
    timestamp: getTimestamp()
  })
  
  events.push({
    type: 'tool_call',
    tool_name: 'competitor_analysis',
    message: 'Analyzing competitive position...',
    timestamp: getTimestamp()
  })
  
  events.push({
    type: 'status_update',
    message: '📝 Creating executive report...',
    step: 'report_start',
    timestamp: getTimestamp()
  })
  
  if (type === 'analysis') {
    events.push({
      type: 'complete',
      data: getMockAnalysisData(),
      timestamp: getTimestamp()
    })
  } else {
    events.push({
      type: 'complete',
      data: getMockDiscoveryData(),
      timestamp: getTimestamp()
    })
  }
  
  return events
}

