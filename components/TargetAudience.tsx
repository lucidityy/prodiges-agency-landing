"use client";

import { motion } from 'framer-motion';
import { 
  Hammer, User, Home, Rocket, Lightbulb, ShoppingCart, Building,
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
  },
  {
    icon: ShoppingCart,
    title: 'E-commerçants',
    description: 'Optimisez vos ventes et démarquez-vous',
    benefits: [
      'Boutique en ligne haute conversion',
      'Stratégie marketing omnicanale',
      'Automatisation des campagnes email',
      'Optimisation du taux de conversion'
    ],
    color: 'from-cyan-500 to-blue-500'
  },
  {
    icon: Building,
    title: 'Dirigeants PME',
    description: 'Modernisez et développez votre entreprise',
    benefits: [
      'Transformation digitale complète',
      'Stratégie de croissance sur mesure',
      'Formation des équipes aux outils digitaux',
      'Amélioration de la productivité'
    ],
    color: 'from-slate-500 to-gray-600'
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

        {/* Première ligne - 4 éléments */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 max-w-7xl mx-auto">
          {audiences.slice(0, 4).map((audience, index) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <motion.div
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  rotateX: 5,
                  rotateY: 2 
                }}
                className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all duration-500 h-full border border-white/20 border-solid overflow-hidden"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${audience.color} opacity-0 group-hover:opacity-[0.02] transition-opacity duration-500 rounded-3xl`} />
                
                {/* Icon with enhanced visual hierarchy */}
                <motion.div 
                  className={`relative inline-flex p-4 rounded-2xl bg-gradient-to-br ${audience.color} text-white mb-6 shadow-lg`}
                  whileHover={{ 
                    scale: 1.15, 
                    rotate: [0, -5, 5, 0],
                    boxShadow: "0 8px 25px rgba(0,0,0,0.2)"
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <audience.icon className="w-7 h-7 relative z-10" />
                  {/* Icon glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${audience.color} rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300`} />
                </motion.div>
                
                {/* Enhanced typography hierarchy */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-gray-800 transition-colors duration-300">
                  {audience.title}
                </h3>
                <p className="text-base text-gray-600 mb-6 leading-relaxed font-medium">
                  {audience.description}
                </p>
                
                {/* Benefits with improved spacing and visual flow */}
                <div className="space-y-3 mb-8">
                  {audience.benefits.map((benefit, benefitIndex) => (
                    <motion.div
                      key={benefitIndex}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.4, 
                        delay: index * 0.1 + benefitIndex * 0.05,
                        ease: "easeOut"
                      }}
                      className="flex items-start gap-3 group/benefit"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.4 }}
                        className="mt-0.5"
                      >
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      </motion.div>
                      <span className="text-sm text-gray-700 leading-relaxed group-hover/benefit:text-gray-900 transition-colors duration-200">
                        {benefit}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Enhanced CTA with better visual prominence */}
                <motion.div
                  className="relative flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-semibold translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 cursor-pointer"
                  whileHover={{ x: 6 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-sm">Découvrir notre approche</span>
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Deuxième ligne - 3 éléments centrés */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {audiences.slice(4, 7).map((audience, index) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              className="group relative"
            >
              <motion.div
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  rotateX: 5,
                  rotateY: 2 
                }}
                className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all duration-500 h-full border border-white/20 border-solid overflow-hidden"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${audience.color} opacity-0 group-hover:opacity-[0.02] transition-opacity duration-500 rounded-3xl`} />
                
                {/* Icon with enhanced visual hierarchy and floating animation */}
                <motion.div 
                  className={`relative inline-flex p-4 rounded-2xl bg-gradient-to-br ${audience.color} text-white mb-6 shadow-lg`}
                  whileHover={{ 
                    scale: 1.15, 
                    rotate: [0, -5, 5, 0],
                    boxShadow: "0 8px 25px rgba(0,0,0,0.2)"
                  }}
                  animate={{
                    y: [0, -4, 0],
                  }}
                  transition={{ 
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    hover: { duration: 0.4 }
                  }}
                >
                  <audience.icon className="w-7 h-7 relative z-10" />
                  {/* Icon glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${audience.color} rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300`} />
                </motion.div>
                
                {/* Enhanced typography hierarchy */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-gray-800 transition-colors duration-300">
                  {audience.title}
                </h3>
                <p className="text-base text-gray-600 mb-6 leading-relaxed font-medium">
                  {audience.description}
                </p>
                
                {/* Benefits with improved spacing and visual flow */}
                <div className="space-y-3 mb-8">
                  {audience.benefits.map((benefit, benefitIndex) => (
                    <motion.div
                      key={benefitIndex}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.4, 
                        delay: 0.4 + index * 0.1 + benefitIndex * 0.05,
                        ease: "easeOut"
                      }}
                      className="flex items-start gap-3 group/benefit"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.4 }}
                        className="mt-0.5"
                      >
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      </motion.div>
                      <span className="text-sm text-gray-700 leading-relaxed group-hover/benefit:text-gray-900 transition-colors duration-200">
                        {benefit}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Enhanced CTA with better visual prominence */}
                <motion.div
                  className="relative flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-semibold translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 cursor-pointer"
                  whileHover={{ x: 6 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-sm">Découvrir notre approche</span>
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-text-light mb-8 max-w-2xl mx-auto">
            Vous reconnaissez-vous dans ces profils ? Découvrez comment nous pouvons accélérer votre réussite.
          </p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-2xl btn-shimmer hover-magnetic relative overflow-hidden"
          >
            <span className="relative z-10">Parlons de votre projet</span>
            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}