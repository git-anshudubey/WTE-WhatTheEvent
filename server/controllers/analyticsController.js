const Booking = require('../models/Booking');
const User = require('../models/User');
const Event = require('../models/Event');

// @desc    Get Analytics Summary
// @route   GET /api/analytics/summary
// @access  Private/Admin
const getAnalyticsSummary = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalEvents = await Event.countDocuments();
        const totalBookings = await Booking.countDocuments({ status: 'confirmed' });

        // Calculate Total Revenue
        const result = await Booking.aggregate([
            { $match: { status: 'confirmed' } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
        ]);
        const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;

        // Daily Sales for Chart (Last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const dailySales = await Booking.aggregate([
            {
                $match: {
                    status: 'confirmed',
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    sales: { $sum: "$totalPrice" },
                    bookings: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            totalUsers,
            totalEvents,
            totalBookings,
            totalRevenue,
            dailySales
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAnalyticsSummary
};
