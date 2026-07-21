const express = require("express");
const interviewController = require("../controllers/interview.controller");
const { validateRequest } = require("../middleware/validation/validateRequest");
const { requireAuth } = require("../middleware/auth/requireAuth");
const { startInterviewSchema, answerQuestionSchema } = require("../schemas/interview.schema");

const router = express.Router();

router.use(requireAuth);

router.post("/start", validateRequest(startInterviewSchema), interviewController.startInterview);
router.post("/:id/answer", validateRequest(answerQuestionSchema), interviewController.answerQuestion);
router.post("/:id/complete", interviewController.completeInterview);

router.get("/history", interviewController.getHistory);
router.get("/statistics", interviewController.getStatistics);
router.get("/:id", interviewController.getInterviewDetails);

router.delete("/:id", interviewController.deleteInterview);

module.exports = router;
