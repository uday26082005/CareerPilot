const express = require("express");
const { requireAuth: protect } = require("../middleware/auth/requireAuth");
const insightsService = require("../services/career/insights.service");

const router = express.Router();

router.use(protect);

router.get("/", async (req, res, next) => {
  try {
    const insights = await insightsService.getInsights(req.user.id);
    res.json({ success: true, data: insights });
  } catch (error) {
    next(error);
  }
});

router.post("/generate", async (req, res, next) => {
  try {
    const insights = await insightsService.generateInsights(req.user.id);
    res.json({ success: true, data: insights });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
