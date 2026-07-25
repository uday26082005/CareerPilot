const { getSupabaseAdmin } = require("./config/supabase");
require('dotenv').config();

async function checkEvents() {
  const supabase = getSupabaseAdmin();
  const userId = '67cfadcd-4f3e-4940-8bfd-ea0253abbcbb';

  const { data: events, error } = await supabase
    .from("user_scheduled_events")
    .select("*")
    .eq("user_id", userId);

  console.log("Scheduled Events:", events, "Error:", error);
}
checkEvents();
