'use strict';
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// Set token cookie function
const setTokenCookie = (res, user) => {
  const token = jwt.sign(
    { data: { id: user.id } },
    secret,
    { expiresIn }
  );

  res.cookie('token', token, {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
  });
};

// Restore user from the token in the cookies
const restoreUser = (req, res, next) => {
  const { token } = req.cookies;
  req.user = null;

  if (!token) return next();

  jwt.verify(token, secret, { algorithms: ['HS256'] }, async (err, jwtPayload) => {
    if (err) {
      if (err.name === 'TokenExpiredError') console.error('Token expired');
      res.clearCookie('token');
      return next();
    }

    try {
      const { id } = jwtPayload.data;
      // Include `id` here so req.user.id is available
      req.user = await User.findByPk(id, {
        attributes: ['id', 'email', 'createdAt', 'updatedAt', 'firstName', 'lastName'],
      });
    } catch (e) {
      res.clearCookie('token');
      return next();
    }

    if (!req.user) res.clearCookie('token');
    return next();
  });
};

// Require authentication middleware
const requireAuth = (req, _res, next) => {
  if (req.user) return next();

  const err = new Error('Authentication required');
  err.title = 'Authentication required';
  err.errors = { message: 'Authentication required' };
  err.status = 401;
  return next(err);
};

module.exports = { setTokenCookie, restoreUser, requireAuth };