import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar, Sparkles, ShieldAlert } from 'lucide-react';
import { Button } from './Common';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  bookingCount?: number; // optionally badge count for admin
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      setIsAdminLoggedIn(sessionStorage.getItem('gg_admin_token') === 'authorized');
    };
    checkAuth();
    window.addEventListener('gg_db_update', checkAuth);
    return () => window.removeEventListener('gg_db_update', checkAuth);
  }, [currentPath]);

  const navLinks = [
    { name: 'Home', path: 'home' },
    { name: 'About', path: 'about' },
    { name: 'Services', path: 'services' },
    { name: 'Packages', path: 'packages' },
    { name: 'Gallery', path: 'gallery' },
    { name: 'Our Artists', path: 'artists' },
    { name: 'Reviews', path: 'reviews' },
    { name: 'Contact', path: 'contact' },
  ];

  const handleLinkClick = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const isActive = (path: string) => {
    if (currentPath === 'home' && path === 'home') return true;
    return currentPath === path;
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-[#FFFFFF]/95 backdrop-blur-md shadow-sm border-b border-[#F5DDE1]/50 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
          >
            <Sparkles className="w-6 h-6 text-[#B85C72] transition-transform duration-500 group-hover:rotate-12" />
            <div>
              <span className="font-serif text-xl font-bold tracking-wider text-[#24191B] block">
                Glow & Grace
              </span>
              <span className="text-[9px] font-sans tracking-[0.2em] text-[#B85C72] block uppercase">
                Ladies Parlour & Salon
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`text-sm tracking-wide font-sans cursor-pointer transition-colors duration-300 relative py-1 ${
                  isActive(link.path)
                    ? 'text-[#B85C72] font-semibold'
                    : 'text-[#24191B]/80 hover:text-[#B85C72]'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#B85C72] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => navigate('admin/login')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-semibold transition-colors border ${
                isAdminLoggedIn
                  ? 'bg-emerald-950/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-950/25'
                  : 'text-[#24191B]/60 hover:text-[#B85C72] border-transparent hover:border-[#B85C72]/20 hover:bg-[#B85C72]/5'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              {isAdminLoggedIn ? 'Dashboard' : 'Admin'}
            </button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('booking')}
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Book Appointment
            </Button>
          </div>

          {/* Mobile Hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-[#24191B] hover:text-[#B85C72] p-1 cursor-pointer focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-30 lg:hidden transition-all duration-500 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />
        {/* Drawer panel */}
        <div
          className={`absolute top-0 right-0 h-full w-[280px] bg-[#FFF9F7] shadow-2xl p-8 flex flex-col justify-between border-l border-[#F5DDE1] transition-transform duration-500 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="mt-16 flex flex-col gap-5">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`text-lg font-serif tracking-wide text-left py-2 border-b border-[#F5DDE1]/40 ${
                  isActive(link.path) ? 'text-[#B85C72] font-semibold' : 'text-[#24191B]/80'
                }`}
              >
                {link.name}
              </button>
            ))}

            <button
              onClick={() => handleLinkClick('admin/login')}
              className={`text-lg font-serif tracking-wide text-left py-2 border-b border-[#F5DDE1]/40 flex items-center gap-2 ${
                isAdminLoggedIn ? 'text-emerald-600 font-semibold' : 'text-[#24191B]/80'
              }`}
            >
              <ShieldAlert className="w-5 h-5 shrink-0 text-amber-500" />
              {isAdminLoggedIn ? 'Admin Dashboard' : 'Admin Panel Login'}
            </button>
          </div>

          <div>
            <Button
              variant="primary"
              size="md"
              onClick={() => handleLinkClick('booking')}
              className="w-full flex items-center justify-center gap-2 mb-6"
            >
              <Calendar className="w-4 h-4" />
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
