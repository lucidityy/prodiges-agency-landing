"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [navItemsPositions, setNavItemsPositions] = useState<Array<{left: number, width: number}>>([]);
  const navRef = useRef<HTMLDivElement>(null);
  const navItemsRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Magnetic cursor effect
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 300, damping: 30 });
  const springY = useSpring(cursorY, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate nav items positions
  useEffect(() => {
    const calculatePositions = () => {
      if (!navRef.current) return;
      const containerRect = navRef.current.getBoundingClientRect();
      const positions = navItemsRefs.current.map(ref => {
        if (!ref) return { left: 0, width: 0 };
        const rect = ref.getBoundingClientRect();
        return {
          left: rect.left - containerRect.left,
          width: rect.width
        };
      });
      setNavItemsPositions(positions);
    };

    // Initial calculation after a small delay to ensure DOM is ready
    const timer = setTimeout(calculatePositions, 100);
    
    window.addEventListener('resize', calculatePositions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculatePositions);
    };
  }, []);

  const navItems = [
    { href: "#services", label: "Services" },
    { href: "#realisations", label: "Réalisations" },
    { href: "#notre-approche", label: "Notre Approche" },
    { href: "#temoignages", label: "Témoignages" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50"
    >
      {/* Animated background with glow effect */}
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundColor: scrolled ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0)",
          backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Subtle glow effect on scroll */}
        {scrolled && (
          <motion.div
            className="absolute inset-x-0 -bottom-px h-px"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </motion.div>
        )}
      </motion.div>
      <nav className="container mx-auto px-6 flex items-center justify-between h-16 relative z-10">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <h1 className="text-3xl text-black" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900 }}>
            prodiges.
          </h1>
        </motion.div>
        
        {/* Desktop Navigation with magnetic effect */}
        <div className="hidden md:flex items-center gap-6 relative" ref={navRef}>
          {/* Hover background indicator */}
          <AnimatePresence>
            {hoveredIndex !== null && navItemsPositions[hoveredIndex] && (
              <motion.div
                className="absolute inset-y-1 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg -z-10 backdrop-blur-sm"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  left: navItemsPositions[hoveredIndex].left - 8,
                  width: navItemsPositions[hoveredIndex].width + 16
                }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </AnimatePresence>
          
          {navItems.map((item, index) => (
            <motion.a
              key={item.href}
              href={item.href}
              ref={el => {
                navItemsRefs.current[index] = el;
                // Trigger position calculation when all refs are set
                if (index === navItems.length - 1 && el) {
                  setTimeout(() => {
                    if (!navRef.current) return;
                    const containerRect = navRef.current.getBoundingClientRect();
                    const positions = navItemsRefs.current.map(ref => {
                      if (!ref) return { left: 0, width: 0 };
                      const rect = ref.getBoundingClientRect();
                      return {
                        left: rect.left - containerRect.left,
                        width: rect.width
                      };
                    });
                    setNavItemsPositions(positions);
                  }, 50);
                }
              }}
              className="relative px-5 py-2 text-text-dark hover:text-primary transition-colors font-medium group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileHover={{ scale: 1.05 }}
              style={{
                x: springX,
                y: springY,
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                cursorX.set(x * 0.1);
                cursorY.set(y * 0.1);
              }}
              onMouseOut={() => {
                cursorX.set(0);
                cursorY.set(0);
              }}
            >
              <span className="relative z-10">{item.label}</span>
            </motion.a>
          ))}
        </div>
        
        {/* CTA */}
        <div className="flex items-center gap-4">
          <motion.a 
            href="#contact" 
            className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-br from-white/[0.12] to-white/[0.06] backdrop-blur-xl border border-white/25 text-gray-900 font-medium rounded-2xl hover:from-white/[0.16] hover:to-white/[0.08] transition-all duration-300 relative overflow-hidden group shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Premium glass layers */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.15] to-transparent rounded-2xl" />
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            {/* Content */}
            <span className="relative z-10 font-medium bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">Start a Project</span>
            
            {/* Bottom reflection */}
            <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-black/[0.03] to-transparent rounded-b-2xl" />
          </motion.a>
          
          {/* Mobile Menu Button - Glassmorphic */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-gray-900 hover:bg-white/20 transition-all duration-300 relative overflow-hidden group"
            aria-label="Menu"
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="bg-glass-white/95 backdrop-blur-xl border-b border-glass-border">
              <div className="container mx-auto px-6 py-6 space-y-4">
                {navItems.map((item, index) => (
                  <motion.a 
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 text-text-dark hover:text-primary transition-colors font-medium"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.label}
                  </motion.a>
                ))}
                <motion.a 
                  href="#contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-6 py-3 bg-button-gradient text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 mt-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Lancer Mon Projet
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}