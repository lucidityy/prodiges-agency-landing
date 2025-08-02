"use client";

import { motion } from 'framer-motion';
import { Award, Shield, Trophy, CheckCircle } from 'lucide-react';

export default function SocialProof() {
  const stats = [
    {
      value: "200+",
      label: "entrepreneurs accompagnés",
      icon: Trophy,
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      value: "95%",
      label: "de satisfaction client",
      icon: Award,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      value: "10 ans",
      label: "d'expertise digitale",
      icon: Shield,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      value: "x3",
      label: "croissance moyenne",
      icon: CheckCircle,
      gradient: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-bg-light/30 to-white" />
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            initial={{ 
              x: Math.random() * 1000,
              y: Math.random() * 1000,
            }}
                        animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-4 mb-6"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              La preuve par les chiffres
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent via-primary to-transparent" />
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-dark mb-4">
            Une expertise <span className="bg-button-gradient bg-clip-text text-transparent">reconnue</span>
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <motion.div
                whileHover={{ y: -10 }}
                className="relative h-full"
              >
                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-20 rounded-3xl blur-xl transition-opacity duration-500`} />
                
                {/* Glass card */}
                <div className="relative bg-glass-white backdrop-blur-xl rounded-3xl p-8 h-full border border-glass-border shadow-glass hover:shadow-glass-hover transition-all duration-300">
                  {/* Icon */}
                  <motion.div 
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} mb-6`}
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  
                  {/* Value with animated counter effect */}
                  <motion.h3 
                    className="text-4xl font-bold bg-gradient-to-br from-text-dark to-text-dark/70 bg-clip-text text-transparent mb-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  >
                    {stat.value}
                  </motion.h3>
                  
                  <p className="text-sm text-text-light">{stat.label}</p>
                  
                  {/* Decorative dot */}
                  <div className={`absolute top-4 right-4 w-2 h-2 bg-gradient-to-br ${stat.gradient} rounded-full opacity-60`} />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Trust message */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-glass-white backdrop-blur-md rounded-full border border-glass-border">
            <CheckCircle className="w-5 h-5 text-primary" />
            <p className="text-sm font-medium text-text-dark">
              Certifié Google Partner • Membre de la French Tech
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}