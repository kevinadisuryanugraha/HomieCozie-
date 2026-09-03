import React, { useState } from 'react';
import { Reservation, CafeArea } from '../../types';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  Sparkles, 
  MapPin, 
  Music, 
  CheckCircle2, 
  MessageCircle, 
  Copy, 
  Share2, 
  Send,
  HeartHandshake
} from 'lucide-react';
import { triggerConfetti } from "../../utils/confettiHelper";
import { CAFE_INFO } from '../../data/mockData';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReservation: (reservation: Omit<Reservation, 'id' | 'createdAt' | 'bookingCode' | 'status' | 'waConfirmed'>) => Reservation;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  onConfirmReservation
}) => {
  const [step, setStep] = useState<number>(1);
  const [date, setDate] = useState<string>('2026-08-26');
  const [timeSlot, setTimeSlot] = useState<string>('19:30');
  const [areaPreference, setAreaPreference] = useState<CafeArea>('stage');
  const [guestCount, setGuestCount] = useState<number>(4);
  const [specialOccasion, setSpecialOccasion] = useState<Reservation['specialOccasion']>('casual');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [confirmedBooking, setConfirmedBooking] = useState<Reservation | null>(null);
  const [copiedWA, setCopiedWA] = useState<boolean>(false);

  if (!isOpen) return null;

  const timeSlots = [
    { time: '11:00', label: 'Siang / Lunch' },
    { time: '13:00', label: 'Siang Santai' },
    { time: '16:00', label: 'Sore Coffee Break' },
    { time: '18:30', label: 'Malam / Dinner' },
    { time: '19:30', label: 'Live Music Peak Session', highlight: true },
    { time: '20:30', label: 'Malam Nongkrong' },
    { time: '21:30', label: 'Late Night Coffee' }
  ];

  const areaOptions: { id: CafeArea; label: string; desc: string; icon: string }[] = [
    { id: 'stage', label: 'Semi-Outdoor Stage', desc: 'Paling pas nonton Live Music akhir pekan & kumpul komunitas #PITSTOP', icon: '🎸' },
    { id: 'indoor', label: 'Indoor AC Utama', desc: 'Dingin sejuk, colokan di tiap meja, ideal buat WFH atau makan keluarga', icon: '❄️' },
    { id: 'mezzanine', label: 'Mezzanine Lantai 2', desc: 'Suasana cozy hening, beanbag, view ke seluruh kafe', icon: '🛋️' },
    { id: 'garden', label: 'Garden Smoking Area', desc: 'Terbuka asri, cocok untuk ngobrol santai malam hari', icon: '🌿' }
  ];

  const handleCompleteBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    const result = onConfirmReservation({
      customerName,
      customerPhone,
      customerEmail: customerEmail || undefined,
      guestCount,
      date,
      timeSlot,
      areaPreference,
      specialOccasion,
      notes: notes || undefined
    });

    setConfirmedBooking(result);
    setStep(3); // Success step

    try {
      triggerConfetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }
  };

  const getWhatsAppMessageText = (booking: Reservation) => {
    return `Halo Admin Homie Cozie Coffee & Kitchen! 👋\n\nSaya ingin konfirmasi reservasi meja dengan detail:\n• Kode Booking: *${booking.bookingCode}*\n• Atas Nama: *${booking.customerName}*\n• No HP: ${booking.customerPhone}\n• Tanggal: *${booking.date}*\n• Jam: *${booking.timeSlot} WIB*\n• Area: *${booking.areaPreference.toUpperCase()}*\n• Jumlah Tamu: *${booking.guestCount} Orang*\n• Acara: ${booking.specialOccasion || 'Nongkrong'}\n• Catatan: ${booking.notes || '-'}\n\nTerima kasih! Sampai jumpa di Homie Cozie Jl. H. Hasan No. 23. ☕✨`;
  };

  const handleCopyWhatsApp = (booking: Reservation) => {
    const text = getWhatsAppMessageText(booking);
    navigator.clipboard.writeText(text);
    setCopiedWA(true);
    setTimeout(() => setCopiedWA(false), 2500);
  };

  const handleOpenWhatsAppDirect = (booking: Reservation) => {
    const text = encodeURIComponent(getWhatsAppMessageText(booking));
    const waNumber = CAFE_INFO.whatsapp.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${waNumber}?text=${text}`;
    window.open(url, '_blank');
  };

  const handleResetAndClose = () => {
    setStep(1);
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 bg-black/80 backdrop-blur-md flex justify-center items-start"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#1c1714] border border-[#48392d] rounded-2xl max-w-xl w-full p-6 text-stone-100 shadow-2xl space-y-6 my-4 sm:my-6">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-[#362a21] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-600/30 flex items-center justify-center text-amber-400 font-bold border border-amber-500/40">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-100">
                {step === 3 ? 'Reservasi Berhasil Terkonfirmasi!' : 'Reservasi Meja Online'}
              </h3>
              <p className="text-xs text-stone-400">
                Homie Cozie Coffee & Kitchen • Kalisari & Cijantung
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-1.5 text-stone-400 hover:text-stone-200 rounded-lg hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator (Steps 1 & 2) */}
        {step < 3 && (
          <div className="flex items-center justify-between px-2 text-xs">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-amber-400 font-semibold' : 'text-stone-500'}`}>
              <span className="w-5 h-5 rounded-full bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-[10px]">1</span>
              <span>Waktu & Area</span>
            </div>
            <div className="flex-1 h-[1px] bg-stone-800 mx-3"></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-amber-400 font-semibold' : 'text-stone-500'}`}>
              <span className="w-5 h-5 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-[10px]">2</span>
              <span>Data Kontak & Tamu</span>
            </div>
          </div>
        )}

        {/* STEP 1: Date, Time Slot & Area Selection */}
        {step === 1 && (
          <div className="space-y-4">
            
            {/* Date Picker */}
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                Pilih Tanggal Kunjungan:
              </label>
              <input
                type="date"
                value={date}
                min="2026-08-25"
                max="2026-09-30"
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#14100e] border border-stone-700 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            {/* Time Slot Selector */}
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                Pilih Jam Kedatangan:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => setTimeSlot(slot.time)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      timeSlot === slot.time
                        ? 'bg-amber-600/30 border-amber-500 text-amber-200 font-bold shadow'
                        : 'bg-[#14100e] border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <div className="font-mono text-xs flex items-center justify-between">
                      <span>{slot.time} WIB</span>
                      {slot.highlight && <span className="text-[10px] text-amber-400">🔥 Live</span>}
                    </div>
                    <div className="text-[10px] text-stone-500 truncate mt-0.5">{slot.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Area Preference */}
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                Pilih Area Favorit:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {areaOptions.map((area) => (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => setAreaPreference(area.id)}
                    className={`p-3 rounded-xl text-left border transition-all flex items-start gap-2.5 ${
                      areaPreference === area.id
                        ? 'bg-amber-600/25 border-amber-500 text-stone-100 shadow-md'
                        : 'bg-[#14100e] border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <span className="text-xl">{area.icon}</span>
                    <div className="text-xs">
                      <div className="font-semibold text-amber-200">{area.label}</div>
                      <div className="text-[11px] text-stone-400 leading-snug mt-0.5">{area.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Guest Count Counter */}
            <div className="flex items-center justify-between bg-[#14100e] p-3 rounded-xl border border-stone-800">
              <div>
                <div className="text-xs font-semibold text-stone-200">Jumlah Orang (Guests):</div>
                <div className="text-[11px] text-stone-500">Maks. 25 orang per booking online</div>
              </div>
              <div className="flex items-center gap-3 bg-[#1e1814] px-3 py-1.5 rounded-lg border border-stone-700">
                <button
                  type="button"
                  onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                  className="text-amber-400 font-bold px-2 py-0.5 hover:bg-stone-800 rounded"
                >
                  -
                </button>
                <span className="font-mono text-sm font-bold text-stone-100 w-6 text-center">{guestCount}</span>
                <button
                  type="button"
                  onClick={() => setGuestCount(Math.min(25, guestCount + 1))}
                  className="text-amber-400 font-bold px-2 py-0.5 hover:bg-stone-800 rounded"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-2.5 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-semibold text-xs sm:text-sm transition-colors shadow-sm"
            >
              Lanjut Isi Data Pemesan →
            </button>

          </div>
        )}

        {/* STEP 2: Contact Info & Special Occasions */}
        {step === 2 && (
          <form onSubmit={handleCompleteBooking} className="space-y-4">
            
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">
                Nama Lengkap Pemesan *
              </label>
              <input
                type="text"
                required
                placeholder="Mis. Bima Satria"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#14100e] border border-stone-700 rounded-xl text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Nomor WhatsApp Aktif *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0812-xxxx-xxxx"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#14100e] border border-stone-700 rounded-xl text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Email (Opsional untuk tiket)
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#14100e] border border-stone-700 rounded-xl text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Special Occasion Selection */}
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                Kategori Kunjungan / Acara:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'casual', label: 'Nongkrong Santai' },
                  { id: 'birthday', label: 'Ulang Tahun 🎂' },
                  { id: 'community', label: 'Komunitas #PITSTOP 🏍️' },
                  { id: 'gathering', label: 'Kumpul Teman/Reuni' },
                  { id: 'meeting', label: 'Kerja / WFH / Rapat' },
                  { id: 'anniversary', label: 'Date / Anniversary' }
                ].map((occ) => (
                  <button
                    key={occ.id}
                    type="button"
                    onClick={() => setSpecialOccasion(occ.id as any)}
                    className={`p-2 rounded-lg text-center border transition-colors ${
                      specialOccasion === occ.id
                        ? 'bg-amber-600/30 border-amber-500 text-amber-200 font-medium'
                        : 'bg-[#14100e] border-stone-800 text-stone-400'
                    }`}
                  >
                    {occ.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">
                Catatan Khusus (Request lagu, colokan ekstra, sambutan):
              </label>
              <textarea
                rows={2}
                placeholder="Contoh: 'Tolong dekat colokan untuk 3 laptop', 'Ada kue ultah titip di chiller'"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#14100e] border border-stone-700 rounded-xl text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Booking Summary Box */}
            <div className="bg-[#15110f] p-3 rounded-xl border border-[#30251d] text-xs text-stone-300 space-y-1">
              <div className="flex justify-between">
                <span>Tanggal & Waktu:</span>
                <span className="font-semibold text-amber-300">{date} • {timeSlot} WIB</span>
              </div>
              <div className="flex justify-between">
                <span>Area Meja:</span>
                <span className="font-semibold text-amber-300">{areaPreference.toUpperCase()} ({guestCount} Orang)</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium"
              >
                ← Kembali
              </button>

              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-semibold text-xs sm:text-sm transition-colors shadow-sm"
              >
                Konfirmasi Reservasi
              </button>
            </div>

          </form>
        )}

        {/* STEP 3: Booking Success Ticket & WhatsApp Preview */}
        {step === 3 && confirmedBooking && (
          <div className="space-y-4">
            
            {/* Digital Ticket Card */}
            <div className="bg-gradient-to-br from-[#241c17] to-[#17120e] border-2 border-amber-500/60 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-white border border-amber-500/50 flex items-center justify-center shrink-0">
                    <img
                      src={CAFE_INFO.logo}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-stone-100 text-sm">HOMIE COZIE PASS</h4>
                    <span className="text-[10px] text-amber-400">Coffee & Kitchen Pasar Rebo</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 block">KODE BOOKING</span>
                  <span className="font-mono font-bold text-amber-300 text-sm tracking-wider">
                    {confirmedBooking.bookingCode}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 py-3.5 text-xs">
                <div>
                  <span className="text-stone-500 text-[10px] block">NAMA PEMESAN</span>
                  <span className="font-semibold text-stone-100">{confirmedBooking.customerName}</span>
                </div>
                <div>
                  <span className="text-stone-500 text-[10px] block">JUMLAH TAMU</span>
                  <span className="font-semibold text-amber-300">{confirmedBooking.guestCount} Orang</span>
                </div>
                <div>
                  <span className="text-stone-500 text-[10px] block">TANGGAL & JAM</span>
                  <span className="font-semibold text-stone-100">{confirmedBooking.date} • {confirmedBooking.timeSlot} WIB</span>
                </div>
                <div>
                  <span className="text-stone-500 text-[10px] block">AREA MEJA</span>
                  <span className="font-semibold text-amber-300">{confirmedBooking.areaPreference.toUpperCase()}</span>
                </div>
              </div>

              <div className="bg-[#120e0c] p-2.5 rounded-xl border border-stone-800 text-[11px] text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Meja Anda telah diamankan otomatis di sistem reservasi Homie Cozie!</span>
              </div>
            </div>

            {/* WhatsApp Integration Action Buttons */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Kirim Format Konfirmasi ke WhatsApp Kafe:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenWhatsAppDirect(confirmedBooking)}
                  className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Buka Chat WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyWhatsApp(confirmedBooking)}
                  className="py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-700 font-medium text-xs flex items-center justify-center gap-2"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedWA ? 'Tersalin ke Clipboard!' : 'Salin Format WA'}</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full py-2.5 rounded-xl bg-[#2b221b] hover:bg-[#382d24] text-stone-300 text-xs font-medium border border-stone-700"
            >
              Selesai & Tutup
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
