import { motion } from 'motion/react';
import { Link } from 'react-router';

export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-r from-primary-900 to-surface-900 border-t border-surface-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            Ready to Hit the Road?
          </h2>
          <p className="text-surface-300 text-xl max-w-2xl mx-auto mb-10">
            Join thousands of happy customers. Book your dream car today and experience driving like never before.
          </p>
          <Link 
            to="/cars" 
            className="inline-block px-10 py-5 bg-white text-primary-950 font-bold rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            Get Started
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
