const resumeService = require("../../services/resume/resume.service");
const { asyncHandler } = require("../../utils/helpers/asyncHandler");
const { HTTP_STATUS } = require("../../utils/constants/httpStatus");
const { sendSuccess } = require("../../utils/responseHandler");

const analyzeResume = asyncHandler(async (req, res) => {
  const data = await resumeService.analyzeResume(req.user.id, req.file);

  sendSuccess(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: data.analysisSource === "fallback"
      ? "Resume saved with a fallback analysis. You can try again later for AI insights."
      : "Resume analyzed successfully.",
    data,
  });
});

const getLatestAnalysis = asyncHandler(async (req, res) => {
  const data = await resumeService.getLatestAnalysis(req.user.id);

  sendSuccess(res, {
    message: data ? "Latest resume analysis retrieved successfully." : "No resume analysis found.",
    data,
  });
});

const getAnalysisHistory = asyncHandler(async (req, res) => {
  const data = await resumeService.getAnalysisHistory(req.user.id, req.validated.query);

  sendSuccess(res, {
    message: "Resume analysis history retrieved successfully.",
    data: data.items,
    meta: data.pagination,
  });
});

module.exports = {
  analyzeResume,
  getLatestAnalysis,
  getAnalysisHistory,
};
