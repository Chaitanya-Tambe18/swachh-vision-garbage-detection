import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { dashboardAPI } from '../services/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EnhancedCard from '../components/ui/EnhancedCard'
import HeroSection from '../components/ui/HeroSection'
import IndianFlag from '../components/ui/IndianFlag'
import AnimatedBackground from '../components/ui/AnimatedBackground'
import {
  ChartBarIcon,
  CameraIcon,
  TrashIcon,
  BellIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'

const DashboardPage = () => {
  const [stats, setStats] = useState(null)
  const [timeline, setTimeline] = useState([])
  const [heatmap, setHeatmap] = useState({ hourly: [], weekly: [] })
  const [garbageTypes, setGarbageTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [statsRes, timelineRes, heatmapRes, garbageTypesRes] = await Promise.all([
        dashboardAPI.getStats({ period: 30 }),
        dashboardAPI.getTimeline({ period: 30, granularity: 'daily' }),
        dashboardAPI.getHeatmap({ period: 30 }),
        dashboardAPI.getGarbageTypes({ period: 30 }),
      ])

      setStats(statsRes.data)
      setTimeline(timelineRes.data.timeline)
      setHeatmap({
        hourly: heatmapRes.data.hourly_pattern,
        weekly: heatmapRes.data.weekly_pattern,
      })
      setGarbageTypes(garbageTypesRes.data.garbage_types)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const cleanlinessColors = {
    LOW: '#10b981',
    MEDIUM: '#f59e0b',
    HIGH: '#ef4444',
  }

  const pieColors = ['#FF9933', '#138808', '#000080', '#6366f1', '#ec4899', '#14b8a6']

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <AnimatedBackground>
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <HeroSection
            title="🇮🇳 Swachh Vision Dashboard"
            subtitle="AI-powered garbage detection system for a cleaner India"
          >
            <motion.div
              className="flex flex-wrap justify-center gap-4"
              variants={itemVariants}
            >
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <SparklesIcon className="w-5 h-5 inline mr-2" />
                Start Detection
              </motion.button>
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChartBarIcon className="w-5 h-5 inline mr-2" />
                View Analytics
              </motion.button>
            </motion.div>
          </HeroSection>

          {/* Stats Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            <EnhancedCard delay={0.1} glow={true}>
              <div className="flex items-center">
                <motion.div
                  className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <CameraIcon className="h-6 w-6 text-white" />
                </motion.div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Detections</p>
                  <motion.p 
                    className="text-2xl font-bold text-gray-900"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    {stats?.total_detections || 0}
                  </motion.p>
                </div>
              </div>
            </EnhancedCard>

            <EnhancedCard delay={0.2} glow={true}>
              <div className="flex items-center">
                <motion.div
                  className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <TrashIcon className="h-6 w-6 text-white" />
                </motion.div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Garbage Detected</p>
                  <motion.p 
                    className="text-2xl font-bold text-gray-900"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    {stats?.total_garbage_detected || 0}
                  </motion.p>
                </div>
              </div>
            </EnhancedCard>

            <EnhancedCard delay={0.3} glow={true}>
              <div className="flex items-center">
                <motion.div
                  className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <BellIcon className="h-6 w-6 text-white" />
                </motion.div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Alerts Sent</p>
                  <motion.p 
                    className="text-2xl font-bold text-gray-900"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    {stats?.sent_alerts || 0}
                  </motion.p>
                </div>
              </div>
            </EnhancedCard>

            <EnhancedCard delay={0.4} glow={true}>
              <div className="flex items-center">
                <motion.div
                  className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowTrendingUpIcon className="h-6 w-6 text-white" />
                </motion.div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
                  <motion.p 
                    className="text-2xl font-bold text-gray-900"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    {stats?.average_confidence ? (stats.average_confidence * 100).toFixed(1) : 0}%
                  </motion.p>
                </div>
              </div>
            </EnhancedCard>
          </motion.div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Timeline Chart */}
            <EnhancedCard delay={0.5} hover={true}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <motion.div
                  className="w-2 h-2 bg-blue-500 rounded-full mr-2"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                Detection Timeline
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timeline}>
                  <defs>
                    <linearGradient id="colorDetections" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorGarbage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area type="monotone" dataKey="detections" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDetections)" strokeWidth={2} />
                  <Area type="monotone" dataKey="garbage_count" stroke="#10b981" fillOpacity={1} fill="url(#colorGarbage)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </EnhancedCard>

            {/* Cleanliness Distribution */}
            <EnhancedCard delay={0.6} hover={true}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <motion.div
                  className="w-2 h-2 bg-green-500 rounded-full mr-2"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                Cleanliness Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats?.cleanliness_distribution || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ level, count, percentage }) => `${level}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {(stats?.cleanliness_distribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={cleanlinessColors[entry.level] || '#8884d8'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </EnhancedCard>
          </div>

          {/* Heatmaps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Hourly Pattern */}
            <EnhancedCard delay={0.7} hover={true}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <motion.div
                  className="w-2 h-2 bg-orange-500 rounded-full mr-2"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
                Hourly Detection Pattern
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={heatmap.hourly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="hour" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="detections" fill="url(#orangeGradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF9933" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#FF9933" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </EnhancedCard>

            {/* Weekly Pattern */}
            <EnhancedCard delay={0.8} hover={true}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <motion.div
                  className="w-2 h-2 bg-indigo-500 rounded-full mr-2"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                />
                Weekly Detection Pattern
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={heatmap.weekly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day_name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="detections" fill="url(#greenGradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#138808" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#138808" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </EnhancedCard>
          </div>

          {/* Garbage Types */}
          <EnhancedCard delay={0.9} hover={true}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <motion.div
                className="w-2 h-2 bg-purple-500 rounded-full mr-2"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 2 }}
              />
              Detected Garbage Types
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={garbageTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, percentage }) => `${type}: ${percentage.toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {garbageTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="space-y-3">
                {garbageTypes.map((type, index) => (
                  <motion.div
                    key={type.type}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <div className="flex items-center">
                      <motion.div
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: pieColors[index % pieColors.length] }}
                        whileHover={{ scale: 1.2 }}
                      />
                      <span className="text-sm font-medium text-gray-700">{type.type}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900">{type.count}</span>
                      <span className="text-xs text-gray-500 ml-2">({type.percentage.toFixed(1)}%)</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </EnhancedCard>
        </div>
      </div>
    </AnimatedBackground>
  )
}

export default DashboardPage
