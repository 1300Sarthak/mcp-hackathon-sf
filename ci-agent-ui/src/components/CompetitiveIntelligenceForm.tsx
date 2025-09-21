import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Form, 
  FormField
} from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  Activity,
  Brain,
  FileText,
  Loader2,
  Target,
  MessageCircle,
  Send,
  Bot,
  User,
  Lightbulb,
  Compass
} from 'lucide-react'
import DemoScenarios from './DemoScenarios'
import MarkdownRenderer from './MarkdownRenderer'
import CompetitiveDashboard from './CompetitiveDashboard'
import BentoAnalysisLayout from './BentoAnalysisLayout'
import DiscoveryResults from './DiscoveryResults'
import Footer from './Footer'

// Form validation schema
const formSchema = z.object({
  companyName: z.string().min(1, "Company name is required").max(100, "Company name too long"),
  companyUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  niche: z.string().min(1, "Please select an analysis focus"),
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

interface CompetitiveIntelligenceFormProps {
  initialCompany?: string
  initialUrl?: string
  initialNiche?: string
}

export default function CompetitiveIntelligenceForm({
  initialCompany = '',
  initialUrl = '',
  initialNiche = 'all'
}: CompetitiveIntelligenceFormProps = {}) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'bento' | 'traditional'>('bento')
  const [mode, setMode] = useState<'analyze' | 'discover'>('analyze')
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string, timestamp: string}>>([])
  const [chatInput, setChatInput] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [discoveryResult, setDiscoveryResult] = useState<{
    business_idea: string
    discovery_report: string
  } | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: initialCompany,
      companyUrl: initialUrl,
      niche: initialNiche,
    },
  })

  // Auto-submit when initial values are provided
  useEffect(() => {
    if (initialCompany && !isAnalyzing && !analysisResult) {
      // Small delay to ensure form is fully initialized
      setTimeout(() => {
        analyzeCompetitor({
          companyName: initialCompany,
          companyUrl: initialUrl,
          niche: initialNiche,
        })
      }, 100)
    }
  }, [initialCompany, initialUrl, isAnalyzing, analysisResult])

  const analyzeCompetitor = async (values: FormValues) => {
    setIsAnalyzing(true)
    setProgress(5) // Start with 5% instead of 0%
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
          niche: values.niche,
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

              // Update progress and current step based on event type
              if (eventData.type === 'status_update') {
                setCurrentStep(eventData.message || '')
                
                // More granular progress tracking
                if (eventData.step === 'start') {
                  setProgress(5)
                } else if (eventData.step === 'research_start') {
                  setProgress(15)
                } else if (eventData.step === 'research_complete') {
                  setProgress(40)
                } else if (eventData.step === 'analysis_start') {
                  setProgress(50)
                } else if (eventData.step === 'analysis_complete') {
                  setProgress(75)
                } else if (eventData.step === 'report_start') {
                  setProgress(85)
                } else if (eventData.step === 'complete') {
                  setProgress(100)
                } else if (eventData.step === 'cache_hit') {
                  setProgress(100) // Instant for cached results
                }
              } else if (eventData.type === 'tool_call') {
                // Show incremental progress during tool calls
                if (currentStep.includes('Researcher')) {
                  setProgress(prev => Math.min(prev + 2, 35)) // Gradually increase during research
                } else if (currentStep.includes('Analyst')) {
                  setProgress(prev => Math.min(prev + 3, 70)) // Gradually increase during analysis
                } else if (currentStep.includes('Writer')) {
                  setProgress(prev => Math.min(prev + 2, 95)) // Gradually increase during writing
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
    form.setValue('niche', 'all') // Default to comprehensive analysis for demo scenarios
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || isChatLoading) return

    const userMessage = {
      role: 'user' as const,
      content: chatInput.trim(),
      timestamp: new Date().toISOString()
    }

    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setIsChatLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/discover/competitors/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          business_idea: userMessage.content,
          stream: true
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

      // Add a placeholder assistant message that we'll update
      const placeholderMessage = {
        role: 'assistant' as const,
        content: '🔍 Searching for competitors across multiple platforms...',
        timestamp: new Date().toISOString()
      }
      setChatMessages(prev => [...prev, placeholderMessage])

      let discoveryContent = ''
      let lastMessageIndex = -1

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const eventData: StreamEvent = JSON.parse(line.slice(6))

              // Update the assistant message based on event type
              if (eventData.type === 'status_update') {
                setChatMessages(prev => {
                  const newMessages = [...prev]
                  if (newMessages.length > 0) {
                    newMessages[newMessages.length - 1] = {
                      ...newMessages[newMessages.length - 1],
                      content: eventData.message || 'Processing...'
                    }
                  }
                  return newMessages
                })
              } else if (eventData.type === 'complete') {
                // Final discovery results
                const discoveryData = eventData.data
                if (discoveryData?.discovery_report) {
                  // Set discovery result for the results component
                  setDiscoveryResult({
                    business_idea: discoveryData.business_idea,
                    discovery_report: discoveryData.discovery_report
                  })
                  
                  // Update chat with completion message
                  setChatMessages(prev => {
                    const newMessages = [...prev]
                    if (newMessages.length > 0) {
                      newMessages[newMessages.length - 1] = {
                        ...newMessages[newMessages.length - 1],
                        content: `✅ Discovery complete! Found potential competitors for your business idea. Check the results below to analyze specific competitors in detail.`
                      }
                    }
                    return newMessages
                  })
                }
                break
              } else if (eventData.type === 'error') {
                throw new Error(eventData.message || 'Discovery failed')
              }
            } catch (parseError) {
              console.warn('Failed to parse discovery event:', parseError)
            }
          }
        }
      }
    } catch (err) {
      const errorMessage = {
        role: 'assistant' as const,
        content: 'Sorry, I encountered an error while searching for competitors. Please try again.',
        timestamp: new Date().toISOString()
      }
      setChatMessages(prev => [...prev.slice(0, -1), errorMessage]) // Replace the last message
    } finally {
      setIsChatLoading(false)
    }
  }

  const resetChat = () => {
    setChatMessages([])
    setChatInput('')
    setAnalysisResult(null)
    setDiscoveryResult(null)
    setError(null)
  }

  const resetAnalyzer = () => {
    form.reset()
    setAnalysisResult(null)
    setDiscoveryResult(null)
    setError(null)
    setProgress(0)
    setCurrentStep('')
  }

  const handleAnalyzeCompetitorFromDiscovery = (name: string, website: string) => {
    // Switch to analyze mode and run analysis
    setMode('analyze')
    setDiscoveryResult(null) // Clear discovery results
    
    // Set form values and submit
    form.setValue('companyName', name)
    form.setValue('companyUrl', website)
    form.setValue('niche', 'all')
    
    // Submit the form
    analyzeCompetitor({
      companyName: name,
      companyUrl: website,
      niche: 'all'
    })
  }



  const getStepIcon = (step: string) => {
    if (step.includes('Researcher') || step.includes('Collecting data') || step.includes('Research complete')) {
      return <Brain className="h-4 w-4 text-blue-400" />
    }
    if (step.includes('Analyst') || step.includes('Processing') || step.includes('Analyzing') || step.includes('Extracting')) {
      return <Activity className="h-4 w-4 text-green-400" />
    }
    if (step.includes('Writer') || step.includes('Crafting') || step.includes('generating')) {
      return <FileText className="h-4 w-4 text-purple-400" />
    }
    if (step.includes('cached') || step.includes('Found cached')) {
      return <Target className="h-4 w-4 text-yellow-400" />
    }
    return <Zap className="h-4 w-4 text-gray-400" />
  }

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: '#0a0a0a',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* Top Search Bar */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#f9f9f9' }}>
            Competitive Intelligence
          </h1>
          
          {/* Mode Toggle */}
          <div className="flex justify-center mb-8">
            <div className="flex rounded-lg p-1" style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626' }}>
              <button
                onClick={() => {
                  setMode('analyze')
                  resetChat()
                }}
                className={`px-6 py-3 text-sm font-medium rounded-md transition-all flex items-center space-x-2 ${
                  mode === 'analyze' 
                    ? 'text-black shadow-sm' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                style={{ 
                  backgroundColor: mode === 'analyze' ? '#FACC15' : 'transparent'
                }}
              >
                <Search className="w-4 h-4" />
                <span>Analyze Competitor</span>
              </button>
              <button
                onClick={() => {
                  setMode('discover')
                  resetAnalyzer()
                }}
                className={`px-6 py-3 text-sm font-medium rounded-md transition-all flex items-center space-x-2 ${
                  mode === 'discover' 
                    ? 'text-black shadow-sm' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                style={{ 
                  backgroundColor: mode === 'discover' ? '#FACC15' : 'transparent'
                }}
              >
                <Compass className="w-4 h-4" />
                <span>Discover Competitors</span>
              </button>
            </div>
          </div>

          <p className="text-gray-400 max-w-2xl mx-auto">
            {mode === 'analyze' 
              ? 'Enter a specific company name to analyze their competitive position and strategy'
              : 'Describe your business idea and I\'ll help you discover potential competitors in your space'
            }
          </p>
        </div>

        {/* Conditional Interface */}
        {mode === 'analyze' ? (
          /* Search Bar Form */
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-4xl mx-auto mb-8">
              {/* Desktop Pill Search Bar */}
              <div 
                className="flex items-center rounded-full border shadow-lg overflow-hidden"
                style={{
                  backgroundColor: '#1a1a1a',
                  borderColor: '#262626',
                  boxShadow: '0 0 12px rgba(0,0,0,0.6)'
                }}
              >
              {/* Company Input */}
              <div className="flex-1 px-6 py-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <Input
                      placeholder="Enter company name…"
                      className="border-0 bg-transparent text-base focus:ring-0 focus:outline-none p-0 h-auto"
                      style={{
                        color: '#f9f9f9',
                        fontFamily: 'Inter, sans-serif'
                      }}
                      {...field}
                    />
                  )}
                />
              </div>

              {/* Divider */}
              <div 
                className="w-px h-8"
                style={{ backgroundColor: '#262626' }}
              />

              {/* URL Input */}
              <div className="flex-1 px-6 py-4">
                <FormField
                  control={form.control}
                  name="companyUrl"
                  render={({ field }) => (
                    <Input
                      placeholder="https://company.com (optional)"
                      className="border-0 bg-transparent text-base focus:ring-0 focus:outline-none p-0 h-auto"
                      style={{
                        color: '#f9f9f9',
                        fontFamily: 'Inter, sans-serif'
                      }}
                      {...field}
                    />
                  )}
                />
              </div>

              {/* Divider */}
              <div 
                className="w-px h-8"
                style={{ backgroundColor: '#262626' }}
              />

              {/* Analysis Focus Select */}
              <div className="flex-1 px-6 py-4">
                <FormField
                  control={form.control}
                  name="niche"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger 
                        className="border-0 bg-transparent text-base focus:ring-0 focus:outline-none p-0 h-auto"
                        style={{
                          color: '#f9f9f9',
                          fontFamily: 'Inter, sans-serif'
                        }}
                      >
                        <SelectValue placeholder="Analysis focus" />
                      </SelectTrigger>
                      <SelectContent 
                        className="shadow-lg"
                        style={{ 
                          backgroundColor: '#1a1a1a', 
                          borderColor: '#262626',
                          borderRadius: '12px',
                          boxShadow: '0 0 12px rgba(0,0,0,0.6)'
                        }}
                      >
                        <SelectItem value="all" className="text-white hover:bg-yellow-400/20 hover:text-yellow-400">All Departments</SelectItem>
                        <SelectItem value="it" className="text-white hover:bg-yellow-400/20 hover:text-yellow-400">IT & Technology</SelectItem>
                        <SelectItem value="sales" className="text-white hover:bg-yellow-400/20 hover:text-yellow-400">Sales & Business Development</SelectItem>
                        <SelectItem value="marketing" className="text-white hover:bg-yellow-400/20 hover:text-yellow-400">Marketing & Growth</SelectItem>
                        <SelectItem value="finance" className="text-white hover:bg-yellow-400/20 hover:text-yellow-400">Finance & Operations</SelectItem>
                        <SelectItem value="product" className="text-white hover:bg-yellow-400/20 hover:text-yellow-400">Product & Engineering</SelectItem>
                        <SelectItem value="hr" className="text-white hover:bg-yellow-400/20 hover:text-yellow-400">HR & People Operations</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Search Button */}
              <div className="p-2">
                  <Button
                    type="submit"
                    disabled={isAnalyzing}
                    className="w-12 h-12 rounded-full p-0 transition-all duration-200 disabled:opacity-50 hover:brightness-110 hover:scale-105"
                    style={{
                      backgroundColor: isAnalyzing ? '#6b7280' : '#facc15',
                      color: '#0a0a0a',
                      boxShadow: isAnalyzing ? '0 2px 8px rgba(107,114,128,0.4)' : '0 2px 8px rgba(250,204,21,0.4)'
                    }}
                  >
                    {isAnalyzing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                  </Button>
              </div>
            </div>
          </form>
        </Form>
        ) : (
          /* Chatbot Interface */
          <div className="w-full max-w-4xl mx-auto mb-8">
            {/* Chat Container */}
            <div 
              className="rounded-xl border shadow-lg overflow-hidden"
              style={{
                backgroundColor: '#1a1a1a',
                borderColor: '#262626',
                boxShadow: '0 0 12px rgba(0,0,0,0.6)'
              }}
            >
              {/* Chat Header */}
              <div className="px-6 py-4 border-b" style={{ borderColor: '#262626' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: '#f9f9f9' }}>Competitor Discovery Assistant</h3>
                    <p className="text-sm text-gray-400">Describe your business idea to find potential competitors</p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto p-6 space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <Lightbulb className="w-12 h-12 mx-auto text-yellow-400 mb-4" />
                    <h4 className="text-lg font-medium text-gray-200 mb-2">Ready to discover your competitors?</h4>
                    <p className="text-gray-400 max-w-md mx-auto">
                      Tell me about your business idea, product, or service and I'll help you identify potential competitors in your market.
                    </p>
                    <div className="mt-6 space-y-2 text-sm text-gray-500">
                      <p>Try something like:</p>
                      <div className="space-y-1">
                        <p>"I'm building a project management tool for remote teams"</p>
                        <p>"My startup is a food delivery app for healthy meals"</p>
                        <p>"I want to create an AI-powered customer service chatbot"</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  chatMessages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex items-start space-x-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.role === 'user' 
                            ? 'bg-yellow-400' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-600'
                        }`}>
                          {message.role === 'user' ? (
                            <User className="w-4 h-4 text-black" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className={`rounded-lg px-4 py-3 ${
                          message.role === 'user' 
                            ? 'bg-yellow-400 text-black' 
                            : 'bg-gray-800 text-gray-200'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.role === 'user' ? 'text-black/70' : 'text-gray-400'
                          }`}>
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gray-800 rounded-lg px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                          <span className="text-sm text-gray-200">Searching for competitors...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleChatSubmit} className="px-6 py-4 border-t" style={{ borderColor: '#262626' }}>
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Describe your business idea..."
                      className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                      style={{
                        backgroundColor: '#111827',
                        color: '#f9f9f9',
                      }}
                      disabled={isChatLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!chatInput.trim() || isChatLoading}
                    className="w-12 h-12 rounded-full p-0 transition-all duration-200 disabled:opacity-50 hover:brightness-110"
                    style={{
                      backgroundColor: (!chatInput.trim() || isChatLoading) ? '#6b7280' : '#facc15',
                      color: '#0a0a0a',
                      boxShadow: (!chatInput.trim() || isChatLoading) ? '0 2px 8px rgba(107,114,128,0.4)' : '0 2px 8px rgba(250,204,21,0.4)'
                    }}
                  >
                    {isChatLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Demo Scenarios - Only in Analyze Mode */}
      {mode === 'analyze' && !isAnalyzing && !analysisResult && (
        <div className="max-w-7xl mx-auto px-4">
          <DemoScenarios onSelectScenario={handleDemoScenario} />
        </div>
      )}

      {/* Discovery Results - Only in Discover Mode */}
      {mode === 'discover' && discoveryResult && !isChatLoading && (
        <DiscoveryResults 
          businessIdea={discoveryResult.business_idea}
          discoveryReport={discoveryResult.discovery_report}
          onAnalyzeCompetitor={handleAnalyzeCompetitorFromDiscovery}
        />
      )}

      {/* Progress and Status */}
      {isAnalyzing && (
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <Card 
            className="border-0 shadow-lg"
            style={{
              backgroundColor: '#1a1a1a',
              borderColor: '#262626'
            }}
          >
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3" style={{ color: '#f9f9f9' }}>
                    <div className="animate-pulse">
                      {getStepIcon(currentStep)}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{currentStep}</span>
                        {(currentStep.includes('Researcher') || currentStep.includes('Collecting') || currentStep.includes('Research complete')) && (
                          <Badge className="bg-blue-500/20 text-blue-400 text-xs border-blue-400/30">Researcher</Badge>
                        )}
                        {(currentStep.includes('Analyst') || currentStep.includes('Processing') || currentStep.includes('Analyzing') || currentStep.includes('Extracting')) && (
                          <Badge className="bg-green-500/20 text-green-400 text-xs border-green-400/30">Analyst</Badge>
                        )}
                        {(currentStep.includes('Writer') || currentStep.includes('Crafting') || currentStep.includes('generating')) && (
                          <Badge className="bg-purple-500/20 text-purple-400 text-xs border-purple-400/30">Writer</Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 mt-1">
                        {progress < 15 ? 'Initializing multi-agent workflow...' :
                         progress < 40 ? 'Gathering competitive data from web sources...' :
                         progress < 75 ? 'Analyzing strategic position and metrics...' :
                         progress < 100 ? 'Generating executive report and recommendations...' :
                         'Analysis complete!'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant="outline" 
                      className="border-yellow-400 text-yellow-400 bg-yellow-400/10 mb-1"
                    >
                      {progress}%
                    </Badge>
                    <div className="text-xs text-gray-400">
                      {progress === 100 ? 'Done' : 'Processing...'}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500 ease-out rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {/* Progress milestones */}
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span className={progress >= 15 ? 'text-yellow-400' : ''}>Research</span>
                    <span className={progress >= 50 ? 'text-yellow-400' : ''}>Analysis</span>
                    <span className={progress >= 85 ? 'text-yellow-400' : ''}>Report</span>
                    <span className={progress >= 100 ? 'text-yellow-400' : ''}>Complete</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <Alert 
            className="border-red-600 bg-red-900/20"
            style={{ borderColor: '#dc2626', backgroundColor: 'rgba(127, 29, 29, 0.2)' }}
          >
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">
              {error}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Results */}
      {analysisResult && (
        <div className="w-full">
          {/* Header with View Toggle */}
          <div className="max-w-7xl mx-auto px-4 mb-8">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <h2 className="text-2xl font-bold" style={{ color: '#f9f9f9' }}>
                  Analysis Complete
                </h2>
              </div>
              <p className="text-gray-400">
                Competitive intelligence report for {analysisResult.competitor}
              </p>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex justify-center mb-6">
              <div className="flex rounded-lg p-1" style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626' }}>
                <button
                  onClick={() => setViewMode('bento')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    viewMode === 'bento' 
                      ? 'text-black shadow-sm' 
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                  style={{ 
                    backgroundColor: viewMode === 'bento' ? '#FACC15' : 'transparent'
                  }}
                >
                  🎯 Bento View
                </button>
                <button
                  onClick={() => setViewMode('traditional')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    viewMode === 'traditional' 
                      ? 'text-black shadow-sm' 
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                  style={{ 
                    backgroundColor: viewMode === 'traditional' ? '#FACC15' : 'transparent'
                  }}
                >
                  📄 Traditional View
                </button>
              </div>
            </div>
          </div>

          {/* Bento Layout */}
          {viewMode === 'bento' && (
            <BentoAnalysisLayout data={analysisResult} />
          )}

          {/* Traditional Layout */}
          {viewMode === 'traditional' && (
            <div className="max-w-7xl mx-auto px-4">

          {/* Main Two-Column Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 mb-12">
            {/* Left Side - Executive Report (7 columns) */}
            <div className="xl:col-span-7">
              <h3 className="text-xl font-semibold mb-6" style={{ color: '#f9f9f9' }}>
                Executive Report
              </h3>
              <div 
                className="p-8 rounded-xl border shadow-lg h-full min-h-[500px]"
                style={{
                  backgroundColor: '#1a1a1a',
                  borderColor: '#262626',
                  boxShadow: '0 0 12px rgba(0,0,0,0.6)'
                }}
              >
                <div style={{ color: '#f9f9f9', lineHeight: '1.7' }}>
                  <MarkdownRenderer content={analysisResult.final_report} />
                </div>
              </div>
            </div>

            {/* Right Side - Key Metrics & Analysis (5 columns) */}
            <div className="xl:col-span-5">
              <h3 className="text-xl font-semibold mb-6" style={{ color: '#f9f9f9' }}>
                Key Metrics & Analysis
              </h3>
              {analysisResult.metrics && (
                <div 
                  className="p-8 rounded-xl border shadow-lg h-full min-h-[500px]"
                  style={{
                    backgroundColor: '#1a1a1a',
                    borderColor: '#262626',
                    boxShadow: '0 0 12px rgba(0,0,0,0.6)'
                  }}
                >
                  <div className="h-full flex flex-col justify-center">
                    <CompetitiveDashboard 
                      data={{
                        competitor: analysisResult.competitor,
                        competitive_metrics: analysisResult.metrics.competitive_metrics,
                        swot_scores: analysisResult.metrics.swot_scores
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row - Research & Strategic Analysis */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            {/* Research Findings */}
            <div>
              <h3 className="text-xl font-semibold mb-6" style={{ color: '#f9f9f9' }}>
                Research Findings
              </h3>
              <div 
                className="p-8 rounded-xl border shadow-lg min-h-[400px]"
                style={{
                  backgroundColor: '#1a1a1a',
                  borderColor: '#262626',
                  boxShadow: '0 0 12px rgba(0,0,0,0.6)'
                }}
              >
                <div style={{ color: '#f9f9f9', lineHeight: '1.7' }}>
                  <MarkdownRenderer content={analysisResult.research_findings} />
                </div>
              </div>
            </div>

            {/* Strategic Analysis */}
            <div>
              <h3 className="text-xl font-semibold mb-6" style={{ color: '#f9f9f9' }}>
                Strategic Analysis
              </h3>
              <div 
                className="p-8 rounded-xl border shadow-lg min-h-[400px]"
                style={{
                  backgroundColor: '#1a1a1a',
                  borderColor: '#262626',
                  boxShadow: '0 0 12px rgba(0,0,0,0.6)'
                }}
              >
                <div style={{ color: '#f9f9f9', lineHeight: '1.7' }}>
                  <MarkdownRenderer content={analysisResult.strategic_analysis} />
                </div>
              </div>
            </div>
          </div>

            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  )
}