/**
 * Reusable UI components with beautiful 3D design and gradients
 */
import React from 'react'

/**
 * Button component with 3D gradient effects
 */
export const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  className = '',
  disabled = false,
  size = 'md'
}) => {
  const baseSizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const baseStyles = `${baseSizes[size]} font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0.5`
  
  const variants = {
    primary: 'bg-gradient-to-br from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 focus:ring-blue-400 shadow-blue-300',
    secondary: 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-900 hover:from-gray-400 hover:to-gray-500 focus:ring-gray-300',
    danger: 'bg-gradient-to-br from-red-500 to-red-700 text-white hover:from-red-600 hover:to-red-800 focus:ring-red-400 shadow-red-300',
    success: 'bg-gradient-to-br from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800 focus:ring-green-400 shadow-green-300',
    info: 'bg-gradient-to-br from-purple-500 to-purple-700 text-white hover:from-purple-600 hover:to-purple-800 focus:ring-purple-400 shadow-purple-300',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  )
}

/**
 * Enhanced Input component
 */
export const Input = ({ 
  label, 
  type = 'text', 
  placeholder = '', 
  value = '', 
  onChange, 
  error = '',
  className = '',
  required = false,
  name = '',
  disabled = false
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none transform focus:scale-105 shadow-sm ${
          error 
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
            : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'}`}
      />
      {error && <p className="mt-1.5 text-sm font-medium text-red-500">{error}</p>}
    </div>
  )
}

/**
 * Enhanced Select component
 */
export const Select = ({ 
  label, 
  value = '', 
  onChange, 
  options = [], 
  error = '', 
  className = '',
  required = false,
  name = '',
  disabled = false
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none transform focus:scale-105 shadow-sm ${
          error 
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
            : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'}`}
      >
        <option value="">-- Select an option --</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-sm font-medium text-red-500">{error}</p>}
    </div>
  )
}

/**
 * Card component with depth effect
 */
export const Card = ({ children, className = '', elevated = true }) => {
  const elevationClass = elevated ? 'shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300' : 'shadow-md'
  return (
    <div className={`bg-white rounded-xl p-6 ${elevationClass} ${className}`}>
      {children}
    </div>
  )
}

/**
 * Enhanced Alert component
 */
export const Alert = ({ type = 'info', message, onClose, title = '' }) => {
  const colors = {
    info: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-400 shadow-blue-200',
    success: 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-green-400 shadow-green-200',
    error: 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-400 shadow-red-200',
    warning: 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border-yellow-400 shadow-yellow-200',
  }

  const icons = {
    info: 'ℹ️',
    success: '✓',
    error: '✕',
    warning: '⚠',
  }

  return (
    <div className={`border-l-4 p-4 mb-4 rounded-lg ${colors[type]} shadow-md`} role="alert">
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <span className="text-xl mr-3">{icons[type]}</span>
          <div>
            {title && <p className="font-bold mb-1">{title}</p>}
            <p>{message}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-lg font-bold hover:opacity-70 transition-opacity ml-2"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * Loading spinner with gradient
 */
export const Spinner = ({ size = 'md', className = '', color = 'blue' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  const colors_map = {
    blue: 'border-blue-300 border-t-blue-600',
    green: 'border-green-300 border-t-green-600',
    purple: 'border-purple-300 border-t-purple-600',
  }

  return (
    <div className={`${sizes[size]} border-4 ${colors_map[color]} rounded-full animate-spin shadow-lg ${className}`} />
  )
}

/**
 * Badge component
 */
export const Badge = ({ children, variant = 'primary', size = 'md' }) => {
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
    success: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
    warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white',
    purple: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
  }

  return (
    <span className={`${sizes[size]} ${variants[variant]} rounded-full font-semibold inline-block shadow-md`}>
      {children}
    </span>
  )
}
