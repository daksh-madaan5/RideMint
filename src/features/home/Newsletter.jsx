import { useState } from 'react';
import { motion } from 'motion/react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <section className="py-20 lg:py-32 bg-surface-950 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-surface-800 to-surface-900 border border-surface-700 p-10 md:p-16 text-center"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_top,rgba(14,165,233,0.15),transparent_50%)] pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white mb-4">
              Stay in the Fast Lane
            </h2>
            <p className="text-surface-400 text-lg mb-8">
              Subscribe to our newsletter to get exclusive deals, luxury car updates, and travel inspiration delivered straight to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-surface-950 border border-surface-700 rounded-full px-6 py-4 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                required
              />
              <button
                type="submit"
                disabled={status !== 'idle'}
                className="bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-full px-8 py-4 transition-colors disabled:opacity-70 flex items-center justify-center min-w-[140px]"
              >
                {status === 'loading' ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : status === 'success' ? (
                  'Subscribed!'
                ) : (
                  'Subscribe'
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
