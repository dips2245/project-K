const { prisma } = require('../config/db');

const auditLog = (action, resource) => {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = function (body) {
      const statusCode = res.statusCode;
      if (statusCode < 400) {
        const resourceId = req.params?.id || body?._id || body?.id || null;
        prisma.auditLog.create({
          data: {
            userId: req.user?.id || 'unknown',
            action,
            resource,
            resourceId: resourceId?.toString() || null,
            details: JSON.stringify({
              method: req.method,
              path: req.originalUrl,
              body: sanitizeBody(req.body),
              statusCode,
            }),
            ipAddress: req.ip || req.connection?.remoteAddress || null,
          },
        }).catch(err => console.error('Audit log error:', err.message));
      }
      return originalJson(body);
    };
    next();
  };
};

function sanitizeBody(body) {
  if (!body) return {};
  const sanitized = { ...body };
  delete sanitized.password;
  delete sanitized.currentPassword;
  delete sanitized.newPassword;
  delete sanitized.token;
  return sanitized;
}

module.exports = { auditLog };
