import { useState, useEffect } from 'react'
import { 
  LayoutDashboard, 
  GitCompare, 
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Brain,
  History,
  Menu,
  X
} from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Separator } from './ui/separator'
import DashboardRedesigned from './DashboardRedesigned'
import CompanyComparison from './CompanyComparison'
import CompanySearchCard from './CompanySearchCard'
import { type AnalysisMode } from './AnalysisModeToggle'

interface SidebarDashboardProps {
  onBack?: () => void
  initialView?: 'dashboard' | 'compare' | 'search'
  initialAnalysisData?: {
    company: string
    url?: string
    section: string
    analysisMode?: AnalysisMode
  }
}

export default function SidebarDashboard({ onBack, initialView = 'search', initialAnalysisData }: SidebarDashboardProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentView, setCurrentView] = useState<'dashboard' | 'compare' | 'search'>(initialView)
  const [analysisData, setAnalysisData] = useState<{
    company: string
    url?: string
    section: string
    analysisMode?: AnalysisMode
  } | null>(initialAnalysisData || null)
  const [comparisonData, setComparisonData] = useState<{
    company1?: string
    company2?: string
  }>({})

  // Update view when initial analysis data is provided
  useEffect(() => {
    if (initialAnalysisData) {
      setAnalysisData(initialAnalysisData)
      setCurrentView('dashboard')
    }
  }, [initialAnalysisData])

  // Close mobile menu on view change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [currentView])

  const handleAnalyze = (opts: { company: string; url?: string; section: string; analysisMode?: AnalysisMode }) => {
    setAnalysisData(opts)
    setCurrentView('dashboard')
  }

  const handleCompareCompanies = (company1?: string, company2?: string) => {
    setComparisonData({ company1, company2 })
    setCurrentView('compare')
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#0a0a0a', color: '#f9f9f9' }}>
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <div 
        className={`flex-shrink-0 flex flex-col border-r transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } hidden md:flex`}
        style={{ 
          backgroundColor: '#0a0a0a', 
          borderColor: '#262626'
        }}
      >
        {/* Logo/Brand */}
        <div 
          className="h-16 flex items-center justify-between px-4 border-b flex-shrink-0" 
          style={{ borderColor: '#262626' }}
        >
          {!sidebarCollapsed && (
            <h1 
              className="text-xl font-bold transition-opacity duration-300"
              style={{ 
                fontSize: '18px', 
                fontWeight: 700, 
                color: '#f9f9f9',
                textShadow: '0 0 10px #facc15, 0 0 20px #facc15, 0 0 30px #facc15'
              }}
            >
              <span style={{ color: '#facc15' }}>I</span>nfo-Ninja
            </h1>
          )}
          {sidebarCollapsed && (
            <div 
              className="w-8 h-8 flex items-center justify-center mx-auto"
              style={{ 
                color: '#facc15',
                fontSize: '20px',
                fontWeight: 700,
                textShadow: '0 0 10px #facc15'
              }}
            >
              I
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hover:bg-accent transition-colors flex-shrink-0"
            style={{ color: '#a1a1aa' }}
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="mb-4">
            {!sidebarCollapsed && (
              <p className="px-3 text-xs font-semibold uppercase tracking-wider transition-opacity duration-300" style={{ color: '#a1a1aa' }}>
                Competitive Intelligence
              </p>
            )}
          </div>

          <Button
            variant={currentView === 'search' ? 'secondary' : 'ghost'}
            className={`w-full transition-all duration-200 ${sidebarCollapsed ? 'justify-center px-0' : 'justify-start'}`}
            onClick={() => setCurrentView('search')}
            style={{
              backgroundColor: currentView === 'search' ? '#facc15' : 'transparent',
              color: currentView === 'search' ? '#0a0a0a' : '#f9f9f9',
              borderRadius: '8px'
            }}
            title={sidebarCollapsed ? 'Analyze Competitor' : undefined}
          >
            <Brain className="h-4 w-4 flex-shrink-0" />
            {!sidebarCollapsed && <span className="ml-3 truncate">Analyze Competitor</span>}
          </Button>

          <Button
            variant={currentView === 'compare' ? 'secondary' : 'ghost'}
            className={`w-full transition-all duration-200 ${sidebarCollapsed ? 'justify-center px-0' : 'justify-start'}`}
            onClick={() => setCurrentView('compare')}
            style={{
              backgroundColor: currentView === 'compare' ? '#facc15' : 'transparent',
              color: currentView === 'compare' ? '#0a0a0a' : '#f9f9f9',
              borderRadius: '8px'
            }}
            title={sidebarCollapsed ? 'Compare Companies' : undefined}
          >
            <GitCompare className="h-4 w-4 flex-shrink-0" />
            {!sidebarCollapsed && <span className="ml-3 truncate">Compare Companies</span>}
          </Button>

          {!sidebarCollapsed && (
            <>
              <Separator className="my-4" style={{ backgroundColor: '#262626' }} />
              <div className="mb-2">
                <p className="px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#a1a1aa' }}>
                  Features
                </p>
              </div>
            </>
          )}

          <Button 
            variant="ghost" 
            className={`w-full transition-all duration-200 ${sidebarCollapsed ? 'justify-center px-0' : 'justify-start'}`}
            style={{ color: '#f9f9f9', borderRadius: '8px' }}
            title={sidebarCollapsed ? 'AI Insights' : undefined}
          >
            <Sparkles className="h-4 w-4 flex-shrink-0" />
            {!sidebarCollapsed && <span className="ml-3 truncate">AI Insights</span>}
          </Button>

          <Button 
            variant="ghost" 
            className={`w-full transition-all duration-200 ${sidebarCollapsed ? 'justify-center px-0' : 'justify-start'}`}
            style={{ color: '#f9f9f9', borderRadius: '8px' }}
            title={sidebarCollapsed ? 'Analysis History' : undefined}
          >
            <History className="h-4 w-4 flex-shrink-0" />
            {!sidebarCollapsed && <span className="ml-3 truncate">Analysis History</span>}
          </Button>
        </nav>

        {/* Bottom Section - Branding */}
        <div className="border-t p-4 flex-shrink-0" style={{ borderColor: '#262626' }}>
          {!sidebarCollapsed ? (
            <div className="text-center space-y-2 transition-opacity duration-300">
              <p className="text-xs" style={{ color: '#a1a1aa' }}>
                Powered by AI Agents
              </p>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#facc15' }} />
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#facc15', opacity: 0.6, animationDelay: '0.2s' }} />
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#facc15', opacity: 0.3, animationDelay: '0.4s' }} />
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#facc15' }} />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 md:hidden"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="fixed left-0 top-0 bottom-0 w-64 flex flex-col"
            style={{ backgroundColor: '#0a0a0a', borderRight: '1px solid #262626' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Menu Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b" style={{ borderColor: '#262626' }}>
              <h1 
                className="text-xl font-bold"
                style={{ 
                  fontSize: '18px', 
                  fontWeight: 700, 
                  color: '#f9f9f9',
                  textShadow: '0 0 10px #facc15, 0 0 20px #facc15, 0 0 30px #facc15'
                }}
              >
                <span style={{ color: '#facc15' }}>I</span>nfo-Ninja
              </h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#a1a1aa' }}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              <Button
                variant={currentView === 'search' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setCurrentView('search')}
                style={{
                  backgroundColor: currentView === 'search' ? '#facc15' : 'transparent',
                  color: currentView === 'search' ? '#0a0a0a' : '#f9f9f9',
                  borderRadius: '8px'
                }}
              >
                <Brain className="h-4 w-4 flex-shrink-0" />
                <span className="ml-3">Analyze Competitor</span>
              </Button>

              <Button
                variant={currentView === 'compare' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setCurrentView('compare')}
                style={{
                  backgroundColor: currentView === 'compare' ? '#facc15' : 'transparent',
                  color: currentView === 'compare' ? '#0a0a0a' : '#f9f9f9',
                  borderRadius: '8px'
                }}
              >
                <GitCompare className="h-4 w-4 flex-shrink-0" />
                <span className="ml-3">Compare Companies</span>
              </Button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Header */}
        <div className="h-16 border-b px-4 md:px-6 flex items-center justify-between flex-shrink-0" style={{ borderColor: '#262626', backgroundColor: '#0a0a0a' }}>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden flex-shrink-0"
              onClick={() => setMobileMenuOpen(true)}
              style={{ color: '#facc15' }}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 
              className="text-base md:text-lg font-semibold truncate"
              style={{ color: '#f9f9f9' }}
            >
              {currentView === 'dashboard' ? 'Competitive Intelligence Dashboard' : 
               currentView === 'compare' ? 'Compare Companies' : 
               'Competitive Intelligence'}
            </h1>
          </div>
          {onBack && (
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="flex-shrink-0"
              style={{
                color: '#a1a1aa',
                backgroundColor: 'transparent'
              }}
            >
              Sign Out
            </Button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {currentView === 'search' && (
            <div className="p-4 md:p-6 space-y-6">
              {/* Hero Section */}
              <div className="text-center space-y-4 py-4 md:py-8">
                <h2 
                  className="font-bold px-4"
                  style={{
                    fontSize: 'clamp(28px, 5vw, 42px)',
                    fontWeight: 700,
                    color: '#f9f9f9',
                    lineHeight: 1.2
                  }}
                >
                  AI-Powered{' '}
                  <span style={{ color: '#facc15' }}>Competitive Intelligence</span>
                </h2>
                <p 
                  className="max-w-2xl mx-auto px-4"
                  style={{
                    fontSize: 'clamp(14px, 2vw, 18px)',
                    color: '#a1a1aa',
                    lineHeight: 1.6
                  }}
                >
                  Get deep insights into competitors using our multi-agent AI system. 
                  Research, analysis, and reports generated in minutes.
                </p>
              </div>

              {/* Search/Analysis Card */}
              <Card 
                className="max-w-4xl mx-auto" 
                style={{ 
                  backgroundColor: '#1a1a1a', 
                  borderColor: '#262626',
                  borderRadius: '12px'
                }}
              >
                <CardHeader>
                  <CardTitle style={{ color: '#f9f9f9', fontSize: 'clamp(18px, 3vw, 24px)' }}>
                    Start Your Analysis
                  </CardTitle>
                  <CardDescription style={{ color: '#a1a1aa', fontSize: 'clamp(14px, 2vw, 16px)' }}>
                    Enter a company name to begin competitive intelligence analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CompanySearchCard onAnalyze={handleAnalyze} />
                </CardContent>
              </Card>

              {/* Features Overview */}
              <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card style={{ backgroundColor: '#1a1a1a', borderColor: '#262626', borderRadius: '12px' }}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: '#facc1520', border: '1px solid #facc15' }}
                      >
                        <Brain className="w-5 h-5" style={{ color: '#facc15' }} />
                      </div>
                      <h3 className="font-semibold" style={{ color: '#f9f9f9' }}>
                        Deep Research
                      </h3>
                    </div>
                    <p className="text-sm" style={{ color: '#a1a1aa' }}>
                      Multi-agent AI system analyzes competitors across 100+ data sources
                    </p>
                  </CardContent>
                </Card>

                <Card style={{ backgroundColor: '#1a1a1a', borderColor: '#262626', borderRadius: '12px' }}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: '#facc1520', border: '1px solid #facc15' }}
                      >
                        <GitCompare className="w-5 h-5" style={{ color: '#facc15' }} />
                      </div>
                      <h3 className="font-semibold" style={{ color: '#f9f9f9' }}>
                        Side-by-Side
                      </h3>
                    </div>
                    <p className="text-sm" style={{ color: '#a1a1aa' }}>
                      Compare multiple companies with detailed metrics and insights
                    </p>
                  </CardContent>
                </Card>

                <Card style={{ backgroundColor: '#1a1a1a', borderColor: '#262626', borderRadius: '12px' }}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: '#facc1520', border: '1px solid #facc15' }}
                      >
                        <Sparkles className="w-5 h-5" style={{ color: '#facc15' }} />
                      </div>
                      <h3 className="font-semibold" style={{ color: '#f9f9f9' }}>
                        Instant Reports
                      </h3>
                    </div>
                    <p className="text-sm" style={{ color: '#a1a1aa' }}>
                      Executive-ready reports generated in under 2 minutes
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {currentView === 'dashboard' && analysisData && (
            <div className="h-full w-full overflow-auto" style={{ backgroundColor: '#0a0a0a' }}>
              <DashboardRedesigned
                company={analysisData}
                analysisMode={analysisData.analysisMode}
                onBack={() => setCurrentView('search')}
                onCompare={handleCompareCompanies}
                hideHeader={true}
              />
            </div>
          )}

          {currentView === 'compare' && (
            <div className="h-full w-full overflow-auto" style={{ backgroundColor: '#0a0a0a' }}>
              <CompanyComparison
                onBack={() => setCurrentView('search')}
                initialCompany1={comparisonData.company1}
                initialCompany2={comparisonData.company2}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

