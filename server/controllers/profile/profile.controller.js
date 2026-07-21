const profileService = require("../../services/profile/profile.service");
const { asyncHandler } = require("../../utils/helpers/asyncHandler");
const { sendSuccess } = require("../../utils/responseHandler");

const saveProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const profileData = req.validated.body;

  const data = await profileService.upsertProfile(userId, profileData);

  sendSuccess(res, {
    message: "Profile saved successfully.",
    data,
    statusCode: 201
  });
});

const getProfile = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  
  const data = await profileService.getProfileById(id);

  sendSuccess(res, {
    message: "Profile retrieved successfully.",
    data,
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const updateData = req.validated.body;

  const data = await profileService.updateProfile(userId, updateData);

  sendSuccess(res, {
    message: "Profile updated successfully.",
    data,
  });
});

const deleteProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  await profileService.deleteProfile(userId);

  sendSuccess(res, {
    message: "Profile deleted successfully.",
  });
});

module.exports = {
  saveProfile,
  getProfile,
  updateProfile,
  deleteProfile,
};
