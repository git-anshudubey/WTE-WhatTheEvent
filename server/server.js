const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const compression = require('compression');
const securityMiddleware = require('./middleware/securityMiddleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy (Required for Rate Limiting behind Nginx/Load Balancers)
app.set('trust proxy', 1);

app.use(cors());
app.use(compression()); // Compress all responses
securityMiddleware(app); // Apply Helmet & Rate Limit

// Webhook needs raw body, so we mount it BEFORE express.json()
const { webhook } = require('./controllers/paymentController');
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), webhook);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Database Connection
mongoose.connect(process.env.DB_URI || 'mongodb://localhost:27017/event-booking')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Serve static assets
app.use('/uploads', express.static('uploads'));

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Global Error Handler
const logger = require('./utils/logger');
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    logger.error(err.message, { stack: err.stack });
    res.status(500).json({ message: 'Internal Server Error' });
});

const startReminderCron = require('./cron/reminderCron');
if (process.env.NODE_ENV !== 'test') {
    startReminderCron();
}

// Only listen if not in test mode
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;

