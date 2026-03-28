/**
 * Admin Dashboard - Manage students, results, and system
 */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentService, marksService } from '../../services'
import { getCurrentUser } from '../../utils/auth'
import { Button, Input, Alert, Card, Spinner, Badge } from '../../components/UI'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showAddStudent, setShowAddStudent] = useState(false)
  const [newStudent, setNewStudent] = useState({
    user_id: '',
    name: '',
    department: '',
    semester: '',
  })

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    try {
      setLoading(true)
      const data = await studentService.getAllStudents()
      setStudents(data)
    } catch (err) {
      setError('Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  const handleAddStudent = async (e) => {
    e.preventDefault()
    if (!newStudent.user_id || !newStudent.name || !newStudent.department || !newStudent.semester) {
      setError('Please fill all fields')
      return
    }

    try {
      await studentService.registerStudent({
        ...newStudent,
        semester: parseInt(newStudent.semester),
      })
      setSuccess('Student added successfully!')
      setNewStudent({ user_id: '', name: '', department: '', semester: '' })
      setShowAddStudent(false)
      loadStudents()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add student')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="text-white">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              👨‍💼 Admin Dashboard
            </h1>
            <p className="text-gray-300 mt-1">Welcome back, <span className="font-semibold">{user?.name}</span></p>
          </div>
          <Button variant="danger" onClick={handleLogout}>
            🚪 Logout
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Students Card */}
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-md rounded-xl p-6 border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-300 text-sm font-semibold uppercase">Total Students</h3>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent mt-2">
                  {students.length}
                </p>
              </div>
              <div className="text-5xl opacity-20">👥</div>
            </div>
          </div>

          {/* System Status Card */}
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-md rounded-xl p-6 border border-green-400/30 hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-300 text-sm font-semibold uppercase">System Status</h3>
                <p className="text-4xl font-bold bg-gradient-to-r from-green-300 to-green-100 bg-clip-text text-transparent mt-2">
                  Active
                </p>
              </div>
              <div className="text-5xl opacity-20">✓</div>
            </div>
            <Badge variant="success" size="sm" className="mt-3">🟢 Running</Badge>
          </div>

          {/* Role Card */}
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-md rounded-xl p-6 border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-300 text-sm font-semibold uppercase">Your Role</h3>
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-purple-100 bg-clip-text text-transparent mt-2 capitalize">
                  Administrator
                </p>
              </div>
              <div className="text-5xl opacity-20">🔐</div>
            </div>
          </div>
        </div>

        {/* Add Student Section */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md rounded-xl p-6 border border-white/10 mb-8 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">📝 Student Management</h2>
            <Button
              variant={showAddStudent ? 'secondary' : 'success'}
              onClick={() => setShowAddStudent(!showAddStudent)}
              size="md"
            >
              {showAddStudent ? '✕ Cancel' : '+ Add Student'}
            </Button>
          </div>

          {showAddStudent && (
            <form onSubmit={handleAddStudent} className="bg-gradient-to-b from-white/5 to-white/0 p-6 rounded-lg border border-white/10 space-y-5 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="User ID"
                  type="number"
                  value={newStudent.user_id}
                  onChange={(e) => setNewStudent({ ...newStudent, user_id: e.target.value })}
                  placeholder="Enter user ID"
                  name="user_id"
                />
                <Input
                  label="Student Name"
                  type="text"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  placeholder="Enter full name"
                  name="name"
                />
                <Input
                  label="Department"
                  type="text"
                  value={newStudent.department}
                  onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
                  placeholder="e.g., Computer Science"
                  name="department"
                />
                <Input
                  label="Semester"
                  type="number"
                  value={newStudent.semester}
                  onChange={(e) => setNewStudent({ ...newStudent, semester: e.target.value })}
                  placeholder="e.g., 4"
                  name="semester"
                />
              </div>
              <Button type="submit" variant="success" className="w-full" size="lg">
                ✓ Add Student to System
              </Button>
            </form>
          )}
        </div>

        {/* Students List */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">📚 All Students</h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" color="blue" />
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No students registered yet</p>
              <p className="text-gray-500 text-sm mt-2">Click "Add Student" to register new students</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-white/20">
                  <tr>
                    <th className="px-4 py-4 text-gray-300 font-semibold text-sm uppercase">ID</th>
                    <th className="px-4 py-4 text-gray-300 font-semibold text-sm uppercase">Name</th>
                    <th className="px-4 py-4 text-gray-300 font-semibold text-sm uppercase">Department</th>
                    <th className="px-4 py-4 text-gray-300 font-semibold text-sm uppercase">Semester</th>
                    <th className="px-4 py-4 text-gray-300 font-semibold text-sm uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => (
                    <tr 
                      key={student.id} 
                      className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
                    >
                      <td className="px-4 py-4 text-gray-300 text-sm">{student.id}</td>
                      <td className="px-4 py-4 text-white font-medium">{student.name}</td>
                      <td className="px-4 py-4 text-gray-400">{student.department}</td>
                      <td className="px-4 py-4">
                        <Badge variant="info" size="sm">Sem {student.semester}</Badge>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="success" size="sm">Active</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
