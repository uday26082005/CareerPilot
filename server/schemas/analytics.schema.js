const { z } = require("zod");

const getOverviewSchema = z.object({});
const getProgressSchema = z.object({});
const getInterviewsSchema = z.object({});
const getPracticeSchema = z.object({});
const getSkillsSchema = z.object({});
const getActivitySchema = z.object({});
const getInsightsSchema = z.object({});

module.exports = {
  getOverviewSchema,
  getProgressSchema,
  getInterviewsSchema,
  getPracticeSchema,
  getSkillsSchema,
  getActivitySchema,
  getInsightsSchema,
};
