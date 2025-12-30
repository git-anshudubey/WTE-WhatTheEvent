const Stripe = require('stripe');
const Booking = require('../models/Booking');
const Event = require('../models/Event');

// Lazy initialization to prevent crash if key is missing
const getStripe = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY missing. Please add it to your .env file.');
    }
    return Stripe(process.env.STRIPE_SECRET_KEY);
};

// @desc    Create Stripe Checkout Session
// @route   POST /api/payment/create-checkout-session
// @access  Private
const createCheckoutSession = async (req, res) => {
    const { bookingId } = req.body;

    try {
        const stripe = getStripe();
        const booking = await Booking.findById(bookingId).populate('event');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: booking.event.title,
                            description: booking.event.description,
                            images: booking.event.image ? [`http://localhost:5000/${booking.event.image}`] : [],
                        },
                        unit_amount: booking.event.price * 100, // Amount in cents
                    },
                    quantity: booking.ticketCount,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/events/${booking.event._id}?canceled=true`,
            metadata: {
                bookingId: booking._id.toString(),
            },
        });

        // Save session ID to booking
        booking.stripeSessionId = session.id;
        await booking.save();

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Stripe Webhook Handler
// @route   POST /api/payment/webhook
// @access  Public
const webhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
        const stripe = getStripe();
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        // Handle the event
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const bookingId = session.metadata.bookingId;

            const booking = await Booking.findById(bookingId).populate('event').populate('user');
            if (booking) {
                booking.paymentStatus = 'paid';
                booking.status = 'confirmed';
                await booking.save();
                console.log(`Booking ${bookingId} paid and confirmed.`);

                // Send Confirmation Email
                const { sendBookingConfirmation } = require('../utils/emailService');
                await sendBookingConfirmation(booking, booking.user, booking.event);
            }
        }

        res.json({ received: true });
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
};

module.exports = {
    createCheckoutSession,
    webhook,
};
