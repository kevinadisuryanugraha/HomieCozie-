import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Sparkles, 
  MapPin, 
  Music, 
  CheckCircle2, 
  MessageCircle, 
  Copy, 
  Info, 
  Phone, 
  ArrowRight, 
  ArrowLeft, 
  Check,
  Wind,
  Trees,
  Armchair,
  Coffee,
  PartyPopper,
  Briefcase,
  Heart
} from 'lucide-react';
import { triggerConfetti } from "../utils/confettiHelper";
import { Reservation, CafeArea, TableItem } from '../types';
import { CAFE_INFO, INITIAL_TABLES } from '../data/mockData';

interface ReservationPageProps {
  tables: TableItem[];
  onConfirmReservation: (reservation: Omit<Reservation, 'id' | 'createdAt' | 'bookingCode' | 'status' | 'waConfirmed'>) => Reservation;
  onNavigateTo: (mode: any) => void;
}

export const ReservationPage: React.FC<ReservationPageProps> = ({
  tables,
  onConfirmReservation,
  onNavigateTo
}) => {
  const [step, setStep] = useState<number>(1);
  const [date, setDate] = useState<string>('2026-08-26');
  const [timeSlot, setTimeSlot] = useState<string>('19:30');
  const [areaPreference, setAreaPreference] = useState<CafeArea>('stage');
  const [guestCount, setGuestCount] = useState<number>(4);
  const [selectedTableNumber, setSelectedTableNumber] = useState<string>('06');
  const [specialOccasion, setSpecialOccasion] = useState<Reservation['specialOccasion']>('casual');
  
  // Customer Profile State
  const [customerName, setCustomerName] = useState<string>('Bima Satria');
  const [customerPhone, setCustomerPhone] = useState<string>('081298765432');
  const [customerEmail, setCustomerEmail] = useState<string>('bima.satria@gmail.com');
  const [notes, setNotes] = useState<string>('Minta meja dekat colokan untuk 4 orang nonton live music akhir pekan');

  const [confirmedBooking, setConfirmedBooking] = useState<Reservation | null>(null);
  const [copiedWA, setCopiedWA] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const bookingCodeRef = useRef<HTMLSpanElement>(null);

  const timeSlots = [
    { time: '11:00', label: 'Siang / Lunch', badge: 'Tersedia' },
    { time: '13:00', label: 'Siang Santai', badge: 'Tersedia' },
    { time: '16:00', label: 'Sore Coffee Break', badge: 'Populer' },
    { time: '18:30', label: 'Malam / Dinner', badge: 'Ramai' },
    { time: '19:30', label: 'Live Music Peak Session', highlight: true, badge: 'Sangat Diminati 🎸' },
    { time: '20:30', label: 'Malam Nongkrong', badge: 'Tersedia' },
    { time: '21:30', label: 'Late Night Coffee', badge: 'Tersedia' }
  ];

  const areaOptions: { id: CafeArea; label: string; desc: string; icon: React.ComponentType<{ className?: string }>; iconBg: string; iconColor: string; tag: string }[] = [
    { id: 'stage', label: 'Semi-Outdoor Stage', desc: 'Paling pas nonton Live Music akhir pekan & kumpul komunitas #PITSTOP', icon: Music, iconBg: 'bg-amber-500/10', iconColor: 'text-amber-900', tag: 'Live Music View' },
    { id: 'indoor', label: 'Indoor AC Utama', desc: 'Dingin sejuk, colokan di tiap meja, ideal buat WFH atau makan keluarga', icon: Wind, iconBg: 'bg-sky-500/10', iconColor: 'text-sky-800', tag: 'AC & Colokan' },
    { id: 'garden', label: 'Cozy Backyard Garden', desc: 'Area terbuka asri rindang pepohonan, ramah perokok & estetik malam hari', icon: Trees, iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-800', tag: 'Outdoor Asri' },
    { id: 'mezzanine', label: 'Mezzanine VIP Loft', desc: 'Lantai 2 semi-private, sofa empuk untuk meeting atau arisan komunitas', icon: Armchair, iconBg: 'bg-purple-500/10', iconColor: 'text-purple-800', tag: 'Private & Sofa' }
  ];

  const occasionOptions: { id: Reservation['specialOccasion']; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'casual', label: 'Nongkrong Santai', icon: Coffee },
    { id: 'birthday', label: 'Perayaan Ulang Tahun', icon: PartyPopper },
    { id: 'meeting', label: 'Meeting Kerja / WFH', icon: Briefcase },
    { id: 'anniversary', label: 'Date / Anniversary', icon: Heart },
    { id: 'community', label: 'Gathering Komunitas', icon: Users }
  ];

  const areaTables = tables.filter(t => t.area === areaPreference);

  const handleNextToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setValidationError('Tanggal reservasi tidak boleh di masa lalu. Pilih tanggal hari ini atau yang akan datang.');
      return;
    }

    setStep(2);
  };

  const handleNextToStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    if (!selectedTableNumber) {
      setValidationError('Silakan pilih nomor meja terlebih dahulu.');
      return;
    }
    setStep(3);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!customerName.trim() || !customerPhone.trim()) {
      setValidationError('Nama dan Nomor WhatsApp wajib diisi.');
      return;
    }

    const newRes = onConfirmReservation({
      customerName,
      customerPhone,
      customerEmail: customerEmail || undefined,
      guestCount,
      date,
      timeSlot,
      areaPreference,
      tableNumber: selectedTableNumber,
      specialOccasion,
      notes: notes || undefined
    });

    setConfirmedBooking(newRes);
    setStep(4);

    try {
      triggerConfetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  const generateWAMessage = (res: Reservation) => {
    return encodeURIComponent(
      `Halo Homie Cozie Coffee & Kitchen! 👋\n` +
      `Saya ingin konfirmasi reservasi meja dengan detail berikut:\n\n` +
      `📌 *Kode Booking:* ${res.bookingCode}\n` +
      `👤 *Nama Pemesan:* ${res.customerName}\n` +
      `📅 *Tanggal:* ${res.date}\n` +
      `⏰ *Waktu:* ${res.timeSlot} WIB\n` +
      `👥 *Jumlah Tamu:* ${res.guestCount} Orang\n` +
      `📍 *Area & Meja:* ${res.areaPreference.toUpperCase()} (Meja #${res.tableNumber || selectedTableNumber})\n` +
      `🎉 *Occasion:* ${res.specialOccasion}\n` +
      (res.notes ? `📝 *Catatan:* ${res.notes}\n\n` : '\n') +
      `Mohon dibantu konfirmasi ketersediaannya ya. Terima kasih! 🙏`
    );
  };

  const handleCopyBooking = (res: Reservation) => {
    const text = 
      `BOOKING HOMIE COZIE CAFE\n` +
      `Kode: ${res.bookingCode}\n` +
      `Atas Nama: ${res.customerName}\n` +
      `Waktu: ${res.date} @ ${res.timeSlot} WIB\n` +
      `Area: ${res.areaPreference} (${res.guestCount} Pax)\n` +
      `Alamat: ${CAFE_INFO.address}`;
    navigator.clipboard.writeText(text);
    setCopiedWA(true);
    setTimeout(() => setCopiedWA(false), 2500);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#FAF7F2] text-[#1F1A16] py-6 sm:py-10 px-3 sm:px-6 lg:px-8 pb-28 sm:pb-12 relative">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Header Banner Card */}
        <div className="bg-white border border-[#EAE2D8] rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="text-xs font-mono font-medium text-[#5C5248]">
                Reservasi Meja Restoran
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-black text-[#1F1A16]">
                Booking Meja Homie Cozie
              </h1>
              <p className="text-xs sm:text-sm text-[#5C5248] max-w-xl leading-relaxed">
                Pilih area dan waktu kunjungan Anda untuk menikmati kopi, hidangan dapur, dan live music tanpa antre.
              </p>
            </div>

            {/* Quick Summary Strip */}
            <div className="flex items-center gap-6 text-xs text-[#5C5248] border-t md:border-t-0 md:border-l border-[#EAE2D8] pt-3 md:pt-0 md:pl-6">
              <div>
                <span className="block text-[11px] text-[#5C5248]">Total Meja</span>
                <span className="text-base font-bold text-[#1F1A16] font-mono">{tables.length} Meja</span>
              </div>
              <div>
                <span className="block text-[11px] text-[#5C5248]">Biaya Booking</span>
                <span className="text-base font-bold text-emerald-900">Gratis (Rp 0)</span>
              </div>
              <div>
                <span className="block text-[11px] text-[#5C5248]">Live Music</span>
                <span className="text-base font-bold text-amber-800">Weekend 19:30</span>
              </div>
            </div>
          </div>

          {/* Step Progress Tracker */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6 pt-6 border-t border-[#EAE2D8]">
            {[
              { num: 1, title: '1. Sesi & Area', desc: 'Tanggal, Jam & Pax' },
              { num: 2, title: '2. Pilih Meja', desc: 'Denah Kursi' },
              { num: 3, title: '3. Data Kontak', desc: 'Nama & WhatsApp' },
              { num: 4, title: '4. Konfirmasi', desc: 'Tiket Booking' }
            ].map((s) => {
              const isCompleted = step > s.num;
              const isCurrent = step === s.num;
              return (
                <div 
                  key={s.num}
                  className={`p-3 rounded-xl border text-left transition-colors ${
                    isCurrent 
                      ? 'bg-[#C84B27] border-[#C84B27] text-white shadow-xs' 
                      : isCompleted
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-[#FAF7F2] border-[#EAE2D8] text-stone-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-900" /> : <span>{s.num}.</span>}
                    <span>{s.title}</span>
                  </div>
                  <span className={`text-[11px] block mt-0.5 ${isCurrent ? 'text-white/90' : 'text-[#5C5248]'}`}>
                    {s.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Main Form Container (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-[#EAE2D8] rounded-3xl p-6 sm:p-8 shadow-xs space-y-8">
            
            {/* Validation Error Alert */}
            <AnimatePresence>
              {validationError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 font-bold"
                >
                  <Info className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{validationError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* STEP 1: DATE, TIME, GUESTS & AREA */}
            {step === 1 && (
              <form onSubmit={handleNextToStep2} className="space-y-6">
                <div className="pb-4 border-b border-[#EAE2D8]">
                  <h2 className="text-lg font-display font-black text-[#1F1A16] flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-900" />
                    <span>Langkah 1: Tentukan Jadwal Kunjungan & Area</span>
                  </h2>
                  <p className="text-xs text-[#5C5248] mt-0.5">
                    Pilih tanggal, jam kedatangan, dan area cafe yang diinginkan.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Date Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1F1A16] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-900" /> Tanggal Kunjungan
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#EAE2D8] rounded-2xl px-4 py-3 text-xs font-medium text-[#1F1A16] focus:outline-none focus:border-[#C84B27] font-mono transition-colors"
                    />
                  </div>

                  {/* Guest Count Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1F1A16] flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-900" /> Jumlah Tamu (Pax)
                    </label>
                    <div className="flex items-center gap-3 bg-[#FAF7F2] border border-[#EAE2D8] rounded-2xl px-4 py-2">
                      <button
                        type="button"
                        onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                        className="text-[#B23812] font-bold px-2 py-1 hover:bg-stone-200 rounded-lg"
                      >
                        -
                      </button>
                      <span className="font-mono text-sm font-bold text-[#1F1A16] flex-1 text-center">{guestCount} Orang</span>
                      <button
                        type="button"
                        onClick={() => setGuestCount(Math.min(30, guestCount + 1))}
                        className="text-[#B23812] font-bold px-2 py-1 hover:bg-stone-200 rounded-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Time Slots Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#1F1A16] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-900" /> Jam Kedatangan (Slot Waktu)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                    {timeSlots.map((ts) => {
                      const isSelected = timeSlot === ts.time;
                      return (
                        <button
                          key={ts.time}
                          type="button"
                          onClick={() => setTimeSlot(ts.time)}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'bg-[#C84B27] border-[#C84B27] text-white shadow-xs scale-[1.02]'
                              : 'bg-[#FAF7F2] border-[#EAE2D8] text-[#5C5248] hover:border-[#D5C9BC]'
                          }`}
                        >
                          <div className="font-mono font-bold text-sm">{ts.time} WIB</div>
                          <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/90' : 'text-[#5C5248]'}`}>
                            {ts.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Area Preference Cards */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#1F1A16] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-900" /> Preferensi Zona Suasana
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {areaOptions.map((area) => {
                      const isSelected = areaPreference === area.id;
                      const IconComp = area.icon;
                      return (
                        <button
                          key={area.id}
                          type="button"
                          onClick={() => {
                            setAreaPreference(area.id);
                            const matchingTables = tables.filter(t => t.area === area.id);
                            if (matchingTables.length > 0) {
                              setSelectedTableNumber(matchingTables[0].tableNumber);
                            }
                          }}
                              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 cursor-pointer ${
                                isSelected
                                  ? 'bg-white border-[#C84B27] ring-2 ring-[#C84B27]/20 text-[#1F1A16] shadow-sm'
                                  : 'bg-[#FAF7F2] border-[#EAE2D8] text-[#5C5248] hover:border-[#D5C9BC]'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className={`w-9 h-9 rounded-xl ${area.iconBg} ${area.iconColor} flex items-center justify-center`}>
                                  <IconComp className="w-4.5 h-4.5" />
                                </div>
                                <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                                  {area.tag}
                                </span>
                              </div>
                              <div>
                                <div className="font-display font-black text-sm text-[#1F1A16]">{area.label}</div>
                                <p className="text-[11px] text-[#5C5248] mt-0.5 leading-tight">{area.desc}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Occasion Radio */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#1F1A16]">Tujuan / Acara Kunjungan:</label>
                      <div className="flex flex-wrap gap-2">
                        {occasionOptions.map((occ) => {
                          const isSelected = specialOccasion === occ.id;
                          const OccIcon = occ.icon;
                          return (
                            <button
                              key={occ.id}
                              type="button"
                              onClick={() => setSpecialOccasion(occ.id as any)}
                              className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                                isSelected
                                  ? 'bg-[#C84B27] border-[#C84B27] text-white shadow-xs'
                                  : 'bg-[#FAF7F2] border-[#EAE2D8] text-[#5C5248] hover:bg-stone-200/60'
                              }`}
                            >
                              <OccIcon className="w-3.5 h-3.5" />
                              <span>{occ.label}</span>
                            </button>
                          );
                        })}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EAE2D8] flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-xs"
                  >
                    <span>Lanjut: Pilih Meja</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: INTERACTIVE FLOORPLAN */}
            {step === 2 && (
              <form onSubmit={handleNextToStep3} className="space-y-6">
                <div className="pb-4 border-b border-[#EAE2D8] flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-display font-black text-[#1F1A16] flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-amber-900" />
                      <span>Langkah 2: Pilih Meja di Area {areaPreference.toUpperCase()}</span>
                    </h2>
                    <p className="text-xs text-[#5C5248] mt-0.5">
                      Pilih nomor meja yang diinginkan berdasarkan kapasitas kursi.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-[#B23812] hover:underline flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Ubah Sesi</span>
                  </button>
                </div>

                {/* Table Grid Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {areaTables.map((t) => {
                    const isSelected = selectedTableNumber === t.tableNumber;
                    const isAvailable = t.status === 'available';

                    return (
                      <button
                        key={t.id}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => setSelectedTableNumber(t.tableNumber)}
                        className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between space-y-2 ${
                          isSelected
                            ? 'bg-[#C84B27] border-[#C84B27] text-white shadow-md scale-[1.03]'
                            : isAvailable
                            ? 'bg-[#FAF7F2] border-[#EAE2D8] text-[#1F1A16] hover:border-[#D5C9BC]'
                            : 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed'
                        }`}
                      >
                        <div className="font-mono font-black text-lg">
                          Meja {t.tableNumber}
                        </div>
                        <div className="text-[11px] flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{t.capacity} Kursi</span>
                        </div>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-white text-[#B23812]'
                            : isAvailable
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-stone-200 text-stone-500'
                        }`}>
                          {isSelected ? 'Dipilih ✓' : isAvailable ? 'Tersedia' : 'Terisi'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-[#EAE2D8] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-3 rounded-xl bg-stone-100 text-[#1F1A16] text-xs font-bold border border-[#EAE2D8] hover:bg-stone-200"
                  >
                    Kembali
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-xs"
                  >
                    <span>Lanjut: Data Kontak</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: CUSTOMER CONTACT & NOTES */}
            {step === 3 && (
              <form onSubmit={handleFinalSubmit} className="space-y-6">
                <div className="pb-4 border-b border-[#EAE2D8] flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-display font-black text-[#1F1A16] flex items-center gap-2">
                      <Phone className="w-5 h-5 text-amber-900" />
                      <span>Langkah 3: Informasi Kontak & Catatan Khusus</span>
                    </h2>
                    <p className="text-xs text-[#5C5248] mt-0.5">
                      Nomor WhatsApp digunakan untuk konfirmasi otomatis dan pengingat jadwal.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs font-bold text-[#B23812] hover:underline flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Ubah Meja</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1F1A16]">Nama Lengkap Pemesan *</label>
                    <input
                      type="text"
                      required
                      placeholder="Misal: Bima Satria"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#EAE2D8] rounded-2xl px-4 py-3 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C84B27]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1F1A16]">Nomor WhatsApp Aktif *</label>
                    <input
                      type="tel"
                      required
                      placeholder="081298765432"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#EAE2D8] rounded-2xl px-4 py-3 text-xs font-mono text-[#1F1A16] focus:outline-none focus:border-[#C84B27]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1F1A16]">Alamat Email (Opsional)</label>
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EAE2D8] rounded-2xl px-4 py-3 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C84B27]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1F1A16]">Catatan Tambahan untuk Staff Cafe:</label>
                  <textarea
                    rows={3}
                    placeholder="Contoh: Meja dekat panggung musik, butuh colokan charger, setup kue ulang tahun..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EAE2D8] rounded-2xl p-4 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C84B27]"
                  ></textarea>
                </div>

                <div className="pt-4 border-t border-[#EAE2D8] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-3 rounded-xl bg-stone-100 text-[#1F1A16] text-xs font-bold border border-[#EAE2D8] hover:bg-stone-200"
                  >
                    Kembali
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Konfirmasi Booking Meja (Gratis)</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: SUCCESS CONFIRMATION TICKET */}
            {step === 4 && confirmedBooking && (
              <div className="space-y-6 text-center py-2">
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center justify-center mx-auto shadow-xs">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-widest">
                    RESERVASI TERKONFIRMASI
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1F1A16]">
                    Meja Berhasil Dipesan!
                  </h2>
                  <p className="text-xs text-[#5C5248] max-w-md mx-auto leading-relaxed">
                    Terima kasih, {confirmedBooking.customerName}! Meja Anda di Homie Cozie siap menyambut kedatangan Anda.
                  </p>
                </div>

                {/* Digital Ticket Slip */}
                <div className="bg-[#FAF7F2] border border-[#EAE2D8] rounded-3xl p-6 text-left max-w-lg mx-auto shadow-sm relative space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EAE2D8] pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-[#5C5248]">KODE BOOKING</span>
                      <div className="font-mono font-black text-xl text-[#B23812]" ref={bookingCodeRef}>
                        {confirmedBooking.bookingCode}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                      Confirmed ✓
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-[#5C5248] block">TANGGAL & WAKTU</span>
                      <span className="font-bold text-[#1F1A16] font-mono">{confirmedBooking.date} @ {confirmedBooking.timeSlot} WIB</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#5C5248] block">JUMLAH TAMU</span>
                      <span className="font-bold text-[#1F1A16]">{confirmedBooking.guestCount} Orang</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#5C5248] block">AREA & MEJA</span>
                      <span className="font-bold text-amber-800 uppercase">{confirmedBooking.areaPreference} (Meja #{confirmedBooking.tableNumber})</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#5C5248] block">OCCASION</span>
                      <span className="font-bold text-[#5C5248] capitalize">{confirmedBooking.specialOccasion}</span>
                    </div>
                  </div>

                  {confirmedBooking.notes && (
                    <div className="pt-2 border-t border-[#EAE2D8] text-xs">
                      <span className="text-[10px] text-[#5C5248] block">CATATAN KHUSUS</span>
                      <span className="text-[#5C5248] italic">"{confirmedBooking.notes}"</span>
                    </div>
                  )}
                </div>

                {/* Action CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <motion.a
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    href={`https://wa.me/6281288997722?text=${generateWAMessage(confirmedBooking)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5B] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Konfirmasi ke WhatsApp Cafe</span>
                  </motion.a>

                  <button
                    onClick={() => handleCopyBooking(confirmedBooking)}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-[#1F1A16] font-bold text-xs border border-[#EAE2D8] flex items-center justify-center gap-2 shadow-xs"
                  >
                    {copiedWA ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedWA ? 'Tersalin ke Clipboard!' : 'Salin Detail Tiket'}</span>
                  </button>

                  <button
                    onClick={() => onNavigateTo('customer')}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#5C5248] text-xs font-bold"
                  >
                    Kembali ke Beranda
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Summary Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="bg-white border border-[#EAE2D8] rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="font-display font-black text-base text-[#1F1A16] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-900" />
                <span>Ringkasan Reservasi</span>
              </h3>

              <div className="space-y-3 text-xs border-y border-[#EAE2D8] py-3">
                <div className="flex justify-between">
                  <span className="text-[#5C5248]">Tanggal:</span>
                  <span className="font-mono font-bold text-[#1F1A16]">{date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5248]">Jam:</span>
                  <span className="font-mono font-bold text-amber-800">{timeSlot} WIB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5248]">Jumlah Tamu:</span>
                  <span className="font-bold text-[#1F1A16]">{guestCount} Orang</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5248]">Area:</span>
                  <span className="font-bold text-[#1F1A16] capitalize">{areaPreference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5248]">Nomor Meja:</span>
                  <span className="font-mono font-bold text-amber-800">Meja #{selectedTableNumber}</span>
                </div>
              </div>

              <div className="space-y-2 text-[11px] text-[#5C5248]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Meja disimpan selama 20 menit dari jam booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Tanpa biaya pembatalan & minimum order</span>
                </div>
              </div>
            </div>

            {/* Live Acoustic Info Card */}
            <div className="bg-white border border-[#EAE2D8] rounded-3xl p-5 text-xs text-[#5C5248] space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-amber-800 font-bold">
                <Music className="w-4 h-4 text-[#B23812]" />
                <span>Live Music Akhir Pekan</span>
              </div>
              <p className="text-[11px] text-[#5C5248] leading-relaxed">
                Jumat & Sabtu mulai pukul 19:30 WIB. Pilih area <strong>Semi-Outdoor Stage</strong> untuk pemandangan panggung terbaik.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
