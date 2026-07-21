const { verifyAccessToken } = require("../../services/auth/auth.service");
const { getBearerToken } = require("../../utils/helpers/authToken");

const optionalAuth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      next();
      return;
    }

    const accessToken = getBearerToken(req.headers.authorization);
    const user = await verifyAccessToken(accessToken);

    req.accessToken = accessToken;
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  optionalAuth,
};
