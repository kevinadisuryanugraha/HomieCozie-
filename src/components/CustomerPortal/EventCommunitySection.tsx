import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Music, 
  Calendar, 
  Clock, 
  Ticket, 
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EVENTS_DATA } from '../../data/mockData';
import { CommunityEvent } from '../../types';

interface EventCommunitySectionProps {
  onRSVPEvent?: (event: CommunityEvent) => void;
  onOpenReservation?: () => void;
}

export const EventCommunitySection: React.FC<EventCommunitySectionProps> = ({ onRSVPEvent, onOpenReservation }) => {
  const [events, setEvents] = useState<CommunityEvent[]>(EVENTS_DATA);
  const [rsvpSuccessId, setRsvpSuccessId] = useState<string | null>(null);

  const handleRSVP = (event: CommunityEvent) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === event.id ? { ...e, seatsBooked: Math.min(e.seatsTotal, e.seatsBooked + 1) } : e
      )
    );
    setRsvpSuccessId(event.id);
    if (onRSVPEvent) {
      onRSVPEvent(event);
    }
    try {
      confetti({ 
        particleCount: 50, 
        spread: 65,
        origin: { y: 0.7 }
      });
    } catch {}
    setTimeout(() => {
      setRsvpSuccessId(null);
    }, 4000);
  };

  return (
    <section id="events-section" className="py-16 bg-[#FAF7F2] text-[#1F1A16] border-b border-[#EAE2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-900 border border-purple-200 mb-1">
              <Music className="w-3.5 h-3.5 text-purple-600" />
              <span>Weekend Live Stage & Community #PITSTOP</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-[#1F1A16]">
              Jadwal Panggung & Event Akustik
            </h2>
            <p className="text-[#5C5248] text-xs sm:text-sm font-normal leading-relaxed">
              Panggung live acoustic sing-along dan ruang kumpul komunitas di kawasan Kalisari setiap akhir pekan.
            </p>
          </div>

          <div className="bg-white px-4 py-2 rounded-xl border border-[#EAE2D8] text-xs font-semibold text-amber-800 self-start md:self-auto flex items-center gap-2 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Music: Tiap Jumat & Sabtu 19:30 WIB</span>
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => {
            const seatsRemaining = event.seatsTotal - event.seatsBooked;
            const isFull = seatsRemaining <= 0;

            return (
              <motion.div
                key={event.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl overflow-hidden border border-[#EAE2D8] hover:border-[#D5C9BC] transition-all flex flex-col justify-between group shadow-xs hover:shadow-lg"
              >
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden bg-stone-100">
                  <img
                    src={event.image}
                    alt={event.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#C84B27] text-white shadow-xs">
                      {event.tag}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#8C7E72] mb-1">
                      <span className="font-mono font-semibold text-amber-700 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{event.date}</span>
                      </span>
                      <span className="font-mono text-[#8C7E72] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{event.time}</span>
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-base text-[#1F1A16] mt-1 group-hover:text-[#C84B27] transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-xs text-[#5C5248] line-clamp-2 mt-1 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* Seat Availability & Action */}
                  <div className="space-y-3 pt-3 border-t border-[#EAE2D8]">
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[#8C7E72]">
                        <span className="text-[11px]">Kapasitas Meja</span>
                        <span className="font-mono font-bold text-[#1F1A16]">
                          {isFull ? 'Penuh' : `Sisa ${seatsRemaining} Kursi`}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden border border-[#EAE2D8]">
                        <div
                          className={`h-full rounded-full transition-all ${
                            seatsRemaining <= 5 ? 'bg-[#C84B27]' : 'bg-emerald-600'
                          }`}
                          style={{ width: `${(event.seatsBooked / event.seatsTotal) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {rsvpSuccessId === event.id ? (
                      <div className="bg-emerald-50 border border-emerald-300 p-2.5 rounded-xl text-xs font-semibold text-emerald-800 flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>RSVP Berhasil Disimpan!</span>
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleRSVP(event)}
                        disabled={isFull}
                        className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                          isFull
                            ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                            : 'bg-[#C84B27] hover:bg-[#B23E1C] text-white shadow-xs'
                        }`}
                      >
                        <Ticket className="w-3.5 h-3.5 text-white" />
                        <span>{isFull ? 'Kursi Penuh' : 'Amankan Kursi (RSVP)'}</span>
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
