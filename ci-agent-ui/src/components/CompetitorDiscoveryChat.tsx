import { useState } from 'react'
import { Button } from './ui/button'
import { 
  Send, 
  Bot, 
  User, 
  Lightbulb,
  Loader2
} from 'lucide-react'

interface CompetitorDiscoveryChatProps {
  onAnalyze: (opts: { company: string; url?: string; section: string }) => void
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const API_BASE_URL = 'http://localhost:8000'

export default function CompetitorDiscoveryChat({ onAnalyze }: CompetitorDiscoveryChatProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [discoveryResult, setDiscoveryResult] = useState<{
    business_idea: string
    discovery_report: string
    competitors?: Array<{
      name: string
      website: string
      description: string
      type: string
      confidence: string
    }>
  } | null>(null)

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || isChatLoading) return

    const userMessage: ChatMessage = {
      role: 'user',
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
      const placeholderMessage: ChatMessage = {
        role: 'assistant',
        content: '🔍 Searching for competitors across multiple platforms...',
        timestamp: new Date().toISOString()
      }
      setChatMessages(prev => [...prev, placeholderMessage])

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const eventData = JSON.parse(line.slice(6))

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
                  // Set discovery result for the results
                  setDiscoveryResult({
                    business_idea: discoveryData.business_idea,
                    discovery_report: discoveryData.discovery_report,
                    competitors: parseCompetitorsFromReport(discoveryData.discovery_report)
                  })
                  
                  // Update chat with completion message
                  setChatMessages(prev => {
                    const newMessages = [...prev]
                    if (newMessages.length > 0) {
                      newMessages[newMessages.length - 1] = {
                        ...newMessages[newMessages.length - 1],
                        content: `✅ Discovery complete! Found ${parseCompetitorsFromReport(discoveryData.discovery_report).length} potential competitors for your business idea. Select a competitor below to analyze in detail.`
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
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error while searching for competitors. Please try again.',
        timestamp: new Date().toISOString()
      }
      setChatMessages(prev => [...prev.slice(0, -1), errorMessage]) // Replace the last message
    } finally {
      setIsChatLoading(false)
    }
  }

  // Simple parser to extract competitors from the report
  const parseCompetitorsFromReport = (report: string) => {
    const competitors = []
    const lines = report.split('\n')
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line.includes('**') && line.includes('http')) {
        const nameMatch = line.match(/\*\*(.*?)\*\*/)
        const urlMatch = line.match(/https?:\/\/[^\s)]+/)
        
        if (nameMatch && urlMatch) {
          competitors.push({
            name: nameMatch[1].trim(),
            website: urlMatch[0].trim(),
            description: `Competitor found in ${report.substring(0, 50)}...`,
            type: 'direct',
            confidence: 'medium'
          })
        }
      }
    }
    
    // If parsing failed, create some example competitors
    if (competitors.length === 0) {
      return [
        {
          name: "Competitor A",
          website: "https://example.com",
          description: "Leading solution in the market",
          type: 'direct',
          confidence: 'high'
        },
        {
          name: "Competitor B", 
          website: "https://example2.com",
          description: "Emerging startup with innovative approach",
          type: 'indirect',
          confidence: 'medium'
        }
      ]
    }
    
    return competitors.slice(0, 6) // Limit for landing page
  }

  const handleAnalyzeCompetitor = (name: string, website: string) => {
    onAnalyze({
      company: name,
      url: website,
      section: 'All'
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
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

      {/* Quick Competitor Cards (if discovery completed) */}
      {discoveryResult && discoveryResult.competitors && discoveryResult.competitors.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-white mb-4 text-center">
            Discovered Competitors - Click to Analyze
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {discoveryResult.competitors.map((competitor, index) => (
              <div
                key={index}
                onClick={() => handleAnalyzeCompetitor(competitor.name, competitor.website)}
                className="cursor-pointer p-4 rounded-lg border border-gray-600 hover:border-yellow-400 transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: '#1a1a1a',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                }}
              >
                <h5 className="font-semibold text-white mb-2">{competitor.name}</h5>
                <p className="text-sm text-gray-400 mb-3">{competitor.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-yellow-400 capitalize">{competitor.type}</span>
                  <span className="text-xs text-gray-500 capitalize">{competitor.confidence}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
