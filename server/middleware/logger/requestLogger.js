const morgan = require("morgan");
const { env } = require("../../config/env");

morgan.token("safe-url", (req) => req.originalUrl.split("?")[0]);

const requestLogger = morgan(
  ":method :safe-url :status :res[content-length] - :response-time ms",
  {
    skip: () => env.NODE_ENV === "test",
  }
);

module.exports = {
  requestLogger,
};
