import { useState } from 'react'
import LandingPage from './components/LandingPage'
import DashboardRedesigned from './components/DashboardRedesigned'
import CompanyComparison from './components/CompanyComparison'
import { AnalysisMode } from './components/AnalysisModeToggle'

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'comparison'>('landing')
  const [analysisData, setAnalysisData] = useState<{
    company: string
    url?: string
    section: string
    analysisMode?: AnalysisMode
  } | null>(null)

  const handleAnalyze = (opts: { company: string; url?: string; section: string; analysisMode?: AnalysisMode }) => {
    console.log('Analysis requested:', opts)
    setAnalysisData(opts)
    setCurrentView('dashboard')
  }

  const handleBackToLanding = () => {
    setCurrentView('landing')
    setAnalysisData(null)
  }

  const handleCompareCompanies = () => {
    setCurrentView('comparison')
  }

  if (currentView === 'dashboard' && analysisData) {
    return (
      <DashboardRedesigned
        company={analysisData.company}
        jobId={`job_${Date.now()}`}
        analysisMode={analysisData.analysisMode}
        onBack={handleBackToLanding}
        onCompare={handleCompareCompanies}
      />
    )
  }

  if (currentView === 'comparison') {
    return (
      <CompanyComparison
        onBack={handleBackToLanding}
        initialCompany1={analysisData?.company}
      />
    )
  }

  return <LandingPage onAnalyze={handleAnalyze} />
}

export default App
