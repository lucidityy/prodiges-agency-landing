"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-4 left-4 right-4 z-50 flex justify-center"
    >
      <div className="w-full max-w-2xl relative">
        {/* Ultra-Modern Glassmorphism Background */}
        <motion.div
          className="absolute inset-0 rounded-3xl"
          animate={{
            backgroundColor: scrolled ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.15)",
            backdropFilter: scrolled ? "blur(32px) saturate(200%)" : "blur(16px) saturate(150%)",
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Multi-layer glass effect with enhanced depth */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/60 via-white/30 to-white/10" />
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/8 via-transparent to-secondary/8" />
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-transparent to-primary/5" />
          
          {/* Enhanced border with glow */}
          <div className="absolute inset-0 rounded-3xl border border-white/30 border-solid shadow-2xl" />
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/20 via-transparent to-white/20" />
          
          {/* Subtle inner shadow for depth */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-transparent via-black/5 to-transparent" />
          
          {/* Ambient light effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/50 via-transparent to-primary/15" />
        </motion.div>
        <nav className="px-12 flex items-center justify-between h-20 relative z-10">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <h1 className="text-3xl text-black brand-text">
            prodiges.
          </h1>
        </motion.div>
        

        
        {/* CTA */}
        <div className="flex items-center gap-4">
          <motion.a 
            href="#contact" 
            className="hidden md:inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-2xl border border-white/50 border-solid text-gray-900 font-heading font-bold tracking-tight rounded-2xl hover:from-white/95 hover:to-white/80 transition-all duration-300 relative overflow-hidden group shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.16)] hover:scale-105"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Enhanced glass layers */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-transparent rounded-2xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/15 via-transparent to-secondary/15 rounded-2xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-primary/10 rounded-2xl" />
            
            {/* Enhanced shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            {/* Content */}
            <span className="relative z-10 bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">about</span>
            
            {/* Enhanced bottom reflection */}
            <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-black/[0.08] to-transparent rounded-b-2xl" />
          </motion.a>
          

        </div>
              </nav>
      </div>
    </motion.header>
  );
}