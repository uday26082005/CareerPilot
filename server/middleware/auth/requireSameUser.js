const { AppError } = require("../error/AppError");

const requireSameUser = (getRequestedUserId) => (req, res, next) => {
  const requestedUserId =
    typeof getRequestedUserId === "function" ? getRequestedUserId(req) : req.params.userId;

  if (!req.user?.id) {
    next(new AppError("Authenticated user is required.", 401));
    return;
  }

  if (!requestedUserId || requestedUserId !== req.user.id) {
    next(new AppError("You are not allowed to access another user's data.", 403));
    return;
  }

  next();
};

module.exports = {
  requireSameUser,
};
