const axios = require("axios");

// In-memory cache with 2-hour TTL to ensure fast responses and avoid repeated remote calls
const jobCache = new Map();
const CACHE_TTL_MS = 2 * 60 * 60 * 1000;

// High-profile tech employers with verified public Greenhouse ATS endpoints hiring in India / globally
const TECH_EMPLOYERS = [
  { name: "MongoDB", domain: "mongodb.com", apiUrl: "https://boards-api.greenhouse.io/v1/boards/mongodb/jobs" },
  { name: "Elastic", domain: "elastic.co", apiUrl: "https://boards-api.greenhouse.io/v1/boards/elastic/jobs" },
  { name: "Datadog", domain: "datadoghq.com", apiUrl: "https://boards-api.greenhouse.io/v1/boards/datadog/jobs" },
  { name: "Cloudflare", domain: "cloudflare.com", apiUrl: "https://boards-api.greenhouse.io/v1/boards/cloudflare/jobs" },
  { name: "Coursera", domain: "coursera.org", apiUrl: "https://boards-api.greenhouse.io/v1/boards/coursera/jobs" },
  { name: "Rubrik", domain: "rubrik.com", apiUrl: "https://boards-api.greenhouse.io/v1/boards/rubrik/jobs" },
  { name: "GitLab", domain: "gitlab.com", apiUrl: "https://boards-api.greenhouse.io/v1/boards/gitlab/jobs" },
  { name: "Coinbase", domain: "coinbase.com", apiUrl: "https://boards-api.greenhouse.io/v1/boards/coinbase/jobs" },
  { name: "Twilio", domain: "twilio.com", apiUrl: "https://boards-api.greenhouse.io/v1/boards/twilio/jobs" },
  { name: "InMobi", domain: "inmobi.com", apiUrl: "https://boards-api.greenhouse.io/v1/boards/inmobi/jobs" },
  { name: "Stripe", domain: "stripe.com", apiUrl: "https://boards-api.greenhouse.io/v1/boards/stripe/jobs" },
  { name: "Figma", domain: "figma.com", apiUrl: "https://boards-api.greenhouse.io/v1/boards/figma/jobs" },
  { name: "Notion", domain: "notion.so", apiUrl: "https://boards-api.greenhouse.io/v1/boards/notion/jobs" },
  { name: "HashiCorp", domain: "hashicorp.com", apiUrl: "https://boards-api.greenhouse.io/v1/boards/hashicorp/jobs" },
  { name: "Affirm", domain: "affirm.com", apiUrl: "https://boards-api.greenhouse.io/v1/boards/affirm/jobs" }
];

// Popularity tiers for well-known companies — used to boost ranking of recognizable employers
// Tier 3 = globally famous (FAANG-level), Tier 2 = well-known tech, Tier 1 = recognized
const COMPANY_POPULARITY = {
  // Tier 3 — Globally iconic
  "google": 30, "microsoft": 30, "amazon": 30, "apple": 30, "meta": 30,
  "netflix": 30, "nvidia": 30, "adobe": 30, "salesforce": 30, "oracle": 30,
  "ibm": 30, "intel": 30, "samsung": 30, "tesla": 30, "uber": 30,
  // Tier 2 — Well-known tech companies
  "stripe": 20, "cloudflare": 20, "datadog": 20, "mongodb": 20, "gitlab": 20,
  "twilio": 20, "elastic": 20, "coinbase": 20, "rubrik": 20, "figma": 20,
  "notion": 20, "hashicorp": 20, "snowflake": 20, "confluent": 20, "vercel": 20,
  "atlassian": 20, "github": 20, "docker": 20, "slack": 20, "zoom": 20,
  "shopify": 20, "paypal": 20, "square": 20, "block": 20, "lyft": 20,
  "airbnb": 20, "pinterest": 20, "dropbox": 20, "linkedin": 20, "twitter": 20,
  "spotify": 20, "coursera": 20, "affirm": 20, "robinhood": 20,
  // Tier 2 — Well-known Indian tech companies
  "flipkart": 20, "razorpay": 20, "phonepe": 20, "cred": 20, "zerodha": 20,
  "swiggy": 20, "zomato": 20, "ola": 20, "paytm": 20, "meesho": 20,
  "freshworks": 20, "zoho": 20, "inmobi": 20, "dream11": 20, "myntra": 20,
  "postman": 20, "browserstack": 20, "hasura": 20, "chargebee": 20,
  // Tier 2 — Large services/consulting
  "tcs": 20, "infosys": 20, "wipro": 20, "hcl": 20, "cognizant": 20,
  "accenture": 20, "deloitte": 20, "capgemini": 20,
  // Tier 1 — Recognized companies
  "epam": 10, "thoughtworks": 10, "vmware": 10, "redhat": 10,
  "sap": 10, "cisco": 10, "dell": 10, "hp": 10, "lenovo": 10,
  "qualcomm": 10, "amd": 10, "arm": 10, "siemens": 10
};

/**
 * Normalizes role search keywords
 */
const getRoleKeywords = (roleName) => {
  if (!roleName) return [];
  const lower = roleName.toLowerCase();

  // Specific role synonym expansions
  if (lower.includes("software develop") || lower.includes("sde")) return ["software development engineer", "software engineer", "sde", "developer", "backend", "full stack", "java", "distributed systems"];
  if (lower.includes("system reliability") || lower.includes("site reliability") || lower.includes("sre")) return ["reliability", "sre", "infrastructure", "devops", "platform engineer", "kubernetes", "observability"];
  if (lower.includes("game developer") || lower.includes("game dev")) return ["game developer", "game engineer", "unity", "unreal", "game engine", "c++", "c#", "graphics", "gameplay"];
  if (lower.includes("database admin") || lower.includes("dba")) return ["database administrator", "dba", "sql", "postgresql", "mysql", "oracle", "database"];
  if (lower.includes("robotics")) return ["robotics engineer", "robotics", "ros", "ros2", "embedded", "c++", "control systems", "mechatronics", "autonomous"];
  if (lower.includes("data engineer")) return ["data engineer", "etl", "data pipeline", "spark", "hadoop", "airflow", "sql", "big data", "data warehouse"];
  if (lower.includes("data scientist")) return ["data scientist", "data science", "machine learning", "ml", "deep learning", "ai"];
  if (lower.includes("machine learning")) return ["machine learning", "ml engineer", "ai engineer", "data scientist"];
  if (lower.includes("data analyst")) return ["data analyst", "business intelligence", "analytics", "bi developer"];
  if (lower.includes("frontend")) return ["frontend", "front end", "react", "ui engineer", "web developer"];
  if (lower.includes("backend")) return ["backend", "back end", "node", "java", "python", "software engineer"];
  if (lower.includes("full stack") || lower.includes("fullstack")) return ["full stack", "fullstack", "software engineer"];
  if (lower.includes("devops") || lower.includes("cloud")) return ["devops", "cloud", "sre", "infrastructure", "platform engineer"];
  if (lower.includes("cybersecurity") || lower.includes("security")) return ["security", "cyber", "infosec", "appsec"];
  if (lower.includes("ui/ux") || lower.includes("designer")) return ["product designer", "ui/ux", "designer", "ux designer"];
  if (lower.includes("product manager")) return ["product manager", "pm", "product lead"];
  if (lower.includes("mobile")) return ["mobile", "android", "ios", "react native", "flutter"];
  if (lower.includes("qa") || lower.includes("quality")) return ["qa", "quality", "test", "sdet", "automation"];

  return lower.split(/[\s/]+/).filter((w) => w.length > 2);
};

/**
 * Tests for whole keyword match or phrase match to prevent false positives like "chain" for "ai"
 */
function hasKeywordMatch(text, keyword) {
  if (!text || !keyword) return false;
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
  return regex.test(text);
}

/**
 * Sanitizes dirty job titles and decodes HTML entities
 */
function sanitizeJobText(str) {
  if (!str) return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[â\x80\x94\u2014]/g, " — ")
    .replace(/[â\x80\x93\u2013]/g, " – ")
    .replace(/[â\x80\x99\u2019]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Fetches live job listings from active ATS endpoints with timeout protection
 */
const fetchEmployerJobs = async (employer) => {
  try {
    const res = await axios.get(employer.apiUrl, {
      headers: { "User-Agent": "CareerPilot-JobAggregator/1.0" },
      timeout: 3500
    });
    const jobs = res.data?.jobs || [];
    return jobs.map((j) => ({
      companyName: employer.name,
      domain: employer.domain,
      jobTitle: sanitizeJobText(j.title),
      location: j.location?.name?.trim() || "India / Remote",
      url: j.absolute_url || `https://${employer.domain}/careers`,
      source: "Company ATS"
    }));
  } catch {
    return [];
  }
};

/**
 * Fetches live tech job postings from RemoteOK
 */
const fetchRemoteOkJobs = async () => {
  try {
    const res = await axios.get("https://remoteok.com/api", {
      headers: { "User-Agent": "CareerPilot-JobAggregator/1.0" },
      timeout: 4000
    });
    const raw = Array.isArray(res.data) ? res.data.slice(1) : [];
    return raw
      .map((j) => ({
        companyName: j.company?.trim(),
        domain: j.company ? `${j.company.toLowerCase().replace(/[^a-z0-9]/g, "")}.com` : null,
        jobTitle: sanitizeJobText(j.position),
        location: j.location?.trim() || "Remote",
        url: j.url,
        salary: j.salary_min && j.salary_max ? `$${Math.round(j.salary_min / 1000)}k - $${Math.round(j.salary_max / 1000)}k` : null,
        tags: Array.isArray(j.tags) ? j.tags.map((t) => t.toLowerCase()) : [],
        source: "RemoteOK Live"
      }))
      .filter((j) => j.companyName && j.jobTitle);
  } catch {
    return [];
  }
};

/**
 * Fetches and ranks top 5 live hiring companies for a given career role and skills
 */
const getLiveTopCompanies = async (targetRole, candidateSkills = []) => {
  if (!targetRole) return [];

  const cacheKey = `hiring_${targetRole.toLowerCase()}`;
  const cached = jobCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const keywords = getRoleKeywords(targetRole);
  const skillKeywords = (Array.isArray(candidateSkills) ? candidateSkills : [])
    .map((s) => String(s).toLowerCase().trim())
    .filter((s) => s.length > 2);

  // Parallel fetch from top employers and live aggregator
  const employerPromises = TECH_EMPLOYERS.map(fetchEmployerJobs);
  const [remoteOkJobs, ...employerResults] = await Promise.all([
    fetchRemoteOkJobs(),
    ...employerPromises
  ]);

  const allJobs = [...remoteOkJobs, ...employerResults.flat()];

  // Score and filter jobs based on role relevance and location
  const candidates = [];
  const seenCompanies = new Set();

  for (const job of allJobs) {
    if (!job.companyName || !job.jobTitle) continue;

    const companyNorm = job.companyName.toLowerCase().trim();
    if (seenCompanies.has(companyNorm)) continue;

    const titleLower = job.jobTitle.toLowerCase();
    const locLower = (job.location || "").toLowerCase();
    const tagsLower = Array.isArray(job.tags) ? job.tags.join(" ") : "";
    const combinedText = `${titleLower} ${tagsLower}`;

    // Role relevance score using word-boundary matching
    let relevanceScore = 0;
    for (const kw of keywords) {
      if (hasKeywordMatch(titleLower, kw)) {
        relevanceScore += 5;
      } else if (hasKeywordMatch(tagsLower, kw)) {
        relevanceScore += 2;
      }
    }

    if (relevanceScore === 0) continue; // Not relevant to target role

    // Location compatibility bonus (India / Remote)
    const isIndia = /india|bangalore|bengaluru|hyderabad|pune|mumbai|gurgaon|gurugram|noida|delhi|chennai|kolkata/i.test(locLower);
    const isRestrictedNonIndia = /us only|usa only|europe only|uk only|americas only|latam only|apac only/i.test(locLower);
    const isRemote = /remote|worldwide|anywhere|global/i.test(locLower) && !isRestrictedNonIndia;

    // Requirement: Must be in India OR Remote open to India candidates
    if (!isIndia && !isRemote) {
      continue;
    }

    if (isIndia) relevanceScore += 4;
    else if (isRemote) relevanceScore += 2;

    // Skill compatibility bonus
    let matchedSkillsCount = 0;
    for (const skill of skillKeywords) {
      if (hasKeywordMatch(combinedText, skill)) {
        matchedSkillsCount++;
        relevanceScore += 1;
      }
    }

    // Company popularity boost — well-known companies rank above obscure ones
    const popularityBoost = COMPANY_POPULARITY[companyNorm] || COMPANY_POPULARITY[companyNorm.replace(/[^a-z0-9]/g, "")] || 0;
    relevanceScore += popularityBoost;

    let demandText = "High Match";
    if (relevanceScore >= 8) demandText = "Top Match";
    else if (matchedSkillsCount > 0) demandText = "Skill Matched";

    let displayLocation = job.location;
    if (isIndia) {
      displayLocation = job.location.includes("India") ? job.location : `${job.location}, India`;
    } else if (isRemote) {
      displayLocation = "Remote (India Eligible)";
    }

    seenCompanies.add(companyNorm);
    candidates.push({
      name: job.companyName,
      domain: job.domain || `${companyNorm.replace(/[^a-z0-9]/g, "")}.com`,
      title: job.jobTitle,
      location: displayLocation,
      demand: demandText,
      demandColor: "text-emerald-500",
      url: job.url || `https://www.google.com/search?q=${encodeURIComponent(job.companyName + " " + targetRole + " jobs")}`,
      salary: job.salary || null,
      score: relevanceScore
    });
  }

  // Sort by relevance score descending
  candidates.sort((a, b) => b.score - a.score);
  const finalCompanies = candidates.slice(0, 5);

  // Cache results
  jobCache.set(cacheKey, { timestamp: Date.now(), data: finalCompanies });

  return finalCompanies;
};

module.exports = {
  getLiveTopCompanies,
  getRoleKeywords
};
