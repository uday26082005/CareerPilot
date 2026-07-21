const express = require("express");
const profileController = require("../../controllers/profile/profile.controller");
const { requireAuth } = require("../../middleware/auth/requireAuth");
const { validateRequest } = require("../../middleware/validation/validateRequest");
const {
  saveProfileSchema,
  getProfileSchema,
  updateProfileSchema,
  deleteProfileSchema,
} = require("../../schemas/profile.schema");

const router = express.Router();

router.use(requireAuth);

router.post("/save", validateRequest(saveProfileSchema), profileController.saveProfile);
router.get("/:id", validateRequest(getProfileSchema), profileController.getProfile);
router.put("/update", validateRequest(updateProfileSchema), profileController.updateProfile);
router.delete("/delete", validateRequest(deleteProfileSchema), profileController.deleteProfile);

module.exports = router;
