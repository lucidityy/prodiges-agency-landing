"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { Target, Zap, Users, Rocket, Heart, Sparkles } from 'lucide-react';
import { useRef } from 'react';

export default function Mission() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  const values = [
    {
      icon: Zap,
      title: "Innovation",
      description: "Toujours à la pointe des dernières technologies",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Votre succès est notre priorité absolue",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Rocket,
      title: "Performance",
      description: "Des résultats mesurables et durables",
      gradient: "from-purple-500 to-pink-500",
    }
  ];

  return (
    <section id="notre-approche" ref={containerRef} className="section-padding relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-mesh-gradient opacity-10" />
        <motion.div
          style={{ scale }}
          className="absolute inset-0"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl" />
        </motion.div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          style={{ scale, opacity }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-glass-white backdrop-blur-md rounded-full border border-glass-border mb-6"
          >
            <Heart className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-text-dark">Notre philosophie</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-dark mb-6">
            Une mission simple : <span className="bg-button-gradient bg-clip-text text-transparent">votre réussite</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-text-light max-w-3xl mx-auto">
            Nous croyons que chaque entreprise mérite une présence digitale exceptionnelle. 
            Notre approche combine créativité, stratégie et technologie pour transformer vos ambitions en réalité.
          </p>
        </motion.div>

        {/* Values grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {values.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group"
            >
              <motion.div
                whileHover={{ y: -5 }}
                className="relative h-full"
              >
                {/* Glass card */}
                <div className="bg-glass-white backdrop-blur-xl rounded-3xl p-8 h-full border border-glass-border shadow-glass hover:shadow-glass-hover transition-all duration-300">
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-5 rounded-3xl`} />
                  
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`relative inline-flex p-4 rounded-2xl bg-gradient-to-br ${item.gradient} mb-6`}
                  >
                    <item.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-text-dark mb-4">{item.title}</h3>
                  <p className="text-text-light">{item.description}</p>
                  
                  {/* Decorative element */}
                  <div className="absolute top-4 right-4">
                    <Sparkles className="w-4 h-4 text-primary/20" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-glass-white backdrop-blur-xl rounded-3xl p-12 border border-glass-border shadow-glass"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-text-dark mb-4">
            Prêt à transformer votre vision en réalité ?
          </h3>
          <p className="text-lg text-text-light mb-8 max-w-2xl mx-auto">
            Rejoignez les centaines d'entreprises qui nous font confiance pour propulser leur croissance digitale.
          </p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-button-gradient text-white font-medium rounded-2xl hover:shadow-lg transition-all duration-300"
          >
            <span>Discutons de votre projet</span>
            <Rocket className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}