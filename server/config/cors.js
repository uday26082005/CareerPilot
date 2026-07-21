const { env, getAllowedOrigins } = require("./env");
const { AppError } = require("../middleware/error/AppError");

const allowedOrigins = getAllowedOrigins();

const isLocalDevelopmentOrigin = (origin) =>
  env.NODE_ENV !== "production" &&
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || isLocalDevelopmentOrigin(origin)) {
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
