import api from './api'

/**
 * AI Service using OpenAI API
 * Provides intelligent configuration generation and cost optimization recommendations
 * Docs: https://platform.openai.com/docs/api-reference
 */
class AIService {
  constructor() {
    this.baseURL = 'https://api.openai.com/v1'
  }

  /**
   * Generate deployment configuration based on repository analysis
   * @param {Object} repoInfo - Repository information
   * @returns {Promise<Object>} Generated configuration
   */
  async generateDeploymentConfig(repoInfo) {
    try {
      const prompt = this.createConfigPrompt(repoInfo)
      
      const response = await api.post('/ai/generate-config', {
        prompt,
        repoInfo
      })

      return this.parseConfigResponse(response.data.content)
    } catch (error) {
      console.error('Error generating deployment config:', error)
      // Fallback to default configuration
      return this.getDefaultConfig(repoInfo)
    }
  }

  /**
   * Generate cost optimization recommendations
   * @param {Object} deploymentData - Current deployment metrics
   * @returns {Promise<Array>} List of optimization recommendations
   */
  async generateCostOptimizations(deploymentData) {
    try {
      const prompt = this.createOptimizationPrompt(deploymentData)
      
      const response = await api.post('/ai/generate-optimizations', {
        prompt,
        deploymentData
      })

      return this.parseOptimizationResponse(response.data.content)
    } catch (error) {
      console.error('Error generating cost optimizations:', error)
      return this.getDefaultOptimizations(deploymentData)
    }
  }

  /**
   * Analyze repository to detect framework and dependencies
   * @param {Object} repoFiles - Repository file structure
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeRepository(repoFiles) {
    try {
      const prompt = this.createAnalysisPrompt(repoFiles)
      
      const response = await api.post('/ai/analyze-repo', {
        prompt,
        files: repoFiles
      })

      return this.parseAnalysisResponse(response.data.content)
    } catch (error) {
      console.error('Error analyzing repository:', error)
      return this.getDefaultAnalysis()
    }
  }

  /**
   * Generate CI/CD pipeline configuration
   * @param {Object} projectConfig - Project configuration
   * @returns {Promise<Object>} Pipeline configuration
   */
  async generatePipelineConfig(projectConfig) {
    try {
      const prompt = this.createPipelinePrompt(projectConfig)
      
      const response = await api.post('/ai/generate-pipeline', {
        prompt,
        projectConfig
      })

      return this.parsePipelineResponse(response.data.content)
    } catch (error) {
      console.error('Error generating pipeline config:', error)
      return this.getDefaultPipeline(projectConfig)
    }
  }

  /**
   * Create prompt for deployment configuration generation
   * @param {Object} repoInfo - Repository information
   * @returns {string} Generated prompt
   */
  createConfigPrompt(repoInfo) {
    return `
Analyze this repository and generate optimal deployment configuration:

Repository: ${repoInfo.name}
Description: ${repoInfo.description || 'No description'}
Language: ${repoInfo.language || 'Unknown'}
Size: ${repoInfo.size || 0} KB
Has package.json: ${repoInfo.hasPackageJson ? 'Yes' : 'No'}
Has Dockerfile: ${repoInfo.hasDockerfile ? 'Yes' : 'No'}
Main files: ${repoInfo.mainFiles?.join(', ') || 'None detected'}

Please provide:
1. Recommended cloud provider and why
2. Build command
3. Start command
4. Environment variables needed
5. Estimated resource requirements
6. Framework detection
7. Deployment strategy

Format as JSON with clear explanations.
    `.trim()
  }

  /**
   * Create prompt for cost optimization recommendations
   * @param {Object} deploymentData - Deployment metrics
   * @returns {string} Generated prompt
   */
  createOptimizationPrompt(deploymentData) {
    return `
Analyze this deployment and provide cost optimization recommendations:

Current Setup:
- Provider: ${deploymentData.provider}
- Instance Type: ${deploymentData.instanceType || 'N/A'}
- Monthly Cost: $${deploymentData.monthlyCost || 0}
- CPU Usage: ${deploymentData.cpuUsage || 0}%
- Memory Usage: ${deploymentData.memoryUsage || 0}%
- Traffic: ${deploymentData.monthlyTraffic || 0} requests/month
- Storage: ${deploymentData.storageUsage || 0} GB

Performance Metrics:
- Average Response Time: ${deploymentData.avgResponseTime || 0}ms
- Uptime: ${deploymentData.uptime || 100}%
- Error Rate: ${deploymentData.errorRate || 0}%

Provide specific, actionable recommendations to reduce costs while maintaining performance.
Format as JSON array with priority, description, estimated savings, and implementation steps.
    `.trim()
  }

  /**
   * Parse AI configuration response
   * @param {string} content - AI response content
   * @returns {Object} Parsed configuration
   */
  parseConfigResponse(content) {
    try {
      const parsed = JSON.parse(content)
      return {
        provider: parsed.provider || 'vercel',
        buildCommand: parsed.buildCommand || 'npm run build',
        startCommand: parsed.startCommand || 'npm start',
        framework: parsed.framework || 'react',
        environmentVariables: parsed.environmentVariables || [],
        resourceRequirements: parsed.resourceRequirements || {},
        deploymentStrategy: parsed.deploymentStrategy || 'standard',
        explanation: parsed.explanation || 'AI-generated configuration'
      }
    } catch (error) {
      console.error('Error parsing AI config response:', error)
      return this.getDefaultConfig()
    }
  }

  /**
   * Parse AI optimization response
   * @param {string} content - AI response content
   * @returns {Array} Parsed optimizations
   */
  parseOptimizationResponse(content) {
    try {
      const parsed = JSON.parse(content)
      return parsed.map(opt => ({
        id: opt.id || Math.random().toString(36).substr(2, 9),
        priority: opt.priority || 'medium',
        title: opt.title || 'Optimization Recommendation',
        description: opt.description || 'No description provided',
        estimatedSavings: opt.estimatedSavings || '$0/month',
        implementationSteps: opt.implementationSteps || [],
        category: opt.category || 'general',
        impact: opt.impact || 'medium'
      }))
    } catch (error) {
      console.error('Error parsing AI optimization response:', error)
      return this.getDefaultOptimizations()
    }
  }

  /**
   * Get default configuration when AI fails
   * @param {Object} repoInfo - Repository information
   * @returns {Object} Default configuration
   */
  getDefaultConfig(repoInfo = {}) {
    const hasPackageJson = repoInfo.hasPackageJson
    const language = repoInfo.language?.toLowerCase()

    let config = {
      provider: 'vercel',
      buildCommand: 'npm run build',
      startCommand: 'npm start',
      framework: 'react',
      environmentVariables: [],
      resourceRequirements: {
        cpu: '1 vCPU',
        memory: '1 GB',
        storage: '10 GB'
      },
      deploymentStrategy: 'standard',
      explanation: 'Default configuration based on common patterns'
    }

    // Adjust based on detected language/framework
    if (language === 'python') {
      config.buildCommand = 'pip install -r requirements.txt'
      config.startCommand = 'python app.py'
      config.framework = 'flask'
    } else if (language === 'javascript' && hasPackageJson) {
      config.buildCommand = 'npm ci && npm run build'
      config.startCommand = 'npm start'
    }

    return config
  }

  /**
   * Get default optimizations when AI fails
   * @param {Object} deploymentData - Deployment data
   * @returns {Array} Default optimizations
   */
  getDefaultOptimizations(deploymentData = {}) {
    const optimizations = []

    // CPU optimization
    if (deploymentData.cpuUsage < 30) {
      optimizations.push({
        id: 'cpu-downsize',
        priority: 'high',
        title: 'Downsize CPU Resources',
        description: 'Your CPU usage is consistently low. Consider reducing instance size.',
        estimatedSavings: '$10-20/month',
        implementationSteps: [
          'Monitor CPU usage for 1 week',
          'Switch to smaller instance type',
          'Test performance after change'
        ],
        category: 'compute',
        impact: 'high'
      })
    }

    // Memory optimization
    if (deploymentData.memoryUsage < 40) {
      optimizations.push({
        id: 'memory-optimize',
        priority: 'medium',
        title: 'Optimize Memory Usage',
        description: 'Memory usage is low. Consider memory-optimized instances.',
        estimatedSavings: '$5-15/month',
        implementationSteps: [
          'Analyze memory patterns',
          'Switch to memory-optimized instance',
          'Monitor performance'
        ],
        category: 'memory',
        impact: 'medium'
      })
    }

    // Storage optimization
    optimizations.push({
      id: 'storage-cleanup',
      priority: 'low',
      title: 'Clean Up Unused Storage',
      description: 'Regular storage cleanup can reduce costs.',
      estimatedSavings: '$2-5/month',
      implementationSteps: [
        'Audit storage usage',
        'Remove old logs and temporary files',
        'Set up automated cleanup'
      ],
      category: 'storage',
      impact: 'low'
    })

    return optimizations
  }

  /**
   * Create analysis prompt for repository
   * @param {Object} repoFiles - Repository files
   * @returns {string} Analysis prompt
   */
  createAnalysisPrompt(repoFiles) {
    return `
Analyze this repository structure and detect the framework, dependencies, and deployment requirements:

Files found:
${Object.keys(repoFiles).map(file => `- ${file}`).join('\n')}

Key file contents:
${Object.entries(repoFiles).map(([file, content]) => 
  `${file}:\n${content.substring(0, 500)}${content.length > 500 ? '...' : ''}`
).join('\n\n')}

Please identify:
1. Primary framework/technology
2. Dependencies and their versions
3. Build requirements
4. Runtime requirements
5. Recommended deployment strategy
6. Environment setup needs

Format as JSON.
    `.trim()
  }

  /**
   * Parse repository analysis response
   * @param {string} content - AI response
   * @returns {Object} Analysis results
   */
  parseAnalysisResponse(content) {
    try {
      return JSON.parse(content)
    } catch (error) {
      return this.getDefaultAnalysis()
    }
  }

  /**
   * Get default analysis when AI fails
   * @returns {Object} Default analysis
   */
  getDefaultAnalysis() {
    return {
      framework: 'unknown',
      dependencies: [],
      buildRequirements: ['npm install'],
      runtimeRequirements: ['Node.js'],
      deploymentStrategy: 'standard',
      environmentSetup: []
    }
  }

  /**
   * Create pipeline configuration prompt
   * @param {Object} projectConfig - Project configuration
   * @returns {string} Pipeline prompt
   */
  createPipelinePrompt(projectConfig) {
    return `
Generate a CI/CD pipeline configuration for this project:

Project: ${projectConfig.appName}
Framework: ${projectConfig.framework}
Provider: ${projectConfig.cloudProvider}
Build Command: ${projectConfig.buildCommand}
Test Command: ${projectConfig.testCommand || 'npm test'}

Create a pipeline that includes:
1. Code checkout
2. Dependency installation
3. Testing
4. Building
5. Deployment
6. Post-deployment verification

Format as YAML configuration.
    `.trim()
  }

  /**
   * Parse pipeline response
   * @param {string} content - AI response
   * @returns {Object} Pipeline configuration
   */
  parsePipelineResponse(content) {
    return {
      yaml: content,
      stages: ['checkout', 'install', 'test', 'build', 'deploy', 'verify']
    }
  }

  /**
   * Get default pipeline configuration
   * @param {Object} projectConfig - Project configuration
   * @returns {Object} Default pipeline
   */
  getDefaultPipeline(projectConfig) {
    return {
      yaml: `
name: Deploy ${projectConfig.appName}

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
    - name: Install dependencies
      run: npm ci
    - name: Run tests
      run: npm test
    - name: Build
      run: ${projectConfig.buildCommand || 'npm run build'}
    - name: Deploy
      run: echo "Deploy to ${projectConfig.cloudProvider}"
      `.trim(),
      stages: ['checkout', 'install', 'test', 'build', 'deploy']
    }
  }
}

export default new AIService()
