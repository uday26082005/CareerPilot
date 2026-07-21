const dotenv = require("dotenv");
const { z } = require("zod");

dotenv.config();

const numberFromEnv = (fallback) =>
  z.preprocess((value) => {
    if (value === undefined || value === "") return fallback;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? value : parsed;
  }, z.number().int().positive());

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: numberFromEnv(5000).default(5000),
  CLIENT_URLS: z.string().default("http://localhost:5173"),
  SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  SUPABASE_ANON_KEY: z.string().optional().or(z.literal("")),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().or(z.literal("")),
  GEMINI_API_KEY: z.string().optional().or(z.literal("")),
  GEMINI_MODEL: z.string().default("gemini-1.5-flash"),
  RATE_LIMIT_WINDOW_MS: numberFromEnv(900000).default(900000),
  RATE_LIMIT_MAX: numberFromEnv(100).default(100),
  JSON_BODY_LIMIT: z.string().default("1mb"),
  FILE_SIZE_LIMIT_MB: numberFromEnv(5).default(5),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid server environment configuration.");
  console.error(parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

const env = parsedEnv.data;

const getAllowedOrigins = () =>
  env.CLIENT_URLS.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

module.exports = {
  env,
  getAllowedOrigins,
};
