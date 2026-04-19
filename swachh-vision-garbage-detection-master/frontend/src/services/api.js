import axios from 'axios'
import toast from 'react-hot-toast'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 60000, // 60 seconds timeout for better reliability
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - No authentication needed
api.interceptors.request.use(
  (config) => {
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data)
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data)
    }
    
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Log error in development
    if (import.meta.env.DEV) {
      console.error(`❌ API Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, error.response?.data || error.message)
    }

    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          toast.error(data.error || 'Bad request')
          break
        case 401:
          toast.error('Unauthorized access')
          break
        case 403:
          toast.error('Access forbidden')
          break
        case 404:
          toast.error('Resource not found')
          break
        case 422:
          toast.error(data.error || 'Validation error')
          break
        case 429:
          toast.error('Too many requests. Please try again later.')
          break
        case 500:
          toast.error('Server error. Please try again later.')
          break
        default:
          toast.error(data.error || 'An error occurred')
      }
    } else if (error.request) {
      // Request was made but no response received
      toast.error('Network error. Please check your connection.')
    } else {
      // Something else happened
      toast.error('An unexpected error occurred')
    }

    return Promise.reject(error)
  }
)

// API service methods - No authentication
export const detectionAPI = {
  detectImage: (formData) => api.post('/api/detect/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  detectVideo: (formData) => api.post('/api/detect/video', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getDetectionStatus: (detectionId) => api.get(`/api/detect/status/${detectionId}`),
  getDetections: (params) => api.get('/api/detect/detections', { params }),
  getDetection: (detectionId) => api.get(`/api/detect/detections/${detectionId}`),
  startLiveDetection: () => api.post('/api/detect/live'),
  detectFrame: (formData) => api.post('/api/detect/frame', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
}

export const alertsAPI = {
  getAlerts: (params) => api.get('/api/alerts', { params }),
  getAlert: (alertId) => api.get(`/api/alerts/${alertId}`),
  deleteAlert: (alertId) => api.delete(`/api/alerts/${alertId}`),
  clearAlerts: (params) => api.delete('/api/alerts/clear', { params }),
  getAlertStats: (params) => api.get('/api/alerts/stats', { params }),
  testEmailAlert: () => api.post('/api/alerts/test'),
  getAlertSettings: () => api.get('/api/alerts/settings'),
  updateAlertSettings: (settings) => api.put('/api/alerts/settings', settings),
}

export const dashboardAPI = {
  getStats: (params) => api.get('/api/dashboard/stats', { params }),
  getTimeline: (params) => api.get('/api/dashboard/timeline', { params }),
  getHeatmap: (params) => api.get('/api/dashboard/heatmap', { params }),
  getGarbageTypes: (params) => api.get('/api/dashboard/garbage-types', { params }),
  getPerformance: (params) => api.get('/api/dashboard/performance', { params }),
}

export default api
