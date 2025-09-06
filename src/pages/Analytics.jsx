import React, { useState, useEffect } from 'react'
import { useProjects } from '../contexts/ProjectContext'
import aiService from '../services/aiService'
import { 
  TrendingUp, 
  TrendingDown,
  Activity,
  Users,
  Clock,
  DollarSign,
  Server,
  Zap,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  PieChart
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d')
  const [optimizations, setOptimizations] = useState([])
  const [loadingOptimizations, setLoadingOptimizations] = useState(false)
  const { projects, deployments } = useProjects()

  // Load cost optimizations on component mount
  useEffect(() => {
    loadCostOptimizations()
  }, [])

  const loadCostOptimizations = async () => {
    setLoadingOptimizations(true)
    try {
      // Mock deployment data for AI analysis
      const deploymentData = {
        provider: 'vercel',
        instanceType: 'hobby',
        monthlyCost: 24.50,
        cpuUsage: 25,
        memoryUsage: 35,
        monthlyTraffic: 124800,
        storageUsage: 2.5,
        avgResponseTime: 180,
        uptime: 99.9,
        errorRate: 0.1
      }

      const recommendations = await aiService.generateCostOptimizations(deploymentData)
      setOptimizations(recommendations)
    } catch (error) {
      console.error('Failed to load optimizations:', error)
    } finally {
      setLoadingOptimizations(false)
    }
  }

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

      {/* AI-Powered Cost Optimization */}
      <Card className="bg-dark-bg border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-6 w-6 text-accent" />
              <CardTitle className="text-white">AI Cost Optimization</CardTitle>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadCostOptimizations}
              loading={loadingOptimizations}
            >
              Refresh Analysis
            </Button>
          </div>
          <CardDescription className="text-gray-400">
            AI-powered recommendations to reduce your cloud costs while maintaining performance
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {loadingOptimizations ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
              <span className="ml-3 text-gray-400">Analyzing your deployment...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {optimizations.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-accent mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">All Optimized!</h3>
                  <p className="text-gray-400">Your deployment is already well-optimized for cost efficiency.</p>
                </div>
              ) : (
                optimizations.map((optimization) => (
                  <Card key={optimization.id} className="bg-gray-800 border-gray-600">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className={`p-1 rounded-full ${
                              optimization.priority === 'high' ? 'bg-red-500/20' :
                              optimization.priority === 'medium' ? 'bg-yellow-500/20' :
                              'bg-green-500/20'
                            }`}>
                              {optimization.priority === 'high' ? (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              ) : optimization.priority === 'medium' ? (
                                <Clock className="h-4 w-4 text-yellow-500" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <h3 className="text-lg font-semibold text-white">{optimization.title}</h3>
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                              optimization.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                              optimization.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {optimization.priority.toUpperCase()} PRIORITY
                            </span>
                          </div>
                          
                          <p className="text-gray-400 mb-3">{optimization.description}</p>
                          
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4 text-accent" />
                              <span className="text-accent font-semibold">{optimization.estimatedSavings}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <BarChart3 className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-400 text-sm">{optimization.category}</span>
                            </div>
                          </div>
                          
                          {optimization.implementationSteps && optimization.implementationSteps.length > 0 && (
                            <details className="mt-3">
                              <summary className="text-sm text-gray-400 cursor-pointer hover:text-white">
                                Implementation Steps
                              </summary>
                              <ul className="mt-2 space-y-1 text-sm text-gray-500">
                                {optimization.implementationSteps.map((step, index) => (
                                  <li key={index} className="flex items-center space-x-2">
                                    <ArrowRight className="h-3 w-3" />
                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ul>
                            </details>
                          )}
                        </div>
                        
                        <div className="ml-4">
                          <Button size="sm" className="whitespace-nowrap">
                            Apply Fix
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Analytics
