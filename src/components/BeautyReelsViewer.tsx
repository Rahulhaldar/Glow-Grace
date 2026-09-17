import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  X,
  Sparkles,
  Check,
  Copy,
  Send,
  Music,
  Calendar,
  CheckCircle2,
  Maximize2,
  Minimize2,
  RotateCcw
} from 'lucide-react';
import { GalleryItem } from '../types';

interface BeautyReelsViewerProps {
  reels: GalleryItem[];
  initialIndex?: number;
  isOpen?: boolean;
  isInline?: boolean;
  onClose?: () => void;
  onBook?: (lookName: string) => void;
  onOpenFullscreen?: (index: number) => void;
}

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  rotation: number;
}

export const BeautyReelsViewer: React.FC<BeautyReelsViewerProps> = ({
  reels,
  initialIndex = 0,
  isOpen = true,
  isInline = false,
  onClose,
  onBook,
  onOpenFullscreen
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showBefore, setShowBefore] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [newComment, setNewComment] = useState('');
  
  // Per-reel interactive state
  const [likesState, setLikesState] = useState<Record<string, { liked: boolean; count: number }>>({});
  const [savedState, setSavedState] = useState<Record<string, boolean>>({});
  const [commentsState, setCommentsState] = useState<Record<string, { id: string; user: string; text: string; time: string }[]>>({});
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [playPopVisible, setPlayPopVisible] = useState(false);

  // Touch gesture references
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const lastWheelTime = useRef<number>(0);
  const lastTapTime = useRef<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Initialize interactive states
  useEffect(() => {
    if (reels.length > 0) {
      const initialLikes: Record<string, { liked: boolean; count: number }> = {};
      const initialSaved: Record<string, boolean> = {};
      const initialComments: Record<string, { id: string; user: string; text: string; time: string }[]> = {};

      reels.forEach((r) => {
        initialLikes[r.id] = {
          liked: false,
          count: r.likes || Math.floor(Math.random() * 500 + 400)
        };
        initialSaved[r.id] = false;
        initialComments[r.id] = r.comments || [
          { id: 'c1', user: 'priya_roy', text: 'The Chandan design on her forehead is pure art! ❤️', time: '2h ago' },
          { id: 'c2', user: 'sneha_bose', text: 'Loved my sister\'s makeover at Glow & Grace! 👰', time: '5h ago' }
        ];
      });

      setLikesState(initialLikes);
      setSavedState(initialSaved);
      setCommentsState(initialComments);
    }
  }, [reels]);

  // Sync current index if initialIndex changes
  useEffect(() => {
    if (initialIndex >= 0 && initialIndex < reels.length) {
      setCurrentIndex(initialIndex);
      setProgress(0);
      setIsPlaying(true);
    }
  }, [initialIndex, reels.length]);

  // Lock body scroll when in modal mode
  useEffect(() => {
    if (!isInline && isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isInline, isOpen]);

  const currentReel = reels[currentIndex] || reels[0];

  // Simulated progress timer when video is playing
  useEffect(() => {
    if (!currentReel) return;
    setProgress(0);

    const interval = setInterval(() => {
      if (isPlaying) {
        setProgress((prev) => {
          if (prev >= 100) {
            // Auto advance or loop
            return 0;
          }
          return prev + 1.25;
        });
      }
    }, 200);

    return () => clearInterval(interval);
  }, [currentIndex, isPlaying, currentReel]);

  // Handle Video element playback & muting
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          // Auto-play was prevented; fallback
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, isMuted, currentIndex]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
      setIsPlaying(true);
      setShowBefore(false);
      setShowComments(false);
      setShowShare(false);
    }
  }, [currentIndex, reels.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
      setIsPlaying(true);
      setShowBefore(false);
      setShowComments(false);
      setShowShare(false);
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (isInline && !isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        if (showComments) {
          setShowComments(false);
        } else if (showShare) {
          setShowShare(false);
        } else if (onClose) {
          onClose();
        }
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
        setPlayPopVisible(true);
        setTimeout(() => setPlayPopVisible(false), 700);
      } else if (e.key === 'm' || e.key === 'M') {
        setIsMuted((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInline, isOpen, handleNext, handlePrev, onClose, showComments, showShare]);

  // Mouse wheel navigation
  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 450) return;

    if (e.deltaY > 35) {
      lastWheelTime.current = now;
      handleNext();
    } else if (e.deltaY < -35) {
      lastWheelTime.current = now;
      handlePrev();
    }
  };

  // Touch Swipe Handlers (Vertical Instagram Reels style)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchEndY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    touchEndY.current = e.touches[0].clientY;
    const diff = touchEndY.current - touchStartY.current;
    // Dampen drag
    setDragOffset(diff * 0.4);
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = touchEndY.current - touchStartY.current;
    setDragOffset(0);

    if (diff < -50) {
      // Swiped UP -> Next reel
      handleNext();
    } else if (diff > 50) {
      // Swiped DOWN -> Previous reel
      handlePrev();
    }
  };

  // Mouse drag handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag on left click and not on buttons
    if (e.button !== 0) return;
    touchStartY.current = e.clientY;
    touchEndY.current = e.clientY;
    isDragging.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    touchEndY.current = e.clientY;
    const diff = touchEndY.current - touchStartY.current;
    setDragOffset(diff * 0.3);
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = touchEndY.current - touchStartY.current;
    setDragOffset(0);

    if (diff < -50) {
      handleNext();
    } else if (diff > 50) {
      handlePrev();
    }
  };

  // Double tap to like with animated heart particle
  const handleVideoTap = (e: React.MouseEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapTime.current < DOUBLE_TAP_DELAY) {
      // Double tap detected!
      triggerDoubleTapLike(e);
    } else {
      // Single tap -> Toggle Play / Pause
      setIsPlaying((prev) => !prev);
      setPlayPopVisible(true);
      setTimeout(() => setPlayPopVisible(false), 700);
    }
    lastTapTime.current = now;
  };

  const triggerDoubleTapLike = (e: React.MouseEvent) => {
    if (!currentReel) return;
    const rect = containerRef.current?.getBoundingClientRect();
    const x = rect ? e.clientX - rect.left : 180;
    const y = rect ? e.clientY - rect.top : 260;

    // Trigger Heart particle
    const heartId = Date.now() + Math.random();
    setFloatingHearts((prev) => [
      ...prev,
      { id: heartId, x, y, rotation: (Math.random() - 0.5) * 30 }
    ]);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== heartId));
    }, 1000);

    // Increment like if not already liked
    setLikesState((prev) => {
      const current = prev[currentReel.id] || { liked: false, count: currentReel.likes || 500 };
      if (!current.liked) {
        return {
          ...prev,
          [currentReel.id]: {
            liked: true,
            count: current.count + 1
          }
        };
      }
      return prev;
    });
  };

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentReel) return;

    setLikesState((prev) => {
      const current = prev[currentReel.id] || { liked: false, count: currentReel.likes || 500 };
      return {
        ...prev,
        [currentReel.id]: {
          liked: !current.liked,
          count: current.liked ? current.count - 1 : current.count + 1
        }
      };
    });
  };

  const toggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentReel) return;
    setSavedState((prev) => ({
      ...prev,
      [currentReel.id]: !prev[currentReel.id]
    }));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentReel) return;

    const newEntry = {
      id: `c_${Date.now()}`,
      user: 'you_glow',
      text: newComment.trim(),
      time: 'Just now'
    };

    setCommentsState((prev) => ({
      ...prev,
      [currentReel.id]: [newEntry, ...(prev[currentReel.id] || [])]
    }));

    setNewComment('');
  };

  const handleCopyShareLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  if (!currentReel || (!isOpen && !isInline)) return null;

  const activeLike = likesState[currentReel.id] || {
    liked: false,
    count: currentReel.likes || 520
  };
  const isSaved = savedState[currentReel.id] || false;
  const currentComments = commentsState[currentReel.id] || currentReel.comments || [];

  const mainViewerContent = (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        transform: `translateY(${dragOffset}px)`,
        transition: isDragging.current ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className={`relative w-full max-w-[390px] h-[700px] sm:h-[760px] max-h-[92vh] rounded-[36px] overflow-hidden shadow-2xl bg-black border-2 border-[#D4AF37]/30 flex flex-col justify-between select-none mx-auto`}
    >
      {/* 1. MEDIA LAYER (VIDEO OR ANIMATED FRAME) */}
      <div
        className="absolute inset-0 cursor-pointer overflow-hidden"
        onClick={handleVideoTap}
      >
        {/* Active media: Before Photo toggle or Video */}
        {showBefore && currentReel.beforeImageUrl ? (
          <div className="absolute inset-0 bg-stone-900 z-10 animate-fade-in">
            <img
              src={currentReel.beforeImageUrl}
              alt="Before Transformation"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-16 left-4 bg-black/70 backdrop-blur-md text-amber-300 border border-amber-300/40 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              ✨ Client Starting State (Before)
            </div>
          </div>
        ) : (
          <>
            {/* HTML5 Video Layer */}
            {currentReel.videoUrl ? (
              <video
                ref={videoRef}
                src={currentReel.videoUrl}
                poster={currentReel.imageUrl}
                playsInline
                loop
                autoPlay
                muted={isMuted}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={currentReel.imageUrl}
                alt={currentReel.title}
                className="w-full h-full object-cover scale-102"
                referrerPolicy="no-referrer"
              />
            )}
          </>
        )}

        {/* Cinematic Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/60 pointer-events-none" />

        {/* Center Animated Play/Pause Pop */}
        {playPopVisible && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="w-18 h-18 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center animate-scale-up border border-white/20 shadow-2xl">
              {isPlaying ? <Play className="w-8 h-8 fill-white ml-1" /> : <Pause className="w-8 h-8 fill-white" />}
            </div>
          </div>
        )}

        {/* Double-Tap Heart Bursts */}
        {floatingHearts.map((heart) => (
          <div
            key={heart.id}
            style={{
              left: `${heart.x}px`,
              top: `${heart.y}px`,
              transform: `translate(-50%, -50%) rotate(${heart.rotation}deg)`
            }}
            className="absolute pointer-events-none z-30 animate-float-heart"
          >
            <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-[0_10px_20px_rgba(244,63,94,0.6)]" />
          </div>
        ))}
      </div>

      {/* 2. TOP STATUS BAR (STORY SEGMENTS & CONTROLS) */}
      <div className="relative z-20 p-4 space-y-3 pointer-events-auto">
        {/* Segmented Story Bars for all reels */}
        <div className="flex gap-1.5 w-full">
          {reels.map((_, idx) => (
            <div
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
                setProgress(0);
                setIsPlaying(true);
              }}
              className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden cursor-pointer backdrop-blur-xs transition-all"
            >
              <div
                className={`h-full transition-all duration-150 ${
                  idx === currentIndex
                    ? 'bg-white'
                    : idx < currentIndex
                    ? 'bg-white/85'
                    : 'bg-transparent'
                }`}
                style={{
                  width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? '100%' : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Top Header Icons */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="bg-[#B85C72] text-white text-[10px] font-sans font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-white/30 shadow-xs">
              {currentReel.category}
            </span>
            <span className="text-[11px] font-mono text-white/80 font-bold">
              {currentIndex + 1} / {reels.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-all border border-white/20 cursor-pointer"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-white/70" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
            </button>

            {/* Expand / Fullscreen button */}
            {isInline && onOpenFullscreen && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenFullscreen(currentIndex);
                }}
                className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-all border border-white/20 cursor-pointer"
                title="Expand Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}

            {/* Close button in modal mode */}
            {!isInline && onClose && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-all border border-white/20 cursor-pointer"
                title="Close Reels Viewer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Transformation Before-Peek Pill */}
        {currentReel.beforeImageUrl && (
          <div className="pt-1 flex justify-center">
            <button
              onMouseDown={() => setShowBefore(true)}
              onMouseUp={() => setShowBefore(false)}
              onMouseLeave={() => setShowBefore(false)}
              onTouchStart={() => setShowBefore(true)}
              onTouchEnd={() => setShowBefore(false)}
              onClick={(e) => {
                e.stopPropagation();
                setShowBefore(!showBefore);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider backdrop-blur-md flex items-center gap-1.5 transition-all shadow-md cursor-pointer border ${
                showBefore
                  ? 'bg-amber-400 text-stone-900 border-amber-300 scale-105'
                  : 'bg-black/50 text-white/90 border-white/30 hover:bg-black/70'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
              <span>{showBefore ? 'Showing Starting Look' : 'Hold to See Before'}</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. RIGHT ENGAGEMENT RAIL (INSTAGRAM STYLE) */}
      <div className="absolute right-3 bottom-28 z-20 flex flex-col items-center gap-4 text-white pointer-events-auto">
        {/* Like button */}
        <button
          onClick={toggleLike}
          className="flex flex-col items-center cursor-pointer transition-transform active:scale-125 group"
          title="Like this reel"
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
              activeLike.liked
                ? 'bg-rose-600 border-rose-500 text-white scale-110 shadow-lg'
                : 'bg-black/40 border-white/20 text-white hover:bg-black/60'
            }`}
          >
            <Heart
              className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                activeLike.liked ? 'fill-white text-white' : 'text-white'
              }`}
            />
          </div>
          <span className="text-[11px] font-sans font-bold mt-1 drop-shadow-md">
            {activeLike.count}
          </span>
        </button>

        {/* Comments button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowComments(!showComments);
          }}
          className="flex flex-col items-center cursor-pointer transition-transform active:scale-125 group"
          title="View comments"
        >
          <div className="w-11 h-11 rounded-full bg-black/40 border border-white/20 flex items-center justify-center backdrop-blur-md hover:bg-black/60 transition-all">
            <MessageCircle className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-[11px] font-sans font-bold mt-1 drop-shadow-md">
            {currentComments.length}
          </span>
        </button>

        {/* Share button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowShare(true);
          }}
          className="flex flex-col items-center cursor-pointer transition-transform active:scale-125 group"
          title="Share reel"
        >
          <div className="w-11 h-11 rounded-full bg-black/40 border border-white/20 flex items-center justify-center backdrop-blur-md hover:bg-black/60 transition-all">
            <Share2 className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-[10px] font-sans font-bold mt-1 drop-shadow-md">
            Share
          </span>
        </button>

        {/* Save / Bookmark button */}
        <button
          onClick={toggleSave}
          className="flex flex-col items-center cursor-pointer transition-transform active:scale-125 group"
          title="Save this look"
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
              isSaved
                ? 'bg-[#D4AF37] border-amber-300 text-stone-900 shadow-md'
                : 'bg-black/40 border-white/20 text-white hover:bg-black/60'
            }`}
          >
            <Bookmark
              className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                isSaved ? 'fill-current text-stone-950' : 'text-white'
              }`}
            />
          </div>
          <span className="text-[10px] font-sans font-bold mt-1 drop-shadow-md">
            {isSaved ? 'Saved' : 'Save'}
          </span>
        </button>

        {/* Music Disc Spin Icon */}
        <div className="w-9 h-9 rounded-full bg-stone-900/80 border border-white/30 p-1 flex items-center justify-center shadow-lg mt-1">
          <div
            className={`w-full h-full rounded-full bg-gradient-to-tr from-[#B85C72] to-[#D4AF37] flex items-center justify-center ${
              isPlaying ? 'animate-spin-slow' : ''
            }`}
          >
            <Music className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      </div>

      {/* 4. BOTTOM DETAILS & ACTIONS (CREATOR INFO + CTA) */}
      <div className="relative z-20 p-4 space-y-3 pointer-events-auto">
        {/* Creator Identity & Follow */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full p-0.5 bg-gradient-to-tr from-[#D4AF37] to-[#B85C72] shadow-sm">
              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                <img
                  src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&auto=format&fit=crop&q=80"
                  alt="Glow and Grace Artistry"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1">
                <span className="font-serif font-bold text-xs text-white drop-shadow-sm">
                  glowandgrace_salon
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400 text-white" />
              </div>
              <span className="text-[10px] text-white/70 block font-sans">
                📍 Agartala, Tripura &bull; {currentReel.duration || '0:45'}
              </span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFollowing(!isFollowing);
            }}
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              isFollowing
                ? 'bg-white/20 text-white border border-white/30'
                : 'bg-[#B85C72] text-white hover:bg-[#802339] shadow-sm'
            }`}
          >
            {isFollowing ? 'Following' : '+ Follow'}
          </button>
        </div>

        {/* Caption & Expandable Description */}
        <div className="text-white space-y-1 pr-14">
          <h3 className="font-serif font-bold text-sm text-[#FFFDF9] leading-snug drop-shadow-sm">
            {currentReel.title}
          </h3>

          <p
            onClick={(e) => {
              e.stopPropagation();
              setIsCaptionExpanded(!isCaptionExpanded);
            }}
            className={`text-xs text-white/85 font-sans leading-relaxed cursor-pointer transition-all ${
              isCaptionExpanded ? '' : 'line-clamp-2'
            }`}
          >
            {currentReel.description}
            {!isCaptionExpanded && <span className="text-white/50 text-[11px] ml-1">...more</span>}
          </p>

          {/* Hashtags */}
          {currentReel.tags && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {(currentReel.tags || []).map((t, idx) => (
                <span key={idx} className="text-[10px] text-[#FAD2E1] font-sans font-medium">
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Audio Ticker Marquee */}
          <div className="flex items-center gap-2 text-[10px] text-white/75 pt-1">
            <Music className="w-3 h-3 text-amber-300 shrink-0" />
            <div className="overflow-hidden whitespace-nowrap max-w-[220px]">
              <div className="inline-block animate-marquee font-sans">
                {currentReel.soundTitle || 'Glow & Grace • Traditional Shehnai & Sitar Mix'}
              </div>
            </div>
          </div>
        </div>

        {/* Primary Book Look Action Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onClose) onClose();
              if (onBook) onBook(currentReel.title);
            }}
            className="flex-1 py-2.5 px-4 bg-gradient-to-r from-[#D4AF37] to-[#E5C494] hover:from-[#E5C494] hover:to-[#D4AF37] text-[#3B0F19] text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#3B0F19]" />
            <span>Book This Look {currentReel.startingPrice ? `• ₹${currentReel.startingPrice}` : ''}</span>
          </button>

          <a
            href={`https://wa.me/916033271400?text=${encodeURIComponent(
              `Hi Glow & Grace! I watched your reel "${currentReel.title}" and would love to consult about booking this service!`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center text-xs font-bold transition-all shadow-md cursor-pointer"
            title="Inquire via WhatsApp"
          >
            <span className="text-sm">💬</span>
          </a>
        </div>
      </div>

      {/* 5. SLIDE-UP COMMENTS DRAWER */}
      {showComments && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-x-0 bottom-0 z-40 bg-stone-950/95 backdrop-blur-xl border-t border-white/20 rounded-t-[32px] p-4 max-h-[75%] flex flex-col justify-between animate-slide-up shadow-2xl"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="font-serif font-bold text-sm text-white flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
              Comments ({currentComments.length})
            </span>
            <button
              onClick={() => setShowComments(false)}
              className="p-1 rounded-full text-white/60 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Comments List */}
          <div className="overflow-y-auto space-y-3 py-3 pr-1 flex-1 text-xs text-white/90">
            {currentComments.map((comment) => (
              <div key={comment.id} className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#B85C72] to-[#D4AF37] flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                  {comment.user.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between text-[10px] text-white/60">
                    <span className="font-bold text-white/90">@{comment.user}</span>
                    <span>{comment.time}</span>
                  </div>
                  <p className="font-sans leading-relaxed text-white/80">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* New Comment Input */}
          <form onSubmit={handleAddComment} className="pt-2 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a friendly comment..."
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#D4AF37]"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="p-2 bg-[#B85C72] disabled:opacity-40 text-white rounded-xl cursor-pointer hover:bg-[#802339] transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* 6. SHARE DRAWER */}
      {showShare && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-x-0 bottom-0 z-40 bg-stone-950/95 backdrop-blur-xl border-t border-white/20 rounded-t-[32px] p-5 space-y-4 animate-slide-up shadow-2xl"
        >
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="font-serif font-bold text-sm text-white">Share Beauty Reel</span>
            <button
              onClick={() => setShowShare(false)}
              className="p-1 rounded-full text-white/60 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Look at this beautiful ${currentReel.title} from Glow & Grace Ladies Beauty Parlour: ${window.location.href}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-2xl flex flex-col items-center gap-1.5 text-white transition-all cursor-pointer"
            >
              <span className="text-xl">💬</span>
              <span className="text-[11px] font-sans font-semibold">WhatsApp</span>
            </a>

            <button
              onClick={handleCopyShareLink}
              className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl flex flex-col items-center gap-1.5 text-white transition-all cursor-pointer"
            >
              {copiedLink ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              <span className="text-[11px] font-sans font-semibold">
                {copiedLink ? 'Copied!' : 'Copy Link'}
              </span>
            </button>

            <a
              href="https://www.instagram.com/glowandgrace_salon"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-purple-500/20 hover:opacity-90 border border-rose-400/30 rounded-2xl flex flex-col items-center gap-1.5 text-white transition-all cursor-pointer"
            >
              <span className="text-xl">📸</span>
              <span className="text-[11px] font-sans font-semibold">Instagram</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );

  // If inline widget, render the card with desktop floating next/prev arrows
  if (isInline) {
    return (
      <div className="relative flex items-center justify-center py-4">
        {/* Previous Reel Navigation Button */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white text-[#3B0F19] shadow-xl border border-[#F5DDE1] items-center justify-center hover:bg-[#FFF0F2] hover:scale-105 transition-all z-20 cursor-pointer"
            title="Previous Reel (Arrow Up)"
          >
            <ChevronUp className="w-6 h-6 text-[#B85C72]" />
          </button>
        )}

        {mainViewerContent}

        {/* Next Reel Navigation Button */}
        {currentIndex < reels.length - 1 && (
          <button
            onClick={handleNext}
            className="hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white text-[#3B0F19] shadow-xl border border-[#F5DDE1] items-center justify-center hover:bg-[#FFF0F2] hover:scale-105 transition-all z-20 cursor-pointer"
            title="Next Reel (Arrow Down)"
          >
            <ChevronDown className="w-6 h-6 text-[#B85C72]" />
          </button>
        )}
      </div>
    );
  }

  // Fullscreen Modal Viewer
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
      {/* Click backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Floating Desktop Navigation Controls */}
      <div className="hidden lg:flex flex-col items-center gap-3 absolute right-8 top-1/2 -translate-y-1/2 z-30 text-white">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 border border-white/20 flex items-center justify-center transition-all cursor-pointer hover:scale-110"
          title="Previous Reel (↑ Key)"
        >
          <ChevronUp className="w-6 h-6" />
        </button>

        <span className="text-xs font-mono font-bold py-1 px-2.5 bg-black/60 rounded-full border border-white/10">
          {currentIndex + 1} / {reels.length}
        </span>

        <button
          onClick={handleNext}
          disabled={currentIndex === reels.length - 1}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 border border-white/20 flex items-center justify-center transition-all cursor-pointer hover:scale-110"
          title="Next Reel (↓ Key)"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        <span className="text-[10px] text-white/50 tracking-wider uppercase font-sans mt-2 text-center">
          Swipe or <br />Arrow Keys
        </span>
      </div>

      {mainViewerContent}
    </div>
  );
};
