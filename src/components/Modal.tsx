import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, Sparkles } from 'lucide-react';
import { GalleryItem } from '../types';
import { BeautyReelsViewer } from './BeautyReelsViewer';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-[#24191B]/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Dialog container */}
      <div className="relative bg-[#FFF9F7] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-[#F5DDE1] animate-scale-up z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F5DDE1] shrink-0">
          <h3 className="font-serif text-lg font-bold text-[#24191B]">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#24191B]/50 hover:text-[#B85C72] hover:bg-[#F5DDE1]/30 transition-colors cursor-pointer focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-grow">{children}</div>
      </div>
    </div>
  );
};

// Lightbox for Gallery Image Viewer
interface LightboxProps {
  images: GalleryItem[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onBook?: (serviceName?: string) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  onClose,
  onNavigate,
  onBook
}) => {
  useEffect(() => {
    if (currentIndex !== null) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + images.length) % images.length);
        if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % images.length);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [currentIndex, images.length, onClose, onNavigate]);

  if (currentIndex === null || !images[currentIndex]) return null;

  const activeImage = images[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    onNavigate(prevIndex);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIndex = (currentIndex + 1) % images.length;
    onNavigate(nextIndex);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#1F080E]/95 backdrop-blur-md text-white p-4">
      {/* Backdrop click close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Header controls */}
      <div className="relative z-10 flex items-center justify-between p-4 max-w-7xl mx-auto w-full">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] block font-sans font-bold">
              Glow & Grace Portfolio
            </span>
            <span className="text-xs text-white/50 font-sans">
              ({currentIndex + 1} of {images.length})
            </span>
          </div>
          <h4 className="font-serif text-lg md:text-xl font-bold text-white mt-0.5">{activeImage.title}</h4>
        </div>
        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer focus:outline-none"
          aria-label="Close viewer"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main viewer block */}
      <div className="relative z-10 flex items-center justify-between max-w-6xl mx-auto w-full flex-grow my-2">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="p-3.5 rounded-full bg-black/50 border border-white/20 text-white hover:bg-black/80 hover:scale-105 transition-all cursor-pointer shrink-0 mr-4 focus:outline-none"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Dynamic Image */}
        <div className="relative flex items-center justify-center max-h-[65vh] md:max-h-[70vh] w-full overflow-hidden rounded-2xl">
          <img
            src={activeImage.imageUrl}
            alt={activeImage.alt}
            className="object-contain max-h-[65vh] md:max-h-[70vh] rounded-2xl shadow-2xl animate-fade-in"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="p-3.5 rounded-full bg-black/50 border border-white/20 text-white hover:bg-black/80 hover:scale-105 transition-all cursor-pointer shrink-0 ml-4 focus:outline-none"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Footer Details */}
      <div className="relative z-10 p-4 max-w-2xl mx-auto w-full text-center mb-2 space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="bg-[#B85C72]/30 text-xs px-3.5 py-1 rounded-full text-[#FAD2E1] font-semibold font-sans uppercase tracking-widest border border-[#B85C72]/40">
            {activeImage.category}
          </span>
          {activeImage.likes && (
            <span className="text-xs text-rose-300 font-sans flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              ❤️ {activeImage.likes} Likes
            </span>
          )}
        </div>
        
        <p className="text-white/80 text-sm font-sans leading-relaxed">{activeImage.description}</p>
        
        {onBook && (
          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onBook(activeImage.category === 'Bridal' ? 'Bridal Makeup' : activeImage.title);
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#B85C72] hover:bg-[#802339] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-xl hover:scale-102 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              Book This Look / Service
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Vertical Reel Player Modal (9:16 aspect ratio viewer)
interface ReelModalProps {
  reel: GalleryItem | null;
  allReels?: GalleryItem[];
  isOpen: boolean;
  onClose: () => void;
  onBook?: (lookName: string) => void;
}

export const ReelModal: React.FC<ReelModalProps> = ({ reel, allReels, isOpen, onClose, onBook }) => {
  if (!isOpen || !reel) return null;

  const reelList = allReels && allReels.length > 0 ? allReels : [reel];
  const initialIndex = allReels ? Math.max(0, allReels.findIndex((r) => r.id === reel.id)) : 0;

  return (
    <BeautyReelsViewer
      reels={reelList}
      initialIndex={initialIndex >= 0 ? initialIndex : 0}
      isOpen={isOpen}
      isInline={false}
      onClose={onClose}
      onBook={onBook}
    />
  );
};
