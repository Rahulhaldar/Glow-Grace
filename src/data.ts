import { Service, Package, Artist, GalleryItem, Review, Offer, Appointment, WebsiteSettings, Notification, TrashItem, TrashEntityType } from './types';

export const DEFAULT_SERVICES: Service[] = [
  // MAKEUP
  {
    id: 's1',
    slug: 'bridal-makeup',
    name: 'Bridal Makeup',
    description: 'Complete royal bridal makeup transformation utilizing high-definition (HD) premium styling, custom ornaments arrangement, and optional traditional hand-painted sandalwood forehead art (chandan). Designed to look stunning in photography.',
    startingPrice: 7999,
    category: 'Makeup',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
    duration: 180,
    status: 'Active'
  },
  {
    id: 's2',
    slug: 'party-makeup',
    name: 'Party Makeup',
    description: 'Elegant, camera-ready lightweight makeup ideal for wedding guests, festivals, family ceremonies, and evening parties.',
    startingPrice: 1999,
    category: 'Makeup',
    imageUrl: 'https://images.unsplash.com/photo-1481501940778-c8bb63e376c5?w=800&auto=format&fit=crop&q=80',
    duration: 60,
    status: 'Active'
  },
  {
    id: 's3',
    slug: 'engagement-makeup',
    name: 'Engagement Makeup',
    description: 'A charming, dewy-glow makeup look customized for your engagement ceremony to ensure you look graceful and glowing.',
    startingPrice: 3999,
    category: 'Makeup',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    duration: 90,
    status: 'Active'
  },
  {
    id: 's4',
    slug: 'reception-makeup',
    name: 'Reception Makeup',
    description: 'Glamorous and striking bridal reception look featuring premium contouring, sparkling eye artistry, and HD finish.',
    startingPrice: 4999,
    category: 'Makeup',
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80',
    duration: 120,
    status: 'Active'
  },
  {
    id: 's5',
    slug: 'hd-makeup',
    name: 'HD Makeup',
    description: 'High-definition photo-friendly makeup that flawlessly conceals blemishes and delivers a smooth, matte, photo-ready complexion.',
    startingPrice: 3499,
    category: 'Makeup',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80',
    duration: 90,
    status: 'Active'
  },
  {
    id: 's6',
    slug: 'basic-makeup',
    name: 'Basic Makeup',
    description: 'Minimalist natural makeup touch-up ideal for daytime social gatherings, casual photography, or corporate meetings.',
    startingPrice: 1299,
    category: 'Makeup',
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80',
    duration: 45,
    status: 'Active'
  },

  // HAIR
  {
    id: 's7',
    slug: 'hair-cut',
    name: 'Hair Cut',
    description: 'Trendy layered cuts, step cut, classic feather cut, blunt bob, or simple trims customized by our ladies hairstylists to suit your facial structure.',
    startingPrice: 399,
    category: 'Hair',
    imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format&fit=crop&q=80',
    duration: 45,
    status: 'Active'
  },
  {
    id: 's8',
    slug: 'hair-styling',
    name: 'Hair Styling',
    description: 'Premium locks styling including soft bouncy curls, sleek straightening, crimping, or beautiful classic updos.',
    startingPrice: 699,
    category: 'Hair',
    imageUrl: 'https://images.unsplash.com/photo-1595475241949-c2f210f66639?w=800&auto=format&fit=crop&q=80',
    duration: 40,
    status: 'Active'
  },
  {
    id: 's9',
    slug: 'hair-spa',
    name: 'Hair Spa',
    description: 'Deep nourishing therapy using steam and premium Argan oil masks to hydrate dry, damaged hair and control frizz.',
    startingPrice: 799,
    category: 'Hair',
    imageUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&auto=format&fit=crop&q=80',
    duration: 60,
    status: 'Active'
  },
  {
    id: 's10',
    slug: 'hair-treatment',
    name: 'Hair Treatment',
    description: 'Intense hair care treatments including professional smoothening, keratin infusion, or cysteine therapy for sleek and smooth hair.',
    startingPrice: 2499,
    category: 'Hair',
    imageUrl: 'https://images.unsplash.com/photo-1522337060762-d41222475477?w=800&auto=format&fit=crop&q=80',
    duration: 120,
    status: 'Active'
  },
  {
    id: 's11',
    slug: 'blow-dry',
    name: 'Blow Dry',
    description: 'Professional hair wash accompanied by a gorgeous voluminous blow-out styling session to leave your hair bouncy and glossy.',
    startingPrice: 299,
    category: 'Hair',
    imageUrl: 'https://images.unsplash.com/photo-1527799841627-d11db096c759?w=800&auto=format&fit=crop&q=80',
    duration: 30,
    status: 'Active'
  },
  {
    id: 's12',
    slug: 'bridal-hairstyling',
    name: 'Bridal Hairstyling',
    description: 'Exquisite traditional bridal bun, classic braids, or half-open hairstyles embellished with fragrant jasmine gajra or floral accessories.',
    startingPrice: 1499,
    category: 'Hair',
    imageUrl: 'https://images.unsplash.com/photo-1595475241949-c2f210f66639?w=800&auto=format&fit=crop&q=80',
    duration: 60,
    status: 'Active'
  },

  // SKIN & FACIAL
  {
    id: 's13',
    slug: 'premium-facial',
    name: 'Facial',
    description: 'Rejuvenating face therapies using gold dust, pearl extract, or herbal ingredients to restore natural skin elasticity and deliver an ethereal glow.',
    startingPrice: 699,
    category: 'Skin & Facial',
    imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&auto=format&fit=crop&q=80',
    duration: 60,
    status: 'Active'
  },
  {
    id: 's14',
    slug: 'pore-cleanup',
    name: 'Cleanup',
    description: 'Standard pore cleansing sequence focused on removing blackheads, dead skin cells, and clearing excess facial oils.',
    startingPrice: 499,
    category: 'Skin & Facial',
    imageUrl: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=800&auto=format&fit=crop&q=80',
    duration: 40,
    status: 'Active'
  },
  {
    id: 's15',
    slug: 'de-tan-treatment',
    name: 'De-Tan',
    description: 'Extremely effective tan-removal face pack enriched with milk proteins, natural active honey, and cooling agents.',
    startingPrice: 449,
    category: 'Skin & Facial',
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&auto=format&fit=crop&q=80',
    duration: 30,
    status: 'Active'
  },
  {
    id: 's16',
    slug: 'skin-brightening-bleach',
    name: 'Bleach',
    description: 'Gentle facial bleaching treatment formulated with active oxygen to lighten facial hair and brighten skin tone.',
    startingPrice: 349,
    category: 'Skin & Facial',
    imageUrl: 'https://images.unsplash.com/photo-1516238840914-94dfc0c873ae?w=800&auto=format&fit=crop&q=80',
    duration: 30,
    status: 'Active'
  },
  {
    id: 's17',
    slug: 'skin-polishing',
    name: 'Skin Polishing',
    description: 'Luxury skin exfoliation and deep hydration sequence that targets fine lines, uneven textures, and brings out a radiant glow.',
    startingPrice: 1999,
    category: 'Skin & Facial',
    imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&auto=format&fit=crop&q=80',
    duration: 75,
    status: 'Active'
  },
  {
    id: 's18',
    slug: 'face-cleanup',
    name: 'Face Cleanup',
    description: 'Instantly refreshing cleanup using organic rose water, wild honey scrubs, and a cooling herbal clay mask.',
    startingPrice: 499,
    category: 'Skin & Facial',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80',
    duration: 30,
    status: 'Active'
  },

  // GROOMING
  {
    id: 's19',
    slug: 'eyebrow-threading',
    name: 'Eyebrow / Threading',
    description: 'Precise hair removal mapping using soft organic cotton thread to shape beautiful, symmetrical eyebrow arches.',
    startingPrice: 50,
    category: 'Grooming',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    duration: 15,
    status: 'Active'
  },
  {
    id: 's20',
    slug: 'upper-lip-threading',
    name: 'Upper Lip',
    description: 'Quick and hygienic threading treatment for upper lip hair removal.',
    startingPrice: 30,
    category: 'Grooming',
    imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&auto=format&fit=crop&q=80',
    duration: 10,
    status: 'Active'
  },
  {
    id: 's21',
    slug: 'full-face-threading',
    name: 'Full Face Threading',
    description: 'Gentle threading removal of fine facial peach fuzz to reveal incredibly smooth skin, allowing flawless makeup adhesion.',
    startingPrice: 200,
    category: 'Grooming',
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&auto=format&fit=crop&q=80',
    duration: 30,
    status: 'Active'
  },
  {
    id: 's22',
    slug: 'honey-rika-waxing',
    name: 'Waxing',
    description: 'Hygienic, comfortable waxing for arms, legs, or full body using organic Honey or premium Rika peel wax to minimize skin redness.',
    startingPrice: 350,
    category: 'Grooming',
    imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&auto=format&fit=crop&q=80',
    duration: 45,
    status: 'Active'
  },
  {
    id: 's23',
    slug: 'nourishing-manicure',
    name: 'Manicure',
    description: 'Soothing hand massage, nail clipping, cuticle tidying, hand scrub exfoliation, and a gorgeous nail lacquer coat.',
    startingPrice: 399,
    category: 'Grooming',
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&auto=format&fit=crop&q=80',
    duration: 45,
    status: 'Active'
  },
  {
    id: 's24',
    slug: 'soothing-pedicure',
    name: 'Pedicure',
    description: 'Relaxing foot bath soak, heel scrubbing, cuticle grooming, skin softening massage, and expert nail polishing.',
    startingPrice: 499,
    category: 'Grooming',
    imageUrl: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c9?w=800&auto=format&fit=crop&q=80',
    duration: 50,
    status: 'Active'
  },

  // BRIDAL SERVICES
  {
    id: 's25',
    slug: 'saree-draping',
    name: 'Saree Draping',
    description: 'Flawless precision pleating and secure draping of heavy traditional Banarasi silk, Kanjeevaram, Georgette, or designer sarees.',
    startingPrice: 599,
    category: 'Bridal Services',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    duration: 35,
    status: 'Active'
  },
  {
    id: 's26',
    slug: 'bridal-nail-styling',
    name: 'Nail Styling',
    description: 'Professional gel extensions, acrylic nail styling, or bespoke bridal nail art design matching your bridal attire.',
    startingPrice: 799,
    category: 'Bridal Services',
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&auto=format&fit=crop&q=80',
    duration: 60,
    status: 'Active'
  },
  {
    id: 's27',
    slug: 'pre-bridal-package-service',
    name: 'Pre-Bridal Package',
    description: 'A multi-step holistic grooming series consisting of full skin polishing, luxury facial, body waxing, hair spa, and eyebrows threading.',
    startingPrice: 4999,
    category: 'Bridal Services',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
    duration: 240,
    status: 'Active'
  }
];

export const DEFAULT_PACKAGES: Package[] = [
  {
    id: 'p1',
    name: 'Basic Beauty Package',
    price: 1499,
    description: 'An essential and affordable package designed for routine beauty preservation.',
    features: [
      'Face Cleanup (30 mins)',
      'Eyebrow Threading & Upper Lip',
      'Half Arms Honey Waxing',
      'Basic Hair Trim & Blow Dry'
    ],
    isPopular: false,
    status: 'Active'
  },
  {
    id: 'p2',
    name: 'Party Ready Package',
    price: 2999,
    description: 'Get perfectly dolled up for wedding parties, festive family functions, or receptions.',
    features: [
      'Party Makeup (HD Finish)',
      'Elegant Hair Styling / Classic Soft Curls',
      'Professional Saree or Lehenga Draping',
      'Glossy Nail Polish Coat'
    ],
    isPopular: true,
    status: 'Active'
  },
  {
    id: 'p3',
    name: 'Bridal Package',
    price: 12499,
    description: 'The ultimate royal makeover for your special day. Crafted with premium, luxury materials.',
    features: [
      'Royal Bridal HD or Airbrush Makeup',
      'Bridal Hairstyling with fresh jasmine gajra',
      'Heavy Double Dupatta & Saree Draping',
      'Skin Brightening Gold Face Polish (1 day prior)',
      'Luxury Bridal Touch-Up Keep-Safe Kit'
    ],
    isPopular: false,
    status: 'Active'
  },
  {
    id: 'p4',
    name: 'Pre-Bridal Package',
    price: 5999,
    description: 'A luxury pre-wedding full grooming routine to revitalize your hair, body, and facial skin.',
    features: [
      'Gold Glow Facial & Oxygen Face Bleach',
      'L\'Oreal Professional Nourishing Hair Spa',
      'Full Arms & Full Legs Rika Waxing',
      'Luxurious Rose Pedicure & Manicure',
      'Eyebrow shaping and Face Threading'
    ],
    isPopular: false,
    status: 'Active'
  },
  {
    id: 'p5',
    name: 'Hair & Skin Care Package',
    price: 2499,
    description: 'Revitalizing deep moisture and cell regeneration package to soothe and replenish your skin and locks.',
    features: [
      'Deep Pore Skin Facial (60 mins)',
      'Keratin Hydration Hair Spa & Blow Dry',
      'Relaxing Shoulder & Neck Massage',
      'Hand Polishing Herbal Exfoliation'
    ],
    isPopular: false,
    status: 'Active'
  }
];

export const DEFAULT_ARTISTS: Artist[] = [
  {
    id: 'a1',
    slug: 'ananya-sharma',
    name: 'Ananya Sharma',
    role: 'Senior Makeup Artist',
    experience: '6+ Years',
    specialty: 'Bridal Makeup • HD Makeup • Party Makeup',
    photoUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
    bio: 'Professional makeup artist specializing in elegant Indian bridal, engagement and occasion looks. Experienced in HD makeup, traditional bridal styling and personalized makeup looks designed for long-lasting comfort and a polished finish.',
    socialLinks: { instagram: '@ananya_bridalart', facebook: 'ananyasharma.makeup' },
    status: 'Active',
    rating: 5.0,
    services: ['Bridal Makeup', 'HD Makeup', 'Engagement Makeup', 'Party Makeup', 'Bridal Hair Styling']
  },
  {
    id: 'a2',
    slug: 'meera-das',
    name: 'Meera Das',
    role: 'Hair Specialist',
    experience: '5+ Years',
    specialty: 'Bridal Hair • Hair Styling • Hair Care',
    photoUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80',
    bio: 'Experienced hair specialist focused on bridal and occasion hairstyles. Skilled in elegant buns, curls, braids, traditional hairstyles and customized styling for weddings, receptions and special events.',
    socialLinks: { instagram: '@meera_hairstyles' },
    status: 'Active',
    rating: 4.9,
    services: ['Bridal Hairstyle', 'Hair Styling', 'Curls & Waves', 'Braids', 'Hair Treatment']
  },
  {
    id: 'a3',
    slug: 'riya-sen',
    name: 'Riya Sen',
    role: 'Skin Expert',
    experience: '4+ Years',
    specialty: 'Facial • Skin Care • Bridal Skin Prep',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
    bio: 'Professional skin-care specialist focused on personalized facial and beauty-care services. Helps clients prepare their skin for special occasions with gentle, professional salon treatments and customized routines.',
    socialLinks: { instagram: '@riya_skincare_expert' },
    status: 'Active',
    rating: 4.9,
    services: ['Facial', 'Cleanup', 'Skin Prep', 'Bridal Skin Care', 'Glow Treatment']
  }
];

export const DEFAULT_GALLERY: GalleryItem[] = [
  // BRIDAL
  {
    id: 'g1',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&auto=format&fit=crop&q=80',
    alt: 'Royal Indian bridal makeup closeup with gold jewelry and red lehenga',
    category: 'Bridal',
    title: 'Royal Crimson Bride',
    description: 'Traditional crimson bridal styling with hand-placed matha patti, winged eye liner, and regal gold jewelry.',
    isFeatured: true,
    aspectRatio: 'portrait',
    likes: 342,
    createdAt: '2026-09-01'
  },
  {
    id: 'g2',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80',
    alt: 'Traditional Bengali bride with mukut, chandan art on forehead, and Banarasi saree',
    category: 'Bridal',
    title: 'Bengali Bride with Chandan Art',
    description: 'Intricate white and red sandalwood forehead patterns, traditional shola mukut crown, and Banarasi saree drape.',
    isFeatured: true,
    aspectRatio: 'portrait',
    likes: 489,
    createdAt: '2026-09-02'
  },
  {
    id: 'g3',
    imageUrl: 'https://images.unsplash.com/photo-1546804784-896d0dca3805?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1546804784-896d0dca3805?w=400&auto=format&fit=crop&q=80',
    alt: 'Radiant gold bridal look with temple jewelry',
    category: 'Bridal',
    title: 'Golden Heritage Bridal Glow',
    description: 'Lustrous golden glow with warm champagne tones and heirloom antique temple jewellery.',
    isFeatured: true,
    aspectRatio: 'square',
    likes: 275,
    createdAt: '2026-09-03'
  },
  {
    id: 'g4',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    alt: 'Bridal reception look in pastel champagne glam',
    category: 'Bridal',
    title: 'Glamorous Reception Look',
    description: 'Soft sculpted contouring, glossy nude lips, and Hollywood-inspired soft waves for wedding reception.',
    isFeatured: true,
    aspectRatio: 'portrait',
    likes: 310,
    createdAt: '2026-09-04'
  },
  {
    id: 'g5',
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&auto=format&fit=crop&q=80',
    alt: 'Minimalist modern bridal makeup with dewy skin',
    category: 'Bridal',
    title: 'Minimal Modern Bride',
    description: 'Glass-skin finish with feather-light foundation, rose blush, and understated elegance.',
    isFeatured: false,
    aspectRatio: 'square',
    likes: 198,
    createdAt: '2026-09-05'
  },
  {
    id: 'g6',
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop&q=80',
    alt: 'Engagement ceremony glow with floral accessories',
    category: 'Bridal',
    title: 'Engagement Ceremony Pastel Look',
    description: 'Flawless dewy base paired with soft pink lip stain and baby’s breath floral hair details.',
    isFeatured: false,
    aspectRatio: 'portrait',
    likes: 224,
    createdAt: '2026-09-06'
  },

  // MAKEUP ARTISTRY
  {
    id: 'g7',
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&auto=format&fit=crop&q=80',
    alt: 'Makeup artist applying precision brush styling on client',
    category: 'Makeup',
    title: 'Artist at Work: Blending & Prep',
    description: 'Hands-on makeup prep with sterilized brushes, high-end base primers, and individualized skin tone correction.',
    isFeatured: true,
    aspectRatio: 'square',
    likes: 412,
    createdAt: '2026-09-07'
  },
  {
    id: 'g8',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80',
    alt: 'Dramatic winged eye makeup with golden champagne shimmer eyeshadow',
    category: 'Makeup',
    title: 'Smokey Gold Eye Artistry',
    description: 'Precision winged eyeliner, gradient champagne-to-bronze eyeshadow, and voluminous lash enhancement.',
    isFeatured: true,
    aspectRatio: 'landscape',
    likes: 388,
    createdAt: '2026-09-08'
  },
  {
    id: 'g9',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&auto=format&fit=crop&q=80',
    alt: 'Luxury foundation shades and contour palette on salon counter',
    category: 'Makeup',
    title: 'HD Palette & Shade Matching',
    description: 'Top-tier international cosmetics and exact undertone matching for all Indian skin complexions.',
    isFeatured: false,
    aspectRatio: 'square',
    likes: 165,
    createdAt: '2026-09-09'
  },
  {
    id: 'g10',
    imageUrl: 'https://images.unsplash.com/photo-1481501940778-c8bb63e376c5?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1481501940778-c8bb63e376c5?w=400&auto=format&fit=crop&q=80',
    alt: 'Bold party makeup look with deep wine lipstick and highlighted cheekbones',
    category: 'Makeup',
    title: 'Party Glam: Deep Wine Lips',
    description: 'Striking evening look with matte berry wine lipstick and illuminated high points of the face.',
    isFeatured: true,
    aspectRatio: 'portrait',
    likes: 295,
    createdAt: '2026-09-10'
  },

  // HAIR
  {
    id: 'g11',
    imageUrl: 'https://images.unsplash.com/photo-1595475241949-c2f210f66639?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1595475241949-c2f210f66639?w=400&auto=format&fit=crop&q=80',
    alt: 'Bridal bun wrapped in fresh white fragrant jasmine gajra',
    category: 'Hair',
    title: 'Traditional Gajra Bridal Bun',
    description: 'Classic neat low bun enveloped in rows of fragrant white jasmine flowers and antique gold hair pins.',
    isFeatured: true,
    aspectRatio: 'portrait',
    likes: 512,
    createdAt: '2026-09-11'
  },
  {
    id: 'g12',
    imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&auto=format&fit=crop&q=80',
    alt: 'Voluminous curls and salon blow dry',
    category: 'Hair',
    title: 'Bouncy Hollywood Curls',
    description: 'Heat-protected barrel curls with lustrous shine spray for an effortlessly glamorous evening look.',
    isFeatured: false,
    aspectRatio: 'portrait',
    likes: 230,
    createdAt: '2026-09-12'
  },
  {
    id: 'g13',
    imageUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&auto=format&fit=crop&q=80',
    alt: 'Warm steam hair spa therapy in parlour',
    category: 'Hair',
    title: 'Deep Nourishing Hair Spa',
    description: 'Micro-mist warm steam session with organic argan oil deep treatment to tame frizz and lock in hydration.',
    isFeatured: false,
    aspectRatio: 'square',
    likes: 184,
    createdAt: '2026-09-13'
  },
  {
    id: 'g14',
    imageUrl: 'https://images.unsplash.com/photo-1527799841627-d11db096c759?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1527799841627-d11db096c759?w=400&auto=format&fit=crop&q=80',
    alt: 'Flower woven braid with baby breath and fresh roses',
    category: 'Hair',
    title: 'Floral Woven South Indian Braid',
    description: 'Full length traditional poola jada braid adorned with pink roses and golden hair clips.',
    isFeatured: true,
    aspectRatio: 'portrait',
    likes: 367,
    createdAt: '2026-09-14'
  },

  // BEAUTY / FACIAL & GROOMING
  {
    id: 'g15',
    imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&auto=format&fit=crop&q=80',
    alt: 'Relaxing gold peel-off facial cleanup session in parlour',
    category: 'Facial',
    title: '24K Gold Dust Facial Cleanup',
    description: 'Gentle exfoliation followed by 24k gold leaf mask to restore instant radiance and firm tired facial skin.',
    isFeatured: true,
    aspectRatio: 'square',
    likes: 421,
    createdAt: '2026-09-15'
  },
  {
    id: 'g16',
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&auto=format&fit=crop&q=80',
    alt: 'Eyebrow shaping with cotton thread mapping',
    category: 'Grooming',
    title: 'Precision Threading & Arch Shaping',
    description: 'Hygienic 100% organic cotton threading mapping to craft defined, symmetrical natural brow arches.',
    isFeatured: false,
    aspectRatio: 'square',
    likes: 215,
    createdAt: '2026-09-16'
  },
  {
    id: 'g17',
    imageUrl: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c9?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c9?w=400&auto=format&fit=crop&q=80',
    alt: 'Luxury pedicure with warm water and fresh pink rose petals',
    category: 'Nails',
    title: 'Rose Petal Foot Spa Pedicure',
    description: 'Aromatic foot soak in warm rose water, Himalayan salt scrub exfoliation, and relaxing pressure massage.',
    isFeatured: true,
    aspectRatio: 'square',
    likes: 350,
    createdAt: '2026-09-17'
  },
  {
    id: 'g18',
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&auto=format&fit=crop&q=80',
    alt: 'Bridal gel nail extensions with glitter ombré finish',
    category: 'Nails',
    title: 'Bridal Gel Extensions & Nail Art',
    description: 'Long-lasting salon gel extensions embellished with gold foil flakes and a soft blush pink ombré.',
    isFeatured: false,
    aspectRatio: 'square',
    likes: 278,
    createdAt: '2026-09-18'
  },

  // REELS / VIDEOS
  {
    id: 'g19',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&auto=format&fit=crop&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-traditional-indian-dress-41588-large.mp4',
    alt: 'Royal bridal transformation reel thumbnail',
    category: 'Bridal',
    title: 'Royal Bengali Bride Transformation ✨',
    description: 'Chandan forehead art & Mukut placement process. Pure traditional royal magic for bride Ananya!',
    isFeatured: true,
    mediaType: 'video',
    aspectRatio: 'reel',
    viewCount: '28.4K',
    duration: '0:45',
    likes: 1240,
    soundTitle: 'Glow & Grace • Traditional Shehnai & Sitar Mix (Original Audio)',
    beforeImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    tags: ['#BengaliBride', '#BridalGlow', '#ChandanArt', '#AgartalaSalon'],
    startingPrice: 7999,
    comments: [
      { id: 'c1', user: 'priya_roy', text: 'The Chandan design on her forehead is pure art! ❤️', time: '2h ago' },
      { id: 'c2', user: 'sneha_bose', text: 'Booked my December wedding with Rajeshwari di, can’t wait! 👰', time: '5h ago' },
      { id: 'c3', user: 'meera_kolkata', text: 'Zero cakeyness, the skin literally glows through!', time: '1d ago' }
    ],
    createdAt: '2026-09-19'
  },
  {
    id: 'g20',
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&auto=format&fit=crop&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-model-posing-for-a-fashion-shoot-41793-large.mp4',
    alt: 'HD airbrush makeup blending reel thumbnail',
    category: 'Makeup',
    title: 'HD Airbrush Makeup Glow Process 💄',
    description: 'Behind the scenes: flawless airbrush foundation layering and precision cut-crease eye makeup.',
    isFeatured: true,
    mediaType: 'video',
    aspectRatio: 'reel',
    viewCount: '19.2K',
    duration: '0:32',
    likes: 890,
    soundTitle: 'MUA Lounge • Chill Lo-Fi Beats & Flute',
    beforeImageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
    tags: ['#AirbrushMakeup', '#FlawlessBase', '#PartyGlam', '#MACIndia'],
    startingPrice: 2499,
    comments: [
      { id: 'c4', user: 'tanushree_m', text: 'Which foundation shade was used here? Looks so natural!', time: '3h ago' },
      { id: 'c5', user: 'salon_enthusiast', text: 'That wing eyeliner flick was so smooth 🤌', time: '1d ago' }
    ],
    createdAt: '2026-09-20'
  },
  {
    id: 'g21',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-smiling-with-her-hair-blowing-in-the-wind-41589-large.mp4',
    alt: 'Floral gajra bun creation reel thumbnail',
    category: 'Hair',
    title: 'Floral Gajra Bun & Updo Art 🌸',
    description: 'Creating an intricate bridal low bun with fresh fragrant jasmine garlands and handcrafted pearl pins.',
    isFeatured: true,
    mediaType: 'video',
    aspectRatio: 'reel',
    viewCount: '34.1K',
    duration: '0:50',
    likes: 1560,
    soundTitle: 'Kesariya Acoustic Sitar Instrumental (Glow & Grace Studio)',
    beforeImageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&auto=format&fit=crop&q=80',
    tags: ['#BridalHair', '#FloralGajra', '#WeddingUpdo', '#HairStylist'],
    startingPrice: 1299,
    comments: [
      { id: 'c6', user: 'deepika_n', text: 'The fresh jasmine fragrance must have felt heavenly!', time: '4h ago' },
      { id: 'c7', user: 'parlour_fan', text: 'How many pins did this take? Looks so solid yet delicate.', time: '1d ago' }
    ],
    createdAt: '2026-09-21'
  },
  {
    id: 'g22',
    imageUrl: 'https://images.unsplash.com/photo-1615396899839-c99c121888b0?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1615396899839-c99c121888b0?w=400&auto=format&fit=crop&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-indian-bride-dressed-in-traditional-clothes-41584-large.mp4',
    alt: 'Banarasi saree pleating reel thumbnail',
    category: 'Draping',
    title: 'Banarasi Saree Draping Masterclass 🥻',
    description: 'The secret to crisp, comfortable pallu pleats that stay in place all evening long without slipping.',
    isFeatured: true,
    mediaType: 'video',
    aspectRatio: 'reel',
    viewCount: '22.8K',
    duration: '0:38',
    likes: 975,
    soundTitle: 'Traditional Draping Rhythms • Glow & Grace',
    beforeImageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
    tags: ['#SareeDraping', '#BanarasiSilk', '#WeddingReady', '#Elegance'],
    startingPrice: 599,
    comments: [
      { id: 'c8', user: 'monica_sharma', text: 'Such neat pleats! Mine always unravel, needed this tip!', time: '6h ago' }
    ],
    createdAt: '2026-09-22'
  },
  {
    id: 'g23',
    imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&auto=format&fit=crop&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-applying-skin-cream-on-the-face-of-a-woman-41804-large.mp4',
    alt: '24K gold facial cleanup instant glow reel',
    category: 'Facial',
    title: '24K Gold Facial Instant Glow Therapy ✨',
    description: 'Deep herbal exfoliation followed by 24k gold leaf infusion for radiant, glass-like wedding glow.',
    isFeatured: true,
    mediaType: 'video',
    aspectRatio: 'reel',
    viewCount: '17.6K',
    duration: '0:42',
    likes: 780,
    soundTitle: 'Gentle Spa Zen & Soft Chimes (432Hz)',
    beforeImageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&auto=format&fit=crop&q=80',
    tags: ['#GoldFacial', '#GlassSkin', '#BridalSkincare', '#GlowGrace'],
    startingPrice: 1500,
    comments: [
      { id: 'c9', user: 'ritika_deb', text: 'Took this before my cousin\'s sangeet. People couldn\'t stop complimenting!', time: '1d ago' }
    ],
    createdAt: '2026-09-23'
  },
  {
    id: 'g24',
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&auto=format&fit=crop&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-showing-her-manicured-nails-41812-large.mp4',
    alt: 'Bridal gel extensions and chrome nail art reel',
    category: 'Nails',
    title: 'Bridal Gel Extensions & 24K Gold Foil Art 💅',
    description: 'Long-lasting salon gel extensions embellished with gold foil flakes and a soft blush ombré.',
    isFeatured: true,
    mediaType: 'video',
    aspectRatio: 'reel',
    viewCount: '21.3K',
    duration: '0:35',
    likes: 934,
    soundTitle: 'Pop Glamour Beats • Parlour Special',
    beforeImageUrl: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c9?w=800&auto=format&fit=crop&q=80',
    tags: ['#NailArt', '#GelExtensions', '#BridalNails', '#ChromeGlow'],
    startingPrice: 999,
    comments: [
      { id: 'c10', user: 'alankrita_s', text: 'Obsessed with the foil accents! Lasted through my entire wedding week.', time: '2d ago' }
    ],
    createdAt: '2026-09-24'
  }
];

export const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'r1',
    customerName: 'Devika Iyer',
    profileImageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    serviceName: 'Bridal Makeup',
    rating: 5,
    reviewContent: 'I felt like an absolute queen! Rajeshwari\'s hand-drawn sandalwood bindi designs on my forehead were incredible. The fresh jasmine fragrance in my hair stayed sweet all night.',
    status: 'Approved',
    createdAt: '2026-09-08'
  },
  {
    id: 'r2',
    customerName: 'Sumitra Das',
    profileImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    serviceName: 'Facial',
    rating: 5,
    reviewContent: 'The facial treatment is pure magic! My skin emerged incredibly soft, smooth, and radiant. Highly recommend the Glow and Grace parlour.',
    status: 'Approved',
    createdAt: '2026-09-09'
  },
  {
    id: 'r3',
    customerName: 'Aditi Nair',
    profileImageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    serviceName: 'Hair Spa',
    rating: 5,
    reviewContent: 'The hair spa treatment and scalp massage melted my stress away. My hair feels extremely silky and frizz-free now!',
    status: 'Approved',
    createdAt: '2026-09-10'
  }
];

export const DEFAULT_OFFERS: Offer[] = [
  {
    id: 'o1',
    title: 'Bridal Makeup Package Offer',
    description: 'Book your bridal package today and save flat ₹1,000 off! Includes a free pre-event facial consultation.',
    code: 'BRIDAL1000',
    discountValue: 1000,
    type: 'bridal',
    status: 'Active'
  },
  {
    id: 'o2',
    title: 'Festive Season Glam',
    description: 'Get a luxurious blow-dry completely free of cost with any Party Makeup booking.',
    code: 'FESTIVEGLAM',
    type: 'festival',
    status: 'Active'
  }
];

export const DEFAULT_SETTINGS: WebsiteSettings = {
  whatsappNumber: '+916033271400',
  salonAddress: '12 Luxury Boulevard, Palace Row, Near Heritage Fountain, Agartala, Tripura - 799001',
  emailAddress: 'hello@glowandgrace.in',
  phoneNumber: '+91 60332 71400',
  openingHours: 'Monday – Sunday, 10:00 AM – 8:00 PM',
  instagramUrl: 'https://instagram.com/glowandgrace_salon',
  mapsUrl: 'https://maps.google.com/?q=Agartala+Tripura',
  iframeMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29202.836413481232!2d91.26514757317769!3d23.837375211993427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3753f3f01c8eb1db%3A0x6739920ef0d19f3c!2sAgartala%2C%20Tripura!5e0!3m2!1sen!2sin!4v1726145000000!5m2!1sen!2sin',
  metaTitle: 'Glow & Grace | Luxury Ladies Parlour & Bridal Studio',
  metaDescription: 'Experience expert bridal makeup, hair styling, facials, and luxury salon services at Glow & Grace.',
  ogImageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&auto=format&fit=crop&q=80',
  keywords: 'bridal makeup, ladies parlour, hair spa, facial, salon'
};

export const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    bookingId: 'GG-2026-00125',
    customerName: 'Pooja Roy',
    phone: '6033271400',
    email: 'pooja.roy@example.com',
    serviceId: 's2',
    serviceName: 'Party Makeup',
    artistId: 'a2',
    artistName: 'Riya Sharma',
    date: '2026-09-12',
    time: '16:00',
    specialRequest: 'Elegant look for a golden lehenga outfit.',
    status: 'Pending',
    createdAt: '2026-09-11T14:30:00.000Z'
  },
  {
    bookingId: 'GG-2026-00126',
    customerName: 'Meghna Chatterjee',
    phone: '9432165432',
    email: 'meghna@example.com',
    serviceId: 's1',
    serviceName: 'Bridal Makeup',
    artistId: 'a1',
    artistName: 'Rajeshwari Devi',
    date: '2026-10-18',
    time: '11:00',
    specialRequest: 'Traditional Bengali bridal styling with elaborate forehead patterns.',
    status: 'Confirmed',
    createdAt: '2026-09-10T10:00:00.000Z'
  }
];

export const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'New appointment request',
    message: 'Pooja Roy requested an appointment for Party Makeup on 12 Sep 2026',
    isRead: false,
    createdAt: '2026-09-11T14:30:00.000Z',
    bookingId: 'GG-2026-00125'
  }
];

export const DEFAULT_REELS: any[] = [];
export const DEFAULT_GLOWUPS: any[] = [];
export const DEFAULT_TRASH: TrashItem[] = [];

type SyncListener = (key: string, data: any, prevData: any) => Promise<void> | void;
let syncListener: SyncListener | null = null;

type DeleteHook = (entityType: string, id: string) => Promise<void> | void;
let deleteHook: DeleteHook | null = null;

// Helper database engine that syncs with LocalStorage
export class MockDB {
  static registerSyncListener(listener: SyncListener) {
    syncListener = listener;
  }

  static registerDeleteHook(hook: DeleteHook) {
    deleteHook = hook;
  }

  static init() {
    // Check if database was already initialized once
    const isInitialized = localStorage.getItem('gg_db_initialized_v2');
    if (isInitialized) {
      // PREVENT RE-CREATION: Once initialized, empty arrays ('[]') represent
      // deleted collections and must NEVER be re-seeded or overwritten with demo data.
      return;
    }

    const defaultsMap: Record<string, any> = {
      services: DEFAULT_SERVICES,
      packages: DEFAULT_PACKAGES,
      artists: DEFAULT_ARTISTS,
      gallery: DEFAULT_GALLERY,
      reviews: DEFAULT_REVIEWS,
      offers: DEFAULT_OFFERS,
      appointments: DEFAULT_APPOINTMENTS,
      notifications: DEFAULT_NOTIFICATIONS,
      settings: DEFAULT_SETTINGS,
      reels: DEFAULT_REELS,
      glowups: DEFAULT_GLOWUPS,
      trash: DEFAULT_TRASH,
    };

    // First time setup only: populate keys that have never existed
    Object.entries(defaultsMap).forEach(([key, defaultVal]) => {
      const stored = localStorage.getItem(`gg_${key}`);
      if (stored === null || stored === 'undefined' || stored === 'null') {
        localStorage.setItem(`gg_${key}`, JSON.stringify(defaultVal));
      }
    });

    const cachedSettings = localStorage.getItem('gg_settings');
    if (!cachedSettings) {
      localStorage.setItem('gg_settings', JSON.stringify(DEFAULT_SETTINGS));
    }

    // Mark as initialized to prevent ever re-inserting default data
    localStorage.setItem('gg_db_initialized_v2', 'true');
  }

  static async clearDemoData() {
    return false;
  }

  static get<T>(key: string): T {
    const data = localStorage.getItem(`gg_${key}`);
    if (!data || data === 'undefined' || data === 'null') {
      // Check if it is the settings object to return defaults
      if (key === 'settings') return {} as unknown as T;
      return [] as unknown as T;
    }
    try {
      const parsed = JSON.parse(data);
      if (key !== 'settings' && !Array.isArray(parsed)) {
        return [] as unknown as T;
      }
      return parsed;
    } catch (err) {
      console.warn(`[MockDB] Error parsing data for key ${key}:`, err);
      if (key === 'settings') return {} as unknown as T;
      return [] as unknown as T;
    }
  }

  static async set(key: string, data: any) {
    // Get previous state from localStorage to find deletions
    const prevDataStr = localStorage.getItem(`gg_${key}`);
    let prevData = null;
    if (prevDataStr && prevDataStr !== 'undefined' && prevDataStr !== 'null') {
      try {
        prevData = JSON.parse(prevDataStr);
      } catch (e) {
        console.warn(`[MockDB] Error parsing previous data for key ${key}`);
      }
    }

    // Save to local state instantly for extreme responsiveness
    localStorage.setItem(`gg_${key}`, JSON.stringify(data));
    window.dispatchEvent(new Event('gg_db_update'));

    if (syncListener) {
      try {
        await syncListener(key, data, prevData);
      } catch (e) {
        console.warn('Real-time replication to Firestore was intercepted or offline:', e);
      }
    }
  }

  // Generic lists
  static getServices(): Service[] { 
    const list = this.get<Service[]>('services');
    return list.map(s => {
      const img = s.image || s.imageUrl || 'https://images.unsplash.com/photo-1481501940778-c8bb63e376c5?w=800&auto=format&fit=crop&q=80';
      return {
        ...s,
        image: img,
        imageUrl: img
      };
    });
  }
  static getPackages() { return this.get<Package[]>('packages'); }
  static getArtists() { return this.get<Artist[]>('artists'); }
  static getGallery() { return this.get<GalleryItem[]>('gallery'); }
  static getReviews() { return this.get<Review[]>('reviews'); }
  static getOffers() { return this.get<Offer[]>('offers'); }
  static getSettings() { return this.get<WebsiteSettings>('settings'); }
  static getAppointments() { return this.get<Appointment[]>('appointments'); }
  static getNotifications() { return this.get<Notification[]>('notifications'); }
  static getReels() { return this.get<any[]>('reels'); }
  static getGlowups() { return this.get<any[]>('glowups'); }
  static getTrash(): TrashItem[] { return this.get<TrashItem[]>('trash') || []; }

  // --- SOFT DELETE / TRASH MANAGEMENT ---
  static async moveToTrash(entityType: TrashEntityType, id: string, title?: string, subtitle?: string): Promise<TrashItem | null> {
    const list = this.get<any[]>(entityType);
    const itemIndex = list.findIndex(item => {
      const itemId = item.id || item.bookingId;
      return String(itemId) === String(id);
    });
    if (itemIndex === -1) return null;

    const item = list[itemIndex];
    const filtered = list.filter((_, idx) => idx !== itemIndex);

    const itemTitle = title || item.name || item.title || item.customerName || item.serviceName || id;
    const itemSubtitle = subtitle || (entityType === 'appointments' ? `${item.serviceName} • ${item.date}` : (item.category || item.role || item.type || ''));

    const trashItem: TrashItem = {
      trashId: `trash-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      originalId: String(id),
      entityType,
      title: String(itemTitle),
      subtitle: String(itemSubtitle),
      trashedAt: new Date().toISOString(),
      data: item
    };

    const currentTrash = this.getTrash();
    const updatedTrash = [trashItem, ...currentTrash];

    await this.set(entityType, filtered);
    await this.set('trash', updatedTrash);

    return trashItem;
  }

  static async bulkMoveToTrash(entityType: TrashEntityType, ids: string[]): Promise<TrashItem[]> {
    const list = this.get<any[]>(entityType);
    const idSet = new Set(ids.map(id => String(id)));
    const movedItems: TrashItem[] = [];
    const remaining: any[] = [];

    list.forEach(item => {
      const itemId = String(item.id || item.bookingId);
      if (idSet.has(itemId)) {
        const itemTitle = item.name || item.title || item.customerName || item.serviceName || itemId;
        const itemSubtitle = entityType === 'appointments' ? `${item.serviceName} • ${item.date}` : (item.category || item.role || item.type || '');
        movedItems.push({
          trashId: `trash-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          originalId: itemId,
          entityType,
          title: String(itemTitle),
          subtitle: String(itemSubtitle),
          trashedAt: new Date().toISOString(),
          data: item
        });
      } else {
        remaining.push(item);
      }
    });

    if (movedItems.length > 0) {
      const currentTrash = this.getTrash();
      const updatedTrash = [...movedItems, ...currentTrash];
      await this.set(entityType, remaining);
      await this.set('trash', updatedTrash);
    }

    return movedItems;
  }

  static async restoreFromTrash(trashId: string): Promise<boolean> {
    const currentTrash = this.getTrash();
    const trashItem = currentTrash.find(t => t.trashId === trashId);
    if (!trashItem) return false;

    const remainingTrash = currentTrash.filter(t => t.trashId !== trashId);
    const entityList = this.get<any[]>(trashItem.entityType);

    const existingIdx = entityList.findIndex(e => String(e.id || e.bookingId) === String(trashItem.originalId));
    let updatedEntityList: any[];
    if (existingIdx !== -1) {
      updatedEntityList = entityList.map((e, idx) => idx === existingIdx ? trashItem.data : e);
    } else {
      updatedEntityList = [trashItem.data, ...entityList];
    }

    await this.set(trashItem.entityType, updatedEntityList);
    await this.set('trash', remainingTrash);
    return true;
  }

  static async bulkRestoreFromTrash(trashIds: string[]): Promise<number> {
    const currentTrash = this.getTrash();
    const trashIdSet = new Set(trashIds);
    const toRestore = currentTrash.filter(t => trashIdSet.has(t.trashId));
    const remainingTrash = currentTrash.filter(t => !trashIdSet.has(t.trashId));

    if (toRestore.length === 0) return 0;

    const grouped: Record<string, any[]> = {};
    toRestore.forEach(item => {
      if (!grouped[item.entityType]) {
        grouped[item.entityType] = this.get<any[]>(item.entityType);
      }
      const list = grouped[item.entityType];
      const existingIdx = list.findIndex(e => String(e.id || e.bookingId) === String(item.originalId));
      if (existingIdx !== -1) {
        list[existingIdx] = item.data;
      } else {
        list.unshift(item.data);
      }
    });

    for (const [entityType, list] of Object.entries(grouped)) {
      await this.set(entityType, list);
    }
    await this.set('trash', remainingTrash);

    return toRestore.length;
  }

  static async deletePermanentlyFromTrash(trashId: string): Promise<boolean> {
    const currentTrash = this.getTrash();
    const filtered = currentTrash.filter(t => t.trashId !== trashId);
    if (filtered.length !== currentTrash.length) {
      await this.set('trash', filtered);
      return true;
    }
    return false;
  }

  static async bulkDeletePermanentlyFromTrash(trashIds: string[]): Promise<number> {
    const currentTrash = this.getTrash();
    const trashIdSet = new Set(trashIds);
    const remaining = currentTrash.filter(t => !trashIdSet.has(t.trashId));
    const deletedCount = currentTrash.length - remaining.length;
    if (deletedCount > 0) {
      await this.set('trash', remaining);
    }
    return deletedCount;
  }

  static async emptyTrash(): Promise<number> {
    const currentTrash = this.getTrash();
    const count = currentTrash.length;
    await this.set('trash', []);
    return count;
  }

  static async deleteEntityPermanently(entityType: string, id: string): Promise<boolean> {
    const list = this.get<any[]>(entityType);
    const filtered = list.filter(item => {
      const itemId = String(item.id || item.bookingId);
      return itemId !== String(id);
    });

    // Execute direct Firestore deletion hook
    if (deleteHook) {
      try {
        await deleteHook(entityType, id);
      } catch (err) {
        console.warn(`Direct delete hook for ${entityType}/${id}:`, err);
      }
    }

    if (filtered.length !== list.length) {
      await this.set(entityType, filtered);
      return true;
    }
    return false;
  }

  static async bulkDeleteEntitiesPermanently(entityType: string, ids: string[]): Promise<number> {
    const list = this.get<any[]>(entityType);
    const idSet = new Set(ids.map(id => String(id)));
    const filtered = list.filter(item => {
      const itemId = String(item.id || item.bookingId);
      return !idSet.has(itemId);
    });

    // Execute direct Firestore deletion hook for all IDs
    if (deleteHook) {
      for (const id of ids) {
        try {
          await deleteHook(entityType, id);
        } catch (err) {
          console.warn(`Direct delete hook for ${entityType}/${id}:`, err);
        }
      }
    }

    const count = list.length - filtered.length;
    if (count > 0) {
      await this.set(entityType, filtered);
    }
    return count;
  }

  // Appends/Updates
  static saveAppointment(app: Omit<Appointment, 'bookingId' | 'status' | 'createdAt'>) {
    const list = this.getAppointments();
    const prefix = 'GG-2026-';
    const randNum = Math.floor(10000 + Math.random() * 90000); // Unique 5 digits
    const bookingId = `${prefix}${randNum}`;
    
    const newApp: Appointment = {
      ...app,
      id: bookingId,
      bookingId,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    list.unshift(newApp);
    this.set('appointments', list);

    // Add a notification
    const notifications = this.getNotifications();
    const newNotif: Notification = {
      id: `n-${Date.now()}`,
      title: 'New appointment request',
      message: `${newApp.customerName} requested an appointment for ${newApp.serviceName}`,
      isRead: false,
      createdAt: new Date().toISOString(),
      bookingId
    };
    notifications.unshift(newNotif);
    this.set('notifications', notifications);

    return newApp;
  }

  static updateAppointmentStatus(bookingId: string, status: Appointment['status'], notes?: string) {
    const list = this.getAppointments();
    const idx = list.findIndex(a => a.bookingId === bookingId);
    if (idx !== -1) {
      list[idx].status = status;
      if (notes !== undefined) {
        list[idx].adminNotes = notes;
      }
      this.set('appointments', list);
    }
  }

  static saveReview(rev: Omit<Review, 'id' | 'status' | 'createdAt'>) {
    const list = this.getReviews();
    const newRev: Review = {
      ...rev,
      id: `r-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    list.unshift(newRev);
    this.set('reviews', list);
    return newRev;
  }
}
