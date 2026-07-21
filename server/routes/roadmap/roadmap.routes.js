const express = require("express");
const { requireAuth } = require("../../middleware/auth/requireAuth");
const { validateRequest } = require("../../middleware/validation/validateRequest");
const { updateTaskStatusSchema } = require("../../schemas/roadmap.schema");
const roadmapController = require("../../controllers/roadmap/roadmap.controller");

const router = express.Router();

router.use(requireAuth);

router.post("/generate", roadmapController.generateRoadmap);
router.get("/latest", roadmapController.getLatestRoadmap);
router.get("/history", roadmapController.getRoadmapHistory);
router.put("/regenerate", roadmapController.regenerateRoadmap);

router.put(
  "/task/:taskId",
  validateRequest(updateTaskStatusSchema),
  roadmapController.updateTaskStatus
);

module.exports = router;
