const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const crypto = require('crypto');

async function test() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

  if (!supabase) {
    console.log("Supabase missing env");
    return;
  }

  // Create a dummy ID
  const uuid = crypto.randomUUID();

  const payload = {
    id: uuid,
    full_name: "Test User",
    current_role: "student",
    target_role: "developer",
    years_experience: 1,
    github_url: "",
    linkedin_url: ""
  };

  const { data, error } = await supabase
    .from('profiles')
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    console.log("Error upserting profile:", error);
  } else {
    console.log("Success:", data);
  }
}
test();
