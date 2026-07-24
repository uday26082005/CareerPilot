const notificationService = require("../services/notification/notification.service");
const { sendSuccess } = require("../utils/responseHandler");

const getNotifications = async (req, res, next) => {
  try {
    const unreadOnly = req.path.endsWith("/unread");
    // Trigger smart generation in background (fire & forget to avoid blocking response)
    notificationService.generateSmartNotifications(req.user.id).catch(err => console.error("Smart Notification Gen Failed:", err));
    
    const data = await notificationService.getNotifications(req.user.id, unreadOnly);
    sendSuccess(res, { data, message: "Notifications fetched." });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const data = await notificationService.markAsRead(req.user.id, req.params.id);
    sendSuccess(res, { data, message: "Notification marked as read." });
  } catch (error) {
    next(error);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    await notificationService.markAllAsRead(req.user.id);
    sendSuccess(res, { message: "All notifications marked as read." });
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    await notificationService.deleteNotification(req.user.id, req.params.id);
    sendSuccess(res, { message: "Notification deleted." });
  } catch (error) {
    next(error);
  }
};

const getPreferences = async (req, res, next) => {
  try {
    const data = await notificationService.getPreferences(req.user.id);
    sendSuccess(res, { data, message: "Preferences fetched." });
  } catch (error) {
    next(error);
  }
};

const updatePreferences = async (req, res, next) => {
  try {
    const data = await notificationService.updatePreferences(req.user.id, req.body);
    sendSuccess(res, { data, message: "Preferences updated." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getPreferences,
  updatePreferences
};
