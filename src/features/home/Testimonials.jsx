import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { HiStar } from 'react-icons/hi2';

const testimonials = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Business Traveler",
    quote: "The easiest car rental experience I've ever had. The Porsche 911 was in pristine condition, and the pickup process took less than 5 minutes.",
    rating: 5,
    avatar: "S"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Vacationer",
    quote: "Rented a Range Rover for our family trip. The car was spotless, comfortable, and the customer service team was incredibly helpful when we needed to extend our rental.",
    rating: 5,
    avatar: "M"
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Local Resident",
    quote: "I use RideMint whenever I need a vehicle for special occasions. The booking process is clear and easy to follow.",
    rating: 5,
    avatar: "E"
  }
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 lg:py-32 bg-surface-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white">What Our Customers Say</h2>
          <p className="text-surface-400 text-lg mt-4 max-w-2xl mx-auto">Real experiences from our valued clients</p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-surface-900 border border-surface-800 rounded-3xl p-8 relative flex flex-col h-full"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <HiStar key={i} className="w-5 h-5 text-yellow-400" />
                ))}
              </div>
              <p className="text-white text-lg mb-8 italic flex-1">"{testimonial.quote}"</p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="text-white font-bold">{testimonial.name}</h4>
                  <p className="text-surface-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
