const { getSupabaseAdmin } = require("./supabase");

const getDatabaseClient = () => getSupabaseAdmin();

module.exports = {
  getDatabaseClient,
};
