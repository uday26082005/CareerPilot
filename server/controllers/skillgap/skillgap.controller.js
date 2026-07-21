const skillGapService = require("../../services/skillgap/skillgap.service");

const analyze = async (req, res, next) => {
  try {
    const result = await skillGapService.analyzeSkillGap(req.user.id);
    res.status(200).json({
      success: true,
      data: result,
      message: "Skill gap analysis completed successfully.",
    });
  } catch (error) {
    next(error);
  }
};

const getLatest = async (req, res, next) => {
  try {
    const result = await skillGapService.getLatestAnalysis(req.user.id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "No skill gap analysis found.",
      });
    }
    res.status(200).json({
      success: true,
      data: result,
      message: "Latest skill gap analysis retrieved successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyze,
  getLatest,
};
