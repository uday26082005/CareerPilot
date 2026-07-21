const { createClient } = require("@supabase/supabase-js");
const { env } = require("./env");
const { AppError } = require("../middleware/error/AppError");

let supabaseAdminClient;
let supabasePublicClient;

const getSupabaseAdmin = () => {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new AppError("Supabase server credentials are not configured.", 500);
  }

  if (!supabaseAdminClient) {
    supabaseAdminClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return supabaseAdminClient;
};

const getSupabasePublic = () => {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    throw new AppError("Supabase public credentials are not configured.", 500);
  }

  if (!supabasePublicClient) {
    supabasePublicClient = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return supabasePublicClient;
};

module.exports = {
  getSupabaseAdmin,
  getSupabasePublic,
};
