import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { db } from './db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health and System Diagnostics
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Meghna Jewellery API',
      timestamp: new Date().toISOString(),
      database: db.getStatus()
    });
  });

  // Client Authentication Routes
  app.post('/api/auth/register', (req, res) => {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    try {
      const user = db.registerUser(name, email, phone || '', password);
      const { password: _, ...safeUser } = user;
      res.status(201).json(safeUser);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const user = db.authenticateUser(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const { password: _, ...safeUser } = user;
    res.json(safeUser);
  });

  app.post('/api/auth/address', (req, res) => {
    const { userId, address } = req.body;
    if (!userId || !address) {
      return res.status(400).json({ error: 'User ID and address are required.' });
    }
    const updated = db.addSavedAddress(userId, address);
    if (!updated) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const { password: _, ...safeUser } = updated;
    res.json(safeUser);
  });

  // Products CRUD
  app.get('/api/products', (req, res) => {
    const { category, search, isAntique, isTrending } = req.query;
    const filter: { category?: string; search?: string; isAntique?: boolean; isTrending?: boolean } = {};
    if (typeof category === 'string') filter.category = category;
    if (typeof search === 'string') filter.search = search;
    if (isAntique === 'true') filter.isAntique = true;
    if (isAntique === 'false') filter.isAntique = false;
    if (isTrending === 'true') filter.isTrending = true;
    if (isTrending === 'false') filter.isTrending = false;

    const products = db.getProducts(filter);
    res.json(products);
  });

  app.get('/api/products/:id', (req, res) => {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json(product);
  });

  app.post('/api/products', (req, res) => {
    try {
      const created = db.addProduct(req.body);
      res.status(201).json(created);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  });

  app.put('/api/products/:id', (req, res) => {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json(updated);
  });

  app.delete('/api/products/:id', (req, res) => {
    const success = db.deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json({ success: true, message: 'Product deleted successfully.' });
  });

  // Coupons & Offer Validation
  app.get('/api/coupons', (_req, res) => {
    res.json(db.getCoupons());
  });

  app.post('/api/coupons/validate', (req, res) => {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ valid: false, discountPercent: 0, message: 'Please provide a coupon code.' });
    }
    const result = db.validateCoupon(code, Number(subtotal) || 0);
    res.json(result);
  });

  app.post('/api/coupons', (req, res) => {
    try {
      const created = db.addCoupon(req.body);
      res.status(201).json(created);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  });

  app.patch('/api/coupons/:id', (req, res) => {
    const updated = db.updateCoupon(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Coupon not found.' });
    }
    res.json(updated);
  });

  app.delete('/api/coupons/:id', (req, res) => {
    const success = db.deleteCoupon(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Coupon not found.' });
    }
    res.json({ success: true, message: 'Coupon deleted.' });
  });

  // Categories
  app.get('/api/categories', (_req, res) => {
    res.json(db.getCategories());
  });

  // Orders
  app.get('/api/orders', (req, res) => {
    const userId = req.query.userId as string | undefined;
    res.json(db.getOrders(userId));
  });

  app.get('/api/orders/:id', (req, res) => {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    res.json(order);
  });

  app.post('/api/orders', (req, res) => {
    try {
      const order = db.createOrder(req.body);
      res.status(201).json(order);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  });

  app.patch('/api/orders/:id/status', (req, res) => {
    const { status } = req.body;
    const updated = db.updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    res.json(updated);
  });

  // Reviews
  app.get('/api/reviews', (req, res) => {
    const productId = req.query.productId as string | undefined;
    res.json(db.getReviews(productId));
  });

  app.post('/api/reviews', (req, res) => {
    try {
      const review = db.addReview(req.body);
      res.status(201).json(review);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  });

  // Price Alerts
  app.get('/api/price-alerts', (req, res) => {
    const { email, userId, productId } = req.query;
    const identifier = (email as string) || (userId as string);
    res.json(db.getPriceAlerts(identifier, productId as string));
  });

  app.post('/api/price-alerts', (req, res) => {
    const { productId, productName, productImage, currentPrice, targetPrice, email, userId } = req.body;
    if (!productId || !email || !targetPrice) {
      return res.status(400).json({ error: 'Product ID, email, and target price are required.' });
    }
    if (Number(targetPrice) >= Number(currentPrice)) {
      return res.status(400).json({ error: 'Target threshold must be lower than the current price.' });
    }

    try {
      const alert = db.createPriceAlert({
        productId,
        productName: productName || 'Jewellery Heirloom',
        productImage: productImage || '',
        currentPrice: Number(currentPrice),
        targetPrice: Number(targetPrice),
        email: email.trim().toLowerCase(),
        userId
      });
      res.status(201).json(alert);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  });

  app.delete('/api/price-alerts/:id', (req, res) => {
    const success = db.deletePriceAlert(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Price alert not found.' });
    }
    res.json({ success: true, message: 'Price alert cancelled successfully.' });
  });

  // Store Settings & Offers
  app.get('/api/settings', (_req, res) => {
    res.json(db.getSettings());
  });

  app.patch('/api/settings', (req, res) => {
    res.json(db.updateSettings(req.body));
  });

  // Static Images Serving
  app.use('/images', express.static(path.resolve(__dirname, '../public/images')));
  app.use('/images', express.static(path.resolve(__dirname, '../dist/images')));

  // Dev vs Prod Vite Integration
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '../dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ Meghna Jewellery server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
