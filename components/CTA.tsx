"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Mail, Calendar, MessageCircle } from 'lucide-react';
import { useRef, useState } from 'react';

export default function CTA() {
  const containerRef = useRef(null);
  const [email, setEmail] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section id="contact" ref={containerRef} className="section-padding relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-mesh-gradient opacity-30" />
        <motion.div
          style={{ y }}
          className="absolute inset-0"
        >
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-tr from-secondary/30 to-accent/30 rounded-full blur-3xl" />
        </motion.div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          style={{ scale }}
          className="max-w-4xl mx-auto"
        >
          {/* Main CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            {/* Glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-3xl blur-xl transition-opacity duration-500 ${isHovered ? 'opacity-30' : 'opacity-20'}`} />
            
            {/* Glass card */}
            <div className="relative bg-glass-white backdrop-blur-xl rounded-3xl p-12 lg:p-16 border border-glass-border shadow-glass">
              {/* Badge */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-full text-sm font-medium mb-8"
              >
                <span>Places limitées pour 2025</span>
              </motion.div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-dark mb-6">
                Prêt à transformer <span className="bg-button-gradient bg-clip-text text-transparent">votre vision</span> ?
              </h2>
              
              <p className="text-lg text-text-light mb-12 max-w-2xl">
                Nous sélectionnons soigneusement les projets que nous accompagnons pour garantir 
                un suivi personnalisé et des résultats exceptionnels.
              </p>
              
              {/* Quick contact options */}
              <div className="grid sm:grid-cols-3 gap-4 mb-12">
                <motion.a
                  href="mailto:contact@prodiges.agency"
                  whileHover={{ y: -5 }}
                  className="group flex flex-col items-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-glass-border hover:border-primary/20 transition-all duration-300"
                >
                  <Mail className="w-8 h-8 text-primary mb-3" />
                  <span className="font-medium text-text-dark">Email</span>
                  <span className="text-sm text-text-light">contact@prodiges.agency</span>
                </motion.a>
                
                <motion.a
                  href="#"
                  whileHover={{ y: -5 }}
                  className="group flex flex-col items-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-glass-border hover:border-primary/20 transition-all duration-300"
                >
                  <Calendar className="w-8 h-8 text-primary mb-3" />
                  <span className="font-medium text-text-dark">Rendez-vous</span>
                  <span className="text-sm text-text-light">30 min gratuits</span>
                </motion.a>
                
                <motion.a
                  href="#"
                  whileHover={{ y: -5 }}
                  className="group flex flex-col items-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-glass-border hover:border-primary/20 transition-all duration-300"
                >
                  <MessageCircle className="w-8 h-8 text-primary mb-3" />
                  <span className="font-medium text-text-dark">WhatsApp</span>
                  <span className="text-sm text-text-light">Réponse rapide</span>
                </motion.a>
              </div>
              
              {/* Newsletter signup */}
              <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-8 border border-glass-border">
                <h3 className="text-xl font-semibold text-text-dark mb-4">
                  Ou recevez notre guide gratuit
                </h3>
                <p className="text-text-light mb-6">
                  "10 stratégies pour tripler votre CA digital en 2025"
                </p>
                
                <form className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre email professionnel"
                    className="flex-1 px-6 py-4 bg-white/80 backdrop-blur-sm rounded-xl border border-glass-border focus:border-primary focus:outline-none transition-colors"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-button-gradient text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <span>Recevoir le guide</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </form>
              </div>
              
              {/* Decorative elements */}
              <motion.div
                animate={{ 
                  rotate: 360,
                }}
                transition={{ 
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full blur-xl opacity-50"
              />
              <motion.div
                animate={{ 
                  rotate: -360,
                }}
                transition={{ 
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-tr from-secondary to-accent rounded-full blur-xl opacity-50"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}