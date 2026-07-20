const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeResume } = require('../controllers/resume.controller');

// Configure multer for file uploads (storing temporarily in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST /api/resume/analyze
// Expects a 'resume' file in the form-data
router.post('/analyze', upload.single('resume'), analyzeResume);

module.exports = router;
