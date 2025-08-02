"use client";

import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

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
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
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
                <div className="mb-6">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {study.metric}
                  </div>
                  <p className="text-gray-700 font-medium">
                    {study.mainResult}
                  </p>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6">
                  {study.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {study.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
                    >
                      {tag}
                    </span>
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
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 py-12 border-t border-b border-gray-200 border-solid"
        >
          {[
            { value: "98%", label: "Clients satisfaits" },
            { value: "+250%", label: "Croissance moyenne" },
            { value: "45j", label: "Délai moyen" },
            { value: "87%", label: "Taux de rétention" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <a 
            href="#contact" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200"
          >
            Démarrer votre projet
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}