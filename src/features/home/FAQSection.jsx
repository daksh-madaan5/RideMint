import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HiPlus, HiMinus } from 'react-icons/hi2';
import { clsx } from 'clsx';

const faqs = [
  {
    question: "How do I book a car?",
    answer: "Booking a car is simple. Browse our fleet, select your desired dates, and proceed to checkout. You can complete the entire process online in just a few minutes."
  },
  {
    question: "What documents do I need?",
    answer: "You will need a valid driving licence and the booking documents specified during confirmation. Final eligibility requirements will be documented before launch."
  },
  {
    question: "Can I cancel my booking?",
    answer: "Yes, you can cancel your booking for a full refund up to 48 hours before your scheduled pickup time. Cancellations made within 48 hours may be subject to a fee."
  },
  {
    question: "Is insurance included?",
    answer: "Basic liability coverage is included with all rentals. We also offer comprehensive premium coverage options at checkout for complete peace of mind during your journey."
  },
  {
    question: "What fuel policy do you follow?",
    answer: "We operate on a full-to-full policy. The vehicle will be provided with a full tank of fuel, and it should be returned with a full tank to avoid refueling charges."
  },
  {
    question: "Do you offer long-term rentals?",
    answer: "Absolutely. We offer competitive rates for weekly and monthly rentals. Contact our corporate team for customized long-term leasing solutions."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-20 lg:py-32 bg-surface-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-surface-400 text-lg mt-4">Common questions about renting with RideMint</p>
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
                  isOpen ? "bg-surface-800 border-surface-700" : "bg-surface-950 border-surface-800 hover:border-surface-700"
                )}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="text-lg font-medium text-white">{faq.question}</span>
                  <div className="ml-4 flex-shrink-0">
                    {isOpen ? (
                      <HiMinus className="w-6 h-6 text-primary-400" />
                    ) : (
                      <HiPlus className="w-6 h-6 text-surface-400" />
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
                      <div className="px-6 pb-6 text-surface-400">
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
