import React, { createContext, useContext } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  // No lanzar error, devolver null si no hay contexto
  // Esto permite usar el hook antes de que el usuario haga login
  return context || { user: null }
}

export default AuthContext
