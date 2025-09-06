import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Rocket, 
  Zap, 
  Shield, 
  DollarSign,
  Github,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

const LandingPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, signup, user } = useAuth()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (user) {
      navigate('/app')
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (isLogin) {
        await login(email, password)
      } else {
        await signup(email, password)
      }
      navigate('/app')
    } catch (error) {
      console.error('Auth error:', error)
    }
    
    setLoading(false)
  }

  const features = [
    {
      icon: Rocket,
      title: 'One-Click Deployment',
      description: 'Deploy your web applications to the cloud with a single click. No complex configurations needed.'
    },
    {
      icon: Zap,
      title: 'Automated Environment Setup',
      description: 'Automatically configure staging and production environments with optimal settings.'
    },
    {
      icon: Shield,
      title: 'Intelligent Scaling',
      description: 'Dynamic resource scaling based on real-time traffic and application load.'
    },
    {
      icon: DollarSign,
      title: 'Cost Optimization',
      description: 'Get actionable insights to reduce cloud spending without compromising performance.'
    }
  ]

  const benefits = [
    'Connect your GitHub repository',
    'Automated CI/CD pipeline setup',
    'Real-time deployment monitoring',
    'Cost optimization recommendations',
    'Multi-environment support',
    '24/7 uptime monitoring'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <div className="w-7 h-7 border-2 border-white rounded border-dashed"></div>
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold text-white">DeployMe</h1>
                <p className="text-sm text-gray-400">Your Simplified Cloud Deployment Solution</p>
              </div>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Effortless Cloud
              <span className="text-primary block">Deployment</span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Deploy any web app to the cloud with a single click. Automate your environment setup, 
              scale intelligently, and optimize costs without the complexity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button
                onClick={() => setIsLogin(false)}
                className="btn-primary px-8 py-3 text-lg font-semibold"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="btn-outline px-8 py-3 text-lg">
                <Github className="mr-2 h-5 w-5" />
                Connect GitHub
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {features.map((feature, index) => (
              <div key={index} className="card p-6 text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Auth Section */}
          <div className="max-w-md mx-auto">
            <div className="card p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {isLogin ? 'Welcome Back' : 'Get Started'}
                </h3>
                <p className="text-gray-400">
                  {isLogin ? 'Sign in to your account' : 'Create your account'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
                </button>
              </form>

              <div className="text-center mt-4">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-primary hover:text-primary/80"
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-20 text-center">
            <h3 className="text-2xl font-bold text-white mb-8">Everything you need to deploy with confidence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3 text-gray-300">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage