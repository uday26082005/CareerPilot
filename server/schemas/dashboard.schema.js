const { z } = require("zod");

const createScheduledEventSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(150),
    type: z.enum(["interview", "task", "review", "assessment", "practice"]),
    scheduled_at: z.string().datetime()
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

module.exports = {
  createScheduledEventSchema,
};
