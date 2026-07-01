const { prisma } = require('../config/db');
const slugify = require('slugify');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: { parentCategory: { select: { nameEn: true, nameNe: true, slug: true } } },
    });
    res.json(categories.map(formatCategory));
  } catch (error) {
    next(error);
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      include: { parentCategory: { select: { nameEn: true, nameNe: true, slug: true } } },
    });
    if (!category) {
      res.status(404);
      return next(new Error('Category not found'));
    }
    res.json(formatCategory(category));
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, parentCategory } = req.body;
    const image = req.file ? `/${req.file.path.replace(/\\/g, '/')}` : undefined;
    const slug = slugify(name.en, { lower: true, strict: true });
    const category = await prisma.category.create({
      data: {
        nameEn: name.en,
        nameNe: name.ne || null,
        slug,
        descriptionEn: description?.en || null,
        descriptionNe: description?.ne || null,
        image,
        parentCategoryId: parentCategory || null,
      },
    });
    res.status(201).json(formatCategory(category));
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const existing = await prisma.category.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404);
      return next(new Error('Category not found'));
    }
    const data = {};
    if (req.body.name) {
      data.nameEn = req.body.name.en;
      data.nameNe = req.body.name.ne || null;
      data.slug = slugify(req.body.name.en, { lower: true, strict: true });
    }
    if (req.body.description) {
      data.descriptionEn = req.body.description.en || null;
      data.descriptionNe = req.body.description.ne || null;
    }
    if (req.file) data.image = `/${req.file.path.replace(/\\/g, '/')}`;
    if (req.body.parentCategory !== undefined) data.parentCategoryId = req.body.parentCategory || null;
    const updated = await prisma.category.update({
      where: { id: req.params.id },
      data,
    });
    res.json(formatCategory(updated));
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const existing = await prisma.category.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404);
      return next(new Error('Category not found'));
    }
    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};

function formatCategory(c) {
  return {
    _id: c.id,
    name: { en: c.nameEn, ne: c.nameNe },
    slug: c.slug,
    description: { en: c.descriptionEn, ne: c.descriptionNe },
    image: c.image,
    parentCategory: c.parentCategory
      ? { _id: c.parentCategoryId, name: { en: c.parentCategory.nameEn, ne: c.parentCategory.nameNe }, slug: c.parentCategory.slug }
      : null,
    isActive: c.isActive,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}
