const { getSupabaseAdmin } = require("../../config/supabase");
const { AppError } = require("../../middleware/error/AppError");

const formatProfileResponse = (profile) => {
  if (!profile) return null;
  return {
    id: profile.id,
    fullName: profile.full_name,
    currentRole: profile.current_role,
    targetRole: profile.target_role,
    yearsExperience: profile.years_experience,
    githubUrl: profile.github_url,
    linkedinUrl: profile.linkedin_url,
    bio: profile.bio || "",
    skills: profile.skills || "",
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  };
};

const upsertProfile = async (userId, profileData) => {
  const supabase = getSupabaseAdmin();

  const payload = {
    id: userId,
    full_name: profileData.fullName,
    current_role: profileData.currentRole,
    target_role: profileData.targetRole,
    years_experience: profileData.yearsExperience,
    github_url: profileData.githubUrl,
    linkedin_url: profileData.linkedinUrl,
    bio: profileData.bio,
    skills: profileData.skills,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    throw new AppError(error.message || "Failed to save profile.", 500);
  }

  return formatProfileResponse(data);
};

const getProfileById = async (userId) => {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
       throw new AppError("Profile not found.", 404);
    }
    throw new AppError(error.message || "Failed to retrieve profile.", 500);
  }

  return formatProfileResponse(data);
};

const updateProfile = async (userId, updateData) => {
  const supabase = getSupabaseAdmin();

  const payload = {
    full_name: updateData.fullName,
    current_role: updateData.currentRole,
    target_role: updateData.targetRole,
    years_experience: updateData.yearsExperience,
    github_url: updateData.githubUrl,
    linkedin_url: updateData.linkedinUrl,
    bio: updateData.bio,
    skills: updateData.skills,
    updated_at: new Date().toISOString(),
  };
  
  // Remove undefined fields so they aren't overwritten with null if not provided
  Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

  const { data, error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
     if (error.code === 'PGRST116') {
       throw new AppError("Profile not found.", 404);
    }
    throw new AppError(error.message || "Failed to update profile.", 500);
  }

  return formatProfileResponse(data);
};

const deleteProfile = async (userId) => {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (error) {
    throw new AppError(error.message || "Failed to delete profile.", 500);
  }

  return true;
};

const deleteUserAccount = async (userId) => {
  const supabase = getSupabaseAdmin();
  
  try {
    // Delete from other tables first to avoid FK constraint errors if cascade is not set
    await supabase.from("practice_questions").delete().eq("user_id", userId);
    await supabase.from("resumes").delete().eq("user_id", userId);
    await supabase.from("roadmaps").delete().eq("user_id", userId);
    await supabase.from("interviews").delete().eq("user_id", userId);
    await supabase.from("profiles").delete().eq("id", userId);
  } catch (dbErr) {
    console.warn("Manual table deletion error (might cascade anyway):", dbErr);
  }

  // Finally, delete the auth user
  const { data, error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    console.error("Delete user error:", error);
    throw new AppError(error.message || "Failed to delete auth user.", 500);
  }

  return true;
};

const exportUserData = async (userId) => {
  const supabase = getSupabaseAdmin();

  // Fetch all related user data
  const [profileRes, resumesRes, practiceRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase.from("resumes").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("practice_questions").select("*").eq("user_id", userId).order("created_at", { ascending: false })
  ]);

  return {
    profile: profileRes.data || null,
    resumes: resumesRes.data || [],
    practiceHistory: practiceRes.data || []
  };
};

module.exports = {
  upsertProfile,
  getProfileById,
  updateProfile,
  deleteProfile,
  deleteUserAccount,
  exportUserData
};
