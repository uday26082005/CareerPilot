const express = require("express");
const multer = require("multer");
const router = express.Router();
const transcribeController = require("../controllers/transcribe.controller");
const { requireAuth } = require("../middleware/auth/requireAuth");

// Use memory storage since we send the buffer directly to temp file in service
const upload = multer({ storage: multer.memoryStorage() });

router.use(requireAuth);

// Endpoint expects multipart/form-data with a file named 'audio'
router.post("/", upload.single("audio"), transcribeController.transcribe);

module.exports = router;
