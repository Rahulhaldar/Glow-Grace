import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, MessageCircle } from 'lucide-react';
import { MockDB } from '../data';
import { Service, Appointment, WebsiteSettings } from '../types';

interface FastBookingSectionProps {
  selectedServiceId?: string | null;
  onSelectService?: (serviceId: string) => void;
  settings: WebsiteSettings;
  navigate: (path: string) => void;
}

export const FastBookingSection: React.FC<FastBookingSectionProps> = ({
  selectedServiceId,
  onSelectService,
  settings,
  navigate,
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [serviceId, setServiceId] = useState<string>(selectedServiceId || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [completedBooking, setCompletedBooking] = useState<Appointment | null>(null);

  useEffect(() => {
    const list = MockDB.getServices().filter((s) => s.status === 'Active');
    setServices(list);
    if (!serviceId && list.length > 0) {
      setServiceId(list[0].id);
    }
  }, []);

  useEffect(() => {
    if (selectedServiceId) {
      setServiceId(selectedServiceId);
      // Auto-advance to Step 2 if service was preselected from pricing menu
      setStep(2);
    }
  }, [selectedServiceId]);

  const activeService = services.find((s) => s.id === serviceId);

  // Quick Date options
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);

  const formatDateStr = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const quickDates = [
    { label: 'Today', dateStr: formatDateStr(today) },
    { label: 'Tomorrow', dateStr: formatDateStr(tomorrow) },
    { label: dayAfter.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), dateStr: formatDateStr(dayAfter) },
  ];

  const timeSlots = [
    '10:30 AM', '11:45 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM', '07:00 PM'
  ];

  const categories = ['All', 'Makeup', 'Hair', 'Facial', 'Nails', 'Grooming', 'Bridal'];

  const filteredServices = services.filter((s) => {
    if (selectedCategory === 'All') return true;
    return s.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  const handleServiceSelect = (id: string) => {
    setServiceId(id);
    if (onSelectService) onSelectService(id);
  };

  const handleConfirm = () => {
    if (!name.trim() || !phone.trim() || !date || !time || !serviceId) return;

    setIsSubmitting(true);
    const activeService = services.find((s) => s.id === serviceId);

    setTimeout(() => {
      const created = MockDB.saveAppointment({
        customerName: name.trim(),
        phone: phone.trim(),
        email: `${name.toLowerCase().replace(/\s+/g, '')}@customer.local`,
        serviceId,
        serviceName: activeService?.name || 'Selected Beauty Service',
        artistId: 'any',
        artistName: 'Any Certified Artist',
        date,
        time,
        specialRequest: notes.trim(),
      });

      setCompletedBooking(created);
      setIsSubmitting(false);
      setStep(4);
    }, 400);
  };

  return (
    <section id="fast-booking-section" className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="bg-white border border-[#F5DDE1] rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#FFF0F2] rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 opacity-60" />

        {/* Section Header */}
        <div className="text-center max-w-lg mx-auto space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF0F2] rounded-full text-[10px] font-sans font-extrabold tracking-widest text-[#B85C72] uppercase border border-[#F5DDE1]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            EASY 4-STEP RESERVATION
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#3B0F19]">
            Book Your Appointment
          </h2>
          <p className="text-xs sm:text-sm text-[#3B0F19]/70 font-sans">
            Reserve your parlour slot in less than 30 seconds. No advance fee required.
          </p>
        </div>

        {/* Step Indicators Bar */}
        {!completedBooking && (
          <div className="flex items-center justify-between max-w-md mx-auto mb-8 border-b border-[#F5DDE1]/60 pb-4">
            {[
              { num: 1, label: 'Service' },
              { num: 2, label: 'Date & Time' },
              { num: 3, label: 'Details' },
              { num: 4, label: 'Confirm' },
            ].map((s) => (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  if (s.num <= step) setStep(s.num as any);
                }}
                className={`flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                  step === s.num
                    ? 'text-[#B85C72]'
                    : step > s.num
                    ? 'text-[#059669]'
                    : 'text-stone-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    step === s.num
                      ? 'bg-[#B85C72] text-white'
                      : step > s.num
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className="hidden sm:inline font-sans">{s.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: SELECT SERVICE */}
        {/* ========================================================================= */}
        {step === 1 && !completedBooking && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-serif font-bold text-[#3B0F19]">
                Step 1: Choose Your Desired Service
              </h3>
              <button
                onClick={() => navigate('services')}
                className="text-xs font-bold text-[#B85C72] hover:underline font-sans cursor-pointer"
              >
                Browse All Catalogue &rarr;
              </button>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#3B0F19] text-white shadow-xs'
                      : 'bg-[#FFF0F2] text-stone-700 border border-[#F5DDE1] hover:border-[#B85C72]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Services Grid (Compact) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
              {filteredServices.map((s) => {
                const isSelected = serviceId === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => handleServiceSelect(s.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-[#B85C72] bg-[#FFF0F2]/70 shadow-xs'
                        : 'border-stone-200 hover:border-[#B85C72]/50 bg-white'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif text-xs font-bold text-[#3B0F19]">
                          {s.name}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] bg-[#B85C72] text-white px-1.5 py-0.2 rounded-full font-bold">
                            Selected
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-500 font-sans block">
                        ⏱️ {s.durationMinutes || 45} mins &bull; {s.category}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-serif text-sm font-extrabold text-[#B85C72] block">
                        ₹{s.price}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end pt-3 border-t border-[#F5DDE1]/60">
              <button
                disabled={!serviceId}
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-[#B85C72] hover:bg-[#802339] disabled:opacity-50 text-white rounded-full text-xs font-bold tracking-wider transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Date & Time</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: SELECT DATE & TIME */}
        {/* ========================================================================= */}
        {step === 2 && !completedBooking && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-serif font-bold text-[#3B0F19]">
                  Step 2: Choose Slot for {activeService?.name || 'Your Service'}
                </h3>
                <span className="text-xs text-[#B85C72] font-semibold font-sans">
                  Starting at ₹{activeService?.price || '999'}
                </span>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-xs text-stone-500 hover:text-[#3B0F19] flex items-center gap-1 font-bold cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                Change Service
              </button>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 font-sans block">
                1. Select Preferred Date:
              </label>
              <div className="flex flex-wrap gap-2">
                {quickDates.map((qd) => (
                  <button
                    key={qd.dateStr}
                    type="button"
                    onClick={() => setDate(qd.dateStr)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                      date === qd.dateStr
                        ? 'bg-[#3B0F19] text-white shadow-xs'
                        : 'bg-[#FFF0F2] text-stone-700 border border-[#F5DDE1] hover:border-[#B85C72]'
                    }`}
                  >
                    {qd.label}
                  </button>
                ))}
                {/* Custom Date Input */}
                <input
                  type="date"
                  min={formatDateStr(today)}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-sans text-stone-700 bg-white focus:outline-none focus:border-[#B85C72]"
                />
              </div>
            </div>

            {/* Time Slot Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 font-sans block">
                2. Select Convenient Time Slot:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold font-sans transition-all text-center cursor-pointer ${
                      time === slot
                        ? 'bg-[#B85C72] text-white shadow-xs'
                        : 'bg-stone-50 border border-stone-200 hover:border-[#B85C72] text-stone-700'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-[#F5DDE1]/60">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
              <button
                disabled={!date || !time}
                onClick={() => setStep(3)}
                className="px-6 py-2.5 bg-[#B85C72] hover:bg-[#802339] disabled:opacity-50 text-white rounded-full text-xs font-bold tracking-wider transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <span>Enter Contact Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: CUSTOMER DETAILS */}
        {/* ========================================================================= */}
        {step === 3 && !completedBooking && (
          <div className="space-y-5 animate-fade-in">
            <h3 className="text-sm font-serif font-bold text-[#3B0F19]">
              Step 3: Who Is This Appointment For?
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 font-sans block mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pooja Roy"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs font-sans text-stone-900 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#B85C72]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 font-sans block mb-1">
                  Phone / WhatsApp Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs font-sans text-stone-900 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#B85C72]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 font-sans block mb-1">
                Special Request or Stylist Preference (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Please arrange chandan art specialist, or quiet corner..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-200 text-xs font-sans text-stone-900 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#B85C72]"
              />
            </div>

            {/* Quick Summary Pill */}
            <div className="p-3 bg-[#FFFDF9] border border-[#D4AF37]/30 rounded-2xl flex items-center justify-between text-xs font-sans">
              <span className="text-stone-600">
                Booking: <strong className="text-[#3B0F19]">{activeService?.name}</strong> on <strong>{date}</strong> at <strong>{time}</strong>
              </span>
              <span className="font-serif font-extrabold text-[#B85C72]">
                ₹{activeService?.price}
              </span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-[#F5DDE1]/60">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
              <button
                disabled={!name.trim() || !phone.trim() || isSubmitting}
                onClick={handleConfirm}
                className="px-7 py-2.5 bg-[#B85C72] hover:bg-[#802339] disabled:opacity-50 text-white rounded-full text-xs font-bold tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Reserving Slot...</span>
                ) : (
                  <>
                    <span>Confirm & Book Appointment</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: SUCCESS CONFIRMATION */}
        {/* ========================================================================= */}
        {step === 4 && completedBooking && (() => {
          const bookingReference = String(completedBooking.bookingId || completedBooking.id || 'GG-2026');
          const shortRef = bookingReference.length >= 6 ? bookingReference.slice(-6).toUpperCase() : bookingReference.toUpperCase();

          return (
            <div className="space-y-6 py-2 text-center animate-scale-up">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <span className="text-[11px] uppercase tracking-widest text-[#B85C72] font-extrabold block">
                  BOOKING RESERVED SUCCESSFULLY
                </span>
                <h3 className="font-serif text-2xl font-extrabold text-[#3B0F19]">
                  We Look Forward to Welcoming You! ✨
                </h3>
                <p className="text-xs text-stone-600 font-sans leading-relaxed">
                  Your slot is held. A representative from Glow & Grace will call or WhatsApp you to confirm preparation details.
                </p>
              </div>

              {/* Summary Ticket */}
              <div className="bg-[#FAF6F0] border border-[#E5C494]/50 rounded-2xl p-4 max-w-sm mx-auto text-left space-y-2 text-xs font-sans">
                <div className="flex justify-between border-b border-[#E5C494]/30 pb-2">
                  <span className="text-stone-500">Booking Reference:</span>
                  <span className="font-mono font-bold text-[#3B0F19]">#{shortRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Service:</span>
                  <span className="font-bold text-[#3B0F19]">{activeService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Date & Time:</span>
                  <span className="font-semibold text-stone-800">{completedBooking.date} @ {completedBooking.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Name / Phone:</span>
                  <span className="font-semibold text-stone-800">{completedBooking.customerName} ({completedBooking.phone})</span>
                </div>
                <div className="flex justify-between border-t border-[#E5C494]/30 pt-2">
                  <span className="font-bold text-[#3B0F19]">Estimated Total:</span>
                  <span className="font-serif font-extrabold text-[#B85C72] text-sm">₹{activeService?.price}</span>
                </div>
              </div>

              {/* Direct WhatsApp Share */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hi%20Glow%20and%20Grace!%20I%20just%20booked%20an%20appointment%20for%20${encodeURIComponent(activeService?.name || '')}%20on%20${completedBooking.date}%20at%20${completedBooking.time}.%20Booking%20Ref:%20${shortRef}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#059669] hover:bg-[#047857] text-white rounded-full text-xs font-bold tracking-wider transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send to Parlour on WhatsApp</span>
                </a>

                <button
                  onClick={() => {
                    setCompletedBooking(null);
                    setStep(1);
                  }}
                  className="px-5 py-2.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-full text-xs font-bold tracking-wider transition-all cursor-pointer"
                >
                  Book Another Service
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
};
