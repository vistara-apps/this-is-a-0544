import React, { useState } from 'react'
import { useProjects } from '../contexts/ProjectContext'
import { 
  Filter,
  Search,
  ExternalLink,
  GitBranch,
  Calendar,
  Activity
} from 'lucide-react'

const Deployments = () => {
  const { projects, deployments } = useProjects()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

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

  const filteredDeployments = deployments
    .filter(deployment => {
      const project = projects.find(p => p.projectId === deployment.projectId)
      const matchesSearch = project?.appName.toLowerCase().includes(search.toLowerCase()) ||
                           deployment.environmentType.toLowerCase().includes(search.toLowerCase())
      const matchesFilter = filter === 'all' || deployment.status === filter
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const filters = [
    { value: 'all', label: 'All Deployments' },
    { value: 'success', label: 'Successful' },
    { value: 'building', label: 'Building' },
    { value: 'failed', label: 'Failed' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Deployments</h1>
        <p className="text-gray-400 mt-2">Monitor all your deployment activities</p>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search deployments..."
                className="input pl-10 w-64"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input w-auto"
            >
              {filters.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Deployments List */}
      <div className="space-y-4">
        {filteredDeployments.length === 0 ? (
          <div className="card p-12 text-center">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No deployments found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredDeployments.map((deployment) => {
            const project = projects.find(p => p.projectId === deployment.projectId)
            return (
              <div key={deployment.deploymentId} className="card p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${getStatusBg(deployment.status)}`}>
                      <GitBranch className={`h-5 w-5 ${getStatusColor(deployment.status)}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                        <h3 className="text-lg font-semibold text-white">{project?.appName}</h3>
                        <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getStatusBg(deployment.status)} ${getStatusColor(deployment.status)} mt-1 sm:mt-0`}>
                          {deployment.status}
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 mt-2 text-sm text-gray-400">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Environment:</span>
                          <span className="capitalize">{deployment.environmentType}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Commit:</span>
                          <span className="font-mono">#{deployment.commitHash}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(deployment.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      {deployment.deploymentUrl && (
                        <div className="flex items-center space-x-2 mt-2">
                          <ExternalLink className="h-4 w-4 text-gray-400" />
                          <a
                            href={deployment.deploymentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 text-sm truncate"
                          >
                            {deployment.deploymentUrl}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {deployment.deploymentUrl && (
                      <a
                        href={deployment.deploymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Visit
                      </a>
                    )}
                    
                    <button className="btn-ghost">
                      View Logs
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Deployments