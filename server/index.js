import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const DATA_DIR = path.join(__dirname, 'data');

const PORT = Number(process.env.API_PORT) || 3001;
const NORMAL_RATE = 0.02;
const EXPRESS_RATE = 0.04;

fs.mkdirSync(UPLOADS_DIR, { recursive: true });
fs.mkdirSync(DATA_DIR, { recursive: true });

const orders = new Map();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.doc', '.docx', '.pdf', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${ext || '(none)'}`));
    }
  },
});

function calculateTotal(wordCount, tier) {
  const count = Number(wordCount) || 0;
  const rate = tier === 'express' ? EXPRESS_RATE : NORMAL_RATE;
  return Number((count * rate).toFixed(2));
}

function persistOrders() {
  const snapshot = Object.fromEntries(orders);
  fs.writeFileSync(path.join(DATA_DIR, 'orders.json'), JSON.stringify(snapshot, null, 2));
}

function loadOrders() {
  const file = path.join(DATA_DIR, 'orders.json');
  if (!fs.existsSync(file)) return;
  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const [id, order] of Object.entries(parsed)) {
      orders.set(id, order);
    }
  } catch {
    console.warn('Could not load orders.json; starting fresh.');
  }
}

loadOrders();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'proproof-local-api',
    orders: orders.size,
    uploadsDir: UPLOADS_DIR,
  });
});

app.get('/api/orders', (_req, res) => {
  res.json({
    orders: [...orders.values()].map((o) => ({
      id: o.id,
      name: o.name,
      email: o.email,
      tier: o.tier,
      wordCount: o.wordCount,
      totalCost: o.totalCost,
      status: o.status,
      createdAt: o.createdAt,
      paidAt: o.paidAt,
    })),
  });
});

app.get('/api/orders/:id', (req, res) => {
  const order = orders.get(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  const { filePath, ...safe } = order;
  res.json({ order: { ...safe, fileName: path.basename(filePath) } });
});

app.post('/api/orders', upload.single('file'), (req, res) => {
  try {
    const { name, email, notes, tier, wordCount } = req.body;

    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Document file is required' });
    }

    const id = randomUUID();
    const totalCost = calculateTotal(wordCount, tier);
    const order = {
      id,
      name: name.trim(),
      email: email.trim(),
      notes: notes?.trim() || '',
      tier: tier === 'express' ? 'express' : 'normal',
      wordCount: Number(wordCount) || 0,
      totalCost,
      status: 'pending_payment',
      filePath: req.file.path,
      originalFileName: req.file.originalname,
      createdAt: new Date().toISOString(),
      paidAt: null,
    };

    orders.set(id, order);
    persistOrders();

    res.status(201).json({
      order: {
        id: order.id,
        name: order.name,
        email: order.email,
        notes: order.notes,
        tier: order.tier,
        wordCount: order.wordCount,
        totalCost: order.totalCost,
        status: order.status,
        originalFileName: order.originalFileName,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create order' });
  }
});

app.post('/api/orders/:id/pay', (req, res) => {
  const order = orders.get(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  if (order.status === 'paid') {
    return res.json({ order: { id: order.id, status: order.status, paidAt: order.paidAt } });
  }

  // Mock payment gateway — always succeeds locally after a short delay
  const delayMs = Number(process.env.MOCK_PAYMENT_DELAY_MS) || 800;
  setTimeout(() => {
    order.status = 'paid';
    order.paidAt = new Date().toISOString();
    orders.set(order.id, order);
    persistOrders();
  }, delayMs);

  res.json({
    order: {
      id: order.id,
      status: 'processing',
      message: 'Mock payment accepted',
    },
  });
});

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  res.status(400).json({ error: err.message || 'Bad request' });
});

app.listen(PORT, () => {
  console.log(`ProProof local API listening on http://localhost:${PORT}`);
  console.log(`  Health:  http://localhost:${PORT}/api/health`);
  console.log(`  Uploads: ${UPLOADS_DIR}`);
});
