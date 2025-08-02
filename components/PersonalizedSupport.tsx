"use client";

import { motion } from 'framer-motion';
import { Users, Target, Shield, Headphones, BarChart3, Lightbulb } from 'lucide-react';

const methodSteps = [
  {
    icon: Lightbulb,
    title: 'Deep Dive Discovery',
    description: 'We uncover hidden growth opportunities in your business',
  },
  {
    icon: Target,
    title: 'Strategic Roadmapping',
    description: 'Custom growth blueprint designed for explosive results',
  },
  {
    icon: Users,
    title: 'Elite Team Assembly',
    description: 'Top 1% talent dedicated to your success',
  },
  {
    icon: BarChart3,
    title: 'Rapid Implementation',
    description: 'From strategy to execution in record time',
  },
  {
    icon: Shield,
    title: 'Growth Guarantee',
    description: 'We succeed when you succeed—aligned incentives',
  },
  {
    icon: Headphones,
    title: '24/7 Growth Support',
    description: 'Always available when opportunities arise',
  },
];

export default function PersonalizedSupport() {
  return (
    <section id="method" className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-text-dark mb-4">
            The Prodiges Method
          </h2>
          <p className="text-xl text-text-light max-w-3xl mx-auto">
            Our battle-tested approach has generated millions in revenue for ambitious businesses. 
            Here's how we make growth inevitable.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {methodSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass-card p-6 h-full"
              >
                <div className="flex items-start gap-4">
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-dark mb-2">
                      {step.title}
                    </h3>
                    <p className="text-text-light text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < methodSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      <span className="text-2xl text-primary/30">→</span>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}