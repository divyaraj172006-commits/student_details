/**
 * Student Dashboard - View attendance, marks, and GPA
 */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentService, attendanceService, marksService } from '../../services'
import { getCurrentUser } from '../../utils/auth'
import { Button, Card, Spinner, Alert, Badge } from '../../components/UI'

const StudentDashboard = () => {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const [profile, setProfile] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [marks, setMarks] = useState([])
  const [gpa, setGPA] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadStudentData()
  }, [])

  const loadStudentData = async () => {
    try {
      setLoading(true)
      const [profileData, attendanceData, marksData, gpaData] = await Promise.all([
        studentService.getMyProfile(),
        attendanceService.getMyAttendance(),
        marksService.getMyMarks(),
        marksService.getMyGPA().catch(() => null), // GPA might not be available if no marks
      ])
      
      setProfile(profileData)
      setAttendance(attendanceData)
      setMarks(marksData)
      if (gpaData) setGPA(gpaData)
    } catch (err) {
      setError('Failed to load student data')
    } finally {
      setLoading(false)
    }
  }

  const calculateTotalMarks = (mark) => {
    return mark.internal_marks + mark.external_marks
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center">
        <Spinner size="lg" color="green" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600/20 to-teal-600/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="text-white">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
              🎓 Student Dashboard
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Semester */}
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-md rounded-xl p-6 border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-1">
            <h3 className="text-gray-300 text-sm font-semibold uppercase">Semester</h3>
            <p className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent mt-2">
              {profile?.semester || '-'}
            </p>
          </div>

          {/* Department */}
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-md rounded-xl p-6 border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 transform hover:-translate-y-1">
            <h3 className="text-gray-300 text-sm font-semibold uppercase">Department</h3>
            <p className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-purple-100 bg-clip-text text-transparent mt-2">
              {profile?.department || '-'}
            </p>
          </div>

          {/* SGPA */}
          <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-md rounded-xl p-6 border border-pink-400/30 hover:border-pink-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 transform hover:-translate-y-1">
            <h3 className="text-gray-300 text-sm font-semibold uppercase">SGPA</h3>
            <p className="text-4xl font-bold bg-gradient-to-r from-pink-300 to-pink-100 bg-clip-text text-transparent mt-2">
              {gpa?.sgpa?.toFixed(2) || '-'}
            </p>
            {gpa?.sgpa && <Badge variant="success" size="sm" className="mt-2">📈 Strong</Badge>}
          </div>

          {/* CGPA */}
          <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 backdrop-blur-md rounded-xl p-6 border border-cyan-400/30 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 transform hover:-translate-y-1">
            <h3 className="text-gray-300 text-sm font-semibold uppercase">CGPA</h3>
            <p className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-transparent mt-2">
              {gpa?.cgpa?.toFixed(2) || '-'}
            </p>
            {gpa?.cgpa && <Badge variant="info" size="sm" className="mt-2">🎯 Excellent</Badge>}
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md rounded-xl border border-white/10 shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-white/10 bg-gradient-to-r from-gray-800/30 to-transparent">
            <div className="flex space-x-0">
              {[
                { id: 'overview', label: '📋 Overview', icon: '📋' },
                { id: 'attendance', label: '✅ Attendance', icon: '✅' },
                { id: 'marks', label: '📊 Marks', icon: '📊' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-semibold transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-b-2 border-white'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Profile Information */}
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg p-6 border border-blue-400/20">
                    <h3 className="font-bold text-white mb-4 flex items-center text-lg">
                      <span className="mr-2">👤</span>
                      Profile Information
                    </h3>
                    <div className="space-y-3 text-gray-300">
                      <div className="flex justify-between items-center pb-2 border-b border-white/10">
                        <span className="text-gray-400">Name:</span>
                        <span className="font-semibold text-white">{profile?.name}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-white/10">
                        <span className="text-gray-400">Email:</span>
                        <span className="font-semibold text-blue-300">{user?.email}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-white/10">
                        <span className="text-gray-400">Department:</span>
                        <span className="font-semibold text-white">{profile?.department}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Semester:</span>
                        <Badge variant="primary" size="sm">{profile?.semester}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Academic Performance */}
                  <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg p-6 border border-purple-400/20">
                    <h3 className="font-bold text-white mb-4 flex items-center text-lg">
                      <span className="mr-2">📚</span>
                      Academic Performance
                    </h3>
                    <div className="space-y-3 text-gray-300">
                      <div className="flex justify-between items-center pb-2 border-b border-white/10">
                        <span className="text-gray-400">SGPA:</span>
                        <span className="font-semibold text-2xl text-pink-300">{gpa?.sgpa?.toFixed(2) || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-white/10">
                        <span className="text-gray-400">CGPA:</span>
                        <span className="font-semibold text-2xl text-cyan-300">{gpa?.cgpa?.toFixed(2) || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Subjects:</span>
                        <Badge variant="success" size="sm">{marks.length} Subjects</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Attendance Tab */}
            {activeTab === 'attendance' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">✅ Attendance Records</h2>
                {attendance.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">No attendance records found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-white/20">
                        <tr>
                          <th className="px-4 py-3 text-left text-gray-300 font-semibold text-sm uppercase">Subject</th>
                          <th className="px-4 py-3 text-left text-gray-300 font-semibold text-sm uppercase">Attendance %</th>
                          <th className="px-4 py-3 text-left text-gray-300 font-semibold text-sm uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendance.map((record) => (
                          <tr key={record.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 text-white">{record.subject}</td>
                            <td className="px-4 py-3 text-gray-300">
                              <span className="text-lg font-bold">{record.attendance_percentage}%</span>
                            </td>
                            <td className="px-4 py-3">
                              {record.attendance_percentage >= 75 ? (
                                <Badge variant="success" size="sm">✓ Good</Badge>
                              ) : (
                                <Badge variant="danger" size="sm">✗ Need Improvement</Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Marks Tab */}
            {activeTab === 'marks' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">📊 Marks and Results</h2>
                {marks.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">No marks records found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-white/20">
                        <tr>
                          <th className="px-4 py-3 text-left text-gray-300 font-semibold text-sm uppercase">Subject</th>
                          <th className="px-4 py-3 text-left text-gray-300 font-semibold text-sm uppercase">Internal</th>
                          <th className="px-4 py-3 text-left text-gray-300 font-semibold text-sm uppercase">External</th>
                          <th className="px-4 py-3 text-left text-gray-300 font-semibold text-sm uppercase">Total</th>
                          <th className="px-4 py-3 text-left text-gray-300 font-semibold text-sm uppercase">Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {marks.map((mark) => {
                          const total = calculateTotalMarks(mark)
                          const percentage = (total / 100) * 100
                          return (
                            <tr key={mark.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                              <td className="px-4 py-3 text-white">{mark.subject}</td>
                              <td className="px-4 py-3 text-gray-300 font-semibold">{mark.internal_marks}</td>
                              <td className="px-4 py-3 text-gray-300 font-semibold">{mark.external_marks}</td>
                              <td className="px-4 py-3 text-white font-bold text-lg">{total}</td>
                              <td className="px-4 py-3">
                                {total >= 60 ? (
                                  <Badge variant="success" size="sm">{percentage.toFixed(1)}%</Badge>
                                ) : (
                                  <Badge variant="danger" size="sm">{percentage.toFixed(1)}%</Badge>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default StudentDashboard
