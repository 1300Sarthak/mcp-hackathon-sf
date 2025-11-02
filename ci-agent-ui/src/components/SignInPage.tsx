import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { 
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  X,
  Gift,
  Mail,
  User
} from 'lucide-react'

interface SignInPageProps {
  onBack: () => void
  onSignIn: (mode: 'google' | 'guest') => void
}

export default function SignInPage({ onBack, onSignIn }: SignInPageProps) {
  const [showGuestModal, setShowGuestModal] = useState(false)

  const handleGoogleSignIn = () => {
    // TODO: Implement Google OAuth
    onSignIn('google')
  }

  const handleGuestClick = () => {
    setShowGuestModal(true)
  }

  const handleGuestConfirm = () => {
    setShowGuestModal(false)
    onSignIn('guest')
  }

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden"
      style={{ 
        backgroundColor: '#0a0a0a',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* Background effects */}
      <div 
        className="absolute top-20 left-20 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #facc15 0%, transparent 70%)',
          animation: 'pulse 8s ease-in-out infinite'
        }}
      />
      <div 
        className="absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #facc15 0%, transparent 70%)',
          animation: 'pulse 10s ease-in-out infinite reverse'
        }}
      />

      {/* Back button */}
      <Button
        onClick={onBack}
        variant="ghost"
        className="absolute top-6 left-6 transition-all duration-200 hover:brightness-110"
        style={{
          color: '#a1a1aa',
          backgroundColor: 'transparent',
          borderRadius: '12px'
        }}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Main signin card */}
      <Card 
        className="w-full max-w-md border shadow-2xl relative z-10"
        style={{
          backgroundColor: '#0a0a0a',
          borderColor: '#262626',
          borderRadius: '16px'
        }}
      >
        <CardContent className="p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <h1 
              className="text-2xl font-bold mb-2"
              style={{ 
                color: '#f9f9f9',
                textShadow: '0 0 10px #facc15, 0 0 20px #facc15'
              }}
            >
              <span style={{ color: '#facc15' }}>I</span>nfo-Ninja
            </h1>
            <p style={{ fontSize: '16px', color: '#a1a1aa' }}>
              Sign in to continue
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-4">
            {/* Google Sign In */}
            <Button
              onClick={handleGoogleSignIn}
              className="w-full font-medium transition-all duration-200 hover:brightness-110 hover:scale-105 group"
              style={{
                backgroundColor: '#111111',
                color: '#f9f9f9',
                border: '1px solid #262626',
                borderRadius: '12px',
                padding: '14px 24px',
                fontSize: '16px',
                height: 'auto'
              }}
            >
              <div className="flex items-center justify-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Continue with Google</span>
              </div>
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: '#262626' }} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span 
                  className="px-4"
                  style={{ 
                    backgroundColor: '#0a0a0a',
                    color: '#a1a1aa'
                  }}
                >
                  or
                </span>
              </div>
            </div>

            {/* Guest Access */}
            <Button
              onClick={handleGuestClick}
              className="w-full font-medium transition-all duration-200 hover:brightness-110 hover:border-yellow-400 group"
              style={{
                backgroundColor: '#111111',
                color: '#f9f9f9',
                border: '1px solid #262626',
                borderRadius: '12px',
                padding: '14px 24px',
                fontSize: '16px',
                height: 'auto'
              }}
            >
              <div className="flex items-center justify-center gap-3">
                <User className="w-5 h-5" />
                <span>Continue as Guest</span>
              </div>
            </Button>
          </div>

          {/* Info text */}
          <div 
            className="mt-6 p-4 rounded-lg"
            style={{
              backgroundColor: '#111111',
              border: '1px solid #262626'
            }}
          >
            <p 
              className="text-sm text-center"
              style={{ color: '#a1a1aa', lineHeight: 1.6 }}
            >
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>

          {/* Features preview */}
          <div className="mt-6 space-y-3">
            <p className="text-sm font-semibold" style={{ color: '#f9f9f9' }}>
              What you'll get:
            </p>
            {[
              'Real-time competitive intelligence',
              'Multi-agent AI analysis',
              'Executive-ready reports'
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-3"
              >
                <div 
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#facc1520' }}
                >
                  <CheckCircle className="w-3 h-3" style={{ color: '#facc15' }} />
                </div>
                <span className="text-sm" style={{ color: '#a1a1aa' }}>{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Guest Mode Modal */}
      {showGuestModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          onClick={() => setShowGuestModal(false)}
        >
          <div 
            className="relative max-w-md w-full rounded-xl border animate-in"
            style={{
              backgroundColor: '#0a0a0a',
              borderColor: '#262626',
              padding: '32px',
              animation: 'slideUp 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowGuestModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg transition-colors hover:bg-gray-800"
            >
              <X className="w-5 h-5" style={{ color: '#a1a1aa' }} />
            </button>
            
            <div className="text-center mb-6">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  backgroundColor: '#facc1520',
                  border: '2px solid #facc15'
                }}
              >
                <Gift className="w-8 h-8" style={{ color: '#facc15' }} />
              </div>
              <h3 
                className="font-bold mb-2"
                style={{ fontSize: '24px', color: '#f9f9f9' }}
              >
                Welcome, Guest!
              </h3>
              <p style={{ fontSize: '16px', color: '#a1a1aa', lineHeight: 1.6 }}>
                Start exploring with <span style={{ color: '#facc15', fontWeight: 600 }}>10 free credits</span>
              </p>
            </div>
            
            <div 
              className="rounded-lg p-4 mb-6"
              style={{
                backgroundColor: '#111111',
                border: '1px solid #262626'
              }}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#22c55e' }} />
                  <span style={{ fontSize: '14px', color: '#f9f9f9' }}>
                    10 free analyses per day
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#22c55e' }} />
                  <span style={{ fontSize: '14px', color: '#f9f9f9' }}>
                    Credits reset daily at midnight
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#22c55e' }} />
                  <span style={{ fontSize: '14px', color: '#f9f9f9' }}>
                    Full access to all features
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setShowGuestModal(false)}
                className="flex-1 transition-all duration-200"
                style={{
                  backgroundColor: '#111111',
                  color: '#f9f9f9',
                  border: '1px solid #262626',
                  borderRadius: '12px',
                  padding: '12px 24px'
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleGuestConfirm}
                className="flex-1 font-bold transition-all duration-200 hover:brightness-110"
                style={{
                  backgroundColor: '#facc15',
                  color: '#0a0a0a',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontWeight: 700,
                  border: '1px solid #facc15'
                }}
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}

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
        
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

