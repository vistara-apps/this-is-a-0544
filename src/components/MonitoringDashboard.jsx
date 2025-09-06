import React, { useState, useEffect } from 'react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts'
import {
  Activity,
  Cpu,
  HardDrive,
  Network,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Zap,
  Server,
  Globe
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import scalingService from '../services/scalingService'

const MonitoringDashboard = ({ deploymentId, deployment }) => {
  const [metrics, setMetrics] = useState({
    cpu: [],
    memory: [],
    network: [],
    requests: [],
    responseTime: [],
    errors: []
  })
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    networkIO: 0,
    requestRate: 0,
    avgResponseTime: 0,
    errorRate: 0,
    uptime: 100,
    activeConnections: 0
  })
  const [scalingHistory, setScalingHistory] = useState([])
  const [autoScalingEnabled, setAutoScalingEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('1h')

  useEffect(() => {
    loadMetrics()
    loadScalingHistory()
    checkAutoScalingStatus()
    
    // Set up real-time updates
    const interval = setInterval(loadRealTimeMetrics, 30000) // Every 30 seconds
    
    return () => clearInterval(interval)
  }, [deploymentId, timeRange])

  const loadMetrics = async () => {
    setLoading(true)
    try {
      // Generate mock historical data
      const now = Date.now()
      const points = timeRange === '1h' ? 60 : timeRange === '24h' ? 144 : 720
      const interval = timeRange === '1h' ? 60000 : timeRange === '24h' ? 600000 : 3600000

      const generateMetricData = (baseValue, variance = 20) => {
        return Array.from({ length: points }, (_, i) => ({
          timestamp: new Date(now - (points - i) * interval).toISOString(),
          value: Math.max(0, Math.min(100, baseValue + (Math.random() - 0.5) * variance))
        }))
      }

      setMetrics({
        cpu: generateMetricData(45, 30),
        memory: generateMetricData(60, 25),
        network: generateMetricData(30, 40),
        requests: generateMetricData(150, 100).map(d => ({ ...d, value: Math.floor(d.value) })),
        responseTime: generateMetricData(200, 150).map(d => ({ ...d, value: Math.floor(d.value) })),
        errors: generateMetricData(2, 3).map(d => ({ ...d, value: Math.max(0, Math.floor(d.value)) }))
      })
    } catch (error) {
      console.error('Failed to load metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadRealTimeMetrics = async () => {
    try {
      // In a real app, this would fetch from the API
      setRealTimeMetrics({
        cpuUsage: Math.floor(Math.random() * 40) + 30,
        memoryUsage: Math.floor(Math.random() * 30) + 50,
        networkIO: Math.floor(Math.random() * 50) + 20,
        requestRate: Math.floor(Math.random() * 100) + 50,
        avgResponseTime: Math.floor(Math.random() * 200) + 150,
        errorRate: Math.random() * 2,
        uptime: 99.9,
        activeConnections: Math.floor(Math.random() * 500) + 100
      })
    } catch (error) {
      console.error('Failed to load real-time metrics:', error)
    }
  }

  const loadScalingHistory = async () => {
    try {
      const history = await scalingService.getScalingHistory(deploymentId, { limit: 10 })
      setScalingHistory(history)
    } catch (error) {
      console.error('Failed to load scaling history:', error)
    }
  }

  const checkAutoScalingStatus = () => {
    const config = scalingService.getScalingConfig(deploymentId)
    setAutoScalingEnabled(!!config)
  }

  const toggleAutoScaling = async () => {
    try {
      if (autoScalingEnabled) {
        scalingService.stopAutoScaling(deploymentId)
        setAutoScalingEnabled(false)
      } else {
        await scalingService.startAutoScaling(deploymentId, {
          minInstances: 1,
          maxInstances: 5,
          targetCpuUtilization: 70,
          targetMemoryUtilization: 80
        })
        setAutoScalingEnabled(true)
      }
    } catch (error) {
      console.error('Failed to toggle auto-scaling:', error)
    }
  }

  const getStatusColor = (value, thresholds) => {
    if (value >= thresholds.danger) return 'text-red-500'
    if (value >= thresholds.warning) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getStatusIcon = (value, thresholds) => {
    if (value >= thresholds.danger) return AlertTriangle
    if (value >= thresholds.warning) return Clock
    return CheckCircle
  }

  const MetricCard = ({ title, value, unit, icon: Icon, thresholds, trend }) => {
    const StatusIcon = getStatusIcon(value, thresholds)
    const statusColor = getStatusColor(value, thresholds)
    
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted">{title}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold">{value}{unit}</p>
                  <StatusIcon className={`h-4 w-4 ${statusColor}`} />
                </div>
              </div>
            </div>
            {trend && (
              <div className={`flex items-center space-x-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trend > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span className="text-sm">{Math.abs(trend)}%</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted">Loading metrics...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Monitoring Dashboard</h2>
          <p className="text-muted">Real-time metrics for {deployment?.appName}</p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-muted/20 rounded-md bg-surface"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
          <Button
            variant={autoScalingEnabled ? 'destructive' : 'primary'}
            onClick={toggleAutoScaling}
          >
            {autoScalingEnabled ? 'Disable Auto-Scaling' : 'Enable Auto-Scaling'}
          </Button>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="CPU Usage"
          value={realTimeMetrics.cpuUsage}
          unit="%"
          icon={Cpu}
          thresholds={{ warning: 70, danger: 90 }}
          trend={2.5}
        />
        <MetricCard
          title="Memory Usage"
          value={realTimeMetrics.memoryUsage}
          unit="%"
          icon={HardDrive}
          thresholds={{ warning: 80, danger: 95 }}
          trend={-1.2}
        />
        <MetricCard
          title="Network I/O"
          value={realTimeMetrics.networkIO}
          unit=" MB/s"
          icon={Network}
          thresholds={{ warning: 80, danger: 95 }}
          trend={5.1}
        />
        <MetricCard
          title="Response Time"
          value={realTimeMetrics.avgResponseTime}
          unit="ms"
          icon={Clock}
          thresholds={{ warning: 500, danger: 1000 }}
          trend={-3.8}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU & Memory Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Resource Usage</CardTitle>
            <CardDescription>CPU and Memory utilization over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.cpu.map((cpu, i) => ({
                time: new Date(cpu.timestamp).toLocaleTimeString(),
                cpu: cpu.value,
                memory: metrics.memory[i]?.value || 0
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="cpu" stroke="#3b82f6" name="CPU %" />
                <Line type="monotone" dataKey="memory" stroke="#10b981" name="Memory %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Request Rate Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Request Rate</CardTitle>
            <CardDescription>Requests per minute</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={metrics.requests.map(req => ({
                time: new Date(req.timestamp).toLocaleTimeString(),
                requests: req.value
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="requests" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Response Time Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Response Time</CardTitle>
            <CardDescription>Average response time in milliseconds</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.responseTime.map(rt => ({
                time: new Date(rt.timestamp).toLocaleTimeString(),
                responseTime: rt.value
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="responseTime" stroke="#f59e0b" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Error Rate Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Error Rate</CardTitle>
            <CardDescription>Errors per minute</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.errors.map(err => ({
                time: new Date(err.timestamp).toLocaleTimeString(),
                errors: err.value
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="errors" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Scaling History */}
      {scalingHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Scaling Events</CardTitle>
            <CardDescription>Automatic and manual scaling activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scalingHistory.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-muted/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      event.action === 'scale_up' ? 'bg-green-500/20' : 
                      event.action === 'scale_down' ? 'bg-blue-500/20' : 'bg-gray-500/20'
                    }`}>
                      {event.action === 'scale_up' ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : event.action === 'scale_down' ? (
                        <TrendingDown className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Server className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        Scaled {event.action === 'scale_up' ? 'up' : event.action === 'scale_down' ? 'down' : ''} 
                        from {event.fromInstances} to {event.toInstances} instances
                      </p>
                      <p className="text-sm text-muted">{event.reason}</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted">
                    {new Date(event.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Uptime</p>
                <p className="text-sm text-muted">{realTimeMetrics.uptime}%</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Activity className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Active Connections</p>
                <p className="text-sm text-muted">{realTimeMetrics.activeConnections}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Zap className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="font-medium">Auto-Scaling</p>
                <p className="text-sm text-muted">{autoScalingEnabled ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MonitoringDashboard
