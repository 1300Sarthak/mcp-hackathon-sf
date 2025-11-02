import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Card, CardContent } from './ui/card'
import { 
  Search, 
  Compass, 
  GitCompare, 
  Zap, 
  Brain, 
  TrendingUp, 
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Users,
  BarChart3,
  X,
  Gift
} from 'lucide-react'

interface MarketingLandingPageProps {
  onGetStarted: () => void
}

// Animated feature showcase component
const FeatureShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const showcases = [
    {
      title: "Real-Time Analysis",
      description: "Watch AI agents work in parallel",
      status: "Processing",
      progress: 75
    },
    {
      title: "Deep Research",
      description: "Gathering data from 100+ sources",
      status: "Syncing",
      progress: 45
    },
    {
      title: "Strategic Insights",
      description: "Generating executive report",
      status: "Analyzing",
      progress: 90
    }
  ]
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % showcases.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])
  
  const current = showcases[currentIndex]
  
  return (
    <div 
      className="relative overflow-hidden rounded-xl border"
      style={{
        backgroundColor: '#111111',
        borderColor: '#262626',
        padding: '24px',
        minHeight: '200px'
      }}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#f9f9f9' }}>
            {current.title}
          </h3>
          <Badge 
            style={{
              backgroundColor: '#facc1520',
              color: '#facc15',
              border: '1px solid #facc15',
              borderRadius: '6px',
              padding: '4px 12px'
            }}
          >
            {current.status}
          </Badge>
        </div>
        <p style={{ fontSize: '14px', color: '#a1a1aa' }}>
          {current.description}
        </p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span style={{ color: '#a1a1aa' }}>Progress</span>
            <span style={{ color: '#facc15', fontWeight: 600 }}>{current.progress}%</span>
          </div>
          <div 
            className="h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: '#262626' }}
          >
            <div 
              className="h-full transition-all duration-1000 ease-out"
              style={{
                backgroundColor: '#facc15',
                width: `${current.progress}%`
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {showcases.map((_, idx) => (
          <div
            key={idx}
            className="transition-all duration-300"
            style={{
              width: idx === currentIndex ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: idx === currentIndex ? '#facc15' : '#262626'
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default function MarketingLandingPage({ onGetStarted }: MarketingLandingPageProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [floatingIndex, setFloatingIndex] = useState(0)

  useEffect(() => {
    setIsVisible(true)
  }, [])
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFloatingIndex((prev) => prev + 1)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Deep Competitor Analysis",
      description: "AI agents research and analyze competitors across multiple dimensions in minutes"
    },
    {
      icon: <Compass className="w-6 h-6" />,
      title: "Discover Hidden Competitors",
      description: "Find competitors you didn't know existed using AI-powered market research"
    },
    {
      icon: <GitCompare className="w-6 h-6" />,
      title: "Side-by-Side Comparison",
      description: "Compare multiple companies with detailed metrics and strategic insights"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Multi-Agent Intelligence",
      description: "Specialized AI agents work together for comprehensive competitive intelligence"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Executive-Ready Reports",
      description: "Get polished, actionable insights formatted for decision-makers"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-Time Research",
      description: "Live data gathering from multiple sources for up-to-date intelligence"
    }
  ]

  const stats = [
    { number: "< 2 min", label: "Average Analysis Time", icon: <Clock className="w-5 h-5" /> },
    { number: "100+", label: "Data Sources", icon: <BarChart3 className="w-5 h-5" /> },
    { number: "24/7", label: "AI Agents Working", icon: <Brain className="w-5 h-5" /> },
  ]
  
  // Floating elements for animations
  const floatingElements = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: i * 0.5,
    duration: 15 + (i % 5) * 2,
    x: (i % 5) * 20,
    y: Math.floor(i / 5) * 25
  }))

  return (
    <div 
      className="min-h-screen w-full overflow-x-hidden"
      style={{ 
        backgroundColor: '#0a0a0a',
        fontFamily: 'Inter, sans-serif',
        color: '#f9f9f9'
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
                  textShadow: '0 0 10px #facc15, 0 0 20px #facc15, 0 0 30px #facc15'
                }}
              >
                <span style={{ color: '#facc15' }}>I</span>nfo-Ninja
              </h1>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => onGetStarted('guest')}
                variant="ghost"
                className="hidden sm:flex transition-all duration-200 hover:brightness-110"
                style={{
                  color: '#f9f9f9',
                  backgroundColor: 'transparent',
                  borderRadius: '9999px'
                }}
              >
                Try as Guest
              </Button>
              <Button
                onClick={() => onGetStarted('signup')}
                className="font-bold transition-all duration-200 hover:brightness-110 hover:scale-105"
                style={{
                  backgroundColor: '#facc15',
                  color: '#0a0a0a',
                  borderRadius: '9999px',
                  padding: '8px 20px',
                  fontSize: '14px',
                  fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(250,204,21,0.4)'
                }}
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated floating grid */}
        <div className="absolute inset-0 overflow-hidden">
          {floatingElements.map((el) => (
            <div
              key={el.id}
              className="absolute w-px h-px rounded-full"
              style={{
                left: `${el.x}%`,
                top: `${el.y}%`,
                backgroundColor: '#facc15',
                opacity: 0.3,
                animation: `float ${el.duration}s ease-in-out infinite`,
                animationDelay: `${el.delay}s`,
                boxShadow: '0 0 10px #facc15'
              }}
            />
          ))}
        </div>
        
        {/* Gradient orbs */}
        <div 
          className="absolute top-40 left-20 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #facc15 0%, transparent 70%)',
            animation: 'pulse 8s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute bottom-40 right-20 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #facc15 0%, transparent 70%)',
            animation: 'pulse 10s ease-in-out infinite reverse'
          }}
        />
        
        {/* Scan line effect */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(to bottom, transparent 50%, #facc15 50%)',
            backgroundSize: '100% 4px',
            animation: 'scan 3s linear infinite'
          }}
        />

        <div className="max-w-6xl mx-auto text-center relative z-10">

          {/* Main Headline */}
          <h1 
            className={`font-bold mb-6 leading-tight transition-all duration-1000 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{
              fontSize: 'clamp(40px, 8vw, 72px)',
              fontWeight: 700,
              color: '#f9f9f9',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '24px'
            }}
          >
            Competitive Intelligence,
            <br />
            <span style={{ color: '#facc15' }}>Powered by AI Agents</span>
          </h1>

          {/* Subheadline */}
          <p 
            className={`text-xl mb-10 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{
              fontSize: '20px',
              fontWeight: 400,
              color: '#a1a1aa',
              lineHeight: 1.6
            }}
          >
            Stop spending weeks on competitive research. Our multi-agent AI system delivers 
            executive-ready competitive intelligence in minutes, not months.
          </p>

          {/* CTA Button */}
          <div 
            className={`flex justify-center mb-16 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Button
              onClick={onGetStarted}
              className="w-full sm:w-auto font-bold transition-all duration-200 hover:brightness-110 hover:scale-105 group"
              style={{
                backgroundColor: '#facc15',
                color: '#0a0a0a',
                borderRadius: '12px',
                padding: '16px 48px',
                fontSize: '18px',
                fontWeight: 700,
                boxShadow: '0 4px 16px rgba(250,204,21,0.4)',
                border: '1px solid #facc15'
              }}
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Stats */}
          <div 
            className={`grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="flex flex-col items-center p-6 rounded-xl border"
                style={{
                  backgroundColor: '#111111',
                  borderColor: '#262626',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#facc15'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#262626'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ color: '#facc15', marginBottom: '8px' }}>
                  {stat.icon}
                </div>
                <div 
                  className="font-bold mb-1"
                  style={{ fontSize: '32px', color: '#f9f9f9' }}
                >
                  {stat.number}
                </div>
                <div style={{ fontSize: '14px', color: '#a1a1aa' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Sliding Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Left side - Animated showcase */}
            <div className="order-2 lg:order-1">
              <FeatureShowcase />
            </div>
            
            {/* Right side - Text */}
            <div className="order-1 lg:order-2">
              <h2 
                className="font-bold mb-6"
                style={{
                  fontSize: '42px',
                  fontWeight: 700,
                  color: '#f9f9f9',
                  lineHeight: 1.2
                }}
              >
                Everything you need for
                <br />
                <span style={{ color: '#facc15' }}>competitive intelligence</span>
              </h2>
              <p 
                className="mb-8"
                style={{
                  fontSize: '18px',
                  color: '#a1a1aa',
                  lineHeight: 1.6
                }}
              >
                Powered by specialized AI agents that research, analyze, and synthesize 
                competitive insights automatically. Watch in real-time as our system delivers 
                enterprise-grade intelligence.
              </p>
              
              {/* Mini feature list */}
              <div className="space-y-4">
                {[
                  "Multi-agent orchestration",
                  "Real-time data synthesis",
                  "Executive-ready reports"
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-3"
                  >
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#facc1520' }}
                    >
                      <CheckCircle className="w-4 h-4" style={{ color: '#facc15' }} />
                    </div>
                    <span style={{ color: '#f9f9f9', fontSize: '16px' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border transition-all duration-300 hover:scale-105 group"
                style={{
                  backgroundColor: '#111111',
                  borderColor: '#262626',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#facc15'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(250,204,21,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#262626'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <CardContent className="p-6">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: '#facc1520',
                      color: '#facc15',
                      border: '1px solid #facc1530'
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h3 
                    className="font-semibold mb-2"
                    style={{
                      fontSize: '16px',
                      color: '#f9f9f9'
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#a1a1aa', lineHeight: 1.6 }}>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 
              className="font-bold mb-4"
              style={{
                fontSize: '42px',
                fontWeight: 700,
                color: '#f9f9f9'
              }}
            >
              How it works
            </h2>
            <p style={{ fontSize: '18px', color: '#a1a1aa' }}>
              Get competitive insights in three simple steps
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Enter Competitor Info",
                description: "Simply provide a company name or URL. Our AI agents start gathering data immediately."
              },
              {
                step: "02",
                title: "AI Agents Research",
                description: "Multiple specialized agents work in parallel, analyzing web presence, market position, and competitive strategies."
              },
              {
                step: "03",
                title: "Get Executive Report",
                description: "Receive a comprehensive, actionable report with insights, metrics, and strategic recommendations."
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="flex items-start gap-6 p-6 rounded-xl border transition-all duration-300"
                style={{
                  backgroundColor: '#111111',
                  borderColor: '#262626'
                }}
              >
                <div 
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold"
                  style={{
                    backgroundColor: '#facc15',
                    color: '#0a0a0a',
                    fontSize: '18px'
                  }}
                >
                  {item.step}
                </div>
                <div>
                  <h3 
                    className="font-semibold mb-2"
                    style={{ fontSize: '20px', color: '#f9f9f9' }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '16px', color: '#a1a1aa', lineHeight: 1.6 }}>
                    {item.description}
                  </p>
                </div>
                <CheckCircle 
                  className="flex-shrink-0 w-6 h-6"
                  style={{ color: '#22c55e' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div 
          className="max-w-4xl mx-auto text-center p-12 rounded-2xl border"
          style={{
            backgroundColor: '#111111',
            borderColor: '#262626',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #facc15 1px, transparent 0)',
              backgroundSize: '30px 30px'
            }}
          />
          <div className="relative z-10">
            <h2 
              className="font-bold mb-4"
              style={{
                fontSize: '36px',
                fontWeight: 700,
                color: '#f9f9f9'
              }}
            >
              Ready to transform your competitive research?
            </h2>
            <p 
              className="mb-8"
              style={{
                fontSize: '18px',
                color: '#a1a1aa',
                maxWidth: '600px',
                margin: '0 auto 32px'
              }}
            >
              Start with 10 free credits today. No credit card required for guest access.
            </p>
            <div className="flex justify-center">
              <Button
                onClick={onGetStarted}
                className="w-full sm:w-auto font-bold transition-all duration-200 hover:brightness-110 hover:scale-105 group"
                style={{
                  backgroundColor: '#facc15',
                  color: '#0a0a0a',
                  borderRadius: '12px',
                  padding: '16px 48px',
                  fontSize: '18px',
                  fontWeight: 700,
                  boxShadow: '0 4px 16px rgba(250,204,21,0.4)',
                  border: '1px solid #facc15'
                }}
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="border-t py-8 px-4 sm:px-6 lg:px-8"
        style={{ borderColor: '#262626' }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <p style={{ fontSize: '14px', color: '#a1a1aa' }}>
            © 2025 Info-Ninja. Built with AI agents for the modern business.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.15;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-15px) translateX(5px);
          }
        }
        
        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
        
      `}</style>
    </div>
  )
}

