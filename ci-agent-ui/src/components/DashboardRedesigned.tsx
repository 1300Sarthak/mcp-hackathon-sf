import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Separator } from './ui/separator'
import { Alert, AlertDescription } from './ui/alert'
import { isMockCompany, generateMockStreamEvents } from '../utils/mockData'
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from './ui/form'
import { 
  Search, 
  Globe, 
  Building, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  Activity,
  Brain,
  FileText,
  Loader2,
  ArrowLeft,
  GitCompare,
  Send,
  MessageSquare,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import DemoScenarios from './DemoScenarios'
import MarkdownRenderer from './MarkdownRenderer'
import CompetitiveDashboard from './CompetitiveDashboard'
import CompanySearchCard from './CompanySearchCard'
import AnalysisModeToggle, { type AnalysisMode } from './AnalysisModeToggle'
import MetricsCard from './MetricsCard'
import { API_BASE_URL } from '../config/api'

// Form validation schema
const formSchema = z.object({
  companyName: z.string().min(1, "Company name is required").max(100, "Company name too long"),
  companyUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
})

type FormValues = z.infer<typeof formSchema>

interface StreamEvent {
  timestamp: string
  type: string
  step?: string
  message?: string
  tool_name?: string
  tool_input?: any
  data?: any
}

interface AnalysisResult {
  competitor: string
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
  workflow?: string
  timestamp?: string
}

interface DashboardProps {
  company: { company: string; url?: string; section: string; analysisMode?: AnalysisMode }
  onBack?: () => void
  onCompare?: () => void
  analysisMode?: AnalysisMode
  hideHeader?: boolean
}

export default function DashboardRedesigned({ company, onBack, onCompare, analysisMode: initialAnalysisMode, hideHeader = false }: DashboardProps) {
  // Form for quick re-analysis
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>(initialAnalysisMode || 'simple')
  const [activeTab, setActiveTab] = useState<'outline' | 'research' | 'analysis'>('outline')

  // Chat functionality
  const [chatMessages, setChatMessages] = useState<Array<{type: 'user' | 'assistant', message: string}>>([])
  const [chatInput, setChatInput] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)

  // Start analysis on mount
  useEffect(() => {
    console.log('🚀 Dashboard mounted with company prop:', company)
    if (company && company.company) {
      analyzeCompetitor({ 
        companyName: company.company, 
        companyUrl: company.url || '' 
      })
    } else {
      console.error('❌ Invalid company prop:', company)
    }
  }, [company])

  const handleStreamEvent = (event: StreamEvent) => {
    console.log('🔄 handleStreamEvent called:', event.type, event.step || event.message)
    
    if (event.type === 'status_update') {
      if (event.step === 'research_start') {
        setProgress(10)
        setCurrentStep('Gathering competitive intelligence...')
      } else if (event.step === 'research_complete') {
        setProgress(35)
        setCurrentStep('Research complete. Starting analysis...')
      } else if (event.step === 'analysis_start') {
        setProgress(50)
        setCurrentStep('Analyzing strategic positioning...')
      } else if (event.step === 'analysis_complete') {
        setProgress(75)
        setCurrentStep('Analysis complete. Generating report...')
      } else if (event.step === 'report_start') {
        setProgress(85)
        setCurrentStep('Compiling executive report...')
      } else if (event.message) {
        setCurrentStep(event.message)
      }
    } else if (event.type === 'tool_call') {
      setCurrentStep(`Running: ${event.tool_name || 'AI Tool'}...`)
    } else if (event.type === 'complete' && event.data) {
      console.log('✅ Complete event received with data:', event.data)
      setProgress(100)
      setCurrentStep('Analysis complete!')
      setResult(event.data)
      setIsAnalyzing(false)
    }
  }

  const handleChatMessage = async () => {
    if (!chatInput.trim() || !result) return

    const userMessage = chatInput
    setChatInput('')
    setChatMessages(prev => [...prev, { type: 'user', message: userMessage }])
    setIsChatLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitor_name: result.competitor,
          message: userMessage,
          context: {
            research_findings: result.research_findings,
            strategic_analysis: result.strategic_analysis,
            final_report: result.final_report,
          }
        })
      })

      const data = await response.json()
      
      if (data.response) {
        setChatMessages(prev => [...prev, { type: 'assistant', message: data.response }])
      }
    } catch (err) {
      console.error('Chat error:', err)
      setChatMessages(prev => [...prev, { 
        type: 'assistant', 
        message: 'Sorry, I encountered an error processing your question.' 
      }])
    } finally {
      setIsChatLoading(false)
    }
  }

  const analyzeCompetitor = async (values: FormValues) => {
    console.log('🔍 analyzeCompetitor called with:', values)
    
    if (!values.companyName) {
      console.error('❌ No company name provided!')
      setError('Company name is required')
      return
    }
    
    setIsAnalyzing(true)
    setProgress(0)
    setCurrentStep('Starting analysis...')
    setError(null)

    // Check if this is a mock company
    if (isMockCompany(values.companyName)) {
      console.log('🎭 Mock data detected for:', values.companyName)
      
      // Simulate streaming with mock events
      const mockEvents = generateMockStreamEvents('analysis')
      console.log('📦 Generated mock events:', mockEvents.length)
      
      for (let i = 0; i < mockEvents.length; i++) {
        const event = mockEvents[i]
        console.log('📨 Processing mock event:', event.type, event)
        
        // Simulate delay between events
        await new Promise(resolve => setTimeout(resolve, 800))
        
        handleStreamEvent(event)
      }
      
      console.log('✅ Mock data processing complete')
      setIsAnalyzing(false)
      return
    }

    try {
      const eventSource = new EventSource(`${API_BASE_URL}/analyze/stream`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      // Send the POST request to start streaming analysis
      const response = await fetch(`${API_BASE_URL}/analyze/enhanced/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          competitor_name: values.companyName,
          competitor_website: values.companyUrl || undefined,
          section: company.section || 'All',
          stream: true,
          analysis_mode: analysisMode
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response body')
      }

      let buffer = ''
      
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break
        
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const event = JSON.parse(line.substring(6))
              handleStreamEvent(event)
            } catch (parseError) {
              console.error('Error parsing event:', parseError)
            }
          }
        }
      }

    } catch (err) {
      console.error('Analysis error:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      setIsAnalyzing(false)
    }
  }

  const handleNewSearch = (opts: { company: string; url?: string; section: string; analysisMode?: AnalysisMode }) => {
    setResult(null)
    setChatMessages([])
    setAnalysisMode(opts.analysisMode || 'simple')
    analyzeCompetitor({ 
      companyName: opts.company, 
      companyUrl: opts.url || '' 
    })
  }

  const getStepIcon = (step: string) => {
    if (step.includes('research') || step.includes('Gathering')) return <Search className="w-4 h-4" style={{ color: '#facc15' }} />
    if (step.includes('analysis') || step.includes('Analyzing')) return <Brain className="w-4 h-4" style={{ color: '#facc15' }} />
    if (step.includes('report') || step.includes('report')) return <FileText className="w-4 h-4" style={{ color: '#facc15' }} />
    if (step.includes('complete')) return <CheckCircle className="w-4 h-4" style={{ color: '#22c55e' }} />
    return <Activity className="w-4 h-4 animate-pulse" style={{ color: '#facc15' }} />
  }

  return (
    <>
      <div 
        className="min-h-screen w-full"
        style={{
          backgroundColor: '#0a0a0a',
          fontFamily: 'Inter, sans-serif',
          color: '#f9f9f9'
        }}
      >
        {/* Header with search */}
        {!hideHeader && (
          <div 
            className="border-b"
            style={{
              borderColor: '#262626',
              backgroundColor: '#0a0a0a'
            }}
          >
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  {onBack && (
                    <Button
                      onClick={onBack}
                      variant="ghost"
                      size="sm"
                      className="transition-colors duration-200"
                      style={{
                        color: '#a1a1aa',
                        backgroundColor: 'transparent'
                      }}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Search
                    </Button>
                  )}
                  {onCompare && (
                    <Button
                      onClick={onCompare}
                      variant="ghost"
                      size="sm"
                      className="transition-colors duration-200"
                      style={{
                        color: '#a1a1aa',
                        backgroundColor: 'transparent'
                      }}
                    >
                      <GitCompare className="w-4 h-4 mr-2" />
                      Compare Company
                    </Button>
                  )}
                </div>
                <h1 
                  className="font-bold text-center"
                  style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    color: '#f9f9f9'
                  }}
                >
                  Competitive Intelligence Dashboard
                </h1>
                <div></div>
              </div>
              
              {/* Analysis Mode Toggle with Animation */}
              <div className="max-w-4xl mx-auto mb-4 flex justify-center">
                <div className="relative flex rounded-full p-1" style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', display: 'inline-flex' }}>
                  {/* Animated pill background */}
                  <div
                    className="absolute rounded-full transition-all duration-300 ease-in-out"
                    style={{
                      backgroundColor: '#FACC15',
                      height: 'calc(100% - 8px)',
                      top: '4px',
                      left: analysisMode === 'simple' ? '4px' : 'calc(50% - 4px)',
                      width: 'calc(50% - 4px)',
                      boxShadow: '0 2px 8px rgba(250,204,21,0.4)',
                    }}
                  />
                  <button
                    onClick={() => setAnalysisMode('simple')}
                    className={`relative z-10 px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 flex items-center space-x-2 ${
                      analysisMode === 'simple' 
                        ? 'text-black' 
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>Simple</span>
                  </button>
                  <button
                    onClick={() => setAnalysisMode('deep')}
                    className={`relative z-10 px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 flex items-center space-x-2 ${
                      analysisMode === 'deep' 
                        ? 'text-black' 
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <Brain className="w-4 h-4" />
                    <span>Deep Think</span>
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="max-w-4xl mx-auto">
                <CompanySearchCard onAnalyze={handleNewSearch} />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-6">
          {/* Progress and Status */}
          {isAnalyzing && (
            <Card 
              className="border shadow-lg mb-6"
              style={{
                backgroundColor: '#1a1a1a !important',
                borderColor: '#262626 !important',
                borderRadius: '12px',
                boxShadow: '0 0 12px rgba(0,0,0,0.6)',
                border: '1px solid #262626'
              }}
            >
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStepIcon(currentStep)}
                      <span 
                        className="font-medium"
                        style={{
                          fontSize: '16px',
                          color: '#f9f9f9 !important'
                        }}
                      >
                        {currentStep}
                      </span>
                    </div>
                    <Badge 
                      variant="outline" 
                      style={{
                        backgroundColor: '#facc1520 !important',
                        color: '#facc15 !important',
                        borderColor: '#facc15 !important',
                        borderRadius: '6px',
                        border: '1px solid #facc15'
                      }}
                    >
                      {progress}%
                    </Badge>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {error && (
            <Alert 
              className="border mb-6"
              style={{
                backgroundColor: '#1a0a0a !important',
                borderColor: '#ef4444 !important',
                borderRadius: '12px',
                border: '1px solid #ef4444'
              }}
            >
              <AlertCircle className="h-4 w-4" style={{ color: '#ef4444' }} />
              <AlertDescription style={{ color: '#fca5a5 !important' }}>
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Results Section */}
          {result && (
            <div className="space-y-6 mb-8">
              {/* Key Metrics Cards */}
              {result.metrics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <MetricsCard
                    title="Threat Level"
                    value={result.metrics.competitive_metrics?.threat_level || 0}
                    change={12.5}
                    trend="up"
                    subtitle="Competitive threat score"
                    icon={<AlertCircle className="w-5 h-5" />}
                  />
                  <MetricsCard
                    title="Market Position"
                    value={result.metrics.competitive_metrics?.market_position || 0}
                    change={-5}
                    trend="down"
                    subtitle="Relative market standing"
                    icon={<TrendingUp className="w-5 h-5" />}
                  />
                  <MetricsCard
                    title="Innovation Score"
                    value={result.metrics.competitive_metrics?.innovation || 0}
                    change={8.3}
                    trend="up"
                    subtitle="Technology advancement"
                    icon={<Zap className="w-5 h-5" />}
                  />
                  <MetricsCard
                    title="Brand Strength"
                    value={result.metrics.competitive_metrics?.brand_recognition || 0}
                    change={3.2}
                    trend="up"
                    subtitle="Market recognition"
                    icon={<CheckCircle className="w-5 h-5" />}
                  />
                </div>
              )}

              {/* Competitive Dashboard with Metrics */}
              {result.metrics && (
                <CompetitiveDashboard 
                  data={{
                    competitor: result.competitor,
                    competitive_metrics: result.metrics.competitive_metrics,
                    swot_scores: result.metrics.swot_scores
                  }}
                />
              )}

              {/* Tabs Navigation */}
              <div 
                className="flex gap-2 border-b mb-6"
                style={{ borderColor: '#262626' }}
              >
                {[
                  { id: 'outline', label: 'Outline', icon: <FileText className="w-4 h-4" /> },
                  { id: 'research', label: 'Research Findings', icon: <Brain className="w-4 h-4" /> },
                  { id: 'analysis', label: 'Strategic Analysis', icon: <Activity className="w-4 h-4" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className="flex items-center gap-2 px-4 py-3 font-medium transition-all duration-200"
                    style={{
                      borderBottom: activeTab === tab.id ? '2px solid #facc15' : '2px solid transparent',
                      color: activeTab === tab.id ? '#facc15' : '#a1a1aa',
                      fontSize: '14px'
                    }}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Executive Report - Main Content */}
              {activeTab === 'outline' && (
                <Card 
                  className="border shadow-xl"
                  style={{
                    backgroundColor: '#1a1a1a !important',
                    borderColor: '#262626 !important',
                    borderRadius: '12px',
                    boxShadow: '0 0 12px rgba(0,0,0,0.6)',
                    border: '1px solid #262626'
                  }}
                >
                  <CardHeader>
                    <CardTitle 
                      className="flex items-center space-x-2"
                      style={{
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#f9f9f9 !important'
                      }}
                    >
                      <FileText className="h-6 w-6" style={{ color: '#facc15' }} />
                      <span>Executive Intelligence Report</span>
                    </CardTitle>
                    <CardDescription style={{ color: '#a1a1aa !important' }}>
                      Comprehensive competitive analysis for {result.competitor}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="p-6 rounded-lg"
                      style={{
                        backgroundColor: '#111111 !important',
                        borderRadius: '8px'
                      }}
                    >
                      <MarkdownRenderer content={result.final_report} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Research Findings Tab */}
              {activeTab === 'research' && (
                <Card 
                  className="border shadow-xl"
                  style={{
                    backgroundColor: '#1a1a1a !important',
                    borderColor: '#262626 !important',
                    borderRadius: '12px',
                    border: '1px solid #262626'
                  }}
                >
                  <CardHeader>
                    <CardTitle 
                      className="flex items-center space-x-2"
                      style={{
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#f9f9f9 !important'
                      }}
                    >
                      <Brain className="h-6 w-6" style={{ color: '#facc15' }} />
                      <span>Research Findings</span>
                    </CardTitle>
                    <CardDescription style={{ color: '#a1a1aa !important' }}>
                      Detailed research data and market intelligence
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="p-6 rounded-lg"
                      style={{
                        backgroundColor: '#111111 !important',
                        borderRadius: '8px'
                      }}
                    >
                      <MarkdownRenderer content={result.research_findings} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Strategic Analysis Tab */}
              {activeTab === 'analysis' && (
                <Card 
                  className="border shadow-xl"
                  style={{
                    backgroundColor: '#1a1a1a !important',
                    borderColor: '#262626 !important',
                    borderRadius: '12px',
                    border: '1px solid #262626'
                  }}
                >
                  <CardHeader>
                    <CardTitle 
                      className="flex items-center space-x-2"
                      style={{
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#f9f9f9 !important'
                      }}
                    >
                      <Activity className="h-6 w-6" style={{ color: '#facc15' }} />
                      <span>Strategic Analysis</span>
                    </CardTitle>
                    <CardDescription style={{ color: '#a1a1aa !important' }}>
                      SWOT analysis and competitive positioning
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="p-6 rounded-lg"
                      style={{
                        backgroundColor: '#111111 !important',
                        borderRadius: '8px'
                      }}
                    >
                      <MarkdownRenderer content={result.strategic_analysis} />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Chatbot at Bottom */}
        {result && (
          <div className="border-t" style={{ borderColor: '#262626', backgroundColor: '#0a0a0a' }}>
            <div className="max-w-7xl mx-auto p-6">
              <Card 
                className="border shadow-xl"
                style={{
                  backgroundColor: '#1a1a1a !important',
                  borderColor: '#262626 !important',
                  borderRadius: '12px',
                  boxShadow: '0 0 12px rgba(0,0,0,0.6)',
                  border: '1px solid #262626'
                }}
              >
                <CardHeader>
                  <CardTitle 
                    className="flex items-center space-x-2"
                    style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#f9f9f9 !important'
                    }}
                  >
                    <MessageSquare className="h-5 w-5" style={{ color: '#facc15' }} />
                    <span>Ask Questions About {result.competitor}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Chat Messages */}
                  {chatMessages.length > 0 && (
                    <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
                      {chatMessages.map((msg, index) => (
                        <div 
                          key={index}
                          className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              msg.type === 'user' 
                                ? 'text-right' 
                                : 'text-left'
                            }`}
                            style={{
                              backgroundColor: msg.type === 'user' ? '#facc15' : '#111111',
                              color: msg.type === 'user' ? '#0a0a0a' : '#f9f9f9',
                              borderRadius: '12px'
                            }}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Chat Input */}
                  <div className="flex space-x-4">
                    <Input
                      placeholder="Ask about competitive positioning, strengths, threats..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleChatMessage()}
                      disabled={isChatLoading}
                      style={{
                        backgroundColor: '#111111 !important',
                        borderColor: '#262626 !important',
                        borderRadius: '6px',
                        color: '#f9f9f9 !important',
                        fontSize: '14px',
                        border: '1px solid #262626'
                      }}
                    />
                    <Button
                      onClick={handleChatMessage}
                      disabled={!chatInput.trim() || isChatLoading}
                      style={{
                        backgroundColor: '#facc15 !important',
                        color: '#0a0a0a !important',
                        borderRadius: '6px',
                        fontWeight: 600,
                        border: 'none'
                      }}
                    >
                      {isChatLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
