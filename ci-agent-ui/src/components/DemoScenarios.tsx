import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Globe, Building, Palette, MessageSquare } from 'lucide-react'

interface DemoScenario {
  id: number
  name: string
  website: string
  description: string
  category: string
  icon: React.ComponentType<{ className?: string }>
}

const demoScenarios: DemoScenario[] = [
  {
    id: 1,
    name: "Nvidia",
    website: "https://nvidia.com",
    description: "Leading manufacturer of graphics processing units (GPUs) and AI computing platforms",
    category: "Hardware & Semiconductors",
    icon: Globe
  },
  {
    id: 2,
    name: "Notion",
    website: "https://notion.so",
    description: "All-in-one workspace",
    category: "Productivity",
    icon: Building
  },
  {
    id: 3,
    name: "Figma",
    website: "https://figma.com",
    description: "Collaborative design",
    category: "Design",
    icon: Palette
  },
  {
    id: 4,
    name: "Slack",
    website: "https://slack.com",
    description: "Enterprise communication",
    category: "Communication",
    icon: MessageSquare
  }
]

interface DemoScenariosProps {
  onSelectScenario: (name: string, website: string) => void
}

export default function DemoScenarios({ onSelectScenario }: DemoScenariosProps) {
  return (
    <Card 
      className="border shadow-lg"
      style={{
        backgroundColor: '#1a1a1a',
        borderColor: '#262626',
        borderRadius: '12px'
      }}
    >
      <CardHeader>
        <CardTitle className="text-lg" style={{ color: '#f9f9f9' }}>
          Try Demo Scenarios
        </CardTitle>
        <CardDescription style={{ color: '#a1a1aa' }}>
          Click any scenario below to auto-fill the form and start analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demoScenarios.map((scenario) => {
            const IconComponent = scenario.icon
            return (
              <div
                key={scenario.id}
                className="group border rounded-lg p-4 transition-all cursor-pointer"
                style={{
                  backgroundColor: '#111111',
                  borderColor: '#262626',
                  borderRadius: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#facc15'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#262626'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
                onClick={() => onSelectScenario(scenario.name, scenario.website)}
              >
                <div className="flex items-start space-x-3">
                  <div 
                    className="p-2 rounded-lg transition-colors"
                    style={{ 
                      backgroundColor: '#facc1520',
                      border: '1px solid #facc15'
                    }}
                  >
                    <IconComponent className="h-5 w-5" style={{ color: '#facc15' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 
                        className="font-medium transition-colors"
                        style={{ color: '#f9f9f9' }}
                      >
                        {scenario.name}
                      </h3>
                      <Badge 
                        variant="secondary" 
                        className="text-xs"
                        style={{
                          backgroundColor: '#262626',
                          color: '#a1a1aa',
                          borderRadius: '6px'
                        }}
                      >
                        {scenario.category}
                      </Badge>
                    </div>
                    <p className="text-sm mb-2" style={{ color: '#a1a1aa' }}>
                      {scenario.description}
                    </p>
                    <p className="text-xs truncate" style={{ color: '#71717a' }}>
                      {scenario.website}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div 
          className="mt-4 p-3 rounded-lg"
          style={{
            backgroundColor: '#facc1520',
            border: '1px solid #facc15',
            borderRadius: '8px'
          }}
        >
          <div className="text-sm" style={{ color: '#f9f9f9' }}>
            <strong style={{ color: '#facc15' }}>Tip:</strong> These scenarios demonstrate different types of competitive analysis.
            Each will trigger our multi-agent workflow to research, analyze, and report on the selected company.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}