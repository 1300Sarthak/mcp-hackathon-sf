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
  MessageSquare
} from 'lucide-react'
import DemoScenarios from './DemoScenarios'
import MarkdownRenderer from './MarkdownRenderer'
import CompetitiveDashboard from './CompetitiveDashboard'
import CompanySearchCard from './CompanySearchCard'

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
  timestamp: string
  status: string
  workflow: string
}

const API_BASE_URL = 'http://localhost:8000'

interface DashboardProps {
  company: string
  jobId?: string
  onBack?: () => void
}

export default function Dashboard({ company, onBack }: DashboardProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<Array<{type: 'user' | 'bot', message: string}>>([])
  const [chatInput, setChatInput] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [showCompareModal, setShowCompareModal] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: company,
      companyUrl: '',
    },
  })

  // Auto-submit when company is provided
  useEffect(() => {
    if (company && !isAnalyzing && !analysisResult) {
      setTimeout(() => {
        analyzeCompetitor({
          companyName: company,
          companyUrl: '',
        })
      }, 100)
    }
  }, [company, isAnalyzing, analysisResult])

  // Handle new search from top search bar
  const handleNewSearch = (opts: { company: string; url?: string; section: string }) => {
    // Reset state and start new analysis
    setAnalysisResult(null)
    setError(null)
    setProgress(0)
    setCurrentStep('')
    setChatMessages([])
    
    // Update form and start analysis
    form.setValue('companyName', opts.company)
    form.setValue('companyUrl', opts.url || '')
    
    analyzeCompetitor({
      companyName: opts.company,
      companyUrl: opts.url || '',
    })
  }

  // Handle chat message
  const handleChatMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return

    const userMessage = chatInput.trim()
    setChatInput('')
    setChatMessages(prev => [...prev, { type: 'user', message: userMessage }])
    setIsChatLoading(true)

    try {
      // Use LlamaIndex RAG query endpoint
      const response = await fetch('http://localhost:8001/rag/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userMessage,
          competitor_filter: company // Filter by current company
        })
      })

      if (response.ok) {
        const data = await response.json()
        setChatMessages(prev => [...prev, { type: 'bot', message: data.response }])
      } else {
        setChatMessages(prev => [...prev, { type: 'bot', message: 'Sorry, I encountered an error processing your question.' }])
      }
    } catch (error) {
      console.error('Chat error:', error)
      setChatMessages(prev => [...prev, { type: 'bot', message: 'Sorry, I\'m unable to answer right now. Please try again later.' }])
    } finally {
      setIsChatLoading(false)
    }
  }

  const analyzeCompetitor = async (values: FormValues) => {
    setIsAnalyzing(true)
    setProgress(0)
    setCurrentStep('Starting analysis...')
    setAnalysisResult(null)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/analyze/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          competitor_name: values.companyName,
          competitor_website: values.companyUrl || undefined,
          stream: true,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('Failed to get response reader')
      }

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const eventData: StreamEvent = JSON.parse(line.slice(6))

              if (eventData.type === 'status_update') {
                setCurrentStep(eventData.message || '')
                
                if (eventData.step === 'research_start') {
                  setProgress(10)
                } else if (eventData.step === 'research_complete') {
                  setProgress(40)
                } else if (eventData.step === 'analysis_start') {
                  setProgress(50)
                } else if (eventData.step === 'analysis_complete') {
                  setProgress(80)
                } else if (eventData.step === 'report_start') {
                  setProgress(85)
                } else if (eventData.step === 'complete') {
                  setProgress(100)
                }
              } else if (eventData.type === 'complete') {
                setAnalysisResult(eventData.data as AnalysisResult)
                setCurrentStep('Analysis complete!')
                setProgress(100)
              } else if (eventData.type === 'error') {
                throw new Error(eventData.message || 'Analysis failed')
              }
            } catch (parseError) {
              console.warn('Failed to parse event:', parseError)
            }
          }
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      setCurrentStep('Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const onSubmit = (values: FormValues) => {
    analyzeCompetitor(values)
  }

  const handleDemoScenario = (name: string, website: string) => {
    form.setValue('companyName', name)
    form.setValue('companyUrl', website)
  }

  const resetForm = () => {
    form.reset()
    setAnalysisResult(null)
    setError(null)
    setProgress(0)
    setCurrentStep('')
  }

  const getStepIcon = (step: string) => {
    if (step.includes('Researcher')) return <Brain className="h-4 w-4" />
    if (step.includes('Analyst')) return <Activity className="h-4 w-4" />
    if (step.includes('Writer')) return <FileText className="h-4 w-4" />
    return <Zap className="h-4 w-4" />
  }

  return (
    <>
      {/* Global dark theme override */}
      <style>{`
        body {
          background-color: #0a0a0a !important;
          color: #f9f9f9 !important;
        }
        html {
          background-color: #0a0a0a !important;
        }
      `}</style>
      
      <div 
        className="min-h-screen w-full dark"
        style={{ 
          backgroundColor: '#0a0a0a !important',
          fontFamily: 'Inter, sans-serif',
          color: '#f9f9f9 !important',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: 'auto',
          '--background': '#0a0a0a',
          '--foreground': '#f9f9f9',
          '--card': '#1a1a1a',
          '--card-foreground': '#f9f9f9',
          '--border': '#262626',
          '--accent': '#facc15',
          '--accent-foreground': '#0a0a0a',
          '--muted': '#111111',
          '--muted-foreground': '#a1a1aa'
        } as React.CSSProperties}
      >
      <div className="max-w-4xl mx-auto space-y-8 p-4 pt-8">
        {/* Hero Section with Back Button */}
        <div className="text-center space-y-6">
          {onBack && (
            <div className="flex justify-start mb-4">
              <Button
                onClick={onBack}
                variant="ghost"
                size="sm"
                className="transition-colors duration-200"
                style={{
                  color: '#a1a1aa',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#f9f9f9'
                  e.currentTarget.style.backgroundColor = '#262626'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#a1a1aa'
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
              </Button>
            </div>
          )}
          
          <h1 
            className="font-bold"
            style={{
              fontSize: '48px',
              fontWeight: 700,
              color: '#f9f9f9',
              lineHeight: 1.2,
              letterSpacing: 'tight'
            }}
          >
            Competitive Intelligence
          </h1>
          <p 
            className="max-w-3xl mx-auto"
            style={{
              fontSize: '18px',
              color: '#a1a1aa',
              lineHeight: 1.4
            }}
          >
            Get comprehensive competitive analysis powered by AI agents. Enter a company name and optional website to start your analysis.
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5" style={{ color: '#facc15' }} />
              <span style={{ color: '#a1a1aa', fontSize: '14px' }}>Researcher Agent</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5" style={{ color: '#facc15' }} />
              <span style={{ color: '#a1a1aa', fontSize: '14px' }}>Analyst Agent</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" style={{ color: '#facc15' }} />
              <span style={{ color: '#a1a1aa', fontSize: '14px' }}>Writer Agent</span>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
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
          <CardHeader 
            className="text-center"
            style={{
              backgroundColor: '#1a1a1a !important'
            }}
          >
            <CardTitle 
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#f9f9f9 !important'
              }}
            >
              Start Analysis
            </CardTitle>
            <CardDescription 
              style={{
                fontSize: '16px',
                color: '#a1a1aa !important'
              }}
            >
              Our multi-agent system will research, analyze, and generate a comprehensive competitive intelligence report
            </CardDescription>
          </CardHeader>
          <CardContent 
            style={{
              backgroundColor: '#1a1a1a !important'
            }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel 
                          className="flex items-center space-x-2"
                          style={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#f9f9f9 !important'
                          }}
                        >
                          <Building className="h-4 w-4" style={{ color: '#f9f9f9' }} />
                          <span>Company Name</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Slack, Notion, Figma" 
                            className="h-12 border focus:ring-2"
                            style={{
                              backgroundColor: '#111111 !important',
                              borderColor: '#262626 !important',
                              borderRadius: '6px',
                              color: '#f9f9f9 !important',
                              fontSize: '16px',
                              border: '1px solid #262626'
                            }}
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription 
                          style={{
                            fontSize: '14px',
                            color: '#a1a1aa !important'
                          }}
                        >
                          The name of the competitor you want to analyze
                        </FormDescription>
                        <FormMessage style={{ color: '#ef4444' }} />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel 
                          className="flex items-center space-x-2"
                          style={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#f9f9f9 !important'
                          }}
                        >
                          <Globe className="h-4 w-4" style={{ color: '#f9f9f9' }} />
                          <span>Company URL</span>
                          <Badge 
                            variant="secondary" 
                            className="text-xs"
                            style={{
                              backgroundColor: '#262626 !important',
                              color: '#a1a1aa !important',
                              borderRadius: '6px',
                              border: 'none'
                            }}
                          >
                            Optional
                          </Badge>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://company.com" 
                            className="h-12 border focus:ring-2"
                            style={{
                              backgroundColor: '#111111 !important',
                              borderColor: '#262626 !important',
                              borderRadius: '6px',
                              color: '#f9f9f9 !important',
                              fontSize: '16px',
                              border: '1px solid #262626'
                            }}
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription 
                          style={{
                            fontSize: '14px',
                            color: '#a1a1aa !important'
                          }}
                        >
                          Company website for more targeted analysis
                        </FormDescription>
                        <FormMessage style={{ color: '#ef4444' }} />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-medium transition-all duration-200 hover:brightness-110"
                  disabled={isAnalyzing}
                  style={{
                    backgroundColor: '#facc15 !important',
                    color: '#0a0a0a !important',
                    borderRadius: '9999px',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(250,204,21,0.4)',
                    border: 'none'
                  }}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Start Analysis
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Demo Scenarios */}
        {!isAnalyzing && !analysisResult && (
          <DemoScenarios onSelectScenario={handleDemoScenario} />
        )}

        {/* Progress and Status */}
        {isAnalyzing && (
          <Card 
            className="border shadow-lg"
            style={{
              backgroundColor: '#1a1a1a !important',
              borderColor: '#262626 !important',
              borderRadius: '12px',
              boxShadow: '0 0 12px rgba(0,0,0,0.6)',
              border: '1px solid #262626'
            }}
          >
            <CardContent 
              className="pt-6"
              style={{
                backgroundColor: '#1a1a1a !important'
              }}
            >
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
            className="border"
            style={{
              backgroundColor: '#1a0a0a !important',
              borderColor: '#ef4444 !important',
              borderRadius: '12px',
              border: '1px solid #ef4444'
            }}
          >
            <AlertCircle className="h-4 w-4" style={{ color: '#ef4444' }} />
            <AlertDescription style={{ color: '#ef4444 !important' }}>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {analysisResult && (
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
            <CardHeader 
              style={{
                backgroundColor: '#1a1a1a !important'
              }}
            >
              <CardTitle 
                className="flex items-center space-x-2"
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#f9f9f9 !important'
                }}
              >
                <CheckCircle className="h-6 w-6" style={{ color: '#22c55e' }} />
                <span>Analysis Complete</span>
              </CardTitle>
              <CardDescription 
                style={{
                  fontSize: '16px',
                  color: '#a1a1aa !important'
                }}
              >
                Competitive intelligence report for {analysisResult.competitor}
              </CardDescription>
            </CardHeader>
            <CardContent 
              className="space-y-6"
              style={{
                backgroundColor: '#1a1a1a !important'
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  className="text-center p-4 rounded-lg"
                  style={{
                    backgroundColor: '#111111 !important',
                    borderRadius: '12px'
                  }}
                >
                  <Brain className="h-8 w-8 mx-auto mb-2" style={{ color: '#facc15' }} />
                  <div 
                    className="font-medium"
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#f9f9f9 !important'
                    }}
                  >
                    Research
                  </div>
                  <div 
                    className="text-sm"
                    style={{
                      fontSize: '14px',
                      color: '#a1a1aa !important'
                    }}
                  >
                    Data Collection
                  </div>
                </div>
                <div 
                  className="text-center p-4 rounded-lg"
                  style={{
                    backgroundColor: '#111111 !important',
                    borderRadius: '12px'
                  }}
                >
                  <Activity className="h-8 w-8 mx-auto mb-2" style={{ color: '#facc15' }} />
                  <div 
                    className="font-medium"
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#f9f9f9 !important'
                    }}
                  >
                    Analysis
                  </div>
                  <div 
                    className="text-sm"
                    style={{
                      fontSize: '14px',
                      color: '#a1a1aa !important'
                    }}
                  >
                    Strategic Insights
                  </div>
                </div>
                <div 
                  className="text-center p-4 rounded-lg"
                  style={{
                    backgroundColor: '#111111 !important',
                    borderRadius: '12px'
                  }}
                >
                  <FileText className="h-8 w-8 mx-auto mb-2" style={{ color: '#facc15' }} />
                  <div 
                    className="font-medium"
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#f9f9f9 !important'
                    }}
                  >
                    Report
                  </div>
                  <div 
                    className="text-sm"
                    style={{
                      fontSize: '14px',
                      color: '#a1a1aa !important'
                    }}
                  >
                    Executive Summary
                  </div>
                </div>
              </div>

              <Separator style={{ backgroundColor: '#262626' }} />

              <div className="space-y-6">
                {/* Dashboard Visualization */}
                {analysisResult.metrics && (
                  <CompetitiveDashboard 
                    data={{
                      competitor: analysisResult.competitor,
                      competitive_metrics: analysisResult.metrics.competitive_metrics,
                      swot_scores: analysisResult.metrics.swot_scores
                    }}
                  />
                )}

                <div>
                  <h3 
                    className="font-semibold mb-2"
                    style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#f9f9f9 !important'
                    }}
                  >
                    Executive Report
                  </h3>
                  <div 
                    className="p-6 rounded-lg"
                    style={{
                      backgroundColor: '#111111 !important',
                      borderRadius: '12px'
                    }}
                  >
                    <MarkdownRenderer content={analysisResult.final_report} />
                  </div>
                </div>

                <details className="group">
                  <summary 
                    className="cursor-pointer font-medium hover:text-gray-300 flex items-center transition-colors duration-200"
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#f9f9f9 !important'
                    }}
                  >
                    <Brain className="h-4 w-4 mr-2" style={{ color: '#facc15' }} />
                    View Research Findings
                  </summary>
                  <div 
                    className="mt-2 p-6 rounded-lg"
                    style={{
                      backgroundColor: '#111111 !important',
                      borderRadius: '12px'
                    }}
                  >
                    <MarkdownRenderer content={analysisResult.research_findings} />
                  </div>
                </details>

                <details className="group">
                  <summary 
                    className="cursor-pointer font-medium hover:text-gray-300 flex items-center transition-colors duration-200"
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#f9f9f9 !important'
                    }}
                  >
                    <Activity className="h-4 w-4 mr-2" style={{ color: '#facc15' }} />
                    View Strategic Analysis
                  </summary>
                  <div 
                    className="mt-2 p-6 rounded-lg"
                    style={{
                      backgroundColor: '#111111 !important',
                      borderRadius: '12px'
                    }}
                  >
                    <MarkdownRenderer content={analysisResult.strategic_analysis} />
                  </div>
                </details>
              </div>

              <div 
                className="flex items-center justify-between text-sm pt-4 border-t"
                style={{
                  borderColor: '#262626',
                  fontSize: '14px',
                  color: '#a1a1aa !important'
                }}
              >
                <span>Generated on {new Date(analysisResult.timestamp).toLocaleDateString()}</span>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetForm}
                    style={{
                      backgroundColor: 'transparent !important',
                      borderColor: '#262626 !important',
                      color: '#f9f9f9 !important',
                      borderRadius: '6px',
                      border: '1px solid #262626'
                    }}
                  >
                    New Analysis
                  </Button>
                  <Badge 
                    variant="outline" 
                    style={{
                      backgroundColor: '#22c55e20 !important',
                      color: '#22c55e !important',
                      borderColor: '#22c55e !important',
                      borderRadius: '6px',
                      border: '1px solid #22c55e'
                    }}
                  >
                    {analysisResult.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      </div>
    </>
  )
}
