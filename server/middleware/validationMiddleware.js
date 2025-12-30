const { body, validationResult } = require('express-validator');

// Validation Rules
const registerValidation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required'),
];

const eventValidation = [
    body('title').notEmpty().withMessage('Title is required'),
    body('date').isISO8601().toDate().withMessage('Valid Key Date is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('capacity').isNumeric().withMessage('Capacity must be a number'),
    body('category').isIn(['Concert', 'Conference', 'Workshop', 'Meetup', 'Other']).withMessage('Invalid category'),
];

// Middleware to check for errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    registerValidation,
    loginValidation,
    eventValidation,
    validate
};
