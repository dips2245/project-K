const { prisma } = require('../config/db');
const { formatProduct } = require('./productController');

exports.getQuiz = async (req, res, next) => {
  try {
    const quiz = await prisma.quiz.findFirst({
      where: { isActive: true },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: { options: true },
        },
      },
    });
    if (!quiz) {
      res.status(404);
      return next(new Error('Quiz not found'));
    }
    res.json(formatQuiz(quiz));
  } catch (error) {
    next(error);
  }
};

exports.submitQuiz = async (req, res, next) => {
  try {
    const { quizId, responses, sessionId } = req.body;

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: { options: true },
        },
      },
    });
    if (!quiz) {
      res.status(404);
      return next(new Error('Quiz not found'));
    }

    const allTags = new Set();
    const processedResponses = responses.map((response) => {
      const question = quiz.questions.find((q) => q.id === response.questionId);
      if (!question) return null;
      const tags = [];
      response.selectedOptions.forEach((optionValue) => {
        const option = question.options.find((o) => o.value === optionValue);
        if (option && option.tags) {
          const optionTags = Array.isArray(option.tags) ? option.tags : [];
          optionTags.forEach((tag) => {
            tags.push(tag);
            allTags.add(tag);
          });
        }
      });
      return {
        questionId: response.questionId,
        selectedOptions: response.selectedOptions,
        tags,
      };
    }).filter(Boolean);

    const recommendations = await generateRecommendations([...allTags]);

    const quizResponse = await prisma.quizResponse.create({
      data: {
        quizId,
        userId: req.user ? req.user.id : null,
        sessionId: sessionId || null,
        ipAddress: req.ip || null,
        matchedTags: [...allTags],
        answers: {
          create: processedResponses.map((r) => ({
            questionId: r.questionId,
            selectedOptions: r.selectedOptions,
            tags: r.tags,
          })),
        },
        recommendations: {
          create: recommendations.map((r) => ({
            productId: r.product,
            score: r.score,
            reason: r.reason,
          })),
        },
      },
    });

    res.status(201).json({
      quizResponse: {
        _id: quizResponse.id,
        recommendedProducts: recommendations,
      },
    });
  } catch (error) {
    next(error);
  }
};

async function generateRecommendations(userTags) {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: { category: { select: { nameEn: true, nameNe: true } } },
    });

    const scoredProducts = products.map((product) => {
      let score = 0;
      const reasons = [];

      const productTags = Array.isArray(product.tags) ? product.tags : [];
      if (productTags.length > 0) {
        const matchedTags = productTags.filter((tag) => userTags.includes(tag));
        if (matchedTags.length > 0) {
          score += (matchedTags.length / productTags.length) * 60;
          reasons.push(`Matches your preferences: ${matchedTags.join(', ')}`);
        }
      }

      const specs = product.specifications || {};
      const specValues = Object.values(specs).filter((v) => v && typeof v === 'string');
      specValues.forEach((spec) => {
        if (userTags.some((tag) => spec.toLowerCase().includes(tag.toLowerCase()))) {
          score += 10;
        }
      });

      if (product.category && userTags.some((tag) => product.category.nameEn?.toLowerCase().includes(tag))) {
        score += 20;
        reasons.push('Matches your category interest');
      }

      if (product.featured) score += 5;

      return {
        product: product.id,
        score: Math.min(score, 100),
        reason: reasons.length > 0 ? reasons : ['Recommended based on your preferences'],
      };
    });

    return scoredProducts
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((item) => ({
        product: item.product,
        score: Math.round(item.score),
        reason: item.reason,
      }));
  } catch (error) {
    console.error('Error in recommendation engine:', error);
    return [];
  }
}

exports.getQuizResults = async (req, res, next) => {
  try {
    const quizResponse = await prisma.quizResponse.findUnique({
      where: { id: req.params.responseId },
      include: {
        recommendations: {
          include: {
            product: {
              select: { id: true, nameEn: true, nameNe: true, slug: true, price: true, comparePrice: true, images: true },
            },
          },
        },
      },
    });
    if (!quizResponse) {
      res.status(404);
      return next(new Error('Quiz response not found'));
    }
    res.json(formatQuizResponse(quizResponse));
  } catch (error) {
    next(error);
  }
};

exports.getProductsByTags = async (req, res, next) => {
  try {
    const { tags, limit = 10, page = 1 } = req.query;
    if (!tags) {
      res.status(400);
      return next(new Error('Tags parameter required'));
    }
    const tagArray = Array.isArray(tags) ? tags : tags.split(',');

    const allActiveProducts = await prisma.product.findMany({
      where: { isActive: true },
      include: { category: { select: { nameEn: true, nameNe: true, slug: true } } },
    });

    const matched = allActiveProducts.filter((p) => {
      const productTags = Array.isArray(p.tags) ? p.tags : [];
      return tagArray.some((tag) => productTags.includes(tag));
    });

    const total = matched.length;
    const products = matched.slice((Number(page) - 1) * Number(limit), Number(page) * Number(limit));

    res.json({
      products: products.map(formatProduct),
      page: Number(page),
      totalPages: Math.ceil(total / limit) || 1,
      total,
    });
  } catch (error) {
    next(error);
  }
};

function formatQuiz(q) {
  return {
    _id: q.id,
    title: { en: q.titleEn, ne: q.titleNe },
    description: { en: q.descriptionEn, ne: q.descriptionNe },
    questions: q.questions.map((qst) => ({
      _id: qst.id,
      order: qst.order,
      text: { en: qst.textEn, ne: qst.textNe },
      type: qst.type === 'single_select' ? 'single-select' : qst.type === 'multi_select' ? 'multi-select' : qst.type,
      category: qst.category,
      options: qst.options.map((opt) => ({
        _id: opt.id,
        label: { en: opt.labelEn, ne: opt.labelNe },
        value: opt.value,
        tags: Array.isArray(opt.tags) ? opt.tags : [],
        weight: opt.weight,
      })),
      required: qst.required,
    })),
    isActive: q.isActive,
    createdAt: q.createdAt,
    updatedAt: q.updatedAt,
  };
}

function formatQuizResponse(r) {
  return {
    _id: r.id,
    recommendedProducts: (r.recommendations || []).map((rec) => ({
      product: {
        _id: rec.product.id,
        name: { en: rec.product.nameEn, ne: rec.product.nameNe },
        slug: rec.product.slug,
        price: Number(rec.product.price),
        comparePrice: Number(rec.product.comparePrice),
        images: rec.product.images || [],
      },
      score: rec.score || 0,
      reason: Array.isArray(rec.reason) ? rec.reason : [],
    })),
    matchedTags: r.matchedTags || [],
  };
}
