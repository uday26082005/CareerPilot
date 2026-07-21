const express = require("express");
const { analyze, getLatest } = require("../controllers/skillgap/skillgap.controller");
const { requireAuth } = require("../middleware/auth/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.post("/analyze", analyze);
router.get("/latest", getLatest);

module.exports = router;
