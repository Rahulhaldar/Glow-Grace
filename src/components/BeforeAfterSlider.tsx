import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, ArrowRight, RefreshCw, Check } from 'lucide-react';

interface BeforeAfterPair {
  id: string;
  title: string;
  category: string;
  description: string;
  beforeImg: string;
  afterImg: string;
  beforeLabel: string;
  afterLabel: string;
  startingPrice: number;
}


interface BeforeAfterSliderProps {
  glowups?: any[];
  onBook?: (serviceName: string) => void;
  compact?: boolean;
  onViewAll?: () => void;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ 
  glowups = [],
  onBook, 
  compact = false, 
  onViewAll 
}) => {
  const items = glowups.map(g => ({
    id: g.id,
    title: g.title,
    category: g.category,
    description: g.description,
    beforeImg: g.beforeImage,
    afterImg: g.afterImage,
    beforeLabel: 'Before',
    afterLabel: 'After',
    startingPrice: g.price || 0,
  }));

  const [activeTab, setActiveTab] = useState<string>(items[0]?.id || '');
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 to 100%
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeItem = items.find((item) => item.id === activeTab) || items[0];

  if (glowups.length === 0) return null; // AUTO-HIDE


  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    []
  );

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <section id="the-glow-up" className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Section Heading */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF0F2] rounded-full text-[10px] font-sans font-extrabold tracking-widest text-[#B85C72] uppercase border border-[#F5DDE1]">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          REAL CLIENT TRANSFORMATION
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#3B0F19]">
          The Glow-Up ✨
        </h2>
        <p className="text-xs sm:text-sm text-[#3B0F19]/70 font-sans">
          Slide horizontally to reveal the before & after transformation magic.
        </p>
      </div>

      {/* Tabs for different transformation types (hidden in compact mode to minimize scrolling) */}
      {!compact && (
        <div className="flex flex-wrap justify-center gap-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSliderPosition(50);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold font-sans transition-all duration-300 cursor-pointer ${
                activeTab === item.id
                  ? 'bg-[#3B0F19] text-[#FFFDF9] shadow-sm'
                  : 'bg-[#FFF0F2] text-[#3B0F19]/80 border border-[#F5DDE1] hover:border-[#B85C72]'
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>
      )}

      {/* Interactive Slider Frame */}
      <div className="bg-white border border-[#F5DDE1] p-4 sm:p-8 rounded-[32px] shadow-lg space-y-6">
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="relative w-full aspect-[4/3] sm:aspect-[16/9] max-h-[500px] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-[#F5DDE1]"
        >
          {/* After Image (Background full width) */}
          <img
            src={activeItem.afterImg}
            alt={activeItem.afterLabel}
            className="absolute inset-0 w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />

          {/* After Label Badge */}
          <div className="absolute top-4 right-4 z-10 bg-[#3B0F19]/90 text-white text-[11px] font-bold font-sans uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md shadow-md">
            ✨ {activeItem.afterLabel}
          </div>

          {/* Before Image (Clipped overlay) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={activeItem.beforeImg}
              alt={activeItem.beforeLabel}
              className="absolute inset-0 w-full h-full object-cover object-center max-w-none"
              style={{
                width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                height: '100%',
              }}
              referrerPolicy="no-referrer"
            />
            {/* Before Label Badge */}
            <div className="absolute top-4 left-4 z-10 bg-black/70 text-white text-[11px] font-bold font-sans uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md shadow-md">
              📸 {activeItem.beforeLabel}
            </div>
          </div>

          {/* Vertical Divider Bar */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-20 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Circular Drag Handle */}
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-[#3B0F19] shadow-xl border-2 border-[#D4AF37] flex items-center justify-center text-xs font-black">
              ⇄
            </div>
          </div>
        </div>

        {/* Controls & Preset Toggles */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#F5DDE1]/60">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#3B0F19]/60 font-sans font-medium">Quick view:</span>
            <button
              onClick={() => setSliderPosition(10)}
              className={`px-3 py-1 text-xs rounded-lg font-sans font-bold border ${
                sliderPosition <= 15
                  ? 'bg-[#B85C72] text-white border-[#B85C72]'
                  : 'bg-[#FFF0F2] text-[#3B0F19] border-[#F5DDE1]'
              }`}
            >
              After Full
            </button>
            <button
              onClick={() => setSliderPosition(50)}
              className={`px-3 py-1 text-xs rounded-lg font-sans font-bold border ${
                sliderPosition > 40 && sliderPosition < 60
                  ? 'bg-[#B85C72] text-white border-[#B85C72]'
                  : 'bg-[#FFF0F2] text-[#3B0F19] border-[#F5DDE1]'
              }`}
            >
              50/50 Split
            </button>
            <button
              onClick={() => setSliderPosition(90)}
              className={`px-3 py-1 text-xs rounded-lg font-sans font-bold border ${
                sliderPosition >= 85
                  ? 'bg-[#B85C72] text-white border-[#B85C72]'
                  : 'bg-[#FFF0F2] text-[#3B0F19] border-[#F5DDE1]'
              }`}
            >
              Before Full
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-sans text-[#3B0F19]/50 block">Starts from</span>
              <span className="font-serif font-extrabold text-base text-[#B85C72]">₹{activeItem.startingPrice}</span>
            </div>
            <button
              onClick={() => onBook && onBook(activeItem.title)}
              className="px-5 py-2.5 bg-[#B85C72] hover:bg-[#802339] text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              Book This Glow-Up
            </button>
          </div>
        </div>

        {/* Short transformation description */}
        <p className="text-xs text-[#3B0F19]/70 font-sans leading-relaxed text-center sm:text-left">
          {activeItem.description}
        </p>
      </div>

      {/* Button: See More Transformations */}
      <div className="text-center pt-2">
        <button
          onClick={() => onViewAll && onViewAll()}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-[#FFF0F2] text-[#B85C72] border border-[#F5DDE1] rounded-full text-xs font-bold font-sans tracking-wide transition-all shadow-xs hover:shadow-md cursor-pointer"
        >
          <span>See More Transformations</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
