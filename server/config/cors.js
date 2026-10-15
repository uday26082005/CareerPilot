const { env, getAllowedOrigins } = require("./env");
const { AppError } = require("../middleware/error/AppError");

const allowedOrigins = getAllowedOrigins();

const isLocalDevelopmentOrigin = (origin) =>
  env.NODE_ENV !== "production" &&
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

const isVercelOrigin = (origin) =>
  /^https:\/\/[a-zA-Z0-9_-]+\.vercel\.app$/.test(origin);

const corsOptions = {
  origin(origin, callback) {
    const allowedOrigins = getAllowedOrigins();
    const cleanOrigin = origin ? origin.replace(/\/+$/, "") : "";

    if (
      !origin ||
      allowedOrigins.includes("*") ||
      allowedOrigins.includes(cleanOrigin) ||
      allowedOrigins.includes(origin) ||
      isLocalDevelopmentOrigin(origin) ||
      isVercelOrigin(origin) ||
      isVercelOrigin(cleanOrigin)
    ) {
      callback(null, true);
      return;
    }

    callback(new AppError(`CORS blocked origin: ${origin}`, 403));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = {
  corsOptions,
};
