const { z } = require("zod");

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

const logoutSchema = z.object({
  body: z
    .object({
      scope: z.enum(["global", "local", "others"]).default("global"),
    })
    .default({}),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

module.exports = {
  loginSchema,
  logoutSchema,
};
