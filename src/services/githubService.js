import api from './api'

/**
 * GitHub API Service
 * Handles repository information and webhook management
 * Docs: https://docs.github.com/rest/reference
 */
class GitHubService {
  constructor() {
    this.baseURL = 'https://api.github.com'
  }

  /**
   * Get user repositories
   * @param {string} accessToken - GitHub access token
   * @returns {Promise<Array>} List of repositories
   */
  async getUserRepos(accessToken) {
    try {
      const response = await fetch(`${this.baseURL}/user/repos`, {
        headers: {
          'Authorization': `token ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching repositories:', error)
      throw error
    }
  }

  /**
   * Get repository branches
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {string} accessToken - GitHub access token
   * @returns {Promise<Array>} List of branches
   */
  async getRepoBranches(owner, repo, accessToken) {
    try {
      const response = await fetch(`${this.baseURL}/repos/${owner}/${repo}/branches`, {
        headers: {
          'Authorization': `token ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching branches:', error)
      throw error
    }
  }

  /**
   * Create webhook for deployment triggers
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {string} webhookUrl - Webhook URL
   * @param {string} accessToken - GitHub access token
   * @returns {Promise<Object>} Webhook data
   */
  async createWebhook(owner, repo, webhookUrl, accessToken) {
    try {
      const response = await fetch(`${this.baseURL}/repos/${owner}/${repo}/hooks`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'web',
          active: true,
          events: ['push', 'pull_request'],
          config: {
            url: webhookUrl,
            content_type: 'json',
            insecure_ssl: '0'
          }
        })
      })
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error creating webhook:', error)
      throw error
    }
  }

  /**
   * Get repository information
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {string} accessToken - GitHub access token
   * @returns {Promise<Object>} Repository data
   */
  async getRepoInfo(owner, repo, accessToken) {
    try {
      const response = await fetch(`${this.baseURL}/repos/${owner}/${repo}`, {
        headers: {
          'Authorization': `token ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching repository info:', error)
      throw error
    }
  }

  /**
   * Get latest commit from branch
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {string} branch - Branch name
   * @param {string} accessToken - GitHub access token
   * @returns {Promise<Object>} Commit data
   */
  async getLatestCommit(owner, repo, branch, accessToken) {
    try {
      const response = await fetch(`${this.baseURL}/repos/${owner}/${repo}/commits/${branch}`, {
        headers: {
          'Authorization': `token ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching latest commit:', error)
      throw error
    }
  }

  /**
   * Initiate GitHub OAuth flow
   * @param {string} clientId - GitHub OAuth client ID
   * @param {string} redirectUri - Redirect URI
   * @returns {string} OAuth URL
   */
  getOAuthUrl(clientId, redirectUri) {
    const scope = 'repo,user:email'
    return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`
  }

  /**
   * Exchange OAuth code for access token
   * @param {string} code - OAuth code
   * @param {string} clientId - GitHub OAuth client ID
   * @param {string} clientSecret - GitHub OAuth client secret
   * @returns {Promise<string>} Access token
   */
  async exchangeCodeForToken(code, clientId, clientSecret) {
    try {
      // This should be done on the backend for security
      const response = await api.post('/auth/github/callback', {
        code,
        clientId,
        clientSecret
      })
      
      return response.data.access_token
    } catch (error) {
      console.error('Error exchanging code for token:', error)
      throw error
    }
  }
}

export default new GitHubService()
