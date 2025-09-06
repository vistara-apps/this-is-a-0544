import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProjects } from '../contexts/ProjectContext'
import { 
  ArrowLeft,
  ExternalLink,
  Github,
  Globe,
  Activity,
  Settings,
  Calendar,
  GitBranch
} from 'lucide-react'

const ProjectDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { projects, deployments, deployProject } = useProjects()
  
  const project = projects.find(p => p.projectId === id)
  const projectDeployments = deployments.filter(d => d.projectId === id)

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white">Project not found</h2>
        <p className="text-gray-400 mt-2">The project you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/app/projects')} className="btn-primary mt-4">
          Back to Projects
        </button>
      </div>
    )
  }

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

  const handleDeploy = (environment = 'production') => {
    deployProject(project.projectId, environment)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/app/projects')}
          className="p-2 hover:bg-gray-700 rounded-md"
        >
          <ArrowLeft className="h-5 w-5 text-gray-400" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white">{project.appName}</h1>
          <p className="text-gray-400 mt-1">Project details and deployment history</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleDeploy('staging')}
            className="btn-outline"
          >
            Deploy to Staging
          </button>
          <button
            onClick={() => handleDeploy('production')}
            className="btn-primary"
            disabled={project.deploymentStatus === 'building'}
          >
            <Activity className="mr-2 h-4 w-4" />
            {project.deploymentStatus === 'building' ? 'Deploying...' : 'Deploy to Production'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Repository
                </label>
                <div className="flex items-center space-x-2">
                  <Github className="h-4 w-4 text-gray-400" />
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 truncate"
                  >
                    {project.repoUrl}
                  </a>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Cloud Provider
                </label>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <span className="text-white capitalize">{project.cloudProvider}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Status
                </label>
                <div className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium ${getStatusBg(project.deploymentStatus)} ${getStatusColor(project.deploymentStatus)}`}>
                  <Activity className="mr-1 h-3 w-3" />
                  {project.deploymentStatus}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Created
                </label>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-white">{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Deployments History */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Deployment History</h2>
            <div className="space-y-4">
              {projectDeployments.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No deployments yet</p>
              ) : (
                projectDeployments.map((deployment) => (
                  <div key={deployment.deploymentId} className="flex items-center justify-between p-4 rounded-lg bg-dark-bg border border-gray-700">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${getStatusBg(deployment.status)}`}>
                        <GitBranch className={`h-4 w-4 ${getStatusColor(deployment.status)}`} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-white">{deployment.environmentType}</p>
                          <span className="text-xs text-gray-400">#{deployment.commitHash}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <ExternalLink className="h-3 w-3 text-gray-400" />
                          <a
                            href={deployment.deploymentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:text-primary/80"
                          >
                            {deployment.deploymentUrl}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium capitalize ${getStatusColor(deployment.status)}`}>
                        {deployment.status}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(deployment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full btn-outline text-left">
                <Settings className="mr-2 h-4 w-4" />
                Project Settings
              </button>
              <button className="w-full btn-outline text-left">
                <Github className="mr-2 h-4 w-4" />
                View Repository
              </button>
              <button className="w-full btn-outline text-left">
                <Activity className="mr-2 h-4 w-4" />
                View Metrics
              </button>
            </div>
          </div>

          {/* Environment URLs */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Environment URLs</h3>
            <div className="space-y-3">
              {projectDeployments
                .filter(d => d.status === 'success')
                .map((deployment) => (
                  <div key={deployment.deploymentId}>
                    <label className="block text-sm font-medium text-gray-400 mb-1 capitalize">
                      {deployment.environmentType}
                    </label>
                    <a
                      href={deployment.deploymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 p-2 rounded-md bg-dark-bg border border-gray-700 hover:border-gray-600 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-primary hover:text-primary/80 truncate">
                        {deployment.deploymentUrl}
                      </span>
                    </a>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetail