import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  QrCode, 
  Clock, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles, 
  Printer, 
  ArrowRight, 
  X,
  Smartphone,
  ShieldCheck,
  RefreshCw,
  Wallet
} from 'lucide-react';
import { triggerConfetti } from "../../utils/confettiHelper";
import { Order } from '../../types';
import { CAFE_INFO } from '../../data/mockData';
import { soundService } from '../../utils/audioChime';
import { api } from '../../services/api';
import { realtimeService } from '../../services/realtime';
import { printThermalReceipt } from '../../utils/thermalPrinter';

interface QRISDynamicModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onPaymentSuccess: (order: Order) => void;
  onOpenReceipt: (order: Order) => void;
}

export const QRISDynamicModal: React.FC<QRISDynamicModalProps> = ({
  isOpen,
  onClose,
  order,
  onPaymentSuccess,
  onOpenReceipt
}) => {
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(300); // 5 minutes
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'verifying' | 'success'>('pending');
  const [selectedApp, setSelectedApp] = useState<string>('BCA Mobile');
  const [copiedAmount, setCopiedAmount] = useState<boolean>(false);
  const [qrString, setQrString] = useState<string>('');

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  // Fetch Live QRIS from Midtrans API & Bind Realtime WebSocket Listener
  useEffect(() => {
    if (!isOpen || !order) return;

    // 1. Charge QRIS via Backend API
    api.payment.chargeQRIS(order.id)
      .then(res => {
        if (res?.payment?.qr_string) {
          setQrString(res.payment.qr_string);
        }
      })
      .catch(e => {
        console.warn('Midtrans live charge offline fallback:', e);
      });

    // 2. Real-time WebSocket listener from Reverb when Webhook settles
    realtimeService.onOrderStatusUpdated((updatedOrder) => {
      if (
        (updatedOrder.id === order.id || updatedOrder.order_number === order.orderNumber) &&
        (updatedOrder.payment_status === 'paid' || updatedOrder.status === 'preparing' || updatedOrder.status === 'ready')
      ) {
        setPaymentStatus('success');
        soundService.playCashRegisterSound();
        try {
          triggerConfetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        } catch {}
        onPaymentSuccess({ ...order, paymentStatus: 'paid', paymentMethod: 'qris' });
      }
    });
  }, [isOpen, order, onPaymentSuccess]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || paymentStatus === 'success') return;

    setTimeLeftSeconds(300);
    const interval = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, paymentStatus]);

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(String(order.total));
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  const handleSimulatePayment = (app: string) => {
    setSelectedApp(app);
    setPaymentStatus('verifying');

    // Trigger local simulation & call webhook endpoint
    setTimeout(() => {
      api.payment.handleWebhook?.(order.id).catch(() => {});

      setPaymentStatus('success');
      soundService.playCashRegisterSound();

      try {
        triggerConfetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {}

      const updatedOrder: Order = {
        ...order,
        paymentStatus: 'paid',
        paymentMethod: 'qris'
      };
      onPaymentSuccess(updatedOrder);
    }, 1200);
  };

  if (!isOpen) return null;

  const currentQRData = qrString || `00020101021226600016ID.CO.HOMIECOZIE0118936009180000000000520458125303360540${order.total}5802ID5912HOMIE_COZIE6013JAKARTA_TIMUR62150111HC-${order.orderNumber}6304`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl border border-[#EAE2D8] w-full max-w-md overflow-hidden flex flex-col my-auto"
        >
          {/* Header */}
          <div className="bg-[#FAF7F2] p-4 sm:p-5 border-b border-[#EAE2D8] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white border border-[#EAE2D8] flex items-center justify-center text-[#C84B27] shadow-2xs font-bold text-xs">
                QRIS
              </div>
              <div>
                <h3 className="font-display font-black text-sm sm:text-base text-[#1F1A16]">
                  Pembayaran QRIS Dinamis
                </h3>
                <p className="text-[11px] text-[#5C5248] font-medium">
                  NMID: ID1020038475892 • {CAFE_INFO.name}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-stone-200 text-[#5C5248] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content Body */}
          <div className="p-5 sm:p-6 space-y-5">
            {paymentStatus === 'success' ? (
              /* Success State */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4 space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md border border-emerald-200">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <span className="text-[11px] font-mono font-bold text-emerald-800 uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                    Pembayaran Berhasil Terverifikasi
                  </span>
                  <h4 className="font-display font-black text-xl text-[#1F1A16] mt-1.5">
                    {formatRupiah(order.total)}
                  </h4>
                  <p className="text-xs text-[#5C5248] mt-1">
                    Dibayar via <strong>{selectedApp}</strong> • No. Pesanan #{order.orderNumber}
                  </p>
                </div>

                <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EAE2D8] text-xs text-left space-y-1.5">
                  <div className="flex justify-between text-[#5C5248]">
                    <span>Waktu Pembayaran:</span>
                    <span className="font-mono text-[#1F1A16] font-bold">{new Date().toLocaleTimeString('id-ID')} WIB</span>
                  </div>
                  <div className="flex justify-between text-[#5C5248]">
                    <span>Meja / Lokasi:</span>
                    <span className="font-bold text-[#1F1A16]">{order.orderType === 'dine-in' ? `Meja #${order.tableNumber || '01'}` : 'Bawa Pulang (Takeaway)'}</span>
                  </div>
                  <div className="flex justify-between text-[#5C5248]">
                    <span>Kode Referensi:</span>
                    <span className="font-mono text-amber-800 font-bold">QRIS-{Date.now().toString().slice(-8)}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => printThermalReceipt(order, { paperWidth: '58mm', showTaxBreakdown: true })}
                    className="w-full py-3 rounded-2xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Cetak Struk Thermal Langsung</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-[#1F1A16] font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Pending Payment QRIS State */
              <>
                {/* Nominal Card */}
                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE2D8] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#5C5248] font-semibold block">Total Tagihan Pesanan:</span>
                    <span className="font-display font-black text-xl text-[#C84B27]">
                      {formatRupiah(order.total)}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyAmount}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-[#EAE2D8] hover:bg-stone-50 text-xs font-bold text-[#1F1A16] shadow-2xs cursor-pointer transition-colors"
                  >
                    {copiedAmount ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#C84B27]" />}
                    <span>{copiedAmount ? 'Disalin' : 'Salin'}</span>
                  </button>
                </div>

                {/* QR Code Container with Scanning Beam */}
                <div className="relative mx-auto w-64 h-64 bg-white p-3.5 rounded-3xl border-2 border-[#1F1A16] shadow-md flex flex-col items-center justify-between">
                  {/* Top QRIS Header Band */}
                  <div className="w-full flex items-center justify-between pb-1 border-b border-stone-200">
                    <span className="font-black text-[10px] tracking-wider text-rose-600">GPN</span>
                    <span className="font-bold text-[9px] text-[#5C5248] uppercase font-mono">QRIS Standar BI</span>
                    <span className="font-black text-[10px] text-[#1F1A16]">QRIS</span>
                  </div>

                  {/* QR Image */}
                  <div className="relative w-44 h-44 my-auto flex items-center justify-center bg-white">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(currentQRData)}`}
                      alt="QRIS Barcode Homie Cozie"
                      className="w-full h-full object-contain"
                    />

                    {/* Scanning Laser Beam */}
                    {paymentStatus === 'verifying' && (
                      <motion.div
                        animate={{ y: [-75, 75, -75] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C84B27] to-transparent shadow-[0_0_8px_#C84B27]"
                      />
                    )}
                  </div>

                  {/* Bottom Footer Band */}
                  <div className="w-full text-center text-[9px] font-mono text-[#5C5248] pt-1 border-t border-stone-200 truncate">
                    NMID: ID1020038475892 • SATU QRIS SEMUA PEMBAYARAN
                  </div>
                </div>

                {/* Countdown Timer */}
                <div className="flex items-center justify-center gap-2 text-xs font-mono">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="text-[#5C5248]">Kedaluwarsa dalam:</span>
                  <span className="font-bold text-[#C84B27] px-2 py-0.5 rounded-lg bg-amber-50 border border-amber-200">
                    {timeFormatted}
                  </span>
                </div>

                {/* Interactive Payment Simulator Triggers */}
                <div className="space-y-2 pt-2 border-t border-[#EAE2D8]">
                  <div className="text-[11px] font-bold text-[#5C5248] uppercase tracking-wider flex items-center justify-between">
                    <span>Simulasi Scan & Bayar:</span>
                    <span className="text-[10px] text-amber-800 lowercase font-normal font-sans">klik salah satu aplikasi</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'BCA Mobile', color: 'hover:border-blue-600 hover:text-blue-700' },
                      { name: 'Livin Mandiri', color: 'hover:border-amber-600 hover:text-amber-700' },
                      { name: 'GoPay / OVO', color: 'hover:border-emerald-600 hover:text-emerald-700' },
                      { name: 'ShopeePay / Dana', color: 'hover:border-rose-600 hover:text-rose-700' }
                    ].map((app) => (
                      <button
                        key={app.name}
                        disabled={paymentStatus === 'verifying'}
                        onClick={() => handleSimulatePayment(app.name)}
                        className={`p-2.5 rounded-xl border border-[#EAE2D8] bg-[#FAF7F2] text-xs font-bold text-[#1F1A16] flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-2xs ${app.color} ${
                          paymentStatus === 'verifying' ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {paymentStatus === 'verifying' && selectedApp === app.name ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C84B27]" />
                        ) : (
                          <Smartphone className="w-3.5 h-3.5 text-[#C84B27]" />
                        )}
                        <span>{app.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
