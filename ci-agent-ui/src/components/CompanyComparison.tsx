import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { 
  Search, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Target,
  Building,
  Users,
  DollarSign,
  BarChart3,
  Zap
} from 'lucide-react'

interface CompanyComparisonProps {
  onBack?: () => void
}

interface CompanyData {
  name: string
  website?: string
  research_findings: string
  strategic_analysis: string
  final_report: string
  metrics?: {
    competitive_metrics?: {
      threat_level?: number
      market_position?: number
      innovation?: number
      financial_strength?: number
      brand_recognition?: number
    }
    swot_scores?: {
      strengths?: number
      weaknesses?: number
      opportunities?: number
      threats?: number
    }
  }
}

interface ComparisonResult {
  company1: CompanyData
  company2: CompanyData
  comparison_analysis: string
  competitive_positioning: string
  market_dynamics: string
  strategic_recommendations: string
}

const API_BASE_URL = 'http://localhost:8000'

export default function CompanyComparison({ onBack }: CompanyComparisonProps) {
  const [company1, setCompany1] = useState('')
  const [company1Website, setCompany1Website] = useState('')
  const [company2, setCompany2] = useState('')
  const [company2Website, setCompany2Website] = useState('')
  const [isComparing, setIsComparing] = useState(false)
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!company1.trim() || !company2.trim()) return

    setIsComparing(true)
    setProgress(0)
    setCurrentStep('Initializing comparison...')
    setComparisonResult(null)
    setError(null)

    try {
      // First, analyze both companies individually
      setCurrentStep('Analyzing first company...')
      setProgress(20)
      
      const company1Response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitor_name: company1,
          competitor_website: company1Website || undefined,
          niche: 'all',
          stream: false
        }),
      })

      if (!company1Response.ok) {
        throw new Error(`Failed to analyze ${company1}`)
      }

      const company1Data = await company1Response.json()
      setProgress(50)
      setCurrentStep('Analyzing second company...')

      const company2Response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitor_name: company2,
          competitor_website: company2Website || undefined,
          niche: 'all',
          stream: false
        }),
      })

      if (!company2Response.ok) {
        throw new Error(`Failed to analyze ${company2}`)
      }

      const company2Data = await company2Response.json()
      setProgress(80)
      setCurrentStep('Generating comparison analysis...')

      // Generate comparison analysis using the discovery endpoint with a special prompt
      const comparisonResponse = await fetch(`${API_BASE_URL}/discover/competitors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_idea: `Compare and contrast ${company1} vs ${company2}. Analyze their competitive positioning, market dynamics, strengths/weaknesses relative to each other, and provide strategic recommendations for how each company could better compete against the other.

          Company 1 Data: ${JSON.stringify(company1Data)}
          Company 2 Data: ${JSON.stringify(company2Data)}`,
          stream: false
        }),
      })

      if (!comparisonResponse.ok) {
        throw new Error('Failed to generate comparison analysis')
      }

      const comparisonData = await comparisonResponse.json()
      setProgress(100)
      setCurrentStep('Comparison complete!')

      // Structure the final result
      const result: ComparisonResult = {
        company1: {
          name: company1Data.competitor,
          website: company1Data.website,
          research_findings: company1Data.research_findings,
          strategic_analysis: company1Data.strategic_analysis,
          final_report: company1Data.final_report,
          metrics: company1Data.metrics
        },
        company2: {
          name: company2Data.competitor,
          website: company2Data.website,
          research_findings: company2Data.research_findings,
          strategic_analysis: company2Data.strategic_analysis,
          final_report: company2Data.final_report,
          metrics: company2Data.metrics
        },
        comparison_analysis: comparisonData.discovery_report,
        competitive_positioning: comparisonData.competitive_analysis,
        market_dynamics: comparisonData.competitors_found,
        strategic_recommendations: comparisonData.discovery_report
      }

      setComparisonResult(result)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      setCurrentStep('Comparison failed')
    } finally {
      setIsComparing(false)
    }
  }

  const getMetricComparison = (metric: keyof NonNullable<CompanyData['metrics']>['competitive_metrics'], label: string) => {
    const company1Value = comparisonResult?.company1.metrics?.competitive_metrics?.[metric] || 0
    const company2Value = comparisonResult?.company2.metrics?.competitive_metrics?.[metric] || 0
    
    return {
      company1Value,
      company2Value,
      winner: company1Value > company2Value ? 'company1' : company2Value > company1Value ? 'company2' : 'tie',
      label
    }
  }

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: '#0a0a0a',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="text-center mb-8">
          {onBack && (
            <div className="text-left mb-4">
              <button
                onClick={onBack}
                className="text-sm px-4 py-2 rounded-full border transition-colors duration-200 hover:bg-gray-800"
                style={{
                  color: '#f9f9f9',
                  borderColor: '#262626',
                  backgroundColor: 'transparent'
                }}
              >
                ← Back
              </button>
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#f9f9f9' }}>
            Company Comparison
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Compare two companies side-by-side with comprehensive competitive analysis
          </p>
        </div>

        {/* Comparison Form */}
        {!comparisonResult && (
          <form onSubmit={handleCompare} className="w-full max-w-4xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Company 1 */}
              <Card 
                className="border-0 shadow-lg"
                style={{
                  backgroundColor: '#1a1a1a',
                  borderColor: '#262626',
                  boxShadow: '0 0 12px rgba(0,0,0,0.6)'
                }}
              >
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#f9f9f9' }}>
                    Company 1
                  </h3>
                  <div className="space-y-4">
                    <Input
                      type="text"
                      value={company1}
                      onChange={(e) => setCompany1(e.target.value)}
                      placeholder="Enter first company name..."
                      className="w-full"
                      style={{
                        backgroundColor: '#111827',
                        borderColor: '#374151',
                        color: '#f9f9f9'
                      }}
                      required
                    />
                    <Input
                      type="url"
                      value={company1Website}
                      onChange={(e) => setCompany1Website(e.target.value)}
                      placeholder="https://company1.com (optional)"
                      className="w-full"
                      style={{
                        backgroundColor: '#111827',
                        borderColor: '#374151',
                        color: '#f9f9f9'
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Company 2 */}
              <Card 
                className="border-0 shadow-lg"
                style={{
                  backgroundColor: '#1a1a1a',
                  borderColor: '#262626',
                  boxShadow: '0 0 12px rgba(0,0,0,0.6)'
                }}
              >
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#f9f9f9' }}>
                    Company 2
                  </h3>
                  <div className="space-y-4">
                    <Input
                      type="text"
                      value={company2}
                      onChange={(e) => setCompany2(e.target.value)}
                      placeholder="Enter second company name..."
                      className="w-full"
                      style={{
                        backgroundColor: '#111827',
                        borderColor: '#374151',
                        color: '#f9f9f9'
                      }}
                      required
                    />
                    <Input
                      type="url"
                      value={company2Website}
                      onChange={(e) => setCompany2Website(e.target.value)}
                      placeholder="https://company2.com (optional)"
                      className="w-full"
                      style={{
                        backgroundColor: '#111827',
                        borderColor: '#374151',
                        color: '#f9f9f9'
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Compare Button */}
            <div className="text-center">
              <Button
                type="submit"
                disabled={!company1.trim() || !company2.trim() || isComparing}
                className="px-8 py-3 text-lg font-medium transition-all duration-200 disabled:opacity-50 hover:brightness-110 hover:scale-105"
                style={{
                  backgroundColor: (!company1.trim() || !company2.trim() || isComparing) ? '#6b7280' : '#facc15',
                  color: '#0a0a0a',
                  borderRadius: '9999px',
                  boxShadow: (!company1.trim() || !company2.trim() || isComparing) ? '0 2px 8px rgba(107,114,128,0.4)' : '0 2px 8px rgba(250,204,21,0.4)'
                }}
              >
                {isComparing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Comparing Companies...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Compare Companies
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Progress */}
        {isComparing && (
          <Card 
            className="border-0 shadow-lg mb-8"
            style={{
              backgroundColor: '#1a1a1a',
              borderColor: '#262626'
            }}
          >
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3" style={{ color: '#f9f9f9' }}>
                    <Loader2 className="w-5 h-5 animate-spin text-yellow-400" />
                    <span className="font-medium text-sm">{currentStep}</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="border-yellow-400 text-yellow-400 bg-yellow-400/10"
                  >
                    {progress}%
                  </Badge>
                </div>
                <div className="relative">
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500 ease-out rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Alert 
            className="border-red-600 bg-red-900/20 mb-8"
            style={{ borderColor: '#dc2626', backgroundColor: 'rgba(127, 29, 29, 0.2)' }}
          >
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Comparison Results */}
        {comparisonResult && (
          <div className="space-y-8">
            {/* Success Header */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <h2 className="text-2xl font-bold" style={{ color: '#f9f9f9' }}>
                  Comparison Complete
                </h2>
              </div>
              <p className="text-gray-400">
                Detailed analysis comparing {comparisonResult.company1.name} vs {comparisonResult.company2.name}
              </p>
            </div>

            {/* Metrics Comparison */}
            {comparisonResult.company1.metrics && comparisonResult.company2.metrics && (
              <Card 
                className="border-0 shadow-lg"
                style={{
                  backgroundColor: '#1a1a1a',
                  borderColor: '#262626',
                  boxShadow: '0 0 12px rgba(0,0,0,0.6)'
                }}
              >
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-6" style={{ color: '#f9f9f9' }}>
                    Competitive Metrics Comparison
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { key: 'market_position' as const, label: 'Market Position', icon: Target },
                      { key: 'innovation' as const, label: 'Innovation', icon: Zap },
                      { key: 'financial_strength' as const, label: 'Financial Strength', icon: DollarSign },
                      { key: 'brand_recognition' as const, label: 'Brand Recognition', icon: TrendingUp },
                    ].map(({ key, label, icon: Icon }) => {
                      const comparison = getMetricComparison(key, label)
                      return (
                        <div key={key} className="text-center">
                          <Icon className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                          <h4 className="font-medium text-white mb-3">{label}</h4>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-400">{comparisonResult.company1.name}</span>
                              <div className="flex items-center space-x-2">
                                <span className={`font-bold ${comparison.winner === 'company1' ? 'text-green-400' : 'text-gray-400'}`}>
                                  {comparison.company1Value}/10
                                </span>
                                {comparison.winner === 'company1' && <CheckCircle className="w-4 h-4 text-green-400" />}
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-400">{comparisonResult.company2.name}</span>
                              <div className="flex items-center space-x-2">
                                <span className={`font-bold ${comparison.winner === 'company2' ? 'text-green-400' : 'text-gray-400'}`}>
                                  {comparison.company2Value}/10
                                </span>
                                {comparison.winner === 'company2' && <CheckCircle className="w-4 h-4 text-green-400" />}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Detailed Comparison Analysis */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Comparison Analysis */}
              <Card 
                className="border-0 shadow-lg"
                style={{
                  backgroundColor: '#1a1a1a',
                  borderColor: '#262626',
                  boxShadow: '0 0 12px rgba(0,0,0,0.6)'
                }}
              >
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-6" style={{ color: '#f9f9f9' }}>
                    Competitive Analysis
                  </h3>
                  <div className="prose prose-invert max-w-none" style={{ color: '#f9f9f9', lineHeight: '1.7' }}>
                    <pre className="whitespace-pre-wrap text-gray-300 font-sans">
                      {comparisonResult.comparison_analysis}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              {/* Strategic Recommendations */}
              <Card 
                className="border-0 shadow-lg"
                style={{
                  backgroundColor: '#1a1a1a',
                  borderColor: '#262626',
                  boxShadow: '0 0 12px rgba(0,0,0,0.6)'
                }}
              >
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-6" style={{ color: '#f9f9f9' }}>
                    Strategic Recommendations
                  </h3>
                  <div className="prose prose-invert max-w-none" style={{ color: '#f9f9f9', lineHeight: '1.7' }}>
                    <pre className="whitespace-pre-wrap text-gray-300 font-sans">
                      {comparisonResult.strategic_recommendations}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Individual Company Reports */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Company 1 Report */}
              <Card 
                className="border-0 shadow-lg"
                style={{
                  backgroundColor: '#1a1a1a',
                  borderColor: '#262626',
                  boxShadow: '0 0 12px rgba(0,0,0,0.6)'
                }}
              >
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-6" style={{ color: '#f9f9f9' }}>
                    {comparisonResult.company1.name} Analysis
                  </h3>
                  <div className="prose prose-invert max-w-none" style={{ color: '#f9f9f9', lineHeight: '1.7' }}>
                    <pre className="whitespace-pre-wrap text-gray-300 font-sans text-sm">
                      {comparisonResult.company1.final_report.substring(0, 1000)}...
                    </pre>
                  </div>
                </CardContent>
              </Card>

              {/* Company 2 Report */}
              <Card 
                className="border-0 shadow-lg"
                style={{
                  backgroundColor: '#1a1a1a',
                  borderColor: '#262626',
                  boxShadow: '0 0 12px rgba(0,0,0,0.6)'
                }}
              >
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-6" style={{ color: '#f9f9f9' }}>
                    {comparisonResult.company2.name} Analysis
                  </h3>
                  <div className="prose prose-invert max-w-none" style={{ color: '#f9f9f9', lineHeight: '1.7' }}>
                    <pre className="whitespace-pre-wrap text-gray-300 font-sans text-sm">
                      {comparisonResult.company2.final_report.substring(0, 1000)}...
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* New Comparison Button */}
            <div className="text-center pt-8">
              <Button
                onClick={() => {
                  setComparisonResult(null)
                  setCompany1('')
                  setCompany1Website('')
                  setCompany2('')
                  setCompany2Website('')
                  setError(null)
                }}
                className="px-6 py-2 font-medium transition-all duration-200 hover:brightness-110"
                style={{
                  backgroundColor: '#facc15',
                  color: '#0a0a0a',
                  borderRadius: '9999px'
                }}
              >
                Compare Different Companies
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
