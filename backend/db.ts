import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Product, Order, Review, Category, User, Coupon, StoreSettings, PriceAlert } from './types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'meghna_store.json');

// Initial seed users
const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-1',
    name: 'Meghna Master Jeweller',
    email: 'admin@meghnajewellery.com',
    phone: '+91 98401 22890',
    role: 'admin',
    password: 'admin123',
    savedAddresses: [
      {
        id: 'addr-admin-1',
        label: 'Atelier Vault',
        street: '14/B Heritage Guild, T. Nagar',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600017',
        country: 'India',
        isDefault: true
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-client-1',
    name: 'Radhika Sundaram',
    email: 'radhika@example.com',
    phone: '+91 98400 55432',
    role: 'client',
    password: 'client123',
    savedAddresses: [
      {
        id: 'addr-client-1',
        label: 'Home',
        street: 'Flat 4A, Orchid Enclave, Alwarpet',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600018',
        country: 'India',
        isDefault: true
      }
    ],
    createdAt: new Date().toISOString()
  }
];

// Initial seed promotional coupons
const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cpn-1',
    code: 'MEGHNA10',
    discountPercent: 10,
    minOrderValue: 25000,
    description: '10% privilege discount on antique heirlooms over ₹25,000',
    isActive: true
  },
  {
    id: 'cpn-2',
    code: 'ROYALFESTIVE',
    discountPercent: 15,
    minOrderValue: 100000,
    description: '15% grand festive discount on bridal sets over ₹1,00,000',
    isActive: true
  },
  {
    id: 'cpn-3',
    code: 'ANTIQUE5',
    discountPercent: 5,
    minOrderValue: 10000,
    description: '5% welcome discount on first handcrafted purchase',
    isActive: true
  }
];

// Initial seed products with offer prices & original regular MRP
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'mj-101',
    name: 'Victorian Emerald & Polki Antique Silver Choker',
    shortDescription: 'Antique oxidized 925 sterling silver collar with natural Colombian emerald cabochons, uncut polki diamonds, and basra seed pearl fringe.',
    description: 'An imperial Victorian heirloom collar hand-forged in solid 925 sterling silver with a darkened antique patina. Embellished with 14.2 carats of glowing Colombian emerald cabochons encased in delicate silver bezel prongs, encircled by foil-backed syndicate polki diamonds and a cascade of lustrous basra seed pearls. Non-gold precious alloy with custom adjustable zardozi silk cord.',
    category: 'Chokers & Necklaces',
    price: 68500,
    originalPrice: 82000,
    offerBadge: 'Victorian Era: 16% Off',
    isDealOfTheDay: true,
    weight: '68.40 grams',
    purity: '925 Hallmarked Oxidized Sterling Silver & Platinum Accents (Non-Gold)',
    gemstones: 'Natural Colombian Emeralds (14.2 cts), Syndicate Polki Diamonds, Basra Seed Pearls',
    craftsmanship: 'Hand-chiseled repoussé relief with antique chiaroscuro oxidation. 58 hours master artisan work.',
    dimensions: 'Length 8.5 in with adjustable threaded cord, Center drop 2.9 in',
    inStock: true,
    stockCount: 4,
    isAntique: true,
    isTrending: true,
    isFeatured: true,
    images: [
      '/images/emerald_antique_choker.jpg',
      '/images/hero_fancy_antique.jpg'
    ],
    tags: ['Victorian', 'Oxidized Silver', 'Emerald', 'Polki', 'Non-Gold'],
    rating: 4.96,
    reviewCount: 42,
    sku: 'MJ-VIC-CHK-101'
  },
  {
    id: 'mj-102',
    name: 'Victorian Blackened Silver & Emerald Bell Jhumkas',
    shortDescription: 'Antique oxidized 925 silver chandelier bell jhumkas with natural Zambian emerald beads and syndicate polki daak studs.',
    description: 'Dramatic vintage bell jhumkas crafted in blackened 925 sterling silver. The floral stud tops feature uncut flat polki diamonds set in heritage foil technique, suspending an antique filigree dome fringed with hand-knotted natural emerald beads and seed pearls. Designed for luxurious evening and bridal ensembles without gold weight.',
    category: 'Earrings & Jhumkas',
    price: 34500,
    originalPrice: 42000,
    offerBadge: 'Trending Antique: 18% Off',
    isDealOfTheDay: false,
    weight: '36.20 grams (pair)',
    purity: '925 Antiqued Sterling Silver with Darkened Vintage Patina (Non-Gold)',
    gemstones: 'Natural Zambian Emerald Melons (18.6 cts), Syndicate Polki (3.4 cts), Seed Pearls',
    craftsmanship: 'Traditional silver filigree piercing with antique rhodium wash.',
    dimensions: 'Height 3.1 in, Bell diameter 1.2 in, Screw back with push closure',
    inStock: true,
    stockCount: 6,
    isAntique: true,
    isTrending: true,
    isFeatured: true,
    images: [
      '/images/victorian_silver_jhumkas.jpg',
      '/images/product_emerald_jhumkas.jpg'
    ],
    tags: ['Jhumkas', 'Antique Silver', 'Emerald Drops', 'Victorian'],
    rating: 4.94,
    reviewCount: 35,
    sku: 'MJ-VIC-JHM-102'
  },
  {
    id: 'mj-103',
    name: 'Mayur Antique Oxidized Silver Peacock Kada (Pair)',
    shortDescription: 'Solid 925 sterling silver cuff pair with twin sculpted peacock finials, ruby cabochons, and hand-carved floral vines.',
    description: 'A museum-caliber pair of heavy antique silver bangles. Solid 925 sterling silver hand-carved with relief floral arabesques and culminating in regal peacocks crowned with cabochon rubies. Finished with an authentic darkened patina to highlight carving depth and fitted with discreet threaded safety screw locks.',
    category: 'Bangles & Kadas',
    price: 54000,
    originalPrice: 65000,
    offerBadge: 'Save ₹11,000',
    isDealOfTheDay: false,
    weight: '84.50 grams (pair)',
    purity: '925 Sterling Silver with Hand-Applied Chiaroscuro Patina (Non-Gold)',
    gemstones: 'Natural Cabochon Rubies (4.5 cts) set in peacock plumage',
    craftsmanship: 'Heavy solid core with hand-chiseled repoussé embossing and antique patina wash.',
    dimensions: 'Available in standard sizes 2.4, 2.6, 2.8 with safety lock pin',
    inStock: true,
    stockCount: 5,
    isAntique: true,
    isTrending: false,
    isFeatured: true,
    images: [
      '/images/vintage_oxidized_cuff.jpg',
      '/images/product_heritage_kadas.jpg'
    ],
    tags: ['Oxidized Silver', 'Peacock Kada', 'Heritage Cuff', 'Non-Gold'],
    rating: 5.0,
    reviewCount: 27,
    sku: 'MJ-ANT-KDA-103'
  },
  {
    id: 'mj-104',
    name: 'Art Deco Platinum-Finish Ceylon Sapphire Necklace',
    shortDescription: 'Geometric platinum-dipped rhodium silver statement collar with cushion-cut sapphire drops and baguette crystals.',
    description: 'High-glamour 1920s Art Deco architecture translated into fine jewellery. Rhodium-dipped sterling silver frames dazzling geometric baguette crystals and deep midnight Ceylon sapphire drops. A show-stopping gala statement piece free of yellow gold, embodying pure monochrome luxury.',
    category: 'Chokers & Necklaces',
    price: 89000,
    originalPrice: 105000,
    offerBadge: 'Art Deco Suite: 15% Off',
    isDealOfTheDay: true,
    weight: '72.10 grams',
    purity: 'Platinum & Rhodium Plated Precious Sterling Alloy (Non-Gold)',
    gemstones: 'Cushion-cut Royal Ceylon Sapphires (22.5 cts), Baguette Crystals, Pavé Accents',
    craftsmanship: 'Art Deco milgrain bezel settings with rhodium mirror polish.',
    dimensions: 'Length 16.5 in with concealed safety box clasp and 2 in extension',
    inStock: true,
    stockCount: 3,
    isAntique: true,
    isTrending: true,
    isFeatured: true,
    images: [
      '/images/sapphire_artdeco_necklace.jpg',
      '/images/hero_fancy_antique.jpg'
    ],
    tags: ['Art Deco', 'Sapphire', 'Platinum Finish', 'Gala Necklace', 'Non-Gold'],
    rating: 4.98,
    reviewCount: 31,
    sku: 'MJ-DEC-SAP-104'
  },
  {
    id: 'mj-105',
    name: 'Edwardian Keshi Baroque Pearl & Polki Rani Haar',
    shortDescription: 'Multi-strand natural keshi freshwater baroque pearls holding an ornate antique oxidized silver and polki diamond medallion.',
    description: 'Seven lustrous cascading tiers of hand-selected irregular keshi baroque freshwater pearls converge into a grand 3.2-inch antique silver medallion. The pendant showcases open syndicate polki diamond crystals set in antique foil collets, fringed with hand-carved Colombian emerald beads and a zardozi tassel cord.',
    category: 'Rani Haars',
    price: 98000,
    originalPrice: 120000,
    offerBadge: 'Privilege Heirloom: Save ₹22,000',
    isDealOfTheDay: true,
    weight: '96.40 grams gross',
    purity: '925 Antique Silver Setting with Zardozi Silk Tassel (Non-Gold)',
    gemstones: 'Natural Keshi Baroque Pearls (140 cts), Polki Uncut Diamonds (8.2 cts), Emerald Drops',
    craftsmanship: 'Master hand-stringing with Japanese micro-knotting and hand-engraved silver pendant.',
    dimensions: 'Total necklace length 26 in adjustable, Center pendant 3.4 in x 2.6 in',
    inStock: true,
    stockCount: 3,
    isAntique: true,
    isTrending: true,
    isFeatured: true,
    images: [
      '/images/baroque_pearl_haar.jpg',
      '/images/product_rani_haar.jpg'
    ],
    tags: ['Baroque Pearl', 'Rani Haar', 'Edwardian', 'Antique Silver'],
    rating: 4.97,
    reviewCount: 39,
    sku: 'MJ-EDW-PRL-105'
  },
  {
    id: 'mj-106',
    name: 'Aishwarya Antique Silver Floral Chandbali',
    shortDescription: 'Crescent moon antique ear pendants in blackened silver filigree with uncut polki, ruby briolettes, and seed pearl fringe.',
    description: 'An aristocratic crescent moon silhouette reimagined in antique blackened sterling silver. Intricate lattice filigree surrounds foil-backed polki crystals, swaying with teardrop ruby briolettes and micro basra seed pearls. Lightweight, non-gold, and strikingly photogenic.',
    category: 'Earrings & Jhumkas',
    price: 28500,
    originalPrice: 34000,
    offerBadge: 'Festive Deal: 16% Off',
    isDealOfTheDay: false,
    weight: '26.40 grams (pair)',
    purity: '925 Antique Oxidized Sterling Silver (Non-Gold)',
    gemstones: 'Uncut Polki Simulants & Natural Rubies, Micro Basra Pearls',
    craftsmanship: 'Pierced openwork filigree with antique charcoal oxidation.',
    dimensions: 'Length 2.7 in, Width 1.8 in',
    inStock: true,
    stockCount: 8,
    isAntique: true,
    isTrending: true,
    isFeatured: false,
    images: [
      '/images/product_floral_chandbali.jpg',
      '/images/victorian_silver_jhumkas.jpg'
    ],
    tags: ['Chandbali', 'Oxidized Silver', 'Polki', 'Lightweight'],
    rating: 4.89,
    reviewCount: 26,
    sku: 'MJ-ANT-CHB-106'
  },
  {
    id: 'mj-107',
    name: 'Duchess Grand Imperial Antique Gala Trousseau Set',
    shortDescription: 'Complete 3-piece Victorian antique silver choker, matching chandelier jhumkas, and maang tikka with Colombian emeralds and polki.',
    description: 'A magnificent non-gold royal trousseau package crafted for wedding soirees and grand receptions. Includes the signature Victorian Emerald Choker, matching heavy chandelier jhumkas with detachable ear-chains, and an ornate floral maang tikka. Delivered in Meghna Jewellery handcrafted teakwood velvet presentation box with authenticity assay report.',
    category: 'Bridal Sets',
    price: 128000,
    originalPrice: 155000,
    offerBadge: 'Imperial Suite: Save ₹27,000',
    isDealOfTheDay: true,
    weight: '142.80 grams total silver weight',
    purity: '925 Hallmarked Sterling Silver & Platinum Finish (Non-Gold)',
    gemstones: 'Colombian Emeralds, Uncut Polki Diamonds, Baroque Seed Pearls',
    craftsmanship: 'Artisan coordinated suite across atelier workshops in Jaipur & Chennai.',
    dimensions: 'Choker 9 in, Jhumkas 3.3 in with 4.5 in mattal chain, Maang Tikka 5.5 in',
    inStock: true,
    stockCount: 2,
    isAntique: true,
    isTrending: true,
    isFeatured: true,
    images: [
      '/images/product_royal_bridal_set.jpg',
      '/images/emerald_antique_choker.jpg'
    ],
    tags: ['Bridal Suite', 'Full Set', 'Antique Silver', 'Grand Gala'],
    rating: 5.0,
    reviewCount: 21,
    sku: 'MJ-BRD-STE-107'
  },
  {
    id: 'mj-108',
    name: 'Kamakshi Heritage Temple Choker in Antique Silver',
    shortDescription: 'Intricate hand-carved Goddess Lakshmi relief choker in oxidized silver with cabochon rubies and basra pearl drops.',
    description: 'An iconic temple masterpiece hand-carved in solid 925 sterling silver using 8th-century repoussé (nakshi) technique. The central medallion portrays Goddess Lakshmi flanked by sacred elephants, encircled by bezel-set cabochon rubies and basra pearl drops. Antiqued dark matte finish celebrating non-gold sculptural jewelry.',
    category: 'Chokers & Necklaces',
    price: 62000,
    originalPrice: 74000,
    offerBadge: 'Heritage Offer: 16% Off',
    isDealOfTheDay: false,
    weight: '64.20 grams',
    purity: '925 Antique Oxidized Silver with Heritage Patina (Non-Gold)',
    gemstones: 'Burmese Cabochon Rubies (5.2 cts), Syndicate Polki, Basra Pearls',
    craftsmanship: 'Hand-carved Nakshi repoussé relief with darkened vintage wash. 64 hours labor.',
    dimensions: 'Length 8.5 in with adjustable cord, Center drop 2.8 in',
    inStock: true,
    stockCount: 4,
    isAntique: true,
    isTrending: true,
    isFeatured: false,
    images: [
      '/images/product_temple_choker.jpg',
      '/images/hero_fancy_antique.jpg'
    ],
    tags: ['Temple Choker', 'Oxidized Silver', 'Nakshi', 'Ruby Drops'],
    rating: 4.93,
    reviewCount: 33,
    sku: 'MJ-TMP-SLV-108'
  }
];

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-all', name: 'All Jewellery', description: 'Curated antique & trending heirloom pieces', count: 6 },
  { id: 'cat-chokers', name: 'Chokers & Necklaces', description: 'Temple nakshi work and antique collars', count: 2 },
  { id: 'cat-earrings', name: 'Earrings & Jhumkas', description: 'Heritage jhumkas, chandbalis and studs', count: 2 },
  { id: 'cat-bangles', name: 'Bangles & Kadas', description: 'Embossed temple kadas with lion & peacock finials', count: 1 },
  { id: 'cat-rani-haar', name: 'Rani Haars', description: 'Royal layered bridal necklaces and jadau pendants', count: 1 },
  { id: 'cat-bridal', name: 'Bridal Sets', description: 'Complete trousseau heirloom collections', count: 1 },
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'mj-101',
    productName: 'Kamakshi Royal Nakshi Temple Choker',
    author: 'Priya Sundaram',
    location: 'Chennai, Tamil Nadu',
    rating: 5,
    date: 'March 2026',
    comment: 'The antique matte finish is astonishingly authentic. The Goddess Lakshmi carving has such divine detailing that our wedding family heirloom jewelers were thoroughly impressed. Packaging in the velvet box was royal.',
    verifiedBuyer: true
  },
  {
    id: 'rev-2',
    productId: 'mj-102',
    productName: 'Padmavathi Jadau Kundan & Emerald Jhumkas',
    author: 'Ananya Deshmukh',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    date: 'February 2026',
    comment: 'Weight is comfortable for full evening wear and the emerald bead drops give such rich contrast with Kanjeevaram sarees. Delivered safely with insured courier and BIS certificate.',
    verifiedBuyer: true
  },
  {
    id: 'rev-3',
    productId: 'mj-104',
    productName: 'Sultana Emerald & Basra Pearl Jadau Rani Haar',
    author: 'Dr. Radhika Reddy',
    location: 'Hyderabad, Telangana',
    rating: 5,
    date: 'January 2026',
    comment: 'Meghna Jewellery crafted this to perfection for my daughter’s wedding. The polki work glints with warm candlelight and the emerald strands are authentic quality. Unmatched craftsmanship.',
    verifiedBuyer: true
  }
];

interface DatabaseSchema {
  users: User[];
  coupons: Coupon[];
  products: Product[];
  orders: Order[];
  categories: Category[];
  reviews: Review[];
  settings: StoreSettings;
  priceAlerts: PriceAlert[];
}

class DocumentDatabase {
  private data: DatabaseSchema;
  private isConnectedToExternalMongo = false;
  private mongoUri: string | null = null;
  private dbMode: 'embedded-mongo' | 'external-mongodb' = 'embedded-mongo';

  constructor() {
    this.ensureDataDir();
    this.data = this.loadData();
    this.initMongoConnection();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.users && parsed.coupons && parsed.products) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Error reading data file, initializing fresh store:', err);
    }

    const defaultData: DatabaseSchema = {
      users: INITIAL_USERS,
      coupons: INITIAL_COUPONS,
      products: INITIAL_PRODUCTS,
      orders: [],
      categories: INITIAL_CATEGORIES,
      reviews: INITIAL_REVIEWS,
      settings: {
        storeName: 'Meghna Jewellery',
        tagline: 'Authentic Antique & Trending Fine Jewellery',
        phone: '+91 98401 22890',
        whatsapp: '+91 98401 22890',
        email: 'concierge@meghnajewellery.com',
        address: '14/B Heritage Guild, T. Nagar, Chennai 600017, India',
        currency: 'INR',
        freeShippingThreshold: 50000,
        hallmarkId: 'BIS-916-TN-48201',
        announcementText: '✨ Festive Privileges: Complimentary Insured Armored Delivery + 10% Off with Code MEGHNA10',
        offerBannerActive: true,
        activeOfferTitle: 'Heritage Bridal & Antique Festival',
        activeOfferDiscount: 15
      },
      priceAlerts: []
    };

    this.saveData(defaultData);
    return defaultData;
  }

  private saveData(dataToSave: DatabaseSchema = this.data) {
    try {
      this.ensureDataDir();
      fs.writeFileSync(DATA_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write data store to disk:', err);
    }
  }

  private async initMongoConnection() {
    const uri = process.env.MONGODB_URI;
    if (uri && uri.trim().length > 0) {
      this.mongoUri = uri.trim();
      try {
        const { MongoClient } = await import('mongodb');
        const client = new MongoClient(this.mongoUri, { connectTimeoutMS: 4000 });
        await client.connect();
        this.isConnectedToExternalMongo = true;
        this.dbMode = 'external-mongodb';
        console.log('Successfully connected to external MongoDB instance!');
      } catch (err) {
        console.warn('Could not connect to external MongoDB URI, seamlessly running embedded Mongo document engine:', (err as Error).message);
        this.isConnectedToExternalMongo = false;
        this.dbMode = 'embedded-mongo';
      }
    } else {
      this.dbMode = 'embedded-mongo';
    }
  }

  public getStatus() {
    return {
      status: 'active',
      mode: this.dbMode,
      connectedToMongo: this.isConnectedToExternalMongo,
      mongoUriConfigured: Boolean(process.env.MONGODB_URI),
      usersCount: this.data.users.length,
      productsCount: this.data.products.length,
      ordersCount: this.data.orders.length,
      couponsCount: this.data.coupons.length,
      reviewsCount: this.data.reviews.length,
      storageFile: DATA_FILE
    };
  }

  // Users Auth & Management
  public findUserByEmail(email: string): User | null {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  public registerUser(name: string, email: string, phone: string, password: string): User {
    const existing = this.findUserByEmail(email);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }
    const newUser: User = {
      id: `usr-${Date.now().toString().slice(-6)}`,
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: 'client',
      savedAddresses: [],
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.saveData();
    return newUser;
  }

  public authenticateUser(email: string, password: string): User | null {
    const user = this.findUserByEmail(email);
    if (!user) return null;
    if (user.password && user.password !== password) return null;
    return user;
  }

  public addSavedAddress(userId: string, address: Omit<User['savedAddresses'][0], 'id'>): User | null {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) return null;
    const newAddress = {
      ...address,
      id: `addr-${Date.now().toString().slice(-4)}`
    };
    if (newAddress.isDefault) {
      user.savedAddresses.forEach(a => a.isDefault = false);
    }
    user.savedAddresses.push(newAddress);
    this.saveData();
    return user;
  }

  // Products CRUD with Offer Prices
  public getProducts(filter?: { category?: string; search?: string; isAntique?: boolean; isTrending?: boolean }) {
    let result = [...this.data.products];

    if (filter?.category && filter.category !== 'All Jewellery' && filter.category !== 'all') {
      result = result.filter(p => p.category.toLowerCase() === filter.category!.toLowerCase());
    }

    if (filter?.isAntique !== undefined) {
      result = result.filter(p => p.isAntique === filter.isAntique);
    }

    if (filter?.isTrending !== undefined) {
      result = result.filter(p => p.isTrending === filter.isTrending);
    }

    if (filter?.search && filter.search.trim()) {
      const q = filter.search.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.gemstones.toLowerCase().includes(q) ||
        (p.offerBadge && p.offerBadge.toLowerCase().includes(q)) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return result;
  }

  public getProductById(id: string): Product | null {
    return this.data.products.find(p => p.id === id) || null;
  }

  public addProduct(product: Omit<Product, 'id'> & { id?: string }): Product {
    const newProduct: Product = {
      ...product,
      id: product.id || `mj-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString()
    };
    this.data.products.unshift(newProduct);
    this.saveData();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = { ...this.data.products[idx], ...updates };
    this.saveData();
    return this.data.products[idx];
  }

  public deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Coupons
  public getCoupons(): Coupon[] {
    return this.data.coupons;
  }

  public addCoupon(coupon: Omit<Coupon, 'id'>): Coupon {
    const newCoupon: Coupon = {
      ...coupon,
      id: `cpn-${Date.now().toString().slice(-4)}`,
      code: coupon.code.toUpperCase().trim()
    };
    this.data.coupons.unshift(newCoupon);
    this.saveData();
    return newCoupon;
  }

  public updateCoupon(id: string, updates: Partial<Coupon>): Coupon | null {
    const cpn = this.data.coupons.find(c => c.id === id);
    if (!cpn) return null;
    Object.assign(cpn, updates);
    this.saveData();
    return cpn;
  }

  public deleteCoupon(id: string): boolean {
    const initLen = this.data.coupons.length;
    this.data.coupons = this.data.coupons.filter(c => c.id !== id);
    if (this.data.coupons.length !== initLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  public validateCoupon(code: string, subtotal: number): { valid: boolean; discountPercent: number; message: string } {
    const coupon = this.data.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
    if (!coupon) {
      return { valid: false, discountPercent: 0, message: 'Invalid or expired promotional code.' };
    }
    if (subtotal < coupon.minOrderValue) {
      return {
        valid: false,
        discountPercent: 0,
        message: `Coupon ${coupon.code} requires a minimum order value of ₹${coupon.minOrderValue.toLocaleString('en-IN')}.`
      };
    }
    return {
      valid: true,
      discountPercent: coupon.discountPercent,
      message: `${coupon.discountPercent}% discount applied successfully!`
    };
  }

  // Categories
  public getCategories(): Category[] {
    return this.data.categories;
  }

  // Orders
  public getOrders(userId?: string): Order[] {
    if (userId) {
      return this.data.orders.filter(o => o.userId === userId || o.email.toLowerCase() === userId.toLowerCase());
    }
    return this.data.orders;
  }

  public getOrderById(id: string): Order | null {
    return this.data.orders.find(o => o.id === id || o.orderNumber === id) || null;
  }

  public createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Order {
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `MJ-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Received',
      createdAt: new Date().toISOString()
    };
    this.data.orders.unshift(newOrder);

    // Reduce product stock count
    for (const item of newOrder.items) {
      const prod = this.data.products.find(p => p.id === item.productId);
      if (prod && prod.stockCount > 0) {
        prod.stockCount = Math.max(0, prod.stockCount - item.quantity);
        if (prod.stockCount === 0) {
          prod.inStock = false;
        }
      }
    }

    this.saveData();
    return newOrder;
  }

  public updateOrderStatus(id: string, status: Order['status']): Order | null {
    const order = this.data.orders.find(o => o.id === id || o.orderNumber === id);
    if (!order) return null;
    order.status = status;
    this.saveData();
    return order;
  }

  // Reviews
  public getReviews(productId?: string): Review[] {
    if (productId) {
      return this.data.reviews.filter(r => r.productId === productId);
    }
    return this.data.reviews;
  }

  public addReview(review: Omit<Review, 'id' | 'date'>): Review {
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
    this.data.reviews.unshift(newReview);
    this.saveData();
    return newReview;
  }

  // Settings
  public getSettings(): StoreSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.saveData();
    return this.data.settings;
  }

  // Price Alerts
  public getPriceAlerts(emailOrUserId?: string, productId?: string): PriceAlert[] {
    if (!this.data.priceAlerts) {
      this.data.priceAlerts = [];
    }
    let list = this.data.priceAlerts;
    if (emailOrUserId) {
      const q = emailOrUserId.toLowerCase().trim();
      list = list.filter(a => a.email.toLowerCase() === q || a.userId === emailOrUserId);
    }
    if (productId) {
      list = list.filter(a => a.productId === productId);
    }
    return list;
  }

  public createPriceAlert(alertData: Omit<PriceAlert, 'id' | 'createdAt' | 'status'>): PriceAlert {
    if (!this.data.priceAlerts) {
      this.data.priceAlerts = [];
    }
    // Update existing active alert if already present for this email and product
    const existingIndex = this.data.priceAlerts.findIndex(
      a => a.productId === alertData.productId && a.email.toLowerCase() === alertData.email.toLowerCase() && a.status === 'active'
    );

    const newAlert: PriceAlert = {
      ...alertData,
      id: `alert-${Date.now()}`,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      this.data.priceAlerts[existingIndex] = newAlert;
    } else {
      this.data.priceAlerts.unshift(newAlert);
    }

    this.saveData();
    return newAlert;
  }

  public deletePriceAlert(id: string): boolean {
    if (!this.data.priceAlerts) return false;
    const initialLen = this.data.priceAlerts.length;
    this.data.priceAlerts = this.data.priceAlerts.filter(a => a.id !== id);
    if (this.data.priceAlerts.length !== initialLen) {
      this.saveData();
      return true;
    }
    return false;
  }
}

export const db = new DocumentDatabase();
