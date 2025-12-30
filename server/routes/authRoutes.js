const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { registerValidation, loginValidation, validate } = require('../middleware/validationMiddleware');

// Register User
router.post('/register', registerValidation, validate, registerUser);

// Login User
router.post('/login', loginValidation, validate, loginUser);
router.get('/me', protect, getMe);

module.exports = router;
