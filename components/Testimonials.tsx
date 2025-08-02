"use client";

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sophie Martin',
    role: 'Fondatrice, EcoTech Solutions',
    avatar: 'SM',
    content: 'Prodiges m\'a accompagnée de l\'idée au premier million d\'euros. Leur méthodologie structurée et leur réseau m\'ont fait gagner des années de développement.',
    rating: 5,
    growth: '+400% de croissance',
  },
  {
    id: 2,
    name: 'Thomas Dubois',
    role: 'CEO, Digital Academy',
    avatar: 'TD',
    content: 'L\'accompagnement Prodiges a transformé ma vision en entreprise rentable. Le mentorat personnalisé et les outils fournis ont été déterminants dans notre succès.',
    rating: 5,
    growth: '50+ employés',
  },
  {
    id: 3,
    name: 'Marie Chen',
    role: 'Co-fondatrice, HealthTech Pro',
    avatar: 'MC',
    content: 'Grâce à Prodiges, nous avons structuré notre levée de fonds et trouvé les bons investisseurs. Un accompagnement professionnel qui fait vraiment la différence.',
    rating: 5,
    growth: '2M€ levés',
  },
];

export default function Testimonials() {
  return (
    <section id="temoignages" className="section-padding">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-dark mb-3 sm:mb-4">Ils Nous Font Confiance</h2>
          <p className="text-base sm:text-lg lg:text-xl text-text-light px-4 sm:px-0">Découvrez les parcours de ceux qui ont transformé leur vision en succès</p>
        </motion.div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card p-6 sm:p-8 h-full flex flex-col hover-glow card-interactive animate-morphing-border"
              whileHover={{ 
                scale: 1.03,
                rotateY: 3,
                z: 50
              }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <motion.div 
                  className="w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base animate-float hover-glow"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {testimonial.avatar}
                </motion.div>
                <div>
                  <h4 className="font-semibold text-text-dark text-sm sm:text-base">{testimonial.name}</h4>
                  <p className="text-xs sm:text-sm text-text-light">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex gap-1 mb-3 sm:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      delay: index * 0.1 + i * 0.1,
                      type: "spring",
                      stiffness: 260,
                      damping: 20
                    }}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                  >
                    <Star className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400 fill-yellow-400 animate-glow" />
                  </motion.div>
                ))}
              </div>
              
              <p className="text-sm sm:text-base text-text-light italic mb-3 sm:mb-4 flex-grow">"{testimonial.content}"</p>
              
              {testimonial.growth && (
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", delay: index * 0.1 + 0.3 }}
                  className="inline-block bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-2 rounded-full"
                >
                  <span className="text-sm font-semibold text-primary">
                    {testimonial.growth}
                  </span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mt-8 sm:mt-12"
        >
          <div className="flex items-center gap-2 bg-white/80 px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-sm">
            <div className="flex -space-x-2">
              <div className="w-6 sm:w-8 h-6 sm:h-8 bg-purple-200 rounded-full border-2 border-white"></div>
              <div className="w-6 sm:w-8 h-6 sm:h-8 bg-blue-200 rounded-full border-2 border-white"></div>
              <div className="w-6 sm:w-8 h-6 sm:h-8 bg-pink-200 rounded-full border-2 border-white"></div>
            </div>
            <span className="text-xs sm:text-sm text-text-dark font-medium">Plus de 200 entrepreneurs accompagnés</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}