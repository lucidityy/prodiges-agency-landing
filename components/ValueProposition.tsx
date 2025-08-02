"use client";

import { motion } from 'framer-motion';
import { Zap, Target, Brain, Wrench } from 'lucide-react';
import { useState } from 'react';

const features = [
  {
    icon: Zap,
    title: 'Rapidité d\'exécution',
    description: 'Lancement en 90 jours maximum',
    gradient: 'from-amber-400 to-orange-600',
    delay: 0,
  },
  {
    icon: Target,
    title: 'Stratégie ciblée',
    description: 'ROI maximisé dès le départ',
    gradient: 'from-blue-400 to-indigo-600',
    delay: 0.1,
  },
  {
    icon: Brain,
    title: 'Innovation constante',
    description: 'Technologies de pointe',
    gradient: 'from-purple-400 to-pink-600',
    delay: 0.2,
  },
  {
    icon: Wrench,
    title: 'Solution complète',
    description: 'De la conception au déploiement',
    gradient: 'from-green-400 to-teal-600',
    delay: 0.3,
  },
];

export default function ValueProposition() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50" />
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      <div className="container-section relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: feature.delay, type: "spring", stiffness: 100 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative"
            >
              <motion.div
                className="relative h-full"
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* 3D Card */}
                <div className="relative h-full p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 overflow-hidden group">
                  {/* Gradient background on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />
                  
                  {/* Animated icon container */}
                  <motion.div
                    className="relative mb-6"
                    animate={{
                      scale: hoveredIndex === index ? 1.1 : 1,
                      rotate: hoveredIndex === index ? [0, -10, 10, -10, 0] : 0,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Icon glow effect */}
                    <motion.div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} blur-xl`}
                      animate={{
                        opacity: hoveredIndex === index ? 0.6 : 0.3,
                        scale: hoveredIndex === index ? 1.2 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                  
                  {/* Hover indicator */}
                  <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-1 ${feature.gradient}`}
                    initial={{ scaleX: 0 }}
                    animate={{
                      scaleX: hoveredIndex === index ? 1 : 0,
                    }}
                    style={{ originX: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                
                {/* Shadow effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl -z-10"
                  animate={{
                    boxShadow: hoveredIndex === index 
                      ? "0 20px 40px -15px rgba(0, 0, 0, 0.15)" 
                      : "0 10px 25px -10px rgba(0, 0, 0, 0.1)",
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}