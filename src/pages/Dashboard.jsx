import React from 'react'
import { useProjects } from '../contexts/ProjectContext'
import { 
  Rocket, 
  Clock, 
  TrendingUp, 
  DollarSign,
  Activity,
  Users,
  Server,
  Zap
} from 'lucide-react'

const Dashboard = () => {
  const { projects, deployments } = useProjects()

  const stats = [
    {
      name: 'Total Projects',
      value: projects.length,
      icon: Rocket,
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Active Deployments',
      value: deployments.filter(d => d.status === 'success').length,
      icon: Activity,
      change: '+5%',
      changeType: 'positive'
    },
    {
      name: 'Monthly Cost',
      value: '$24.50',
      icon: DollarSign,
      change: '-8%',
      changeType: 'positive'
    },
    {
      name: 'Uptime',
      value: '99.9%',
      icon: TrendingUp,
      change: '+0.1%',
      changeType: 'positive'
    }
  ]

  const recentDeployments = deployments.slice(0, 5)

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-accent'
      case 'building': return 'text-yellow-500'
      case 'failed': return 'text-red-500'
      default: return 'text-gray-400'
    }
  }

  const getStatusBg = (status) => {
    switch (status) {
      case 'success': return 'bg-accent/20'
      case 'building': return 'bg-yellow-500/20'
      case 'failed': return 'bg-red-500/20'
      default: return 'bg-gray-500/20'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-2">Overview of your deployments and projects</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
              </div>
              <div className="p-3 bg-primary/20 rounded-lg">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-accent' : 'text-red-500'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-400 ml-2">from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Deployments */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Deployments</h2>
            <button className="text-sm text-primary hover:text-primary/80">
              View all
            </button>
          </div>
          
          <div className="space-y-4">
            {recentDeployments.map((deployment) => {
              const project = projects.find(p => p.projectId === deployment.projectId)
              return (
                <div key={deployment.deploymentId} className="flex items-center justify-between p-4 rounded-lg bg-dark-bg border border-gray-700">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${getStatusBg(deployment.status)}`}>
                      <Rocket className={`h-4 w-4 ${getStatusColor(deployment.status)}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{project?.appName}</p>
                      <p className="text-xs text-gray-400">{deployment.environmentType}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium capitalize ${getStatusColor(deployment.status)}`}>
                      {deployment.status}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(deployment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
          
          <div className="space-y-4">
            <button className="w-full p-4 rounded-lg bg-primary hover:bg-primary/90 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <Rocket className="h-5 w-5 text-white" />
                <div>
                  <p className="font-medium text-white">Deploy New Project</p>
                  <p className="text-sm text-white/80">Connect a repository and deploy</p>
                </div>
              </div>
            </button>
            
            <button className="w-full p-4 rounded-lg bg-dark-bg border border-gray-700 hover:bg-gray-700 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <Server className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-white">Manage Environments</p>
                  <p className="text-sm text-gray-400">Configure staging and production</p>
                </div>
              </div>
            </button>
            
            <button className="w-full p-4 rounded-lg bg-dark-bg border border-gray-700 hover:bg-gray-700 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-white">Optimize Costs</p>
                  <p className="text-sm text-gray-400">Review optimization suggestions</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Resource Usage */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Resource Usage</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">CPU Usage</span>
              <span className="text-sm text-white">45%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Memory Usage</span>
              <span className="text-sm text-white">62%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-accent h-2 rounded-full" style={{ width: '62%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Storage Usage</span>
              <span className="text-sm text-white">28%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '28%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard