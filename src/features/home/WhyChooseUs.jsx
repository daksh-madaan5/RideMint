import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { HiTruck, HiCurrencyDollar, HiChatBubbleLeftRight, HiClock } from 'react-icons/hi2';

const features = [
  {
    icon: HiTruck,
    title: "Premium Fleet",
    description: "Wide selection of luxury and comfort vehicles meticulously maintained for you."
  },
  {
    icon: HiCurrencyDollar,
    title: "Best Prices",
    description: "Competitive daily rates with no hidden fees. What you see is what you pay."
  },
  {
    icon: HiChatBubbleLeftRight,
    title: "24/7 Support",
    description: "Round-the-clock customer assistance to ensure your journey is always smooth."
  },
  {
    icon: HiClock,
    title: "Easy Booking",
    description: "Book your dream car in under 2 minutes with our streamlined platform."
  }
];

export default function WhyChooseUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 lg:py-32 bg-surface-950 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white">Why Choose DriveFleet</h2>
          <p className="text-surface-400 text-lg mt-4 max-w-2xl mx-auto">Experience the pinnacle of car rental service</p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              className="bg-surface-900 border border-surface-800 rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300 group"
            >
              <div className="w-14 h-14 bg-surface-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-500/20 group-hover:text-primary-400 transition-colors">
                <feature.icon className="w-7 h-7 text-white group-hover:text-primary-400 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-surface-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
