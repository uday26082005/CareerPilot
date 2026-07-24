require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const interviewService = require('./services/interview/interview.service');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testStartInterview() {
  const { data: profile } = await supabase.from('profiles').select('id').limit(1).single();
  
  if (!profile) {
    console.log("No profile found.");
    return;
  }

  try {
    const payload = {
      interviewType: "Technical Interview",
      difficulty: "Medium",
    };
    
    console.log("Starting interview for user:", profile.id);
    const result = await interviewService.startInterview(profile.id, payload);
    console.log("Success! Result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Test failed with error:", error);
    console.error("Error Message:", error.message);
    if (error.statusCode) {
      console.error("Status Code:", error.statusCode);
    }
  }
}

testStartInterview();
