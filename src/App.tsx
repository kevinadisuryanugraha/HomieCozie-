import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AppMode, 
  ReviewItem,
  CommunityEvent 
} from './types';
import { 
  GOOGLE_REVIEWS, 
  CAFE_INFO 
} from './data/mockData';
import { useAppStore } from './store/useAppStore';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/CustomerPortal/HeroSection';
import { GoogleProofBanner } from './components/CustomerPortal/GoogleProofBanner';
import { MenuExplorer } from './components/CustomerPortal/MenuExplorer';
import { EventCommunitySection } from './components/CustomerPortal/EventCommunitySection';
import { LoyaltySection } from './components/CustomerPortal/LoyaltySection';
import { LocationHoursSection } from './components/CustomerPortal/LocationHoursSection';
import { AboutSection } from './components/CustomerPortal/AboutSection';
import { GallerySection } from './components/CustomerPortal/GallerySection';
import { FAQSection } from './components/CustomerPortal/FAQSection';
import { FeedbackReviewModal } from './components/CustomerPortal/FeedbackReviewModal';
import { CoffeeTasteQuiz } from './components/CustomerPortal/CoffeeTasteQuiz';
import { WaiterCallWidget } from './components/CustomerPortal/WaiterCallWidget';
import { LiveOrderTrackerModal } from './components/CustomerPortal/LiveOrderTrackerModal';

import { AuthPage } from './pages/AuthPage';
import { ReservationPage } from './pages/ReservationPage';
import { OrderCheckoutPage } from './pages/OrderCheckoutPage';
import { MemberPortalPage } from './pages/MemberPortalPage';
import { MobileBottomDock } from './components/Mobile/MobileBottomDock';
import { PWAInstallBanner } from './components/Mobile/PWAInstallBanner';
import { ScrollReveal } from './components/Common/ScrollReveal';
import { BackToTopButton } from './components/Common/BackToTopButton';

import { EnterpriseBackoffice } from './components/BackstageOps/EnterpriseBackoffice';
import { PitchDeckModal } from './components/PRDPresentation/PitchDeckModal';
import { telemetryTracker } from './services/telemetryTracker';

import { 
  ShoppingBag, 
  Lock, 
  Key, 
  ShieldAlert, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const {
    appMode,
    customerTab,
    backstageModule,
    currentSystemUser,
    auditLogs,
    tables,
    reservations,
    orders,
    cartItems,
    toastMessage,
    customerActiveOrder,
    isGlobalTrackerOpen,
    isOnline,
    syncFromHash,
    setAppMode,
    setCustomerTab,
    setBackstageModule,
    navigateToMode,
    showToast,
    setCurrentUser,
    loginStaff,
    logoutStaff,
    addAuditLog,
    updateTableStatus,
    addReservation,
    updateReservationStatus,
    addOrder,
    updateOrderStatus,
    setCustomerActiveOrder,
    setIsGlobalTrackerOpen,
    setIsOnline,
    addToCart,
    updateCartQty,
    removeCartItem,
    clearCart,
    requestAssistance,
    fetchInitialDataFromAPI
  } = useAppStore();

  const [reviews, setReviews] = useState<ReviewItem[]>(GOOGLE_REVIEWS);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false);

  // Initial Data Sync from Laravel API & Telemetry Init
  useEffect(() => {
    fetchInitialDataFromAPI();
    telemetryTracker.init();
  }, [fetchInitialDataFromAPI]);

  // Network Online / Offline Listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('✓ Koneksi pulih: Data tersinkronisasi kembali live');
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('⚠️ Koneksi terputus: Mode Offline PWA aktif (Data tersimpan di perangkat lokal)', 5000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setIsOnline, showToast]);

  // Listen to browser Back/Forward/hash changes
  useEffect(() => {
    const onHashChange = () => {
      syncFromHash(window.location.hash);
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [syncFromHash]);

  // Handle RSVP event
  const handleRSVPEvent = (event: CommunityEvent) => {
    showToast(`✓ Kursi Anda di "${event.title}" telah diamankan! Kami tunggu di Homie Cozie.`);
  };

  // Handle customer review
  const handleSubmitReview = (newReview: any) => {
    setReviews(prev => [newReview, ...prev]);
    showToast('✓ Ulasan Anda telah terkirim! Terima kasih atas feedback hangat Anda.');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F1A16] flex flex-col font-sans selection:bg-[#C84B27] selection:text-white overflow-x-hidden w-full min-w-0">
      
      {/* Toast Notification Alert Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-stone-900/95 text-white border border-amber-500/40 shadow-2xl backdrop-blur-md flex items-center gap-3 text-xs font-semibold max-w-md w-[92%]"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="flex-1">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Navbar Header (Customer, Reservation, Order, Member Modes) */}
      {appMode !== 'backstage' && appMode !== 'auth' && (
        <Navbar
          currentMode={appMode}
          onModeChange={(mode) => navigateToMode(mode)}
          cartItemCount={cartItems.reduce((acc, it) => acc + it.quantity, 0)}
          activeCustomerTab={customerTab}
          onSelectCustomerTab={(tab) => {
            setCustomerTab(tab);
            navigateToMode('customer', undefined, tab);
          }}
          currentUser={currentSystemUser}
          onLogout={logoutStaff}
        />
      )}

      {/* Main Mode Router Transition Views */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0 w-full overflow-x-hidden">
        
        {/* 1. CUSTOMER HOME PORTAL */}
        {appMode === 'customer' && (
          <motion.div
            key="customer-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex-1 space-y-16 sm:space-y-24 pb-20"
          >
            <main className="space-y-16 sm:space-y-24">
              <HeroSection
                onOpenReservation={() => navigateToMode('reservation')}
                onOpenMenu={() => {
                  const elem = document.getElementById('menu-section');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              <ScrollReveal direction="up" delay={0.02}>
                <GoogleProofBanner
                  reviews={reviews}
                  onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
                />
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.04}>
                <AboutSection />
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.04}>
                <MenuExplorer
                  onAddToCart={(item, qty, options, notes) => addToCart(item, qty, options, notes)}
                  onOpenReservation={() => navigateToMode('reservation')}
                />
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.04}>
                <CoffeeTasteQuiz
                  onAddToCart={(item) => addToCart(item, 1)}
                  onOpenMenu={() => {
                    const elem = document.getElementById('menu-section');
                    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                  }}
                />
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.04}>
                <GallerySection />
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.04}>
                <EventCommunitySection
                  onRSVPEvent={handleRSVPEvent}
                />
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.04}>
                <LoyaltySection
                  onOpenMenu={() => navigateToMode('member')}
                />
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.04}>
                <FAQSection />
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.04}>
                <LocationHoursSection
                  onOpenReservation={() => navigateToMode('reservation')}
                />
              </ScrollReveal>
            </main>
          </motion.div>
        )}

        {/* 2. RESERVATION PAGE */}
        {appMode === 'reservation' && (
          <motion.div
            key="reservation-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex-1"
          >
            <ReservationPage
              tables={tables}
              onConfirmReservation={(res) => addReservation(res)}
              onNavigateTo={(mode) => navigateToMode(mode)}
            />
          </motion.div>
        )}

        {/* 3. ORDER CHECKOUT PAGE */}
        {appMode === 'order' && (
          <motion.div
            key="order-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex-1"
          >
            <OrderCheckoutPage
              cartItems={cartItems}
              onUpdateQuantity={updateCartQty}
              onRemoveItem={removeCartItem}
              onClearCart={clearCart}
              onAddToCart={(item, qty) => addToCart(item, qty)}
              onSubmitOrder={(ord) => addOrder(ord)}
              onNavigateTo={(mode) => navigateToMode(mode)}
            />
          </motion.div>
        )}

        {/* 4. MEMBER PORTAL PAGE */}
        {appMode === 'member' && (
          <motion.div
            key="member-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex-1"
          >
            <MemberPortalPage
              currentUser={currentSystemUser}
              onNavigateTo={(mode) => navigateToMode(mode)}
              onShowToast={showToast}
            />
          </motion.div>
        )}

        {/* 5. AUTH PAGE */}
        {appMode === 'auth' && (
          <motion.div
            key="auth-mode"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="flex-1"
          >
            <AuthPage
              currentUser={currentSystemUser}
              onLoginSuccess={(usr, log, targetModule) => loginStaff(usr, log, targetModule)}
              onNavigateTo={(mode) => navigateToMode(mode)}
              auditLogs={auditLogs}
              onLogout={logoutStaff}
            />
          </motion.div>
        )}

        {/* 6. ENTERPRISE BACKOFFICE */}
        {appMode === 'backstage' && (
          <motion.div
            key="backstage-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex-1 w-full h-full max-h-full overflow-hidden bg-[#FAF7F2]"
          >
            {currentSystemUser.role === 'guest' || currentSystemUser.role === 'member' ? (
              <div className="min-h-screen bg-[#14100E] text-white flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-[#1C1613] border border-rose-600/50 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
                  <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-600 flex items-center justify-center text-rose-400 mx-auto shadow-lg">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800 uppercase">
                      HTTP 401 UNAUTHORIZED
                    </span>
                    <h2 className="text-xl font-display font-black text-white">
                      Akses Dibatasi: Area Staf Operasional
                    </h2>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      Halaman Backstage POS Kasir, Kitchen KDS, dan Manajemen Restoran hanya dapat diakses oleh staf terverifikasi dengan izin aktif.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col gap-3">
                    <button
                      onClick={() => navigateToMode('auth')}
                      className="w-full py-3 rounded-2xl bg-[#E4572E] hover:bg-[#C93B13] text-white font-display font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                    >
                      <Key className="w-4 h-4" />
                      <span>Login Akun Staf Sekarang</span>
                    </button>
                    <button
                      onClick={() => navigateToMode('customer')}
                      className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Kembali ke Halaman Publik
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <EnterpriseBackoffice
                currentSystemUser={currentSystemUser}
                initialModule={backstageModule}
                onSwitchUser={(u) => setCurrentUser(u)}
                tables={tables}
                orders={orders}
                reservations={reservations}
                auditLogs={auditLogs}
                onUpdateTableStatus={updateTableStatus}
                onUpdateOrderStatus={updateOrderStatus}
                onUpdateReservationStatus={updateReservationStatus}
                onSubmitOrder={addOrder}
                onAddAuditLog={addAuditLog}
                onNavigateToCustomerPortal={() => navigateToMode('customer')}
                onNavigateToAuthPage={() => navigateToMode('auth')}
                onOpenPitchDeck={() => navigateToMode('prd-pitch')}
                showToast={showToast}
              />
            )}
          </motion.div>
        )}

        {/* 7. PRD BLUEPRINT */}
        {appMode === 'prd-pitch' && (
          <motion.div
            key="prd-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex-1"
          >
            {currentSystemUser.role === 'guest' || currentSystemUser.role === 'member' ? (
              <div className="min-h-screen bg-[#14100E] text-white flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-[#1C1613] border border-amber-600/50 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
                  <div className="w-16 h-16 rounded-2xl bg-amber-950/80 border border-amber-600 flex items-center justify-center text-amber-400 mx-auto shadow-lg">
                    <Lock className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800 uppercase">
                      INTERNAL BLUEPRINT ONLY
                    </span>
                    <h2 className="text-xl font-display font-black text-white">
                      Dokumen PRD & Arsitektur Sistem
                    </h2>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      Dokumen arsitektur teknis dan roadmap enterprise hanya dapat diakses oleh Manajemen (Super Admin, Owner, Manager).
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col gap-3">
                    <button
                      onClick={() => navigateToMode('auth')}
                      className="w-full py-3 rounded-2xl bg-[#E4572E] hover:bg-[#C93B13] text-white font-display font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                    >
                      <Key className="w-4 h-4" />
                      <span>Login Akun Manajemen</span>
                    </button>
                    <button
                      onClick={() => navigateToMode('customer')}
                      className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
                    >
                      Kembali ke Halaman Publik
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <PitchDeckModal
                onSwitchToCustomerDemo={() => navigateToMode('customer')}
                onSwitchToBackstageDemo={() => navigateToMode('backstage')}
              />
            )}
          </motion.div>
        )}

      </div>

      {/* Global Footer (Customer, Reservation, Order, Member Modes) */}
      {appMode !== 'backstage' && appMode !== 'auth' && (
        <footer className="bg-white border-t border-[#EAE2D8] text-[#1F1A16] pt-14 pb-12 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
              
              {/* Col 1: Brand Info */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-[#EAE2D8] shadow-xs flex items-center justify-center overflow-hidden">
                    <img
                      src={CAFE_INFO.logo}
                      alt="Homie Cozie Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-display font-black text-lg text-[#1F1A16] block leading-tight">
                      Homie Cozie
                    </span>
                    <span className="text-[11px] font-mono text-amber-800 font-bold block">
                      Coffee & Kitchen • Kalisari
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#5C5248] leading-relaxed max-w-sm">
                  Ruang ngopi, bersantap, dan temu komunitas dengan sajian kopi specialty Nusantara, hidangan dapur rumahan berstandar chef, serta alunan panggung Live Music akustik akhir pekan.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <span className="bg-amber-50 text-amber-800 text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border border-amber-200">
                    ⭐ 4.8 / 5.0 (268+ Ulasan Google)
                  </span>
                  <span className="bg-emerald-50 text-emerald-800 text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border border-emerald-200">
                    100% Halal
                  </span>
                </div>
              </div>

              {/* Col 2: Navigation Links */}
              <div className="lg:col-span-4 space-y-3">
                <div className="font-display font-bold text-sm text-[#1F1A16] uppercase tracking-wider">
                  Jelajahi Halaman
                </div>
                <div className="grid grid-cols-2 gap-2.5 text-xs font-medium text-[#5C5248]">
                  <button
                    onClick={() => {
                      navigateToMode('customer');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-left hover:text-[#C84B27] transition-colors cursor-pointer"
                  >
                    • Beranda
                  </button>
                  <button
                    onClick={() => {
                      navigateToMode('customer');
                      document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-left hover:text-[#C84B27] transition-colors cursor-pointer"
                  >
                    • Tentang Kami
                  </button>
                  <button
                    onClick={() => {
                      navigateToMode('customer');
                      document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-left hover:text-[#C84B27] transition-colors cursor-pointer"
                  >
                    • Daftar Menu
                  </button>
                  <button
                    onClick={() => {
                      navigateToMode('customer');
                      document.getElementById('gallery-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-left hover:text-[#C84B27] transition-colors cursor-pointer"
                  >
                    • Galeri Foto
                  </button>
                  <button
                    onClick={() => {
                      navigateToMode('customer');
                      document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-left hover:text-[#C84B27] transition-colors cursor-pointer"
                  >
                    • Event & Musik
                  </button>
                  <button
                    onClick={() => {
                      navigateToMode('customer');
                      document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-left hover:text-[#C84B27] transition-colors cursor-pointer"
                  >
                    • FAQ / Bantuan
                  </button>
                  <button
                    onClick={() => navigateToMode('reservation')}
                    className="text-left text-[#C84B27] hover:underline font-bold cursor-pointer"
                  >
                    • Reservasi Meja
                  </button>
                  <button
                    onClick={() => navigateToMode('order')}
                    className="text-left text-[#C84B27] hover:underline font-bold cursor-pointer"
                  >
                    • Pesan QRIS
                  </button>
                </div>
              </div>

              {/* Col 3: Hours & Contacts */}
              <div className="lg:col-span-3 space-y-3">
                <div className="font-display font-bold text-sm text-[#1F1A16] uppercase tracking-wider">
                  Jam Buka & Kontak
                </div>
                <div className="space-y-2 text-xs text-[#5C5248]">
                  <div>
                    <div className="font-bold text-[#1F1A16]">Selasa – Minggu:</div>
                    <div className="text-[#8C7E72]">{CAFE_INFO.operatingHours.weekdays}</div>
                  </div>
                  <div>
                    <div className="font-bold text-[#1F1A16]">Akhir Pekan (Live Music):</div>
                    <div className="text-[#8C7E72]">{CAFE_INFO.operatingHours.weekends}</div>
                  </div>
                  <div className="pt-1">
                    <div className="font-bold text-[#1F1A16]">WhatsApp Kafe:</div>
                    <a
                      href={`https://wa.me/${CAFE_INFO.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 hover:underline font-mono font-bold"
                    >
                      {CAFE_INFO.whatsapp}
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Strip */}
            <div className="pt-8 border-t border-[#EAE2D8] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#8C7E72] pb-16 md:pb-0">
              <div>
                © 2020 – 2026 <strong className="text-[#1F1A16]">Homie Cozie Coffee & Kitchen</strong>. All rights reserved.
              </div>
              <div className="text-center md:text-right font-mono">
                {CAFE_INFO.address}
              </div>
            </div>

          </div>
        </footer>
      )}

      {/* Desktop Floating Cart Pill */}
      <AnimatePresence>
        {cartItems.length > 0 && appMode !== 'order' && appMode !== 'backstage' && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="hidden md:flex fixed bottom-6 right-6 z-40 items-center gap-3 bg-white border-2 border-[#C84B27] p-2.5 pl-4 rounded-2xl shadow-xl text-[#1F1A16]"
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-amber-600" />
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#C84B27] text-white font-mono text-[10px] font-bold flex items-center justify-center">
                  {cartItems.reduce((acc, it) => acc + it.quantity, 0)}
                </span>
              </div>
              <div className="space-y-0.5 pr-2">
                <div className="text-[10px] text-[#8C7E72] font-mono leading-none">Total Pesanan</div>
                <div className="font-mono font-bold text-sm text-[#1F1A16] leading-none">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(
                    cartItems.reduce((acc, it) => acc + it.menuItem.price * it.quantity, 0)
                  )}
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateToMode('order')}
              className="px-4 py-2 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PWA Install Promotion Banner */}
      {appMode !== 'backstage' && <PWAInstallBanner />}

      {/* Mobile Floating Bottom Navigation Dock */}
      {appMode !== 'backstage' && (
        <MobileBottomDock
          currentMode={appMode}
          onModeChange={(mode) => navigateToMode(mode)}
          cartItemCount={cartItems.reduce((acc, it) => acc + it.quantity, 0)}
        />
      )}

      {/* Floating Waiter Call / Assistance Widget */}
      {(appMode === 'customer' || appMode === 'order') && (
        <WaiterCallWidget
          currentTableNumber="06"
          onRequestAssistance={requestAssistance}
        />
      )}

      {/* Floating Active Order Live Tracker Pill */}
      {customerActiveOrder && appMode === 'customer' && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          onClick={() => setIsGlobalTrackerOpen(true)}
          className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-40 px-4 py-2.5 rounded-2xl bg-stone-900 text-white border border-amber-500/40 shadow-xl flex items-center gap-3 hover:bg-black transition-all cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold relative">
            <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5" />
            ☕
          </div>
          <div className="text-left space-y-0.5 pr-1">
            <div className="text-[10px] text-amber-400 font-mono font-bold leading-none flex items-center gap-1.5">
              <span>Pesanan #{customerActiveOrder.orderNumber}</span>
              <span className="text-stone-400">• Meja #{customerActiveOrder.tableNumber || 'Takeaway'}</span>
            </div>
            <div className="text-xs font-bold text-stone-100 leading-none group-hover:text-amber-300 transition-colors">
              Pantau Dapur (Live Tracker) ➔
            </div>
          </div>
        </motion.button>
      )}

      {/* Global Live Order Tracker Modal */}
      {customerActiveOrder && (
        <LiveOrderTrackerModal
          isOpen={isGlobalTrackerOpen}
          onClose={() => setIsGlobalTrackerOpen(false)}
          order={customerActiveOrder}
          onUpdateStatus={(ordId, status) => updateOrderStatus(ordId, status)}
        />
      )}

      {/* Feedback Review Modal */}
      <FeedbackReviewModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmitReview={handleSubmitReview}
      />

      {/* Floating Back To Top Button */}
      {appMode === 'customer' && <BackToTopButton />}

    </div>
  );
}
