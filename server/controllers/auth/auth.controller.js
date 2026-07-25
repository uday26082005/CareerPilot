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

const validateEmail = asyncHandler(async (req, res) => {
  const emailValidator = require('deep-email-validator');
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const { valid, reason, validators } = await emailValidator.validate({
    email,
    validateRegex: true,
    validateMx: true,
    validateTypo: true,
    validateDisposable: true,
    validateSMTP: true // Important for checking if mailbox actually exists
  });

  if (!valid && validators[reason]) {
    return res.status(400).json({ 
      success: false, 
      message: `Email validation failed: ${validators[reason].reason || reason}`,
      reason 
    });
  }

  sendSuccess(res, {
    message: "Email is valid",
    data: { valid: true }
  });
});

module.exports = {
  login,
  getSession,
  logout,
  validateEmail,
};
