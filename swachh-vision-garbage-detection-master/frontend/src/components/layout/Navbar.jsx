import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HomeIcon,
  CameraIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import IndianFlag from '../ui/IndianFlag'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Detection', href: '/detect', icon: CameraIcon },
    { name: 'Alerts', href: '/alerts', icon: BellIcon },
  ]

  const isActive = (href) => {
    return location.pathname === href
  }

  return (
    <motion.nav 
      className="bg-white/95 backdrop-blur-lg shadow-xl border-b border-gradient-to-r from-orange-200 via-transparent to-green-200 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <IndianFlag size="small" animated={true} />
                </motion.div>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-600 via-green-600 to-blue-800 bg-clip-text text-transparent group-hover:from-orange-700 group-hover:via-green-700 group-hover:to-blue-900 transition-all duration-300">
                  Swachh Vision
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={item.href}
                      className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isActive(item.href)
                          ? 'bg-gradient-to-r from-orange-500 to-green-600 text-white shadow-lg'
                          : 'text-gray-600 hover:bg-gradient-to-r hover:from-orange-100 hover:to-green-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Right side - No login/logout needed */}
          <div className="flex items-center">
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <motion.div 
                className="text-right px-4 py-2 rounded-lg bg-gradient-to-r from-orange-50 to-green-50"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-sm font-semibold text-gray-900">🇮🇳 Open Access</p>
                <p className="text-xs text-gray-600">No login required</p>
              </motion.div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gradient-to-r hover:from-orange-100 hover:to-green-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gradient-to-r focus:from-orange-500 focus:to-green-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="sr-only">Open main menu</span>
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="sm:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200"
          >
            <div className="pt-2 pb-3 space-y-1 px-4">
              {navigation.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.href}
                      className={`block pl-3 pr-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                        isActive(item.href)
                          ? 'bg-gradient-to-r from-orange-500 to-green-600 text-white shadow-lg'
                          : 'text-gray-600 hover:bg-gradient-to-r hover:from-orange-100 hover:to-green-100 hover:text-gray-900'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <Icon className="w-5 h-5 mr-3" />
                        {item.name}
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
            
            {/* Mobile info */}
            <div className="pt-4 pb-3 border-t border-gray-200 px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center bg-gradient-to-r from-orange-50 to-green-50 p-3 rounded-lg"
              >
                <IndianFlag size="small" animated={false} />
                <div className="ml-3">
                  <p className="text-sm font-semibold text-gray-900">🇮🇳 Swachh Vision</p>
                  <p className="text-xs text-gray-600">Open Access System</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
