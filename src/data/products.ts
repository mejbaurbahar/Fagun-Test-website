import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Silk Blouse with Pleated Sleeves',
    price: 410,
    originalPrice: 480,
    category: 'Clothing',
    rating: 4.9,
    reviewsCount: 28,
    images: [
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Crafted from 100% pure mulberry silk, this blouse features intricate pleated sleeves that drape effortlessly. Designed with a relaxed fit and button-front closure for timeless elegance.',
    details: [
      '100% Mulberry Silk',
      'Pleated organza cuffs & sleeves',
      'Concealed mother-of-pearl buttons',
      'Dry clean only',
      'Made in Italy'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Champagne Gold', hex: '#E6D7C3' },
      { name: 'Ivory Cream', hex: '#FDFBF7' },
      { name: 'Midnight Black', hex: '#121212' }
    ],
    inStock: true,
    stockCount: 14,
    badge: 'Featured',
    sku: 'FG-BLS-001'
  },
  {
    id: 'prod-2',
    name: 'Tailored Cashmere Wool Overcoat',
    price: 890,
    originalPrice: 1100,
    category: 'Clothing',
    rating: 5.0,
    reviewsCount: 42,
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'A structured double-breasted overcoat tailored from plush Mongolian cashmere and virgin wool blend. Features sharp lapels, horn buttons, and a vented back.',
    details: [
      '80% Virgin Wool, 20% Cashmere',
      'Cupro lining for smooth layering',
      'Double-breasted horn button closure',
      'Deep welt side pockets',
      'Specialist dry clean'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Camel Tan', hex: '#C19A6B' },
      { name: 'Obsidian Black', hex: '#1A1A1A' }
    ],
    inStock: true,
    stockCount: 8,
    badge: 'Best Seller',
    sku: 'FG-COT-002'
  },
  {
    id: 'prod-3',
    name: 'Artisanal Calfskin Tote Bag',
    price: 650,
    category: 'Accessories',
    rating: 4.8,
    reviewsCount: 19,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Handcrafted by master leather artisans in Florence, this roomy tote is made from supple pebbled calfskin with brushed gold hardware and an included zip pouch.',
    details: [
      '100% Full-grain pebbled calfskin',
      'Hand-finished edge painted seams',
      'Suede interior lining',
      'Removable zippered wristlet pouch',
      'Dimensions: 38cm x 30cm x 15cm'
    ],
    colors: [
      { name: 'Cognac Brown', hex: '#8B4513' },
      { name: 'Nude Beige', hex: '#D2B48C' },
      { name: 'Classic Black', hex: '#000000' }
    ],
    inStock: true,
    stockCount: 11,
    badge: 'New',
    sku: 'FG-BAG-003'
  },
  {
    id: 'prod-4',
    name: 'Pleated High-Waist Midi Skirt',
    price: 320,
    originalPrice: 380,
    category: 'Clothing',
    rating: 4.7,
    reviewsCount: 15,
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Flowing accordion pleats create graceful movement in this high-waisted midi skirt, finished with a subtle satin luster and elasticized waistband.',
    details: [
      'Poly-satin blend with permanent knife pleats',
      'Concealed side zipper',
      'High-rise waistline fit',
      'Machine wash gentle / Line dry'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Sage Green', hex: '#8F9779' },
      { name: 'Dusty Rose', hex: '#DCAE96' }
    ],
    inStock: true,
    stockCount: 20,
    badge: 'Sale',
    sku: 'FG-SKT-004'
  },
  {
    id: 'prod-5',
    name: 'Pointed Toe Leather Loafers',
    price: 450,
    category: 'Footwear',
    rating: 4.9,
    reviewsCount: 33,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Sleek and sophisticated loafers featuring a modern pointed toe silhouette, polished gold chain link detail, and cushioned leather footbed for all-day comfort.',
    details: [
      'Smooth Nappa leather upper',
      'Cushioned arch support insole',
      'Genuine leather outsole with rubber heel cap',
      'Gold-plated hardware detailing'
    ],
    sizes: ['36', '37', '38', '39', '40', '41'],
    colors: [
      { name: 'Noir Black', hex: '#111111' },
      { name: 'Ivory Leather', hex: '#F5F5DC' }
    ],
    inStock: true,
    stockCount: 16,
    badge: 'Best Seller',
    sku: 'FG-FW-005'
  },
  {
    id: 'prod-6',
    name: 'Velvet Wrap Evening Dress',
    price: 540,
    originalPrice: 620,
    category: 'Clothing',
    rating: 5.0,
    reviewsCount: 22,
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Rich silk velvet molds to your silhouette in this glamorous wrap dress. Highlighted by a plunging V-neckline, self-tie waist belt, and thigh-high slit.',
    details: [
      'Silk-blend plush velvet',
      'True wrap silhouette with adjustable belt',
      'Floor-length hem with side slit',
      'Dry clean only'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Emerald Green', hex: '#004B23' },
      { name: 'Burgundy Red', hex: '#800020' },
      { name: 'Midnight Blue', hex: '#191970' }
    ],
    inStock: true,
    stockCount: 7,
    badge: 'New',
    sku: 'FG-DRS-006'
  },
  {
    id: 'prod-7',
    name: 'Freshwater Pearl Pendant Necklace',
    price: 280,
    category: 'Accessories',
    rating: 4.8,
    reviewsCount: 17,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'A baroque freshwater pearl suspended on an 18k gold-vermeil delicate paperclip chain. Each natural pearl is uniquely shaped and selected.',
    details: [
      '18k Gold Vermeil over 925 Sterling Silver',
      'Lustrous Grade-A Baroque Freshwater Pearl',
      'Chain length: 45cm + 5cm extension',
      'Hypoallergenic & nickel-free'
    ],
    colors: [
      { name: 'Warm Gold', hex: '#D4AF37' },
      { name: 'Silver White', hex: '#C0C0C0' }
    ],
    inStock: true,
    stockCount: 25,
    badge: 'Featured',
    sku: 'FG-JWL-007'
  },
  {
    id: 'prod-8',
    name: 'Double-Breasted Linen Blazer',
    price: 390,
    originalPrice: 450,
    category: 'Clothing',
    rating: 4.6,
    reviewsCount: 12,
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Lightweight European linen blazer designed for warm weather sophistication. Features structured padded shoulders and tortoise shell buttons.',
    details: [
      '100% Premium Belgian Linen',
      'Breathable viscose lining',
      'Flap pockets and chest welt pocket',
      'Dry clean recommended'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Oatmeal Natural', hex: '#E3D2C2' },
      { name: 'Soft Off-White', hex: '#FAF9F6' }
    ],
    inStock: true,
    stockCount: 18,
    badge: 'Sale',
    sku: 'FG-BLZ-008'
  }
];

export const CURRENCY_RATES: Record<string, { symbol: string; rate: number }> = {
  USD: { symbol: '$', rate: 1.0 },
  EUR: { symbol: '€', rate: 0.92 },
  GBP: { symbol: '£', rate: 0.79 },
  CAD: { symbol: 'CA$', rate: 1.36 }
};
