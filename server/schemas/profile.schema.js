const { z } = require("zod");

const saveProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, "Full name is required"),
    currentRole: z.string().optional().nullable(),
    targetRole: z.string().optional().nullable(),
    yearsExperience: z.number().int().min(0).optional().nullable(),
    githubUrl: z.string().url().optional().nullable().or(z.literal("")),
    linkedinUrl: z.string().url().optional().nullable().or(z.literal("")),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

const getProfileSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({
    id: z.string().uuid("Invalid profile ID"),
  }),
  query: z.object({}).default({}),
});

const updateProfileSchema = saveProfileSchema; // Using same validation rules for body

const deleteProfileSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

module.exports = {
  saveProfileSchema,
  getProfileSchema,
  updateProfileSchema,
  deleteProfileSchema,
};
