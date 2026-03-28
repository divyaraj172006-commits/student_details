/**
 * Authentication utility functions
 */

/**
 * Store authentication data in localStorage
 */
export const storeAuthData = (token, user) => {
  localStorage.setItem('access_token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

/**
 * Get authentication data from localStorage
 */
export const getAuthData = () => {
  const token = localStorage.getItem('access_token')
  const user = localStorage.getItem('user')
  return {
    token,
    user: user ? JSON.parse(user) : null,
  }
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token')
}

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

/**
 * Clear authentication data
 */
export const clearAuthData = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('user')
}

/**
 * Check if user has specific role
 */
export const hasRole = (role) => {
  const user = getCurrentUser()
  return user?.role === role
}

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (...roles) => {
  const user = getCurrentUser()
  return user && roles.includes(user.role)
}
