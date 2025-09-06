import React, { useState, useEffect } from 'react'
import { useProjects } from '../contexts/ProjectContext'
import { X, Github, Globe, Server, Sparkles, Loader2, GitBranch, Settings, Rocket } from 'lucide-react'
import githubService from '../services/githubService'
import cloudProviderService from '../services/cloudProviderService'
import aiService from '../services/aiService'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'

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
  const [aiConfig, setAiConfig] = useState(null)
  const [loadingAiConfig, setLoadingAiConfig] = useState(false)
  const [repositories, setRepositories] = useState([])
  const [loadingRepos, setLoadingRepos] = useState(false)
  const [step, setStep] = useState(1) // 1: Repository, 2: Configuration, 3: Review

  const cloudProviders = cloudProviderService.getProviders()

  // Generate AI configuration when repository URL changes
  useEffect(() => {
    if (formData.repoUrl && formData.repoUrl.includes('github.com')) {
      generateAiConfiguration()
    }
  }, [formData.repoUrl])

  const generateAiConfiguration = async () => {
    setLoadingAiConfig(true)
    try {
      // Extract repo info from URL
      const repoMatch = formData.repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
      if (!repoMatch) return

      const [, owner, repo] = repoMatch
      
      // Mock repository analysis (in real app, this would fetch from GitHub API)
      const repoInfo = {
        name: repo,
        owner,
        description: 'Sample repository',
        language: 'JavaScript',
        size: 1024,
        hasPackageJson: true,
        hasDockerfile: false,
        mainFiles: ['package.json', 'src/index.js', 'public/index.html']
      }

      const config = await aiService.generateDeploymentConfig(repoInfo)
      setAiConfig(config)
      
      // Auto-fill form with AI suggestions
      setFormData(prev => ({
        ...prev,
        cloudProvider: config.provider,
        buildCommand: config.buildCommand,
        startCommand: config.startCommand,
        appName: prev.appName || repo
      }))
    } catch (error) {
      console.error('Failed to generate AI configuration:', error)
    } finally {
      setLoadingAiConfig(false)
    }
  }

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
