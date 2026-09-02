import React from 'react';
import { motion } from 'motion/react';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
  amount?: number | 'some' | 'all';
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  amount = 0
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0.85, y: 16 };
      case 'down':
        return { opacity: 0.85, y: -16 };
      case 'left':
        return { opacity: 0.85, x: 16 };
      case 'right':
        return { opacity: 0.85, x: -16 };
      case 'none':
        return { opacity: 0.9 };
      default:
        return { opacity: 0.85, y: 16 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '150px 0px 0px 0px', amount }}
      transition={{
        duration: 0.35,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
