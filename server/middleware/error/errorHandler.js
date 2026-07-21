const { ZodError } = require("zod");
const multer = require("multer");
const { env } = require("../../config/env");
const { HTTP_STATUS } = require("../../utils/constants/httpStatus");

const getStatusCode = (error) => error.statusCode || error.status || 500;

const formatZodError = (error) =>
  error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

const errorHandler = (error, req, res, next) => {
  const statusCode = getStatusCode(error);
  const isProduction = env.NODE_ENV === "production";

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Request validation failed.",
      errors: formatZodError(error),
    });
  }

  if (error instanceof multer.MulterError) {
    const isOversizedFile = error.code === "LIMIT_FILE_SIZE";
    return res.status(isOversizedFile ? HTTP_STATUS.PAYLOAD_TOO_LARGE : HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: isOversizedFile ? "Resume file must not exceed 5 MB." : error.message,
    });
  }

  if (statusCode >= 500) {
    console.error({
      message: error.message,
      stack: error.stack,
      path: req.originalUrl,
      method: req.method,
    });
  }

  return res.status(statusCode).json({
    success: false,
    message: statusCode >= 500 && isProduction ? "Internal server error." : error.message,
    details: !isProduction ? error.details || null : undefined,
  });
};

module.exports = {
  errorHandler,
};
