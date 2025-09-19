import { useState } from 'react'
import { Star, ChevronDown } from 'lucide-react'
import CompanySearchCard from './CompanySearchCard'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

interface LandingPageProps {
  onAnalyze: (opts: { company: string; url?: string; section: string }) => void
}

const testimonials = [
  {
    name: "Sarah Chen",
    role: "VP of Strategy",
    company: "TechCorp",
    avatar: "SC",
    rating: 5,
    quote: "This platform transformed our competitive research process. What used to take weeks now takes minutes."
  },
  {
    name: "Marcus Rodriguez",
    role: "Market Research Lead", 
    company: "InnovateLab",
    avatar: "MR",
    rating: 5,
    quote: "The AI-powered insights are incredibly accurate. It's like having a team of analysts at your fingertips."
  },
  {
    name: "Emily Watson",
    role: "Business Intelligence",
    company: "DataFlow",
    avatar: "EW", 
    rating: 5,
    quote: "Game-changing tool for competitive intelligence. The depth of analysis is remarkable."
  }
]

const features = [
  {
    label: "Multi-Agent Analysis",
    description: "AI agents work together to gather, analyze, and synthesize competitive intelligence",
    shortcut: "⚡"
  },
  {
    label: "Real-Time Insights", 
    description: "Live streaming updates as our agents research and compile your competitive report",
    shortcut: "🔄"
  },
  {
    label: "Enterprise Data",
    description: "Powered by Bright Data's enterprise web scraping for comprehensive market coverage",
    shortcut: "🌐"
  },
  {
    label: "Strategic Reports",
    description: "Executive-ready SWOT analysis, threat assessment, and actionable recommendations",
    shortcut: "📊"
  }
]

const faqs = [
  {
    question: "How accurate is the competitive intelligence?",
    answer: "Our multi-agent system uses enterprise-grade data sources and advanced AI models to ensure high accuracy. Each report is cross-validated by multiple agents."
  },
  {
    question: "What types of companies can I analyze?",
    answer: "You can analyze any publicly available company across all industries. Our system works best with companies that have a significant online presence."
  },
  {
    question: "How long does an analysis take?",
    answer: "Most analyses complete within 2-5 minutes. Complex enterprise analyses may take up to 10 minutes for comprehensive coverage."
  },
  {
    question: "Can I export the reports?",
    answer: "Yes, all reports can be exported in multiple formats including PDF, Word, and structured data formats for further analysis."
  }
]

export default function LandingPage({ onAnalyze }: LandingPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div 
      className="min-h-screen"
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
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                CompanyIntel
              </h1>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a 
                href="#features" 
                className="transition-colors duration-200 hover:brightness-110"
                style={{ 
                  fontSize: '16px', 
                  fontWeight: 400,
                  color: '#a1a1aa'
                }}
              >
                Features
              </a>
              <a 
                href="#testimonials" 
                className="transition-colors duration-200 hover:brightness-110"
                style={{ 
                  fontSize: '16px', 
                  fontWeight: 400,
                  color: '#a1a1aa'
                }}
              >
                Testimonials
              </a>
              <a 
                href="#faq" 
                className="transition-colors duration-200 hover:brightness-110"
                style={{ 
                  fontSize: '16px', 
                  fontWeight: 400,
                  color: '#a1a1aa'
                }}
              >
                FAQ
              </a>
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
      <main className="pt-16">
        <section 
          className="px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative overflow-hidden"
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
              className="text-xl mb-12 max-w-2xl mx-auto"
              style={{
                fontSize: '18px',
                fontWeight: 400,
                color: '#a1a1aa',
                lineHeight: 1.4,
                marginBottom: '64px'
              }}
            >
              Get comprehensive competitive intelligence in minutes, not weeks. Our multi-agent AI system 
              researches, analyzes, and delivers executive-ready insights automatically.
            </p>

            {/* Search Card */}
            <div className="mb-16">
              <CompanySearchCard onAnalyze={onAnalyze} />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section 
          id="testimonials" 
          className="px-4 sm:px-6 lg:px-8 py-20"
          style={{ backgroundColor: '#111111' }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 
                className="font-bold mb-4"
                style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: '#f9f9f9',
                  marginBottom: '16px'
                }}
              >
                Trusted by Research Teams
              </h2>
              <p 
                style={{
                  fontSize: '18px',
                  fontWeight: 400,
                  color: '#a1a1aa'
                }}
              >
                See what industry leaders are saying about our platform
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="border transition-all duration-200 hover:shadow-lg"
                  style={{
                    backgroundColor: '#1a1a1a',
                    borderColor: '#262626',
                    borderRadius: '12px',
                    boxShadow: '0 0 12px rgba(0,0,0,0.6)'
                  }}
                >
                  <CardContent style={{ padding: '32px' }}>
                    {/* Stars */}
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="h-4 w-4 fill-current" 
                          style={{ color: '#facc15' }}
                        />
                      ))}
                    </div>
                    
                    {/* Quote */}
                    <blockquote 
                      className="text-lg mb-6 italic"
                      style={{
                        fontSize: '16px',
                        fontWeight: 400,
                        color: '#f9f9f9',
                        marginBottom: '24px',
                        fontStyle: 'italic',
                        lineHeight: 1.4
                      }}
                    >
                      "{testimonial.quote}"
                    </blockquote>
                    
                    {/* Avatar and info */}
                    <div className="flex items-center">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                        style={{
                          backgroundColor: '#facc15',
                          color: '#0a0a0a',
                          fontWeight: 700
                        }}
                      >
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p 
                          className="font-semibold"
                          style={{ 
                            fontSize: '14px', 
                            fontWeight: 600, 
                            color: '#f9f9f9' 
                          }}
                        >
                          {testimonial.name}
                        </p>
                        <p 
                          style={{ 
                            fontSize: '12px', 
                            fontWeight: 400, 
                            color: '#a1a1aa' 
                          }}
                        >
                          {testimonial.role}, {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 
                className="font-bold mb-4"
                style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: '#f9f9f9',
                  marginBottom: '16px'
                }}
              >
                Powerful Features
              </h2>
              <p 
                style={{
                  fontSize: '18px',
                  fontWeight: 400,
                  color: '#a1a1aa'
                }}
              >
                Everything you need for comprehensive competitive analysis
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-6 border rounded-lg transition-all duration-200 hover:shadow-lg"
                  style={{
                    backgroundColor: '#1a1a1a',
                    borderColor: '#262626',
                    borderRadius: '12px'
                  }}
                >
                  <div 
                    className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                    style={{
                      backgroundColor: '#facc15',
                      color: '#0a0a0a',
                      borderRadius: '6px'
                    }}
                  >
                    {feature.shortcut}
                  </div>
                  <div>
                    <h3 
                      className="font-bold mb-2"
                      style={{
                        fontSize: '18px',
                        fontWeight: 700,
                        color: '#f9f9f9',
                        marginBottom: '8px'
                      }}
                    >
                      {feature.label}
                    </h3>
                    <p 
                      style={{
                        fontSize: '16px',
                        fontWeight: 400,
                        color: '#a1a1aa',
                        lineHeight: 1.4
                      }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section 
          id="faq" 
          className="px-4 sm:px-6 lg:px-8 py-20"
          style={{ backgroundColor: '#111111' }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 
                className="font-bold mb-4"
                style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: '#f9f9f9',
                  marginBottom: '16px'
                }}
              >
                Frequently Asked Questions
              </h2>
              <p 
                style={{
                  fontSize: '18px',
                  fontWeight: 400,
                  color: '#a1a1aa'
                }}
              >
                Get answers to common questions about our platform
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card
                  key={index}
                  className="border transition-all duration-200"
                  style={{
                    backgroundColor: '#1a1a1a',
                    borderColor: openFaq === index ? '#facc15' : '#262626',
                    borderRadius: '12px'
                  }}
                >
                  <CardContent style={{ padding: '0' }}>
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full text-left p-6 flex justify-between items-center transition-colors duration-200"
                    >
                      <h3 
                        className="font-semibold"
                        style={{
                          fontSize: '16px',
                          fontWeight: 600,
                          color: '#f9f9f9'
                        }}
                      >
                        {faq.question}
                      </h3>
                      <ChevronDown 
                        className={`h-5 w-5 transition-transform duration-200 ${
                          openFaq === index ? 'transform rotate-180' : ''
                        }`}
                        style={{ color: '#a1a1aa' }}
                      />
                    </button>
                    {openFaq === index && (
                      <div 
                        className="px-6 pb-6 transition-all duration-200"
                        style={{
                          fontSize: '14px',
                          fontWeight: 400,
                          color: '#a1a1aa',
                          lineHeight: 1.4
                        }}
                      >
                        {faq.answer}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer 
          className="px-4 sm:px-6 lg:px-8 py-12 border-t"
          style={{ 
            backgroundColor: '#0a0a0a', 
            borderColor: '#262626' 
          }}
        >
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-8">
              <a 
                href="#privacy" 
                className="transition-colors duration-200 hover:brightness-110"
                style={{ 
                  fontSize: '14px', 
                  fontWeight: 400,
                  color: '#a1a1aa'
                }}
              >
                Privacy Policy
              </a>
              <a 
                href="#terms" 
                className="transition-colors duration-200 hover:brightness-110"
                style={{ 
                  fontSize: '14px', 
                  fontWeight: 400,
                  color: '#a1a1aa'
                }}
              >
                Terms of Service
              </a>
              <a 
                href="#contact" 
                className="transition-colors duration-200 hover:brightness-110"
                style={{ 
                  fontSize: '14px', 
                  fontWeight: 400,
                  color: '#a1a1aa'
                }}
              >
                Contact
              </a>
            </div>
            <p 
              style={{ 
                fontSize: '14px', 
                fontWeight: 400,
                color: '#a1a1aa'
              }}
            >
              © 2024 CompanyIntel. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}
