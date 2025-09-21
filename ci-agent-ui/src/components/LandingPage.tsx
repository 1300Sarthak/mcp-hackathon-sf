import { useState } from 'react'
import CompanySearchCard from './CompanySearchCard'
import CompetitorDiscoveryChat from './CompetitorDiscoveryChat'
import Footer from './Footer'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Search, Compass, BarChart3 } from 'lucide-react'

interface LandingPageProps {
  onAnalyze: (opts: { company: string; url?: string; section: string }) => void
  onCompare: () => void
}

export default function LandingPage({ onAnalyze, onCompare }: LandingPageProps) {
  const [mode, setMode] = useState<'analyze' | 'discover'>('analyze')

  return (
    <div 
      className="h-screen overflow-hidden"
      style={{ 
        backgroundColor: '#0a0a0a',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* Navigation */}
      <nav 
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
        style={{ 
          backgroundColor: 'rgba(10, 10, 10, 0.8)',
          borderColor: '#262626'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
                <h1 
                className="text-xl font-bold"
                style={{ 
                  fontSize: '18px', 
                  fontWeight: 700, 
                  color: '#f9f9f9',
                  fontFamily: 'Inter, sans-serif',
                  textShadow: '0 0 10px #facc15, 0 0 20px #facc15, 0 0 30px #facc15'
                }}
              >
                <span style={{ color: '#facc15' }}>I</span>nfo-Ninja
              </h1>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                onClick={onCompare}
                className="font-medium transition-all duration-200 hover:brightness-110 hover:scale-105"
                style={{
                  backgroundColor: 'transparent',
                  color: '#f9f9f9',
                  border: '1px solid #262626',
                  borderRadius: '9999px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Compare Companies
              </Button>
              <Button
                className="font-bold transition-all duration-200 hover:brightness-110 hover:scale-105"
                style={{
                  backgroundColor: '#facc15',
                  color: '#0a0a0a',
                  borderRadius: '9999px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(250,204,21,0.4)'
                }}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-16 h-full overflow-hidden">
        <section 
          className="px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative h-full overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 100%)'
          }}
        >
          {/* Subtle pattern overlay */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #facc15 1px, transparent 0)',
              backgroundSize: '20px 20px'
            }}
          />
          
          <div className="max-w-4xl mx-auto text-center relative">
            {/* Badge/Label */}
            <Badge 
              className="mb-6 text-sm font-medium"
              style={{
                backgroundColor: '#111111',
                color: '#facc15',
                border: '1px solid #262626',
                borderRadius: '9999px',
                padding: '4px 12px',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              🚀 AI-Powered Intelligence Platform
            </Badge>

            {/* Giant Headline */}
            <h1 
              className="font-bold mb-6 leading-tight"
              style={{
                fontSize: '64px',
                fontWeight: 700,
                color: '#f9f9f9',
                lineHeight: 1.4,
                fontFamily: 'Inter, sans-serif',
                letterSpacing: 'tight',
                marginBottom: '32px'
              }}
            >
              Transform Competitive Research with{' '}
              <span style={{ color: '#facc15' }}>AI Agents</span>
            </h1>

            {/* Muted Subtitle */}
            <p 
              className="text-xl mb-8 max-w-2xl mx-auto"
              style={{
                fontSize: '18px',
                fontWeight: 400,
                color: '#a1a1aa',
                lineHeight: 1.4,
                marginBottom: '32px'
              }}
            >
              Get comprehensive competitive intelligence in minutes, not weeks. Our multi-agent AI system 
              researches, analyzes, and delivers executive-ready insights automatically.
            </p>

            {/* Mode Toggle */}
            <div className="flex justify-center mb-8">
              <div className="flex rounded-full p-1" style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626' }}>
                <button
                  onClick={() => setMode('analyze')}
                  className={`px-6 py-3 text-sm font-medium rounded-full transition-all flex items-center space-x-2 ${
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
                  onClick={() => setMode('discover')}
                  className={`px-6 py-3 text-sm font-medium rounded-full transition-all flex items-center space-x-2 ${
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

            {/* Dynamic Interface */}
            <div className="mb-8">
              {mode === 'analyze' ? (
                <CompanySearchCard onAnalyze={onAnalyze} />
              ) : (
                <CompetitorDiscoveryChat onAnalyze={onAnalyze} />
              )}
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
