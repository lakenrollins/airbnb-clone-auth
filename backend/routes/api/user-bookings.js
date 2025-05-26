
const express = require('express');
const router = express.Router();
const { Booking, Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { Op } = require('sequelize');

router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

// GET /api/bookings/
router.get('/current', requireAuth, async (req, res) => {
  const bookings = await Booking.findAll({
    where: { userId: req.user.id },
    include: {
      model: Spot,
      attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price'],

    },
    attributes: ['id', 'spotId', 'startDate', 'endDate', 'createdAt', 'updatedAt']
  });
  return res.json({ Bookings: bookings });
});

module.exports = router;


// delete a booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
  const { bookingId } = req.params;
  const booking = await Booking.findByPk(bookingId);
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  if (booking.userId !== req.user.id) return res.status(403).json({ message: 'not authorized' });

  await booking.destroy();
  return res.status(204).end();
});

// edit booking 

router.put('/:bookingId', requireAuth, async (req, res) => {
  const { bookingId } = req.params;
  const { startDate, endDate } = req.body;

  const booking = await Booking.findByPk(bookingId);
  if (!booking) return res.status(404).json({ message: "Booking not found for this" });
  if (booking.userId !== req.user.id) return res.status(403).json({ message: 'not authorized for action' });


  const conflict = await Booking.findOne({
    where: {
      spotId: booking.spotId,
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
  booking.endDate = endDate;
  await booking.save();

  return res.json(booking);
});