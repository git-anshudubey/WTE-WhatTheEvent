const cron = require('node-cron');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const User = require('../models/User'); // Helper if needed
const { sendEventReminder } = require('../utils/emailService');

const startReminderCron = () => {
    // Run every day at 9:00 AM
    cron.schedule('0 9 * * *', async () => {
        console.log('Running Event Reminder Cron Job...');

        try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            const nextDay = new Date(tomorrow);
            nextDay.setHours(23, 59, 59, 999);

            // Find events happening tomorrow
            const upcomingEvents = await Event.find({
                date: {
                    $gte: tomorrow,
                    $lte: nextDay
                }
            });

            if (upcomingEvents.length === 0) {
                console.log('No upcoming events for tomorrow.');
                return;
            }

            for (const event of upcomingEvents) {
                // Find all confirmed bookings for this event
                const bookings = await Booking.find({ event: event._id, status: 'confirmed' }).populate('user');

                for (const booking of bookings) {
                    if (booking.user) {
                        try {
                            await sendEventReminder(booking.user, event);
                            console.log(`Reminder sent to ${booking.user.email} for event ${event.title}`);
                        } catch (err) {
                            console.error(`Failed to send reminder to ${booking.user.email}:`, err.message);
                        }
                    }
                }
            }

        } catch (error) {
            console.error('Error in Reminder Cron:', error);
        }
    });

    console.log('Reminder Cron Job scheduled (0 9 * * *).');
};

module.exports = startReminderCron;
