"use client";

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';

export default function Hero() {
  const heroRef = useRef(null);

  return (
    <section ref={heroRef} className="min-h-screen relative overflow-hidden flex items-center">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-30"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Agency Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <motion.h2 
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl brand-text tracking-tight font-black cursor-pointer leading-none"
              style={{ 
                fontWeight: 900, 
                textShadow: '0 0 30px rgba(0,0,0,0.1)',
                background: 'linear-gradient(45deg, #1a1a1a, #4a4a4a, #1a1a1a)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: '1.1',
                paddingBottom: '0.1em'
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                backgroundPosition: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              whileHover={{
                scale: 1.05,
                textShadow: '0 0 50px rgba(0,0,0,0.2)',
                background: 'linear-gradient(45deg, #7C3AED, #EC4899, #5B4FE9)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
              whileTap={{ scale: 0.95 }}
            >
              prodiges.
            </motion.h2>
          </motion.div>
          
          {/* Separator Line */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-12"
          >
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-full mx-auto shadow-lg"></div>
          </motion.div>
          
          {/* Title */}
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-none mb-8 tracking-tight"
            style={{ lineHeight: '1.1', paddingBottom: '0.1em' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span className="block text-gray-900 mb-4">
            Build faster.
            </span>
            <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent font-black">
            Grow stronger.
            </span>
          </motion.h1>
          
          {/* Description */}
          <motion.p 
            className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto mb-16"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Prodiges Agency. Be the next success story.
          </motion.p>
          
          {/* Scroll Indicator */}
          <motion.div 
            className="flex justify-center items-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <motion.div
              className="group cursor-pointer"
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.15 }}
              onClick={() => {
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <div className="flex flex-col items-center gap-4">
                <span className="text-base font-semibold text-gray-700 group-hover:text-gray-900 transition-colors tracking-wide">
                  Scroll to explore
                </span>
                <motion.div
                  className="w-8 h-14 border-3 border-gray-400 border-solid rounded-full flex justify-center relative overflow-hidden backdrop-blur-sm bg-white/10"
                  whileHover={{ 
                    borderColor: '#7C3AED',
                    boxShadow: '0 8px 32px rgba(124, 58, 237, 0.3)'
                  }}
                >
                  <motion.div
                    className="w-2 h-4 bg-gradient-to-b from-gray-500 to-gray-400 rounded-full mt-3"
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    whileHover={{ 
                      background: 'linear-gradient(to bottom, #7C3AED, #EC4899)'
                    }}
                  />
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}