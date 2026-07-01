require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB, prisma } = require('./src/config/db');
const { notFound, errorHandler } = require('./src/middleware/errorHandler');
const { apiLimiter } = require('./src/middleware/rateLimiter');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Bliss Nepal API is running' });
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
