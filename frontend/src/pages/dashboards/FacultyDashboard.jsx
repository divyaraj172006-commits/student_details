/**
 * Faculty Dashboard - Upload attendance and marks
 */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentService, attendanceService, marksService } from '../../services'
import { getCurrentUser } from '../../utils/auth'
import { Button, Input, Card, Spinner, Alert } from '../../components/UI'

const FacultyDashboard = () => {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState('attendance')
  const [showForm, setShowForm] = useState(false)

  // Attendance form state
  const [attendanceForm, setAttendanceForm] = useState({
    student_id: '',
    subject: '',
    attendance_percentage: '',
  })

  // Marks form state
  const [marksForm, setMarksForm] = useState({
    student_id: '',
    subject: '',
    internal_marks: '',
    external_marks: '',
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

  const handleAddAttendance = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!attendanceForm.student_id || !attendanceForm.subject || !attendanceForm.attendance_percentage) {
      setError('Please fill all fields')
      return
    }

    try {
      await attendanceService.createAttendance({
        ...attendanceForm,
        student_id: parseInt(attendanceForm.student_id),
        attendance_percentage: parseFloat(attendanceForm.attendance_percentage),
      })
      setSuccess('Attendance added successfully!')
      setAttendanceForm({ student_id: '', subject: '', attendance_percentage: '' })
      setShowForm(false)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add attendance')
    }
  }

  const handleAddMarks = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!marksForm.student_id || !marksForm.subject || !marksForm.internal_marks || !marksForm.external_marks) {
      setError('Please fill all fields')
      return
    }

    try {
      await marksService.createMarks({
        ...marksForm,
        student_id: parseInt(marksForm.student_id),
        internal_marks: parseFloat(marksForm.internal_marks),
        external_marks: parseFloat(marksForm.external_marks),
      })
      setSuccess('Marks added successfully!')
      setMarksForm({ student_id: '', subject: '', internal_marks: '', external_marks: '' })
      setShowForm(false)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add marks')
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
            <h1 className="text-3xl font-bold text-gray-900">Faculty Dashboard</h1>
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
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <h3 className="text-gray-500 text-sm font-semibold uppercase">Total Students</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{students.length}</p>
          </Card>
          <Card>
            <h3 className="text-gray-500 text-sm font-semibold uppercase">Subjects</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">4</p>
          </Card>
          <Card>
            <h3 className="text-gray-500 text-sm font-semibold uppercase">Your Role</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">Faculty</p>
          </Card>
        </div>

        {/* Tabs */}
        <Card>
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
              <button
                onClick={() => { setActiveTab('attendance'); setShowForm(false) }}
                className={`pb-2 px-1 ${activeTab === 'attendance' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'} font-medium`}
              >
                📋 Attendance
              </button>
              <button
                onClick={() => { setActiveTab('marks'); setShowForm(false) }}
                className={`pb-2 px-1 ${activeTab === 'marks' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'} font-medium`}
              >
                📊 Marks
              </button>
            </div>
          </div>

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Attendance Management</h2>
                <Button
                  variant={showForm ? 'secondary' : 'primary'}
                  onClick={() => setShowForm(!showForm)}
                >
                  {showForm ? 'Cancel' : '+ Add Attendance'}
                </Button>
              </div>

              {showForm && (
                <form onSubmit={handleAddAttendance} className="bg-gray-50 p-4 rounded mb-4 space-y-3">
                  <select
                    value={attendanceForm.student_id}
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, student_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Student</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (ID: {s.id})
                      </option>
                    ))}
                  </select>
                  <Input
                    label="Subject"
                    value={attendanceForm.subject}
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, subject: e.target.value })}
                    placeholder="Enter subject name"
                  />
                  <Input
                    label="Attendance %"
                    type="number"
                    min="0"
                    max="100"
                    value={attendanceForm.attendance_percentage}
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, attendance_percentage: e.target.value })}
                    placeholder="Enter attendance percentage"
                  />
                  <Button type="submit" variant="success">
                    Add Attendance
                  </Button>
                </form>
              )}
            </div>
          )}

          {/* Marks Tab */}
          {activeTab === 'marks' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Marks Management</h2>
                <Button
                  variant={showForm ? 'secondary' : 'primary'}
                  onClick={() => setShowForm(!showForm)}
                >
                  {showForm ? 'Cancel' : '+ Add Marks'}
                </Button>
              </div>

              {showForm && (
                <form onSubmit={handleAddMarks} className="bg-gray-50 p-4 rounded mb-4 space-y-3">
                  <select
                    value={marksForm.student_id}
                    onChange={(e) => setMarksForm({ ...marksForm, student_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Student</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (ID: {s.id})
                      </option>
                    ))}
                  </select>
                  <Input
                    label="Subject"
                    value={marksForm.subject}
                    onChange={(e) => setMarksForm({ ...marksForm, subject: e.target.value })}
                    placeholder="Enter subject name"
                  />
                  <Input
                    label="Internal Marks (0-50)"
                    type="number"
                    min="0"
                    max="50"
                    value={marksForm.internal_marks}
                    onChange={(e) => setMarksForm({ ...marksForm, internal_marks: e.target.value })}
                    placeholder="Enter internal marks"
                  />
                  <Input
                    label="External Marks (0-50)"
                    type="number"
                    min="0"
                    max="50"
                    value={marksForm.external_marks}
                    onChange={(e) => setMarksForm({ ...marksForm, external_marks: e.target.value })}
                    placeholder="Enter external marks"
                  />
                  <Button type="submit" variant="success">
                    Add Marks
                  </Button>
                </form>
              )}
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}

export default FacultyDashboard
