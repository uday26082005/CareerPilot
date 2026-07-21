const { getSupabaseAdmin, getSupabasePublic } = require("../../config/supabase");
const { AppError } = require("../../middleware/error/AppError");

const sanitizeUser = (user) => {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    role: user.role,
    appMetadata: user.app_metadata,
    userMetadata: user.user_metadata,
    identities: user.identities,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    lastSignInAt: user.last_sign_in_at,
  };
};

const loginWithPassword = async ({ email, password }) => {
  const supabase = getSupabasePublic();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new AppError(error.message || "Invalid login credentials.", 401);
  }

  return {
    session: data.session,
    user: sanitizeUser(data.user),
  };
};

const verifyAccessToken = async (accessToken) => {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) {
    throw new AppError("Invalid or expired authentication token.", 401);
  }

  return sanitizeUser(data.user);
};

const logoutAccessToken = async ({ accessToken, scope = "global" }) => {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.auth.admin.signOut(accessToken, scope);

  if (error) {
    throw new AppError(error.message || "Unable to sign out.", 400);
  }

  return true;
};

module.exports = {
  loginWithPassword,
  verifyAccessToken,
  logoutAccessToken,
};
