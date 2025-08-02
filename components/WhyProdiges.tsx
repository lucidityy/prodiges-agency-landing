"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Heart, Shield, Trophy, Users, Sparkles } from 'lucide-react';

export default function WhyProdiges() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.5, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <section id="pourquoi" ref={containerRef} className="section-padding bg-gradient-to-br from-primary/5 via-white to-accent/5 relative overflow-hidden">
      {/* Animated background shapes */}
      <motion.div
        style={{ rotate }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden sm:block"
      >
        <div className="w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] border border-primary/10 rounded-full"></div>
        <div className="absolute inset-4 sm:inset-6 lg:inset-8 border border-accent/10 rounded-full"></div>
        <div className="absolute inset-8 sm:inset-12 lg:inset-16 border border-primary/10 rounded-full"></div>
      </motion.div>

      <div className="container-max relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Sparkles className="w-6 sm:w-7 lg:w-8 h-6 sm:h-7 lg:h-8 text-primary" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-dark">Pourquoi choisir Prodiges ?</h2>
            <Sparkles className="w-6 sm:w-7 lg:w-8 h-6 sm:h-7 lg:h-8 text-accent" />
          </div>
        </motion.div>

        <motion.div
          style={{ scale }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl sm:shadow-2xl relative overflow-hidden"
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
            
            <div className="relative z-10">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-xl sm:text-2xl lg:text-3xl text-text-dark leading-relaxed text-center mb-8 sm:mb-12 px-4 sm:px-0"
              >
                Un partenariat basé sur la confiance et l'excellence.
              </motion.p>

              <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
                {[
                  {
                    icon: Heart,
                    title: "Engagement total",
                    description: "Une équipe dédiée qui s'investit pleinement dans votre réussite",
                    color: "text-red-500"
                  },
                  {
                    icon: Shield,
                    title: "Expertise reconnue",
                    description: "Des méthodes éprouvées par des centaines de projets réussis",
                    color: "text-blue-500"
                  },
                  {
                    icon: Trophy,
                    title: "Réseau de qualité",
                    description: "Accès à notre communauté d'entrepreneurs et d'investisseurs",
                    color: "text-yellow-500"
                  },
                  {
                    icon: Users,
                    title: "Suivi personnalisé",
                    description: "Un accompagnement adapté à chaque étape de votre croissance",
                    color: "text-green-500"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white shadow-lg ${item.color}`}>
                      <item.icon className="w-5 sm:w-6 h-5 sm:h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-text-dark mb-1 sm:mb-2">{item.title}</h3>
                      <p className="text-sm sm:text-base text-text-light">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl sm:rounded-2xl p-6 sm:p-8"
              >
                <p className="text-xl sm:text-2xl font-bold text-text-dark mb-3 sm:mb-4">
                  Ensemble, nous avons tout pour réussir.
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  Votre ambition + Notre expertise = Succès garanti.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-12 sm:mt-16"
        >
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-full shadow-lg text-sm sm:text-base"
          >
            <Sparkles className="w-4 sm:w-5 h-4 sm:h-5" />
            Démarrons votre transformation
            <Sparkles className="w-4 sm:w-5 h-4 sm:h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}