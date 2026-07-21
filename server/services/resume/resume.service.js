const pdfParse = require("pdf-parse");
const { randomUUID } = require("crypto");

const { getGeminiClient, geminiModel } = require("../../config/gemini");
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
    atsScore: record.ats_score,
    overallScore: record.overall_score,
    roleFit: record.role_fit,
    keySkills: toArray(record.key_skills),
    missingSkills: toArray(record.missing_skills),
    strengths: toArray(record.strengths),
    improvementAreas: toArray(record.improvement_areas),
    recommendedKeywords: toArray(record.recommended_keywords),
    targetRole: record.analysis_json?.target_role || null,
    analysisSource: record.analysis_json?.source || "gemini",
    analysisWarning: record.analysis_json?.warning || null,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
};

const buildFallbackAnalysis = (targetRole, reason) => ({
  ats_score: 0,
  overall_score: 0,
  role_fit: `Analysis is temporarily unavailable for the ${targetRole} role.`,
  key_skills: [],
  missing_skills: [],
  strengths: [],
  improvement_areas: ["Try analyzing this resume again shortly."],
  recommended_keywords: [],
  source: "fallback",
  warning: reason,
});

const buildGeminiPrompt = (resumeText, targetRole) => `You are an ATS resume analyst. Analyze the resume against the target role.

Target role: ${targetRole}

Return exactly one JSON object with no Markdown, commentary, or additional keys. All scores must be numbers from 0 to 100. Use concise, specific string items in every array.

Required JSON shape:
{
  "ats_score": 0,
  "overall_score": 0,
  "role_fit": "",
  "key_skills": [],
  "missing_skills": [],
  "strengths": [],
  "improvement_areas": [],
  "recommended_keywords": []
}

Resume text:
---
${resumeText.slice(0, MAX_RESUME_TEXT_LENGTH)}
---`;

const extractJson = (responseText) => {
  const trimmed = String(responseText || "").trim();
  const jsonText = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  return JSON.parse(jsonText);
};

const analyzeWithGemini = async (resumeText, targetRole) => {
  const client = getGeminiClient();
  const response = await client.models.generateContent({
    model: geminiModel,
    contents: buildGeminiPrompt(resumeText, targetRole),
    config: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const parsedResponse = extractJson(response.text);
  return resumeAnalysisSchema.parse(parsedResponse);
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

const saveAnalysis = async (supabase, userId, storagePath, file, resumeText, targetRole, analysis) => {
  const payload = {
    user_id: userId,
    // The private storage object path is intentionally stored instead of a public URL.
    resume_url: storagePath,
    resume_filename: sanitizeFilename(file.originalname),
    resume_text: resumeText,
    ats_score: analysis.ats_score,
    overall_score: analysis.overall_score,
    role_fit: analysis.role_fit,
    key_skills: analysis.key_skills,
    missing_skills: analysis.missing_skills,
    strengths: analysis.strengths,
    improvement_areas: analysis.improvement_areas,
    recommended_keywords: analysis.recommended_keywords,
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
      analysis = await analyzeWithGemini(resumeText, targetRole);
    } catch (error) {
      console.error("Gemini resume analysis failed; using fallback response.", {
        message: error.message,
      });
      analysis = buildFallbackAnalysis(targetRole, "AI analysis is temporarily unavailable. Please try again shortly.");
    }

    return await saveAnalysis(supabase, userId, storagePath, file, resumeText, targetRole, analysis);
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

module.exports = {
  analyzeResume,
  getLatestAnalysis,
  getAnalysisHistory,
};
