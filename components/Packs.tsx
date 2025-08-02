"use client";

import { motion } from 'framer-motion';
import { Palette, Rocket, Zap, Check, TrendingUp, Sparkles, Target } from 'lucide-react';

const growthPhases = [
  {
    icon: Palette,
    name: 'Foundation',
    phase: 'Phase 1',
    description: 'Build a brand that commands attention and trust',
    color: 'from-purple-400 to-pink-400',
    features: [
      'Strategic brand positioning',
      'Visual identity that converts',
      'Digital platforms that perform',
      'Market-fit validation',
    ],
    outcome: '3x faster market entry',
  },
  {
    icon: Rocket,
    name: 'Acceleration',
    phase: 'Phase 2',
    description: 'Scale your reach and multiply your impact',
    color: 'from-blue-400 to-purple-400',
    features: [
      'Growth marketing systems',
      'Automated lead generation',
      'Data-driven optimization',
      'Performance analytics',
    ],
    outcome: '10x lead generation',
  },
  {
    icon: Zap,
    name: 'Domination',
    phase: 'Phase 3',
    description: 'Become the undisputed leader in your market',
    color: 'from-orange-400 to-red-400',
    features: [
      'AI-powered automation',
      'Predictive growth modeling',
      'Market expansion strategies',
      'Continuous innovation',
    ],
    outcome: 'Market leadership achieved',
  },
];

export default function Packs() {
  return (
    <section id="growth-journey" className="py-20">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-text-dark mb-4">
            Your Growth Journey
            <span className="block text-2xl mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              From Ambitious to Unstoppable
            </span>
          </h2>
          <p className="text-xl text-text-light mt-4">We take you through three transformative phases</p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {growthPhases.map((phase, index) => (
            <motion.div
              key={phase.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card p-8 relative overflow-hidden group hover-glow card-interactive animate-fade-in-scale"
              whileHover={{ 
                scale: 1.02,
                rotateY: 5,
                z: 50
              }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${phase.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}></div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">{phase.phase}</span>
                <motion.div 
                  className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${phase.color} animate-float hover-glow`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <phase.icon className="w-6 h-6 text-white" />
                </motion.div>
              </div>
              
              <h3 className="text-2xl font-bold text-text-dark mb-3">{phase.name}</h3>
              <p className="text-text-light mb-6">{phase.description}</p>
              
              <div className="space-y-3 mb-6">
                {phase.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="mt-1">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    </div>
                    <span className="text-sm text-text-dark">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-light">Expected outcome:</span>
                  <motion.span 
                    initial={{ scale: 0.9 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"
                  >
                    {phase.outcome}
                  </motion.span>
                </div>
                <motion.button 
                  className="w-full btn-primary mt-4 group btn-shimmer hover-magnetic relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">Unlock This Phase</span>
                  <TrendingUp className="inline-block w-4 h-4 ml-2 group-hover:translate-y-[-2px] group-hover:rotate-12 transition-all duration-300 relative z-10" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}