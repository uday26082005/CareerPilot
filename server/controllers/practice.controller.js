const practiceService = require("../services/practice.service");
const { sendSuccess } = require("../utils/responseHandler");

const startPractice = async (req, res, next) => {
  try {
    const data = await practiceService.startPractice(req.user.id, req.validated.body);
    return sendSuccess(res, { statusCode: 201, data, message: "Practice session started successfully." });
  } catch (error) {
    next(error);
  }
};

const answerQuestion = async (req, res, next) => {
  try {
    const data = await practiceService.answerQuestion(req.user.id, req.validated.params.id, req.validated.body);
    return sendSuccess(res, { data, message: "Practice answer evaluated successfully." });
  } catch (error) {
    next(error);
  }
};

const completePractice = async (req, res, next) => {
  try {
    const data = await practiceService.completePractice(req.user.id, req.validated.params.id);
    return sendSuccess(res, { data, message: "Practice session completed successfully." });
  } catch (error) {
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const data = await practiceService.getPracticeHistory(req.user.id, req.validated.query.limit);
    return sendSuccess(res, { data, message: "Practice history fetched successfully." });
  } catch (error) {
    next(error);
  }
};

const getStatistics = async (req, res, next) => {
  try {
    const data = await practiceService.getPracticeStatistics(req.user.id);
    return sendSuccess(res, { data, message: "Practice statistics fetched successfully." });
  } catch (error) {
    next(error);
  }
};

const getPracticeDetails = async (req, res, next) => {
  try {
    const data = await practiceService.getPracticeDetails(req.user.id, req.validated.params.id);
    return sendSuccess(res, { data, message: "Practice report fetched successfully." });
  } catch (error) {
    next(error);
  }
};

const deletePractice = async (req, res, next) => {
  try {
    const data = await practiceService.deletePractice(req.user.id, req.validated.params.id);
    return sendSuccess(res, { data, message: "Practice session deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startPractice,
  answerQuestion,
  completePractice,
  getHistory,
  getStatistics,
  getPracticeDetails,
  deletePractice,
};
