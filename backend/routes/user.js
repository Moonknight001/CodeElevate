const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getProfile, getStats } = require('../controllers/userController');

router.get('/profile', protect, getProfile);
router.get('/stats', protect, getStats);

module.exports = router;
