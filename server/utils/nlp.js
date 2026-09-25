/**
 * Custom NLP Engine for Skill Matching
 * Uses Tokenization, Stop Word Removal, and Jaccard Similarity Algorithm.
 */

// Basic English stop words
const STOP_WORDS = new Set([
  "the", "is", "at", "which", "and", "on", "in", "with", "a", "an", "for", "to", 
  "of", "by", "as", "it", "this", "that", "are", "was", "be", "or", "from"
]);

/**
 * Cleans and tokenizes text. 
 * Removes stop words and normalizes case, while preserving tech characters (C#, C++).
 */
const tokenizeAndClean = (text) => {
  if (!text) return new Set();
  
  // Lowercase and remove punctuation except +, #, -, .
  const normalized = text.toLowerCase().replace(/[^\w\s+#.-]/g, ' ');
  
  // Split by whitespace
  const tokens = normalized.split(/\s+/).filter(Boolean);
  
  // Remove stop words
  const cleanTokens = tokens.filter(token => !STOP_WORDS.has(token));
  
  return new Set(cleanTokens);
};

/**
 * Calculates the Jaccard Similarity Score between two sets.
 * Formula: J(A,B) = |A ∩ B| / |A ∪ B|
 */
const calculateJaccardSimilarity = (setA, setB) => {
  if (setA.size === 0 && setB.size === 0) return 1.0;
  
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  
  return intersection.size / union.size;
};

const getAliases = (skill) => {
  const aliases = [skill.toLowerCase()];
  if (skill.includes('/')) {
    skill.toLowerCase().split('/').forEach(s => aliases.push(s.trim()));
  }
  
  const expanded = new Set(aliases);
  for (let alias of aliases) {
    if (alias === 'aws') expanded.add('amazon web services');
    if (alias === 'gcp') { expanded.add('google cloud'); expanded.add('google cloud platform'); }
    if (alias.includes('postgres')) { expanded.add('postgres'); expanded.add('postgresql'); }
    if (alias === 'mysql') expanded.add('my sql');
    if (alias === 'node.js' || alias === 'nodejs') expanded.add('node');
    if (alias === 'javascript') expanded.add('js');
    if (alias === 'typescript') expanded.add('ts');
    if (alias === 'react') { expanded.add('react.js'); expanded.add('reactjs'); }
    if (alias === 'vue.js') { expanded.add('vue'); expanded.add('vuejs'); }
    if (alias.includes('rest api')) { expanded.add('rest'); expanded.add('restful'); }
    if (alias.includes('ci/cd')) { expanded.add('continuous integration'); expanded.add('continuous deployment'); }
    if (alias === 'machine learning') expanded.add('ml');
    if (alias === 'deep learning') expanded.add('dl');
    if (alias === 'artificial intelligence') expanded.add('ai');
    if (alias === 'natural language processing') expanded.add('nlp');
    if (alias === 'ui/ux' || alias.includes('ui/ux')) { expanded.add('user interface'); expanded.add('user experience'); }
  }
  return Array.from(expanded);
};

/**
 * Matches required skills against the raw resume text.
 * Returns the matched skills, missing skills, and the custom NLP match score.
 */
const matchSkills = (resumeText, requiredSkills) => {
  const resumeTokens = tokenizeAndClean(resumeText);
  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach(skill => {
    const resumeLower = resumeText.toLowerCase();
    const aliases = getAliases(skill);
    
    // Create a padded version of the resume for exact word matching
    const paddedResume = ' ' + resumeLower.replace(/[^\w\s+#.-]/g, ' ').replace(/\s+/g, ' ') + ' ';
    
    // 1. Check exact word match for any alias (highest confidence)
    let isMatched = false;
    for (let alias of aliases) {
      // Pad the alias exactly like the resume
      const paddedAlias = ' ' + alias.replace(/[^\w\s+#.-]/g, ' ').replace(/\s+/g, ' ') + ' ';
      
      // If it's a very short acronym or single word, enforce strict word boundary
      if (paddedResume.includes(paddedAlias)) {
        isMatched = true;
        break;
      }
      
      // Fallback for raw substring if it's a long, specific multi-word phrase (optional, but padded is safer)
      if (alias.length > 5 && resumeLower.includes(alias)) {
        isMatched = true;
        break;
      }
    }

    if (isMatched) {
      matchedSkills.push(skill);
      return;
    }

    // 2. Fallback to NLP Token Overlap
    const skillTokens = tokenizeAndClean(skill);
    if (skillTokens.size === 0) return;

    // Check how many of the skill's words are in the resume
    const intersection = new Set([...skillTokens].filter(x => resumeTokens.has(x)));
    const overlapRatio = intersection.size / skillTokens.size;

    // If 80% or more of the skill's terms are found, consider it matched
    if (overlapRatio >= 0.8) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  // Calculate an overall Jaccard Similarity Score for the profile vs target role
  const requiredTokens = new Set();
  requiredSkills.forEach(skill => {
    tokenizeAndClean(skill).forEach(t => requiredTokens.add(t));
  });

  const overallJaccardScore = calculateJaccardSimilarity(resumeTokens, requiredTokens);
  
  // Scale score to a percentage based on matched arrays for the final UI
  const matchPercentage = requiredSkills.length > 0 
    ? Math.round((matchedSkills.length / requiredSkills.length) * 100) 
    : 0;

  return {
    matchedSkills,
    missingSkills,
    jaccardScore: overallJaccardScore,
    matchPercentage
  };
};

module.exports = {
  tokenizeAndClean,
  calculateJaccardSimilarity,
  matchSkills
};
