import { useState } from 'react'
import LandingPage from './components/LandingPage'
import CompetitiveIntelligenceForm from './components/CompetitiveIntelligenceForm'
import CompanyComparison from './components/CompanyComparison'

type AppMode = 'landing' | 'analysis' | 'comparison'

function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('landing')
  const [analysisData, setAnalysisData] = useState<{
    company: string
    url?: string
    section: string
  } | null>(null)

  const handleAnalyze = (opts: { company: string; url?: string; section: string }) => {
    console.log('Analysis requested:', opts)
    setAnalysisData(opts)
    setCurrentMode('analysis')
  }

  const handleCompare = () => {
    setCurrentMode('comparison')
  }

  const handleBackToLanding = () => {
    setCurrentMode('landing')
    setAnalysisData(null)
  }

  if (currentMode === 'analysis' && analysisData) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
        {/* Back Button */}
        <div className="p-4">
          <button
            onClick={handleBackToLanding}
            className="text-sm px-4 py-2 rounded-full border transition-colors duration-200 hover:bg-gray-800"
            style={{
              color: '#f9f9f9',
              borderColor: '#262626',
              backgroundColor: 'transparent'
            }}
          >
            ← Back to Search
          </button>
        </div>
        
        {/* Pass the analysis data to the existing form component */}
        <CompetitiveIntelligenceForm 
          initialCompany={analysisData.company}
          initialUrl={analysisData.url}
        />
      </div>
    )
  }

  if (currentMode === 'comparison') {
    return <CompanyComparison onBack={handleBackToLanding} />
  }

  return <LandingPage onAnalyze={handleAnalyze} onCompare={handleCompare} />
}

export default App
