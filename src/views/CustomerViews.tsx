import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Star, Calendar, Clock, Heart, Award, ShieldCheck, 
  Smile, Coins, Coffee, ArrowRight, ArrowLeft, Instagram, 
  MapPin, Phone, Mail, FileText, ChevronRight, CheckCircle2,
  Share2, Send, Copy, Check
} from 'lucide-react';
import { MockDB } from '../data';
import { Service, Package, Artist, GalleryItem, Review, Offer, WebsiteSettings, Appointment } from '../types';
import { Button, LoadingState, EmptyState, Toast } from '../components/Common';
import { ServiceCard, PackageCard, ArtistCard, ReviewCard } from '../components/Cards';
import { Lightbox, Modal, ReelModal } from '../components/Modal';
import { BookingForm, BookingConfirmation } from '../components/BookingForm';
import { ContactSection } from '../components/ContactSection';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { BridalShowcase } from '../components/BridalShowcase';
import { ReelGallery } from '../components/ReelGallery';
import { FastBookingSection } from '../components/FastBookingSection';

interface CustomerViewsProps {
  path: string;
  params: Record<string, string>;
  navigate: (path: string) => void;
  settings: WebsiteSettings;
}

// ==========================================
// 1. HOME VIEW (AUTHENTIC PARLOUR & MUA PROFILE)
// ==========================================
export const HomeView: React.FC<CustomerViewsProps> = ({ navigate, settings }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [reels, setReels] = useState<any[]>([]);
  const [glowups, setGlowups] = useState<any[]>([]);
  const [activePortfolioCategory, setActivePortfolioCategory] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [bookingServiceId, setBookingServiceId] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeReel, setActiveReel] = useState<GalleryItem | null>(null);
  const [likesMap, setLikesMap] = useState<Record<string, { count: number; liked: boolean }>>({});

  const handleBookService = (srvId?: string) => {
    if (srvId) {
      setBookingServiceId(srvId);
    }
    const el = document.getElementById('fast-booking-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('booking');
    }
  };

  useEffect(() => {
    setServices(MockDB.getServices().filter(s => s.status === 'Active' || s.active !== false));
    setPackages(MockDB.getPackages().filter(p => p.status === 'Active').slice(0, 3));
    setReviews(MockDB.getReviews().filter(r => r.status === 'Approved').slice(0, 3));
    setOffers(MockDB.getOffers().filter(o => o.status === 'Active'));
    
    const dbReels = MockDB.getReels();
    setReels(dbReels.filter(r => r.active !== false));
    
    const dbGlowups = MockDB.getGlowups();
    setGlowups(dbGlowups.filter(g => g.active !== false));

    const gal = MockDB.getGallery();
    setGallery(gal);

    // Initialize likes
    const initialLikes: Record<string, { count: number; liked: boolean }> = {};
    gal.forEach(item => {
      initialLikes[item.id] = { count: item.likes || Math.floor(Math.random() * 200 + 150), liked: false };
    });
    setLikesMap(initialLikes);
  }, []);

  const handleToggleLike = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    setLikesMap(prev => {
      const current = prev[itemId] || { count: 100, liked: false };
      return {
        ...prev,
        [itemId]: {
          count: current.liked ? current.count - 1 : current.count + 1,
          liked: !current.liked
        }
      };
    });
  };

  // Curated Popular Daily Picks (Bridal Makeup, Party Makeup, Facial, Hair Spa, Manicure, Eyebrow/Threading)
  // or filtered services when a category is selected
  const displayedServices = React.useMemo(() => {
    if (selectedCategory === 'All') {
      const popularServices = services.filter(s => s.popular).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      if (popularServices.length > 0) {
        return popularServices.slice(0, 6);
      }
      
      const preferredSlugs = [
        'bridal-makeup',
        'party-makeup',
        'premium-facial',
        'hair-spa',
        'nourishing-manicure',
        'eyebrow-threading'
      ];
      const picks = preferredSlugs
        .map(key => services.find(s => s.slug === key || s.id === key))
        .filter((s): s is Service => Boolean(s));

      if (picks.length >= 4) {
        return picks.slice(0, 6);
      }
      return services.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)).slice(0, 6);
    }

    const cat = selectedCategory.toLowerCase();
    const filtered = services.filter((s) => {
      const sc = (s.category || '').toLowerCase();
      const sn = (s.name || '').toLowerCase();
      if (cat === 'makeup') return sc.includes('makeup') || sn.includes('makeup');
      if (cat === 'hair') return sc.includes('hair') || sn.includes('hair') || sn.includes('cut') || sn.includes('spa');
      if (cat === 'facial') return sc.includes('facial') || sc.includes('skin') || sn.includes('facial') || sn.includes('cleanup') || sn.includes('bleach') || sn.includes('polishing');
      if (cat === 'grooming') return (sc.includes('grooming') && !sn.includes('manicure') && !sn.includes('pedicure') && !sn.includes('nail')) || sn.includes('threading') || sn.includes('waxing') || sn.includes('lip') || sn.includes('eyebrow');
      if (cat === 'nails') return sc.includes('nail') || sn.includes('nail') || sn.includes('manicure') || sn.includes('pedicure');
      if (cat === 'bridal') return sc.includes('bridal') || sn.includes('bridal') || sn.includes('saree') || sn.includes('chandan');
      return sc.includes(cat);
    });

    return (filtered.length > 0 ? filtered : services).slice(0, 6);
  }, [services, selectedCategory]);

  const getServiceImageUrl = (s: Service) => {
    if (s.imageUrl && s.imageUrl.trim() !== '') {
      return s.imageUrl;
    }
    const cat = (s.category || '').toLowerCase();
    if (cat.includes('bridal')) return 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80';
    if (cat.includes('hair')) return 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format&fit=crop&q=80';
    if (cat.includes('skin') || cat.includes('facial')) return 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&auto=format&fit=crop&q=80';
    if (cat.includes('nail')) return 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&auto=format&fit=crop&q=80';
    if (cat.includes('grooming')) return 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80';
    return 'https://images.unsplash.com/photo-1481501940778-c8bb63e376c5?w=800&auto=format&fit=crop&q=80';
  };

  const portfolioCategories = ['All', 'Bridal', 'Makeup', 'Hair', 'Facial', 'Nails', 'Reels'];

  const filteredPortfolio = gallery.filter(item => {
    if (activePortfolioCategory === 'All') return true;
    if (activePortfolioCategory === 'Reels') return item.mediaType === 'video';
    return item.category.toLowerCase().includes(activePortfolioCategory.toLowerCase());
  });

  // Instagram-worthy visual feed posts
  const instagramFeed = [
    { id: 1, img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop&q=80', likes: '243', type: 'Bridal Makeup' },
    { id: 2, img: 'https://images.unsplash.com/photo-1615396899839-c99c121888b0?w=500&auto=format&fit=crop&q=80', likes: '189', type: 'Bridal Saree' },
    { id: 3, img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80', likes: '312', type: 'Hair Styling' },
    { id: 4, img: 'https://images.unsplash.com/photo-1604654894610-df4906b197ae?w=500&auto=format&fit=crop&q=80', likes: '154', type: 'Premium Nail Art' },
    { id: 5, img: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=500&auto=format&fit=crop&q=80', likes: '202', type: 'Facial & Glow' },
    { id: 6, img: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=500&auto=format&fit=crop&q=80', likes: '425', type: 'Salon Ambience' },
    { id: 7, img: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=500&auto=format&fit=crop&q=80', likes: '378', type: 'Traditional Makeover' },
    { id: 8, img: 'https://images.unsplash.com/photo-1610189012903-b44403845758?w=500&auto=format&fit=crop&q=80', likes: '291', type: 'Party Glamour' }
  ];

  return (
    <div className="space-y-12 pb-12 bg-[#FFFDFB]">
      
      {/* Lightbox for photo modal */}
      <Lightbox
        images={filteredPortfolio}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(idx) => setLightboxIndex(idx)}
        onBook={(lookName) => navigate('booking')}
      />

      {/* Reel Modal for video modal */}
      <ReelModal
        reel={activeReel}
        isOpen={activeReel !== null}
        onClose={() => setActiveReel(null)}
        onBook={(lookName) => navigate('booking')}
      />

      {/* 1A. PROFILE-STYLE ARTIST & PARLOUR HERO */}
      <section id="parlour-profile" className="relative bg-gradient-to-b from-[#FFF0F2] via-[#FAF6F0] to-[#FFFDFB] pt-32 pb-16 px-6 border-b border-[#F5DDE1]/60">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Profile Header Block (Avatar + Info + Verification) */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Circular Artist / Parlour Avatar with Gold Ring & Verified Checkmark */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-[#D4AF37] via-[#B85C72] to-[#E5C494] shadow-xl">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&auto=format&fit=crop&q=80"
                    alt="Glow & Grace Ladies Beauty Parlour & Makeup Artist"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              {/* Verified Badge */}
              <div 
                className="absolute -bottom-1 -right-1 bg-[#059669] text-white p-1.5 rounded-full shadow-md border-2 border-white flex items-center justify-center"
                title="Verified Ladies Beauty Parlour & Makeup Artist"
              >
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            {/* Profile Identity Details */}
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-3 py-1 bg-[#B85C72]/10 border border-[#B85C72]/20 text-[#B85C72] text-[10px] uppercase font-bold tracking-widest rounded-full font-sans">
                  Verified Ladies Salon
                </span>
                <span className="px-2.5 py-1 bg-[#D4AF37]/15 text-[#802339] text-[10px] font-bold tracking-wider rounded-full font-sans flex items-center gap-1">
                  👑 100% Women-Only Sanctuary
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#3B0F19] tracking-tight">
                Glow & Grace
                <span className="block text-xl sm:text-2xl font-serif text-[#B85C72] font-semibold mt-1">
                  Ladies Beauty Parlour & Makeup Artist
                </span>
              </h1>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[#3B0F19]/70 font-sans">
                <span className="font-semibold text-[#802339]">Makeup Artist • Hair • Skin • Bridal</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  4.9 (120+ Google Reviews)
                </span>
              </div>

              {/* Bio snippet */}
              <p className="text-xs sm:text-sm text-[#3B0F19]/80 font-sans leading-relaxed max-w-xl">
                Professional bridal makeup, hairstyling, and traditional parlour care crafted for every celebration and glowing moment. Specializing in Bengali Chandan art, royal North & South Indian bridal transformations, and authentic skin therapies.
              </p>
            </div>
          </div>

          {/* Key Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-y border-[#F5DDE1]/70 py-4 bg-white/60 backdrop-blur-xs rounded-2xl px-4 border">
            <div className="text-center sm:text-left">
              <span className="block font-serif text-xl sm:text-2xl font-black text-[#B85C72]">500+</span>
              <span className="text-[11px] font-sans text-[#3B0F19]/70 font-semibold">Happy Brides & Clients</span>
            </div>
            <div className="text-center sm:text-left">
              <span className="block font-serif text-xl sm:text-2xl font-black text-[#3B0F19]">5+ Years</span>
              <span className="text-[11px] font-sans text-[#3B0F19]/70 font-semibold">Artistry Experience</span>
            </div>
            <div className="text-center sm:text-left">
              <span className="block font-serif text-xl sm:text-2xl font-black text-[#B85C72]">1000+</span>
              <span className="text-[11px] font-sans text-[#3B0F19]/70 font-semibold">Transformations</span>
            </div>
            <div className="text-center sm:text-left">
              <span className="block font-serif text-xl sm:text-2xl font-black text-[#059669]">100%</span>
              <span className="text-[11px] font-sans text-[#3B0F19]/70 font-semibold">Women Safe & Private</span>
            </div>
          </div>

          {/* Quick Action Profile Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
            <button
              onClick={() => navigate('booking')}
              className="px-6 py-3 bg-[#B85C72] hover:bg-[#802339] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              Book Appointment
            </button>
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hi%20Glow%20and%20Grace!%20I\'d%20like%20to%20inquire%20about%20booking%20a%20beauty%20appointment.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-[#059669] hover:bg-[#047857] text-white rounded-xl text-xs font-bold tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>💬</span>
              WhatsApp Us
            </a>
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-white hover:bg-[#FFF0F2] text-[#3B0F19] border border-[#F5DDE1] rounded-xl text-xs font-bold tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            >
              <Instagram className="w-4 h-4 text-[#B85C72]" />
              @glowandgrace
            </a>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. POPULAR SERVICES: WHAT DO YOU NEED TODAY? ✨ */}
      {/* ========================================================================= */}
      <section id="popular-services" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF0F2] rounded-full text-[10px] font-sans font-extrabold tracking-widest text-[#B85C72] uppercase border border-[#F5DDE1]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            SERVICE DISCOVERY
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#3B0F19]">
            What Do You Need Today? ✨
          </h2>
          <p className="text-xs sm:text-sm text-[#3B0F19]/70 font-sans">
            Tap a category or discover our handpicked daily salon favourites.
          </p>
        </div>

        {/* 1. SERVICE CATEGORY CARDS (Compact with beauty thumbnail & icon) */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
          {[
            {
              id: 'Makeup',
              name: 'Makeup',
              emoji: '💄',
              desc: 'Party & HD glam',
              img: 'https://images.unsplash.com/photo-1481501940778-c8bb63e376c5?w=160&auto=format&fit=crop&q=80',
              alt: 'Makeup artistry service at Glow & Grace'
            },
            {
              id: 'Hair',
              name: 'Hair',
              emoji: '💇‍♀️',
              desc: 'Spa & styling',
              img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=160&auto=format&fit=crop&q=80',
              alt: 'Hair styling and spa at Glow & Grace'
            },
            {
              id: 'Facial',
              name: 'Facial',
              emoji: '🌸',
              desc: 'Gold glow polish',
              img: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=160&auto=format&fit=crop&q=80',
              alt: 'Skin & facial treatments at Glow & Grace'
            },
            {
              id: 'Grooming',
              name: 'Grooming',
              emoji: '✨',
              desc: 'Threading & wax',
              img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=160&auto=format&fit=crop&q=80',
              alt: 'Threading & waxing grooming at Glow & Grace'
            },
            {
              id: 'Nails',
              name: 'Nails',
              emoji: '💅',
              desc: 'Gel extensions',
              img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=160&auto=format&fit=crop&q=80',
              alt: 'Manicure & nail styling at Glow & Grace'
            },
            {
              id: 'Bridal',
              name: 'Bridal',
              emoji: '👰',
              desc: 'Mukut & packages',
              img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=160&auto=format&fit=crop&q=80',
              alt: 'Indian bridal makeover and styling at Glow & Grace'
            },
          ].map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(prev => prev.toLowerCase() === cat.id.toLowerCase() ? 'All' : cat.id)}
                className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl border transition-all cursor-pointer text-center group relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#3B0F19] text-white border-[#3B0F19] shadow-md -translate-y-0.5 ring-2 ring-[#B85C72]/40'
                    : 'bg-white text-[#3B0F19] border-[#F5DDE1] hover:border-[#B85C72] hover:bg-[#FFF0F2]/40 shadow-xs'
                }`}
                aria-pressed={isSelected}
              >
                {/* Small Category Beauty Thumbnail with Emoji Badge */}
                <div className="relative mb-1">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-white shadow-xs bg-[#FFF0F2]">
                    <img
                      src={cat.img}
                      alt={cat.alt}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 text-[11px] sm:text-xs bg-white/95 rounded-full px-0.5 shadow-xs border border-[#F5DDE1]">
                    {cat.emoji}
                  </span>
                </div>

                <span className="font-serif text-[11px] sm:text-xs font-bold block leading-tight">
                  {cat.name}
                </span>
                <span className={`text-[9px] hidden sm:block mt-0.5 leading-tight ${isSelected ? 'text-[#E5C494]' : 'text-stone-400'}`}>
                  {cat.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* 2. POPULAR DAILY PICKS: IMAGE-FIRST BEAUTY PARLOUR SERVICE CARDS */}
        <div className="bg-[#FAF6F0]/60 border border-[#F5DDE1] rounded-3xl p-3.5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F5DDE1]/70 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-sm sm:text-base md:text-lg font-bold text-[#3B0F19]">
                  {selectedCategory === 'All' ? 'Popular Daily Picks' : `${selectedCategory} Highlights`}
                </h3>
                {selectedCategory !== 'All' && (
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="text-[10px] text-[#B85C72] hover:underline font-bold bg-[#FFF0F2] px-2 py-0.5 rounded-full border border-[#F5DDE1] cursor-pointer"
                  >
                    Show All Picks ✕
                  </button>
                )}
              </div>
              <p className="text-[10px] sm:text-xs text-stone-500 font-sans">
                {selectedCategory === 'All' 
                  ? 'Our most requested everyday parlour services & bridal favourites' 
                  : `Hand-crafted beauty treatments for ${selectedCategory}`}
              </p>
            </div>

            <button
              onClick={() => navigate('services')}
              className="text-xs sm:text-sm font-bold text-[#B85C72] hover:text-[#802339] flex items-center gap-1 cursor-pointer self-start sm:self-auto group transition-colors"
            >
              <span>View All 20+ Services →</span>
            </button>
          </div>

          {/* 2-Column Grid on Mobile (320px-430px), 3-Column on Tablet/Desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4 md:gap-5">
            {displayedServices.map((s) => {
              const serviceImg = getServiceImageUrl(s);
              const priceNum = s.startingPrice || (s as any).price || 0;

              return (
                <div
                  key={s.id}
                  className="bg-white border border-[#F5DDE1] rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#B85C72]/50 transition-all duration-300 flex flex-col group justify-between"
                >
                  {/* BEAUTY SERVICE IMAGE */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FFF0F2]">
                    <img
                      src={serviceImg}
                      alt={`${s.name} service at Glow & Grace Ladies Beauty Parlour`}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    {/* Duration / Tag badge */}
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 bg-white/90 backdrop-blur-xs text-[#802339] text-[9px] font-sans font-bold tracking-wide rounded-md shadow-xs border border-white/60">
                        {s.duration ? `${s.duration} mins` : s.category}
                      </span>
                    </div>
                  </div>

                  {/* SERVICE CONTENT DETAILS */}
                  <div className="p-2.5 sm:p-3.5 flex flex-col flex-1 justify-between gap-2">
                    <div>
                      <h4 className="font-serif text-xs sm:text-sm font-bold text-[#3B0F19] group-hover:text-[#B85C72] transition-colors line-clamp-1">
                        {s.name}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-[#3B0F19]/70 font-sans line-clamp-1 leading-snug mt-0.5">
                        {s.description}
                      </p>
                    </div>

                    {/* PRICE & BOOK ACTION */}
                    <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-[#F5DDE1]/60 mt-auto">
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] text-stone-500 font-sans block leading-none truncate">
                          Starting from
                        </span>
                        <span className="font-serif text-xs sm:text-sm font-extrabold text-[#B85C72] block leading-tight mt-0.5">
                          ₹{priceNum.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <button
                        onClick={() => handleBookService(s.id)}
                        aria-label={`Book ${s.name} appointment`}
                        className="px-3 py-1.5 sm:px-3.5 sm:py-1.5 bg-[#B85C72] hover:bg-[#802339] active:scale-95 text-white rounded-lg text-xs font-bold font-sans transition-all shrink-0 cursor-pointer shadow-xs min-h-[44px] sm:min-h-[36px] flex items-center justify-center"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom link to view full services */}
          <div className="text-center pt-2">
            <button
              onClick={() => navigate('services')}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white hover:bg-[#FFF0F2] text-[#B85C72] hover:text-[#802339] border border-[#F5DDE1] rounded-full text-xs font-bold font-sans transition-all shadow-xs hover:shadow-sm cursor-pointer"
            >
              <span>View All 20+ Services →</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. QUICK PRICE MENU */}
      {/* ========================================================================= */}
      <section id="quick-price-menu" className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-[#FAF6F0] border border-[#E5C494]/50 rounded-[28px] p-6 sm:p-10 shadow-xs relative overflow-hidden">
          {/* Subtle gold corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#D4AF37]/50 m-3" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#D4AF37]/50 m-3" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#D4AF37]/50 m-3" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#D4AF37]/50 m-3" />

          {/* Header */}
          <div className="text-center space-y-1.5 mb-8">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#B85C72] font-extrabold block">
              TRANSPARENT RATES
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#3B0F19]">
              Popular Services & Prices
            </h2>
            <div className="w-10 h-0.5 bg-[#D4AF37]/60 mx-auto" />
            <p className="text-[11px] uppercase tracking-widest text-[#3B0F19]/60 font-sans font-semibold">
              Pure Ladies Care &bull; Only Top Brands (MAC, L'Oréal, O3+)
            </p>
          </div>

          {/* Scannable Price Table */}
          <div className="space-y-3">
            {[
              { id: 'srv-bridal', name: 'Bridal Makeup (HD / Airbrush)', price: '₹7,999', srvId: 's1' },
              { id: 'srv-party', name: 'Party Makeup & Blowout', price: '₹1,999', srvId: 's2' },
              { id: 'srv-engagement', name: 'Engagement / Sangeet Makeover', price: '₹3,999', srvId: 's7' },
              { id: 'srv-facial', name: '24K Gold & Herbal Facial', price: '₹699', srvId: 's3' },
              { id: 'srv-hairspa', name: 'Deep Conditioning Hair Spa', price: '₹799', srvId: 's4' },
              { id: 'srv-threading', name: 'Eyebrow Shaping & Threading', price: '₹50', srvId: 's8' },
              { id: 'srv-manicure', name: 'Luxury Manicure & Polish', price: '₹399', srvId: 's5' },
              { id: 'srv-pedicure', name: 'Herbal Foot Spa & Pedicure', price: '₹499', srvId: 's6' },
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 sm:p-3.5 bg-white/80 rounded-xl border border-[#F5DDE1]/60 hover:bg-white transition-all shadow-2xs gap-3"
              >
                <div className="flex-1 min-w-0">
                  <span className="font-serif text-xs sm:text-sm font-bold text-[#3B0F19] block truncate">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 font-sans block leading-none">Starting</span>
                    <span className="font-serif text-xs sm:text-sm font-extrabold text-[#B85C72]">
                      {item.price}
                    </span>
                  </div>
                  <button
                    onClick={() => handleBookService(item.srvId)}
                    className="px-3 py-1.5 bg-[#B85C72] hover:bg-[#802339] text-white text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer"
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Button: View All Services */}
          <div className="text-center pt-6">
            <button
              onClick={() => navigate('services')}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-[#FFF0F2] text-[#B85C72] border border-[#F5DDE1] rounded-full text-xs font-bold font-sans tracking-wide transition-all shadow-xs hover:shadow-sm cursor-pointer"
            >
              <span>View All Services & Rate List</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FAST BOOKING */}
      {/* ========================================================================= */}
      <FastBookingSection
        selectedServiceId={bookingServiceId}
        onSelectService={setBookingServiceId}
        settings={settings}
        navigate={navigate}
      />

      {/* ========================================================================= */}
      {/* 6. OUR WORK / PORTFOLIO */}
      {/* ========================================================================= */}
      <section id="our-work-portfolio" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#F5DDE1] pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[#B85C72] font-extrabold font-sans">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              PHOTO-FIRST REAL WORK
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#3B0F19]">
              Our Work ✨
            </h2>
            <p className="text-xs sm:text-sm text-[#3B0F19]/70 font-sans">
              Real clients. Real beauty.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {portfolioCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActivePortfolioCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer ${
                  activePortfolioCategory === cat
                    ? 'bg-[#3B0F19] text-[#FFFDF9] shadow-sm'
                    : 'bg-[#FFF0F2] text-[#3B0F19]/70 border border-[#F5DDE1] hover:text-[#B85C72]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 6–8 Featured Portfolio Items Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {filteredPortfolio.slice(0, 8).map((item, index) => {
            const isVideo = item.mediaType === 'video';
            const likeInfo = likesMap[item.id] || { count: item.likes || 150, liked: false };

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isVideo) {
                    setActiveReel(item);
                  } else {
                    setLightboxIndex(index);
                  }
                }}
                className="group relative rounded-2xl overflow-hidden bg-stone-100 border border-[#F5DDE1] shadow-xs hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col justify-end aspect-square"
              >
                <img
                  src={item.imageUrl}
                  alt={item.alt || item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                  <span className="bg-black/50 backdrop-blur-md text-white text-[9px] font-sans font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border border-white/20">
                    {item.category}
                  </span>
                  {isVideo ? (
                    <span className="bg-[#B85C72] text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                      ▶ Reel
                    </span>
                  ) : (
                    <button
                      onClick={(e) => handleToggleLike(e, item.id)}
                      className={`p-1 rounded-full backdrop-blur-md transition-transform active:scale-125 ${
                        likeInfo.liked ? 'bg-rose-600 text-white' : 'bg-black/40 text-white hover:bg-black/60'
                      }`}
                      title="Like look"
                    >
                      <Heart className={`w-3 h-3 ${likeInfo.liked ? 'fill-white' : ''}`} />
                    </button>
                  )}
                </div>

                {/* Bottom Title */}
                <div className="relative z-10 p-3 space-y-0.5 text-white">
                  <h4 className="font-serif font-bold text-xs sm:text-sm leading-tight line-clamp-1 group-hover:text-[#E5C494] transition-colors">
                    {item.title}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-white/80 font-sans">
                    <span className="line-clamp-1">{item.description}</span>
                    <span className="shrink-0 ml-2 font-semibold text-rose-300">
                      ❤️ {likeInfo.count}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Button: View Full Portfolio */}
        <div className="text-center pt-2">
          <button
            onClick={() => navigate('gallery')}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-[#FFF0F2] text-[#B85C72] border border-[#F5DDE1] rounded-full text-xs font-bold font-sans tracking-wide transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <span>View Full Portfolio &rarr;</span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. BRIDAL FEATURE */}
      {/* ========================================================================= */}
      <section id="bridal-feature" className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#FFF0F2] via-[#FAF6F0] to-[#FFF0F2] border border-[#F5DDE1] rounded-3xl p-6 sm:p-10 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Images preview (1-2 images) */}
          <div className="md:col-span-5 grid grid-cols-2 gap-3">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-md border border-[#F5DDE1] relative">
              <img
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80"
                alt="Traditional Royal Bengali Bride with Chandan Art"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                Bengali Chandan Art
              </span>
            </div>
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-md border border-[#F5DDE1] relative">
              <img
                src="https://images.unsplash.com/photo-1615396899839-c99c121888b0?w=600&auto=format&fit=crop&q=80"
                alt="Classic Red & Gold Indian Bridal Glamour"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                Royal Red Bride
              </span>
            </div>
          </div>

          {/* Bridal Content */}
          <div className="md:col-span-7 space-y-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-[10px] font-sans font-extrabold tracking-widest text-[#B85C72] uppercase border border-[#F5DDE1]">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                SIGNATURE ARTISTRY
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#3B0F19]">
                Bridal Makeup 👰
              </h2>
              <p className="text-xs sm:text-sm text-[#3B0F19]/80 font-sans leading-relaxed">
                “From traditional Bengali bridal looks to modern reception glam, create your signature look with Glow & Grace.”
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="grid grid-cols-2 gap-2 text-xs font-sans text-[#3B0F19]/80 pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B85C72]" />
                Hand-Painted Chandan
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B85C72]" />
                Mukut & Dupatta Styling
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B85C72]" />
                16-Hour Sweatproof HD
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B85C72]" />
                Banarasi Saree Pleating
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => navigate('bridal')}
                className="px-5 py-2.5 bg-[#B85C72] hover:bg-[#802339] text-white rounded-xl text-xs font-bold font-sans tracking-wide transition-all shadow-xs cursor-pointer"
              >
                Explore Bridal Services
              </button>
              <button
                onClick={() => navigate('booking')}
                className="px-5 py-2.5 bg-white hover:bg-[#FFF0F2] text-[#3B0F19] border border-[#F5DDE1] rounded-xl text-xs font-bold font-sans tracking-wide transition-all cursor-pointer"
              >
                Book Bridal Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. BEFORE / AFTER */}
      {/* ========================================================================= */}
      {glowups.length > 0 && (
        <BeforeAfterSlider 
          glowups={glowups}
          compact={true} 
          onBook={(serviceName) => handleBookService(services.find(s => s.name === serviceName)?.id || 's1')} 
          onViewAll={() => navigate('gallery')} 
        />
      )}

      {/* ========================================================================= */}
      {/* 9. BEAUTY REELS */}
      {/* ========================================================================= */}
      {reels.length > 0 && (
        <section id="beauty-reels-preview" className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF0F2] rounded-full text-[10px] font-sans font-extrabold tracking-widest text-[#B85C72] uppercase border border-[#F5DDE1]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              VERTICAL VIDEO REVEALS
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#3B0F19]">
              Beauty Reels 🎬
            </h2>
            <p className="text-xs sm:text-sm text-[#3B0F19]/70 font-sans">
              Swipe through transformations and authentic parlour moments.
            </p>
          </div>

          {/* 3 Featured Reels Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {reels.sort((a, b) => a.displayOrder - b.displayOrder).slice(0, 3).map((reel) => (
              <div
                key={reel.id}
                onClick={() => setActiveReel({
                  ...reel, 
                  mediaType: 'video', 
                  imageUrl: reel.thumbnailUrl || reel.imageUrl
                })}
                className="group relative rounded-2xl overflow-hidden aspect-[9/16] bg-black border border-[#F5DDE1] shadow-md cursor-pointer hover:shadow-xl transition-all"
              >
                <img
                  src={reel.thumbnailUrl || reel.imageUrl}
                  alt={reel.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />

              {/* Play Badge */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white border border-white/50 group-hover:scale-110 transition-transform">
                  <span className="text-xl ml-0.5">▶</span>
                </div>
              </div>

              {/* Reel Info */}
              <div className="absolute bottom-0 inset-x-0 p-3.5 text-white space-y-1">
                <span className="text-[10px] bg-[#B85C72] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  {reel.category}
                </span>
                <h4 className="font-serif text-xs font-bold line-clamp-1 text-white">
                  {reel.title}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-white/80 font-sans pt-1">
                  <span>👀 {reel.viewCount || '15k+ views'}</span>
                  <span>❤️ {reel.likes || 420}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Button: View All Reels */}
        <div className="text-center pt-2">
          <button
            onClick={() => navigate('reels')}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-[#FFF0F2] text-[#B85C72] border border-[#F5DDE1] rounded-full text-xs font-bold font-sans tracking-wide transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <span>View All Reels &rarr;</span>
          </button>
        </div>
      </section>
      )}

      {/* ========================================================================= */}
      {/* 10. REVIEWS */}
      {/* ========================================================================= */}
      <section id="client-reviews-preview" className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <span className="text-xs uppercase tracking-[0.2em] text-[#B85C72] font-extrabold font-sans block">
            SWEET WORDS
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#3B0F19]">
            Loved by Our Clients ❤️
          </h2>
          <div className="w-12 h-0.5 bg-[#B85C72] mx-auto opacity-40 rounded-full" />
          <p className="text-xs sm:text-sm text-[#3B0F19]/70 font-sans">
            Rated 4.9/5 from 120+ verified brides and modern ladies.
          </p>
        </div>

        {/* 3 Reviews Maximum */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              text: "“Loved my bridal look! The entire team was so friendly, professional, and took incredible care of my traditional saree pleating, mukut placement and Chandan art.”",
              author: "Priyanka Sharma",
              event: "Bridal Makeup Client",
              rating: 5,
            },
            {
              text: "“Hands down the best facial skin polish I’ve ever had! The women-only space is extremely comforting, peaceful and hygienic. Highly recommend!”",
              author: "Ritu Banerjee",
              event: "Glow Facial Regular",
              rating: 5,
            },
            {
              text: "“Got beautiful nail extensions and festive party makeup done for my cousin’s wedding. Everyone at the event complimented the clean work!”",
              author: "Ananya Deshmukh",
              event: "Party Makeup Client",
              rating: 5,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#FFF0F2]/40 border border-[#F5DDE1] p-6 rounded-2xl space-y-4 shadow-xs flex flex-col justify-between"
            >
              <p className="text-[#3B0F19]/80 text-xs sm:text-sm leading-relaxed font-sans italic">
                {item.text}
              </p>
              <div className="flex items-center justify-between border-t border-[#F5DDE1]/50 pt-3">
                <div>
                  <h4 className="font-serif text-xs sm:text-sm font-bold text-[#3B0F19]">{item.author}</h4>
                  <span className="text-[10px] text-[#B85C72] uppercase font-sans font-bold block mt-0.5">{item.event}</span>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: item.rating }).map((_, rIdx) => (
                    <Star key={rIdx} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Button: Read All Reviews */}
        <div className="text-center pt-2">
          <button
            onClick={() => navigate('reviews')}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-[#FFF0F2] text-[#B85C72] border border-[#F5DDE1] rounded-full text-xs font-bold font-sans tracking-wide transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <span>Read All Reviews &rarr;</span>
          </button>
        </div>
      </section>

      {/* FLOATING WHATSAPP BUTTON (DESKTOP & TABLET ONLY) */}
      <a
        href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hi%20Glow%20and%20Grace!%20I\'d%20like%20to%20inquire%20about%20your%20beauty%20services%20and%20booking.`}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:flex fixed bottom-8 right-6 z-40 bg-[#059669] hover:bg-[#047857] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 items-center gap-2.5 group cursor-pointer border-2 border-white/80"
        title="Chat with Glow & Grace on WhatsApp"
      >
        <span className="text-xl">💬</span>
        <span className="font-sans text-xs font-bold tracking-wide pr-1">
          WhatsApp Us
        </span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#D4AF37] rounded-full animate-ping pointer-events-none" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#D4AF37] rounded-full border border-white" />
      </a>

    </div>
  );
};


// ==========================================
// 2. ABOUT VIEW
// ==========================================
export const AboutView: React.FC<CustomerViewsProps> = ({ navigate }) => {
  return (
    <div className="py-12 space-y-12">
      {/* Editorial Split layout */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Interior image */}
        <div className="lg:col-span-6 relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-stone-100">
          <img 
            src="https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800&auto=format&fit=crop&q=80" 
            alt="Warm elegant Glow & Grace ladies parlour interiors" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#24191B]/10" />
        </div>

        {/* Right content details */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#B85C72] font-semibold block">
              More Than a Salon.
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#24191B] tracking-tight">
              Your Premium Parlour Space.
            </h2>
            <p className="text-sm md:text-base text-[#24191B]/70 leading-relaxed font-sans">
              Beauty is not just about how you look on the outside. It is fundamentally about the confidence and elegance you feel on the inside. Our dedicated parlour space is designed to provide a relaxing, completely private, and customized beauty experience for every woman.
            </p>
            <p className="text-xs text-[#24191B]/60 leading-relaxed font-sans">
              Whether you are preparing for your royal wedding day, getting dolled up for a family celebration, or enjoying a nourishing facial cleanup, we cater to all your requirements using premium cosmetics and sterilized equipment.
            </p>
          </div>

          {/* Stats metrics block */}
          <div className="grid grid-cols-2 gap-4 border-t border-[#F5DDE1] pt-8">
            {[
              { value: '500+ Clients', label: 'Satisfied Brides & Guests' },
              { value: '5+ Years', label: 'In Professional Beauty' },
              { value: '10+ Services', label: 'Curated Custom Menus' },
              { value: '100% Care', label: 'Personal Hygiene Focus' }
            ].map((stat, i) => (
              <div key={i} className="p-4 bg-white border border-[#F5DDE1] rounded-2xl">
                <span className="font-serif text-lg md:text-xl font-bold text-[#B85C72] block">
                  {stat.value}
                </span>
                <span className="text-[10px] text-[#24191B]/50 block uppercase tracking-wider font-semibold font-sans">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          <Button variant="primary" onClick={() => navigate('services')}>
            Discover Our Story
          </Button>
        </div>
      </section>
    </div>
  );
};


// ==========================================
// 3. SERVICES MENU VIEW
// ==========================================
export const ServicesView: React.FC<CustomerViewsProps> = ({ navigate }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    setServices(MockDB.getServices().filter(s => s.status === 'Active'));
  }, []);

  const categories = ['All', 'Makeup', 'Hair', 'Skin & Facial', 'Grooming', 'Bridal Services'];

  const filteredServices = services.filter(s => {
    if (activeCategory === 'All') return true;
    return s.category.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div className="py-12 max-w-7xl mx-auto px-6 space-y-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-[0.2em] text-[#B85C72] font-semibold font-sans block mb-3">
          Our Curated Menu
        </span>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#24191B] mb-4">
          Beauty, Your Way.
        </h2>
        <p className="text-sm text-[#24191B]/60 leading-relaxed font-sans">
          Select from our hand-picked treatments designed to accentuate your natural charm.
        </p>
      </div>

      {/* Tabs Filter */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-[#F5DDE1] pb-6">
        {categories.map(cat => {
          const getEmoji = (name: string) => {
            switch (name.toLowerCase()) {
              case 'makeup': return '💄';
              case 'hair': return '💇‍♀️';
              case 'skin & facial': return '🌸';
              case 'grooming': return '✨';
              case 'bridal services': return '👰';
              default: return '✨';
            }
          };
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                activeCategory === cat
                  ? 'bg-[#B85C72] text-white shadow-md'
                  : 'text-[#24191B]/70 bg-[#FFF9F7] border border-[#F5DDE1] hover:text-[#B85C72] hover:bg-[#FFF5F5]/40'
              }`}
            >
              {cat !== 'All' && <span>{getEmoji(cat)}</span>}
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          {filteredServices.map(s => (
            <ServiceCard
              key={s.id}
              service={s}
              onViewDetails={(slug) => navigate(`services/${slug}`)}
              onBook={() => navigate(`booking?service=${s.slug || s.id}`)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No services found"
          message="We are currently revising this section. Check out our traditional Bridal Makeup packages instead."
          actionText="View Packages"
          onAction={() => navigate('packages')}
        />
      )}
    </div>
  );
};


// ==========================================
// 4. SERVICE DETAILS VIEW
// ==========================================
export const ServiceDetailsView: React.FC<CustomerViewsProps> = ({ params, navigate }) => {
  const [service, setService] = useState<Service | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const matched = MockDB.getServices().find(s => s.slug === params.slug);
    setService(matched || null);
  }, [params.slug]);

  const handleShare = async () => {
    if (!service) return;
    const shareUrl = window.location.href;
    const shareTitle = `${service.name} - Glow & Grace Sanctuary`;
    const shareText = `Discover the luxurious ${service.name} treatment at Glow & Grace! Duration: ${service.duration} mins, starting at only ₹${service.startingPrice}.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error invoking native share API:', err);
          setShowShareModal(true);
        }
      }
    } else {
      setShowShareModal(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!service) {
    return <LoadingState message="Fetching treatment secrets..." />;
  }

  return (
    <div className="py-12 max-w-5xl mx-auto px-6 space-y-12">
      <button
        onClick={() => navigate('services')}
        className="inline-flex items-center gap-2 text-xs text-[#24191B]/60 hover:text-[#B85C72] font-semibold tracking-wider uppercase cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Menu
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white border border-[#F5DDE1] p-6 md:p-10 rounded-3xl shadow-sm">
        {/* Left Side media */}
        <div className="md:col-span-5 aspect-[3/4] rounded-2xl overflow-hidden bg-rose-50 shadow-md">
          <img
            src={service.image || service.imageUrl || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80'}
            alt={service.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side Info */}
        <div className="md:col-span-7 space-y-6">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#B85C72] font-bold block mb-1">
              Category: {service.category}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-[#24191B]">
              {service.name}
            </h2>
          </div>

          <div className="flex gap-6 items-center border-y border-[#F5DDE1]/50 py-4">
            <div>
              <span className="text-[9px] text-[#24191B]/50 uppercase tracking-widest block font-sans">
                Price starts at
              </span>
              <span className="text-2xl font-serif font-black text-[#B85C72]">
                ₹{service.startingPrice.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="h-8 w-px bg-[#F5DDE1]" />

            <div>
              <span className="text-[9px] text-[#24191B]/50 uppercase tracking-widest block font-sans">
                Treatment Duration
              </span>
              <span className="text-base font-serif font-bold text-[#24191B] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#B85C72]" />
                {service.duration} minutes
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-base font-bold text-[#24191B]">Treatment Overview</h3>
            <p className="text-[#24191B]/70 text-sm leading-relaxed font-sans">
              {service.description}
            </p>
          </div>

          <div className="bg-[#FFF9F7] p-5 rounded-2xl border border-[#F5DDE1] space-y-2">
            <span className="text-[9px] font-sans text-[#D4A373] uppercase tracking-widest font-bold block">
              Glow & Grace Promise
            </span>
            <p className="text-xs text-[#24191B]/70 font-sans leading-relaxed">
              We exclusively apply top-tier international beauty products. Prior to every bridal slot, a custom dermo-analysis check is included to guarantee makeup tones suit your skin barrier flawlessly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="primary" size="lg" className="flex-1" onClick={() => navigate(`booking?service=${service.slug || service.id}`)}>
              Book Appointment
            </Button>
            <Button variant="outline" size="lg" className="flex-1" onClick={() => navigate('contact')}>
              Inquire
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="flex-1 flex items-center justify-center gap-2"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 text-[#B85C72]" />
              Share Treatment
            </Button>
          </div>
        </div>
      </div>

      {/* CUSTOM SHARE MODAL */}
      {showShareModal && (
        <Modal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          title="Share Luxury Treatment"
        >
          <div className="space-y-5">
            <p className="text-xs text-stone-500 leading-relaxed">
              Spread the elegance! Share <strong>{service.name}</strong> with friends or family via your favorite platforms:
            </p>

            <div className="grid grid-cols-3 gap-3">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `Check out this luxurious ${service.name} treatment at Glow & Grace! Starts at ₹${service.startingPrice}. ${window.location.href}`
                )}`}
                target="_blank"
                rel="noreferrer noopener"
                className="flex flex-col items-center justify-center p-3 border border-stone-200 hover:border-[#D4A373] bg-[#FFF9F7]/40 rounded-2xl hover:bg-[#FFF9F7]/80 transition-colors group text-center"
              >
                <span className="text-xl mb-1 block">💬</span>
                <span className="text-[10px] font-bold text-stone-700 block">WhatsApp</span>
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  `Looking for a premium beauty treatment? I highly recommend ${service.name} at Glow & Grace!`
                )}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noreferrer noopener"
                className="flex flex-col items-center justify-center p-3 border border-stone-200 hover:border-[#D4A373] bg-[#FFF9F7]/40 rounded-2xl hover:bg-[#FFF9F7]/80 transition-colors group text-center"
              >
                <span className="text-xl mb-1 block">🐦</span>
                <span className="text-[10px] font-bold text-stone-700 block">Twitter / X</span>
              </a>

              <a
                href={`mailto:?subject=${encodeURIComponent(
                  `Glow & Grace Treatment Recommendation: ${service.name}`
                )}&body=${encodeURIComponent(
                  `Hi,\n\nI wanted to share this luxurious beauty treatment with you:\n\n${service.name}\n${service.description}\n\nCheck it out here: ${window.location.href}`
                )}`}
                className="flex flex-col items-center justify-center p-3 border border-stone-200 hover:border-[#D4A373] bg-[#FFF9F7]/40 rounded-2xl hover:bg-[#FFF9F7]/80 transition-colors group text-center"
              >
                <span className="text-xl mb-1 block">✉️</span>
                <span className="text-[10px] font-bold text-stone-700 block">Email</span>
              </a>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-stone-100">
              <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest">Copy Shared Link</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={window.location.href}
                  className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl px-3 py-2 text-xs text-stone-600 outline-none select-all"
                />
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-[#B85C72] hover:bg-[#a04e61] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};


// ==========================================
// 5. PACKAGES VIEW
// ==========================================
export const PackagesView: React.FC<CustomerViewsProps> = ({ navigate }) => {
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    setPackages(MockDB.getPackages().filter(p => p.status === 'Active'));
  }, []);

  return (
    <div className="py-12 max-w-7xl mx-auto px-6 space-y-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-[0.2em] text-[#B85C72] font-semibold font-sans block mb-3">
          Our Special Packages
        </span>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#24191B] mb-4">
          Curated Pricing
        </h2>
        <p className="text-sm text-[#24191B]/60 leading-relaxed font-sans">
          Select an comprehensive combination package designed around specific event durations. All prices are fully comprehensive.
        </p>
      </div>

      {/* Grid of pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {packages.map(p => (
          <PackageCard key={p.id} pkg={p} onBook={() => navigate(`booking?service=s1&package=${p.id}`)} />
        ))}
      </div>
    </div>
  );
};


// ==========================================
// 6. GALLERY PORTFOLIO VIEW
// ==========================================
export const GalleryView: React.FC<CustomerViewsProps> = ({ navigate, settings }) => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeReel, setActiveReel] = useState<GalleryItem | null>(null);
  const [likesMap, setLikesMap] = useState<Record<string, { count: number; liked: boolean }>>({});

  useEffect(() => {
    const items = MockDB.getGallery();
    setGallery(items);

    const initialLikes: Record<string, { count: number; liked: boolean }> = {};
    items.forEach(item => {
      initialLikes[item.id] = { count: item.likes || Math.floor(Math.random() * 200 + 150), liked: false };
    });
    setLikesMap(initialLikes);
  }, []);

  const handleToggleLike = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    setLikesMap(prev => {
      const current = prev[itemId] || { count: 100, liked: false };
      return {
        ...prev,
        [itemId]: {
          count: current.liked ? current.count - 1 : current.count + 1,
          liked: !current.liked
        }
      };
    });
  };

  const categories = ['All', 'Bridal', 'Makeup', 'Hair', 'Skin & Facial', 'Nails', 'Grooming', 'Reels'];

  const filteredGallery = gallery.filter(item => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Reels') return item.mediaType === 'video';
    return item.category.toLowerCase().includes(activeCategory.toLowerCase());
  });

  return (
    <div className="py-12 max-w-7xl mx-auto px-6 space-y-12">
      {/* Lightbox component */}
      <Lightbox
        images={filteredGallery}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(idx) => setLightboxIndex(idx)}
        onBook={(lookName) => navigate('booking')}
      />

      {/* Reel Modal component */}
      <ReelModal
        reel={activeReel}
        allReels={gallery.filter((item) => item.mediaType === 'video')}
        isOpen={activeReel !== null}
        onClose={() => setActiveReel(null)}
        onBook={(lookName) => navigate('booking')}
      />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFF0F2] rounded-full text-[10px] font-sans font-extrabold tracking-[0.2em] text-[#B85C72] uppercase border border-[#F5DDE1]">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          AUTHENTIC BEAUTY WORK
        </div>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#3B0F19]">
          Bridal & Glamour Portfolio
        </h2>
        <p className="text-sm text-[#3B0F19]/70 leading-relaxed font-sans">
          Behold our genuine customer transformations, festive saree drapings, and salon hair therapies. Every look is crafted with love and genuine international cosmetics.
        </p>
      </div>

      {/* Tabs filter */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-[#F5DDE1] pb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setLightboxIndex(null);
            }}
            className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer ${
              activeCategory === cat
                ? 'bg-[#3B0F19] text-white shadow-md'
                : 'text-[#3B0F19]/70 bg-[#FFF9F7] border border-[#F5DDE1] hover:text-[#B85C72]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry / Grid layout */}
      {filteredGallery.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-fade-in">
          {filteredGallery.map((item, index) => {
            const isVideo = item.mediaType === 'video';
            const likeInfo = likesMap[item.id] || { count: item.likes || 150, liked: false };

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isVideo) {
                    setActiveReel(item);
                  } else {
                    setLightboxIndex(index);
                  }
                }}
                className="group relative rounded-2xl overflow-hidden bg-stone-100 border border-[#F5DDE1] shadow-xs hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col justify-end aspect-square"
              >
                <img
                  src={item.imageUrl}
                  alt={item.alt || item.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Dark Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="bg-black/50 backdrop-blur-md text-white text-[9px] font-sans font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/20">
                    {item.category}
                  </span>

                  {isVideo ? (
                    <span className="bg-[#B85C72] text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                      ▶ Reel
                    </span>
                  ) : (
                    <button
                      onClick={(e) => handleToggleLike(e, item.id)}
                      className={`p-1.5 rounded-full backdrop-blur-md transition-transform active:scale-125 ${
                        likeInfo.liked ? 'bg-rose-600 text-white' : 'bg-black/40 text-white hover:bg-black/60'
                      }`}
                      title="Like this look"
                    >
                      <Heart className={`w-3.5 h-3.5 ${likeInfo.liked ? 'fill-white' : ''}`} />
                    </button>
                  )}
                </div>

                {/* Bottom details */}
                <div className="relative z-10 p-3.5 space-y-1 text-white">
                  <h4 className="font-serif font-bold text-xs sm:text-sm leading-tight line-clamp-1 group-hover:text-[#E5C494] transition-colors">
                    {item.title}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-white/80 font-sans">
                    <span className="line-clamp-1">{item.description}</span>
                    <span className="shrink-0 ml-2 font-semibold text-rose-300">
                      ❤️ {likeInfo.count}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No shots uploaded yet"
          message="We are currently organizing photo sessions for this segment. Browse our other categories in the meantime."
          actionText="View All Shots"
          onAction={() => setActiveCategory('All')}
        />
      )}

      {/* Bottom Instagram CTA Banner */}
      <div className="bg-[#FFF0F2] border border-[#F5DDE1] rounded-3xl p-8 text-center space-y-4 max-w-2xl mx-auto">
        <h3 className="font-serif text-xl font-bold text-[#3B0F19]">Love what you see?</h3>
        <p className="text-xs text-[#3B0F19]/70 font-sans max-w-md mx-auto">
          We post daily transformation reels, client stories, and behind-the-scenes artistry on our Instagram profile.
        </p>
        <div className="flex justify-center gap-3 pt-1">
          <a
            href={settings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-[#3B0F19] hover:bg-[#802339] text-[#FFFDF9] rounded-full text-xs font-bold tracking-wider transition-colors shadow-sm flex items-center gap-2"
          >
            <Instagram className="w-3.5 h-3.5" />
            Follow @glowandgrace
          </a>
          <button
            onClick={() => navigate('booking')}
            className="px-5 py-2.5 bg-[#B85C72] hover:bg-[#802339] text-white rounded-full text-xs font-bold tracking-wider transition-colors shadow-sm"
          >
            Book Your Look
          </button>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 7. ARTISTS PROFILES VIEW
// ==========================================
export const ArtistsView: React.FC<CustomerViewsProps> = ({ navigate }) => {
  const [artists, setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    setArtists(MockDB.getArtists().filter(a => a.status === 'Active'));
  }, []);

  return (
    <div className="py-12 max-w-7xl mx-auto px-6 space-y-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-[0.2em] text-[#B85C72] font-semibold font-sans block mb-3">
          Our Team
        </span>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#24191B] mb-4">
          Meet Our Experts
        </h2>
        <p className="text-sm text-[#24191B]/60 leading-relaxed font-sans">
          A collection of certified aesthetic experts who treat beauty as a precise, delicate visual craft.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {artists.map(a => (
          <ArtistCard key={a.id} artist={a} onViewProfile={(slug) => navigate(`artists/${slug}`)} />
        ))}
      </div>
    </div>
  );
};


// ==========================================
// 8. ARTIST PROFILE DETAILS
// ==========================================
export const ArtistDetailsView: React.FC<CustomerViewsProps> = ({ params, navigate }) => {
  const [artist, setArtist] = useState<Artist | null>(null);

  useEffect(() => {
    const matched = MockDB.getArtists().find(a => a.slug === params.slug);
    setArtist(matched || null);
  }, [params.slug]);

  if (!artist) {
    return <LoadingState message="Summoning our expert profile..." />;
  }

  return (
    <div className="py-12 max-w-4xl mx-auto px-6 space-y-12">
      <button
        onClick={() => navigate('artists')}
        className="inline-flex items-center gap-2 text-xs text-[#24191B]/60 hover:text-[#B85C72] font-semibold tracking-wider uppercase cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Experts
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white border border-[#F5DDE1] p-6 md:p-10 rounded-3xl shadow-sm">
        {/* Profile Image */}
        <div className="md:col-span-5 aspect-[4/5] overflow-hidden rounded-2xl bg-amber-50 relative">
          <img
            src={artist.photoUrl}
            alt={artist.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Details content */}
        <div className="md:col-span-7 space-y-6">
          <div>
            <span className="text-xs font-bold text-[#B85C72] uppercase tracking-widest block mb-1">
              {artist.role}
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#24191B]">{artist.name}</h2>
          </div>

          <div className="flex gap-1 items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(artist.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                }`}
              />
            ))}
            <span className="text-xs text-[#24191B]/60 ml-2 font-semibold">
              ({artist.rating.toFixed(1)} Rating)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 border-y border-[#F5DDE1]/50 py-4">
            <div>
              <span className="text-[10px] text-[#24191B]/50 block uppercase tracking-widest">Experience</span>
              <span className="text-base font-bold font-serif text-[#24191B]">{artist.experience}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#24191B]/50 block uppercase tracking-widest">Specialty</span>
              <span className="text-base font-bold font-serif text-[#B85C72]">{artist.specialty}</span>
            </div>
          </div>

          <p className="text-[#24191B]/70 text-sm leading-relaxed font-sans">
            {artist.bio}
          </p>

          {/* Services Offered */}
          {artist.services && artist.services.length > 0 && (
            <div className="space-y-2.5 border-t border-[#F5DDE1]/50 pt-4">
              <h4 className="text-xs uppercase tracking-widest font-bold text-[#B85C72] font-sans">
                Signature Services & Styling
              </h4>
              <div className="flex flex-wrap gap-2">
                {artist.services.map((svc, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-[#FFF0F2] text-[#B85C72] text-xs font-semibold rounded-full border border-[#F5DDE1]"
                  >
                    ✦ {svc}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#24191B]/80 font-sans">
              Connect socially
            </h4>
            <div className="flex items-center gap-3">
              {artist.socialLinks.instagram && (
                <a
                  href={`https://instagram.com/${artist.socialLinks.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-[#B85C72] hover:underline"
                >
                  <Instagram className="w-4 h-4" />
                  {artist.socialLinks.instagram}
                </a>
              )}
            </div>
          </div>

          <Button variant="primary" className="w-full" onClick={() => navigate(`booking?artist=${artist.slug || artist.id}`)}>
            Book Slot with {artist.name.split(' ')[0]}
          </Button>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 9. CLIENT REVIEWS & ADD FEEDBACK VIEW
// ==========================================
export const ReviewsView: React.FC<CustomerViewsProps> = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState('');
  const [service, setService] = useState('Bridal Makeup');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setReviews(MockDB.getReviews().filter(r => r.status === 'Approved'));
  }, []);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    // Save review using MockDB
    MockDB.saveReview({
      customerName: name,
      profileImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      serviceName: service,
      rating,
      reviewContent: content
    });

    setShowToast(true);
    setName('');
    setContent('');
    setRating(5);
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-6 space-y-12">
      {showToast && (
        <Toast
          message="Your beautiful feedback has been submitted for moderation!"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-[0.2em] text-[#B85C72] font-semibold font-sans block mb-3">
          Testimonials
        </span>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#24191B] mb-4">
          Client Feedback
        </h2>
        <p className="text-sm text-[#24191B]/60 leading-relaxed font-sans">
          Check out our Google reviews score and read verified reviews written directly by clients.
        </p>
      </div>

      {/* Google Reviews rating dashboard card */}
      <div className="bg-white border border-[#F5DDE1] p-6 md:p-8 rounded-3xl max-w-md mx-auto text-center space-y-4 shadow-xs">
        <span className="text-xs uppercase tracking-widest font-bold text-[#24191B]/40">Google Verified</span>
        <div className="flex items-center justify-center gap-2">
          <span className="font-serif text-4xl font-extrabold text-[#24191B]">4.9</span>
          <span className="text-sm font-semibold text-[#24191B]/50 mt-2">/ 5.0</span>
        </div>
        <div className="flex justify-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
          ))}
        </div>
        <p className="text-xs text-[#24191B]/60">Based on 120+ organic client submissions</p>
      </div>

      {/* Grid reviews */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map(r => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </div>

      {/* Post a Review panel */}
      <div className="bg-[#FFF9F7] border border-[#F5DDE1] p-8 md:p-10 rounded-3xl max-w-2xl mx-auto space-y-6 shadow-sm">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#B85C72]">Submit Feedback</span>
          <h3 className="font-serif text-2xl font-bold text-[#24191B]">Add Your Story</h3>
          <p className="text-xs text-[#24191B]/60">Loved your facial or bridal style? We would cherish your feedback.</p>
        </div>

        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label htmlFor="reviewer-name" className="block text-xs font-semibold text-[#24191B]/60 mb-1">Your Name *</label>
            <input
              id="reviewer-name"
              type="text"
              required
              placeholder="e.g. Ananya Sen"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white border border-[#F5DDE1] rounded-xl py-3 px-4 text-sm outline-none focus:ring-4 focus:ring-[#B85C72]/20 text-[#24191B]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="reviewer-service" className="block text-xs font-semibold text-[#24191B]/60 mb-1">Service Enjoyed *</label>
              <select
                id="reviewer-service"
                value={service}
                onChange={e => setService(e.target.value)}
                className="w-full bg-white border border-[#F5DDE1] rounded-xl py-3 px-4 text-sm outline-none cursor-pointer text-[#24191B]"
              >
                {['Bridal Makeup', 'Party Makeup', 'Engagement Makeup', 'Hair Styling', 'Facial & Skincare', 'Manicure & Pedicure'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="reviewer-rating" className="block text-xs font-semibold text-[#24191B]/60 mb-1">Star Rating *</label>
              <select
                id="reviewer-rating"
                value={rating}
                onChange={e => setRating(parseInt(e.target.value))}
                className="w-full bg-white border border-[#F5DDE1] rounded-xl py-3 px-4 text-sm outline-none cursor-pointer text-[#24191B]"
              >
                {[5, 4, 3, 2, 1].map(r => (
                  <option key={r} value={r}>{r} Stars {r === 5 ? '(Perfect!)' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="reviewer-content" className="block text-xs font-semibold text-[#24191B]/60 mb-1">Your Feedback Content *</label>
            <textarea
              id="reviewer-content"
              required
              rows={4}
              placeholder="Tell us about your experience..."
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full bg-white border border-[#F5DDE1] rounded-xl py-3 px-4 text-sm outline-none focus:ring-4 focus:ring-[#B85C72]/20 text-[#24191B]"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full">
            Submit Review for Approval
          </Button>
        </form>
      </div>
    </div>
  );
};


// ==========================================
// 10. BOOKING SCHEDULER VIEW
// ==========================================
export const BookingView: React.FC<CustomerViewsProps> = ({ settings, params }) => {
  const [successBooking, setSuccessBooking] = useState<Appointment | null>(null);
  const [showToast, setShowToast] = useState(false);

  const initialService = params?.service || params?.serviceSlug || params?.slug || '';
  const initialArtist = params?.artist || params?.artistSlug || '';

  const handleSuccess = (booking: Appointment) => {
    setSuccessBooking(booking);
    setShowToast(true);
  };

  return (
    <div className="py-12 max-w-4xl mx-auto px-6 space-y-12 relative">
      {showToast && successBooking && (
        <Toast
          message={`Splendid! Your booking reservation #${successBooking.bookingId} was successfully submitted.`}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      {!successBooking ? (
        <>
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#B85C72] font-semibold font-sans block">
              Appointment Booking
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-[#24191B]">
              Reserve Your Experience
            </h2>
            <p className="text-xs text-[#24191B]/60 leading-relaxed font-sans">
              Enter your details, choose your treatment category, dates, and preferred artist. We will immediately queue your reservation.
            </p>
          </div>
          <BookingForm 
            onSuccess={handleSuccess} 
            initialServiceSlug={initialService}
            initialArtistSlug={initialArtist}
          />
        </>
      ) : (
        <BookingConfirmation
          booking={successBooking}
          onReset={() => setSuccessBooking(null)}
          whatsappNumber={settings.whatsappNumber}
        />
      )}
    </div>
  );
};


// ==========================================
// 11. PRIVACY & TERMS
// ==========================================
export const PrivacyView: React.FC<CustomerViewsProps> = () => {
  return (
    <div className="py-12 max-w-3xl mx-auto px-6 space-y-6">
      <h2 className="font-serif text-3xl font-bold text-[#24191B]">Privacy Policy</h2>
      <p className="text-[#24191B]/70 text-sm leading-relaxed">
        At Glow & Grace, we safeguard customer phone numbers, emails, and address logs strictly for scheduler management. We never trade client records to secondary commercial agencies.
      </p>
    </div>
  );
};

export const TermsView: React.FC<CustomerViewsProps> = () => {
  return (
    <div className="py-12 max-w-3xl mx-auto px-6 space-y-6">
      <h2 className="font-serif text-3xl font-bold text-[#24191B]">Terms of Service</h2>
      <p className="text-[#24191B]/70 text-sm leading-relaxed">
        Appointments reserved at Glow & Grace remain tentative until confirmed via WhatsApp. To cancel or postpone slots, kindly notify the front desk at least 4 hours ahead.
      </p>
    </div>
  );
};
