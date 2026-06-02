import { useMemo, useState } from 'react'
import { fakeLogin, fakeRegister } from '../services/authService'
import { AuthContext } from './authContext'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (credentials) => {
    const loggedUser = fakeLogin(credentials)
    setUser(loggedUser)
    return loggedUser
  }

  const register = (payload) => {
    const newUser = fakeRegister(payload)
    setUser(newUser)
    return newUser
  }

  const logout = () => {
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, register, logout }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
