const { z } = require("zod");

const getNotificationsSchema = z.object({});

const markAsReadSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

const deleteNotificationSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

const updatePreferencesSchema = z.object({
  body: z.object({
    resume_notifications: z.boolean().optional(),
    roadmap_notifications: z.boolean().optional(),
    practice_notifications: z.boolean().optional(),
    interview_notifications: z.boolean().optional(),
    analytics_notifications: z.boolean().optional(),
    advisor_notifications: z.boolean().optional(),
    email_notifications: z.boolean().optional(),
    push_notifications: z.boolean().optional(),
  }),
});

module.exports = {
  getNotificationsSchema,
  markAsReadSchema,
  deleteNotificationSchema,
  updatePreferencesSchema,
};
