"use client";

import { motion } from 'framer-motion';
import { Linkedin, Twitter, MessageCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 sm:py-12 bg-white/80">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8"
        >
          <div>
            <h3 className="text-2xl sm:text-3xl text-black mb-3 sm:mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900 }}>prodiges.</h3>
            <p className="text-sm sm:text-base text-text-light">
              Agence digitale créative basée à Paris
            </p>
          </div>
          
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-text-dark mb-3 sm:mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm sm:text-base text-text-light hover:text-primary transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#services" className="text-sm sm:text-base text-text-light hover:text-primary transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#realisations" className="text-sm sm:text-base text-text-light hover:text-primary transition-colors">
                  Réalisations
                </a>
              </li>
              <li>
                <a href="#notre-approche" className="text-sm sm:text-base text-text-light hover:text-primary transition-colors">
                  Notre Approche
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-text-dark mb-3 sm:mb-4">Légal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm sm:text-base text-text-light hover:text-primary transition-colors">
                  Politique de Confidentialité
                </a>
              </li>
              <li>
                <a href="#" className="text-sm sm:text-base text-text-light hover:text-primary transition-colors">
                  Conditions d'Utilisation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm sm:text-base text-text-light hover:text-primary transition-colors">
                  Mentions Légales
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-text-dark mb-3 sm:mb-4">Contact</h4>
            <div className="flex gap-3 sm:gap-4 mb-3 sm:mb-4">
              <motion.a
                href="#"
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center social-icon linkedin hover-magnetic"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center social-icon twitter hover-magnetic"
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center social-icon message hover-magnetic"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <MessageCircle className="w-5 h-5" />
              </motion.a>
            </div>
            <p className="text-sm sm:text-base text-text-light">
              contact@prodiges.agency
            </p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-6 sm:pt-8 border-t border-gray-200 text-center"
        >
          <p className="text-xs sm:text-sm text-text-light">
            © {currentYear} Prodiges Agency. Tous droits réservés.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}