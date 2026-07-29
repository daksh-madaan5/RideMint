import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HiPlus, HiMinus } from 'react-icons/hi2';
import { clsx } from 'clsx';

const faqs = [
  {
    question: "How do I book a car?",
    answer: "Open an available listing, choose your rental dates, and sign in to send a booking request when online booking is available."
  },
  {
    question: "What documents do I need?",
    answer: "A valid driving licence and identity verification are required at pickup. The host confirms any additional rental requirements before pickup."
  },
  {
    question: "Can I cancel my booking?",
    answer: "Eligible pending or confirmed bookings may be cancelled before the pickup date. RideMint does not currently process payments or refunds."
  },
  {
    question: "How does the fuel policy work?",
    answer: "Return the vehicle with the same fuel level recorded at pickup. Review the listing details before sending a request."
  },
  {
    question: "Where will I collect the car?",
    answer: "The listing shows the city and available pickup area. The host shares the final pickup details after confirmation."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section data-dark-surface className="bg-[var(--dark-surface)] py-20 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl font-bold text-[var(--dark-text-primary)] lg:text-4xl">Frequently asked questions</h2>
          <p className="mt-4 text-lg text-[var(--dark-text-secondary)]">Common questions about renting with RideMint</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={clsx(
                  "border rounded-2xl overflow-hidden transition-colors duration-300",
                  isOpen
                    ? "border-[var(--dark-border)] bg-[var(--dark-surface-elevated)]"
                    : "border-[var(--dark-border)] bg-[var(--dark-surface)] hover:bg-[var(--dark-surface-elevated)]"
                )}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="focus-ring-dark flex w-full items-center justify-between p-6 text-left"
                >
                  <span className="text-lg font-medium text-[var(--dark-text-primary)]">{faq.question}</span>
                  <div className="ml-4 flex-shrink-0">
                    {isOpen ? (
                      <HiMinus className="w-6 h-6 text-primary-400" />
                    ) : (
                      <HiPlus className="h-6 w-6 text-[var(--dark-text-secondary)]" />
                    )}
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-[var(--dark-text-secondary)]">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
