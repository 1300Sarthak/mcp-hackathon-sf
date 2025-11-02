import { useState, useEffect } from 'react'
import MarketingLandingPage from './components/MarketingLandingPage'
import SignInPage from './components/SignInPage'
import LandingPage from './components/LandingPage'
import SidebarDashboard from './components/SidebarDashboard'
import { type AnalysisMode } from './components/AnalysisModeToggle'
import { getRemainingCredits, useCredit } from './utils/credits'
import { Badge } from './components/ui/badge'
import { AlertCircle } from 'lucide-react'

type UserMode = 'none' | 'guest' | 'authenticated'

function App() {
  const [userMode, setUserMode] = useState<UserMode>('none')
  const [currentView, setCurrentView] = useState<'marketing' | 'signin' | 'search' | 'dashboard'>('marketing')
  const [credits, setCredits] = useState(10)
  const [analysisData, setAnalysisData] = useState<{
    company: string
    url?: string
    section: string
    analysisMode?: AnalysisMode
  } | null>(null)

  useEffect(() => {
    // Check if user is already logged in
    const savedMode = localStorage.getItem('info_ninja_user_mode')
    if (savedMode === 'guest') {
      setUserMode('guest')
      setCurrentView('search')
      setCredits(getRemainingCredits())
    } else if (savedMode === 'authenticated') {
      setUserMode('authenticated')
      setCurrentView('search')
    }
  }, [])

  const handleMarketingGetStarted = () => {
    setCurrentView('signin')
  }

  const handleSignIn = (mode: 'google' | 'guest') => {
    if (mode === 'guest') {
      setUserMode('guest')
      localStorage.setItem('info_ninja_user_mode', 'guest')
      setCredits(getRemainingCredits())
      setCurrentView('search')
    } else {
      // Google OAuth - for now, treat as authenticated with unlimited credits
      setUserMode('authenticated')
      localStorage.setItem('info_ninja_user_mode', 'authenticated')
      setCurrentView('search')
    }
  }
  
  const handleBackToMarketing = () => {
    setCurrentView('marketing')
    setUserMode('none')
    localStorage.removeItem('info_ninja_user_mode')
    setAnalysisData(null)
  }

  const handleAnalyze = (opts: { company: string; url?: string; section: string; analysisMode?: AnalysisMode }) => {
    // Check credits for guest users
    if (userMode === 'guest') {
      if (!useCredit()) {
        alert('You\'ve used all your free credits for today! Come back tomorrow for 10 more free credits, or sign up for unlimited access.')
        return
      }
      setCredits(getRemainingCredits())
    }
    
    console.log('Analysis requested:', opts)
    setAnalysisData(opts)
    setCurrentView('dashboard')
  }

  const handleCompareCompanies = (company1?: string, company2?: string, section?: string) => {
    // Check credits for guest users
    if (userMode === 'guest') {
      if (!useCredit()) {
        alert('You\'ve used all your free credits for today! Come back tomorrow for 10 more free credits, or sign up for unlimited access.')
        return
      }
      setCredits(getRemainingCredits())
    }
    
    console.log('Comparison requested:', company1, company2, section)
    // Trigger dashboard with comparison mode
    setAnalysisData({
      company: company1 || '',
      url: '',
      section: section || 'All',
      analysisMode: 'simple'
    })
    setCurrentView('dashboard')
  }

  // Marketing landing page (first page)
  if (currentView === 'marketing') {
    return <MarketingLandingPage onGetStarted={handleMarketingGetStarted} />
  }

  // Sign in page (OAuth + Guest)
  if (currentView === 'signin') {
    return <SignInPage onBack={handleBackToMarketing} onSignIn={handleSignIn} />
  }

  // Credit indicator for guest users
  const CreditIndicator = () => {
    if (userMode !== 'guest') return null
    
    return (
      <div className="fixed top-20 right-4 z-50">
        <Badge 
          className="text-sm font-medium shadow-lg"
          style={{
            backgroundColor: credits <= 2 ? '#ef4444' : '#facc15',
            color: '#0a0a0a',
            borderRadius: '9999px',
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: 600,
            border: 'none'
          }}
        >
          {credits <= 2 && <AlertCircle className="w-4 h-4 mr-2 inline" />}
          {credits} {credits === 1 ? 'credit' : 'credits'} remaining
        </Badge>
      </div>
    )
  }

  // Dashboard view with sidebar (after search)
  if (currentView === 'dashboard') {
    return (
      <>
        <CreditIndicator />
        <SidebarDashboard 
          onBack={handleBackToMarketing}
          initialView={analysisData ? 'dashboard' : 'search'}
          initialAnalysisData={analysisData || undefined}
        />
      </>
    )
  }

  // Main search page (LandingPage with 3 modes: Analyze/Discover/Compare)
  return (
    <>
      <CreditIndicator />
      <LandingPage 
        onAnalyze={handleAnalyze}
        onCompare={handleCompareCompanies}
        onBackToMarketing={handleBackToMarketing}
      />
    </>
  )
}

export default App