const { prisma } = require('../config/db');

exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, notes } = req.body;
    if (!items || items.length === 0) {
      res.status(400);
      return next(new Error('No items in order'));
    }
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        shippingAddress,
        paymentMethod: paymentMethod || 'cod',
        totalAmount,
        notes: notes || null,
        whatsappRedirected: paymentMethod === 'whatsapp',
        items: {
          create: items.map((item) => ({
            productId: item.product,
            name: item.name,
            image: item.image || null,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: { product: { select: { nameEn: true, images: true, slug: true } } },
        },
      },
    });
    res.status(201).json(formatOrder(order));
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const where = {};
    if (req.user.role !== 'admin') where.userId = req.user.id;
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          items: {
            include: { product: { select: { nameEn: true, nameNe: true, images: true, slug: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.order.count({ where }),
    ]);
    res.json({
      orders: orders.map(formatOrder),
      page: Number(page),
      totalPages: Math.ceil(total / limit) || 1,
      total,
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        items: {
          include: { product: { select: { nameEn: true, nameNe: true, images: true, slug: true, price: true } } },
        },
      },
    });
    if (!order) {
      res.status(404);
      return next(new Error('Order not found'));
    }
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      res.status(403);
      return next(new Error('Not authorized'));
    }
    res.json(formatOrder(order));
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) {
      res.status(404);
      return next(new Error('Order not found'));
    }
    const data = { status: req.body.status };
    if (req.body.status === 'delivered') data.paymentStatus = 'paid';
    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data,
      include: {
        items: {
          include: { product: { select: { nameEn: true, images: true, slug: true } } },
        },
      },
    });
    res.json(formatOrder(updated));
  } catch (error) {
    next(error);
  }
};

exports.whatsappMessage = async (req, res, next) => {
  try {
    const { items, shippingAddress, totalAmount, orderId } = req.body;
    let message = `🛍️ *New Order from Bliss Nepal*\n\n`;
    if (orderId) message += `Order ID: ${orderId}\n\n`;
    message += `*Items:*\n`;
    items.forEach((item) => {
      message += `• ${item.name} x${item.quantity} - Rs. ${item.price * item.quantity}\n`;
    });
    message += `\n*Total: Rs. ${totalAmount}*\n\n*Shipping Address:*\n${shippingAddress.fullName}\n${shippingAddress.address}\n${shippingAddress.city}, ${shippingAddress.district}\nPhone: ${shippingAddress.phone}\n\nPayment: Cash on Delivery`;
    const whatsappNumber = process.env.WHATSAPP_NUMBER || '9779800000000';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    res.json({ whatsappUrl, message });
  } catch (error) {
    next(error);
  }
};

function formatOrder(o) {
  return {
    _id: o.id,
    orderNumber: `BN-${o.id.slice(0, 8).toUpperCase()}`,
    user: o.user
      ? { _id: o.user.id, name: o.user.name, email: o.user.email, phone: o.user.phone }
      : o.userId,
    items: o.items.map((i) => ({
      _id: i.id,
      product: {
        _id: i.product?.nameEn ? undefined : i.productId,
        name: i.product ? { en: i.product.nameEn, ne: i.product.nameNe } : undefined,
        slug: i.product?.slug,
        image: i.product?.images?.[0],
      },
      name: i.name,
      image: i.image,
      price: Number(i.price),
      quantity: i.quantity,
    })),
    shippingAddress: o.shippingAddress,
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus,
    status: o.status,
    totalAmount: Number(o.totalAmount),
    whatsappRedirected: o.whatsappRedirected,
    notes: o.notes,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}
