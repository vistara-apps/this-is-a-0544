import api from './api'
import cloudProviderService from './cloudProviderService'

/**
 * Intelligent Resource Scaling Service
 * Handles automatic scaling based on real-time metrics and AI analysis
 */
class ScalingService {
  constructor() {
    this.scalingRules = new Map()
    this.monitoringInterval = null
    this.scalingCooldown = new Map() // Prevent rapid scaling
  }

  /**
   * Start monitoring and auto-scaling for a deployment
   * @param {string} deploymentId - Deployment ID
   * @param {Object} scalingConfig - Scaling configuration
   */
  async startAutoScaling(deploymentId, scalingConfig = {}) {
    const defaultConfig = {
      minInstances: 1,
      maxInstances: 10,
      targetCpuUtilization: 70,
      targetMemoryUtilization: 80,
      scaleUpThreshold: 80,
      scaleDownThreshold: 30,
      cooldownPeriod: 300000, // 5 minutes
      monitoringInterval: 60000, // 1 minute
      ...scalingConfig
    }

    this.scalingRules.set(deploymentId, defaultConfig)

    // Start monitoring if not already running
    if (!this.monitoringInterval) {
      this.startMonitoring()
    }

    console.log(`Auto-scaling started for deployment ${deploymentId}`)
  }

  /**
   * Stop auto-scaling for a deployment
   * @param {string} deploymentId - Deployment ID
   */
  stopAutoScaling(deploymentId) {
    this.scalingRules.delete(deploymentId)
    this.scalingCooldown.delete(deploymentId)

    // Stop monitoring if no deployments are being monitored
    if (this.scalingRules.size === 0 && this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
      this.monitoringInterval = null
    }

    console.log(`Auto-scaling stopped for deployment ${deploymentId}`)
  }

  /**
   * Start the monitoring loop
   */
  startMonitoring() {
    this.monitoringInterval = setInterval(async () => {
      for (const [deploymentId, config] of this.scalingRules) {
        try {
          await this.checkAndScale(deploymentId, config)
        } catch (error) {
          console.error(`Scaling check failed for ${deploymentId}:`, error)
        }
      }
    }, 60000) // Check every minute
  }

  /**
   * Check metrics and scale if necessary
   * @param {string} deploymentId - Deployment ID
   * @param {Object} config - Scaling configuration
   */
  async checkAndScale(deploymentId, config) {
    // Check if in cooldown period
    const lastScaling = this.scalingCooldown.get(deploymentId)
    if (lastScaling && Date.now() - lastScaling < config.cooldownPeriod) {
      return
    }

    // Get current metrics
    const metrics = await this.getDeploymentMetrics(deploymentId)
    if (!metrics) return

    const decision = this.makeScalingDecision(metrics, config)
    
    if (decision.action !== 'none') {
      await this.executeScaling(deploymentId, decision, config)
      this.scalingCooldown.set(deploymentId, Date.now())
    }
  }

  /**
   * Get deployment metrics
   * @param {string} deploymentId - Deployment ID
   * @returns {Promise<Object>} Metrics data
   */
  async getDeploymentMetrics(deploymentId) {
    try {
      const response = await api.get(`/deployments/${deploymentId}/metrics`)
      return response.data
    } catch (error) {
      console.error('Failed to get deployment metrics:', error)
      return null
    }
  }

  /**
   * Make scaling decision based on metrics
   * @param {Object} metrics - Current metrics
   * @param {Object} config - Scaling configuration
   * @returns {Object} Scaling decision
   */
  makeScalingDecision(metrics, config) {
    const {
      cpuUtilization,
      memoryUtilization,
      requestRate,
      responseTime,
      errorRate,
      currentInstances
    } = metrics

    const {
      minInstances,
      maxInstances,
      scaleUpThreshold,
      scaleDownThreshold,
      targetCpuUtilization,
      targetMemoryUtilization
    } = config

    // Scale up conditions
    const shouldScaleUp = (
      (cpuUtilization > scaleUpThreshold || memoryUtilization > scaleUpThreshold) &&
      currentInstances < maxInstances
    ) || (
      responseTime > 1000 && // Response time > 1s
      currentInstances < maxInstances
    ) || (
      errorRate > 5 && // Error rate > 5%
      currentInstances < maxInstances
    )

    // Scale down conditions
    const shouldScaleDown = (
      cpuUtilization < scaleDownThreshold &&
      memoryUtilization < scaleDownThreshold &&
      responseTime < 500 &&
      errorRate < 1 &&
      currentInstances > minInstances
    )

    if (shouldScaleUp) {
      const targetInstances = Math.min(
        maxInstances,
        Math.ceil(currentInstances * 1.5) // Scale up by 50%
      )
      return {
        action: 'scale_up',
        targetInstances,
        reason: this.getScalingReason(metrics, 'up')
      }
    }

    if (shouldScaleDown) {
      const targetInstances = Math.max(
        minInstances,
        Math.floor(currentInstances * 0.7) // Scale down by 30%
      )
      return {
        action: 'scale_down',
        targetInstances,
        reason: this.getScalingReason(metrics, 'down')
      }
    }

    return { action: 'none' }
  }

  /**
   * Get human-readable scaling reason
   * @param {Object} metrics - Current metrics
   * @param {string} direction - 'up' or 'down'
   * @returns {string} Scaling reason
   */
  getScalingReason(metrics, direction) {
    const { cpuUtilization, memoryUtilization, responseTime, errorRate } = metrics

    if (direction === 'up') {
      if (cpuUtilization > 80) return `High CPU usage: ${cpuUtilization}%`
      if (memoryUtilization > 80) return `High memory usage: ${memoryUtilization}%`
      if (responseTime > 1000) return `Slow response time: ${responseTime}ms`
      if (errorRate > 5) return `High error rate: ${errorRate}%`
    } else {
      if (cpuUtilization < 30 && memoryUtilization < 30) {
        return `Low resource usage: CPU ${cpuUtilization}%, Memory ${memoryUtilization}%`
      }
    }

    return 'Automatic scaling based on metrics'
  }

  /**
   * Execute scaling action
   * @param {string} deploymentId - Deployment ID
   * @param {Object} decision - Scaling decision
   * @param {Object} config - Scaling configuration
   */
  async executeScaling(deploymentId, decision, config) {
    try {
      // Get deployment info to determine provider
      const deployment = await this.getDeploymentInfo(deploymentId)
      if (!deployment) return

      const scaleConfig = {
        targetInstances: decision.targetInstances,
        reason: decision.reason
      }

      // Execute scaling through cloud provider
      const result = await cloudProviderService.scaleDeployment(
        deployment.provider,
        deploymentId,
        scaleConfig
      )

      // Log scaling event
      await this.logScalingEvent(deploymentId, {
        action: decision.action,
        fromInstances: deployment.currentInstances,
        toInstances: decision.targetInstances,
        reason: decision.reason,
        timestamp: new Date().toISOString()
      })

      console.log(`Scaling executed for ${deploymentId}:`, {
        action: decision.action,
        instances: decision.targetInstances,
        reason: decision.reason
      })

      return result
    } catch (error) {
      console.error('Failed to execute scaling:', error)
      throw error
    }
  }

  /**
   * Get deployment information
   * @param {string} deploymentId - Deployment ID
   * @returns {Promise<Object>} Deployment info
   */
  async getDeploymentInfo(deploymentId) {
    try {
      const response = await api.get(`/deployments/${deploymentId}`)
      return response.data
    } catch (error) {
      console.error('Failed to get deployment info:', error)
      return null
    }
  }

  /**
   * Log scaling event for analytics
   * @param {string} deploymentId - Deployment ID
   * @param {Object} event - Scaling event data
   */
  async logScalingEvent(deploymentId, event) {
    try {
      await api.post(`/deployments/${deploymentId}/scaling-events`, event)
    } catch (error) {
      console.error('Failed to log scaling event:', error)
    }
  }

  /**
   * Get scaling history for a deployment
   * @param {string} deploymentId - Deployment ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Scaling events
   */
  async getScalingHistory(deploymentId, options = {}) {
    try {
      const { limit = 50, startDate, endDate } = options
      const params = new URLSearchParams({ limit })
      
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const response = await api.get(`/deployments/${deploymentId}/scaling-events?${params}`)
      return response.data
    } catch (error) {
      console.error('Failed to get scaling history:', error)
      return []
    }
  }

  /**
   * Predict scaling needs based on historical data
   * @param {string} deploymentId - Deployment ID
   * @param {Object} options - Prediction options
   * @returns {Promise<Object>} Scaling predictions
   */
  async predictScalingNeeds(deploymentId, options = {}) {
    try {
      const { timeHorizon = '24h', confidence = 0.8 } = options
      
      const response = await api.post(`/deployments/${deploymentId}/scaling-predictions`, {
        timeHorizon,
        confidence
      })

      return response.data
    } catch (error) {
      console.error('Failed to predict scaling needs:', error)
      return {
        predictions: [],
        confidence: 0,
        recommendations: []
      }
    }
  }

  /**
   * Update scaling configuration
   * @param {string} deploymentId - Deployment ID
   * @param {Object} newConfig - New scaling configuration
   */
  updateScalingConfig(deploymentId, newConfig) {
    const currentConfig = this.scalingRules.get(deploymentId)
    if (currentConfig) {
      this.scalingRules.set(deploymentId, { ...currentConfig, ...newConfig })
      console.log(`Scaling config updated for ${deploymentId}`)
    }
  }

  /**
   * Get current scaling configuration
   * @param {string} deploymentId - Deployment ID
   * @returns {Object} Current scaling configuration
   */
  getScalingConfig(deploymentId) {
    return this.scalingRules.get(deploymentId) || null
  }

  /**
   * Manual scaling trigger
   * @param {string} deploymentId - Deployment ID
   * @param {number} targetInstances - Target instance count
   * @param {string} reason - Reason for manual scaling
   */
  async manualScale(deploymentId, targetInstances, reason = 'Manual scaling') {
    const decision = {
      action: 'manual_scale',
      targetInstances,
      reason
    }

    const config = this.scalingRules.get(deploymentId) || {}
    await this.executeScaling(deploymentId, decision, config)
  }
}

export default new ScalingService()
