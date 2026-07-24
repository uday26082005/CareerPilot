const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analytics.controller");
const { requireAuth } = require("../middleware/auth/requireAuth");

// All analytics routes require authentication
router.use(requireAuth);

router.get("/overview", analyticsController.getOverview);
router.get("/progress", analyticsController.getProgress);
router.get("/interviews", analyticsController.getInterviews);
router.get("/practice", analyticsController.getPractice);
router.get("/skills", analyticsController.getSkills);
router.get("/activity", analyticsController.getActivity);
router.get("/insights", analyticsController.getInsights);

module.exports = router;
