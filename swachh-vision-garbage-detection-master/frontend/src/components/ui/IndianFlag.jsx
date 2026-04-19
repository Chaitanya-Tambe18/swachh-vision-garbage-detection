import React from 'react'
import { motion } from 'framer-motion'

const IndianFlag = ({ size = 'medium', animated = true, className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xlarge: 'w-24 h-24'
  }

  const flagVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  }

  const waveVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className}`}
      variants={animated ? flagVariants : {}}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <motion.div
        className="relative w-full h-full rounded-full overflow-hidden shadow-lg"
        variants={animated ? waveVariants : {}}
        animate="animate"
      >
        {/* Saffron stripe */}
        <div className="absolute top-0 w-full h-1/3 bg-gradient-to-b from-orange-500 to-orange-600" />
        
        {/* White stripe with Ashoka Chakra */}
        <div className="absolute top-1/3 w-full h-1/3 bg-white flex items-center justify-center">
          <motion.div
            className="relative"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <svg
              viewBox="0 0 100 100"
              className="w-3/4 h-3/4 text-blue-800"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="50" cy="50" r="45" />
              {/* 24 spokes */}
              {Array.from({ length: 24 }, (_, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2="50"
                  y2="5"
                  transform={`rotate(${i * 15} 50 50)`}
                />
              ))}
            </svg>
          </motion.div>
        </div>
        
        {/* Green stripe */}
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-green-700 to-green-600" />
      </motion.div>
    </motion.div>
  )
}

export default IndianFlag
