const { z } = require("zod");

const roadmapResourceSchema = z.object({
  title: z.string().optional().default("Resource"),
  url: z.string().optional().default("https://roadmap.sh"),
  type: z.string().optional().default("Documentation"),
});

const roadmapTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().default(""),
  estimated_hours: z.number().nonnegative().optional().default(10),
  resource: roadmapResourceSchema.optional().nullable(),
});

const roadmapProjectSchema = z.union([
  z.object({
    title: z.string().min(1),
    description: z.string().optional().default(""),
  }),
  z.string().transform((str) => ({
    title: str,
    description: "",
  })),
]);

const roadmapPhaseSchema = z.object({
  phase_number: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().optional().default(""),
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
