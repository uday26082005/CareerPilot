const pdfParse = require("pdf-parse");
const { randomUUID } = require("crypto");

const aiService = require("../ai/groq.service");
const { getSupabaseAdmin } = require("../../config/supabase");
const { AppError } = require("../../middleware/error/AppError");
const { HTTP_STATUS } = require("../../utils/constants/httpStatus");
const { resumeAnalysisSchema } = require("../../schemas/resume.schema");
const profileService = require("../profile/profile.service");

const RESUME_BUCKET = "resumes";
const MAX_RESUME_TEXT_LENGTH = 60000;

const isPdfBuffer = (buffer) =>
  Buffer.isBuffer(buffer) && buffer.subarray(0, 5).toString("ascii") === "%PDF-";

const sanitizeFilename = (filename) =>
  filename
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 120) || "resume.pdf";

const createStoragePath = (userId, filename) => {
  const safeFilename = sanitizeFilename(filename).replace(/\.pdf$/i, "");
  return `${userId}/resume_${Date.now()}_${randomUUID()}_${safeFilename}.pdf`;
};

const toArray = (value) => (Array.isArray(value) ? value : []);

const formatResumeAnalysis = (record) => {
  if (!record) return null;

  return {
    id: record.id,
    resumePath: record.resume_url,
    resumeFilename: record.resume_filename,
    overallScore: record.overall_score,
    overallSummary: record.overall_summary || "",
    atsScore: record.ats_score,
    atsStatus: record.ats_status || "",
    atsTips: toArray(record.ats_tips),
    sectionScores: record.section_scores || {},
    topStrengths: toArray(record.strengths),
    keySuggestions: toArray(record.key_suggestions),
    recommendedKeywords: toArray(record.recommended_keywords),
    roleFit: {
      targetRole: record.analysis_json?.role_fit?.target_role || record.analysis_json?.target_role || "",
      score: record.analysis_json?.role_fit?.score || 0,
      summary: record.role_fit_summary || "",
      strengths: toArray(record.analysis_json?.role_fit?.strengths),
      weaknesses: toArray(record.analysis_json?.role_fit?.weaknesses),
    },
    targetRole: record.analysis_json?.target_role || null,
    analysisSource: record.analysis_json?.source || "gemini",
    analysisWarning: record.analysis_json?.warning || null,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
};

const buildFallbackAnalysis = (targetRole, reason) => ({
  overall_score: 0,
  overall_summary: "Analysis is temporarily unavailable.",
  ats_score: 0,
  ats_status: "Error",
  ats_tips: ["Try analyzing this resume again shortly."],
  section_scores: {},
  strengths: [],
  key_suggestions: [],
  recommended_keywords: [],
  role_fit: {
    target_role: targetRole,
    score: 0,
    summary: `Analysis is temporarily unavailable for the ${targetRole} role.`,
    strengths: [],
    weaknesses: []
  },
  source: "fallback",
  warning: reason,
});

const buildGeminiPrompt = (resumeText, targetRole) => `You are an ATS resume analyst. Analyze the resume against the target role.

Target role: ${targetRole}

Return exactly one JSON object with no Markdown, commentary, or additional keys. All scores must be numbers from 0 to 100. Use concise, specific string items in every array.
CRITICAL SCORING INSTRUCTIONS: Be extremely critical and strict. A typical average resume should score between 40-60. Only absolutely perfect, world-class resumes should ever score 90+. Most users lack experience and should be scored harshly to identify areas of improvement.

Required JSON shape:
{
  "overall_score": 88,
  "overall_summary": "",
  "ats_score": 85,
  "ats_status": "",
  "ats_tips": [],
  "section_scores": {
    "summary": { "score": 80, "feedback": "" },
    "experience": { "score": 88, "feedback": "" },
    "skills": { "score": 90, "feedback": "" },
    "projects": { "score": 84, "feedback": "" },
    "education": { "score": 86, "feedback": "" },
    "certifications": { "score": 78, "feedback": "" }
  },
  "strengths": [],
  "key_suggestions": [
    { "title": "", "description": "", "priority": "High" },
    { "title": "", "description": "", "priority": "Medium" },
    { "title": "", "description": "", "priority": "Low" }
  ],
  "recommended_keywords": [],
  "role_fit": {
    "target_role": "${targetRole}",
    "score": 82,
    "summary": "",
    "strengths": [],
    "weaknesses": []
  }
}

Ensure you provide at least 3-5 key_suggestions.

Resume text:
---
${resumeText.slice(0, MAX_RESUME_TEXT_LENGTH)}
---`;

const analyzeWithGroq = async (resumeText, targetRole) => {
  const prompt = buildGeminiPrompt(resumeText, targetRole);
  return await aiService.generateStructuredResponse(prompt, resumeAnalysisSchema);
};

const uploadResume = async (supabase, storagePath, file) => {
  const { error } = await supabase.storage.from(RESUME_BUCKET).upload(storagePath, file.buffer, {
    contentType: "application/pdf",
    upsert: false,
  });

  if (error) {
    throw new AppError(error.message || "Failed to upload resume to secure storage.", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

const removeResume = async (supabase, storagePath) => {
  if (!storagePath) return;
  await supabase.storage.from(RESUME_BUCKET).remove([storagePath]);
};

const extractResumeText = async (fileBuffer) => {
  let parsedPdf;

  try {
    parsedPdf = await pdfParse(fileBuffer);
  } catch (_error) {
    throw new AppError(
      "The PDF could not be read. Upload a valid, non-password-protected resume PDF.",
      HTTP_STATUS.UNPROCESSABLE_ENTITY
    );
  }

  const resumeText = parsedPdf.text.replace(/\0/g, "").trim();
  if (!resumeText) {
    throw new AppError(
      "No selectable text was found in this PDF. Upload a text-based resume PDF.",
      HTTP_STATUS.UNPROCESSABLE_ENTITY
    );
  }

  return resumeText;
};

const saveAnalysis = async (supabase, userId, storagePath, filename, resumeText, targetRole, analysis) => {
  const payload = {
    user_id: userId,
    resume_url: storagePath,
    resume_filename: sanitizeFilename(filename),
    resume_text: resumeText,
    ats_score: analysis.ats_score,
    overall_score: analysis.overall_score,
    role_fit: analysis.role_fit?.summary || "Role fit analyzed.",
    role_fit_summary: analysis.role_fit?.summary || "",
    overall_summary: analysis.overall_summary || "",
    ats_status: analysis.ats_status || "",
    ats_tips: analysis.ats_tips || [],
    section_scores: analysis.section_scores || {},
    strengths: analysis.strengths || [],
    key_suggestions: analysis.key_suggestions || [],
    recommended_keywords: analysis.recommended_keywords || [],
    analysis_json: {
      ...analysis,
      target_role: targetRole,
      source: analysis.source || "gemini",
      warning: analysis.warning || null,
    },
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("resume_analysis")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new AppError(error.message || "Failed to save resume analysis.", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }

  return formatResumeAnalysis(data);
};

const analyzeResume = async (userId, file) => {
  if (!file) {
    throw new AppError("A resume PDF file is required.", HTTP_STATUS.BAD_REQUEST);
  }

  if (file.mimetype !== "application/pdf" || !isPdfBuffer(file.buffer)) {
    throw new AppError("Only valid PDF resume uploads are allowed.", HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE);
  }

  const supabase = getSupabaseAdmin();
  const storagePath = createStoragePath(userId, file.originalname);
  let uploaded = false;

  try {
    await uploadResume(supabase, storagePath, file);
    uploaded = true;

    const resumeText = await extractResumeText(file.buffer);
    const profile = await profileService.getProfileById(userId);
    const targetRole = profile.targetRole?.trim();

    if (!targetRole) {
      throw new AppError(
        "Set a target role in your profile before analyzing a resume.",
        HTTP_STATUS.UNPROCESSABLE_ENTITY
      );
    }

    let analysis;
    try {
      analysis = await analyzeWithGroq(resumeText, targetRole);
    } catch (error) {
      console.error("Groq resume analysis failed; using fallback response.", error);
      analysis = buildFallbackAnalysis(targetRole, `AI analysis failed: ${error.message}`);
    }

    return await saveAnalysis(supabase, userId, storagePath, file.originalname, resumeText, targetRole, analysis);
  } catch (error) {
    if (uploaded) {
      try {
        await removeResume(supabase, storagePath);
      } catch (cleanupError) {
        console.error("Failed to clean up an unpersisted resume upload.", {
          message: cleanupError.message,
          storagePath,
        });
      }
    }
    throw error;
  }
};

const getLatestAnalysis = async (userId) => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("resume_analysis")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new AppError(error.message || "Failed to retrieve the latest resume analysis.", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }

  return formatResumeAnalysis(data);
};

const getAnalysisHistory = async (userId, { limit, offset }) => {
  const supabase = getSupabaseAdmin();
  const { data, error, count } = await supabase
    .from("resume_analysis")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new AppError(error.message || "Failed to retrieve resume analysis history.", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }

  return {
    items: data.map(formatResumeAnalysis),
    pagination: { limit, offset, total: count || 0 },
  };
};

const reanalyzeResume = async (userId) => {
  const supabase = getSupabaseAdmin();
  
  const { data: latestAnalysis, error } = await supabase
    .from("resume_analysis")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !latestAnalysis) {
    throw new AppError("No existing resume found to re-analyze. Please upload a new resume.", HTTP_STATUS.NOT_FOUND);
  }

  const profile = await profileService.getProfileById(userId);
  const targetRole = profile.targetRole?.trim();

  if (!targetRole) {
    throw new AppError("Set a target role in your profile before analyzing a resume.", HTTP_STATUS.UNPROCESSABLE_ENTITY);
  }

  const resumeText = latestAnalysis.resume_text;

  let analysis;
  try {
    analysis = await analyzeWithGroq(resumeText, targetRole);
  } catch (err) {
    console.error("Groq resume re-analysis failed; using fallback response.", err);
    analysis = buildFallbackAnalysis(targetRole, `AI analysis failed: ${err.message}`);
  }

  return await saveAnalysis(
    supabase, 
    userId, 
    latestAnalysis.resume_url, 
    latestAnalysis.resume_filename, 
    resumeText, 
    targetRole, 
    analysis
  );
};

module.exports = {
  analyzeResume,
  reanalyzeResume,
  getLatestAnalysis,
  getAnalysisHistory,
};
