"use client";

import { motion, useSpring, useTransform } from 'framer-motion';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';

// Hook pour animer les compteurs
function useCountUp(end: number, start: number = 0, duration: number = 2000) {
  const [nodeRef, setNodeRef] = useState<HTMLElement | null>(null);
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (!nodeRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let startTimestamp: number;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setCount(start + (end - start) * easedProgress);
            if (progress < 1) {
              requestAnimationFrame(step);
            }
          };
          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(nodeRef);
    return () => observer.disconnect();
  }, [nodeRef, end, start, duration]);

  return [setNodeRef, count] as const;
}

// Composant pour les statistiques animées
function StatCounter({ value, label, index }: { value: string, label: string, index: number }) {
  // Extraire le nombre de la valeur (ex: "98%" -> 98, "+250%" -> 250)
  const numericValue = parseInt(value.replace(/[^\d]/g, ''), 10) || 0;
  const [ref, count] = useCountUp(numericValue, 0, 2000 + index * 200);
  
  // Reformater la valeur avec les mêmes caractères que l'original
  const formatValue = (currentCount: number) => {
    const rounded = Math.round(currentCount);
    if (value.includes('%')) return `${rounded}%`;
    if (value.includes('+')) return `+${rounded}%`;
    if (value.includes('j')) return `${rounded}j`;
    return rounded.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="text-center hover-glow"
      whileHover={{ scale: 1.05, y: -5 }}
    >
      <motion.div 
        ref={ref}
        className="text-3xl font-bold text-gray-900 mb-2 animate-text-glow"
        whileHover={{ scale: 1.1 }}
      >
        {formatValue(count)}
      </motion.div>
      <div className="text-sm text-gray-600">{label}</div>
    </motion.div>
  );
}

const caseStudies = [
  {
    client: "TechStart Paris",
    industry: "SaaS B2B",
    metric: "+300%",
    mainResult: "de croissance en 6 mois",
    description: "Refonte complète de l'identité et lancement d'une stratégie d'acquisition performante.",
    tags: ["Branding", "Web Design", "Marketing"],
    color: "bg-blue-50 text-blue-900"
  },
  {
    client: "GreenLife",
    industry: "E-commerce",
    metric: "x5",
    mainResult: "ROAS publicitaire",
    description: "Optimisation du tunnel de vente et campagnes publicitaires ciblées.",
    tags: ["E-commerce", "Conversion", "Publicité"],
    color: "bg-green-50 text-green-900"
  },
  {
    client: "MedTech Pro",
    industry: "HealthTech",
    metric: "500+",
    mainResult: "leads qualifiés/mois",
    description: "Système de prospection automatisé et stratégie de contenu premium.",
    tags: ["Lead Gen", "Automation", "Content"],
    color: "bg-purple-50 text-purple-900"
  }
];

export default function Results() {
  return (
    <section id="realisations" className="section-padding bg-gray-50">
      <div className="container-section">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Études de cas
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Des résultats concrets et mesurables
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Découvrez comment nous avons aidé nos clients à transformer leur vision en succès tangible.
          </motion.p>
        </div>

        {/* Case studies grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <motion.article
              key={study.client}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover-glow card-interactive animate-morphing-border particles-container"
              whileHover={{ 
                scale: 1.03,
                rotateY: 2,
                z: 50
              }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Header */}
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{study.client}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${study.color}`}>
                      {study.industry}
                    </span>
                  </div>
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.1 }}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ArrowUpRight className="w-5 h-5 text-gray-600" />
                  </motion.a>
                </div>

                {/* Metric */}
                <motion.div 
                  className="mb-6"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                >
                  <motion.div 
                    className="text-4xl font-bold text-primary mb-2 animate-text-glow"
                    whileHover={{ scale: 1.1 }}
                  >
                    {study.metric}
                  </motion.div>
                  <p className="text-gray-700 font-medium">
                    {study.mainResult}
                  </p>
                </motion.div>

                {/* Description */}
                <p className="text-gray-600 mb-6">
                  {study.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 stagger-children animate">
                  {study.tags.map((tag, tagIndex) => (
                    <motion.span 
                      key={tag}
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.1 + tagIndex * 0.05, type: "spring" }}
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover-magnetic"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Success metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 py-12 border-t border-b border-gray-200 border-solid particles-container"
        >
          {[
            { value: "98%", label: "Clients satisfaits" },
            { value: "+250%", label: "Croissance moyenne" },
            { value: "45j", label: "Délai moyen" },
            { value: "87%", label: "Taux de rétention" }
          ].map((stat, index) => (
            <StatCounter
              key={stat.label}
              value={stat.value}
              label={stat.label}
              index={index}
            />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.a 
            href="#contact" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200 btn-shimmer hover-magnetic relative overflow-hidden"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Démarrer votre projet</span>
            <ArrowUpRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}