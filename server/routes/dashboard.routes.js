const express = require("express");
const dashboardController = require("../controllers/dashboard.controller");
const { requireAuth } = require("../middleware/auth/requireAuth");
const { validateRequest } = require("../middleware/validation/validateRequest");
const { createScheduledEventSchema } = require("../schemas/dashboard.schema");

const router = express.Router();

router.use(requireAuth);

router.get("/", dashboardController.getCompleteDashboard);
router.get("/profile", dashboardController.getProfileSummary);
router.get("/resume", dashboardController.getResumeSummary);
router.get("/roadmap", dashboardController.getRoadmapSummary);
router.get("/interviews", dashboardController.getInterviewSummary);
router.get("/practice", dashboardController.getPracticeSummary);
router.get("/activity", dashboardController.getRecentActivity);
router.post("/events", validateRequest(createScheduledEventSchema), dashboardController.addScheduledEvent);

module.exports = router;
