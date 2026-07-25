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

// Get current user's own profile (no param needed)
router.get("/", async (req, res, next) => {
  try {
    const { getSupabaseAdmin } = require("../../config/supabase");
    const supabase = getSupabaseAdmin();
    const userId = req.user.id;

    // 1. Try fetching from profiles table
    let profileRecord = null;
    const { data: dbData, error: dbError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (!dbError) {
      profileRecord = dbData;
    }

    // 2. Fetch from auth user metadata
    let authUser = null;
    try {
      const { data: { user } } = await supabase.auth.admin.getUserById(userId);
      authUser = user;
    } catch (e) {
      console.error("Auth fetch failed:", e);
    }

    // 3. Merge fields
    const mergedData = {
      id: userId,
      fullName: profileRecord?.full_name || authUser?.user_metadata?.full_name || authUser?.user_metadata?.name || "",
      targetRole: profileRecord?.target_role || authUser?.user_metadata?.target_role || "",
      currentRole: profileRecord?.current_role || authUser?.user_metadata?.current_role || "",
      yearsExperience: profileRecord?.years_experience !== undefined ? profileRecord.years_experience : authUser?.user_metadata?.years_experience || 0,
      githubUrl: profileRecord?.github_url || authUser?.user_metadata?.github_url || "",
      linkedinUrl: profileRecord?.linkedin_url || authUser?.user_metadata?.linkedin_url || "",
      bio: profileRecord?.bio || authUser?.user_metadata?.bio || "",
      skills: profileRecord?.skills || authUser?.user_metadata?.skills || "",
      avatarUrl: authUser?.user_metadata?.avatar_url || ""
    };

    res.json({ success: true, data: mergedData });
  } catch (error) {
    next(error);
  }
});

// Update current user's own profile
router.put("/", async (req, res, next) => {
  try {
    const { getSupabaseAdmin } = require("../../config/supabase");
    const supabase = getSupabaseAdmin();
    const userId = req.user.id;
    const body = req.body;

    // 1. Update user metadata in Auth (ensures bio, skills, and full_name are saved globally)
    const userMetadata = {};
    if (body.fullName !== undefined) userMetadata.full_name = body.fullName;
    if (body.targetRole !== undefined) userMetadata.target_role = body.targetRole;
    if (body.currentRole !== undefined) userMetadata.current_role = body.currentRole;
    if (body.yearsExperience !== undefined) userMetadata.years_experience = body.yearsExperience;
    if (body.githubUrl !== undefined) userMetadata.github_url = body.githubUrl;
    if (body.linkedinUrl !== undefined) userMetadata.linkedin_url = body.linkedinUrl;
    if (body.bio !== undefined) userMetadata.bio = body.bio;
    if (body.skills !== undefined) userMetadata.skills = body.skills;
    if (body.avatarUrl !== undefined) userMetadata.avatar_url = body.avatarUrl;

    try {
      await supabase.auth.admin.updateUserById(userId, {
        user_metadata: userMetadata
      });
    } catch (authErr) {
      console.error("Auth metadata update failed:", authErr);
    }

    // 2. Build payload for profiles table
    const payload = { id: userId, updated_at: new Date().toISOString() };
    if (body.fullName !== undefined) payload.full_name = body.fullName;
    if (body.targetRole !== undefined) payload.target_role = body.targetRole;
    if (body.currentRole !== undefined) payload.current_role = body.currentRole;
    if (body.yearsExperience !== undefined) payload.years_experience = body.yearsExperience;
    if (body.githubUrl !== undefined) payload.github_url = body.githubUrl;
    if (body.linkedinUrl !== undefined) payload.linkedin_url = body.linkedinUrl;
    if (body.bio !== undefined) payload.bio = body.bio;
    if (body.skills !== undefined) payload.skills = body.skills;

    // 3. Upsert into profiles table
    let savedData = null;
    const { data, error } = await supabase
      .from("profiles")
      .upsert(payload, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      console.error("Profile upsert error:", error);
      // Retry without missing columns
      if (error.message && (error.message.includes("bio") || error.message.includes("skills"))) {
        delete payload.bio;
        delete payload.skills;
        const { data: retryData, error: retryError } = await supabase
          .from("profiles")
          .upsert(payload, { onConflict: "id" })
          .select()
          .single();
        if (retryError) {
          return res.status(500).json({ success: false, error: retryError.message });
        }
        savedData = retryData;
      } else {
        return res.status(500).json({ success: false, error: error.message });
      }
    } else {
      savedData = data;
    }

    // 4. Return merged success response
    const mergedData = {
      id: userId,
      fullName: savedData?.full_name || userMetadata.full_name,
      targetRole: savedData?.target_role || userMetadata.target_role,
      currentRole: savedData?.current_role || userMetadata.current_role,
      yearsExperience: savedData?.years_experience !== undefined ? savedData.years_experience : userMetadata.years_experience,
      githubUrl: savedData?.github_url || userMetadata.github_url,
      linkedinUrl: savedData?.linkedin_url || userMetadata.linkedin_url,
      bio: savedData?.bio || userMetadata.bio || "",
      skills: savedData?.skills || userMetadata.skills || "",
      avatarUrl: userMetadata.avatar_url || ""
    };

    res.json({ success: true, data: mergedData, message: "Profile updated successfully." });
  } catch (error) {
    console.error("Profile update error:", error);
    next(error);
  }
});

// Upload original avatar to Supabase Storage and get public URL
router.post("/avatar", async (req, res, next) => {
  try {
    const { getSupabaseAdmin } = require("../../config/supabase");
    const supabase = getSupabaseAdmin();
    const userId = req.user.id;
    const { base64Data, contentType } = req.body;

    if (!base64Data) {
      return res.status(400).json({ success: false, error: "No image data provided" });
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    
    // File name: avatar-[userId]-[timestamp]
    const fileExt = contentType ? contentType.split('/')[1] : 'jpg';
    const fileName = `avatar-${userId}-${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, buffer, {
        contentType: contentType || 'image/jpeg',
        upsert: true
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    // Update user auth metadata
    try {
      await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { avatar_url: publicUrl }
      });
    } catch (authErr) {
      console.error("Auth metadata update failed:", authErr);
    }

    res.json({ success: true, publicUrl });
  } catch (error) {
    console.error("Avatar upload error:", error);
    next(error);
  }
});

// Export user data
router.get("/export", profileController.exportProfileData);

// Delete account completely via Admin SDK
router.delete("/account", profileController.deleteAccount);

router.post("/save", validateRequest(saveProfileSchema), profileController.saveProfile);
router.get("/:id", validateRequest(getProfileSchema), profileController.getProfile);
router.put("/update", validateRequest(updateProfileSchema), profileController.updateProfile);
router.delete("/delete", validateRequest(deleteProfileSchema), profileController.deleteProfile);

module.exports = router;
