const express = require("express");
const authRoutes = require("./auth/auth.routes");
const profileRoutes = require("./profile/profile.routes");
const resumeRoutes = require("./resume/resume.routes");
const skillGapRoutes = require("./skillgap.routes");
const roadmapRoutes = require("./roadmap/roadmap.routes");
const interviewRoutes = require("./interview.routes");
const transcribeRoutes = require("./transcribe.routes");
const practiceRoutes = require("./practice.routes");
const dashboardRoutes = require("./dashboard.routes");
const { sendSuccess } = require("../utils/responseHandler");

const router = express.Router();

router.get("/", (req, res) => {
  sendSuccess(res, {
    message: "CareerPilot API is ready for module routes.",
    data: {
      phase: "foundation",
      mountedModules: ["auth", "profile", "resume"],
    },
  });
});

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/resume", resumeRoutes);
router.use("/skillgap", skillGapRoutes);
router.use("/roadmap", roadmapRoutes);
router.use("/interviews", interviewRoutes);
router.use("/transcribe", transcribeRoutes);
router.use("/practice", practiceRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;
