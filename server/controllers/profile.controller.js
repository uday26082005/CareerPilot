const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const saveProfile = async (req, res) => {
  try {
    const { userId, fullName, currentRole, targetRole, yearsExperience, githubUrl, linkedinUrl } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!supabase) {
      return res.status(500).json({ error: 'Supabase client not initialized' });
    }

    console.log(`Saving profile for user ${userId}...`);

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId, // Primary key
        full_name: fullName,
        job_role: currentRole,
        target_role: targetRole,
        years_experience: parseInt(yearsExperience) || 0,
        github_url: githubUrl,
        linkedin_url: linkedinUrl
      }, { onConflict: 'id' });

    if (error) {
      console.error('Database Upsert Error:', error);
      return res.status(500).json({ error: 'Failed to save profile data', details: error.message });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Profile saved successfully'
    });

  } catch (error) {
    console.error('Error saving profile:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

module.exports = {
  saveProfile
};
