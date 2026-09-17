import React from 'react';
import { Sparkles, Instagram, Facebook, Phone, Mail, MapPin } from 'lucide-react';
import { WebsiteSettings } from '../types';

interface FooterProps {
  settings: WebsiteSettings;
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, navigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="main-footer" className="bg-[#24191B] text-[#FFF9F7] pt-16 pb-24 lg:pb-16 border-t border-[#FFF9F7]/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand info */}
          <div className="space-y-6">
            <button
              onClick={() => navigate('home')}
              className="flex items-center gap-2 text-left cursor-pointer focus:outline-none"
            >
              <Sparkles className="w-6 h-6 text-[#D4A373]" />
              <div>
                <span className="font-serif text-2xl font-bold tracking-wider text-[#FFF9F7] block">
                  Glow & Grace
                </span>
                <span className="text-[9px] font-sans tracking-[0.2em] text-[#D4A373] block uppercase">
                  Ladies Beauty Parlour & Salon
                </span>
              </div>
            </button>
            <p className="text-[#FFF9F7]/70 text-sm font-sans leading-relaxed">
              Step into a world of beauty, care and confidence. We believe beauty begins the moment you decide to be yourself.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#FFF9F7]/20 flex items-center justify-center text-[#FFF9F7]/80 hover:text-[#D4A373] hover:border-[#D4A373] transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-[#FFF9F7]/20 flex items-center justify-center text-[#FFF9F7]/80 hover:text-[#D4A373] hover:border-[#D4A373] transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-serif text-lg text-[#D4A373] mb-6 tracking-wide">Quick Exploration</h3>
            <ul className="space-y-3">
              {[
                { name: 'About Glow & Grace', path: 'about' },
                { name: 'Our Signature Services', path: 'services' },
                { name: 'Exclusive Packages', path: 'packages' },
                { name: 'Bridal Portfolio Gallery', path: 'gallery' },
                { name: 'Meet Our Experts', path: 'artists' },
                { name: 'Client Testimonials', path: 'reviews' },
              ].map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-[#FFF9F7]/70 hover:text-[#D4A373] text-sm font-sans transition-colors duration-300 cursor-pointer text-left focus:outline-none"
                  >
                    &middot; {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact details */}
          <div>
            <h3 className="font-serif text-lg text-[#D4A373] mb-6 tracking-wide">Our Parlour</h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-[#FFF9F7]/70 leading-relaxed font-sans">
                <MapPin className="w-5 h-5 text-[#D4A373] shrink-0 mt-0.5" />
                <span>{settings.salonAddress}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-[#FFF9F7]/70 font-sans">
                <Phone className="w-4 h-4 text-[#D4A373] shrink-0" />
                <a href={`tel:${settings.phoneNumber}`} className="hover:text-[#D4A373] transition-colors">
                  {settings.phoneNumber}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-[#FFF9F7]/70 font-sans">
                <Mail className="w-4 h-4 text-[#D4A373] shrink-0" />
                <a href={`mailto:${settings.emailAddress}`} className="hover:text-[#D4A373] transition-colors break-all">
                  {settings.emailAddress}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Opening Hours */}
          <div>
            <h3 className="font-serif text-lg text-[#D4A373] mb-6 tracking-wide">Timings</h3>
            <p className="text-[#FFF9F7]/70 text-sm font-sans leading-relaxed mb-4">
              We welcome walk-ins, but strongly advise reserving slots beforehand, especially for bridal appointments.
            </p>
            <div className="bg-[#FFF9F7]/5 p-4 rounded-xl border border-[#FFF9F7]/10">
              <span className="text-[10px] text-[#D4A373] uppercase tracking-widest block font-sans font-semibold mb-1">
                Business Hours
              </span>
              <p className="text-[#FFF9F7]/90 text-sm font-serif font-medium">
                {settings.openingHours}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#FFF9F7]/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#FFF9F7]/50 text-xs font-sans text-center md:text-left">
            &copy; {currentYear} Glow & Grace Ladies Beauty Parlour & Salon. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('privacy')}
              className="text-[#FFF9F7]/50 hover:text-[#D4A373] text-xs font-sans transition-colors cursor-pointer focus:outline-none"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate('terms')}
              className="text-[#FFF9F7]/50 hover:text-[#D4A373] text-xs font-sans transition-colors cursor-pointer focus:outline-none"
            >
              Terms of Service
            </button>
            <button
              onClick={() => navigate('admin/login')}
              className="text-[#FFF9F7]/40 hover:text-[#D4A373] text-xs font-sans transition-colors cursor-pointer focus:outline-none"
            >
              Admin Area
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
