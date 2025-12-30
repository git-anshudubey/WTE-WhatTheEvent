const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

// Rate Limiter: Maximum 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});

const securityMiddleware = (app) => {
    // Set secure HTTP headers
    app.use(helmet());

    // Enable CORS with specific options if needed (currently global in server.js, but good to keep in mind)
    // app.use(cors({ origin: process.env.CLIENT_URL })); 

    // Apply Rate Limiting
    app.use('/api/', limiter);
};

module.exports = securityMiddleware;
