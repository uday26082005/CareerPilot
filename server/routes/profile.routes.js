const express = require('express');
const router = express.Router();
const { saveProfile } = require('../controllers/profile.controller');

// @route   POST /api/profile/save
// @desc    Save user profile data
router.post('/save', saveProfile);

module.exports = router;
