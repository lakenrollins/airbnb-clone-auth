'use strict';
const express = require('express');
const router = express.Router({ mergeParams: true });
const { Review, Spot, ReviewImage, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// --- Validation ---
const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  check('stars')
    .exists()
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];

// GET  /api/spots/:spotId/reviews
router.get('/', async (req, res) => {
  const { spotId } = req.params;
  const spot = await Spot.findByPk(spotId);
  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });

  const reviews = await Review.findAll({
    where: { spotId },
    include: { model: User, attributes: ['id','firstName','lastName'] }
  });
  return res.json({ Reviews: reviews });
});

// POST /api/spots/:spotId/reviews
router.post('/', requireAuth, validateReview, async (req, res) => {
  const { spotId } = req.params;
  const spot = await Spot.findByPk(spotId);
  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });

  const review = await Review.create({
    userId: req.user.id,
    spotId,
    review: req.body.review,
    stars: req.body.stars
  });
  return res.status(201).json(review);
});

// POST /api/spots/:spotId/reviews/:reviewId/images
router.post('/:reviewId/images', requireAuth, async (req, res) => {
  const { spotId, reviewId } = req.params;
  const review = await Review.findByPk(reviewId);
  if (!review || review.spotId.toString() !== spotId) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }
  if (review.userId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const img = await ReviewImage.create({
    reviewId,
    url: req.body.url,
    preview: req.body.preview || false
  });
  return res.status(201).json({
    id: img.id,
    url: img.url,
    preview: img.preview
  });
});

// PUT /api/spots/:spotId/reviews/:reviewId
router.put('/:reviewId', requireAuth, validateReview, async (req, res) => {
  const { spotId, reviewId } = req.params;
  const review = await Review.findByPk(reviewId);
  if (!review || review.spotId.toString() !== spotId) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }
  if (review.userId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  review.review = req.body.review;
  review.stars  = req.body.stars;
  await review.save();
  return res.json(review);
});

// DELETE /api/spots/:spotId/reviews/:reviewId
router.delete('/:reviewId', requireAuth, async (req, res) => {
  const { spotId, reviewId } = req.params;
  const review = await Review.findByPk(reviewId);
  if (!review || review.spotId.toString() !== spotId) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }
  if (review.userId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  await review.destroy();
  return res.json({ message: 'Successfully deleted' });
});

// DELETE /api/spots/:spotId/reviews/:reviewId/images/:imageId
router.delete('/:reviewId/images/:imageId', requireAuth, async (req, res) => {
  const { spotId, reviewId, imageId } = req.params;
  const review = await Review.findByPk(reviewId);
  if (!review || review.spotId.toString() !== spotId) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }
  if (review.userId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const img = await ReviewImage.findByPk(imageId);
  if (!img || img.reviewId.toString() !== reviewId) {
    return res.status(404).json({ message: "Review Image couldn't be found" });
  }
  await img.destroy();
  return res.json({ message: 'Successfully deleted' });
});

module.exports = router;