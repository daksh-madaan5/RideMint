import React, { useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from 'motion/react';

export const AnimatedCounter = ({
  value,
  duration = 2,
  prefix = '',
  suffix = '',
  className
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const springValue = useSpring(0, {
    duration: duration * 1000,
    bounce: 0
  });
  
  const displayValue = useTransform(springValue, (current) => {
    return Math.round(current).toLocaleString();
  });

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
