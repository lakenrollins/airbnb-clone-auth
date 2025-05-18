

// backend/routes/api/index.js
// const router = require('express').Router();
// const sessionRouter = require('./session.js');
// const usersRouter = require('./users.js');
// const { restoreUser } = require("../../utils/auth.js");

// // Connect restoreUser middleware to the API router
//   // If current user session is valid, set req.user to the user in the database
//   // If current user session is not valid, set req.user to null
// router.use(restoreUser);

// router.use('/session', sessionRouter);

// router.use('/users', usersRouter);

// router.post('/test', (req, res) => {
//   res.json({ requestBody: req.body });
// });
// backend/routes/api/index.js
const express = require('express');
const router = express.Router();

// Import route modules
const sessionRouter = require('./session');
const usersRouter = require('./users');
const spotsRouter = require('./spots');
const reviewsRouter       = require('./reviews');
const bookingsRouter      = require('./bookings');
const userReviewsRouter   = require('./user-reviews');
const userBookingsRouter  = require('./user-bookings');

// Import restoreUser middleware
const { restoreUser } = require('../../utils/auth');

// Apply restoreUser middleware to set req.user
router.use(restoreUser);

// Connect route modules
router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots', spotsRouter);
router.use('/spots/:spotId/reviews',  reviewsRouter);
router.use('/spots/:spotId/bookings', bookingsRouter);

router.use('/reviews',   userReviewsRouter);   // GET /api/reviews/current
router.use('/bookings',  userBookingsRouter);  // GET /api/bookings/current

// Export router
module.exports = router;




