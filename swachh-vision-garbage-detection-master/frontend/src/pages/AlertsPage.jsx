import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { alertsAPI } from '../services/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import {
  BellIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  FunnelIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    alert_type: '',
    email_sent: '',
    start_date: '',
    end_date: '',
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchAlerts()
    fetchStats()
  }, [filters])

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      const response = await alertsAPI.getAlerts(filters)
      setAlerts(response.data.alerts)
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
      setError('Failed to load alerts')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await alertsAPI.getAlertStats({ period: 30 })
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch alert stats:', error)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      alert_type: '',
      email_sent: '',
      start_date: '',
      end_date: '',
    })
  }

  const deleteAlert = async (alertId) => {
    try {
      await alertsAPI.deleteAlert(alertId)
      setAlerts(prev => prev.filter(alert => alert.id !== alertId))
      toast.success('Alert deleted successfully')
    } catch (error) {
      console.error('Failed to delete alert:', error)
      toast.error('Failed to delete alert')
    }
  }

  const clearAllAlerts = async () => {
    if (!confirm('Are you sure you want to clear all alerts? This action cannot be undone.')) {
      return
    }

    try {
      await alertsAPI.clearAlerts(filters)
      setAlerts([])
      toast.success('All alerts cleared successfully')
    } catch (error) {
      console.error('Failed to clear alerts:', error)
      toast.error('Failed to clear alerts')
    }
  }

  const sendTestEmail = async () => {
    try {
      await alertsAPI.testEmailAlert()
      toast.success('Test email sent successfully')
    } catch (error) {
      console.error('Failed to send test email:', error)
      toast.error('Failed to send test email')
    }
  }

  const getStatusColor = (emailSent) => {
    return emailSent ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100'
  }

  const getStatusIcon = (emailSent) => {
    return emailSent ? <CheckCircleIcon className="h-4 w-4" /> : <ExclamationTriangleIcon className="h-4 w-4" />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Alerts</h1>
              <p className="text-gray-600">
                Manage your garbage detection alerts and notifications.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={sendTestEmail}
                className="btn-secondary flex items-center"
              >
                <EnvelopeIcon className="h-4 w-4 mr-2" />
                Test Email
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary flex items-center"
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="stat-card">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BellIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Alerts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_alerts}</p>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Sent Successfully</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.sent_alerts}</p>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-lg">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Failed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.failed_alerts}</p>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <CalendarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.success_rate.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card mb-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alert Type</label>
                <select
                  value={filters.alert_type}
                  onChange={(e) => handleFilterChange('alert_type', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Types</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="push">Push</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.email_sent}
                  onChange={(e) => handleFilterChange('email_sent', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Status</option>
                  <option value="true">Sent</option>
                  <option value="false">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={filters.start_date}
                  onChange={(e) => handleFilterChange('start_date', e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={filters.end_date}
                  onChange={(e) => handleFilterChange('end_date', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex justify-end mt-4 space-x-3">
              <button
                onClick={clearFilters}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          </motion.div>
        )}

        {/* Alerts List */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Alert History</h3>
            {alerts.length > 0 && (
              <button
                onClick={clearAllAlerts}
                className="btn-danger flex items-center text-sm"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Clear All
              </button>
            )}
          </div>

          {alerts.length === 0 ? (
            <div className="text-center py-12">
              <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
              <p className="text-gray-600">
                {Object.values(filters).some(v => v) 
                  ? 'Try adjusting your filters' 
                  : 'Alerts will appear here when garbage is detected'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {alerts.map((alert) => (
                    <motion.tr
                      key={alert.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {alert.alert_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {alert.recipient}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs truncate" title={alert.subject}>
                          {alert.subject}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full flex items-center ${getStatusColor(alert.email_sent)}`}>
                          {getStatusIcon(alert.email_sent)}
                          <span className="ml-1">
                            {alert.email_sent ? 'Sent' : 'Failed'}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(alert.created_at), 'MMM d, yyyy HH:mm')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => deleteAlert(alert.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AlertsPage
