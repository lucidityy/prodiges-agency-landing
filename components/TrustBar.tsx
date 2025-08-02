"use client";

import { motion } from 'framer-motion';

const logos = [
  { name: 'Notion', placeholder: 'N' },
  { name: 'Zapier', placeholder: 'Z' },
  { name: 'Stripe', placeholder: 'S' },
  { name: 'Ghost', placeholder: 'G' },
  { name: 'Figma', placeholder: 'F' },
  { name: 'Webflow', placeholder: 'W' },
];

export default function TrustBar() {
  return (
    <section className="py-16 bg-white/50">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className="text-text-light">Powered by industry-leading technology</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-16"
        >
          {logos.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="w-24 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl font-bold text-gray-400 group-hover:bg-gradient-to-br group-hover:from-primary/10 group-hover:to-accent/10 group-hover:text-primary transition-all duration-300">
                {logo.placeholder}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}