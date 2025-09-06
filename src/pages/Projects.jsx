import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjects } from '../contexts/ProjectContext'
import { 
  Plus, 
  Github, 
  ExternalLink, 
  Calendar,
  Activity,
  Settings
} from 'lucide-react'
import CreateProjectModal from '../components/CreateProjectModal'

const Projects = () => {
  const { projects, deployProject } = useProjects()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const navigate = useNavigate()

  const getStatusColor = (status) => {
    switch (status) {
      case 'deployed': return 'text-accent'
      case 'building': return 'text-yellow-500'
      case 'failed': return 'text-red-500'
      default: return 'text-gray-400'
    }
  }

  const getStatusBg = (status) => {
    switch (status) {
      case 'deployed': return 'bg-accent/20'
      case 'building': return 'bg-yellow-500/20'
      case 'failed': return 'bg-red-500/20'
      default: return 'bg-gray-500/20'
    }
  }

  const handleDeploy = (projectId) => {
    deployProject(projectId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 mt-2">Manage your deployed applications</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary mt-4 sm:mt-0"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Github className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
          <p className="text-gray-400 mb-6">Get started by connecting your first repository</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.projectId} className="card p-6 hover:border-gray-600 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{project.appName}</h3>
                  <p className="text-sm text-gray-400">{project.cloudProvider}</p>
                </div>
                <div className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusBg(project.deploymentStatus)} ${getStatusColor(project.deploymentStatus)}`}>
                  {project.deploymentStatus}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-400">
                  <Github className="mr-2 h-4 w-4" />
                  <span className="truncate">{project.repoUrl}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-400">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center space-x-2">
                <button
                  onClick={() => navigate(`/app/projects/${project.projectId}`)}
                  className="btn-outline flex-1"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View
                </button>
                
                <button
                  onClick={() => handleDeploy(project.projectId)}
                  className="btn-primary flex-1"
                  disabled={project.deploymentStatus === 'building'}
                >
                  <Activity className="mr-2 h-4 w-4" />
                  {project.deploymentStatus === 'building' ? 'Building...' : 'Deploy'}
                </button>
                
                <button className="btn-ghost p-2">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <CreateProjectModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  )
}

export default Projects