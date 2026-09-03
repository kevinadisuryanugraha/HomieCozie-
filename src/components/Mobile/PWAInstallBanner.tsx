import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  X, 
  Share, 
  Sparkles, 
  Star, 
  Zap, 
  CheckCircle2, 
  PlusSquare
} from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);

  useEffect(() => {
    // Check if already in standalone / PWA mode
    if (
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://')
    ) {
      setIsInstalled(true);
      return;
    }

    // Check if user dismissed prompt recently (within 3 days)
    const dismissed = localStorage.getItem('homie_cozie_pwa_dismissed');
    if (dismissed && Date.now() - parseInt(dismissed, 10) < 86400000 * 3) {
      return;
    }

    // Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome|crios|crmo|fxios/.test(userAgent);
    if (isIosDevice && isSafari) {
      setIsIOS(true);
      const timer = setTimeout(() => setShowBanner(true), 3500);
      return () => clearTimeout(timer);
    }

    // Listen for beforeinstallprompt on Chromium / Android / Desktop
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowBanner(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for appinstalled event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setShowIOSModal(false);
    localStorage.setItem('homie_cozie_pwa_dismissed', Date.now().toString());
  };

  if (isInstalled || !showBanner) return null;

  return (
    <>
      <AnimatePresence>
        <motion.aside
          aria-label="Notifikasi Pemasangan Aplikasi"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-20 left-3 right-3 sm:bottom-6 sm:right-6 sm:left-auto sm:max-w-sm z-50 pointer-events-auto"
        >
          <div className="bg-[#181310]/95 backdrop-blur-xl border border-amber-900/30 p-3.5 sm:p-4 rounded-2xl shadow-2xl ring-1 ring-white/10 text-stone-100 relative overflow-hidden">
            
            {/* Ambient Brand Glow */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#C84B27]/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-amber-600/10 rounded-full blur-xl pointer-events-none" />

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-stone-800/80 text-stone-400 hover:text-white hover:bg-stone-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Tutup Banner PWA"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* App Branding Header */}
            <div className="flex items-start gap-3 pr-6 relative z-10">
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#14100E] border border-amber-500/30 p-1 shrink-0 shadow-md flex items-center justify-center">
                <img
                  src="/pwa-192x192.png"
                  alt="Homie Cozie Official Icon"
                  className="w-full h-full object-contain rounded-lg"
                  width="44"
                  height="44"
                />
              </div>

              <div className="space-y-1 min-w-0">
                <div className="font-display font-black text-sm text-white leading-tight">
                  Homie Cozie Coffee & Kitchen
                </div>
                <p className="text-[11px] text-stone-300 leading-snug font-normal">
                  Pasang di layar utama HP untuk akses cepat menu & reservasi meja.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-3 flex items-center gap-2 relative z-10">
              {isIOS ? (
                <button
                  onClick={() => setShowIOSModal(true)}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Share className="w-3.5 h-3.5 text-amber-300" />
                  <span>Petunjuk Pasang di iPhone</span>
                </button>
              ) : (
                <button
                  onClick={handleInstallClick}
                  className="flex-1 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#C84B27] to-[#DF552E] hover:from-[#B23E1C] hover:to-[#C84B27] active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Pasang Aplikasi</span>
                </button>
              )}

              <button
                onClick={handleDismiss}
                className="py-2.5 px-3 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-stone-300 hover:text-white font-medium text-xs cursor-pointer border border-stone-700 transition-colors"
              >
                Nanti Saja
              </button>
            </div>

          </div>
        </motion.aside>
      </AnimatePresence>

      {/* iOS Safari Installation Steps Modal */}
      <AnimatePresence>
        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="w-full max-w-sm bg-[#1A1512] border border-amber-900/40 rounded-3xl p-5 text-stone-100 shadow-2xl relative"
            >
              <button
                onClick={() => setShowIOSModal(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center cursor-pointer"
                aria-label="Tutup Panduan"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center pb-3">
                <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-[#14100E] border border-amber-500/40 p-1 flex items-center justify-center shadow-md">
                  <img src="/pwa-192x192.png" alt="Homie Cozie" className="w-full h-full object-contain rounded-xl" />
                </div>
                <h3 className="font-display font-black text-base text-white">Pasang di iPhone / iPad</h3>
                <p className="text-xs text-stone-300 mt-0.5">Ikuti 3 langkah mudah berikut di Safari:</p>
              </div>

              <div className="space-y-2.5 my-3 text-xs">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-900/90 border border-stone-800">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black shrink-0">
                    1
                  </div>
                  <div className="text-stone-200">
                    Ketuk tombol <strong className="text-amber-400">Bagikan (Share)</strong> <Share className="w-3.5 h-3.5 inline text-amber-400 mx-0.5" /> di bilah bawah browser Safari.
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-900/90 border border-stone-800">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black shrink-0">
                    2
                  </div>
                  <div className="text-stone-200">
                    Gulir ke bawah dan pilih <strong className="text-amber-400">'Tambah ke Layar Utama'</strong> <PlusSquare className="w-3.5 h-3.5 inline text-amber-400 mx-0.5" />.
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-900/90 border border-stone-800">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black shrink-0">
                    3
                  </div>
                  <div className="text-stone-200">
                    Ketuk <strong className="text-amber-400">'Tambah' (Add)</strong> di pojok kanan atas layar.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSModal(false)}
                className="w-full py-2.5 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-bold text-xs cursor-pointer transition-colors shadow-md mt-1"
              >
                Mengerti & Tutup
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
