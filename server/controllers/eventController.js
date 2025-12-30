const Event = require('../models/Event');
const fs = require('fs');
const path = require('path');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const category = req.query.category;

        let query = {};
        if (category) {
            query.category = category;
        }

        const events = await Event.find(query)
            .sort({ date: 1 })
            .skip(skip)
            .limit(limit)
            .populate('organizer', 'name email');

        const total = await Event.countDocuments(query);

        res.status(200).json({
            events,
            page,
            pages: Math.ceil(total / limit),
            total,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('organizer', 'name email');

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Admin/Organizer)
const createEvent = async (req, res) => {
    try {
        console.log('[CreateEvent] Request Body:', req.body);
        console.log('[CreateEvent] Request File:', req.file);

        const { title, description, date, location, category, price, capacity } = req.body;

        let image = '';
        if (req.file) {
            image = req.file.path.replace(/\\/g, '/'); // Normalize path
        }

        const event = await Event.create({
            title,
            description,
            date,
            location,
            category,
            price,
            capacity: capacity || 100,
            availableTickets: capacity || 100, // Initialize available tickets matches capacity
            image,
            organizer: req.user.id,
        });

        console.log('[CreateEvent] Event Created:', event._id);
        res.status(201).json(event);
    } catch (error) {
        console.error('[CreateEvent] Error:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin/Organizer)
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check user
        if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        let updatedData = { ...req.body };
        if (req.file) {
            // If new image uploaded, delete old one if exists
            if (event.image) {
                // Handle file deletion if needed, or just overwrite
                // fs.unlinkSync(event.image); 
            }
            updatedData.image = req.file.path.replace(/\\/g, '/');
        }

        // If capacity changes, adjust available tickets logic could be complex
        // For simplicity, we might reset or adjust difference.
        // A safer simple approach:
        if (req.body.capacity) {
            const capacityDiff = req.body.capacity - event.capacity;
            updatedData.availableTickets = event.availableTickets + capacityDiff;
            // Prevent negative tickets
            if (updatedData.availableTickets < 0) updatedData.availableTickets = 0;
        }

        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updatedData, {
            new: true,
            runValidators: true,
        });

        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error('[UpdateEvent] Error:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin)
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check user
        if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await event.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
};
