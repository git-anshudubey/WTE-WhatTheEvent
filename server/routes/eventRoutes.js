const express = require('express');
const router = express.Router();
const {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
} = require('../controllers/eventController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { eventValidation, validate } = require('../middleware/validationMiddleware');

// Get all events
router.get('/', getEvents);

// Create event (Protected + Admin + Image Upload + Validation)
router.post('/', protect, admin, upload.single('image'), eventValidation, validate, createEvent);

// Get single event
router.get('/:id', getEventById);

// Update event
router.put('/:id', protect, admin, upload.single('image'), eventValidation, validate, updateEvent);

// Delete event
router.delete('/:id', protect, deleteEvent);

module.exports = router;
