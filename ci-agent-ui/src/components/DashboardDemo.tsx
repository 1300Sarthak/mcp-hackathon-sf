import React from 'react'
import CompetitiveDashboard from './CompetitiveDashboard'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

const sampleData = {
  competitor: "Netflix",
  competitive_metrics: {
    threat_level: 4,
    market_position: 9,
    innovation: 8,
    financial_strength: 8,
    brand_recognition: 10
  },
  swot_scores: {
    strengths: 9,
    weaknesses: 4,
    opportunities: 7,
    threats: 6
  }
}

export default function DashboardDemo() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>📊 Dashboard Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            This is how your competitive intelligence data will be visualized with interactive charts and metrics.
          </p>
          <CompetitiveDashboard data={sampleData} />
        </CardContent>
      </Card>
    </div>
  )
}
