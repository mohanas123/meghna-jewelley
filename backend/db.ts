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
    name: 'Kamakshi Royal Nakshi Temple Choker',
    shortDescription: '22K antique matte gold with Goddess Lakshmi relief, uncut rubies and South Sea pearl drops.',
    description: 'An heirloom temple masterpiece hand-carved using 8th-century Chettinad repoussé (nakshi) technique. The central medallion portrays Goddess Lakshmi flanked by sacred elephants, encircled by bezel-set cabochon Burmese rubies and natural basra pearl drops. Each link is hand-soldered with adjustable silk dori string.',
    category: 'Chokers & Necklaces',
    price: 185000, // Offer selling price
    originalPrice: 215000, // Original MRP
    offerBadge: 'Special Offer: 14% Off',
    isDealOfTheDay: true,
    weight: '56.40 grams',
    purity: '22K Antique Hallmarked Gold (916 BIS)',
    gemstones: 'Burmese Cabochon Rubies (4.80 cts), Polki Uncut Diamonds, Natural Seed Pearls',
    craftsmanship: 'Hand-carved Nakshi repoussé relief with antique copper-oxide vintage finish. 74 hours artisan labor.',
    dimensions: 'Length 8.5 in with adjustable threaded cord, Center drop 2.8 in',
    inStock: true,
    stockCount: 4,
    isAntique: true,
    isTrending: true,
    isFeatured: true,
    images: [
      '/images/product_temple_choker.jpg',
      '/images/hero_antique_jewellery.jpg'
    ],
    tags: ['Antique', 'Temple', 'Bridal', 'Bestseller'],
    rating: 4.95,
    reviewCount: 38,
    sku: 'MJ-TMP-NCK-101'
  },
  {
    id: 'mj-102',
    name: 'Padmavathi Jadau Kundan & Emerald Jhumkas',
    shortDescription: 'Vintage matte finish three-tier temple bell jhumkas with Zambian emerald beads and polki studs.',
    description: 'Trending antique jhumkas featuring floral stud tops with uncut flat polki diamonds set in 24k foil Jadau technique. Suspended below is an antique bell-shaped dome engraved with floral filigree and fringed with hand-knotted emerald beads and lustrous freshwater pearls.',
    category: 'Earrings & Jhumkas',
    price: 78500,
    originalPrice: 92000,
    offerBadge: 'Trending Deal: 15% Off',
    isDealOfTheDay: false,
    weight: '34.20 grams (pair)',
    purity: '22K Antique Yellow Gold (916 BIS)',
    gemstones: 'Natural Zambian Emerald Melons (12.4 cts), Syndicate Polki (2.10 cts), Pearl Clusters',
    craftsmanship: 'Traditional Bikaner Jadau setting with antique gold matte sheen.',
    dimensions: 'Height 2.9 in, Bell diameter 1.1 in, Screw back with push closure',
    inStock: true,
    stockCount: 7,
    isAntique: true,
    isTrending: true,
    isFeatured: true,
    images: [
      '/images/product_emerald_jhumkas.jpg'
    ],
    tags: ['Trending', 'Jhumkas', 'Kundan', 'Emerald'],
    rating: 4.92,
    reviewCount: 29,
    sku: 'MJ-ANT-JHM-102'
  },
  {
    id: 'mj-103',
    name: 'Mayur Nakshi Heritage Temple Kada (Pair)',
    shortDescription: 'Solid 22K matte antique gold bangles with twin peacock finials and ruby floral etching.',
    description: 'A timeless statement pair of regal antique bangles. Featuring intricate floral vines etched along the cylindrical shaft and culminating in majestic sculpted peacocks facing each other. Fitted with concealed side screw hinges for effortless wearing without stretching or stress on the gold.',
    category: 'Bangles & Kadas',
    price: 142000,
    originalPrice: 165000,
    offerBadge: 'Save ₹23,000',
    isDealOfTheDay: false,
    weight: '62.80 grams (pair)',
    purity: '22K Hallmarked Gold with Vintage Antique Finish',
    gemstones: 'Natural Rubies (3.2 cts) bezel-set in peacock plumage',
    craftsmanship: 'Heavy hollow-cast core with repoussé embossing and antique patina wash.',
    dimensions: 'Available in standard sizes 2.4, 2.6, 2.8 with safety lock pin',
    inStock: true,
    stockCount: 5,
    isAntique: true,
    isTrending: false,
    isFeatured: true,
    images: [
      '/images/product_heritage_kadas.jpg'
    ],
    tags: ['Antique', 'Bangles', 'Temple Jewelry', 'Heritage'],
    rating: 5.0,
    reviewCount: 19,
    sku: 'MJ-HRT-KDA-103'
  },
  {
    id: 'mj-104',
    name: 'Sultana Emerald & Basra Pearl Jadau Rani Haar',
    shortDescription: 'Trending royal multi-strand emerald bead necklace with ornate antique polki medallion.',
    description: 'The epitome of vintage Mughal and South Indian bridal grandeur. Seven layered strands of calibrated Zambian emerald beads and woven natural seed pearls hold a dramatic 3-inch antique pendant featuring open polki diamonds in closed 24k foil settings with carved emerald drops.',
    category: 'Rani Haars',
    price: 245000,
    originalPrice: 290000,
    offerBadge: 'Bridal Privilege: ₹45,000 Off',
    isDealOfTheDay: true,
    weight: '82.10 grams gross',
    purity: '22K Antique Hallmarked Gold & Sterling Setting',
    gemstones: 'Zambian Emerald Beads (118.5 cts), Natural Basra Seed Pearls (42 cts), Polki (6.8 cts)',
    craftsmanship: 'Master Jadau artisan hand-stringing with handmade zardozi tassel back cord.',
    dimensions: 'Total necklace length 24 in adjustable, Center pendant 3.2 in x 2.4 in',
    inStock: true,
    stockCount: 3,
    isAntique: true,
    isTrending: true,
    isFeatured: true,
    images: [
      '/images/product_rani_haar.jpg',
      '/images/hero_antique_jewellery.jpg'
    ],
    tags: ['Trending', 'Rani Haar', 'Bridal', 'Luxury'],
    rating: 4.98,
    reviewCount: 42,
    sku: 'MJ-ROY-RNH-104'
  },
  {
    id: 'mj-105',
    name: 'Aishwarya Antique Floral Chandbali',
    shortDescription: 'Crescent moon antique ear pendants with uncut polki, seed pearl fringe and ruby highlights.',
    description: 'A celebrated trending design favored by modern royal brides. Delicate openwork gold floral motifs within an antique gold crescent (chand), fringed with micro pearl bunches and teardrop ruby briolettes that sway gracefully with movement.',
    category: 'Earrings & Jhumkas',
    price: 64000,
    originalPrice: 75000,
    offerBadge: '15% Festive Price',
    isDealOfTheDay: false,
    weight: '28.50 grams',
    purity: '22K Antique Gold (916 BIS)',
    gemstones: 'Polki Diamond Simulants & Natural Rubies, Seed Pearls',
    craftsmanship: 'Hand pierced filigree with antique oxidized gold polish.',
    dimensions: 'Length 2.6 in, Width 1.7 in',
    inStock: true,
    stockCount: 8,
    isAntique: true,
    isTrending: true,
    isFeatured: false,
    images: [
      '/images/product_floral_chandbali.jpg',
      '/images/product_emerald_jhumkas.jpg'
    ],
    tags: ['Chandbali', 'Trending', 'Lightweight Antique'],
    rating: 4.88,
    reviewCount: 24,
    sku: 'MJ-ANT-CHB-105'
  },
  {
    id: 'mj-106',
    name: 'Meenakshi Royal Bridal Heirloom Set',
    shortDescription: 'Complete 3-piece antique temple choker, matching jhumkas and maang tikka set.',
    description: 'A grand bridal trousseau package crafted for weddings and auspicious celebrations. Includes the signature Kamakshi Nakshi Choker, matching heavy chandelier jhumkas with ear chains (mattal), and an ornate floral maang tikka. Delivered in Meghna Jewellery handcrafted teakwood velvet presentation box with authenticity certificate.',
    category: 'Bridal Sets',
    price: 310000,
    originalPrice: 375000,
    offerBadge: 'Wedding Trousseau Offer: Save ₹65,000',
    isDealOfTheDay: true,
    weight: '124.60 grams total gold',
    purity: '22K BIS Hallmarked Antique Matte Finish Gold',
    gemstones: 'Burmese Rubies, Zambian Emeralds, Polki & South Sea Pearls',
    craftsmanship: 'Complete artisan coordination across 3 workshops in Tamil Nadu & Rajasthan.',
    dimensions: 'Choker 9 in, Jhumkas 3.2 in with 4.5 in mattal chain, Maang Tikka 5.5 in',
    inStock: true,
    stockCount: 2,
    isAntique: true,
    isTrending: true,
    isFeatured: true,
    images: [
      '/images/product_royal_bridal_set.jpg',
      '/images/product_temple_choker.jpg'
    ],
    tags: ['Bridal Heirloom', 'Full Set', 'Antique Masterpiece'],
    rating: 5.0,
    reviewCount: 16,
    sku: 'MJ-BRD-SET-106'
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
