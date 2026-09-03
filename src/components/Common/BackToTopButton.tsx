import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export const BackToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { scrollY, scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsVisible(latest > 350);
    });
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.94 }}
          onClick={scrollToTop}
          aria-label="Kembali ke atas"
          className="fixed bottom-20 md:bottom-8 right-5 z-40 w-11 h-11 rounded-2xl bg-white text-[#1F1A16] border border-[#EAE2D8] shadow-lg flex items-center justify-center cursor-pointer group transition-colors hover:border-[#C84B27]"
        >
          <div className="relative flex items-center justify-center">
            <ArrowUp className="w-4 h-4 text-[#1F1A16] group-hover:text-[#B23812] transition-colors" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
