import React, { useState } from 'react'
import { 
  TrendingUp, 
  TrendingDown,
  Activity,
  Users,
  Clock,
  DollarSign,
  Server,
  Zap
} from 'lucide-react'

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d')

  const metrics = [
    {
      name: 'Total Requests',
      value: '124.8K',
      change: '+12.5%',
      changeType: 'positive',
      icon: Activity
    },
    {
      name: 'Unique Visitors',
      value: '8.2K',
      change: '+8.1%',
      changeType: 'positive',
      icon: Users
    },
    {
      name: 'Avg Response Time',
      value: '142ms',
      change: '-5.2%',
      changeType: 'positive',
      icon: Clock
    },
    {
      name: 'Monthly Cost',
      value: '$24.50',
      change: '-8.3%',
      changeType: 'positive',
      icon: DollarSign
    }
  ]

  const costOptimizations = [
    {
      title: 'Optimize Instance Size',
      description: 'Your CPU usage is consistently below 30%. Consider downsizing your instance.',
      savings: '$12.40/month',
      impact: 'Low Risk'
    },
    {
      title: 'Use Reserved Instances',
      description: 'Switch to reserved instances for predictable workloads to save costs.',
      savings: '$8.60/month',
      impact: 'No Risk'
    },
    {
      title: 'Auto-scaling Configuration',
      description: 'Enable auto-scaling to handle traffic spikes more efficiently.',
      savings: '$15.20/month',
      impact: 'Medium Risk'
    }
  ]

  const timeRanges = [
    { value: '24h', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400 mt-2">Performance metrics and cost optimization insights</p>
        </div>
        
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="input w-auto mt-4 sm:mt-0"
        >
          {timeRanges.map(range => (
            <option key={range.value} value={range.value}>{range.label}</option>
          ))}
        </select>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.name} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">{metric.name}</p>
                <p className="text-3xl font-bold text-white mt-2">{metric.value}</p>
              </div>
              <div className="p-3 bg-primary/20 rounded-lg">
                <metric.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {metric.changeType === 'positive' ? (
                <TrendingUp className="h-4 w-4 text-accent mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                metric.changeType === 'positive' ? 'text-accent' : 'text-red-500'
              }`}>
                {metric.change}
              </span>
              <span className="text-sm text-gray-400 ml-2">vs last period</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Performance Overview</h2>
          
          {/* Mock chart */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Response Time</span>
              <span className="text-white">142ms avg</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-accent h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Uptime</span>
              <span className="text-white">99.9%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '99%' }}></div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Error Rate</span>
              <span className="text-white">0.1%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: '1%' }}></div>
            </div>
          </div>
        </div>

        {/* Resource Usage */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Resource Usage</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Server className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-400">CPU Usage</span>
                </div>
                <span className="text-sm text-white">28%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Memory Usage</span>
                </div>
                <span className="text-sm text-white">64%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-accent h-2 rounded-full" style={{ width: '64%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Network I/O</span>
                </div>
                <span className="text-sm text-white">42%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Optimization */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Cost Optimization Recommendations</h2>
        
        <div className="space-y-4">
          {costOptimizations.map((optimization, index) => (
            <div key={index} className="p-4 rounded-lg bg-dark-bg border border-gray-700">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <DollarSign className="h-5 w-5 text-accent" />
                    <h3 className="text-lg font-semibold text-white">{optimization.title}</h3>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      optimization.impact === 'No Risk' ? 'bg-accent/20 text-accent' :
                      optimization.impact === 'Low Risk' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-red-500/20 text-red-500'
                    }`}>
                      {optimization.impact}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-2">{optimization.description}</p>
                  <p className="text-accent font-semibold">Potential savings: {optimization.savings}</p>
                </div>
                
                <div className="mt-4 lg:mt-0 lg:ml-6">
                  <button className="btn-primary">
                    Apply Optimization
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Analytics