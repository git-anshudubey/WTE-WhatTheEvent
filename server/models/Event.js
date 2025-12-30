const mongoose = require('mongoose');

const eventSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a title'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        date: {
            type: Date,
            required: [true, 'Please add a date'],
        },
        location: {
            type: String,
            required: [true, 'Please add a location'],
        },
        category: {
            type: String,
            required: [true, 'Please add a category'],
            enum: ['Concert', 'Conference', 'Workshop', 'Meetup', 'Other'],
        },
        price: {
            type: Number,
            required: [true, 'Please add a price'],
            default: 0,
        },
        image: {
            type: String,
            default: '',
        },
        capacity: {
            type: Number,
            required: true,
            default: 100, // Default capacity
        },
        availableTickets: {
            type: Number,
            required: true,
            default: 100, // Matches capacity initially
        },
        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Event', eventSchema);
