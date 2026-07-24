const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const { requireAuth } = require("../middleware/auth/requireAuth");
const { validateRequest } = require("../middleware/validation/validateRequest");
const { 
  markAsReadSchema, 
  deleteNotificationSchema, 
  updatePreferencesSchema 
} = require("../schemas/notification.schema");

router.use(requireAuth);

router.get("/", notificationController.getNotifications);
router.get("/unread", notificationController.getNotifications);
router.put("/read-all", notificationController.markAllAsRead);
router.put("/:id/read", validateRequest(markAsReadSchema), notificationController.markAsRead);
router.delete("/:id", validateRequest(deleteNotificationSchema), notificationController.deleteNotification);

router.get("/preferences", notificationController.getPreferences);
router.put("/preferences", validateRequest(updatePreferencesSchema), notificationController.updatePreferences);

module.exports = router;
