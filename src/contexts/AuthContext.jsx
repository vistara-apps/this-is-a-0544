import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate checking for existing auth
    const savedUser = localStorage.getItem('deployme-user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    // Simulate login
    const userData = {
      userId: '1',
      email,
      subscriptionPlan: 'starter',
      createdAt: new Date().toISOString()
    }
    setUser(userData)
    localStorage.setItem('deployme-user', JSON.stringify(userData))
    return userData
  }

  const signup = async (email, password) => {
    // Simulate signup
    const userData = {
      userId: Date.now().toString(),
      email,
      subscriptionPlan: 'starter',
      createdAt: new Date().toISOString()
    }
    setUser(userData)
    localStorage.setItem('deployme-user', JSON.stringify(userData))
    return userData
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('deployme-user')
  }

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}