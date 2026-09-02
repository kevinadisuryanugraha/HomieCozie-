import React from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
  amount?: number | 'some' | 'all';
}

/**
 * Lightweight Section Container
 * Renders instantly to eliminate blank scroll delays on Mobile & PWA
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`w-full min-w-0 ${className}`}>
      {children}
    </div>
  );
};
