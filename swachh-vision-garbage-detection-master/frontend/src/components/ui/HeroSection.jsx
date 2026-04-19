import React from 'react'
import { motion } from 'framer-motion'
import IndianFlag from './IndianFlag'

const HeroSection = ({ title, subtitle, children }) => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      className="relative overflow-hidden bg-gradient-to-r from-orange-600/10 via-white to-green-600/10 rounded-2xl p-8 mb-8"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-green-600 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-blue-800 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10 text-center">
        <motion.div variants={itemVariants} className="flex justify-center mb-6">
          <IndianFlag size="xlarge" animated={true} />
        </motion.div>
        
        <motion.h1 
          variants={itemVariants}
          className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-600 via-white to-green-600 bg-clip-text text-transparent"
        >
          {title}
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto"
        >
          {subtitle}
        </motion.p>
        
        {children && (
          <motion.div variants={itemVariants}>
            {children}
          </motion.div>
        )}
      </div>

      {/* Animated border */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-orange-500 via-green-600 to-blue-800 bg-clip-border p-[2px]"
        animate={{
          background: [
            "linear-gradient(45deg, #FF9933, #138808, #000080)",
            "linear-gradient(135deg, #138808, #000080, #FF9933)",
            "linear-gradient(225deg, #000080, #FF9933, #138808)",
            "linear-gradient(315deg, #FF9933, #138808, #000080)",
            "linear-gradient(45deg, #FF9933, #138808, #000080)",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </motion.div>
  )
}

export default HeroSection
