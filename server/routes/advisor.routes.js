const express = require("express");
const router = express.Router();
const advisorController = require("../controllers/advisor.controller");
const { requireAuth } = require("../middleware/auth/requireAuth");

router.use(requireAuth);

router.post("/chat", advisorController.chat);

module.exports = router;
