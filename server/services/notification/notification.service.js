const { getSupabaseAdmin } = require("../../config/supabase");
const { AppError } = require("../../middleware/error/AppError");
const { HTTP_STATUS } = require("../../utils/constants/httpStatus");

const getNotifications = async (userId, unreadOnly = false) => {
  const supabase = getSupabaseAdmin();
  let query = supabase.from("notifications").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  if (unreadOnly) {
    query = query.eq("is_read", false);
  }
  const { data, error } = await query;
  if (error) throw new AppError(`Error fetching notifications: ${error.message}`, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  return data || [];
};

const markAsRead = async (userId, notificationId) => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true, updated_at: new Date().toISOString() })
    .eq("id", notificationId)
    .eq("user_id", userId)
    .select()
    .single();
    
  if (error) throw new AppError("Failed to mark notification as read", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  return data;
};

const markAllAsRead = async (userId) => {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("is_read", false);
    
  if (error) throw new AppError("Failed to mark all as read", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  return { success: true };
};

const deleteNotification = async (userId, notificationId) => {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("notifications").delete().eq("id", notificationId).eq("user_id", userId);
  if (error) throw new AppError("Failed to delete notification", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  return { success: true };
};

const getPreferences = async (userId) => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("notification_preferences").select("*").eq("user_id", userId).maybeSingle();
  
  if (error) throw new AppError("Failed to fetch preferences", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  
  if (!data) {
    // Return default preferences if not yet created
    return {
      user_id: userId,
      resume_notifications: true,
      roadmap_notifications: true,
      practice_notifications: true,
      interview_notifications: true,
      analytics_notifications: true,
      advisor_notifications: true,
      email_notifications: false,
      push_notifications: false
    };
  }
  return data;
};

const updatePreferences = async (userId, prefs) => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("notification_preferences")
    .upsert({ ...prefs, user_id: userId, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
    .select()
    .single();
    
  if (error) throw new AppError("Failed to update preferences", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  return data;
};

const generateSmartNotifications = async (userId) => {
  const supabase = getSupabaseAdmin();
  const prefs = await getPreferences(userId);
  const newNotifications = [];

  // Logic: Check last practice
  if (prefs.practice_notifications) {
    const { data: lastPractice } = await supabase.from("practice_sessions").select("created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).maybeSingle();
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    if (!lastPractice || new Date(lastPractice.created_at) < threeDaysAgo) {
      // Check if we already sent this notification recently
      const { data: recentNotif } = await supabase.from("notifications").select("id").eq("user_id", userId).eq("type", "Practice Reminder").gte("created_at", threeDaysAgo.toISOString()).maybeSingle();
      if (!recentNotif) {
        newNotifications.push({
          user_id: userId, title: "Practice Reminder", message: "You haven't completed a practice session recently. Keep your skills sharp!",
          type: "Practice Reminder", priority: "Medium", source_module: "Practice Arena", action_url: "/practice"
        });
      }
    }
  }

  // Logic: Missing Resume Analysis
  if (prefs.resume_notifications) {
    const { data: resume } = await supabase.from("resume_analysis").select("id").eq("user_id", userId).limit(1).maybeSingle();
    if (!resume) {
      const { data: recentNotif } = await supabase.from("notifications").select("id").eq("user_id", userId).eq("type", "Resume Analysis Reminder").maybeSingle();
      if (!recentNotif) {
        newNotifications.push({
          user_id: userId, title: "Resume Analysis Reminder", message: "Upload your resume to get AI feedback and improve your ATS score.",
          type: "Resume Analysis Reminder", priority: "High", source_module: "Resume Analysis", action_url: "/resume-analysis"
        });
      }
    }
  }

  // Insert generated notifications
  if (newNotifications.length > 0) {
    await supabase.from("notifications").insert(newNotifications);
  }

  return { generated: newNotifications.length };
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getPreferences,
  updatePreferences,
  generateSmartNotifications
};
