'use client'

import { useState } from 'react'
import { 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  PieChart, 
  AlertTriangle,
  Shield,
  Heart,
  Clock,
  Filter,
  Download,
  Eye,
  ChevronRight,
  Zap
} from 'lucide-react'

// Mock data for patterns
const mockPatterns = {
  frequencyData: [
    { month: 'Jan', incidents: 3, safety: 4.2 },
    { month: 'Feb', incidents: 5, safety: 3.8 },
    { month: 'Mar', incidents: 2, safety: 5.1 },
    { month: 'Apr', incidents: 7, safety: 3.2 },
    { month: 'May', incidents: 4, safety: 4.5 },
    { month: 'Jun', incidents: 1, safety: 6.8 }
  ],
  behaviorTypes: [
    { type: 'Gaslighting', count: 12, percentage: 35, trend: 'increasing' },
    { type: 'Silent Treatment', count: 8, percentage: 24, trend: 'stable' },
    { type: 'Blame Shifting', count: 6, percentage: 18, trend: 'decreasing' },
    { type: 'Love Bombing', count: 4, percentage: 12, trend: 'stable' },
    { type: 'Triangulation', count: 4, percentage: 11, trend: 'increasing' }
  ],
  timePatterns: [
    { time: 'Morning', count: 3, percentage: 15 },
    { time: 'Afternoon', count: 8, percentage: 40 },
    { time: 'Evening', count: 7, percentage: 35 },
    { time: 'Night', count: 2, percentage: 10 }
  ],
  triggers: [
    { trigger: 'Work stress discussions', count: 8, severity: 'high' },
    { trigger: 'Social events planning', count: 6, severity: 'medium' },
    { trigger: 'Financial conversations', count: 5, severity: 'high' },
    { trigger: 'Family interactions', count: 4, severity: 'medium' }
  ]
}

export default function PatternsContent() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months')
  const [selectedView, setSelectedView] = useState('overview')

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-red-500" />
      case 'decreasing':
        return <TrendingUp className="w-4 h-4 text-green-500 rotate-180" />
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-indigo-600" />
            Pattern Analysis
          </h1>
          <p className="text-gray-600 mt-2">
            Identify patterns in your experiences to better understand and prepare for situations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 inline-flex">
        {['overview', 'detailed'].map((view) => (
          <button
            key={view}
            onClick={() => setSelectedView(view)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedView === view
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {view === 'overview' ? 'Overview' : 'Detailed Analysis'}
          </button>
        ))}
      </div>

      {selectedView === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Frequency Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Incident Frequency</h3>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Frequency chart would be displayed here</p>
              </div>
            </div>
          </div>

          {/* Behavior Types */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Behavior Types</h3>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {mockPatterns.behaviorTypes.map((behavior, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getTrendIcon(behavior.trend)}
                      <span className="font-medium text-gray-900">{behavior.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{behavior.count} incidents</span>
                    <span className="text-sm font-medium text-gray-900">{behavior.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time Patterns */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Time Patterns</h3>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {mockPatterns.timePatterns.map((pattern, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{pattern.time}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: `${pattern.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12">{pattern.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Common Triggers */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Common Triggers</h3>
              <AlertTriangle className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {mockPatterns.triggers.map((trigger, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">{trigger.trigger}</span>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(trigger.severity)}`}>
                      {trigger.severity}
                    </span>
                    <span className="text-sm text-gray-600">{trigger.count}x</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Analysis</h3>
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-2">Key Insights</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Incidents tend to increase during stressful periods (work discussions)</li>
                <li>• Afternoon and evening show highest activity</li>
                <li>• Gaslighting incidents are trending upward - consider additional safety measures</li>
                <li>• Silent treatment episodes are stable but frequent</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-2">Protective Factors</h4>
              <p className="text-gray-600">
                Your safety ratings improve significantly when you limit discussions about work stress and 
                family interactions. Consider maintaining boundaries around these topics, continue strategies 
                that have been working, and consider adding them to your safety plan.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
