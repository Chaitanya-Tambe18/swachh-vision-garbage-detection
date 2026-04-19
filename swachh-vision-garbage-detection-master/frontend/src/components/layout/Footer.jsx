import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon,
  HeartIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import IndianFlag from '../ui/IndianFlag'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <motion.footer 
      className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-orange-500 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-green-600 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-r from-blue-800 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div 
            className="col-span-1 md:col-span-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <IndianFlag size="medium" animated={true} />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent">
                Swachh Vision
              </span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              AI-powered garbage detection system making India cleaner through advanced computer vision technology. 
              Join us in the mission for a cleaner, greener tomorrow inspired by the Swachh Bharat Abhiyan.
            </p>
            <div className="flex space-x-6">
              <motion.a
                href="mailto:info@swachhvision.com"
                className="p-3 bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-300"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <EnvelopeIcon className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="tel:+919876543210"
                className="p-3 bg-gradient-to-r from-green-600 to-green-700 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <PhoneIcon className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="https://swachhvision.com"
                className="p-3 bg-gradient-to-r from-blue-700 to-blue-800 rounded-lg hover:from-blue-800 hover:to-blue-900 transition-all duration-300"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <GlobeAltIcon className="h-5 w-5" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <SparklesIcon className="w-5 h-5 mr-2 text-orange-400" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { to: "/dashboard", label: "Dashboard" },
                { to: "/detect", label: "Detection" },
                { to: "/alerts", label: "Alerts" },
                { to: "/profile", label: "Profile" },
              ].map((item, index) => (
                <motion.li
                  key={item.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Link 
                    to={item.to} 
                    className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <HeartIcon className="w-5 h-5 mr-2 text-green-400" />
              Resources
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/docs", label: "Documentation" },
                { href: "/api", label: "API Reference" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
              ].map((item, index) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <a 
                    href={item.href} 
                    className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div 
          className="mt-12 pt-8 border-t border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div 
              className="flex items-center space-x-3 mb-4 md:mb-0"
              whileHover={{ scale: 1.05 }}
            >
              <MapPinIcon className="h-5 w-5 text-orange-400" />
              <span className="text-sm text-gray-300 font-medium">
                🇮🇳 Inspired by Swachh Bharat Mission
              </span>
            </motion.div>
            <motion.div 
              className="text-sm text-gray-300 text-center"
              whileHover={{ scale: 1.02 }}
            >
              © {currentYear} Swachh Vision. All rights reserved. 
              <span className="ml-2">Made with </span>
              <HeartIcon className="w-4 h-4 inline text-red-500 mx-1" />
              <span>for a cleaner India.</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Animated border */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-white to-green-600"
        animate={{
          background: [
            "linear-gradient(90deg, #FF9933, #FFFFFF, #138808)",
            "linear-gradient(90deg, #138808, #FF9933, #FFFFFF)",
            "linear-gradient(90deg, #FFFFFF, #138808, #FF9933)",
            "linear-gradient(90deg, #FF9933, #FFFFFF, #138808)",
          ],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </motion.footer>
  )
}

export default Footer
