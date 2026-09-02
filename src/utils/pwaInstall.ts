/**
 * PWA Install & Service Worker Registration Manager
 */

let deferredPrompt: any = null;

export const registerServiceWorker = () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('⚡ PWA Service Worker Registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('PWA Service Worker registration skipped:', err);
        });
    });

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      window.dispatchEvent(new CustomEvent('pwa-installable'));
    });
  }
};

export const promptPWAInstall = async (): Promise<boolean> => {
  if (!deferredPrompt) {
    return false;
  }
  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  deferredPrompt = null;
  return choice.outcome === 'accepted';
};
