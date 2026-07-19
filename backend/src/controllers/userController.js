const bcrypt = require('bcryptjs');
const { prisma } = require('../config/db');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
    });
    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }
    res.json({ _id: user.id, ...user, id: undefined });
  } catch (error) {
    next(error);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: { include: { product: { select: { slug: true, images: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders.map(o => ({
      _id: o.id,
      orderNumber: `BN-${o.id.slice(0, 8).toUpperCase()}`,
      totalAmount: Number(o.totalAmount),
      status: o.status,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      items: o.items.map(i => ({
        productId: i.productId,
        name: i.name,
        image: i.image,
        price: Number(i.price),
        quantity: i.quantity,
        slug: i.product.slug,
      })),
      createdAt: o.createdAt,
    })));
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      res.status(400);
      return next(new Error('Current password is incorrect'));
    }
    const salt = await bcrypt.genSalt(12);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: await bcrypt.hash(newPassword, salt) },
    });
    res.json({ message: 'Password updated' });
  } catch (error) {
    next(error);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      res.status(403);
      return next(new Error('Admin accounts cannot be deleted. Contact the system administrator.'));
    }
    const userId = req.user.id;
    await prisma.quizRecommendation.deleteMany({ where: { response: { userId } } });
    await prisma.quizAnswer.deleteMany({ where: { response: { userId } } });
    await prisma.quizResponse.deleteMany({ where: { userId } });
    await prisma.orderItem.deleteMany({ where: { order: { userId } } });
    await prisma.order.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
    res.json({ message: 'Account and associated data deleted' });
  } catch (error) {
    next(error);
  }
};
