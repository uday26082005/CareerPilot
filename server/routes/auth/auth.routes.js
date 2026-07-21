const express = require("express");
const authController = require("../../controllers/auth/auth.controller");
const { requireAuth } = require("../../middleware/auth/requireAuth");
const { validateRequest } = require("../../middleware/validation/validateRequest");
const { loginSchema, logoutSchema } = require("../../schemas/auth.schema");

const router = express.Router();

router.post("/login", validateRequest(loginSchema), authController.login);
router.get("/session", requireAuth, authController.getSession);
router.get("/me", requireAuth, authController.getSession);
router.post("/logout", requireAuth, validateRequest(logoutSchema), authController.logout);

module.exports = router;
