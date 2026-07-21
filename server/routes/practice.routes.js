const express = require("express");
const practiceController = require("../controllers/practice.controller");
const { requireAuth } = require("../middleware/auth/requireAuth");
const { validateRequest } = require("../middleware/validation/validateRequest");
const {
  startPracticeSchema,
  answerPracticeSchema,
  practiceIdSchema,
  practiceHistorySchema,
} = require("../schemas/practice.schema");

const router = express.Router();

router.use(requireAuth);

router.post("/start", validateRequest(startPracticeSchema), practiceController.startPractice);
router.post("/:id/answer", validateRequest(answerPracticeSchema), practiceController.answerQuestion);
router.post("/:id/complete", validateRequest(practiceIdSchema), practiceController.completePractice);
router.get("/history", validateRequest(practiceHistorySchema), practiceController.getHistory);
router.get("/statistics", practiceController.getStatistics);
router.get("/:id", validateRequest(practiceIdSchema), practiceController.getPracticeDetails);
router.delete("/:id", validateRequest(practiceIdSchema), practiceController.deletePractice);

module.exports = router;
