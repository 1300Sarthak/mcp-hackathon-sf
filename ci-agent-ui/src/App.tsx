import { useState } from 'react'
import LandingPage from './components/LandingPage'
import CompetitiveIntelligenceForm from './components/CompetitiveIntelligenceForm'

function App() {
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [analysisData, setAnalysisData] = useState<{
    company: string
    url?: string
    section: string
  } | null>(null)

  const handleAnalyze = (opts: { company: string; url?: string; section: string }) => {
    console.log('Analysis requested:', opts)
    setAnalysisData(opts)
    setShowAnalysis(true)
  }

  const handleBackToLanding = () => {
    setShowAnalysis(false)
    setAnalysisData(null)
  }

  if (showAnalysis && analysisData) {
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

  return <LandingPage onAnalyze={handleAnalyze} />
}

export default App
