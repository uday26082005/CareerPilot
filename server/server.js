const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const { env } = require("./config/env");
const { corsOptions } = require("./config/cors");
const apiRoutes = require("./routes");
const { globalRateLimiter } = require("./middleware/rateLimiter/globalRateLimiter");
const { requestLogger } = require("./middleware/logger/requestLogger");
const { notFoundHandler } = require("./middleware/error/notFoundHandler");
const { errorHandler } = require("./middleware/error/errorHandler");
const { sendSuccess } = require("./utils/responseHandler");

const app = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: env.JSON_BODY_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: env.JSON_BODY_LIMIT }));
app.use(requestLogger);
app.use(globalRateLimiter);

app.get("/api/health", (req, res) => {
  sendSuccess(res, {
    message: "CareerPilot API foundation is running.",
    data: {
      service: "careerpilot-api",
      environment: env.NODE_ENV,
      uptimeSeconds: Math.round(process.uptime()),
    },
  });
});

app.use("/api", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

if (require.main === module) {
  app.listen(env.PORT, () => {
    console.log(`CareerPilot API listening on http://localhost:${env.PORT}`);
  });
}

module.exports = app;
