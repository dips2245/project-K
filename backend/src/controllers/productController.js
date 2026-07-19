const { prisma } = require('../config/db');
const slugify = require('slugify');

exports.getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, category, search, minPrice, maxPrice, featured, sort: sortParam = '-createdAt' } = req.query;

    const where = { isActive: true };
    if (category) where.categoryId = category;
    if (featured) where.featured = true;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }
    if (search) {
      where.OR = [
        { nameEn: { contains: search } },
        { nameNe: { contains: search } },
        { descriptionEn: { contains: search } },
        { descriptionNe: { contains: search } },
      ];
    }

    const sortMap = {
      price_asc: { price: 'asc' },
      price_desc: { price: 'desc' },
      newest: { createdAt: 'desc' },
      bestseller: { createdAt: 'desc' },
      '-createdAt': { createdAt: 'desc' },
    };
    const orderBy = sortMap[sortParam] || { createdAt: 'desc' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: { select: { nameEn: true, nameNe: true, slug: true } } },
        orderBy,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      products: products.map(formatProduct),
      page: Number(page),
      totalPages: Math.ceil(total / Math.max(Number(limit), 1)) || 1,
      total,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: { category: { select: { nameEn: true, nameNe: true, slug: true } } },
    });
    if (!product) {
      res.status(404);
      return next(new Error('Product not found'));
    }
    res.json(formatProduct(product));
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    let bodyData = req.body;
    if (req.body.productData) {
      try { bodyData = JSON.parse(req.body.productData); } catch (err) { console.error('Error parsing productData JSON:', err); }
    }
    const { name, description, price, comparePrice, category, tags, stock, featured, theme, specifications, colors } = bodyData;
    const images = req.files ? req.files.map((f) => `/${f.path.replace(/\\/g, '/')}`) : [];
    const slug = slugify(name.en, { lower: true, strict: true });

    const product = await prisma.product.create({
      data: {
        nameEn: name.en,
        nameNe: name.ne || null,
        slug,
        descriptionEn: description.en,
        descriptionNe: description.ne || null,
        price: Number(price),
        comparePrice: Number(comparePrice || 0),
        images,
        categoryId: category,
        tags: tags || [],
        stock: Number(stock || 0),
        featured: Boolean(featured),
        theme: theme || 'default',
        specifications: specifications || {},
        colors: colors || [],
      },
      include: { category: { select: { nameEn: true, nameNe: true, slug: true } } },
    });
    res.status(201).json(formatProduct(product));
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404);
      return next(new Error('Product not found'));
    }
    let bodyData = { ...req.body };
    if (req.body.productData) {
      try { bodyData = JSON.parse(req.body.productData); } catch (err) { console.error('Error parsing productData JSON:', err); }
    }

    const data = {};
    if (bodyData.name) {
      data.nameEn = bodyData.name.en;
      data.nameNe = bodyData.name.ne || null;
      data.slug = slugify(bodyData.name.en, { lower: true, strict: true });
    }
    if (bodyData.description) {
      data.descriptionEn = bodyData.description.en;
      data.descriptionNe = bodyData.description.ne || null;
    }
    if (bodyData.price !== undefined) data.price = Number(bodyData.price);
    if (bodyData.comparePrice !== undefined) data.comparePrice = Number(bodyData.comparePrice);
    if (bodyData.category) data.categoryId = bodyData.category;
    if (bodyData.tags !== undefined) data.tags = Array.isArray(bodyData.tags) ? bodyData.tags : [bodyData.tags];
    if (bodyData.stock !== undefined) data.stock = Number(bodyData.stock);
    if (bodyData.featured !== undefined) data.featured = Boolean(bodyData.featured);
    if (bodyData.theme) data.theme = bodyData.theme;
    if (bodyData.specifications !== undefined) data.specifications = bodyData.specifications;
    if (bodyData.colors !== undefined) data.colors = bodyData.colors;

    const newImages = req.files ? req.files.map((f) => `/${f.path.replace(/\\/g, '/')}`) : [];
    if (newImages.length > 0) {
      const parsedExisting = bodyData.existingImages
        ? (Array.isArray(bodyData.existingImages) ? bodyData.existingImages : [bodyData.existingImages])
        : [];
      data.images = [...parsedExisting, ...newImages];
    } else if (bodyData.existingImages !== undefined) {
      data.images = Array.isArray(bodyData.existingImages) ? bodyData.existingImages : [bodyData.existingImages];
    }

    const updated = await prisma.product.update({
      where: { id: req.params.id },
      data,
      include: { category: { select: { nameEn: true, nameNe: true, slug: true } } },
    });
    res.json(formatProduct(updated));
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404);
      return next(new Error('Product not found'));
    }
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

exports.formatProduct = formatProduct;

function formatProduct(p) {
  const cat = p.category
    ? { _id: p.category.nameEn ? undefined : p.categoryId, name: { en: p.category.nameEn, ne: p.category.nameNe }, slug: p.category.slug }
    : p.categoryId;
  return {
    _id: p.id,
    name: { en: p.nameEn, ne: p.nameNe },
    slug: p.slug,
    description: { en: p.descriptionEn, ne: p.descriptionNe },
    price: Number(p.price),
    comparePrice: Number(p.comparePrice),
    images: p.images || [],
    category: cat,
    tags: p.tags || [],
    stock: p.stock,
    featured: p.featured,
    isActive: p.isActive,
    theme: p.theme,
    specifications: p.specifications || {},
    colors: p.colors || [],
    ratings: p.ratings || { average: 0, count: 0 },
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}
