/**
 * Dynamic Lazy Loaded Confetti Utility
 * Prevents canvas-confetti from inflating initial page load bundle
 */
export const triggerConfetti = (options?: Record<string, any>) => {
  import('canvas-confetti')
    .then((module) => {
      const confetti = (module.default || module) as any;
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.7 },
          ...options,
        });
      }
    })
    .catch(() => {});
};
