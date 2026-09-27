/**
 * Semantic Matcher & Counting Engine for CareerPilot
 * 
 * Enforces a strict, canonical skill data model with closed mathematical identities:
 * 
 * 1. ROLE UNIVERSE (Role Taxonomy):
 *    - Total skills: N_role (e.g. 45 for Full Stack Developer)
 *    - Role Skills Detected: N_role_detected
 *    - Role Skills Not Detected (Role Gaps): N_role_gaps
 *    - Identity: N_role_detected + N_role_gaps === N_role
 * 
 * 2. CORE & IMPORTANT BENCHMARK (Role Skill Coverage):
 *    - Target benchmark: B_applicable (e.g. 16 competencies: 8 core + 8 important)
 *    - Applicable Detected: D_applicable (e.g. 14 detected)
 *    - Role Skill Coverage: weighted percentage
 *    - Basis: "14 / 16 core & important competencies detected"
 * 
 * 3. MARKET UNIVERSE (Live 2026 Demand Layer):
 *    - Total skills: Exactly 25 skills (N_market = 25)
 *    - Market Skills Detected: N_market_detected (e.g. 8)
 *    - Market Skills Not Detected (Market Gaps): N_market_gaps (e.g. 17)
 *    - Identity: N_market_detected + N_market_gaps === 25
 *    - Basis: "8 / 25 current-demand skills detected"
 * 
 * 4. CANONICAL ENTITY:
 *    Every skill is a single canonical entity. Skills in both taxonomy and market
 *    are NOT duplicated; market demand is an overlay tag/property on the canonical skill.
 */

const { getFlatRoleSkills, getRolePillars } = require("./roleTaxonomy");
const { 
  getCanonicalSkill, 
  normalizeSkillList, 
  extractSkillsFromText 
} = require("./skillNormalizer");

const EXACT_MARKET_SKILLS_COUNT = 25;

/**
 * Extracts and maps all candidate skills from resume text and structured key skills.
 */
const detectCandidateSkills = (resumeText, keySkills = [], taxonomySkills = []) => {
  const detectedSet = new Set();

  if (Array.isArray(keySkills)) {
    normalizeSkillList(keySkills).forEach(s => detectedSet.add(s));
  }

  if (resumeText) {
    const textSkills = extractSkillsFromText(resumeText, taxonomySkills);
    textSkills.forEach(s => detectedSet.add(s));
  }

  return Array.from(detectedSet);
};

/**
 * Evaluates whether a target skill is satisfied by the candidate's detected skills.
 * Handles exact key lookup, canonical dictionary lookup, and subsumption (e.g. "SQL" satisfies "SQL Data Analysis").
 */
const isSkillSatisfied = (key, skillName, detectedLookup) => {
  if (detectedLookup.has(key)) return true;

  const canonical = getCanonicalSkill(skillName).toLowerCase().trim();
  if (detectedLookup.has(canonical)) return true;

  // Safe string-based subsumption check for common tech competencies:
  // e.g., if market skill mentions "sql" ("sql data analysis", "sql queries") and candidate has "sql"
  // or candidate has "python" and skill is "python for data analysis"
  const targetLower = ` ${skillName.toLowerCase().replace(/[/,()_-]/g, " ")} `;
  const keyPadded = ` ${key.toLowerCase().replace(/[/,()_-]/g, " ")} `;

  const candidateSkills = Array.from(detectedLookup);
  for (const cand of candidateSkills) {
    if (cand.length >= 3) {
      const candLower = cand.toLowerCase().trim();
      const paddedCand = ` ${candLower} `;
      if (targetLower.includes(paddedCand) || keyPadded.includes(paddedCand)) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Evaluates Role Skill Coverage and Market Demand Alignment using the unified canonical model.
 */
const evaluateRoleAndMarketSkills = (targetRole, resumeText, candidateKeySkills = [], marketDemandData = {}) => {
  // 1. Load Broader Role Taxonomy Universe (e.g. exactly 45 skills for Full Stack)
  const taxonomyFlat = getFlatRoleSkills(targetRole);
  const taxonomyLookup = new Map();

  taxonomyFlat.forEach(item => {
    const canonical = getCanonicalSkill(item.name);
    const tier = item.tier || (item.isCore ? "core" : "supporting");
    taxonomyLookup.set(canonical.toLowerCase(), {
      name: canonical,
      originalName: item.name,
      category: item.category,
      roleTier: tier,
      roleRelevance: tier === "core" ? "High" : tier === "important" ? "High" : "Medium",
      weight: tier === "core" ? 3.0 : tier === "important" ? 2.0 : 1.0,
      isCore: tier === "core",
      isRoleSkill: true
    });
  });

  // 2. Standardize Market Demand Layer to EXACTLY 25 canonical skills
  const rawMarketSkills = Array.isArray(marketDemandData.required_skills) 
    ? marketDemandData.required_skills 
    : [];
  const rawTrendingTech = Array.isArray(marketDemandData.trending_technologies)
    ? marketDemandData.trending_technologies
    : [];

  const normalizedMarket = normalizeSkillList(rawMarketSkills);
  const normalizedTrending = normalizeSkillList(rawTrendingTech);
  const trendingLookup = new Set(normalizedTrending.map(s => s.toLowerCase()));

  // Cap or pad to ensure EXACTLY 25 skills in the market universe
  const finalMarketSkills = [];
  const seenMarket = new Set();

  // First: Add trending skills
  for (const skill of normalizedTrending) {
    const canonical = getCanonicalSkill(skill);
    const key = canonical.toLowerCase();
    if (!seenMarket.has(key) && finalMarketSkills.length < EXACT_MARKET_SKILLS_COUNT) {
      seenMarket.add(key);
      finalMarketSkills.push(canonical);
    }
  }

  // Second: Add other dynamic market skills
  for (const skill of normalizedMarket) {
    const canonical = getCanonicalSkill(skill);
    const key = canonical.toLowerCase();
    if (!seenMarket.has(key) && finalMarketSkills.length < EXACT_MARKET_SKILLS_COUNT) {
      seenMarket.add(key);
      finalMarketSkills.push(canonical);
    }
  }

  // Third: If fewer than 25, pad with core skills from the role taxonomy
  for (const item of taxonomyFlat) {
    if (finalMarketSkills.length >= EXACT_MARKET_SKILLS_COUNT) break;
    const canonical = getCanonicalSkill(item.name);
    const key = canonical.toLowerCase();
    if (!seenMarket.has(key)) {
      seenMarket.add(key);
      finalMarketSkills.push(canonical);
    }
  }

  const marketRankMap = new Map();
  finalMarketSkills.forEach((skill, idx) => {
    marketRankMap.set(skill.toLowerCase(), idx + 1);
  });

  // 3. Detect candidate skills from resume
  const detectedCandidateSkills = detectCandidateSkills(
    resumeText, 
    candidateKeySkills, 
    taxonomyFlat
  );
  const detectedLookup = new Set(detectedCandidateSkills.map(s => s.toLowerCase()));

  // 4. Build the Canonical Role Skills Collection (Closed Universe = taxonomyLookup.size)
  const roleUniverseSkills = [];
  let roleCoreDetected = 0;
  let roleImportantDetected = 0;
  let roleSupportingDetected = 0;

  let totalRoleCore = 0;
  let totalRoleImportant = 0;
  let totalRoleSupporting = 0;

  for (const [key, taxSkill] of taxonomyLookup.entries()) {
    const isDetected = isSkillSatisfied(key, taxSkill.name, detectedLookup);
    const isMarket = marketRankMap.has(key);
    const isTrending = trendingLookup.has(key);
    const marketRank = isMarket ? marketRankMap.get(key) : null;

    if (taxSkill.roleTier === "core") totalRoleCore++;
    else if (taxSkill.roleTier === "important") totalRoleImportant++;
    else totalRoleSupporting++;

    if (isDetected) {
      if (taxSkill.roleTier === "core") roleCoreDetected++;
      else if (taxSkill.roleTier === "important") roleImportantDetected++;
      else roleSupportingDetected++;
    }

    const canonicalEntity = {
      name: taxSkill.name,
      category: taxSkill.category,
      roleTier: taxSkill.roleTier,
      roleRelevance: taxSkill.roleRelevance,
      isRoleSkill: true,
      isMarketSkill: isMarket,
      marketDemand: isTrending ? "Very High" : isMarket ? "High" : "None",
      marketTier: isTrending ? "trending" : isMarket ? "standard" : "none",
      marketRank,
      isTrending,
      resumeDetected: isDetected,
      status: isDetected ? "Detected" : "Not Detected"
    };

    roleUniverseSkills.push(canonicalEntity);
  }

  const roleSkillsDetected = roleUniverseSkills.filter(s => s.resumeDetected);
  const roleSkillsGaps = roleUniverseSkills.filter(s => !s.resumeDetected);

  // Exact partition sanity check:
  // roleSkillsDetected.length + roleSkillsGaps.length === roleUniverseSkills.length

  // 5. Build the Canonical Market Skills Layer (Closed Universe = 25)
  const marketUniverseSkills = finalMarketSkills.map((mSkill, idx) => {
    const key = mSkill.toLowerCase();
    const isDetected = isSkillSatisfied(key, mSkill, detectedLookup);
    const isTrending = trendingLookup.has(key);
    const canonicalName = getCanonicalSkill(mSkill);
    const taxMatch = taxonomyLookup.get(key) || taxonomyLookup.get(canonicalName.toLowerCase());

    return {
      name: mSkill,
      category: taxMatch?.category || "Market Demand",
      roleTier: taxMatch ? taxMatch.roleTier : "market",
      roleRelevance: taxMatch ? taxMatch.roleRelevance : (isTrending ? "High" : "Medium"),
      isRoleSkill: !!taxMatch,
      isMarketSkill: true,
      marketDemand: isTrending ? "Very High" : "High",
      marketTier: isTrending ? "trending" : "standard",
      marketRank: idx + 1,
      isTrending,
      resumeDetected: isDetected,
      isDetected, // convenience
      status: isDetected ? "Detected" : "Not Detected"
    };
  });

  const marketSkillsDetected = marketUniverseSkills.filter(s => s.resumeDetected);
  const marketSkillsGaps = marketUniverseSkills.filter(s => !s.resumeDetected);

  // Exact partition sanity check:
  // marketSkillsDetected.length + marketSkillsGaps.length === 25

  // 6. Calculate Role Skill Coverage across Full Role Universe using Core Weightage Method
  // - Core weight: 3.0
  // - Important weight: 2.0
  // - Supporting weight: 0.5 (max 3.0 points contribution)
  const coreWeight = 3.0;
  const importantWeight = 2.0;
  const supportingWeight = 0.5;

  // Fully dynamic counts per role taxonomy - absolutely NO hardcoded values
  const effectiveTotalCore = totalRoleCore;
  const effectiveTotalImportant = totalRoleImportant;
  const effectiveTotalSupporting = totalRoleSupporting;

  const supportingContribution = Math.min(3.0, supportingWeight * roleSupportingDetected);
  const weightedNumerator = (coreWeight * roleCoreDetected) + 
                            (importantWeight * roleImportantDetected) + 
                            supportingContribution;

  const weightedDenominator = (coreWeight * effectiveTotalCore) + 
                              (importantWeight * effectiveTotalImportant);

  const roleSkillCoverage = weightedDenominator > 0 
    ? Math.min(100, Math.round((weightedNumerator / weightedDenominator) * 100)) 
    : (roleUniverseSkills.length > 0 ? Math.round((roleSkillsDetected.length / roleUniverseSkills.length) * 100) : 0);

  const roleCoverageDetails = {
    score: roleSkillCoverage,
    weightedDetected: Math.round(weightedNumerator * 10) / 10,
    weightedTotal: Math.round(weightedDenominator * 10) / 10,
    detectedCount: roleSkillsDetected.length,
    totalCount: roleUniverseSkills.length,
    coreDetected: roleCoreDetected,
    totalCore: effectiveTotalCore,
    importantDetected: roleImportantDetected,
    totalImportant: effectiveTotalImportant,
    supportingDetected: roleSupportingDetected,
    totalSupporting: effectiveTotalSupporting,
    applicableDetected: roleSkillsDetected.length,
    applicableBenchmark: roleUniverseSkills.length,
    basisLabel: `${roleSkillsDetected.length} / ${roleUniverseSkills.length} detected (${roleSkillCoverage}% core-weighted)`
  };

  // 7. Calculate Market Demand Match (Market Alignment)
  // Direct unweighted calculation without trending weightage: (detected / 25) * 100 (e.g. 11/25 = 44%)
  let detectedTrendingCount = 0;
  let totalTrendingCount = 0;

  marketUniverseSkills.forEach(m => {
    if (m.isTrending) totalTrendingCount++;
    if (m.resumeDetected && m.isTrending) detectedTrendingCount++;
  });

  const marketDemandAlignment = EXACT_MARKET_SKILLS_COUNT > 0 
    ? Math.round((marketSkillsDetected.length / EXACT_MARKET_SKILLS_COUNT) * 100) 
    : 0;

  const marketDemandDetails = {
    score: marketDemandAlignment,
    detectedCount: marketSkillsDetected.length,
    totalCount: EXACT_MARKET_SKILLS_COUNT,
    detectedTrendingCount,
    totalTrendingCount,
    basisLabel: `${marketSkillsDetected.length} / ${EXACT_MARKET_SKILLS_COUNT} current-demand skills detected`
  };

  // 8. Identify "Additional Role-Relevant Skills" (Outside the 25 Market list)
  const additionalRoleSkills = roleSkillsDetected.filter(s => !s.isMarketSkill);

  // 9. Categorized Role Gaps (Closed subset of roleSkillsGaps)
  const coreGaps = roleSkillsGaps.filter(s => s.roleTier === "core");
  const importantGaps = roleSkillsGaps.filter(s => s.roleTier === "important");
  const supportingGaps = roleSkillsGaps.filter(s => s.roleTier === "supporting");

  // 10. Meaningful Radar Chart Data (Core Domain Pillars)
  const pillars = getRolePillars(targetRole);
  const radarData = pillars.map(p => {
    const pillarSkillsLower = new Set(p.skills.map(s => s.toLowerCase()));
    const detectedInPillar = detectedCandidateSkills.filter(s => pillarSkillsLower.has(s.toLowerCase()));
    
    let score = 15;
    if (detectedInPillar.length > 0) {
      score = Math.min(100, 75 + (detectedInPillar.length * 10));
    }

    return {
      subject: p.pillarName,
      A: score,
      B: 100,
      fullMark: 100,
      detectedCount: detectedInPillar.length,
      totalCount: p.totalCount
    };
  });

  // 11. Prioritized Missing Skills for Roadmap & AI
  const prioritizedMissingSkills = [];
  const seenMissing = new Set();

  marketSkillsGaps.filter(m => m.isTrending).forEach(m => {
    if (!seenMissing.has(m.name.toLowerCase())) {
      prioritizedMissingSkills.push(m.name);
      seenMissing.add(m.name.toLowerCase());
    }
  });

  coreGaps.forEach(g => {
    if (!seenMissing.has(g.name.toLowerCase())) {
      prioritizedMissingSkills.push(g.name);
      seenMissing.add(g.name.toLowerCase());
    }
  });

  marketSkillsGaps.filter(m => !m.isTrending).forEach(m => {
    if (!seenMissing.has(m.name.toLowerCase())) {
      prioritizedMissingSkills.push(m.name);
      seenMissing.add(m.name.toLowerCase());
    }
  });

  importantGaps.forEach(g => {
    if (!seenMissing.has(g.name.toLowerCase())) {
      prioritizedMissingSkills.push(g.name);
      seenMissing.add(g.name.toLowerCase());
    }
  });

  supportingGaps.forEach(g => {
    if (!seenMissing.has(g.name.toLowerCase())) {
      prioritizedMissingSkills.push(g.name);
      seenMissing.add(g.name.toLowerCase());
    }
  });

  return {
    // Role Universe Metrics
    totalRoleSkillsCount: roleUniverseSkills.length,
    roleDetectedCount: roleSkillsDetected.length,
    roleGapsCount: roleSkillsGaps.length,

    // Core & Important Coverage
    roleSkillCoverage,
    roleCoverageDetails,

    // Market Demand Universe Metrics (Exact 25)
    totalMarketSkillsCount: EXACT_MARKET_SKILLS_COUNT,
    marketDetectedCount: marketSkillsDetected.length,
    marketGapsCount: marketSkillsGaps.length,
    marketDemandAlignment,
    marketDemandDetails,

    // Canonical Entity Lists
    roleUniverseSkills,
    roleSkillsDetected,
    roleSkillsGaps,
    marketDemandLayer: marketUniverseSkills,
    additionalRoleSkills,

    // Categorized Gaps
    categorizedGaps: {
      coreGaps,
      importantGaps,
      supportingGaps,
      marketGaps: marketSkillsGaps
    },

    // Legacy compatibility fields
    detectedSkills: roleSkillsDetected.map(s => s.name),
    matchedRoleSkills: roleSkillsDetected.map(s => s.name),
    prioritizedMissingSkills,
    radarData
  };
};

module.exports = {
  EXACT_MARKET_SKILLS_COUNT,
  detectCandidateSkills,
  evaluateRoleAndMarketSkills
};
