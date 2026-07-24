const analyticsService = require("../services/analytics/analytics.service");
const { sendSuccess } = require("../utils/responseHandler");

const getOverview = async (req, res, next) => {
  try {
    const data = await analyticsService.calculateOverview(req.user.id);
    sendSuccess(res, { data, message: "Analytics overview fetched." });
  } catch (error) {
    next(error);
  }
};

const getProgress = async (req, res, next) => {
  try {
    const data = await analyticsService.getProgress(req.user.id);
    sendSuccess(res, { data, message: "Progress fetched." });
  } catch (error) {
    next(error);
  }
};

const getInterviews = async (req, res, next) => {
  try {
    const data = await analyticsService.getInterviews(req.user.id);
    sendSuccess(res, { data, message: "Interview analytics fetched." });
  } catch (error) {
    next(error);
  }
};

const getPractice = async (req, res, next) => {
  try {
    const data = await analyticsService.getPractice(req.user.id);
    sendSuccess(res, { data, message: "Practice analytics fetched." });
  } catch (error) {
    next(error);
  }
};

const getSkills = async (req, res, next) => {
  try {
    const data = await analyticsService.getSkills(req.user.id);
    sendSuccess(res, { data, message: "Skills analytics fetched." });
  } catch (error) {
    next(error);
  }
};

const getActivity = async (req, res, next) => {
  try {
    const data = await analyticsService.getActivity(req.user.id);
    sendSuccess(res, { data, message: "Activity fetched." });
  } catch (error) {
    next(error);
  }
};

const getInsights = async (req, res, next) => {
  try {
    const data = await analyticsService.generateInsights(req.user.id);
    sendSuccess(res, { data, message: "AI Insights generated." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverview,
  getProgress,
  getInterviews,
  getPractice,
  getSkills,
  getActivity,
  getInsights
};
