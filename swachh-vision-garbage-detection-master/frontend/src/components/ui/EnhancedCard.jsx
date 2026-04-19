import React from 'react'
import { motion } from 'framer-motion'

const EnhancedCard = ({ 
  children, 
  className = '', 
  hover = true, 
  glow = false,
  delay = 0,
  ...props 
}) => {
  const cardVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: delay,
        ease: "easeOut"
      }
    },
    hover: hover ? {
      y: -5,
      scale: 1.02,
      boxShadow: glow 
        ? "0 20px 40px rgba(255, 153, 51, 0.3), 0 10px 20px rgba(19, 136, 8, 0.2)"
        : "0 10px 30px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    } : {}
  }

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-lg border border-gray-100 ${className}`}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      {...props}
    >
      <div className="relative overflow-hidden rounded-xl">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/10 to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-green-600/10 to-transparent rounded-tr-full" />
        
        {/* Content */}
        <div className="relative z-10 p-6">
          {children}
        </div>
      </div>
    </motion.div>
  )
}

export default EnhancedCard
