require("dotenv").config();
const { getSupabaseAdmin } = require("./config/supabase");
const supabase = getSupabaseAdmin();
const dashboardService = require("./services/dashboard.service");

async function test() {
  try {
    const { data: profile } = await supabase.from("profiles").select("id").limit(1).single();
    if (!profile) {
      console.log("No profile found to test");
      return;
    }
    const userId = profile.id;
    console.log("Testing for user:", userId);

    const result = await dashboardService.fetchCompleteDashboard(userId);
    console.log("Success!");
  } catch (error) {
    console.error("Dashboard Error:", error.message);
  }
}

test();
