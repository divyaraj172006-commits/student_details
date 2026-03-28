/**
 * Authentication API endpoints
 */
import apiClient from './api'

export const authService = {
  /**
   * Sign up a new user
   */
  signup: async (name, email, password, role) => {
    const response = await apiClient.post('/auth/signup', {
      name,
      email,
      password,
      role,
    })
    return response.data
  },

  /**
   * Login with email and password
   */
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    })
    return response.data
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me')
    return response.data
  },

  /**
   * Logout user (local only, no backend call needed)
   */
  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
  },
}

/**
 * Student API endpoints
 */
export const studentService = {
  /**
   * Register a new student
   */
  registerStudent: async (data) => {
    const response = await apiClient.post('/students/', data)
    return response.data
  },

  /**
   * Get all students
   */
  getAllStudents: async () => {
    const response = await apiClient.get('/students/')
    return response.data
  },

  /**
   * Get current student's profile
   */
  getMyProfile: async () => {
    const response = await apiClient.get('/students/my-profile')
    return response.data
  },

  /**
   * Get specific student
   */
  getStudent: async (studentId) => {
    const response = await apiClient.get(`/students/${studentId}`)
    return response.data
  },

  /**
   * Update student information
   */
  updateStudent: async (studentId, data) => {
    const response = await apiClient.put(`/students/${studentId}`, data)
    return response.data
  },

  /**
   * Delete student
   */
  deleteStudent: async (studentId) => {
    const response = await apiClient.delete(`/students/${studentId}`)
    return response.data
  },
}

/**
 * Attendance API endpoints
 */
export const attendanceService = {
  /**
   * Create or update attendance record
   */
  createAttendance: async (data) => {
    const response = await apiClient.post('/attendance/', data)
    return response.data
  },

  /**
   * Get student's attendance records
   */
  getStudentAttendance: async (studentId) => {
    const response = await apiClient.get(`/attendance/student/${studentId}`)
    return response.data
  },

  /**
   * Get current student's attendance
   */
  getMyAttendance: async () => {
    const response = await apiClient.get('/attendance/my-attendance')
    return response.data
  },

  /**
   * Update attendance record
   */
  updateAttendance: async (attendanceId, data) => {
    const response = await apiClient.put(`/attendance/${attendanceId}`, data)
    return response.data
  },

  /**
   * Delete attendance record
   */
  deleteAttendance: async (attendanceId) => {
    const response = await apiClient.delete(`/attendance/${attendanceId}`)
    return response.data
  },
}

/**
 * Marks API endpoints
 */
export const marksService = {
  /**
   * Create or update marks record
   */
  createMarks: async (data) => {
    const response = await apiClient.post('/marks/', data)
    return response.data
  },

  /**
   * Get student's marks records
   */
  getStudentMarks: async (studentId) => {
    const response = await apiClient.get(`/marks/student/${studentId}`)
    return response.data
  },

  /**
   * Get current student's marks
   */
  getMyMarks: async () => {
    const response = await apiClient.get('/marks/my-marks')
    return response.data
  },

  /**
   * Get current student's SGPA and CGPA
   */
  getMyGPA: async () => {
    const response = await apiClient.get('/marks/my-gpa')
    return response.data
  },

  /**
   * Get specific student's GPA
   */
  getStudentGPA: async (studentId) => {
    const response = await apiClient.get(`/marks/student/${studentId}/gpa`)
    return response.data
  },

  /**
   * Update marks record
   */
  updateMarks: async (marksId, data) => {
    const response = await apiClient.put(`/marks/${marksId}`, data)
    return response.data
  },

  /**
   * Delete marks record
   */
  deleteMarks: async (marksId) => {
    const response = await apiClient.delete(`/marks/${marksId}`)
    return response.data
  },
}
