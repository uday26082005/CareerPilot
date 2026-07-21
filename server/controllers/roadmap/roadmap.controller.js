const roadmapService = require("../../services/roadmap/roadmap.service");
const { sendSuccess } = require("../../utils/responseHandler");

const generateRoadmap = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const roadmap = await roadmapService.generateRoadmap(userId);
    sendSuccess(res, {
      data: roadmap,
      message: "Career roadmap generated successfully.",
      statusCode: 201
    });
  } catch (error) {
    next(error);
  }
};

const getLatestRoadmap = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const roadmap = await roadmapService.getLatestRoadmap(userId);
    
    if (!roadmap) {
      return sendSuccess(res, {
        data: null,
        message: "No roadmap found.",
        statusCode: 200
      });
    }
    
    sendSuccess(res, {
      data: roadmap,
      message: "Latest roadmap retrieved successfully."
    });
  } catch (error) {
    next(error);
  }
};

const getRoadmapHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;
    
    const history = await roadmapService.getRoadmapHistory(userId, { limit, offset });
    sendSuccess(res, {
      data: history,
      message: "Roadmap history retrieved successfully."
    });
  } catch (error) {
    next(error);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { taskId } = req.params;
    const { status } = req.body;
    
    const updatedTask = await roadmapService.updateTaskStatus(userId, taskId, status);
    sendSuccess(res, {
      data: updatedTask,
      message: "Task status updated successfully."
    });
  } catch (error) {
    next(error);
  }
};

const regenerateRoadmap = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const roadmap = await roadmapService.regenerateRoadmap(userId);
    sendSuccess(res, {
      data: roadmap,
      message: "Career roadmap regenerated successfully.",
      statusCode: 200
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateRoadmap,
  getLatestRoadmap,
  getRoadmapHistory,
  updateTaskStatus,
  regenerateRoadmap
};
