import { createContext, useContext, useEffect, useState } from 'react'
import customerApi from '../services/customerApi'
import { setToken } from '../services/authToken'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    customerApi.get('/me')
      .then(({ data }) => setCustomer(data))
      .catch(() => setCustomer(null))
      .finally(() => setIsLoading(false))
  }, [])

  const register = async (details) => {
    const { data } = await customerApi.post('/register', details)
    return data
  }

  const login = async (credentials) => {
    const { data } = await customerApi.post('/login', credentials)
    setToken(data.token)
    setCustomer(data.customer)
    return data
  }

  const logout = async () => {
    try {
      await customerApi.post('/logout')
    } finally {
      setToken(null)
      setCustomer(null)
    }
  }

  const changePassword = async (passwords) => {
    const { data } = await customerApi.patch('/change-password', passwords)
    return data
  }

  return (
    <AuthContext.Provider value={{ customer, isLoading, register, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
