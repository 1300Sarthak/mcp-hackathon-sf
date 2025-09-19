import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

interface CompanySearchCardProps {
  onAnalyze: (opts: { company: string; url?: string; section: string }) => void
}

const exampleCompanies = ['Apple', 'Google', 'Microsoft', 'Amazon', 'Tesla', 'Netflix']

const sections = [
  'All',
  'Finance',
  'HR', 
  'Product',
  'Sales',
  'Marketing',
  'Operations',
  'Legal',
  'IT',
  'Executive'
]

export default function CompanySearchCard({ onAnalyze }: CompanySearchCardProps) {
  const [company, setCompany] = useState('')
  const [url, setUrl] = useState('')
  const [section, setSection] = useState('All')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (company.trim()) {
      onAnalyze({
        company: company.trim(),
        url: url.trim() || undefined,
        section
      })
    }
  }

  const handleExampleClick = (exampleCompany: string) => {
    setCompany(exampleCompany)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && company.trim()) {
      handleSubmit(e)
    }
  }

  return (
    <Card 
      className="w-full max-w-2xl mx-auto border"
      style={{
        backgroundColor: '#1a1a1a',
        borderColor: '#262626',
        borderRadius: '12px',
        boxShadow: '0 0 12px rgba(0,0,0,0.6)'
      }}
    >
      <CardContent 
        className="space-y-6"
        style={{ padding: '32px' }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Input */}
          <div className="space-y-2">
            <Label 
              htmlFor="company" 
              className="text-sm font-medium"
              style={{ 
                fontSize: '14px', 
                fontWeight: 400,
                color: '#f9f9f9',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Company
            </Label>
            <div className="relative">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" 
                style={{ color: '#a1a1aa' }}
                aria-hidden="true"
              />
              <Input
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter company name"
                className="pl-10 h-12 text-base border focus:ring-2"
                style={{
                  backgroundColor: '#0a0a0a',
                  borderColor: '#262626',
                  borderRadius: '12px',
                  fontSize: '16px',
                  padding: '8px 16px 8px 40px',
                  color: '#f9f9f9',
                  fontFamily: 'Inter, sans-serif'
                }}
                required
              />
            </div>
          </div>

          {/* Company URL Input */}
          <div className="space-y-2">
            <Label 
              htmlFor="url" 
              className="text-sm font-medium"
              style={{ 
                fontSize: '14px', 
                fontWeight: 400,
                color: '#f9f9f9',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Company URL (optional)
            </Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://company.com"
              className="h-12 text-base border focus:ring-2"
              style={{
                backgroundColor: '#0a0a0a',
                borderColor: '#262626',
                borderRadius: '12px',
                fontSize: '16px',
                padding: '8px 16px',
                color: '#f9f9f9',
                fontFamily: 'Inter, sans-serif'
              }}
            />
          </div>

          {/* Section Select */}
          <div className="space-y-2">
            <Label 
              htmlFor="section" 
              className="text-sm font-medium"
              style={{ 
                fontSize: '14px', 
                fontWeight: 400,
                color: '#f9f9f9',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Section
            </Label>
            <Select value={section} onValueChange={setSection}>
              <SelectTrigger 
                className="h-12 text-base border focus:ring-2"
                style={{
                  backgroundColor: '#0a0a0a',
                  borderColor: '#262626',
                  borderRadius: '12px',
                  fontSize: '16px',
                  padding: '8px 16px',
                  color: '#f9f9f9',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <SelectValue placeholder="Select a section" />
              </SelectTrigger>
              <SelectContent 
                style={{ 
                  backgroundColor: '#1a1a1a',
                  borderColor: '#262626',
                  borderRadius: '12px'
                }}
              >
                {sections.map((sectionOption) => (
                  <SelectItem 
                    key={sectionOption} 
                    value={sectionOption}
                    style={{
                      color: '#f9f9f9',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    {sectionOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Example Companies */}
          <div className="space-y-3">
            <Label 
              className="text-sm font-medium"
              style={{
                fontSize: '14px',
                fontWeight: 400,
                color: '#a1a1aa',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Quick examples
            </Label>
            <div className="flex flex-wrap gap-2">
              {exampleCompanies.map((example) => (
                <Badge
                  key={example}
                  variant="secondary"
                  className="cursor-pointer transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: '#111111',
                    color: '#f9f9f9',
                    borderColor: '#262626',
                    borderRadius: '9999px',
                    padding: '4px 12px',
                    fontSize: '14px',
                    fontWeight: 400,
                    fontFamily: 'Inter, sans-serif',
                    border: '1px solid #262626'
                  }}
                  onClick={() => handleExampleClick(example)}
                >
                  {example}
                </Badge>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!company.trim()}
            className="w-full h-12 text-base font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
            style={{
              backgroundColor: '#facc15',
              color: '#0a0a0a',
              borderRadius: '9999px',
              padding: '8px 16px',
              fontSize: '16px',
              fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 2px 8px rgba(250,204,21,0.4)',
              letterSpacing: 'tight'
            }}
          >
            Analyze Company
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
