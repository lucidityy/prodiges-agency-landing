"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'Combien coûte un projet avec Prodiges ?',
    answer: 'Nos tarifs dépendent de la complexité et de l\'envergure de votre projet. Nous proposons des forfaits à partir de 5000€ pour les startups et jusqu\'à 50k€+ pour des lancements complets. Un devis personnalisé est établi après notre premier échange.',
  },
  {
    question: 'Quelle est la durée moyenne d\'un projet ?',
    answer: 'Un lancement complet prend généralement entre 60 et 90 jours. Cela inclut la stratégie, le branding, le site web et la mise en place des systèmes de croissance. Nous pouvons accélérer le processus selon vos besoins.',
  },
  {
    question: 'Travaillez-vous avec des entreprises établies ou seulement des startups ?',
    answer: 'Les deux ! Nous accompagnons aussi bien les entrepreneurs qui lancent leur première idée que les entreprises établies cherchant à se réinventer ou accélérer leur croissance digitale.',
  },
  {
    question: 'Qu\'est-ce qui vous différencie des autres agences ?',
    answer: 'Nous ne sommes pas une agence classique. Nous devenons votre partenaire de croissance, avec une approche 360° qui couvre tous les aspects de votre lancement. Notre engagement : des résultats mesurables, pas juste de beaux visuels.',
  },
  {
    question: 'Proposez-vous un suivi après le lancement ?',
    answer: 'Absolument. Nous offrons des forfaits de maintenance et d\'optimisation continue pour assurer la croissance de votre projet sur le long terme. Le succès ne s\'arrête pas au lancement.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="section-padding bg-gradient-to-b from-white to-bg-light">
      <div className="container-max max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-dark mb-4">Questions Fréquentes</h2>
          <p className="text-lg sm:text-xl text-text-light">Tout ce que vous devez savoir avant de vous lancer</p>
        </motion.div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-text-dark">{faq.question}</h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-primary" />
                  ) : (
                    <Plus className="w-5 h-5 text-primary" />
                  )}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6">
                      <p className="text-text-light">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}