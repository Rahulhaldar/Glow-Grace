import React, { useState } from 'react';
import { Play, Eye, Heart, Sparkles, Smartphone, Grid, Maximize2, Flame } from 'lucide-react';
import { GalleryItem } from '../types';
import { BeautyReelsViewer } from './BeautyReelsViewer';

interface ReelGalleryProps {
  reels: GalleryItem[];
  onBook?: (lookName: string) => void;
}

export const ReelGallery: React.FC<ReelGalleryProps> = ({ reels, onBook }) => {
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'player' | 'grid'>('player');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // If no reels provided or empty, fallback to authentic beauty reels dataset
  const fallbackReels: GalleryItem[] = [
    {
      id: 'reel-1',
      title: 'Royal Bengali Bride Transformation ✨',
      category: 'Bridal',
      imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-traditional-indian-dress-41588-large.mp4',
      alt: 'Royal Bengali Bride video reel',
      description: 'Chandan forehead art & Mukut placement process. Pure traditional magic for bride Ananya!',
      mediaType: 'video',
      aspectRatio: 'reel',
      likes: 1240,
      viewCount: '28.4K',
      duration: '0:45',
      soundTitle: 'Glow & Grace • Traditional Shehnai & Sitar Mix (Original Audio)',
      beforeImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
      tags: ['#BengaliBride', '#BridalGlow', '#ChandanArt', '#AgartalaSalon'],
      startingPrice: 7999,
      isFeatured: true,
      createdAt: '2026-09-19',
      thumbnailUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&auto=format&fit=crop&q=80',
      comments: [
        { id: 'c1', user: 'priya_roy', text: 'The Chandan design on her forehead is pure art! ❤️', time: '2h ago' },
        { id: 'c2', user: 'sneha_bose', text: 'Booked my December wedding with Rajeshwari di! 👰', time: '5h ago' }
      ]
    },
    {
      id: 'reel-2',
      title: 'HD Airbrush Makeup Glow Process 💄',
      category: 'Makeup',
      imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-model-posing-for-a-fashion-shoot-41793-large.mp4',
      alt: 'Airbrush base step by step reel',
      description: 'Zero cakeyness, flawless texture blending with international cosmetics.',
      mediaType: 'video',
      aspectRatio: 'reel',
      likes: 890,
      viewCount: '19.2K',
      duration: '0:32',
      soundTitle: 'MUA Lounge • Chill Lo-Fi Beats & Flute',
      beforeImageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
      tags: ['#AirbrushMakeup', '#FlawlessBase', '#PartyGlam'],
      startingPrice: 2499,
      isFeatured: true,
      createdAt: '2026-09-20',
      thumbnailUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'reel-3',
      title: 'Floral Gajra Bun & Updo Art 🌸',
      category: 'Hair',
      imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-smiling-with-her-hair-blowing-in-the-wind-41589-large.mp4',
      alt: 'Floral hairstyle reel',
      description: 'Intricate bridal low bun with fresh fragrant jasmine garlands and handcrafted pearl pins.',
      mediaType: 'video',
      aspectRatio: 'reel',
      likes: 1560,
      viewCount: '34.1K',
      duration: '0:50',
      soundTitle: 'Kesariya Acoustic Sitar Instrumental',
      beforeImageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&auto=format&fit=crop&q=80',
      tags: ['#BridalHair', '#FloralGajra', '#WeddingUpdo'],
      startingPrice: 1299,
      isFeatured: true,
      createdAt: '2026-09-21',
      thumbnailUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'reel-4',
      title: 'Banarasi Saree Draping Masterclass 🥻',
      category: 'Draping',
      imageUrl: 'https://images.unsplash.com/photo-1615396899839-c99c121888b0?w=800&auto=format&fit=crop&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-indian-bride-dressed-in-traditional-clothes-41584-large.mp4',
      alt: 'Saree pleating video reel',
      description: 'Sharp pleats, comfortable pinning and zero-slip pallu arrangement.',
      mediaType: 'video',
      aspectRatio: 'reel',
      likes: 975,
      viewCount: '22.8K',
      duration: '0:38',
      soundTitle: 'Traditional Draping Rhythms • Glow & Grace',
      beforeImageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
      tags: ['#SareeDraping', '#BanarasiSilk', '#WeddingReady'],
      startingPrice: 599,
      isFeatured: true,
      createdAt: '2026-09-22',
      thumbnailUrl: 'https://images.unsplash.com/photo-1615396899839-c99c121888b0?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'reel-5',
      title: '24K Gold Facial Instant Glow Therapy ✨',
      category: 'Facial',
      imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&auto=format&fit=crop&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-applying-skin-cream-on-the-face-of-a-woman-41804-large.mp4',
      alt: '24K gold facial cleanup instant glow reel',
      description: 'Deep herbal exfoliation followed by 24k gold leaf infusion for radiant, glass-like wedding glow.',
      mediaType: 'video',
      aspectRatio: 'reel',
      likes: 780,
      viewCount: '17.6K',
      duration: '0:42',
      soundTitle: 'Gentle Spa Zen & Soft Chimes',
      beforeImageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&auto=format&fit=crop&q=80',
      tags: ['#GoldFacial', '#GlassSkin', '#BridalSkincare'],
      startingPrice: 1500,
      isFeatured: true,
      createdAt: '2026-09-23',
      thumbnailUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'reel-6',
      title: 'Bridal Gel Extensions & 24K Gold Foil Art 💅',
      category: 'Nails',
      imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&auto=format&fit=crop&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-showing-her-manicured-nails-41812-large.mp4',
      alt: 'Bridal gel extensions and chrome nail art reel',
      description: 'Long-lasting salon gel extensions embellished with gold foil flakes and a soft blush ombré.',
      mediaType: 'video',
      aspectRatio: 'reel',
      likes: 934,
      viewCount: '21.3K',
      duration: '0:35',
      soundTitle: 'Pop Glamour Beats • Parlour Special',
      beforeImageUrl: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c9?w=800&auto=format&fit=crop&q=80',
      tags: ['#NailArt', '#GelExtensions', '#BridalNails'],
      startingPrice: 999,
      isFeatured: true,
      createdAt: '2026-09-24',
      thumbnailUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&auto=format&fit=crop&q=80'
    }
  ];

  const sourceReels = reels && reels.length > 0 ? reels : fallbackReels;

  const categories = ['All', 'Bridal', 'Makeup', 'Hair', 'Draping', 'Facial', 'Nails'];

  const filteredReels = sourceReels.filter((r) => {
    if (activeCategory === 'All') return true;
    return r.category.toLowerCase().includes(activeCategory.toLowerCase());
  });

  return (
    <section id="beauty-reels" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Fullscreen Reels Viewer Modal */}
      {fullscreenIndex !== null && (
        <BeautyReelsViewer
          reels={sourceReels}
          initialIndex={fullscreenIndex}
          isOpen={true}
          isInline={false}
          onClose={() => setFullscreenIndex(null)}
          onBook={onBook}
        />
      )}

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFF0F2] rounded-full text-[10px] font-sans font-extrabold tracking-[0.2em] text-[#B85C72] uppercase border border-[#F5DDE1] shadow-xs">
          <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          TRENDING TRANSFORMATION REELS
        </div>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#3B0F19]">
          Beauty Reels 🎬
        </h2>
        <p className="text-sm text-[#3B0F19]/75 font-sans max-w-lg mx-auto leading-relaxed">
          Swipe through genuine bride makeovers, chandan forehead artistry, and salon hair therapies in an authentic vertical Instagram experience.
        </p>

        {/* View Mode Switcher + Category Filters */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* Mode Pill */}
          <div className="inline-flex p-1 bg-stone-100 rounded-full border border-stone-200">
            <button
              onClick={() => setViewMode('player')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'player'
                  ? 'bg-[#3B0F19] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Swipeable Player
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#3B0F19] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              Reel Grid ({sourceReels.length})
            </button>
          </div>

          {/* Quick Launch Fullscreen */}
          <button
            onClick={() => setFullscreenIndex(0)}
            className="px-4 py-1.5 rounded-full text-xs font-bold text-[#B85C72] bg-[#FFF0F2] hover:bg-[#FAD2E1] border border-[#F5DDE1] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Watch All Reels Fullscreen
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wider transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#B85C72] text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-[#B85C72]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Experience: Either Inline Swipeable Player or Responsive Grid */}
      {viewMode === 'player' ? (
        <div className="relative max-w-xl mx-auto py-2">
          {/* Subtle Swipe Instructions Badge */}
          <div className="text-center mb-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFFDF9] border border-[#D4AF37]/30 rounded-full text-[11px] font-medium text-[#3B0F19]/80 shadow-xs">
              <span>👆 Swipe up/down on phone</span>
              <span>&bull;</span>
              <span>Double-tap to like ❤️</span>
              <span>&bull;</span>
              <span>Hold for Before photo 👁️</span>
            </span>
          </div>

          {/* Dedicated Vertical Video-First Reels Viewer Component */}
          <BeautyReelsViewer
            reels={filteredReels.length > 0 ? filteredReels : sourceReels}
            initialIndex={0}
            isOpen={true}
            isInline={true}
            onBook={onBook}
            onOpenFullscreen={(idx) => setFullscreenIndex(idx)}
          />
        </div>
      ) : (
        /* Responsive 9:16 Video Cards Grid */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-fade-in">
          {filteredReels.map((reel, index) => (
            <div
              key={reel.id}
              onClick={() => setFullscreenIndex(index)}
              className="group relative aspect-[9/16] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer border border-[#F5DDE1] bg-stone-900 flex flex-col justify-between p-4 select-none"
            >
              {/* Thumbnail Image */}
              <img
                src={reel.imageUrl}
                alt={reel.alt || reel.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                referrerPolicy="no-referrer"
              />

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/50 group-hover:from-black/98 transition-all duration-300" />

              {/* Top Bar */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-sans font-bold px-2.5 py-1 rounded-full border border-white/20">
                  {reel.category}
                </span>
                <span className="bg-[#B85C72] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shadow-xs">
                  {reel.duration || '0:45'}
                </span>
              </div>

              {/* Center Play Icon with Ripple Effect */}
              <div className="relative z-10 flex items-center justify-center my-auto">
                <div className="w-14 h-14 rounded-full bg-white/25 backdrop-blur-md group-hover:bg-[#B85C72] group-hover:scale-115 text-white flex items-center justify-center transition-all duration-300 shadow-2xl border border-white/40">
                  <Play className="w-6 h-6 fill-white ml-1 text-white" />
                </div>
              </div>

              {/* Bottom Info */}
              <div className="relative z-10 space-y-1 text-white">
                <h4 className="font-serif font-bold text-sm sm:text-base leading-tight drop-shadow-sm group-hover:text-[#FAD2E1] transition-colors line-clamp-2">
                  {reel.title}
                </h4>

                <p className="text-[11px] text-white/70 font-sans line-clamp-1">
                  {reel.description}
                </p>

                <div className="flex items-center justify-between text-[11px] text-white/80 font-sans pt-1 border-t border-white/10">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-white/80" />
                    {reel.viewCount || '20K'}
                  </span>
                  <span className="flex items-center gap-1 text-rose-300 font-semibold">
                    <Heart className="w-3 h-3 fill-rose-300" />
                    {reel.likes || '500'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Profile Follow CTA */}
      <div className="bg-gradient-to-r from-[#FFF0F2] via-[#FFFDF9] to-[#FFF0F2] border border-[#F5DDE1] rounded-3xl p-6 sm:p-8 text-center space-y-3 max-w-2xl mx-auto shadow-xs">
        <h3 className="font-serif text-xl font-bold text-[#3B0F19]">
          Love our transformation reels?
        </h3>
        <p className="text-xs text-[#3B0F19]/70 font-sans max-w-md mx-auto leading-relaxed">
          We post new bridal makeover videos, makeup swatches, and hair styling sessions weekly on Instagram.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <a
            href="https://www.instagram.com/glowandgrace_salon"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-[#3B0F19] hover:bg-[#802339] text-[#FFFDF9] rounded-full text-xs font-bold tracking-wider transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer"
          >
            <span>📸 Follow @glowandgrace_salon</span>
          </a>
          {onBook && (
            <button
              onClick={() => onBook('Bridal HD Makeup')}
              className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#E5C494] text-[#3B0F19] rounded-full text-xs font-bold tracking-wider transition-colors shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Book Your Appointment
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

