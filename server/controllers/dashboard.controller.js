const dashboardService = require("../services/dashboard.service");
const { sendSuccess } = require("../utils/responseHandler");

const getCompleteDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.fetchCompleteDashboard(req.user.id);
    sendSuccess(res, { data, message: "Dashboard data retrieved successfully" });
  } catch (error) {
    next(error);
  }
};

const getProfileSummary = async (req, res, next) => {
  try {
    const data = await dashboardService.fetchProfileSummary(req.user.id);
    sendSuccess(res, { data, message: "Profile summary retrieved successfully" });
  } catch (error) {
    next(error);
  }
};

const getResumeSummary = async (req, res, next) => {
  try {
    const data = await dashboardService.fetchResumeSummary(req.user.id);
    sendSuccess(res, { data, message: "Resume summary retrieved successfully" });
  } catch (error) {
    next(error);
  }
};

const getRoadmapSummary = async (req, res, next) => {
  try {
    const data = await dashboardService.fetchRoadmapSummary(req.user.id);
    sendSuccess(res, { data, message: "Roadmap summary retrieved successfully" });
  } catch (error) {
    next(error);
  }
};

const getInterviewSummary = async (req, res, next) => {
  try {
    const data = await dashboardService.fetchInterviewSummary(req.user.id);
    sendSuccess(res, { data, message: "Interview summary retrieved successfully" });
  } catch (error) {
    next(error);
  }
};

const getPracticeSummary = async (req, res, next) => {
  try {
    const data = await dashboardService.fetchPracticeSummary(req.user.id);
    sendSuccess(res, { data, message: "Practice summary retrieved successfully" });
  } catch (error) {
    next(error);
  }
};

const getRecentActivity = async (req, res, next) => {
  try {
    const data = await dashboardService.fetchRecentActivity(req.user.id);
    sendSuccess(res, { data, message: "Recent activity retrieved successfully" });
  } catch (error) {
    next(error);
  }
};

const addScheduledEvent = async (req, res, next) => {
  try {
    const data = await dashboardService.createScheduledEvent(req.user.id, req.body);
    sendSuccess(res, { data, message: "Scheduled event created successfully", statusCode: 201 });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCompleteDashboard,
  getProfileSummary,
  getResumeSummary,
  getRoadmapSummary,
  getInterviewSummary,
  getPracticeSummary,
  getRecentActivity,
  addScheduledEvent
};
