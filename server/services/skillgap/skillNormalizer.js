/**
 * Skill Normalizer for CareerPilot
 * Maps various tech skill representations, synonyms, acronyms, and variations 
 * to canonical standardized skill names.
 */

// Mapping from lowercased/cleaned variant to Canonical Name
const CANONICAL_MAPPINGS = {
  // Languages
  "javascript": "JavaScript",
  "js": "JavaScript",
  "ecmascript": "JavaScript",
  "es6": "JavaScript",
  "es6+": "JavaScript",
  "typescript": "TypeScript",
  "ts": "TypeScript",
  "python": "Python",
  "py": "Python",
  "python3": "Python",
  "python for data analysis": "Python",
  "python data analysis": "Python",
  "python data analytics": "Python",
  "java": "Java",
  "java 8": "Java",
  "java 11": "Java",
  "java 17": "Java",
  "java 21": "Java",
  "c++": "C++",
  "cpp": "C++",
  "c/c++": "C++",
  "c#": "C#",
  "c-sharp": "C#",
  "c sharp": "C#",
  "golang": "Go",
  "go": "Go",
  "rust": "Rust",
  "php": "PHP",
  "ruby": "Ruby",
  "swift": "Swift",
  "kotlin": "Kotlin",
  "dart": "Dart",
  "html": "HTML5",
  "html5": "HTML5",
  "css": "CSS3",
  "css3": "CSS3",
  "sql": "SQL",
  "sql data analysis": "SQL",
  "sql data analytics": "SQL",
  "sql for data analysis": "SQL",
  "sql queries": "SQL",
  "sql querying": "SQL",
  "sql database": "SQL",
  "sql databases": "SQL",
  "sql data modeling": "SQL",
  "advanced sql": "SQL",
  "shell": "Bash/Shell Scripting",
  "bash": "Bash/Shell Scripting",
  "shell scripting": "Bash/Shell Scripting",
  "powershell": "PowerShell",
  "r": "R",
  "scala": "Scala",

  // Frontend Frameworks & Libraries
  "react": "React",
  "reactjs": "React",
  "react.js": "React",
  "react js": "React",
  "next.js": "Next.js",
  "nextjs": "Next.js",
  "next js": "Next.js",
  "next": "Next.js",
  "vue": "Vue.js",
  "vue.js": "Vue.js",
  "vuejs": "Vue.js",
  "vue 3": "Vue.js",
  "nuxt.js": "Nuxt.js",
  "nuxtjs": "Nuxt.js",
  "nuxt": "Nuxt.js",
  "angular": "Angular",
  "angularjs": "Angular",
  "angular 2+": "Angular",
  "svelte": "Svelte",
  "sveltekit": "Svelte",
  "tailwind": "Tailwind CSS",
  "tailwindcss": "Tailwind CSS",
  "tailwind css": "Tailwind CSS",
  "bootstrap": "Bootstrap",
  "sass": "Sass/SCSS",
  "scss": "Sass/SCSS",
  "sass/scss": "Sass/SCSS",
  "styled-components": "Styled Components",
  "styled components": "Styled Components",
  "redux": "Redux",
  "redux toolkit": "Redux Toolkit",
  "rtk": "Redux Toolkit",
  "zustand": "Zustand",
  "react query": "React Query",
  "tanstack query": "React Query",
  "context api": "Context API",
  "axios": "Axios",
  "vite": "Vite",
  "webpack": "Webpack",

  // Backend Frameworks & Runtimes
  "node": "Node.js",
  "nodejs": "Node.js",
  "node.js": "Node.js",
  "node js": "Node.js",
  "express": "Express.js",
  "expressjs": "Express.js",
  "express.js": "Express.js",
  "express js": "Express.js",
  "nestjs": "NestJS",
  "nest.js": "NestJS",
  "nest": "NestJS",
  "django": "Django",
  "django rest": "Django",
  "django rest framework": "Django REST Framework",
  "drf": "Django REST Framework",
  "fastapi": "FastAPI",
  "fast api": "FastAPI",
  "flask": "Flask",
  "spring": "Spring Boot",
  "springboot": "Spring Boot",
  "spring boot": "Spring Boot",
  "spring framework": "Spring Boot",
  "asp.net": "ASP.NET Core",
  "asp.net core": "ASP.NET Core",
  ".net": ".NET Core",
  ".net core": ".NET Core",
  "dotnet": ".NET Core",
  "rails": "Ruby on Rails",
  "ruby on rails": "Ruby on Rails",
  "laravel": "Laravel",
  "gin": "Gin",

  // Databases & Caching
  "postgres": "PostgreSQL",
  "postgresql": "PostgreSQL",
  "postgre sql": "PostgreSQL",
  "psql": "PostgreSQL",
  "mysql": "MySQL",
  "my sql": "MySQL",
  "mongodb": "MongoDB",
  "mongo": "MongoDB",
  "mongo db": "MongoDB",
  "redis": "Redis",
  "redis cache": "Redis",
  "elasticsearch": "Elasticsearch",
  "elastic search": "Elasticsearch",
  "dynamodb": "DynamoDB",
  "dynamo db": "DynamoDB",
  "cassandra": "Cassandra",
  "sqlite": "SQLite",
  "supabase": "Supabase",
  "firebase": "Firebase",
  "prisma": "Prisma ORM",
  "prisma orm": "Prisma ORM",
  "sequelize": "Sequelize",
  "mongoose": "Mongoose",

  // APIs, Messaging & Architecture
  "rest": "REST APIs",
  "rest api": "REST APIs",
  "rest apis": "REST APIs",
  "restful": "REST APIs",
  "restful api": "REST APIs",
  "restful apis": "REST APIs",
  "restful web services": "REST APIs",
  "graphql": "GraphQL",
  "gql": "GraphQL",
  "websocket": "WebSockets",
  "websockets": "WebSockets",
  "socket.io": "WebSockets",
  "grpc": "gRPC",
  "kafka": "Apache Kafka",
  "apache kafka": "Apache Kafka",
  "rabbitmq": "RabbitMQ",
  "microservices": "Microservices",
  "microservice": "Microservices",
  "microservice architecture": "Microservices",
  "system design": "System Design",
  "high level design": "System Design",
  "hld": "System Design",
  "low level design": "System Design",
  "lld": "System Design",
  "event-driven architecture": "Event-Driven Architecture",
  "event driven architecture": "Event-Driven Architecture",
  "api design": "API Design & Documentation",
  "api documentation": "API Design & Documentation",
  "swagger": "Swagger/OpenAPI",
  "openapi": "Swagger/OpenAPI",
  "postman": "Postman",

  // Cloud & DevOps
  "aws": "AWS",
  "amazon web services": "AWS",
  "amazon aws": "AWS",
  "azure": "Microsoft Azure",
  "microsoft azure": "Microsoft Azure",
  "gcp": "Google Cloud Platform (GCP)",
  "google cloud": "Google Cloud Platform (GCP)",
  "google cloud platform": "Google Cloud Platform (GCP)",
  "docker": "Docker",
  "containerization": "Docker",
  "containers": "Docker",
  "kubernetes": "Kubernetes",
  "k8s": "Kubernetes",
  "terraform": "Terraform",
  "ansible": "Ansible",
  "ci/cd": "CI/CD",
  "ci / cd": "CI/CD",
  "cicd": "CI/CD",
  "continuous integration": "CI/CD",
  "continuous deployment": "CI/CD",
  "github actions": "GitHub Actions",
  "gitlab ci": "GitLab CI",
  "jenkins": "Jenkins",
  "linux": "Linux",
  "ubuntu": "Linux",
  "unix": "Linux",
  "git": "Git",
  "github": "Git",
  "gitlab": "Git",
  "nginx": "Nginx",
  "prometheus": "Prometheus",
  "grafana": "Grafana",

  // Testing & Quality
  "jest": "Jest",
  "react testing library": "React Testing Library",
  "rtl": "React Testing Library",
  "cypress": "Cypress",
  "playwright": "Playwright",
  "vitest": "Vitest",
  "mocha": "Mocha",
  "chai": "Chai",
  "junit": "JUnit",
  "pytest": "PyTest",
  "unit testing": "Unit Testing",
  "integration testing": "Integration Testing",
  "end-to-end testing": "End-to-End (E2E) Testing",
  "e2e testing": "End-to-End (E2E) Testing",
  "test driven development": "Test-Driven Development (TDD)",
  "tdd": "Test-Driven Development (TDD)",

  // Security & Auth
  "jwt": "JSON Web Tokens (JWT)",
  "json web tokens": "JSON Web Tokens (JWT)",
  "oauth": "OAuth 2.0",
  "oauth 2.0": "OAuth 2.0",
  "oauth2": "OAuth 2.0",
  "owasp": "OWASP Security Standards",
  "web security": "Web Security Fundamentals",

  // AI & Data Science
  "machine learning": "Machine Learning",
  "ml": "Machine Learning",
  "deep learning": "Deep Learning",
  "dl": "Deep Learning",
  "artificial intelligence": "Artificial Intelligence",
  "ai": "Artificial Intelligence",
  "nlp": "Natural Language Processing (NLP)",
  "natural language processing": "Natural Language Processing (NLP)",
  "computer vision": "Computer Vision",
  "cv": "Computer Vision",
  "opencv": "Computer Vision",
  "pytorch": "PyTorch",
  "tensorflow": "TensorFlow",
  "scikit-learn": "Scikit-Learn",
  "sklearn": "Scikit-Learn",
  "pandas": "Pandas",
  "numpy": "NumPy",
  "generative ai": "Generative AI (GenAI)",
  "genai": "Generative AI (GenAI)",
  "llm": "Large Language Models (LLMs)",
  "llms": "Large Language Models (LLMs)",
  "large language models": "Large Language Models (LLMs)",
  "langchain": "LangChain",
  "hugging face": "Hugging Face",
  "huggingface": "Hugging Face",

  // Mobile
  "react native": "React Native",
  "flutter": "Flutter",
  "ios": "iOS Development",
  "ios development": "iOS Development",
  "android": "Android Development",
  "android development": "Android Development",

  // Design
  "ui/ux": "UI/UX Design",
  "ui/ux design": "UI/UX Design",
  "user interface": "UI Design",
  "user experience": "UX Research",
  "figma": "Figma",
  "figma prototyping": "Figma",
  "figma prototyping & design systems": "Figma",
  "figma prototyping and design systems": "Figma",
  "wireframing": "Wireframing",
  "prototyping": "Prototyping",
  "design systems": "Design Systems",

  // Product Management & Agile
  "api design & integration logic": "REST APIs",
  "api design and integration logic": "REST APIs",
  "agile/scrum methodology": "Agile Methodologies",
  "agile/scrum": "Agile Methodologies",
  "agile methodology": "Agile Methodologies",
  "scrum methodology": "Scrum",
  "jira & linear workflow management": "Jira",
  "jira & linear": "Jira",
  "a/b testing & experimentation design": "A/B Testing",
  "a/b testing and experimentation design": "A/B Testing",
  "customer discovery & interview techniques": "Customer Discovery",
  "customer discovery and interview techniques": "Customer Discovery",
  "product analytics (amplitude/mixpanel)": "Product Analytics",
  "cloud infrastructure concepts (aws/azure/gcp)": "Cloud Infrastructure",
  "user journey mapping & service design": "User Story Mapping",
  "prompt engineering & rag architecture": "Prompt Engineering",
  "retrieval-augmented generation (rag) systems": "RAG Systems",
  "vector databases (pinecone/milvus)": "Vector Databases",
  "real-time event streaming (kafka/redpanda)": "Apache Kafka",
  "synthetic data generation tools": "Synthetic Data Generation",
  "llm evaluation & observability platforms": "LLM Observability",
  "ai agent orchestration frameworks": "AI Agents",
  "security & compliance awareness (gdpr/ccpa)": "Security & Compliance"
};

/**
 * Clean a skill string for lookup.
 */
const cleanForLookup = (str) => {
  if (!str || typeof str !== "string") return "";
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s+#.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Get the standardized canonical name for any skill string.
 * If unknown, cleans up spacing and returns the original name formatted.
 */
const getCanonicalSkill = (rawName) => {
  if (!rawName || typeof rawName !== "string") return "";
  const cleaned = cleanForLookup(rawName);
  
  if (CANONICAL_MAPPINGS[cleaned]) {
    return CANONICAL_MAPPINGS[cleaned];
  }

  // Check without trailing punctuation or version numbers (e.g. "React v18" -> "React")
  const strippedVersion = cleaned.replace(/\s+v?\d+(\.\d+)*$/i, "").trim();
  if (CANONICAL_MAPPINGS[strippedVersion]) {
    return CANONICAL_MAPPINGS[strippedVersion];
  }

  // Return original trimmed name if not in synonym map
  return rawName.trim();
};

/**
 * Returns a list of all search strings/aliases for a given canonical skill.
 */
const getAliasesForSkill = (skillName) => {
  const canonical = getCanonicalSkill(skillName);
  const aliases = new Set([skillName.toLowerCase(), canonical.toLowerCase()]);

  // Find all keys that map to this canonical name
  for (const [variant, target] of Object.entries(CANONICAL_MAPPINGS)) {
    if (target.toLowerCase() === canonical.toLowerCase()) {
      aliases.add(variant);
    }
  }

  // If skill includes slashes (e.g. "Sass/SCSS", "Bash/Shell Scripting"), add splits
  if (skillName.includes("/")) {
    skillName.split("/").forEach(p => {
      const trimmed = p.trim().toLowerCase();
      if (trimmed.length > 1) aliases.add(trimmed);
    });
  }

  // Add parenthesis extractions (e.g. "Google Cloud Platform (GCP)" -> "gcp", "google cloud platform")
  const parenMatch = skillName.match(/\((.*?)\)/);
  if (parenMatch) {
    aliases.add(parenMatch[1].trim().toLowerCase());
    aliases.add(skillName.replace(/\(.*?\)/, "").trim().toLowerCase());
  }

  return Array.from(aliases);
};

/**
 * Normalizes an array of skills to canonical names with deduplication.
 */
const normalizeSkillList = (skills) => {
  if (!Array.isArray(skills)) return [];
  const seen = new Set();
  const result = [];

  for (const item of skills) {
    const canonical = getCanonicalSkill(item);
    if (canonical && !seen.has(canonical.toLowerCase())) {
      seen.add(canonical.toLowerCase());
      result.push(canonical);
    }
  }

  return result;
};

/**
 * Scans raw text (e.g., resume text) and extracts detected canonical skills.
 * Uses exact word boundary matching and alias verification.
 */
const extractSkillsFromText = (text, skillUniverse = []) => {
  if (!text || typeof text !== "string") return [];

  const lowerText = text.toLowerCase();
  // Pad with spaces and normalize punctuation to allow strict boundary checks
  const paddedText = " " + lowerText.replace(/[^\w\s+#.-]/g, " ").replace(/\s+/g, " ") + " ";

  const detected = new Map(); // canonicalName -> { name, matchedAlias }

  // 1. Build list of candidate skills to test: all taxonomy skills + all canonical dictionary skills
  const testSet = new Set(skillUniverse.map(s => typeof s === "string" ? s : s.name));
  for (const canonical of Object.values(CANONICAL_MAPPINGS)) {
    testSet.add(canonical);
  }

  for (const skill of testSet) {
    const canonical = getCanonicalSkill(skill);
    if (detected.has(canonical)) continue;

    const aliases = getAliasesForSkill(skill);
    for (const alias of aliases) {
      if (!alias || alias.length < 2) continue;

      // Single short words or acronyms (like "c", "r", "go", "ts", "js") require exact word boundary
      const paddedAlias = " " + alias.replace(/[^\w\s+#.-]/g, " ").replace(/\s+/g, " ") + " ";
      if (paddedText.includes(paddedAlias)) {
        detected.set(canonical, { name: canonical, matchedAlias: alias });
        break;
      }

      // Multi-word phrase with length > 6 can also match directly if safely unique
      if (alias.length > 7 && lowerText.includes(alias)) {
        detected.set(canonical, { name: canonical, matchedAlias: alias });
        break;
      }
    }
  }

  return Array.from(detected.values()).map(d => d.name);
};

module.exports = {
  CANONICAL_MAPPINGS,
  getCanonicalSkill,
  getAliasesForSkill,
  normalizeSkillList,
  extractSkillsFromText
};
