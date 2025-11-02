import { Card, CardContent } from './ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricsCardProps {
  title: string
  value: string | number
  change?: number
  trend?: 'up' | 'down'
  subtitle?: string
  icon?: React.ReactNode
}

export default function MetricsCard({ title, value, change, trend, subtitle, icon }: MetricsCardProps) {
  const isPositive = trend === 'up' || (change && change > 0)
  
  return (
    <Card 
      className="border transition-all duration-300 hover:scale-105"
      style={{
        backgroundColor: '#111111',
        borderColor: '#262626',
        borderRadius: '12px',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#facc15'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(250,204,21,0.2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#262626'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <p style={{ fontSize: '14px', color: '#a1a1aa', fontWeight: 500 }}>
            {title}
          </p>
          {icon && (
            <div style={{ color: '#facc15' }}>
              {icon}
            </div>
          )}
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <p 
              className="font-bold"
              style={{ fontSize: '32px', color: '#f9f9f9', lineHeight: 1 }}
            >
              {value}
            </p>
            {subtitle && (
              <p style={{ fontSize: '12px', color: '#71717a', marginTop: '4px' }}>
                {subtitle}
              </p>
            )}
          </div>
          
          {change !== undefined && (
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="w-4 h-4" style={{ color: '#22c55e' }} />
              ) : (
                <TrendingDown className="w-4 h-4" style={{ color: '#ef4444' }} />
              )}
              <span 
                style={{ 
                  fontSize: '14px', 
                  fontWeight: 600,
                  color: isPositive ? '#22c55e' : '#ef4444'
                }}
              >
                {isPositive ? '+' : ''}{change}%
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

