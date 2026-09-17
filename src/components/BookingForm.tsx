import React, { useState, useEffect } from 'react';
import { Calendar, User, Phone, Mail, FileText, Clock, Sparkles, MessageCircle, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { MockDB } from '../data';
import { Service, Artist, Appointment } from '../types';
import { Button } from './Common';

interface BookingFormProps {
  onSuccess: (booking: Appointment) => void;
  initialServiceSlug?: string;
  initialArtistSlug?: string;
}

export const BookingForm: React.FC<BookingFormProps> = ({ 
  onSuccess, 
  initialServiceSlug,
  initialArtistSlug 
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  
  // Form fields state
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');
  const [artistId, setArtistId] = useState('');

  // Custom Visual Calendar state variables
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    // Empty cells before the first day of the month
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    
    // Day objects representing each day of the month
    for (let d = 1; d <= totalDays; d++) {
      days.push(new Date(year, month, d));
    }
    
    return days;
  };

  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    const today = new Date();
    const currentMonthMin = new Date(today.getFullYear(), today.getMonth(), 1);
    if (currentMonth > currentMonthMin) {
      setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    }
  };

  const selectDate = (selectedDay: Date) => {
    const yyyy = selectedDay.getFullYear();
    const mm = String(selectedDay.getMonth() + 1).padStart(2, '0');
    const dd = String(selectedDay.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    setDate(dateStr);
    setTime(''); // Reset selected time when date changes
    if (errors.date) setErrors(p => ({ ...p, date: '' }));
  };

  const isSlotBooked = (timeSlot: string) => {
    if (!date) return false;
    const activeAppointments = MockDB.getAppointments().filter(
      appt => appt.date === date && appt.status !== 'Cancelled'
    );
    
    if (artistId && artistId !== 'any') {
      return activeAppointments.some(appt => appt.time === timeSlot && appt.artistId === artistId);
    } else {
      const occupiedArtists = new Set(
        activeAppointments
          .filter(appt => appt.time === timeSlot && appt.artistId !== 'any')
          .map(appt => appt.artistId)
      );
      return artists.length > 0 && occupiedArtists.size >= artists.length;
    }
  };

  const getFormattedDateString = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const isPastDate = (d: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
  };

  // Mobile multi-step wizard state
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Fetch options from DB
    const listServices = MockDB.getServices().filter(s => s.status === 'Active');
    const listArtists = MockDB.getArtists().filter(a => a.status === 'Active');
    setServices(listServices);
    setArtists(listArtists);

    if (initialServiceSlug) {
      const activeServ = listServices.find(s => s.slug === initialServiceSlug || s.id === initialServiceSlug);
      if (activeServ) {
        setServiceId(activeServ.id);
      }
    } else if (listServices.length > 0) {
      setServiceId(listServices[0].id);
    }

    if (initialArtistSlug) {
      const activeArt = listArtists.find(a => a.slug === initialArtistSlug || a.id === initialArtistSlug);
      if (activeArt) {
        setArtistId(activeArt.id);
      }
    }
  }, [initialServiceSlug, initialArtistSlug]);

  const validateStep = (currentStep: number) => {
    const errs: Record<string, string> = {};
    if (currentStep === 1) {
      if (!customerName.trim()) errs.customerName = 'Please enter your beautiful name';
      if (!phone.trim()) {
        errs.phone = 'Please enter your contact number';
      } else if (!/^[0-9+\s-]{10,15}$/.test(phone)) {
        errs.phone = 'Please enter a valid phone number';
      }
      if (!email.trim()) {
        errs.email = 'Please enter your email';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errs.email = 'Please enter a valid email address';
      }
    } else if (currentStep === 2) {
      if (!serviceId) errs.serviceId = 'Please select a service';
      if (!date) errs.date = 'Please select a preferred date';
      if (!time) errs.time = 'Please select an appointment time';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2)) {
      if (!validateStep(1)) setStep(1);
      return;
    }

    const matchedService = services.find(s => s.id === serviceId);
    const matchedArtist = artists.find(a => a.id === artistId);

    const appt = MockDB.saveAppointment({
      customerName,
      phone,
      email,
      serviceId,
      serviceName: matchedService ? matchedService.name : 'Beauty Treatment',
      artistId: artistId || 'any',
      artistName: matchedArtist ? matchedArtist.name : 'Any Available Artist',
      date,
      time,
      specialRequest
    });

    onSuccess(appt);
  };

  return (
    <div className="bg-white border border-[#F5DDE1] rounded-3xl p-6 md:p-10 shadow-lg">
      {/* Step Header */}
      <div className="flex items-center justify-between mb-8 border-b border-[#F5DDE1]/60 pb-5">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#B85C72] block font-sans font-bold">
            Step {step} of 3
          </span>
          <h3 className="font-serif text-lg font-bold text-[#24191B]">
            {step === 1 ? 'Your Details' : step === 2 ? 'Select Services & Timing' : 'Review & Confirm'}
          </h3>
        </div>
        
        {/* Step Indicator dots */}
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === step ? 'bg-[#B85C72] w-6' : i < step ? 'bg-[#D4A373]' : 'bg-[#F5DDE1]'
              }`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* --- STEP 1: Customer Details --- */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            {/* Customer Name */}
            <div>
              <label htmlFor="name-input" className="block text-xs font-semibold tracking-wider uppercase text-[#24191B]/80 mb-2">
                Your Name *
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B85C72]/60" />
                <input
                  id="name-input"
                  type="text"
                  placeholder="Enter your full name"
                  value={customerName}
                  onChange={e => {
                    setCustomerName(e.target.value);
                    if (errors.customerName) setErrors(p => ({ ...p, customerName: '' }));
                  }}
                  className={`w-full bg-[#FFF9F7] border ${
                    errors.customerName ? 'border-red-400 focus:ring-red-300' : 'border-[#F5DDE1] focus:ring-[#B85C72]/30'
                  } rounded-2xl py-3.5 pl-12 pr-4 text-sm text-[#24191B] outline-none transition-all focus:ring-4`}
                />
              </div>
              {errors.customerName && <p className="text-red-500 text-xs mt-1.5">{errors.customerName}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone-input" className="block text-xs font-semibold tracking-wider uppercase text-[#24191B]/80 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B85C72]/60" />
                <input
                  id="phone-input"
                  type="tel"
                  placeholder="e.g. +91 60332 00000"
                  value={phone}
                  onChange={e => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors(p => ({ ...p, phone: '' }));
                  }}
                  className={`w-full bg-[#FFF9F7] border ${
                    errors.phone ? 'border-red-400 focus:ring-red-300' : 'border-[#F5DDE1] focus:ring-[#B85C72]/30'
                  } rounded-2xl py-3.5 pl-12 pr-4 text-sm text-[#24191B] outline-none transition-all focus:ring-4`}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1.5">{errors.phone}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email-input" className="block text-xs font-semibold tracking-wider uppercase text-[#24191B]/80 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B85C72]/60" />
                <input
                  id="email-input"
                  type="email"
                  placeholder="e.g. you@example.com"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(p => ({ ...p, email: '' }));
                  }}
                  className={`w-full bg-[#FFF9F7] border ${
                    errors.email ? 'border-red-400 focus:ring-red-300' : 'border-[#F5DDE1] focus:ring-[#B85C72]/30'
                  } rounded-2xl py-3.5 pl-12 pr-4 text-sm text-[#24191B] outline-none transition-all focus:ring-4`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
            </div>
          </div>
        )}

        {/* --- STEP 2: Services & Timing --- */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            {/* Select Service */}
            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase text-[#24191B]/80 mb-3">
                Select Service *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-1 border border-[#F5DDE1]/40 rounded-2xl bg-[#FFF9F7]/30">
                {services.map(s => {
                  const isSelected = serviceId === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setServiceId(s.id);
                        if (errors.serviceId) setErrors(p => ({ ...p, serviceId: '' }));
                      }}
                      className={`flex items-center gap-4 p-3 rounded-xl border text-left transition-all duration-300 cursor-pointer focus:outline-none ${
                        isSelected
                          ? 'border-[#B85C72] bg-[#FFF9F7]/80 shadow-sm scale-[1.01]'
                          : 'border-[#F5DDE1] bg-white hover:border-[#B85C72]/50 hover:bg-[#FFF9F7]/20'
                      }`}
                    >
                      <img
                        src={s.imageUrl}
                        alt={s.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 object-cover rounded-lg shadow-xs shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] uppercase tracking-wider text-[#B85C72] font-semibold block mb-0.5">
                          {s.category}
                        </span>
                        <h4 className="font-serif text-xs font-bold text-[#24191B] truncate">
                          {s.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-bold text-[#24191B]">
                            ₹{s.startingPrice}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            • {s.duration} mins
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.serviceId && <p className="text-red-500 text-xs mt-1.5">{errors.serviceId}</p>}
            </div>

            {/* Select Preferred Artist */}
            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase text-[#24191B]/80 mb-3">
                Preferred Artist (Optional)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Any Available Professional Option */}
                <button
                  type="button"
                  onClick={() => setArtistId('')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-300 cursor-pointer focus:outline-none ${
                    !artistId
                      ? 'border-[#B85C72] bg-[#FFF9F7]/80 shadow-sm scale-[1.01]'
                      : 'border-[#F5DDE1] bg-white hover:border-[#B85C72]/50 hover:bg-[#FFF9F7]/20'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-[#F5DDE1]/40 text-[#B85C72] flex items-center justify-center mb-2 font-bold text-base shadow-xs shrink-0">
                    ✨
                  </div>
                  <h4 className="font-serif text-xs font-bold text-[#24191B]">
                    Any Artist
                  </h4>
                  <span className="text-[8px] text-stone-400 tracking-wide mt-0.5 uppercase block">
                    Best Available
                  </span>
                </button>

                {artists.map(a => {
                  const isSelected = artistId === a.id;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setArtistId(a.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-300 cursor-pointer focus:outline-none ${
                        isSelected
                          ? 'border-[#B85C72] bg-[#FFF9F7]/80 shadow-sm scale-[1.01]'
                          : 'border-[#F5DDE1] bg-white hover:border-[#B85C72]/50 hover:bg-[#FFF9F7]/20'
                      }`}
                    >
                      <img
                        src={a.photoUrl}
                        alt={a.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover rounded-full shadow-xs mb-2 shrink-0"
                      />
                      <h4 className="font-serif text-xs font-bold text-[#24191B] truncate max-w-full">
                        {a.name}
                      </h4>
                      <span className="text-[8px] text-[#B85C72] font-semibold mt-0.5 uppercase tracking-wider block">
                        {a.role.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Select Date and Time Grid */}
            <div className="pt-4 border-t border-[#F5DDE1]/40">
              <span className="block text-xs font-semibold tracking-wider uppercase text-[#24191B]/80 mb-3">
                Select Date & Time Slot *
              </span>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-[#F5DDE1] rounded-3xl p-5 md:p-6 shadow-sm">
                
                {/* CALENDAR MONTH VIEW */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-sm font-bold text-[#24191B]">
                      {currentMonth.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                    </h4>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={prevMonth}
                        className="p-1.5 rounded-lg border border-[#F5DDE1] hover:bg-[#FFF9F7] hover:text-[#B85C72] transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-[#24191B]"
                        disabled={
                          currentMonth.getFullYear() === new Date().getFullYear() &&
                          currentMonth.getMonth() === new Date().getMonth()
                        }
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={nextMonth}
                        className="p-1.5 rounded-lg border border-[#F5DDE1] hover:bg-[#FFF9F7] hover:text-[#B85C72] transition-colors text-[#24191B]"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Days of Week Header */}
                  <div className="grid grid-cols-7 text-center text-[10px] font-bold tracking-wider text-stone-400 uppercase">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                      <div key={day} className="py-1">{day}</div>
                    ))}
                  </div>

                  {/* Monthly Day Matrix */}
                  <div className="grid grid-cols-7 gap-1">
                    {getDaysInMonth().map((day, idx) => {
                      if (!day) return <div key={`empty-${idx}`} className="aspect-square" />;
                      
                      const formatted = getFormattedDateString(day);
                      const isSelected = date === formatted;
                      const isPast = isPastDate(day);
                      const isToday = getFormattedDateString(new Date()) === formatted;

                      return (
                        <button
                          key={formatted}
                          type="button"
                          disabled={isPast}
                          onClick={() => selectDate(day)}
                          className={`aspect-square rounded-xl text-xs font-semibold flex flex-col items-center justify-center relative transition-all ${
                            isSelected
                              ? 'bg-[#B85C72] text-white shadow-md shadow-rose-950/10 scale-105 z-10'
                              : isPast
                              ? 'text-stone-300 cursor-not-allowed opacity-40'
                              : 'text-stone-700 hover:bg-[#FFF9F7] hover:text-[#B85C72] border border-transparent hover:border-[#F5DDE1]/60'
                          }`}
                        >
                          <span>{day.getDate()}</span>
                          {isToday && !isSelected && (
                            <span className="w-1 h-1 bg-[#D4A373] rounded-full absolute bottom-1.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {errors.date && <p className="text-red-500 text-xs">{errors.date}</p>}
                </div>

                {/* SLOTS GRID VIEW */}
                <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#F5DDE1]/40 lg:pl-6 pt-5 lg:pt-0">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="font-serif text-sm font-bold text-[#24191B]">Available Hours</h4>
                      <p className="text-[10px] text-stone-500">
                        {date 
                          ? `Slots for ${new Date(date).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}`
                          : 'Please select a date first'
                        }
                      </p>
                    </div>

                    {date ? (
                      <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                        {['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'].map(t => {
                          const booked = isSlotBooked(t);
                          const isSelected = time === t;
                          const hour = parseInt(t);
                          const label = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;

                          if (booked) {
                            return (
                              <div
                                key={t}
                                className="border border-stone-200 bg-stone-50/50 text-stone-300 rounded-xl py-2.5 px-3 text-center text-xs font-semibold line-through cursor-not-allowed relative group select-none"
                                title="This slot is fully reserved"
                              >
                                {label}
                                <span className="absolute inset-0 flex items-center justify-center bg-stone-100/80 rounded-xl text-[9px] text-stone-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                  Full
                                </span>
                              </div>
                            );
                          }

                          return (
                            <button
                              key={t}
                              type="button"
                              onClick={() => {
                                setTime(t);
                                if (errors.time) setErrors(p => ({ ...p, time: '' }));
                              }}
                              className={`border py-2.5 px-3 rounded-xl text-center text-xs font-semibold transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-[#B85C72] bg-[#FFF9F7] text-[#B85C72] shadow-sm shadow-rose-950/5 font-bold scale-[1.02]'
                                  : 'border-[#F5DDE1] bg-white text-stone-700 hover:border-[#B85C72] hover:bg-[#FFF9F7]/30'
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="h-[200px] border border-dashed border-[#F5DDE1] rounded-2xl flex flex-col items-center justify-center text-center p-4">
                        <Clock className="w-6 h-6 text-stone-300 mb-2 animate-pulse" />
                        <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                          Awaiting Date Selection
                        </span>
                      </div>
                    )}
                    {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
                  </div>

                  {date && time && (
                    <div className="mt-4 p-3 bg-[#FFF9F7] rounded-xl border border-[#F5DDE1]/60 flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#B85C72]" />
                      <div className="text-[11px]">
                        <span className="text-stone-500 font-medium block">Selected Appointment:</span>
                        <span className="font-bold text-[#24191B]">
                          {new Date(date).toLocaleDateString('default', { month: 'short', day: 'numeric' })} at {parseInt(time) > 12 ? parseInt(time) - 12 : time}:00 {parseInt(time) >= 12 ? 'PM' : 'AM'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 3: Special Request & Confirm --- */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            {/* Special Request */}
            <div>
              <label htmlFor="request-textarea" className="block text-xs font-semibold tracking-wider uppercase text-[#24191B]/80 mb-2">
                Special Requests or Custom Themes
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 w-4 h-4 text-[#B85C72]/60" />
                <textarea
                  id="request-textarea"
                  placeholder="e.g. specific skin tones, allergic details, or hair accessory requests"
                  value={specialRequest}
                  onChange={e => setSpecialRequest(e.target.value)}
                  rows={4}
                  className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-2xl py-3.5 pl-12 pr-4 text-sm text-[#24191B] outline-none transition-all focus:ring-4 focus:ring-[#B85C72]/30"
                />
              </div>
            </div>

            {/* Summary details review card */}
            <div className="bg-[#FFF9F7] border border-[#F5DDE1] rounded-2xl p-5 space-y-3 text-sm">
              <span className="text-[10px] uppercase tracking-widest text-[#D4A373] block font-bold">
                Verification Summary
              </span>
              <div className="flex justify-between border-b border-[#F5DDE1]/40 pb-2">
                <span className="text-[#24191B]/60">Client:</span>
                <span className="font-semibold text-[#24191B]">{customerName}</span>
              </div>
              <div className="flex justify-between border-b border-[#F5DDE1]/40 pb-2">
                <span className="text-[#24191B]/60">Service:</span>
                <span className="font-semibold text-[#B85C72]">
                  {services.find(s => s.id === serviceId)?.name}
                </span>
              </div>
              {artistId && (
                <div className="flex justify-between border-b border-[#F5DDE1]/40 pb-2">
                  <span className="text-[#24191B]/60">Artist:</span>
                  <span className="font-semibold text-[#24191B]">
                    {artists.find(a => a.id === artistId)?.name}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#24191B]/60">Scheduled:</span>
                <span className="font-semibold text-[#24191B]">{date} @ {time}</span>
              </div>
            </div>
          </div>
        )}

        {/* --- Buttons Controller Navigation --- */}
        <div className="flex items-center justify-between border-t border-[#F5DDE1]/60 pt-6 mt-8">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="flex items-center gap-2 text-sm text-[#24191B]/70 hover:text-[#B85C72] transition-colors font-medium cursor-pointer focus:outline-none"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button
              type="button"
              variant="primary"
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#D4A373]" />
              Confirm Appointment
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};


// --- BOOKING CONFIRMATION SCREEN ---
interface BookingConfirmationProps {
  booking: Appointment;
  onReset: () => void;
  whatsappNumber: string;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  booking,
  onReset,
  whatsappNumber
}) => {
  const getWhatsAppMessage = () => {
    return `✨ *GLOW & GRACE BEAUTY SALON* ✨
*APPOINTMENT RESERVATION SUMMARY*

Hello Glow & Grace Salon,

I have just successfully submitted an online appointment request and would like to confirm my slot! Here is my reservation detail receipt:

=====================================
🔑 *Booking ID:* ${booking.bookingId}
👤 *Client Name:* ${booking.customerName}
🌸 *Service Selected:* ${booking.serviceName}
💇 *Preferred Artist:* ${booking.artistName || 'Any Available Artist'}
📅 *Scheduled Date:* ${booking.date}
⏰ *Time Slot:* ${booking.time}:00
=====================================

💌 *Special Requests:* ${booking.specialRequest || 'None'}
🕒 *Status:* Pending Confirmation

Kindly confirm my appointment slot at your earliest convenience. Thank you so much! 💕`;
  };

  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9+]/g, '')}?text=${encodeURIComponent(getWhatsAppMessage())}`;

  return (
    <div className="bg-white border border-[#F5DDE1] rounded-3xl p-8 md:p-12 text-center shadow-xl max-w-2xl mx-auto animate-scale-up">
      <div className="w-16 h-16 bg-[#F5DDE1] text-[#B85C72] rounded-full flex items-center justify-center mx-auto mb-6">
        <Sparkles className="w-8 h-8" />
      </div>

      <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-[#24191B] mb-2">
        Appointment Request Received 💕
      </h3>
      <p className="text-[#24191B]/60 text-sm md:text-base max-w-md mx-auto mb-8">
        Thank you for choosing Glow & Grace. Your reservation has been logged into our salon scheduler.
      </p>

      {/* Confirmation details receipt card */}
      <div className="bg-[#FFF9F7] border border-[#F5DDE1] rounded-2xl p-6 text-left space-y-4 max-w-md mx-auto mb-10 shadow-xs">
        <div className="flex justify-between items-center border-b border-[#F5DDE1] pb-3">
          <span className="text-xs uppercase tracking-widest text-[#24191B]/50">Booking ID</span>
          <span className="font-mono text-sm font-bold text-[#B85C72] bg-white border border-[#F5DDE1] px-3 py-1 rounded-md">
            {booking.bookingId}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-xs text-[#24191B]/50 block">Customer Name</span>
            <span className="font-bold text-[#24191B]">{booking.customerName}</span>
          </div>
          <div>
            <span className="text-xs text-[#24191B]/50 block">Phone</span>
            <span className="font-bold text-[#24191B]">{booking.phone}</span>
          </div>
          <div>
            <span className="text-xs text-[#24191B]/50 block">Service Selected</span>
            <span className="font-bold text-[#B85C72]">{booking.serviceName}</span>
          </div>
          {booking.artistName && (
            <div>
              <span className="text-xs text-[#24191B]/50 block">Preferred Stylist</span>
              <span className="font-bold text-[#24191B]">{booking.artistName}</span>
            </div>
          )}
          <div>
            <span className="text-xs text-[#24191B]/50 block">Scheduled Date</span>
            <span className="font-bold text-[#24191B]">{booking.date}</span>
          </div>
          <div>
            <span className="text-xs text-[#24191B]/50 block">Time Slot</span>
            <span className="font-bold text-[#24191B]">{booking.time}</span>
          </div>
        </div>

        <div className="border-t border-[#F5DDE1] pt-3 flex items-center justify-between text-xs">
          <span className="text-[#24191B]/50">Status:</span>
          <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full font-semibold">
            Pending Confirmation
          </span>
        </div>
      </div>

      {/* Interactive Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-medium hover:bg-[#20ba59] transition-colors py-3.5 px-8 rounded-full shadow-md text-sm"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          Verify on WhatsApp
        </a>

        <Button
          variant="outline"
          onClick={onReset}
          className="w-full sm:w-auto"
        >
          Book Another Session
        </Button>
      </div>
    </div>
  );
};
