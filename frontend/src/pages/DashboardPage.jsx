/**
 * Dashboard router component - routes to role-based dashboards
 */
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../utils/auth'
import AdminDashboard from './dashboards/AdminDashboard'
import HODDashboard from './dashboards/HODDashboard'
import FacultyDashboard from './dashboards/FacultyDashboard'
import StudentDashboard from './dashboards/StudentDashboard'

const DashboardPage = () => {
  const navigate = useNavigate()
  const user = getCurrentUser()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user) {
    return null
  }

  // Route to appropriate dashboard based on role
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />
    case 'hod':
      return <HODDashboard />
    case 'faculty':
      return <FacultyDashboard />
    case 'student':
      return <StudentDashboard />
    default:
      return <div className="text-center mt-8">Unknown role</div>
  }
}

export default DashboardPage
