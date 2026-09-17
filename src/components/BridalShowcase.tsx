import React from 'react';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';

interface BridalStyle {
  id: string;
  name: string;
  regionalTag: string;
  tagline: string;
  description: string;
  img: string;
  startingPrice: number;
  features: string[];
}

const BRIDAL_STYLES: BridalStyle[] = [
  {
    id: 'bengali-bridal',
    name: 'Royal Bengali Bridal',
    regionalTag: 'Signature Traditional',
    tagline: 'Authentic Mukut, Chandan Art & Banarasi Silk Elegance',
    description: 'Intricate hand-painted Chandan (sandalwood) art across the forehead, royal Mukut placement, kohl-rimmed doe eyes, deep red lip, and traditional Banarasi saree draping.',
    img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
    startingPrice: 8999,
    features: ['Chandan Forehead Artistry', 'Mukut & Dupatta Styling', 'Waterproof HD Base', 'Banarasi Pleat Ironing'],
  },
  {
    id: 'traditional-red',
    name: 'Classic Red & Gold Bride',
    regionalTag: 'North & Pan-Indian',
    tagline: 'Timeless Crimson Velvet, Matha Patti & Royal Radiance',
    description: 'The quintessential Indian bridal vision. Rich golden shimmer on eyelids, sculpted cheekbones, winged eyeliner, crimson lip, and secure heavy lehenga dupatta setting.',
    img: 'https://images.unsplash.com/photo-1615396899839-c99c121888b0?w=800&auto=format&fit=crop&q=80',
    startingPrice: 7999,
    features: ['Matha Patti & Passa Pinning', 'Heavy Dupatta Setting', '16-Hour Sweatproof Finish', 'Floral Gajra Bun'],
  },
  {
    id: 'golden-heritage',
    name: 'Golden Heritage Glam',
    regionalTag: 'Temple & South Indian',
    tagline: 'Antique Temple Jewelry, Champagne Glow & Floral Jada',
    description: 'Sun-kissed champagne complexion complemented by long braided hair with fresh jasmine (gajra), temple jewelry placement, and crisp Kanjeevaram silk saree folding.',
    img: 'https://images.unsplash.com/photo-1610189012903-b44403845758?w=800&auto=format&fit=crop&q=80',
    startingPrice: 8499,
    features: ['South Indian Saree Draping', 'Temple Jewelry Setting', 'Floral Braid Art (Jada)', 'Airbrush Complexion'],
  },
  {
    id: 'reception-cocktail',
    name: 'Modern Reception Glam',
    regionalTag: 'Cocktail & Evening',
    tagline: 'Hollywood Waves, Sculpted Contour & Glossy Nude Lips',
    description: 'Contemporary evening allure for the modern bride. Soft smokey eyes with champagne glitter, glass skin radiance, bouncy Hollywood waves, and velvety nude pout.',
    img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    startingPrice: 6999,
    features: ['Hollywood Soft Waves', 'Full Glam Contour & Glow', 'Mink/Silk Lashes', 'Gown / Saree Draping'],
  },
  {
    id: 'minimal-dewy',
    name: 'Minimal Modern Bride',
    regionalTag: 'Day Wedding & Intimate',
    tagline: 'Featherweight Glass Skin, Soft Blush & Pure Simplicity',
    description: 'For brides who desire an authentic "my skin but luminous" finish. Ultra-sheer coverage, soft rose petal cheeks, subtle tightlined eyes, and relaxed floral chignon.',
    img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80',
    startingPrice: 6499,
    features: ['Dewy Glass Skin Base', 'Feathered Brows', 'Textured Low Bun', 'Pastel Dupatta Pinning'],
  },
  {
    id: 'engagement-pastel',
    name: 'Engagement Pastel Glow',
    regionalTag: 'Mehendi & Engagement',
    tagline: 'Pastel Lehenga Pairing, Baby’s Breath & Soft Coral Charm',
    description: 'Vibrant and joyful aesthetic customized to match pastel pink, mint, or lavender lehengas. Half-up bohemian braids adorned with baby’s breath and fresh floral accents.',
    img: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&auto=format&fit=crop&q=80',
    startingPrice: 4999,
    features: ['Boho Braid with Baby’s Breath', 'Fresh Coral / Rose Flush', 'Shimmer Lid Detailing', 'Lehenga Styling'],
  },
];

interface BridalShowcaseProps {
  onBook?: (styleName: string) => void;
  onViewAll?: () => void;
}

export const BridalShowcase: React.FC<BridalShowcaseProps> = ({ onBook, onViewAll }) => {
  return (
    <section id="bridal-looks" className="bg-[#3B0F19] text-[#FFFDF9] py-20 px-6 relative overflow-hidden border-y-2 border-[#D4AF37]/30">
      {/* Subtle luxury glow backgrounds */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#B85C72]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-extrabold font-sans">
            👑 SIGNATURE BRIDAL ARTISTRY
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Bridal Looks 👰
          </h2>
          <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto opacity-50 rounded-full" />
          <p className="text-white/80 text-sm sm:text-base font-sans leading-relaxed">
            Every bride carries a unique cultural heritage and personal dream. From traditional Bengali Chandan art to royal red North Indian lehenga transformations, we create looks you will cherish forever.
          </p>
        </div>

        {/* 6 Bridal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BRIDAL_STYLES.map((style) => (
            <div
              key={style.id}
              className="bg-[#2D0A13] border border-[#D4AF37]/25 rounded-3xl overflow-hidden hover:border-[#D4AF37]/60 hover:shadow-2xl transition-all duration-500 flex flex-col group"
            >
              {/* Image Frame */}
              <div className="aspect-[4/5] relative overflow-hidden bg-stone-900">
                <img
                  src={style.img}
                  alt={style.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D0A13] via-transparent to-black/30" />

                {/* Regional Tag */}
                <span className="absolute top-4 left-4 bg-[#3B0F19]/90 backdrop-blur-md text-[#D4AF37] text-[10px] font-sans font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full border border-[#D4AF37]/30">
                  {style.regionalTag}
                </span>

                {/* Price starting badge */}
                <span className="absolute bottom-4 right-4 bg-[#3B0F19]/95 text-white text-xs font-serif font-bold px-3 py-1.5 rounded-full border border-[#D4AF37]/30 shadow-lg">
                  Starts ₹{style.startingPrice.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4 flex flex-col flex-grow">
                <div>
                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#E5C494] transition-colors">
                    {style.name}
                  </h3>
                  <p className="text-[#D4AF37] text-xs font-sans italic mt-0.5">
                    {style.tagline}
                  </p>
                </div>

                <p className="text-white/75 text-xs font-sans leading-relaxed flex-grow">
                  {style.description}
                </p>

                {/* Feature Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {style.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="bg-white/5 border border-white/10 text-white/70 text-[10px] px-2.5 py-0.5 rounded-full font-sans"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>

                {/* Action CTA */}
                <div className="pt-3 border-t border-white/10 flex gap-2">
                  <button
                    onClick={() => onBook && onBook(style.name)}
                    className="flex-1 py-2.5 bg-[#D4AF37] hover:bg-[#E5C494] text-[#3B0F19] text-xs font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#3B0F19]" />
                    Book Bridal Consultation
                  </button>
                  <a
                    href={`https://api.whatsapp.com/send?phone=916033271400&text=Hi%20Glow%20and%20Grace!%20I%20am%20interested%20in%20the%20${encodeURIComponent(style.name)}%20package.`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center text-xs font-bold cursor-pointer"
                    title="Inquire on WhatsApp"
                  >
                    💬
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="text-center pt-4">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white/5 border border-white/10 p-4 px-6 rounded-2xl">
            <span className="text-xs text-white/80 font-sans">
              ✨ Need bridal trial makeup or bespoke destination styling?
            </span>
            <button
              onClick={() => onBook && onBook('Bridal Consultation')}
              className="px-4 py-1.5 bg-white text-[#3B0F19] text-xs font-bold rounded-lg hover:bg-[#FAF6F0] transition-colors cursor-pointer shrink-0"
            >
              Book Bridal Consultation &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
