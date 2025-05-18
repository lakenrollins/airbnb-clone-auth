'use strict';
const express = require('express');
const router = express.Router({ mergeParams: true });
const { Booking, Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

// --- Validation ---
const validateBooking = [
  check('startDate')
    .exists({ checkFalsy: true })
    .isISO8601().withMessage('Valid startDate required'),
  check('endDate')
    .exists({ checkFalsy: true })
    .isISO8601().withMessage('Valid endDate required'),
  handleValidationErrors
];

// GET  /api/spots/:spotId/bookings  (owner only)
router.get('/', requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const spot = await Spot.findByPk(spotId);
  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });
  if (spot.ownerId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

  const bookings = await Booking.findAll({
    where: { spotId },
    attributes: ['id','userId','startDate','endDate','createdAt','updatedAt']
  });
  return res.json({ Bookings: bookings });
});

// POST /api/spots/:spotId/bookings
router.post('/', requireAuth, validateBooking, async (req, res) => {
  const { spotId } = req.params;
  const { startDate, endDate } = req.body;
  const spot = await Spot.findByPk(spotId);
  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });
  if (spot.ownerId === req.user.id) return res.status(403).json({ message: 'Owners cannot book their own spot' });

  // date conflict check
  const conflict = await Booking.findOne({
    where: {
      spotId,
      [Op.or]: [
        { startDate: { [Op.between]: [startDate, endDate] } },
        { endDate:   { [Op.between]: [startDate, endDate] } },
        { startDate: { [Op.lte]: startDate }, endDate: { [Op.gte]: endDate } }
      ]
    }
  });
  if (conflict) return res.status(403).json({ message: 'Spot is already booked for those dates' });

  const booking = await Booking.create({
    spotId,
    userId: req.user.id,
    startDate,
    endDate
  });
  return res.status(201).json(booking);
});

// PUT /api/spots/:spotId/bookings/:bookingId
router.put('/:bookingId', requireAuth, validateBooking, async (req, res) => {
  const { spotId, bookingId } = req.params;
  const { startDate, endDate } = req.body;
  const booking = await Booking.findByPk(bookingId);

  if (!booking) return res.status(404).json({ message: "Booking couldn't be found" });
  if (booking.userId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
  if (booking.spotId.toString() !== spotId) return res.status(400).json({ message: 'Invalid spot' });
  if (new Date(endDate) <= new Date(startDate)) {
    return res.status(400).json({ message: 'endDate cannot be on or before startDate' });
  }

  // conflict check excluding this booking
  const conflict = await Booking.findOne({
    where: {
      spotId,
      id: { [Op.ne]: bookingId },
      [Op.or]: [
        { startDate: { [Op.between]: [startDate, endDate] } },
        { endDate:   { [Op.between]: [startDate, endDate] } },
        { startDate: { [Op.lte]: startDate }, endDate: { [Op.gte]: endDate } }
      ]
    }
  });
  if (conflict) return res.status(403).json({ message: 'Spot is already booked for those dates' });

  booking.startDate = startDate;
  booking.endDate   = endDate;
  await booking.save();
  return res.json(booking);
});

// DELETE /api/spots/:spotId/bookings/:bookingId
router.delete('/:bookingId', requireAuth, async (req, res) => {
  const { spotId, bookingId } = req.params;
  const booking = await Booking.findByPk(bookingId);
  if (!booking) return res.status(404).json({ message: "Booking couldn't be found" });
  if (booking.userId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
  if (booking.spotId.toString() !== spotId) return res.status(400).json({ message: 'Invalid spot' });

  await booking.destroy();
  return res.json({ message: 'Successfully deleted' });
});

module.exports = router;