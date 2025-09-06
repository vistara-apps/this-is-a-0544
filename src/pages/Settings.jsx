import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  User,
  CreditCard,
  Bell,
  Shield,
  Github,
  Key,
  Settings as SettingsIcon
} from 'lucide-react'

const Settings = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'integrations', name: 'Integrations', icon: Github }
  ]

  const ProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email}
              disabled
              className="input opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Display Name
            </label>
            <input
              type="text"
              defaultValue="John Doe"
              className="input"
            />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Subscription</h3>
        <div className="p-4 rounded-lg bg-dark-bg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium capitalize">{user?.subscriptionPlan} Plan</p>
              <p className="text-gray-400 text-sm">Active since {new Date(user?.createdAt).toLocaleDateString()}</p>
            </div>
            <button className="btn-primary">Upgrade Plan</button>
          </div>
        </div>
      </div>
    </div>
  )

  const BillingSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Current Plan</h3>
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xl font-bold text-white capitalize">{user?.subscriptionPlan} Plan</h4>
              <p className="text-gray-400">$9.00/month</p>
            </div>
            <button className="btn-outline">Change Plan</button>
          </div>
          <div className="space-y-2 text-sm text-gray-400">
            <p>✓ Up to 5 projects</p>
            <p>✓ 10 deployments per month</p>
            <p>✓ Basic analytics</p>
            <p>✓ Community support</p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Usage This Month</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-4">
            <p className="text-gray-400 text-sm">Projects</p>
            <p className="text-2xl font-bold text-white">2 / 5</p>
          </div>
          <div className="card p-4">
            <p className="text-gray-400 text-sm">Deployments</p>
            <p className="text-2xl font-bold text-white">8 / 10</p>
          </div>
          <div className="card p-4">
            <p className="text-gray-400 text-sm">Bandwidth</p>
            <p className="text-2xl font-bold text-white">2.4 GB</p>
          </div>
        </div>
      </div>
    </div>
  )

  const NotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Email Notifications</h3>
        <div className="space-y-4">
          {[
            { name: 'Deployment Status', description: 'Get notified when deployments succeed or fail' },
            { name: 'Performance Alerts', description: 'Receive alerts when performance issues are detected' },
            { name: 'Cost Optimizations', description: 'Get recommendations to optimize your cloud costs' },
            { name: 'Weekly Reports', description: 'Receive weekly summaries of your deployments' }
          ].map((notification, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-dark-bg border border-gray-700">
              <div>
                <p className="text-white font-medium">{notification.name}</p>
                <p className="text-gray-400 text-sm">{notification.description}</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-primary" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const SecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Current Password
            </label>
            <input type="password" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              New Password
            </label>
            <input type="password" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Confirm New Password
            </label>
            <input type="password" className="input" />
          </div>
          <button className="btn-primary">Update Password</button>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">API Keys</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-dark-bg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Personal Access Token</p>
                <p className="text-gray-400 text-sm">Used for CLI and API access</p>
              </div>
              <button className="btn-outline">Regenerate</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const IntegrationsSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Connected Accounts</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-dark-bg border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Github className="h-8 w-8 text-white" />
                <div>
                  <p className="text-white font-medium">GitHub</p>
                  <p className="text-gray-400 text-sm">Connected</p>
                </div>
              </div>
              <button className="btn-outline">Disconnect</button>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-dark-bg border border-gray-700 opacity-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gray-600 rounded"></div>
                <div>
                  <p className="text-white font-medium">GitLab</p>
                  <p className="text-gray-400 text-sm">Not connected</p>
                </div>
              </div>
              <button className="btn-primary">Connect</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileSettings />
      case 'billing': return <BillingSettings />
      case 'notifications': return <NotificationSettings />
      case 'security': return <SecuritySettings />
      case 'integrations': return <IntegrationsSettings />
      default: return <ProfileSettings />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-2">Manage your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-left
                  ${activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }
                `}
              >
                <tab.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings