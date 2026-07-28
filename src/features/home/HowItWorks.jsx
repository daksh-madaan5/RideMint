import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { HiMagnifyingGlass, HiCalendarDays, HiKey } from 'react-icons/hi2';

const steps = [
  {
    icon: HiMagnifyingGlass,
    title: "Choose Your Car",
    description: "Browse our premium fleet and find the perfect vehicle for your journey."
  },
  {
    icon: HiCalendarDays,
    title: "Pick Your Dates",
    description: "Select your pickup and return dates with flexible scheduling options."
  },
  {
    icon: HiKey,
    title: "Drive & Enjoy",
    description: "Pick up your car, hit the road, and experience luxury on every drive."
  }
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 lg:py-32 bg-surface-900 border-y border-surface-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white">How It Works</h2>
          <p className="text-surface-400 text-lg mt-4 max-w-2xl mx-auto">Get on the road in three simple steps</p>
        </div>

        <div ref={ref} className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-surface-700 to-transparent"></div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: i * 0.2, ease: "easeOut" }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 bg-surface-950 border border-surface-800 rounded-full flex items-center justify-center mb-8 relative z-10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm border-4 border-surface-900">
                    {i + 1}
                  </div>
                  <step.icon className="w-10 h-10 text-primary-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-surface-400 leading-relaxed max-w-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
