import React, { useState } from 'react'
import { useProjects } from '../contexts/ProjectContext'
import { X, Github, Globe, Server } from 'lucide-react'

const CreateProjectModal = ({ isOpen, onClose }) => {
  const { createProject } = useProjects()
  const [formData, setFormData] = useState({
    appName: '',
    repoUrl: '',
    cloudProvider: 'vercel',
    branch: 'main',
    buildCommand: 'npm run build',
    startCommand: 'npm start'
  })

  const cloudProviders = [
    { id: 'vercel', name: 'Vercel', icon: Globe },
    { id: 'aws', name: 'AWS', icon: Server },
    { id: 'netlify', name: 'Netlify', icon: Globe },
    { id: 'digital-ocean', name: 'DigitalOcean', icon: Server }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    createProject(formData)
    setFormData({
      appName: '',
      repoUrl: '',
      cloudProvider: 'vercel',
      branch: 'main',
      buildCommand: 'npm run build',
      startCommand: 'npm start'
    })
    onClose()
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      
      <div className="relative bg-dark-surface rounded-lg border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Create New Project</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-md"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              App Name
            </label>
            <input
              type="text"
              value={formData.appName}
              onChange={(e) => handleChange('appName', e.target.value)}
              className="input"
              placeholder="My Awesome App"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Repository URL
            </label>
            <div className="relative">
              <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="url"
                value={formData.repoUrl}
                onChange={(e) => handleChange('repoUrl', e.target.value)}
                className="input pl-10"
                placeholder="https://github.com/username/repository"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cloud Provider
            </label>
            <div className="grid grid-cols-2 gap-3">
              {cloudProviders.map((provider) => (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => handleChange('cloudProvider', provider.id)}
                  className={`
                    p-3 rounded-lg border-2 transition-colors flex items-center space-x-3
                    ${formData.cloudProvider === provider.id
                      ? 'border-primary bg-primary/10 text-white'
                      : 'border-gray-600 hover:border-gray-500 text-gray-300'
                    }
                  `}
                >
                  <provider.icon className="h-5 w-5" />
                  <span className="font-medium">{provider.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Branch
              </label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => handleChange('branch', e.target.value)}
                className="input"
                placeholder="main"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Build Command
              </label>
              <input
                type="text"
                value={formData.buildCommand}
                onChange={(e) => handleChange('buildCommand', e.target.value)}
                className="input"
                placeholder="npm run build"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Start Command
            </label>
            <input
              type="text"
              value={formData.startCommand}
              onChange={(e) => handleChange('startCommand', e.target.value)}
              className="input"
              placeholder="npm start"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProjectModal