import LandingPage from './components/LandingPage'

function App() {
  const handleAnalyze = (opts: { company: string; url?: string; section: string }) => {
    console.log('Analysis requested:', opts)
    // TODO: Integrate with existing CompetitiveIntelligenceForm or API
    alert(`Analyzing ${opts.company} in ${opts.section} section${opts.url ? ` (${opts.url})` : ''}`)
  }

  return <LandingPage onAnalyze={handleAnalyze} />
}

export default App
