import React from 'react';
import { Home, Sparkles, Calendar, MessageCircle } from 'lucide-react';
import { WebsiteSettings } from '../types';

interface StickyMobileActionBarProps {
  currentPath: string;
  navigate: (path: string) => void;
  settings: WebsiteSettings;
}

export const StickyMobileActionBar: React.FC<StickyMobileActionBarProps> = ({
  currentPath,
  navigate,
  settings,
}) => {
  const isHome = currentPath === 'home' || currentPath === '';
  const isServices = currentPath === 'services' || currentPath.startsWith('services/');
  const isBooking = currentPath === 'booking';

  const cleanWhatsAppNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <nav
      id="mobile-sticky-action-bar"
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#F5DDE1] px-3 py-1.5 shadow-[0_-4px_25px_rgba(59,15,25,0.08)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <button
          onClick={() => navigate('home')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            isHome
              ? 'text-[#B85C72] font-bold'
              : 'text-[#3B0F19]/60 hover:text-[#B85C72]'
          }`}
        >
          <Home className={`w-5 h-5 ${isHome ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-wide mt-0.5 font-sans">Home</span>
        </button>

        {/* Services */}
        <button
          onClick={() => navigate('services')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            isServices
              ? 'text-[#B85C72] font-bold'
              : 'text-[#3B0F19]/60 hover:text-[#B85C72]'
          }`}
        >
          <Sparkles className={`w-5 h-5 ${isServices ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-wide mt-0.5 font-sans">Services</span>
        </button>

        {/* Book (Emphasized Action) */}
        <button
          onClick={() => navigate('booking')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            isBooking
              ? 'text-[#B85C72] font-bold'
              : 'text-[#3B0F19] hover:text-[#B85C72]'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-[#B85C72] text-white flex items-center justify-center shadow-md">
            <Calendar className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold tracking-wide mt-0.5 font-sans text-[#B85C72]">
            Book
          </span>
        </button>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${cleanWhatsAppNumber}?text=Hi%20Glow%20and%20Grace!%20I\'d%20like%20to%20inquire%20about%20your%20services%20and%20prices.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-emerald-600 hover:text-emerald-700 transition-all cursor-pointer"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5 stroke-[2.2]" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
          <span className="text-[10px] font-bold tracking-wide mt-0.5 font-sans">
            WhatsApp
          </span>
        </a>
      </div>
    </nav>
  );
};
