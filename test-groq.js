const { generateInsights } = require("./server/services/career/insights.service");
const { getSupabaseAdmin } = require("./server/config/supabase");

async function run() {
  try {
    const supabase = getSupabaseAdmin();
    // Get the first user
    const { data: users } = await supabase.from('profiles').select('id').limit(1);
    const userId = users[0].id;
    console.log("Found user:", userId);

    console.log("Generating insights...");
    const insights = await generateInsights(userId);
    console.log("Insights generated successfully!");
    console.log("Top companies:", insights.top_companies);
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
