/**
 * Signup page component with beautiful 3D design
 */
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services'
import { storeAuthData } from '../utils/auth'
import { Input, Button, Select, Alert, Spinner } from '../components/UI'

const SignupPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const roles = [
    { value: 'admin', label: '👨‍💼 Admin' },
    { value: 'hod', label: '👨‍🏫 Head of Department (HOD)' },
    { value: 'faculty', label: '📚 Faculty' },
    { value: 'student', label: '🎓 Student' },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setError('Please fill in all fields')
      return false
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    return true
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await authService.signup(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      )
      storeAuthData(response.access_token, response.user)
      setSuccess('Account created successfully! Redirecting...')
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/2 left-1/3 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Glassmorphism card with 3D effect */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20 transform hover:scale-105 transition-transform duration-300 hover:shadow-purple-500/20">
          {/* Header with gradient text */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3 opacity-0 animate-fadeInDown">✨</div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 animate-fadeInDown">
              Create Account
            </h1>
            <p className="text-gray-300 text-sm animate-fadeInUp">
              Join the Academic Database System
            </p>
          </div>

          {/* Alerts */}
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          {success && <Alert type="success" message={success} />}

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mb-4"
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mb-4"
            />

            <Select
              label="Select Your Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={roles}
              required
              className="mb-4"
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter password (min 6 characters)"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mb-4"
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="mb-4"
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full group"
              disabled={loading}
              size="lg"
            >
              <span className="flex items-center justify-center">
                {loading ? (
                  <>
                    <Spinner size="sm" color="blue" className="inline mr-2" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>✨ Sign Up</span>
                  </>
                )}
              </span>
            </Button>
          </form>

          {/* Login link */}
          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <p className="text-gray-300 text-sm">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent hover:opacity-80 font-semibold transition-opacity"
              >
                Login here
              </Link>
            </p>
          </div>

          {/* Password requirements */}
          <div className="mt-8 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl border border-cyan-400/20">
            <p className="text-xs font-bold text-cyan-300 mb-3 flex items-center">
              <span className="mr-2">✓</span>
              Password Requirements:
            </p>
            <div className="text-xs text-gray-300 space-y-2">
              <div className="flex items-center p-1">
                <span className="mr-2">✓</span>
                <span>Minimum 6 characters required</span>
              </div>
              <div className="flex items-center p-1">
                <span className="mr-2">✓</span>
                <span>Must match confirmation password</span>
              </div>
              <div className="flex items-center p-1">
                <span className="mr-2">✓</span>
                <span>Choose a strong password</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom info */}
        <div className="text-center mt-6 text-gray-400 text-xs">
          <p>🔒 Your information is secure and protected</p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-fadeInDown {
          animation: fadeInDown 0.6s ease-out;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out 0.2s both;
        }
      `}</style>
    </div>
  )
}

export default SignupPage
