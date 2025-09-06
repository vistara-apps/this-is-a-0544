import React, { createContext, useContext, useState, useEffect } from 'react'

const ProjectContext = createContext()

export const useProjects = () => {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider')
  }
  return context
}

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([])
  const [deployments, setDeployments] = useState([])

  useEffect(() => {
    // Load mock data
    const mockProjects = [
      {
        projectId: '1',
        userId: '1',
        appName: 'My Portfolio',
        repoUrl: 'https://github.com/user/portfolio',
        cloudProvider: 'vercel',
        deploymentStatus: 'deployed',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        projectId: '2',
        userId: '1',
        appName: 'E-commerce App',
        repoUrl: 'https://github.com/user/ecommerce',
        cloudProvider: 'aws',
        deploymentStatus: 'building',
        createdAt: '2024-01-20T14:20:00Z'
      }
    ]

    const mockDeployments = [
      {
        deploymentId: '1',
        projectId: '1',
        environmentType: 'production',
        commitHash: 'abc123',
        deploymentUrl: 'https://portfolio.vercel.app',
        status: 'success',
        createdAt: '2024-01-15T10:35:00Z'
      },
      {
        deploymentId: '2',
        projectId: '1',
        environmentType: 'staging',
        commitHash: 'def456',
        deploymentUrl: 'https://staging-portfolio.vercel.app',
        status: 'success',
        createdAt: '2024-01-14T16:20:00Z'
      }
    ]

    setProjects(mockProjects)
    setDeployments(mockDeployments)
  }, [])

  const createProject = (projectData) => {
    const newProject = {
      projectId: Date.now().toString(),
      userId: '1',
      deploymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      ...projectData
    }
    setProjects(prev => [...prev, newProject])
    return newProject
  }

  const deployProject = (projectId, environment = 'production') => {
    const deployment = {
      deploymentId: Date.now().toString(),
      projectId,
      environmentType: environment,
      commitHash: Math.random().toString(36).substring(2, 8),
      deploymentUrl: `https://${environment}-app-${projectId}.vercel.app`,
      status: 'building',
      createdAt: new Date().toISOString()
    }

    setDeployments(prev => [...prev, deployment])

    // Simulate deployment process
    setTimeout(() => {
      setDeployments(prev => 
        prev.map(d => 
          d.deploymentId === deployment.deploymentId 
            ? { ...d, status: 'success' }
            : d
        )
      )
      setProjects(prev =>
        prev.map(p =>
          p.projectId === projectId
            ? { ...p, deploymentStatus: 'deployed' }
            : p
        )
      )
    }, 3000)

    return deployment
  }

  const value = {
    projects,
    deployments,
    createProject,
    deployProject
  }

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  )
}