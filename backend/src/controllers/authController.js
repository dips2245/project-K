const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { prisma } = require('../config/db');

const generateAccessToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });

const generateRefreshToken = () => crypto.randomBytes(32).toString('hex');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      res.status(400);
      return next(new Error('User already exists'));
    }
    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, phone },
    });
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken();
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken();
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400);
      return next(new Error('Refresh token required'));
    }
    const user = await prisma.user.findFirst({ where: { refreshToken } });
    if (!user) {
      res.status(401);
      return next(new Error('Invalid refresh token'));
    }
    const newAccess = generateAccessToken(user.id);
    const newRefresh = generateRefreshToken();
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefresh },
    });
    res.json({ token: newAccess, refreshToken: newRefresh });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
  });
  res.json({ _id: user.id, ...user, id: undefined });
};
