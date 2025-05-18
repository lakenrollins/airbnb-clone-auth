'use strict';
const express = require('express');
const router = express.Router();
const { Booking, Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

// GET /api/bookings/
router.get('/', requireAuth, async (req, res) => {
  const bookings = await Booking.findAll({
    where: { userId: req.user.id },
    include: { model: Spot, attributes: ['id','name','city','state','country'] }
  });
  return res.json({ Bookings: bookings });
});

module.exports = router;