/**
 * HOD Dashboard - Monitor attendance and marks
 */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentService } from '../../services'
import { getCurrentUser } from '../../utils/auth'
import { Button, Card, Spinner, Alert } from '../../components/UI'

const HODDashboard = () => {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">HOD Dashboard</h1>
            <p className="text-gray-600">Welcome, {user?.name}</p>
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <h3 className="text-gray-500 text-sm font-semibold uppercase">Total Students</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{students.length}</p>
          </Card>
          <Card>
            <h3 className="text-gray-500 text-sm font-semibold uppercase">Department</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">Engineering</p>
          </Card>
          <Card>
            <h3 className="text-gray-500 text-sm font-semibold uppercase">Your Role</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">HOD</p>
          </Card>
        </div>

        {/* Students List for Monitoring */}
        <Card>
          <h2 className="text-xl font-bold mb-4">Monitor Students</h2>
          {loading ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : students.length === 0 ? (
            <p className="text-gray-600 text-center py-4">No students found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Department</th>
                    <th className="px-4 py-2">Semester</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{student.id}</td>
                      <td className="px-4 py-2">{student.name}</td>
                      <td className="px-4 py-2">{student.department}</td>
                      <td className="px-4 py-2">{student.semester}</td>
                      <td className="px-4 py-2">
                        <Button variant="primary" size="sm" className="text-xs px-3 py-1">
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card>
            <h3 className="text-lg font-bold mb-2">📊 Monitor Attendance</h3>
            <p className="text-gray-600 mb-4">View and analyze attendance patterns of all students</p>
            <Button variant="primary" className="w-full">View Attendance</Button>
          </Card>
          <Card>
            <h3 className="text-lg font-bold mb-2">📈 Monitor Marks</h3>
            <p className="text-gray-600 mb-4">Review marks and SGPA/CGPA of all students</p>
            <Button variant="primary" className="w-full">View Marks</Button>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default HODDashboard
