import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { detectionAPI } from '../services/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EnhancedCard from '../components/ui/EnhancedCard'
import AnimatedBackground from '../components/ui/AnimatedBackground'
import IndianFlag from '../components/ui/IndianFlag'
import Webcam from 'react-webcam'
import {
  CameraIcon,
  PhotoIcon,
  VideoCameraIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlayIcon,
  StopIcon,
  SparklesIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const DetectionPage = () => {
  const [activeTab, setActiveTab] = useState('image')
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isLiveDetection, setIsLiveDetection] = useState(false)
  const [liveResults, setLiveResults] = useState([])
  const webcamRef = useRef(null)
  const intervalRef = useRef(null)

  // Image upload
  const onDropImage = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedFile(file)
      setResult(null)
      setError(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropImage,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp'],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
  })

  // Video upload
  const onDropVideo = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedFile(file)
      setResult(null)
      setError(null)
    }
  }, [])

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps, isDragActive: isVideoDragActive } = useDropzone({
    onDrop: onDropVideo,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv', '.webm'],
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024, // 100MB
  })

  // Process uploaded file with enhanced error handling
  const processFile = async () => {
    if (!uploadedFile) {
      toast.error('Please select a file first')
      return
    }

    try {
      setProcessing(true)
      setError(null)
      setResult(null)

      const formData = new FormData()
      formData.append(activeTab === 'image' ? 'image' : 'video', uploadedFile)

      let response
      if (activeTab === 'image') {
        response = await detectionAPI.detectImage(formData)
      } else {
        response = await detectionAPI.detectVideo(formData)
      }

      setResult(response.data.detection)
      toast.success(`${activeTab === 'image' ? 'Image' : 'Video'} processed successfully!`, {
        icon: activeTab === 'image' ? '📸' : '🎥',
        style: {
          background: 'linear-gradient(135deg, #FF9933, #138808)',
          color: 'white',
        },
      })
    } catch (error) {
      console.error('Detection failed:', error)
      const errorMessage = error.response?.data?.error || 'Detection failed. Please try again.'
      setError(errorMessage)
      
      // Enhanced error toast with Indian flag theme
      toast.error(errorMessage, {
        icon: '⚠️',
        style: {
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: 'white',
        },
      })
    } finally {
      setProcessing(false)
    }
  }

  // Live detection
  const startLiveDetection = async () => {
    try {
      const response = await detectionAPI.startLiveDetection()
      console.log('Live detection config:', response.data)
      setIsLiveDetection(true)
      toast.success('Live detection started!')

      // Start capturing frames
      intervalRef.current = setInterval(captureFrame, 2000) // Every 2 seconds
    } catch (error) {
      console.error('Failed to start live detection:', error)
      toast.error('Failed to start live detection')
    }
  }

  const stopLiveDetection = () => {
    setIsLiveDetection(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    toast.success('Live detection stopped')
  }

  const captureFrame = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      if (imageSrc) {
        try {
          // Convert base64 to blob
          const blob = await fetch(imageSrc).then(res => res.blob())
          const file = new File([blob], 'frame.jpg', { type: 'image/jpeg' })

          const formData = new FormData()
          formData.append('frame', file)

          const response = await detectionAPI.detectFrame(formData)
          setLiveResults(prev => [response.data.result, ...prev.slice(0, 4)]) // Keep last 5 results
        } catch (error) {
          console.error('Frame detection failed:', error)
        }
      }
    }
  }

  const getCleanlinessColor = (level) => {
    switch (level) {
      case 'LOW': return 'text-green-600 bg-green-100'
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100'
      case 'HIGH': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCleanlinessIcon = (level) => {
    switch (level) {
      case 'LOW': return <CheckCircleIcon className="h-5 w-5" />
      case 'MEDIUM': return <ExclamationTriangleIcon className="h-5 w-5" />
      case 'HIGH': return <ExclamationTriangleIcon className="h-5 w-5" />
      default: return null
    }
  }

  return (
    <AnimatedBackground>
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <IndianFlag size="large" animated={true} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 via-white to-green-600 bg-clip-text text-transparent mb-4">
              🇮🇳 Garbage Detection System
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Advanced AI-powered detection for images, videos, and live webcam feeds. 
              Help keep India clean with smart technology.
            </p>
          </motion.div>

          {/* Enhanced Tabs */}
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-2 inline-flex">
              {['image', 'video', 'live'].map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 capitalize ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-orange-500 to-green-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tab === 'live' ? (
                    <span className="flex items-center">
                      <CameraIcon className="h-5 w-5 mr-2" />
                      Live Detection
                    </span>
                  ) : tab === 'image' ? (
                    <span className="flex items-center">
                      <PhotoIcon className="h-5 w-5 mr-2" />
                      Image Detection
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <VideoCameraIcon className="h-5 w-5 mr-2" />
                      Video Detection
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {activeTab === 'image' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Enhanced Upload Area */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <EnhancedCard>
                      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                        <PhotoIcon className="h-6 w-6 mr-2 text-orange-500" />
                        Upload Image
                      </h3>
                      
                      <div
                        {...getRootProps()}
                        className={`border-3 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                          isDragActive
                            ? 'border-green-500 bg-gradient-to-br from-orange-50 to-green-50 scale-102'
                            : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                        }`}
                      >
                        <input {...getInputProps()} />
                        <motion.div
                          animate={{ 
                            scale: isDragActive ? 1.1 : 1,
                            rotate: isDragActive ? 5 : 0
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <PhotoIcon className={`mx-auto h-16 w-16 mb-4 ${isDragActive ? 'text-green-500' : 'text-gray-400'}`} />
                        </motion.div>
                        {isDragActive ? (
                          <motion.p 
                            className="text-green-600 font-bold text-lg"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            Drop image here! 🎯
                          </motion.p>
                        ) : (
                          <div>
                            <p className="text-gray-700 font-medium mb-2">Drag & drop an image here</p>
                            <p className="text-gray-500 text-sm">or click to browse files</p>
                            <p className="text-gray-400 text-xs mt-2">PNG, JPG, GIF up to 50MB</p>
                          </div>
                        )}
                      </div>

                      <AnimatePresence>
                        {uploadedFile && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-green-50 rounded-lg border border-orange-200"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <PhotoIcon className="h-5 w-5 text-orange-500 mr-2" />
                                <span className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                  {uploadedFile.name}
                                </span>
                              </div>
                              <motion.button
                                onClick={() => setUploadedFile(null)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <XMarkIcon className="h-5 w-5" />
                              </motion.button>
                            </div>
                            
                            {/* Image Preview */}
                            {uploadedFile && (
                              <div className="mb-4">
                                <img
                                  src={URL.createObjectURL(uploadedFile)}
                                  alt="Preview"
                                  className="w-full h-48 object-cover rounded-lg shadow-md"
                                />
                              </div>
                            )}
                            
                            <motion.button
                              onClick={processFile}
                              disabled={processing}
                              className="w-full py-3 bg-gradient-to-r from-orange-500 to-green-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                              whileHover={{ scale: processing ? 1 : 1.02 }}
                              whileTap={{ scale: processing ? 1 : 0.98 }}
                            >
                              {processing ? (
                                <>
                                  <LoadingSpinner size="small" />
                                  <span className="ml-2">Processing...</span>
                                </>
                              ) : (
                                <>
                                  <SparklesIcon className="h-5 w-5 mr-2" />
                                  Detect Garbage
                                </>
                              )}
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </EnhancedCard>
                  </motion.div>

                  {/* Enhanced Results */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <AnimatePresence>
                      {result && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.5 }}
                        >
                          <EnhancedCard glow={true}>
                            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                              <CheckCircleIcon className="h-6 w-6 mr-2 text-green-500" />
                              Detection Results
                            </h3>
                            
                            <div className="space-y-4">
                              {/* Cleanliness Level */}
                              <motion.div 
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                whileHover={{ scale: 1.02, x: 5 }}
                              >
                                <span className="text-sm font-medium text-gray-600">Cleanliness Level</span>
                                <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center ${getCleanlinessColor(result.cleanliness_level)}`}>
                                  {getCleanlinessIcon(result.cleanliness_level)}
                                  <span className="ml-2">{result.cleanliness_level}</span>
                                </span>
                              </motion.div>

                              {/* Garbage Objects */}
                              <motion.div 
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                whileHover={{ scale: 1.02, x: 5 }}
                              >
                                <span className="text-sm font-medium text-gray-600">Garbage Objects</span>
                                <span className="text-2xl font-bold text-orange-600">{result.garbage_count}</span>
                              </motion.div>

                              {/* Confidence Score */}
                              <motion.div 
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                whileHover={{ scale: 1.02, x: 5 }}
                              >
                                <span className="text-sm font-medium text-gray-600">Confidence Score</span>
                                <span className="text-2xl font-bold text-green-600">
                                  {(result.confidence_score * 100).toFixed(1)}%
                                </span>
                              </motion.div>

                              {/* Processing Time */}
                              <motion.div 
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                whileHover={{ scale: 1.02, x: 5 }}
                              >
                                <span className="text-sm font-medium text-gray-600">Processing Time</span>
                                <span className="text-2xl font-bold text-blue-600">
                                  {result.processing_time?.toFixed(2)}s
                                </span>
                              </motion.div>

                              {/* Processed Image */}
                              {result.processed_file_path && (
                                <motion.div 
                                  className="pt-4 border-t border-gray-200"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.5 }}
                                >
                                  <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                    <PhotoIcon className="h-4 w-4 mr-2" />
                                    Processed Image with Detections
                                  </p>
                                  <motion.img
                                    src={`http://localhost:5000/${result.processed_file_path}`}
                                    alt="Processed detection"
                                    className="w-full rounded-lg shadow-lg"
                                    whileHover={{ scale: 1.02 }}
                                    onError={(e) => {
                                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage not available%3C/text%3E%3C/svg%3E'
                                    }}
                                  />
                                </motion.div>
                              )}
                            </div>
                          </EnhancedCard>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Error Display */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="mt-6"
                        >
                          <EnhancedCard>
                            <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                              <div className="flex items-start">
                                <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-1" />
                                <div>
                                  <h4 className="text-lg font-semibold text-red-800 mb-2">Detection Failed</h4>
                                  <p className="text-red-700 mb-4">{error}</p>
                                  <motion.button
                                    onClick={() => setError(null)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <ArrowPathIcon className="h-4 w-4 mr-2" />
                                    Try Again
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </EnhancedCard>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              )}

              {/* Video Detection Tab */}
              {activeTab === 'video' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Enhanced Video Upload Area */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <EnhancedCard>
                      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                        <VideoCameraIcon className="h-6 w-6 mr-2 text-blue-500" />
                        Upload Video
                      </h3>
                      
                      <div
                        {...getVideoRootProps()}
                        className={`border-3 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                          isVideoDragActive
                            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50'
                            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                        }`}
                      >
                        <input {...getVideoInputProps()} />
                        <motion.div
                          animate={{ 
                            scale: isVideoDragActive ? 1.1 : 1,
                            rotate: isVideoDragActive ? 5 : 0
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <VideoCameraIcon className={`mx-auto h-16 w-16 mb-4 ${isVideoDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
                        </motion.div>
                        {isVideoDragActive ? (
                          <motion.p 
                            className="text-blue-600 font-bold text-lg"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            Drop video here! 🎥
                          </motion.p>
                        ) : (
                          <div>
                            <p className="text-gray-700 font-medium mb-2">Drag & drop a video here</p>
                            <p className="text-gray-500 text-sm">or click to browse files</p>
                            <p className="text-gray-400 text-xs mt-2">MP4, AVI, MOV up to 100MB</p>
                          </div>
                        )}
                      </div>

                      <AnimatePresence>
                        {uploadedFile && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <VideoCameraIcon className="h-5 w-5 text-blue-500 mr-2" />
                                <span className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                  {uploadedFile.name}
                                </span>
                              </div>
                              <motion.button
                                onClick={() => setUploadedFile(null)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <XMarkIcon className="h-5 w-5" />
                              </motion.button>
                            </div>
                            
                            <motion.button
                              onClick={processFile}
                              disabled={processing}
                              className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                              whileHover={{ scale: processing ? 1 : 1.02 }}
                              whileTap={{ scale: processing ? 1 : 0.98 }}
                            >
                              {processing ? (
                                <>
                                  <LoadingSpinner size="small" />
                                  <span className="ml-2">Processing...</span>
                                </>
                              ) : (
                                <>
                                  <SparklesIcon className="h-5 w-5 mr-2" />
                                  Process Video
                                </>
                              )}
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </EnhancedCard>
                  </motion.div>

                  {/* Video Results */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <AnimatePresence>
                      {result && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.5 }}
                        >
                          <EnhancedCard glow={true}>
                            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                              <CheckCircleIcon className="h-6 w-6 mr-2 text-green-500" />
                              Video Processing Results
                            </h3>
                            
                            <div className="space-y-4">
                              <motion.div 
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                whileHover={{ scale: 1.02, x: 5 }}
                              >
                                <span className="text-sm font-medium text-gray-600">Status</span>
                                <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                                  result.status === 'completed' 
                                    ? 'text-green-600 bg-green-100' 
                                    : 'text-yellow-600 bg-yellow-100'
                                }`}>
                                  {result.status}
                                </span>
                              </motion.div>

                              <motion.div 
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                whileHover={{ scale: 1.02, x: 5 }}
                              >
                                <span className="text-sm font-medium text-gray-600">Total Garbage</span>
                                <span className="text-2xl font-bold text-blue-600">{result.garbage_count}</span>
                              </motion.div>

                              <motion.div 
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                whileHover={{ scale: 1.02, x: 5 }}
                              >
                                <span className="text-sm font-medium text-gray-600">Cleanliness Level</span>
                                <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center ${getCleanlinessColor(result.cleanliness_level)}`}>
                                  {getCleanlinessIcon(result.cleanliness_level)}
                                  <span className="ml-2">{result.cleanliness_level}</span>
                                </span>
                              </motion.div>

                              <motion.div 
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                whileHover={{ scale: 1.02, x: 5 }}
                              >
                                <span className="text-sm font-medium text-gray-600">Confidence Score</span>
                                <span className="text-2xl font-bold text-green-600">
                                  {(result.confidence_score * 100).toFixed(1)}%
                                </span>
                              </motion.div>
                            </div>
                          </EnhancedCard>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              )}

              {/* Live Detection Tab */}
              {activeTab === 'live' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Webcam */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <EnhancedCard>
                      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                        <CameraIcon className="h-6 w-6 mr-2 text-red-500" />
                        Live Webcam Detection
                      </h3>
                      
                      {!isLiveDetection ? (
                        <div className="space-y-6">
                          <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center">
                            <CameraIcon className="h-20 w-20 text-gray-500" />
                          </div>
                          <motion.button
                            onClick={startLiveDetection}
                            className="w-full py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl flex items-center justify-center"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <PlayIcon className="h-6 w-6 mr-3" />
                            Start Live Detection
                          </motion.button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="relative">
                            <Webcam
                              ref={webcamRef}
                              screenshotFormat="image/jpeg"
                              className="w-full rounded-xl shadow-2xl"
                            />
                            <motion.div
                              className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full"
                              animate={{ opacity: [1, 0.3, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                            <span className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-lg">
                              LIVE
                            </span>
                          </div>
                          <motion.button
                            onClick={stopLiveDetection}
                            className="w-full py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl flex items-center justify-center"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <StopIcon className="h-6 w-6 mr-3" />
                            Stop Detection
                          </motion.button>
                        </div>
                      )}
                    </EnhancedCard>
                  </motion.div>

                  {/* Live Results */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <EnhancedCard>
                      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                        <SparklesIcon className="h-6 w-6 mr-2 text-purple-500" />
                        Recent Detections
                      </h3>
                      
                      {liveResults.length === 0 ? (
                        <div className="text-center py-12">
                          <CameraIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 text-lg">Start live detection to see results</p>
                          <p className="text-gray-500 text-sm mt-2">Real-time garbage detection will appear here</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {liveResults.map((result, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
                              whileHover={{ scale: 1.02, x: 5 }}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`px-3 py-1 rounded-full text-sm font-bold flex items-center ${getCleanlinessColor(result.cleanliness_level)}`}>
                                  {getCleanlinessIcon(result.cleanliness_level)}
                                  <span className="ml-2">{result.cleanliness_level}</span>
                                </span>
                                <div className="text-right">
                                  <span className="text-sm font-bold text-gray-900">{result.garbage_count} objects</span>
                                  <p className="text-xs text-gray-500">{(result.confidence_score * 100).toFixed(1)}% confidence</p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </EnhancedCard>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </AnimatedBackground>
  )
}

export default DetectionPage
