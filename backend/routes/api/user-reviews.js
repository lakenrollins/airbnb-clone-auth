'use strict';
const express = require('express');
const router = express.Router();
const { Review, Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

// GET /api/reviews/
router.get('/', requireAuth, async (req, res) => {
    console.log('User ID:', req.user);
  const reviews = await Review.findAll({
    where: { userId: req.user.id },
    include: { model: Spot, attributes: ['id','name','city','state','country'] }
  });
  return res.json({ Reviews: reviews });
});

module.exports = router;