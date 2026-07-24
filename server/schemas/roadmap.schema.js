const { z } = require("zod");

const roadmapResourceSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  type: z.string().optional().default("Link"), // e.g., "Course", "Documentation", "Video"
});
const roadmapTaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  estimated_hours: z.number().nonnegative().optional().default(0),
  resource: roadmapResourceSchema.optional().nullable(),
});

const roadmapProjectSchema = z.object({
  title: z.string(),
  description: z.string(),
});

const roadmapPhaseSchema = z.object({
  phase_number: z.number().int().positive(),
  title: z.string(),
  description: z.string(),
  estimated_duration: z.string().optional().default(""),
  skills: z.array(z.string()).optional().default([]),
  tasks: z.array(roadmapTaskSchema).optional().default([]),
  projects: z.array(roadmapProjectSchema).optional().default([]),
  milestone: z.string().optional().default(""),
});

const generateRoadmapSchema = z.object({
  estimated_duration: z.string().optional().default(""),
  summary: z.string().optional().default(""),
  phases: z.array(roadmapPhaseSchema).optional().default([]),
});

const updateTaskStatusSchema = z.object({
  body: z.object({
    status: z.enum(["Pending", "In Progress", "Completed"])
  }),
  params: z.object({
    taskId: z.string().uuid()
  })
});

module.exports = {
  generateRoadmapSchema,
  updateTaskStatusSchema,
};
