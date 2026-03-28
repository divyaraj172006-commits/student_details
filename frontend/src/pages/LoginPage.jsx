/**
 * Login page component with beautiful 3D design
 */
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services'
import { storeAuthData } from '../utils/auth'
import { Input, Button, Alert, Spinner } from '../components/UI'

const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const response = await authService.login(email, password)
      storeAuthData(response.access_token, response.user)
      setSuccess('Login successful! Redirecting...')
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Glassmorphism card with 3D effect */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20 transform hover:scale-105 transition-transform duration-300 hover:shadow-blue-500/20">
          {/* Header with gradient text */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3 opacity-0 animate-fadeInDown">🎓</div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 animate-fadeInDown">
              Academic DB
            </h1>
            <p className="text-gray-300 text-sm animate-fadeInUp">
              Role-Based Database Management System
            </p>
          </div>

          {/* Alerts */}
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          {success && <Alert type="success" message={success} />}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              name="email"
              className="mb-4"
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              name="password"
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
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <span>🔓 Login</span>
                  </>
                )}
              </span>
            </Button>
          </form>

          {/* Signup link */}
          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <p className="text-gray-300 text-sm">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:opacity-80 font-semibold transition-opacity"
              >
                Sign up here
              </Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-400/20">
            <p className="text-xs font-bold text-blue-300 mb-3 flex items-center">
              <span className="mr-2">💡</span>
              Demo Credentials:
            </p>
            <div className="text-xs text-gray-300 space-y-2">
              <div className="flex justify-between items-center p-2 hover:bg-white/5 rounded transition-colors">
                <span className="font-mono">👨‍💼 Admin:</span>
                <span className="font-mono text-blue-300">admin@example.com</span>
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-white/5 rounded transition-colors">
                <span className="font-mono">👨‍🏫 HOD:</span>
                <span className="font-mono text-purple-300">hod@example.com</span>
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-white/5 rounded transition-colors">
                <span className="font-mono">📚 Faculty:</span>
                <span className="font-mono text-pink-300">faculty@example.com</span>
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-white/5 rounded transition-colors">
                <span className="font-mono">🎓 Student:</span>
                <span className="font-mono text-green-300">student@example.com</span>
              </div>
              <p className="text-center text-gray-400 mt-2 text-xs italic">
                Password: <span className="font-mono text-gray-300">password</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom info */}
        <div className="text-center mt-6 text-gray-400 text-xs">
          <p>🔒 Your data is secure and protected</p>
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

export default LoginPage
