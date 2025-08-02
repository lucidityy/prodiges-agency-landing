"use client";

import { motion } from 'framer-motion';
import { 
  Hammer, User, Home, Rocket, Lightbulb,
  CheckCircle, ArrowRight
} from 'lucide-react';

const audiences = [
  {
    icon: Hammer,
    title: 'Artisans',
    description: 'Digitalisez et professionnalisez votre activité',
    benefits: [
      'Site web professionnel pour présenter vos réalisations',
      'Système de devis et réservation en ligne',
      'Présence sur les réseaux sociaux',
      'Génération automatique de leads locaux'
    ],
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: User,
    title: 'Indépendants',
    description: 'Coachs, thérapeutes, freelances en quête de structure',
    benefits: [
      'Identité de marque forte et cohérente',
      'Plateforme de réservation et paiement',
      'Stratégie de contenu pour établir votre expertise',
      'Automatisation de votre prospection'
    ],
    color: 'from-blue-500 to-purple-500'
  },
  {
    icon: Home,
    title: 'Agents Immobiliers',
    description: 'Sortez du lot dans un marché compétitif',
    benefits: [
      'Personal branding qui vous différencie',
      'Site avec portfolio de biens interactif',
      'Campagnes publicitaires ciblées',
      'Système de nurturing des prospects'
    ],
    color: 'from-green-500 to-teal-500'
  },
  {
    icon: Rocket,
    title: 'Fondateurs de Startups',
    description: 'Seuls ou en early stage, prêts à décoller',
    benefits: [
      'MVP et stratégie produit',
      'Pitch deck professionnel',
      'Stratégie de go-to-market',
      'Accompagnement levée de fonds'
    ],
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Lightbulb,
    title: 'Créateurs',
    description: 'Passez d\'un projet à un vrai business',
    benefits: [
      'Transformation de l\'idée en modèle économique',
      'Création de l\'écosystème digital complet',
      'Stratégie de monétisation',
      'Plan de croissance sur 12 mois'
    ],
    color: 'from-indigo-500 to-purple-500'
  }
];

export default function TargetAudience() {
  return (
    <section id="cibles" className="section-padding bg-gradient-to-br from-white via-bg-light to-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(183, 154, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="container-max relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-dark mb-4 sm:mb-6">
            À qui s'adresse Prodiges ?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-text-light max-w-3xl mx-auto px-4 sm:px-0">
            Nous travaillons avec des entrepreneurs ambitieux à différents stades de leur parcours. 
            Découvrez comment nous pouvons transformer votre activité.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full"
              >
                <div className={`inline-flex p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${audience.color} text-white mb-4 sm:mb-6`}>
                  <audience.icon className="w-6 sm:w-8 h-6 sm:h-8" />
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-text-dark mb-2 sm:mb-3">{audience.title}</h3>
                <p className="text-sm sm:text-base text-text-light mb-4 sm:mb-6">{audience.description}</p>
                
                <div className="space-y-2 sm:space-y-3">
                  {audience.benefits.map((benefit, benefitIndex) => (
                    <motion.div
                      key={benefitIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 + benefitIndex * 0.1 }}
                      className="flex items-start gap-2 sm:gap-3"
                    >
                      <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-text-dark">{benefit}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="mt-6 sm:mt-8 flex items-center gap-2 text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm sm:text-base"
                >
                  <span>Découvrir notre approche</span>
                  <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4" />
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-12 sm:mt-16 lg:mt-20"
        >
          <p className="text-base sm:text-lg lg:text-xl text-text-light mb-6 sm:mb-8 px-4 sm:px-0">
            Vous reconnaissez-vous ? Découvrez comment nous pouvons accélérer votre réussite.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-full text-sm sm:text-base"
          >
            Parlons de votre projet
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}