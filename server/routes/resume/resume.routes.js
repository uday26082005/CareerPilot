const express = require("express");

const resumeController = require("../../controllers/resume/resume.controller");
const { requireAuth } = require("../../middleware/auth/requireAuth");
const { resumeUpload } = require("../../middleware/upload/resumeUpload");
const { validateRequest } = require("../../middleware/validation/validateRequest");
const {
  analyzeResumeSchema,
  listResumeHistorySchema,
} = require("../../schemas/resume.schema");

const router = express.Router();

router.use(requireAuth);

router.post(
  "/analyze",
  resumeUpload.single("resume"),
  validateRequest(analyzeResumeSchema),
  resumeController.analyzeResume
);
router.get("/latest", validateRequest(analyzeResumeSchema), resumeController.getLatestAnalysis);
router.get("/history", validateRequest(listResumeHistorySchema), resumeController.getAnalysisHistory);

module.exports = router;
