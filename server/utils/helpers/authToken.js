const { AppError } = require("../../middleware/error/AppError");

const getBearerToken = (authorizationHeader) => {
  if (!authorizationHeader) {
    throw new AppError("Authorization header is required.", 401);
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new AppError("Authorization header must use Bearer token format.", 401);
  }

  return token;
};

module.exports = {
  getBearerToken,
};
