import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Target, 
  ExternalLink, 
  TrendingUp, 
  Building, 
  Zap,
  Search,
  CheckCircle
} from 'lucide-react'

interface Competitor {
  name: string
  website: string
  description: string
  type: 'direct' | 'indirect' | 'adjacent' | 'emerging'
  confidence: 'high' | 'medium' | 'low'
  source: string
  stage: 'startup' | 'growth' | 'established'
}

interface DiscoveryResultsProps {
  businessIdea: string
  discoveryReport: string
  onAnalyzeCompetitor: (name: string, website: string) => void
}

// Parse competitors from discovery report text
const parseCompetitors = (report: string): Competitor[] => {
  const competitors: Competitor[] = []
  
  // This is a simplified parser - in a real implementation, 
  // you'd want the backend to return structured data
  const lines = report.split('\n')
  let currentCompetitor: Partial<Competitor> = {}
  
  for (const line of lines) {
    const trimmed = line.trim()
    
    // Look for competitor entries (this is a basic pattern matcher)
    if (trimmed.includes('**') && trimmed.includes('http')) {
      // Extract company name and website
      const nameMatch = trimmed.match(/\*\*(.*?)\*\*/)
      const urlMatch = trimmed.match(/https?:\/\/[^\s)]+/)
      
      if (nameMatch && urlMatch) {
        currentCompetitor = {
          name: nameMatch[1].trim(),
          website: urlMatch[0].trim(),
          type: 'direct',
          confidence: 'medium',
          source: 'multiple platforms',
          stage: 'growth'
        }
      }
    } else if (trimmed.startsWith('- ') && currentCompetitor.name) {
      // Extract description
      if (!currentCompetitor.description) {
        currentCompetitor.description = trimmed.substring(2)
      }
      
      // Look for type indicators
      if (trimmed.toLowerCase().includes('direct competitor')) {
        currentCompetitor.type = 'direct'
      } else if (trimmed.toLowerCase().includes('indirect')) {
        currentCompetitor.type = 'indirect'
      } else if (trimmed.toLowerCase().includes('adjacent')) {
        currentCompetitor.type = 'adjacent'
      } else if (trimmed.toLowerCase().includes('emerging')) {
        currentCompetitor.type = 'emerging'
      }
      
      // Look for confidence indicators
      if (trimmed.toLowerCase().includes('high confidence')) {
        currentCompetitor.confidence = 'high'
      } else if (trimmed.toLowerCase().includes('low confidence')) {
        currentCompetitor.confidence = 'low'
      }
    } else if (trimmed === '' && currentCompetitor.name && currentCompetitor.description) {
      // End of current competitor, add to list
      competitors.push(currentCompetitor as Competitor)
      currentCompetitor = {}
    }
  }
  
  // Add the last competitor if exists
  if (currentCompetitor.name && currentCompetitor.description) {
    competitors.push(currentCompetitor as Competitor)
  }
  
  // If parsing failed, create some mock competitors for demonstration
  if (competitors.length === 0) {
    return [
      {
        name: "Competitor A",
        website: "https://example.com",
        description: "Leading solution in the market with strong brand presence",
        type: 'direct',
        confidence: 'high',
        source: 'LinkedIn',
        stage: 'established'
      },
      {
        name: "Competitor B", 
        website: "https://example2.com",
        description: "Emerging startup with innovative approach to the problem",
        type: 'indirect',
        confidence: 'medium',
        source: 'Product Hunt',
        stage: 'startup'
      }
    ]
  }
  
  return competitors.slice(0, 8) // Limit to 8 competitors for UI
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'direct': return <Target className="w-4 h-4" />
    case 'indirect': return <TrendingUp className="w-4 h-4" />
    case 'adjacent': return <Building className="w-4 h-4" />
    case 'emerging': return <Zap className="w-4 h-4" />
    default: return <Target className="w-4 h-4" />
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'direct': return 'bg-red-500/20 text-red-400 border-red-400/30'
    case 'indirect': return 'bg-blue-500/20 text-blue-400 border-blue-400/30'
    case 'adjacent': return 'bg-purple-500/20 text-purple-400 border-purple-400/30'
    case 'emerging': return 'bg-green-500/20 text-green-400 border-green-400/30'
    default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30'
  }
}

const getConfidenceColor = (confidence: string) => {
  switch (confidence) {
    case 'high': return 'bg-green-500/20 text-green-400 border-green-400/30'
    case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30'
    case 'low': return 'bg-gray-500/20 text-gray-400 border-gray-400/30'
    default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30'
  }
}

const getStageColor = (stage: string) => {
  switch (stage) {
    case 'startup': return 'bg-blue-500/20 text-blue-400 border-blue-400/30'
    case 'growth': return 'bg-purple-500/20 text-purple-400 border-purple-400/30'
    case 'established': return 'bg-green-500/20 text-green-400 border-green-400/30'
    default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30'
  }
}

export default function DiscoveryResults({ 
  businessIdea, 
  discoveryReport, 
  onAnalyzeCompetitor 
}: DiscoveryResultsProps) {
  const [selectedCompetitors, setSelectedCompetitors] = useState<Set<string>>(new Set())
  const competitors = parseCompetitors(discoveryReport)

  const toggleCompetitorSelection = (name: string) => {
    const newSelected = new Set(selectedCompetitors)
    if (newSelected.has(name)) {
      newSelected.delete(name)
    } else {
      newSelected.add(name)
    }
    setSelectedCompetitors(newSelected)
  }

  const analyzeSelected = () => {
    const firstSelected = Array.from(selectedCompetitors)[0]
    const competitor = competitors.find(c => c.name === firstSelected)
    if (competitor) {
      onAnalyzeCompetitor(competitor.name, competitor.website)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 mb-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <CheckCircle className="h-6 w-6 text-green-400" />
          <h2 className="text-2xl font-bold" style={{ color: '#f9f9f9' }}>
            Competitors Discovered
          </h2>
        </div>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Found {competitors.length} potential competitors for: <span className="text-yellow-400">"{businessIdea}"</span>
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Select competitors to analyze in detail with our comprehensive intelligence system
        </p>
      </div>

      {/* Competitors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {competitors.map((competitor, index) => (
          <Card 
            key={index}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 border ${
              selectedCompetitors.has(competitor.name) 
                ? 'ring-2 ring-yellow-400 border-yellow-400' 
                : 'border-gray-600 hover:border-gray-500'
            }`}
            style={{
              backgroundColor: selectedCompetitors.has(competitor.name) 
                ? 'rgba(250, 204, 21, 0.1)' 
                : '#1a1a1a',
              boxShadow: selectedCompetitors.has(competitor.name)
                ? '0 0 20px rgba(250, 204, 21, 0.3)'
                : '0 0 12px rgba(0,0,0,0.6)'
            }}
            onClick={() => toggleCompetitorSelection(competitor.name)}
          >
            <CardContent className="p-6">
              {/* Header with selection indicator */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(competitor.type)}
                  <h3 className="font-semibold text-white truncate">
                    {competitor.name}
                  </h3>
                </div>
                {selectedCompetitors.has(competitor.name) && (
                  <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                )}
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                {competitor.description}
              </p>

              {/* Badges */}
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge className={`text-xs ${getTypeColor(competitor.type)}`}>
                    {competitor.type}
                  </Badge>
                  <Badge className={`text-xs ${getConfidenceColor(competitor.confidence)}`}>
                    {competitor.confidence}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className={`text-xs ${getStageColor(competitor.stage)}`}>
                    {competitor.stage}
                  </Badge>
                  <Badge className="text-xs bg-gray-700/50 text-gray-300 border-gray-600">
                    {competitor.source}
                  </Badge>
                </div>
              </div>

              {/* Website link */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <a
                  href={competitor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-3 h-3" />
                  <span className="truncate">Visit Website</span>
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Bar */}
      {selectedCompetitors.size > 0 && (
        <div className="flex justify-center">
          <Card className="border-yellow-400/30 bg-yellow-400/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-white font-medium">
                    {selectedCompetitors.size} competitor{selectedCompetitors.size > 1 ? 's' : ''} selected
                  </p>
                  <p className="text-gray-400 text-sm">
                    Ready for detailed competitive analysis
                  </p>
                </div>
                <Button
                  onClick={analyzeSelected}
                  className="bg-yellow-400 text-black hover:bg-yellow-500 transition-colors"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Analyze Selected
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Full Discovery Report */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-6" style={{ color: '#f9f9f9' }}>
          Full Discovery Report
        </h3>
        <Card 
          className="border-0 shadow-lg"
          style={{
            backgroundColor: '#1a1a1a',
            borderColor: '#262626',
            boxShadow: '0 0 12px rgba(0,0,0,0.6)'
          }}
        >
          <CardContent className="p-8">
            <div 
              className="prose prose-invert max-w-none"
              style={{ color: '#f9f9f9', lineHeight: '1.7' }}
            >
              <pre className="whitespace-pre-wrap text-gray-300 font-sans">
                {discoveryReport}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
