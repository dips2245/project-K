require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB, prisma } = require('./src/config/db');
const { notFound, errorHandler } = require('./src/middleware/errorHandler');
const { apiLimiter } = require('./src/middleware/rateLimiter');

// Validate critical env vars
if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'bliss_nepal_dev_secret_key_2026') {
  console.warn('\x1b[33m⚠ WARNING: Using default/dev JWT_SECRET. Set a strong secret in production.\x1b[0m');
}
if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET === 'bliss_nepal_dev_secret_key_2026') {
  console.error('\x1b[31m✖ FATAL: Cannot use default JWT_SECRET in production. Set a strong secret.\x1b[0m');
  process.exit(1);
}

const app = express();

// Connect to database
connectDB();

// Middleware
const corsOrigins = (process.env.CORS_ORIGINS || process.env.CLIENT_URL || 'http://localhost:3000').split(',');
app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiLimiter);

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/products', require('./src/routes/productRoutes'));
app.use('/api/categories', require('./src/routes/categoryRoutes'));
app.use('/api/orders', require('./src/routes/orderRoutes'));
app.use('/api/quiz', require('./src/routes/quizRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Bliss Nepal API is running' });
});

// One-time seed trigger (protected by SEED_SECRET)
app.get('/api/seed', async (req, res) => {
  if (req.query.secret !== process.env.SEED_SECRET) {
    return res.status(401).json({ error: 'Invalid seed secret' });
  }
  try {
    const { execSync } = require('child_process');
    const seedPath = path.join(__dirname, 'src/seeds/seed.js');
    const quizPath = path.join(__dirname, 'src/seeds/seedQuiz.js');
    execSync(`node ${seedPath}`, { cwd: __dirname, stdio: 'inherit' });
    execSync(`node ${quizPath}`, { cwd: __dirname, stdio: 'inherit' });
    res.json({ message: 'Seed completed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  server.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  server.close();
  process.exit(0);
});
