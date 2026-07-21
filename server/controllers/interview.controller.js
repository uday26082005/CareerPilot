const interviewService = require("../services/interview/interview.service");
const { sendSuccess } = require("../utils/responseHandler");

const startInterview = async (req, res, next) => {
  try {
    const data = await interviewService.startInterview(req.user.id, req.body);
    return sendSuccess(res, { data, message: "Interview started successfully." });
  } catch (error) {
    next(error);
  }
};

const answerQuestion = async (req, res, next) => {
  try {
    const data = await interviewService.answerQuestion(req.user.id, req.params.id, req.body);
    return sendSuccess(res, { data, message: "Answer evaluated successfully." });
  } catch (error) {
    next(error);
  }
};

const completeInterview = async (req, res, next) => {
  try {
    const data = await interviewService.completeInterview(req.user.id, req.params.id);
    return sendSuccess(res, { data, message: "Interview completed successfully." });
  } catch (error) {
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const data = await interviewService.getInterviewHistory(req.user.id, limit);
    return sendSuccess(res, { data, message: "History fetched successfully." });
  } catch (error) {
    next(error);
  }
};

const getStatistics = async (req, res, next) => {
  try {
    const data = await interviewService.getInterviewStatistics(req.user.id);
    return sendSuccess(res, { data, message: "Statistics fetched successfully." });
  } catch (error) {
    next(error);
  }
};

const getInterviewDetails = async (req, res, next) => {
  try {
    const data = await interviewService.getInterviewDetails(req.user.id, req.params.id);
    return sendSuccess(res, { data, message: "Interview details fetched successfully." });
  } catch (error) {
    next(error);
  }
};

const deleteInterview = async (req, res, next) => {
  try {
    const data = await interviewService.deleteInterview(req.user.id, req.params.id);
    return sendSuccess(res, { data, message: "Interview deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startInterview,
  answerQuestion,
  completeInterview,
  getHistory,
  getStatistics,
  getInterviewDetails,
  deleteInterview
};
