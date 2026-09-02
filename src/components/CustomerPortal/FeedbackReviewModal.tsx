import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Star, 
  Send, 
  ShieldCheck, 
  MessageSquare, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2,
  Heart,
  Copy,
  Check,
  AlertCircle,
  Coffee,
  Gift,
  Smile,
  Frown,
  Meh
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CAFE_INFO } from '../../data/mockData';
import { ReviewItem } from '../../types';
import { soundService } from '../../utils/audioChime';

interface FeedbackReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview?: (review: Omit<ReviewItem, 'id' | 'date' | 'verifiedVisit'>) => void;
}

const REVIEW_TEMPLATES = [
  {
    title: '💻 Cocok buat WFC & Kopi Creamy',
    text: 'Tempatnya super cozy buat WFC, kopi susu arennya creamy mantap, colokan banyak dan baristanya ramah banget! Rekomendasi banget di Kalisari ☕✨'
  },
  {
    title: '🍽️ Makanan Enak & Suasana Asik',
    text: 'Makanan dan pastry-nya enak semua, porsinya pas. Area semi-outdoor dan panggung live music-nya seru banget buat nongkrong bareng teman! 🔥'
  },
  {
    title: '🌿 Hidden Gem Suasana Homey',
    text: 'Beneran berasa kayak di rumah sendiri. Bersih, Wi-Fi kencang, banyak spot foto estetik. Pasti bakal sering balik ke Homie Cozie! ❤️'
  }
];

export const FeedbackReviewModal: React.FC<FeedbackReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmitReview
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [author, setAuthor] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [feedbackNotes, setFeedbackNotes] = useState<string>('');
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [copiedTemplateIdx, setCopiedTemplateIdx] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentActiveRating = hoverRating || rating;

  const getRatingCaption = (r: number) => {
    switch (r) {
      case 5:
        return { label: '🤩 Luar Biasa & Sangat Puas!', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' };
      case 4:
        return { label: '😊 Puas & Menyenangkan', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' };
      case 3:
        return { label: '😐 Cukup / Biasa Saja', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' };
      case 2:
        return { label: '😕 Kurang Memuaskan', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' };
      case 1:
        return { label: '😞 Sangat Kecewa', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' };
      default:
        return { label: 'Pilih Bintang Pengalaman Anda', color: 'text-[#8C7E72]', bg: 'bg-stone-50 border-stone-200' };
    }
  };

  const caption = getRatingCaption(currentActiveRating);

  const handleCopyTemplate = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplateIdx(idx);
    soundService.playCashRegisterSound();
    setTimeout(() => setCopiedTemplateIdx(null), 2500);
  };

  const handleOpenGoogleMaps = () => {
    soundService.playCashRegisterSound();
    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    } catch {}

    // Google Maps write review URL
    const gmapsReviewUrl = 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4';
    window.open(gmapsReviewUrl, '_blank');

    if (onSubmitReview && author) {
      onSubmitReview({
        author: author || 'Tamu Homie Cozie',
        rating,
        source: 'google',
        content: feedbackNotes || REVIEW_TEMPLATES[0].text,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        tag: 'Google Verified'
      });
    }

    setIsSubmitted(true);
  };

  const handleInterceptedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundService.playNewOrderChime();
    setIsSubmitted(true);

    if (onSubmitReview) {
      onSubmitReview({
        author: author || 'Tamu (Feedback Intercepted)',
        rating,
        source: 'internal',
        content: `[MASALAH: ${selectedIssues.join(', ')}] ${feedbackNotes}`,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        tag: 'Internal Resolution'
      });
    }
  };

  const toggleIssue = (issue: string) => {
    setSelectedIssues(prev => 
      prev.includes(issue) ? prev.filter(i => i !== issue) : [...prev, issue]
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl border border-[#EAE2D8] w-full max-w-lg overflow-hidden flex flex-col my-auto max-h-[92vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#EAE2D8] bg-[#FAF7F2] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200 text-[#C84B27] flex items-center justify-center shadow-xs">
                <Star className="w-5 h-5 fill-[#C84B27]" />
              </div>
              <div>
                <h3 className="font-display font-black text-base sm:text-lg text-[#1F1A16]">
                  Bagikan Pengalaman Kunjungan Anda
                </h3>
                <p className="text-xs text-[#8C7E72]">
                  Ulasan Anda membantu {CAFE_INFO.name} menjaga kualitas terbaik
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-stone-200 text-[#5C5248] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
            {isSubmitted ? (
              /* Success Submitted State */
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md border border-emerald-200">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <h4 className="font-display font-black text-xl text-[#1F1A16]">
                    {rating >= 4 ? 'Terima Kasih Banyak! ⭐' : 'Pesan Anda Telah Diteruskan 🙏'}
                  </h4>
                  <p className="text-xs text-[#5C5248] mt-1 max-w-sm mx-auto leading-relaxed">
                    {rating >= 4
                      ? 'Ulasan Anda sangat berarti bagi seluruh tim barista dan kitchen Homie Cozie. Nikmati voucher diskon 15% Anda!'
                      : 'Kami memohon maaf yang sebesar-besarnya. Tim Store Manager kami akan segera menindaklanjuti masukan Anda.'}
                  </p>
                </div>

                {rating >= 4 && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 max-w-xs mx-auto text-center space-y-1">
                    <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">
                      KODE VOUCHER ANDA
                    </span>
                    <span className="font-mono font-black text-xl text-[#C84B27] tracking-widest block">
                      HOMIE5STAR
                    </span>
                    <span className="text-[11px] text-[#5C5248] block">
                      Diskon 15% untuk kunjungan berikutnya
                    </span>
                  </div>
                )}

                <button
                  onClick={onClose}
                  className="px-8 py-2.5 rounded-2xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            ) : (
              /* Rating Experience Form */
              <>
                {/* Large Interactive Star Rater */}
                <div className="text-center space-y-2 py-1">
                  <span className="text-xs font-bold text-[#5C5248] block">
                    Bagaimana kepuasan Anda berkunjung di Homie Cozie hari ini?
                  </span>

                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => {
                          setRating(starVal);
                          if (starVal >= 4) {
                            try { confetti({ particleCount: 60, spread: 60 }); } catch {}
                          }
                        }}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-stone-300 hover:scale-115 transition-all cursor-pointer focus:outline-hidden"
                      >
                        <Star
                          className={`w-9 h-9 sm:w-10 sm:h-10 transition-colors ${
                            starVal <= currentActiveRating
                              ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                              : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border transition-all ${caption.bg} ${caption.color}`}>
                    {caption.label}
                  </div>
                </div>

                {/* Branch A: 4 or 5 Stars (5-Star Google Booster Flow) */}
                {rating >= 4 ? (
                  <div className="space-y-4 pt-2 border-t border-[#EAE2D8]">
                    {/* Voucher Reward Announcement */}
                    <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#C84B27] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Gift className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#1F1A16] block">
                          Bantu Kami di Google Maps & Dapatkan Diskon 15%!
                        </span>
                        <span className="text-[11px] text-[#8C7E72]">
                          Pilih salah satu template ulasan di bawah ini untuk disalin ke Google Maps:
                        </span>
                      </div>
                    </div>

                    {/* Pre-written 1-Click Review Templates */}
                    <div className="space-y-2">
                      {REVIEW_TEMPLATES.map((tpl, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8] hover:border-[#C84B27] transition-all space-y-1.5 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#1F1A16]">{tpl.title}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyTemplate(tpl.text, idx)}
                              className="flex items-center gap-1 text-[11px] font-bold text-[#C84B27] hover:underline cursor-pointer"
                            >
                              {copiedTemplateIdx === idx ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-700">Tersalin!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Salin Ulasan</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-[11px] text-[#5C5248] leading-relaxed italic">
                            "{tpl.text}"
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Main CTA: Open Google Maps */}
                    <button
                      type="button"
                      onClick={handleOpenGoogleMaps}
                      className="w-full py-3.5 rounded-2xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-display font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      <Star className="w-4 h-4 fill-white" />
                      <span>Buka Google Maps & Tulis Ulasan Bintang 5</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  /* Branch B: 1 to 3 Stars (Feedback Interceptor Flow) */
                  <form onSubmit={handleInterceptedSubmit} className="space-y-4 pt-2 border-t border-[#EAE2D8]">
                    <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-950">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Kami memohon maaf atas ketidaknyamanan Anda 🙏</span>
                        <span className="text-[11px] text-rose-800 leading-relaxed">
                          Beri tahu kami apa yang bisa kami perbaiki agar Store Manager kami dapat segera membenahi dan memberikan kompensasi minuman gratis untuk Anda.
                        </span>
                      </div>
                    </div>

                    {/* Issue Checkboxes */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-[#1F1A16] block">
                        Bagian mana yang perlu kami tingkatkan?
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {[
                          'Rasa Kopi / Minuman',
                          'Rasa & Porsi Makanan',
                          'Kecepatan Penyajian (KDS)',
                          'Kebersihan Meja / Toilet',
                          'Sikap & Keramahan Staf',
                          'Koneksi Wi-Fi / Fasilitas'
                        ].map((issue) => {
                          const isSelected = selectedIssues.includes(issue);
                          return (
                            <button
                              type="button"
                              key={issue}
                              onClick={() => toggleIssue(issue)}
                              className={`p-2.5 rounded-xl border text-left font-semibold transition-all cursor-pointer text-[11px] ${
                                isSelected
                                  ? 'bg-rose-100 border-rose-400 text-rose-950 font-bold'
                                  : 'bg-[#FAF7F2] border-[#EAE2D8] text-[#5C5248] hover:bg-stone-100'
                              }`}
                            >
                              {isSelected ? '✓ ' : '+ '} {issue}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Detail Notes */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-[#5C5248] block">
                        Ceritakan pengalaman Anda lebih detail:
                      </span>
                      <textarea
                        required
                        value={feedbackNotes}
                        onChange={(e) => setFeedbackNotes(e.target.value)}
                        placeholder="Contoh: Kopi susunya agak kemanisan, atau pesanan makanannya datang cukup lama..."
                        className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] text-xs font-medium text-[#1F1A16] focus:outline-hidden focus:border-[#C84B27]"
                        rows={3}
                      />
                    </div>

                    {/* WhatsApp Input for Recovery */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-[#5C5248] block">
                        No. WhatsApp Anda (Untuk voucher kompensasi Store Manager):
                      </span>
                      <input
                        type="tel"
                        placeholder="Contoh: 0812-3456-7890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] text-xs font-mono font-bold text-[#1F1A16] focus:outline-hidden focus:border-[#C84B27]"
                      />
                    </div>

                    {/* Submit Recovery Form (Intercepted) */}
                    <button
                      type="submit"
                      className="w-full py-3 rounded-2xl bg-stone-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Masukan Privat ke Store Manager</span>
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
