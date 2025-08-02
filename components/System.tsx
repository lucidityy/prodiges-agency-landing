"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Palette, Globe, Mail, Megaphone, Package, 
  Users, FileText, TrendingUp, ArrowRight, Check
} from 'lucide-react';

const services = [
  {
    id: 'branding',
    icon: Palette,
    title: 'Branding & Identité',
    description: 'Logo, charte graphique, storytelling',
    details: [
      'Création de logo unique et mémorable',
      'Développement de l\'identité visuelle complète',
      'Storytelling de marque puissant',
      'Charte graphique professionnelle'
    ]
  },
  {
    id: 'web',
    icon: Globe,
    title: 'Site Web Sur-Mesure',
    description: 'Design moderne, responsive & optimisé',
    details: [
      'Design moderne et intuitif',
      'Optimisation SEO intégrée',
      'Performance et rapidité',
      'Responsive sur tous supports'
    ]
  },
  {
    id: 'prospection',
    icon: Mail,
    title: 'Prospection & Automation',
    description: 'Génération de leads automatisée',
    details: [
      'Systèmes automatisés de génération de leads',
      'Campagnes email personnalisées',
      'Automation des processus de vente',
      'CRM et suivi des prospects'
    ]
  },
  {
    id: 'marketing',
    icon: Megaphone,
    title: 'Marketing Digital',
    description: 'SEO, réseaux sociaux, publicité',
    details: [
      'Stratégie de contenu engageante',
      'Gestion des réseaux sociaux',
      'Création de visuels professionnels',
      'Campagnes publicitaires ciblées'
    ]
  }
];

export default function System() {
  const [selectedService, setSelectedService] = useState(services[0]);

  return (
    <section id="services" className="section-padding bg-white">
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
              Nos services
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Une expertise complète pour votre succès
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            De la conception à la croissance, nous vous accompagnons à chaque étape
            avec des solutions sur-mesure et une approche orientée résultats.
          </motion.p>
        </div>

        {/* Services grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          {/* Service selector */}
          <div className="space-y-4">
            {services.map((service, index) => (
              <motion.button
                key={service.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedService(service)}
                className={`w-full text-left p-6 rounded-xl transition-all duration-300 hover-glow relative overflow-hidden ${
                  selectedService.id === service.id
                    ? 'bg-gray-50 border-2 border-primary shadow-sm'
                    : 'bg-white border-2 border-gray-100 hover:border-gray-200'
                }`}
                whileHover={{ 
                  scale: 1.02, 
                  x: 5
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <motion.div 
                    className={`p-3 rounded-lg transition-all duration-300 ${
                      selectedService.id === service.id 
                        ? 'bg-gradient-to-br from-primary to-secondary text-white animate-glow' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    animate={selectedService.id === service.id ? { 
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, 0]
                    } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <service.icon className="w-5 h-5" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{service.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                  </div>
                  <motion.div
                    animate={selectedService.id === service.id ? { 
                      x: 4,
                      scale: 1.1
                    } : { x: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight className={`w-5 h-5 transition-all ${
                      selectedService.id === service.id 
                        ? 'text-primary' 
                        : 'text-gray-400'
                    }`} />
                  </motion.div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Service details */}
          <motion.div
            key={selectedService.id}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="bg-gray-50 rounded-2xl p-8 lg:p-10 hover-glow particles-container animate-morphing-border"
            whileHover={{ 
              scale: 1.02,
              y: -5
            }}
          >
            <div className="mb-6">
              <motion.div 
                className="inline-flex p-4 rounded-xl bg-gradient-to-br from-primary to-secondary text-white mb-6 animate-float hover-glow"
                whileHover={{ scale: 1.1, rotate: 5 }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <selectedService.icon className="w-8 h-8" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {selectedService.title}
              </h3>
              <p className="text-gray-600">
                {selectedService.description}
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {selectedService.details.map((detail, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{detail}</span>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="#contact"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all hover-magnetic"
              whileHover={{ x: 5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>En savoir plus</span>
              <motion.div
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.a>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16 pt-16 border-t border-gray-100"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Prêt à transformer votre entreprise ?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Discutons de votre projet et découvrez comment nous pouvons vous aider à atteindre vos objectifs.
          </p>
          <motion.a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200 btn-shimmer hover-magnetic relative overflow-hidden"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Obtenir un devis gratuit</span>
            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}