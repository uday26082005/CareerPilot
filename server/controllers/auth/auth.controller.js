const { loginWithPassword, logoutAccessToken } = require("../../services/auth/auth.service");
const { asyncHandler } = require("../../utils/helpers/asyncHandler");
const { sendSuccess } = require("../../utils/responseHandler");

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;
  const data = await loginWithPassword({ email, password });

  sendSuccess(res, {
    message: "Login successful.",
    data,
  });
});

const getSession = asyncHandler(async (req, res) => {
  sendSuccess(res, {
    message: "Session is valid.",
    data: {
      user: req.user,
    },
  });
});

const logout = asyncHandler(async (req, res) => {
  const { scope } = req.validated.body;

  await logoutAccessToken({
    accessToken: req.accessToken,
    scope,
  });

  sendSuccess(res, {
    message: "Logout successful.",
  });
});

module.exports = {
  login,
  getSession,
  logout,
};
