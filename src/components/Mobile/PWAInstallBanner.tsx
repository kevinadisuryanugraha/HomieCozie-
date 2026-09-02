import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  X, 
  Sparkles, 
  Smartphone, 
  Check, 
  Share, 
  PlusSquare,
  ArrowRight
} from 'lucide-react';
import { CAFE_INFO } from '../../data/mockData';

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Check if already in standalone / PWA mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Check if user dismissed prompt recently
    const dismissed = localStorage.getItem('homie_cozie_pwa_dismissed');
    if (dismissed && Date.now() - parseInt(dismissed) < 86400000 * 3) {
      // Dismissed within last 3 days
      return;
    }

    // Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome|crios|crmo/.test(userAgent);
    if (isIosDevice && isSafari) {
      setIsIOS(true);
      // Show iOS helper banner after a slight delay
      const timer = setTimeout(() => setShowBanner(true), 3500);
      return () => clearTimeout(timer);
    }

    // Listen for beforeinstallprompt on Chromium / Android / Desktop
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowBanner(true), 2500);
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
    localStorage.setItem('homie_cozie_pwa_dismissed', Date.now().toString());
  };

  if (isInstalled || !showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="fixed top-16 left-4 right-4 sm:left-auto sm:right-6 sm:top-auto sm:bottom-20 z-50 max-w-sm pointer-events-auto"
      >
        <div className="bg-[#1A1512] border border-[#2E2520] p-4 rounded-2xl shadow-xl text-stone-100 relative">
          
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 w-6 h-6 rounded-full bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Tutup Banner"
          >
            <X className="w-3 h-3" />
          </button>

          <div className="flex items-start gap-3 pr-5">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-900 border border-[#3D322B] p-0.5 shrink-0 shadow-sm">
              <img
                src={CAFE_INFO.logo}
                alt="Homie Cozie Logo"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            <div className="space-y-0.5 min-w-0">
              <div className="text-[10px] font-mono font-medium text-stone-400 uppercase">
                Aplikasi Web PWA
              </div>
              <h4 className="font-display font-bold text-sm text-white leading-tight">
                Homie Cozie App
              </h4>
              <p className="text-[11px] text-stone-300 leading-snug">
                Pasang di layar utama untuk akses cepat reservasi & pesanan.
              </p>
            </div>
          </div>

          {/* Action Area */}
          <div className="mt-3 pt-2.5 border-t border-[#2E2520] flex items-center gap-2">
            {isIOS ? (
              <div className="text-[11px] text-stone-300 bg-stone-900 p-2 rounded-xl border border-[#2E2520] w-full flex items-center gap-2">
                <Share className="w-4 h-4 text-amber-300 shrink-0" />
                <span>
                  Ketuk <strong>Share</strong> lalu pilih <strong>'Tambah ke Layar Utama'</strong>.
                </span>
              </div>
            ) : (
              <>
                <button
                  onClick={handleInstallClick}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Pasang Aplikasi</span>
                </button>
                <button
                  onClick={handleDismiss}
                  className="py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 text-xs"
                >
                  Nanti
                </button>
              </>
            )}
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};
