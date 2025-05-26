



const express = require('express');
const { Spot, SpotImage, User, Review, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const router = express.Router();

// Validation Middleware
const validateSpot = [
  check('address').notEmpty().withMessage('Address is required'),
  check('city').notEmpty().withMessage('City is required'),
  check('state').notEmpty().withMessage('State is required'),
  check('country').notEmpty().withMessage('Country is required'),
  check('name').isLength({ min: 1, max: 50 }).withMessage('Name must be between 1 and 50 characters'),
  check('description').notEmpty().withMessage('Description is required'),
  check('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  handleValidationErrors,
];

// Validate Query Filters Middleware
const validateQueryFilters = [
  check('page')
    .optional().isInt({ min: 1 }).withMessage('Page must be ≥ 1'),
  check('size')
    .optional().isInt({ min: 1 }).withMessage('Size must be ≥ 1'),
  check('minLat').optional().isFloat({ min: -90, max: 90 }).withMessage('minLat must be between -90 and 90'),
  check('maxLat').optional().isFloat({ min: -90, max: 90 }).withMessage('maxLat must be between -90 and 90'),
  check('minLng').optional().isFloat({ min: -180, max: 180 }).withMessage('minLng must be between -180 and 180'),
  check('maxLng').optional().isFloat({ min: -180, max: 180 }).withMessage('maxLng must be between -180 and 180'),
  check('minPrice').optional().isFloat({ min: 0 }).withMessage('minPrice must be ≥ 0'),
  check('maxPrice').optional().isFloat({ min: 0 }).withMessage('maxPrice must be ≥ 0'),
  handleValidationErrors
];
// GET /api/spots - Get all spots with pagination
router.get('/', validateQueryFilters, async (req, res) => {
  let { page = 1, size = 20 } = req.query;
  page = parseInt(page);
  size = parseInt(size);

  const limit = size;
  const offset = (page - 1) * size;

  const spots = await Spot.findAll({
    limit,
    offset,
    include: [{ model: SpotImage, attributes: ['url', 'preview'] }],
  });

  res.json({ spots, page, size });
});

// GET /api/spots/current - Get spots owned by the current user
router.get('/current', requireAuth, async (req, res) => {
  const spots = await Spot.findAll({
    where: { ownerId: req.user.id },
    include: [{ model: SpotImage, attributes: ['url', 'preview'] }],
  });

  res.json({ spots });
});

// GET /api/spots/:id - Get spot details by ID
router.get('/:id', async (req, res) => {
  const spot = await Spot.findByPk(req.params.id, {
    include: [
      { model: SpotImage, attributes: ['url', 'preview'] },
      { model: User, as: 'Owner', attributes: ['id', 'firstName', 'lastName'] },
    ],
  });

  if (!spot) return res.status(404).json({ message: 'Spot not found' });

  res.json(spot);
});

// POST /api/spots - Create a new spot
router.post('/', requireAuth, validateSpot, async (req, res) => {
  const newSpot = await Spot.create({ ...req.body, ownerId: req.user.id });
  res.status(201).json(newSpot);
});
router.post('/:id/images', requireAuth, async (req, res) => {
  const { url, preview } = req.body;
  const spotId = req.params.id;

  try {
    // Find the spot by ID
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: 'Spot not found' });
    }

    // Check if the authenticated user is the owner of the spot
    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Create a new SpotImage
    const newImage = await SpotImage.create({ spotId, url, preview });

    // Format the response to only include necessary fields
    const response = {
      id: newImage.id,
      url: newImage.url,
      preview: newImage.preview,
    };

    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});
router.post('/:id/images', requireAuth, async (req, res) => {
  const { url, preview = false } = req.body; // Default preview to false if not provided
  const spotId = req.params.id;

  // Validate request body
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ message: 'Invalid or missing URL' });
  }

  try {
    // Find the spot by ID
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: 'Spot not found' });
    }

    // Check if the authenticated user is the owner of the spot
    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Create a new SpotImage
    const newImage = await SpotImage.create({ spotId, url, preview });

    // Format and return the response
    return res.status(201).json({
      id: newImage.id,
      url: newImage.url,
      preview: newImage.preview,
    });

  } catch (error) {
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: 'Invalid data', errors: error.errors });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
});


// PUT /api/spots/:id - Update a spot
router.put('/:id', requireAuth, validateSpot, async (req, res) => {
  const spot = await Spot.findByPk(req.params.id);
  if (!spot) return res.status(404).json({ message: 'Spot not found' });
  if (spot.ownerId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

  await spot.update(req.body);
  res.json(spot);
});

// DELETE /api/spots/:id - Delete a spot
// router.delete('/:id', requireAuth, async (req, res) => {
//   const spot = await Spot.findByPk(req.params.id);
//   if (!spot) return res.status(404).json({ message: 'Spot not found' });
//   if (spot.ownerId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

//   await spot.destroy();
//   res.json({ message: 'Spot deleted successfully' });
// });
// DELETE /api/spots/:id - Delete a Spot
router.delete('/:id', requireAuth, async (req, res) => {
  const spotId = req.params.id;

  try {
    // Find the spot by ID
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: 'Spot not found' });
    }

    // Check if the authenticated user is the owner of the spot
    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Delete the spot
    await spot.destroy();

    // Return success message
    return res.json({ message: 'Spot deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
