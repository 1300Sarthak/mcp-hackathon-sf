import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  Shield, 
  AlertTriangle, 
  Target,
  Building,
  DollarSign,
  Globe,
  Zap,
  BarChart3,
  Calendar,
  Lightbulb,
  CheckCircle,
  ExternalLink,
  Twitter,
  Linkedin
} from 'lucide-react'
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer
} from 'recharts'

interface CompetitiveMetrics {
  threat_level?: number
  market_position?: number
  innovation?: number
  financial_strength?: number
  brand_recognition?: number
}

interface SwotScores {
  strengths?: number
  weaknesses?: number
  opportunities?: number
  threats?: number
}

interface BentoAnalysisData {
  competitor: string
  website?: string
  competitive_metrics?: CompetitiveMetrics
  swot_scores?: SwotScores
  research_findings: string
  strategic_analysis: string
  final_report: string
  timestamp: string
}

interface BentoAnalysisLayoutProps {
  data: BentoAnalysisData
}

const COLORS = {
  primary: '#60A5FA',
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#F87171',
  purple: '#A78BFA',
  indigo: '#818CF8',
  pink: '#F472B6',
  gray: '#9CA3AF',
  accent: '#FACC15'
}

export default function BentoAnalysisLayout({ data }: BentoAnalysisLayoutProps) {
  const { competitor, competitive_metrics, swot_scores } = data

  const threatLevel = competitive_metrics?.threat_level || 0
  const getThreatColor = (level: number) => {
    if (level <= 2) return COLORS.success
    if (level <= 3) return COLORS.warning
    return COLORS.danger
  }

  const getThreatLabel = (level: number) => {
    if (level <= 2) return 'Low Risk'
    if (level <= 3) return 'Medium Risk'
    return 'High Risk'
  }

  // Mock data extracted from research findings (in real implementation, this would be parsed)
  const mockCompanyData = {
    founded: '2007',
    employees: '15,000+',
    valuation: '$15B',
    lastFunding: 'Series E - $500M',
    headquarters: 'Los Gatos, CA',
    ceo: 'Reed Hastings',
    revenue: '$31.6B (2023)',
    marketCap: '$147B',
    customers: '260M+',
    countries: '190+',
    recentNews: [
      { title: 'Q4 2023 Earnings Beat Expectations', date: '2024-01-18', type: 'financial' },
      { title: 'New AI-Powered Content Recommendations', date: '2024-01-15', type: 'product' },
      { title: 'Partnership with Major Studios Announced', date: '2024-01-10', type: 'partnership' }
    ],
    socialMedia: {
      twitter: '23.5M',
      linkedin: '4.2M',
      instagram: '15.8M'
    },
    keyProducts: [
      { name: 'Netflix Streaming', users: '260M', revenue: '85%' },
      { name: 'Netflix Games', users: '5M', revenue: '2%' },
      { name: 'Netflix Ads', users: '15M', revenue: '13%' }
    ],
    competitors: [
      { name: 'Disney+', marketShare: '12%', threat: 4 },
      { name: 'Amazon Prime', marketShare: '18%', threat: 5 },
      { name: 'HBO Max', marketShare: '8%', threat: 3 }
    ]
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#f9f9f9' }}>{competitor}</h1>
            <p className="text-gray-400">Competitive Intelligence Analysis</p>
          </div>
        </div>
        
        {/* Quick Stats Bar */}
        <div className="flex justify-center space-x-6 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{mockCompanyData.valuation}</div>
            <div className="text-xs text-gray-400">Valuation</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{mockCompanyData.employees}</div>
            <div className="text-xs text-gray-400">Employees</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{mockCompanyData.customers}</div>
            <div className="text-xs text-gray-400">Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{mockCompanyData.countries}</div>
            <div className="text-xs text-gray-400">Countries</div>
          </div>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 auto-rows-fr">
        
        {/* Threat Level - Large Card (2x2) */}
        <Card 
          className="md:col-span-2 lg:row-span-2 border-0 shadow-lg"
          style={{ backgroundColor: '#1a1a1a', borderColor: '#262626' }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg" style={{ color: '#f9f9f9' }}>
              <AlertTriangle className="w-5 h-5 mr-2" style={{ color: getThreatColor(threatLevel) }} />
              Competitive Threat
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col items-center justify-center h-32">
              <div className="relative w-24 h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="60%" 
                    outerRadius="90%" 
                    data={[{ value: (threatLevel / 5) * 100, fill: getThreatColor(threatLevel) }]}
                  >
                    <RadialBar dataKey="value" cornerRadius={30} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold" style={{ color: '#f9f9f9' }}>{threatLevel}</span>
                </div>
              </div>
              <Badge 
                className="mt-3 text-white border-0"
                style={{ backgroundColor: getThreatColor(threatLevel) }}
              >
                {getThreatLabel(threatLevel)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Financial Overview (1x2) */}
        <Card 
          className="lg:row-span-2 border-0 shadow-lg"
          style={{ backgroundColor: '#1a1a1a', borderColor: '#262626' }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm" style={{ color: '#f9f9f9' }}>
              <DollarSign className="w-4 h-4 mr-2 text-green-400" />
              Financial
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-lg font-bold text-green-400">{mockCompanyData.revenue}</div>
              <div className="text-xs text-gray-400">Annual Revenue</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-400">{mockCompanyData.marketCap}</div>
              <div className="text-xs text-gray-400">Market Cap</div>
            </div>
            <div>
              <div className="text-sm font-medium text-purple-400">{mockCompanyData.lastFunding}</div>
              <div className="text-xs text-gray-400">Last Funding</div>
            </div>
          </CardContent>
        </Card>

        {/* Market Position Score (1x1) */}
        <Card 
          className="border-0 shadow-lg"
          style={{ backgroundColor: '#1a1a1a', borderColor: '#262626' }}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-400">Market Position</div>
                <div className="text-2xl font-bold text-blue-400">
                  {competitive_metrics?.market_position || 0}/10
                </div>
              </div>
              <Target className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        {/* Innovation Score (1x1) */}
        <Card 
          className="border-0 shadow-lg"
          style={{ backgroundColor: '#1a1a1a', borderColor: '#262626' }}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-400">Innovation</div>
                <div className="text-2xl font-bold text-purple-400">
                  {competitive_metrics?.innovation || 0}/10
                </div>
              </div>
              <Lightbulb className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        {/* Recent News Feed (2x1) */}
        <Card 
          className="md:col-span-2 border-0 shadow-lg"
          style={{ backgroundColor: '#1a1a1a', borderColor: '#262626' }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm" style={{ color: '#f9f9f9' }}>
              <Calendar className="w-4 h-4 mr-2 text-yellow-400" />
              Recent Developments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockCompanyData.recentNews.map((news, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 rounded-lg" style={{ backgroundColor: '#111827' }}>
                <div className={`w-2 h-2 rounded-full ${
                  news.type === 'financial' ? 'bg-green-400' : 
                  news.type === 'product' ? 'bg-blue-400' : 'bg-purple-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-200 truncate">{news.title}</div>
                  <div className="text-xs text-gray-400">{news.date}</div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* SWOT Analysis (2x2) */}
        <Card 
          className="md:col-span-2 lg:row-span-2 border-0 shadow-lg"
          style={{ backgroundColor: '#1a1a1a', borderColor: '#262626' }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg" style={{ color: '#f9f9f9' }}>
              <BarChart3 className="w-5 h-5 mr-2 text-green-400" />
              SWOT Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 h-48">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {swot_scores?.strengths || 0}
                </div>
                <div className="text-sm text-gray-400">Strengths</div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((swot_scores?.strengths || 0) / 10) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">
                  {swot_scores?.weaknesses || 0}
                </div>
                <div className="text-sm text-gray-400">Weaknesses</div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-red-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((swot_scores?.weaknesses || 0) / 10) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {swot_scores?.opportunities || 0}
                </div>
                <div className="text-sm text-gray-400">Opportunities</div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((swot_scores?.opportunities || 0) / 10) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {swot_scores?.threats || 0}
                </div>
                <div className="text-sm text-gray-400">Threats</div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((swot_scores?.threats || 0) / 10) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Info (1x2) */}
        <Card 
          className="lg:row-span-2 border-0 shadow-lg"
          style={{ backgroundColor: '#1a1a1a', borderColor: '#262626' }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm" style={{ color: '#f9f9f9' }}>
              <Building className="w-4 h-4 mr-2 text-gray-400" />
              Company Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-xs text-gray-400">Founded</div>
              <div className="text-sm font-medium text-gray-200">{mockCompanyData.founded}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">HQ</div>
              <div className="text-sm font-medium text-gray-200">{mockCompanyData.headquarters}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">CEO</div>
              <div className="text-sm font-medium text-gray-200">{mockCompanyData.ceo}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Employees</div>
              <div className="text-sm font-medium text-gray-200">{mockCompanyData.employees}</div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Presence (2x1) */}
        <Card 
          className="md:col-span-2 border-0 shadow-lg"
          style={{ backgroundColor: '#1a1a1a', borderColor: '#262626' }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm" style={{ color: '#f9f9f9' }}>
              <Globe className="w-4 h-4 mr-2 text-blue-400" />
              Social Media Reach
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Twitter className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-lg font-bold text-blue-400">{mockCompanyData.socialMedia.twitter}</div>
                  <div className="text-xs text-gray-400">Twitter</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Linkedin className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-lg font-bold text-blue-600">{mockCompanyData.socialMedia.linkedin}</div>
                  <div className="text-xs text-gray-400">LinkedIn</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div>
                  <div className="text-lg font-bold text-pink-400">{mockCompanyData.socialMedia.instagram}</div>
                  <div className="text-xs text-gray-400">Instagram</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Products (3x1) */}
        <Card 
          className="md:col-span-3 border-0 shadow-lg"
          style={{ backgroundColor: '#1a1a1a', borderColor: '#262626' }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm" style={{ color: '#f9f9f9' }}>
              <Zap className="w-4 h-4 mr-2 text-yellow-400" />
              Product Portfolio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {mockCompanyData.keyProducts.map((product, index) => (
                <div key={index} className="text-center p-3 rounded-lg" style={{ backgroundColor: '#111827' }}>
                  <div className="text-sm font-medium text-gray-200 mb-1">{product.name}</div>
                  <div className="text-lg font-bold text-accent mb-1">{product.users}</div>
                  <div className="text-xs text-gray-400">Users</div>
                  <div className="text-sm text-green-400 mt-1">{product.revenue} Revenue</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Competitive Landscape (3x1) */}
        <Card 
          className="md:col-span-3 border-0 shadow-lg"
          style={{ backgroundColor: '#1a1a1a', borderColor: '#262626' }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm" style={{ color: '#f9f9f9' }}>
              <Target className="w-4 h-4 mr-2 text-red-400" />
              Competitive Landscape
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockCompanyData.competitors.map((comp, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#111827' }}>
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium text-gray-200">{comp.name}</div>
                    <Badge variant="outline" className="text-xs">
                      {comp.marketShare} market share
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-xs text-gray-400">Threat Level:</div>
                    <div className={`text-sm font-bold ${
                      comp.threat <= 2 ? 'text-green-400' : 
                      comp.threat <= 3 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {comp.threat}/5
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Action Items Section */}
      <Card 
        className="border-0 shadow-lg"
        style={{ backgroundColor: '#1a1a1a', borderColor: '#262626' }}
      >
        <CardHeader>
          <CardTitle className="flex items-center text-lg" style={{ color: '#f9f9f9' }}>
            <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
            Strategic Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#111827' }}>
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <div className="text-sm font-medium text-blue-400">Defensive Moves</div>
              </div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Strengthen content moat</li>
                <li>• Improve user retention</li>
                <li>• Enhance pricing strategy</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#111827' }}>
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <div className="text-sm font-medium text-green-400">Growth Opportunities</div>
              </div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Expand gaming portfolio</li>
                <li>• International market growth</li>
                <li>• AI-powered personalization</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#111827' }}>
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <div className="text-sm font-medium text-yellow-400">Watch Points</div>
              </div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Disney+ subscriber growth</li>
                <li>• Amazon Prime bundling</li>
                <li>• Ad-tier performance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
