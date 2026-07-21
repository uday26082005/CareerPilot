const express = require("express");
const authRoutes = require("./auth/auth.routes");
const profileRoutes = require("./profile/profile.routes");
const { sendSuccess } = require("../utils/responseHandler");

const router = express.Router();

router.get("/", (req, res) => {
  sendSuccess(res, {
    message: "CareerPilot API is ready for module routes.",
    data: {
      phase: "foundation",
      mountedModules: ["auth", "profile"],
    },
  });
});

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);

module.exports = router;
