const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { prisma } = require('../config/db');

router.get('/audit-logs', protect, adminOnly, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
      prisma.auditLog.count(),
    ]);

    res.json({ logs, page, totalPages: Math.ceil(total / limit), total });
  } catch (error) {
    next(error);
  }
});

// ─── User Management ───────────────────────────────────────────────

router.get('/users', protect, adminOnly, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const where = search
      ? { OR: [{ name: { contains: search } }, { email: { contains: search } }] }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, name: true, email: true, role: true, phone: true,
          isVerified: true, termsAccepted: true, favorites: true,
          createdAt: true,
          _count: { select: { orders: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    const mapped = users.map(u => ({
      ...u,
      _id: u.id, id: undefined,
      orderCount: u._count.orders, _count: undefined,
    }));

    res.json({ users: mapped, page, totalPages: Math.ceil(total / limit), total });
  } catch (error) {
    next(error);
  }
});

router.get('/users/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true, name: true, email: true, role: true, phone: true,
        isVerified: true, termsAccepted: true, favorites: true,
        createdAt: true,
      },
    });
    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }

    const [orders, favoriteProducts] = await Promise.all([
      prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: { items: true },
      }),
      prisma.product.findMany({
        where: { id: { in: Array.isArray(user.favorites) ? user.favorites : [] } },
        select: { id: true, nameEn: true, slug: true, price: true, images: true },
      }),
    ]);

    res.json({
      _id: user.id, id: undefined,
      ...user,
      orders: orders.map(o => ({
        _id: o.id,
        orderNumber: `BN-${o.id.slice(0, 8).toUpperCase()}`,
        totalAmount: Number(o.totalAmount),
        status: o.status,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        items: o.items,
        createdAt: o.createdAt,
      })),
      favoriteProducts,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/users/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const { name, email, role, phone, isVerified } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (role !== undefined) data.role = role;
    if (phone !== undefined) data.phone = phone;
    if (isVerified !== undefined) data.isVerified = isVerified;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: { id: true, name: true, email: true, role: true, phone: true, isVerified: true },
    });
    res.json({ _id: user.id, ...user, id: undefined });
  } catch (error) {
    next(error);
  }
});

router.delete('/users/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }
    if (user.role === 'admin') {
      res.status(403);
      return next(new Error('Cannot delete admin accounts'));
    }
    const id = req.params.id;
    await prisma.quizRecommendation.deleteMany({ where: { response: { userId: id } } });
    await prisma.quizAnswer.deleteMany({ where: { response: { userId: id } } });
    await prisma.quizResponse.deleteMany({ where: { userId: id } });
    await prisma.orderItem.deleteMany({ where: { order: { userId: id } } });
    await prisma.order.deleteMany({ where: { userId: id } });
    await prisma.user.delete({ where: { id } });
    res.json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
});

// ─── Admin Profile (self-service) ──────────────────────────────

router.get('/profile', protect, adminOnly, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
    });
    if (!user) {
      res.status(404);
      return next(new Error('Admin not found'));
    }
    res.json({ _id: user.id, ...user, id: undefined });
  } catch (error) {
    next(error);
  }
});

router.put('/profile', protect, adminOnly, async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (email !== undefined) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing && existing.id !== req.user.id) {
        res.status(409);
        return next(new Error('Email already in use by another account'));
      }
      data.email = email;
    }

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'UPDATE_PROFILE',
        resource: 'admin',
        resourceId: req.user.id,
        details: JSON.stringify({ changes: Object.keys(data) }),
        ipAddress: req.ip,
      },
    });

    res.json({ _id: updated.id, ...updated, id: undefined });
  } catch (error) {
    next(error);
  }
});

// ─── Settings ──────────────────────────────────────────────────

router.get('/settings/whatsapp', protect, adminOnly, async (req, res, next) => {
  try {
    const setting = await prisma.$queryRawUnsafe("SELECT value FROM settings WHERE key = 'whatsapp_number' LIMIT 1");
    const number = setting.length > 0 ? setting[0].value : '9779800000000';
    res.json({ number });
  } catch (error) {
    next(error);
  }
});

router.put('/settings/whatsapp', protect, adminOnly, async (req, res, next) => {
  try {
    const { number } = req.body;
    if (!number || !/^\d{10,15}$/.test(number)) {
      res.status(400);
      return next(new Error('Invalid WhatsApp number. Must be digits only (e.g. 9779800000000)'));
    }
    await prisma.$executeRawUnsafe("UPDATE settings SET value = ? WHERE key = 'whatsapp_number'", number);
    res.json({ number });
  } catch (error) {
    next(error);
  }
});

// Public endpoint to get WhatsApp number (no auth needed)
router.get('/settings/whatsapp/public', async (req, res, next) => {
  try {
    const setting = await prisma.$queryRawUnsafe("SELECT value FROM settings WHERE key = 'whatsapp_number' LIMIT 1");
    const number = setting.length > 0 ? setting[0].value : '9779800000000';
    res.json({ number });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
