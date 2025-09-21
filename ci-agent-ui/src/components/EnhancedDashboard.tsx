import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'

interface EnhancedDashboardProps {
  company: string
  jobId?: string
  onBack: () => void
}

interface RAGQueryResult {
  query: string
  response: string
  timestamp: string
  status: string
}

interface MarketAnalysis {
  industry_keywords: string[]
  market_analysis: string
  knowledge_base_stats: {
    total_documents: number
    competitors: Record<string, number>
  }
}

interface CompetitorInfo {
  competitors: string[]
  competitor_counts: Record<string, number>
  total_documents: number
}

const API_BASE_URL = 'http://localhost:8001' // Enhanced API port

export default function EnhancedDashboard({ company, jobId, onBack }: EnhancedDashboardProps) {
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [ragQuery, setRagQuery] = useState('')
  const [ragResults, setRagResults] = useState<RAGQueryResult[]>([])
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis | null>(null)
  const [competitorInfo, setCompetitorInfo] = useState<CompetitorInfo | null>(null)
  const [ragStatus, setRagStatus] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'analysis' | 'rag' | 'market'>('analysis')

  // Load RAG status and competitor info on mount
  useEffect(() => {
    loadRagStatus()
    loadCompetitorInfo()
  }, [])

  // Start enhanced analysis on mount
  useEffect(() => {
    if (company && !analysisResult && !isAnalyzing) {
      startEnhancedAnalysis()
    }
  }, [company])

  const loadRagStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/rag-status`)
      const data = await response.json()
      setRagStatus(data)
    } catch (error) {
      console.error('Failed to load RAG status:', error)
    }
  }

  const loadCompetitorInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/rag/competitors`)
      const data = await response.json()
      setCompetitorInfo(data)
    } catch (error) {
      console.error('Failed to load competitor info:', error)
    }
  }

  const startEnhancedAnalysis = async () => {
    setIsAnalyzing(true)
    
    try {
      const response = await fetch(`${API_BASE_URL}/analyze/enhanced`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          competitor_name: company,
          industry_keywords: ['technology', 'saas', 'software'],
          enable_rag: true,
          stream: false
        })
      })

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`)
      }

      const result = await response.json()
      setAnalysisResult(result)
      
      // Refresh competitor info after analysis
      loadCompetitorInfo()
      
    } catch (error) {
      console.error('Enhanced analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const executeRagQuery = async () => {
    if (!ragQuery.trim()) return

    try {
      const response = await fetch(`${API_BASE_URL}/rag/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: ragQuery,
          competitor_filter: company // Filter by current company
        })
      })

      if (!response.ok) {
        throw new Error(`RAG query failed: ${response.statusText}`)
      }

      const result = await response.json()
      setRagResults([result, ...ragResults])
      setRagQuery('')
      
    } catch (error) {
      console.error('RAG query failed:', error)
    }
  }

  const getMarketAnalysis = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/rag/market-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          industry_keywords: ['technology', 'saas', 'software', 'productivity']
        })
      })

      if (!response.ok) {
        throw new Error(`Market analysis failed: ${response.statusText}`)
      }

      const result = await response.json()
      setMarketAnalysis(result)
      
    } catch (error) {
      console.error('Market analysis failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Enhanced Competitive Intelligence</h1>
            <p className="text-muted-foreground">
              AI-powered analysis with RAG capabilities for {company}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {ragStatus && (
              <Badge variant={ragStatus.rag_enabled ? 'default' : 'secondary'}>
                RAG {ragStatus.rag_enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            )}
            <Button onClick={onBack} variant="outline">
              ← Back to Search
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'analysis' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Analysis
          </button>
          <button
            onClick={() => setActiveTab('rag')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'rag' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Knowledge Base
          </button>
          <button
            onClick={() => setActiveTab('market')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'market' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Market Analysis
          </button>
        </div>

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="space-y-6">
            {isAnalyzing && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <div>
                      <h3 className="font-semibold">Running Enhanced Analysis...</h3>
                      <p className="text-sm text-muted-foreground">
                        Multi-agent workflow with RAG enhancement in progress
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {analysisResult && (
              <div className="grid gap-6">
                {/* Analysis Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Analysis Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge variant="default" className="mb-2">
                          {analysisResult.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          Workflow: {analysisResult.workflow}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          RAG Enabled: {analysisResult.rag_enabled ? 'Yes' : 'No'}
                        </p>
                        {analysisResult.rag_stored && (
                          <p className="text-sm text-green-600">
                            ✓ Analysis stored in knowledge base
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          Completed: {new Date(analysisResult.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Final Report */}
                <Card>
                  <CardHeader>
                    <CardTitle>Enhanced Competitive Intelligence Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {analysisResult.final_report}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* RAG Tab */}
        {activeTab === 'rag' && (
          <div className="space-y-6">
            {/* Knowledge Base Status */}
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Base Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-2xl font-bold">
                      {competitorInfo?.total_documents || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Documents</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {competitorInfo?.competitors.length || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Competitors Analyzed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {ragStatus?.rag_enabled ? 'Active' : 'Inactive'}
                    </p>
                    <p className="text-sm text-muted-foreground">RAG Status</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {ragStatus?.embedding_model || 'Unknown'}
                    </p>
                    <p className="text-sm text-muted-foreground">Embedding Model</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analyzed Competitors */}
            {competitorInfo && competitorInfo.competitors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Analyzed Competitors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {competitorInfo.competitors.map((competitor) => (
                      <Badge key={competitor} variant="secondary">
                        {competitor} ({competitorInfo.competitor_counts[competitor]} docs)
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* RAG Query Interface */}
            <Card>
              <CardHeader>
                <CardTitle>Query Knowledge Base</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Input
                    placeholder="Ask about competitors, market trends, or strategic insights..."
                    value={ragQuery}
                    onChange={(e) => setRagQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && executeRagQuery()}
                  />
                  <Button onClick={executeRagQuery} disabled={!ragQuery.trim()}>
                    Query
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* RAG Results */}
            {ragResults.length > 0 && (
              <div className="space-y-4">
                {ragResults.map((result, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        Query: {result.query}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        <p className="whitespace-pre-wrap">{result.response}</p>
                      </div>
                      <Separator className="my-4" />
                      <p className="text-xs text-muted-foreground">
                        {new Date(result.timestamp).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Market Analysis Tab */}
        {activeTab === 'market' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Landscape Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={getMarketAnalysis} disabled={!ragStatus?.rag_enabled}>
                  Generate Market Analysis
                </Button>
                {!ragStatus?.rag_enabled && (
                  <p className="text-sm text-muted-foreground mt-2">
                    RAG system must be enabled for market analysis
                  </p>
                )}
              </CardContent>
            </Card>

            {marketAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle>Market Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Industry Keywords:</h4>
                      <div className="flex flex-wrap gap-2">
                        {marketAnalysis.industry_keywords.map((keyword) => (
                          <Badge key={keyword} variant="outline">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-semibold mb-2">Analysis:</h4>
                      <div className="prose prose-sm max-w-none">
                        <p className="whitespace-pre-wrap">{marketAnalysis.market_analysis}</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-2">Knowledge Base Stats:</h4>
                      <p className="text-sm text-muted-foreground">
                        Based on {marketAnalysis.knowledge_base_stats.total_documents} documents 
                        across {Object.keys(marketAnalysis.knowledge_base_stats.competitors).length} competitors
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
