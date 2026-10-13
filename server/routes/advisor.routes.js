const express = require("express");
const router = express.Router();
const advisorController = require("../controllers/advisor.controller");
const { requireAuth } = require("../middleware/auth/requireAuth");

router.use(requireAuth);

router.post("/chat", advisorController.chat);
router.get("/conversations", advisorController.getConversations);
router.get("/conversations/:id", advisorController.getConversation);
router.patch("/conversations/:id", advisorController.renameConversation);
router.put("/conversations/:id", advisorController.renameConversation);
router.delete("/conversations/:id", advisorController.deleteConversation);

module.exports = router;
