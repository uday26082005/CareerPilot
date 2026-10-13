/**
 * Comprehensive Role Skill Taxonomy for CareerPilot
 * Defines the broader skill universe for supported engineering & tech roles.
 * Each role contains categorized skills with relevance tiers (Core vs Secondary).
 */

const ROLE_TAXONOMY = {
  "Frontend Developer": {
    categories: {
      "Core Languages": [
        { name: "JavaScript", isCore: true },
        { name: "TypeScript", isCore: true },
        { name: "HTML5", isCore: true },
        { name: "CSS3", isCore: true }
      ],
      "Frameworks & Libraries": [
        { name: "React", isCore: true },
        { name: "Next.js", isCore: true },
        { name: "Vue.js", isCore: false },
        { name: "Angular", isCore: false },
        { name: "Svelte", isCore: false },
        { name: "Tailwind CSS", isCore: true },
        { name: "Sass/SCSS", isCore: false },
        { name: "Styled Components", isCore: false }
      ],
      "State & Data Management": [
        { name: "Redux", isCore: true },
        { name: "Zustand", isCore: false },
        { name: "React Query", isCore: true },
        { name: "Context API", isCore: true },
        { name: "Axios", isCore: true },
        { name: "GraphQL Client", isCore: false }
      ],
      "Architecture & Fundamentals": [
        { name: "Responsive Web Design", isCore: true },
        { name: "Web Accessibility (a11y)", isCore: true },
        { name: "Web Performance Optimization", isCore: true },
        { name: "Core Web Vitals", isCore: false },
        { name: "Server-Side Rendering (SSR)", isCore: true },
        { name: "Single Page Applications (SPA)", isCore: true },
        { name: "Browser APIs & DOM Manipulation", isCore: true },
        { name: "Micro-frontends", isCore: false }
      ],
      "APIs & Networking": [
        { name: "REST APIs", isCore: true },
        { name: "GraphQL", isCore: false },
        { name: "WebSockets", isCore: false }
      ],
      "Testing & Quality": [
        { name: "Jest", isCore: true },
        { name: "React Testing Library", isCore: true },
        { name: "Cypress", isCore: false },
        { name: "Playwright", isCore: false },
        { name: "Vitest", isCore: false },
        { name: "Storybook", isCore: false }
      ],
      "Tooling & Build": [
        { name: "Vite", isCore: true },
        { name: "Webpack", isCore: false },
        { name: "Git", isCore: true },
        { name: "GitHub", isCore: true },
        { name: "NPM/Yarn/PNPM", isCore: true },
        { name: "CI/CD", isCore: false }
      ]
    }
  },

  "Backend Developer": {
    categories: {
      "Core Languages": [
        { name: "Node.js", isCore: true },
        { name: "Python", isCore: true },
        { name: "Java", isCore: true },
        { name: "Go", isCore: false },
        { name: "TypeScript", isCore: true },
        { name: "C#", isCore: false },
        { name: "Rust", isCore: false },
        { name: "C++", isCore: false }
      ],
      "Backend Frameworks": [
        { name: "Express.js", isCore: true },
        { name: "NestJS", isCore: true },
        { name: "FastAPI", isCore: true },
        { name: "Django", isCore: true },
        { name: "Flask", isCore: false },
        { name: "Spring Boot", isCore: true },
        { name: ".NET Core", isCore: false },
        { name: "Ruby on Rails", isCore: false }
      ],
      "Databases & Storage": [
        { name: "PostgreSQL", isCore: true },
        { name: "MySQL", isCore: true },
        { name: "MongoDB", isCore: true },
        { name: "Redis", isCore: true },
        { name: "Elasticsearch", isCore: false },
        { name: "SQLite", isCore: false },
        { name: "Cassandra", isCore: false }
      ],
      "API Design & Protocols": [
        { name: "REST APIs", isCore: true },
        { name: "GraphQL", isCore: false },
        { name: "gRPC", isCore: false },
        { name: "WebSockets", isCore: false },
        { name: "API Gateway", isCore: false },
        { name: "OpenAPI / Swagger", isCore: true }
      ],
      "Message Queues & Streaming": [
        { name: "Kafka", isCore: true },
        { name: "RabbitMQ", isCore: true },
        { name: "Redis Pub/Sub", isCore: false },
        { name: "AWS SQS", isCore: false }
      ],
      "Architecture & Infrastructure": [
        { name: "Microservices", isCore: true },
        { name: "System Design", isCore: true },
        { name: "Event-Driven Architecture", isCore: true },
        { name: "Docker", isCore: true },
        { name: "Kubernetes", isCore: false },
        { name: "Linux", isCore: true },
        { name: "CI/CD", isCore: true },
        { name: "AWS", isCore: false },
        { name: "Caching Strategies", isCore: true }
      ],
      "Security & Authentication": [
        { name: "JWT", isCore: true },
        { name: "OAuth 2.0", isCore: true },
        { name: "Web Security (OWASP)", isCore: true },
        { name: "Rate Limiting", isCore: false }
      ],
      "Testing & Tooling": [
        { name: "Unit Testing", isCore: true },
        { name: "Integration Testing", isCore: true },
        { name: "Jest", isCore: false },
        { name: "PyTest", isCore: false },
        { name: "Postman", isCore: true },
        { name: "Git", isCore: true }
      ]
    }
  },

  "Full Stack Developer": {
    categories: {
      "Core Languages": [
        { name: "JavaScript", isCore: true },
        { name: "TypeScript", isCore: true },
        { name: "Python", isCore: false },
        { name: "HTML5", isCore: true },
        { name: "CSS3", isCore: true },
        { name: "SQL", isCore: true }
      ],
      "Frontend Engineering": [
        { name: "React", isCore: true },
        { name: "Next.js", isCore: true },
        { name: "Tailwind CSS", isCore: true },
        { name: "Redux", isCore: false },
        { name: "React Query", isCore: true },
        { name: "Zustand", isCore: false },
        { name: "Vite", isCore: false },
        { name: "Responsive Web Design", isCore: true },
        { name: "Web Performance Optimization", isCore: false }
      ],
      "Backend Engineering": [
        { name: "Node.js", isCore: true },
        { name: "Express.js", isCore: true },
        { name: "NestJS", isCore: false },
        { name: "FastAPI", isCore: false },
        { name: "REST APIs", isCore: true },
        { name: "GraphQL", isCore: false },
        { name: "WebSockets", isCore: false },
        { name: "Authentication (JWT/OAuth)", isCore: true },
        { name: "API Design & Documentation", isCore: false }
      ],
      "Databases & Caching": [
        { name: "PostgreSQL", isCore: true },
        { name: "MongoDB", isCore: true },
        { name: "MySQL", isCore: false },
        { name: "Redis", isCore: true },
        { name: "Prisma ORM", isCore: false },
        { name: "Database Indexing", isCore: false }
      ],
      "Cloud, DevOps & Tooling": [
        { name: "Docker", isCore: true },
        { name: "Kubernetes", isCore: false },
        { name: "AWS", isCore: true },
        { name: "CI/CD", isCore: true },
        { name: "Git", isCore: true },
        { name: "GitHub Actions", isCore: false },
        { name: "Linux", isCore: true },
        { name: "Postman", isCore: false }
      ],
      "Architecture & Testing": [
        { name: "Microservices", isCore: false },
        { name: "System Design", isCore: true },
        { name: "Web Security (OWASP)", isCore: true },
        { name: "Unit Testing", isCore: true },
        { name: "Integration Testing", isCore: false },
        { name: "Jest", isCore: true },
        { name: "End-to-End Testing", isCore: false }
      ]
    }
  },

  "Data Scientist": {
    categories: {
      "Core Languages": [
        { name: "Python", isCore: true },
        { name: "R", isCore: false },
        { name: "SQL", isCore: true }
      ],
      "Data Manipulation & Exploration": [
        { name: "Pandas", isCore: true },
        { name: "NumPy", isCore: true },
        { name: "SciPy", isCore: false },
        { name: "Exploratory Data Analysis (EDA)", isCore: true },
        { name: "Data Cleaning", isCore: true }
      ],
      "Machine Learning Algorithms": [
        { name: "Machine Learning", isCore: true },
        { name: "Scikit-Learn", isCore: true },
        { name: "XGBoost", isCore: true },
        { name: "LightGBM", isCore: false },
        { name: "Regression Analysis", isCore: true },
        { name: "Classification & Clustering", isCore: true },
        { name: "Random Forest", isCore: true }
      ],
      "Deep Learning & AI": [
        { name: "Deep Learning", isCore: true },
        { name: "PyTorch", isCore: true },
        { name: "TensorFlow", isCore: false },
        { name: "Transformers (Hugging Face)", isCore: false },
        { name: "NLP", isCore: false }
      ],
      "Statistics & Experimentation": [
        { name: "Statistics", isCore: true },
        { name: "Probability Theory", isCore: true },
        { name: "Hypothesis Testing", isCore: true },
        { name: "A/B Testing", isCore: true }
      ],
      "Data Visualization": [
        { name: "Matplotlib", isCore: true },
        { name: "Seaborn", isCore: true },
        { name: "Plotly", isCore: false },
        { name: "Tableau", isCore: false },
        { name: "Power BI", isCore: false }
      ],
      "Big Data, Cloud & MLOps": [
        { name: "Apache Spark", isCore: false },
        { name: "Jupyter Notebooks", isCore: true },
        { name: "MLflow", isCore: false },
        { name: "Docker", isCore: false },
        { name: "AWS SageMaker", isCore: false },
        { name: "Snowflake", isCore: false },
        { name: "Git", isCore: true }
      ]
    }
  },

  "Product Manager": {
    categories: {
      "Product Strategy & Discovery": [
        { name: "Product Strategy", isCore: true },
        { name: "Roadmap Planning", isCore: true },
        { name: "Customer Discovery", isCore: true },
        { name: "User Research", isCore: true },
        { name: "Jobs-to-be-Done (JTBD)", isCore: false },
        { name: "Competitive Analysis", isCore: true },
        { name: "Product-Market Fit", isCore: true }
      ],
      "Analytics & Growth": [
        { name: "Product Analytics", isCore: true },
        { name: "Amplitude", isCore: true },
        { name: "Mixpanel", isCore: false },
        { name: "A/B Testing", isCore: true },
        { name: "Cohort Analysis", isCore: true },
        { name: "Funnel Optimization", isCore: true },
        { name: "North Star Metric", isCore: true },
        { name: "Churn Reduction", isCore: false }
      ],
      "Data & Technical Fluency": [
        { name: "SQL", isCore: true },
        { name: "Data Visualization", isCore: true },
        { name: "Tableau", isCore: false },
        { name: "Power BI", isCore: false },
        { name: "REST APIs", isCore: true },
        { name: "System Architecture Basics", isCore: false },
        { name: "AI/LLM Product Strategy", isCore: true }
      ],
      "Agile & Execution": [
        { name: "Agile Methodologies", isCore: true },
        { name: "Scrum", isCore: true },
        { name: "User Story Mapping", isCore: true },
        { name: "Backlog Prioritization", isCore: true },
        { name: "RICE Scoring", isCore: true },
        { name: "Jira", isCore: true },
        { name: "PRD Writing", isCore: true }
      ],
      "UX & Communication": [
        { name: "Wireframing", isCore: false },
        { name: "Figma", isCore: false },
        { name: "Stakeholder Management", isCore: true },
        { name: "Go-to-Market (GTM) Strategy", isCore: true }
      ]
    }
  },

  "UI/UX Designer": {
    categories: {
      "Design Tools": [
        { name: "Figma", isCore: true },
        { name: "Adobe XD", isCore: false },
        { name: "Sketch", isCore: false },
        { name: "Photoshop", isCore: false },
        { name: "Illustrator", isCore: false },
        { name: "Framer", isCore: false }
      ],
      "UX Research": [
        { name: "User Research", isCore: true },
        { name: "Usability Testing", isCore: true },
        { name: "User Interviews", isCore: true },
        { name: "User Personas", isCore: true },
        { name: "Journey Mapping", isCore: true },
        { name: "Information Architecture", isCore: true }
      ],
      "UI & Interaction Design": [
        { name: "Wireframing", isCore: true },
        { name: "Prototyping", isCore: true },
        { name: "Design Systems", isCore: true },
        { name: "Component Libraries", isCore: true },
        { name: "Micro-interactions", isCore: false },
        { name: "Responsive Web Design", isCore: true }
      ],
      "Visual Design Principles": [
        { name: "Typography", isCore: true },
        { name: "Color Theory", isCore: true },
        { name: "Visual Hierarchy", isCore: true },
        { name: "Layout & Grid Systems", isCore: true }
      ],
      "Technical & Standards": [
        { name: "Web Accessibility (a11y)", isCore: true },
        { name: "WCAG 2.2", isCore: true },
        { name: "Design Handoff", isCore: true },
        { name: "HTML/CSS Basics", isCore: false }
      ]
    }
  },

  "DevOps Engineer": {
    categories: {
      "Operating Systems & Scripting": [
        { name: "Linux", isCore: true },
        { name: "Bash Scripting", isCore: true },
        { name: "Python", isCore: true },
        { name: "Shell Scripting", isCore: true }
      ],
      "Containers & Orchestration": [
        { name: "Docker", isCore: true },
        { name: "Kubernetes", isCore: true },
        { name: "Helm", isCore: true },
        { name: "Containerd", isCore: false },
        { name: "Service Mesh (Istio)", isCore: false }
      ],
      "Infrastructure as Code (IaC)": [
        { name: "Terraform", isCore: true },
        { name: "Ansible", isCore: true },
        { name: "CloudFormation", isCore: false },
        { name: "Pulumi", isCore: false }
      ],
      "CI/CD Pipelines": [
        { name: "CI/CD", isCore: true },
        { name: "GitHub Actions", isCore: true },
        { name: "GitLab CI", isCore: true },
        { name: "Jenkins", isCore: true },
        { name: "ArgoCD", isCore: false }
      ],
      "Cloud Providers": [
        { name: "AWS", isCore: true },
        { name: "Azure", isCore: false },
        { name: "GCP", isCore: false }
      ],
      "Monitoring & Observability": [
        { name: "Prometheus", isCore: true },
        { name: "Grafana", isCore: true },
        { name: "ELK Stack", isCore: true },
        { name: "OpenTelemetry", isCore: false },
        { name: "Datadog", isCore: false }
      ],
      "Networking & Security": [
        { name: "Networking (TCP/IP, DNS)", isCore: true },
        { name: "SSL/TLS", isCore: true },
        { name: "Nginx", isCore: true },
        { name: "Vault", isCore: false },
        { name: "Git", isCore: true }
      ]
    }
  },

  "Mobile App Developer": {
    categories: {
      "Cross-Platform": [
        { name: "React Native", isCore: true },
        { name: "Flutter", isCore: true },
        { name: "Dart", isCore: true },
        { name: "Expo", isCore: false }
      ],
      "Native Platforms": [
        { name: "Swift", isCore: true },
        { name: "SwiftUI", isCore: true },
        { name: "Kotlin", isCore: true },
        { name: "Jetpack Compose", isCore: true },
        { name: "Java", isCore: false }
      ],
      "Mobile Architecture & Storage": [
        { name: "MVVM", isCore: true },
        { name: "SQLite / Room / Core Data", isCore: true },
        { name: "State Management", isCore: true },
        { name: "Offline Storage & Sync", isCore: true }
      ],
      "APIs & Networking": [
        { name: "REST APIs", isCore: true },
        { name: "GraphQL", isCore: false },
        { name: "Push Notifications (FCM/APNS)", isCore: true }
      ],
      "Testing & Deployment": [
        { name: "Mobile App Testing", isCore: true },
        { name: "App Store Connect", isCore: true },
        { name: "Google Play Console", isCore: true },
        { name: "Git", isCore: true },
        { name: "CI/CD for Mobile", isCore: false }
      ]
    }
  },

  "Data Analyst": {
    categories: {
      "SQL & Querying": [
        { name: "SQL", isCore: true },
        { name: "PostgreSQL", isCore: true },
        { name: "MySQL", isCore: false },
        { name: "Snowflake", isCore: true },
        { name: "BigQuery", isCore: false }
      ],
      "BI & Visualization": [
        { name: "Power BI", isCore: true },
        { name: "Tableau", isCore: true },
        { name: "Dashboard Design", isCore: true },
        { name: "Data Storytelling", isCore: true }
      ],
      "Spreadsheets": [
        { name: "Excel", isCore: true },
        { name: "Pivot Tables", isCore: true },
        { name: "Power Query", isCore: true },
        { name: "Google Sheets", isCore: false }
      ],
      "Scripting & Analytics": [
        { name: "Python", isCore: true },
        { name: "Pandas", isCore: true },
        { name: "NumPy", isCore: false },
        { name: "R", isCore: false }
      ],
      "Statistical Insights": [
        { name: "Statistics", isCore: true },
        { name: "A/B Testing Analysis", isCore: true },
        { name: "Data Cleaning", isCore: true },
        { name: "KPI Development", isCore: true }
      ]
    }
  },

  "Machine Learning Engineer": {
    categories: {
      "Core Programming": [
        { name: "Python", isCore: true },
        { name: "C++", isCore: false },
        { name: "SQL", isCore: true }
      ],
      "ML & Deep Learning Frameworks": [
        { name: "PyTorch", isCore: true },
        { name: "TensorFlow", isCore: true },
        { name: "Scikit-Learn", isCore: true },
        { name: "Hugging Face Transformers", isCore: true },
        { name: "Keras", isCore: false }
      ],
      "Modern AI & Generative Modeling": [
        { name: "Large Language Models (LLMs)", isCore: true },
        { name: "RAG Systems", isCore: true },
        { name: "Vector Databases", isCore: true },
        { name: "LangChain", isCore: true },
        { name: "Fine-Tuning (LoRA)", isCore: false },
        { name: "Prompt Engineering", isCore: true }
      ],
      "MLOps & Deployment": [
        { name: "MLflow", isCore: true },
        { name: "Docker", isCore: true },
        { name: "Kubernetes", isCore: false },
        { name: "Model Serving (FastAPI/Triton)", isCore: true },
        { name: "CI/CD for ML", isCore: false },
        { name: "AWS SageMaker", isCore: false }
      ],
      "Foundational Math & Systems": [
        { name: "Data Structures & Algorithms", isCore: true },
        { name: "Linear Algebra & Statistics", isCore: true },
        { name: "GPU Acceleration (CUDA)", isCore: false },
        { name: "Git", isCore: true }
      ]
    }
  },

  "Cybersecurity Analyst": {
    categories: {
      "Security Operations & SIEM": [
        { name: "SIEM", isCore: true },
        { name: "Splunk", isCore: true },
        { name: "Microsoft Sentinel", isCore: false },
        { name: "Incident Response", isCore: true },
        { name: "SOC Procedures", isCore: true }
      ],
      "Threat Intelligence & Hunting": [
        { name: "Threat Hunting", isCore: true },
        { name: "MITRE ATT&CK", isCore: true },
        { name: "Indicators of Compromise (IOCs)", isCore: true },
        { name: "Vulnerability Assessment", isCore: true }
      ],
      "Network Security": [
        { name: "Wireshark", isCore: true },
        { name: "TCP/IP & Networking", isCore: true },
        { name: "Firewalls", isCore: true },
        { name: "IDS/IPS (Snort/Suricata)", isCore: false },
        { name: "VPN & Network Security", isCore: true }
      ],
      "Endpoint & Cloud Security": [
        { name: "EDR/XDR (CrowdStrike/SentinelOne)", isCore: true },
        { name: "Zero Trust Architecture", isCore: true },
        { name: "AWS Security Hub", isCore: false },
        { name: "IAM Security", isCore: true }
      ],
      "Scripting & Tools": [
        { name: "Python", isCore: true },
        { name: "Bash", isCore: true },
        { name: "PowerShell", isCore: true },
        { name: "Linux Security", isCore: true },
        { name: "Penetration Testing Basics", isCore: false }
      ],
      "Compliance & Standards": [
        { name: "NIST CSF", isCore: true },
        { name: "ISO 27001", isCore: false },
        { name: "SOC 2", isCore: false }
      ]
    }
  },

  "Cloud Architect": {
    categories: {
      "Cloud Providers": [
        { name: "AWS", isCore: true },
        { name: "Azure", isCore: true },
        { name: "GCP", isCore: false }
      ],
      "Architecture & Design": [
        { name: "System Design", isCore: true },
        { name: "High Availability (HA)", isCore: true },
        { name: "Disaster Recovery (DR)", isCore: true },
        { name: "Serverless Architecture", isCore: true },
        { name: "Microservices", isCore: true },
        { name: "Well-Architected Framework", isCore: true }
      ],
      "Infrastructure as Code": [
        { name: "Terraform", isCore: true },
        { name: "CloudFormation", isCore: false },
        { name: "Ansible", isCore: false }
      ],
      "Containers & Platforms": [
        { name: "Kubernetes (EKS/AKS/GKE)", isCore: true },
        { name: "Docker", isCore: true }
      ],
      "Cloud Networking & Security": [
        { name: "VPC & Subnetting", isCore: true },
        { name: "IAM & Cloud Security", isCore: true },
        { name: "Load Balancing", isCore: true },
        { name: "Zero Trust Architecture", isCore: true }
      ],
      "Governance & Cost": [
        { name: "FinOps & Cost Optimization", isCore: true },
        { name: "Compliance & Auditing", isCore: false }
      ]
    }
  },

  "Quality Assurance Engineer": {
    categories: {
      "Automation Frameworks": [
        { name: "Selenium", isCore: true },
        { name: "Cypress", isCore: true },
        { name: "Playwright", isCore: true },
        { name: "Appium", isCore: false }
      ],
      "Programming": [
        { name: "JavaScript", isCore: true },
        { name: "TypeScript", isCore: true },
        { name: "Python", isCore: true },
        { name: "Java", isCore: false }
      ],
      "API Testing": [
        { name: "Postman", isCore: true },
        { name: "REST APIs Testing", isCore: true },
        { name: "Newman", isCore: false }
      ],
      "Testing Methodologies": [
        { name: "Test Automation", isCore: true },
        { name: "Test Case Design", isCore: true },
        { name: "Regression Testing", isCore: true },
        { name: "Integration Testing", isCore: true },
        { name: "Performance Testing (JMeter/k6)", isCore: false },
        { name: "BDD (Cucumber/Gherkin)", isCore: false }
      ],
      "Tools & CI/CD": [
        { name: "Jira", isCore: true },
        { name: "CI/CD", isCore: true },
        { name: "Git", isCore: true },
        { name: "SQL", isCore: true }
      ]
    }
  },

  "Business Analyst": {
    categories: {
      "Requirements & Analysis": [
        { name: "Requirements Gathering", isCore: true },
        { name: "User Stories & Acceptance Criteria", isCore: true },
        { name: "BRD / FRD Documentation", isCore: true },
        { name: "Gap Analysis", isCore: true },
        { name: "Stakeholder Management", isCore: true }
      ],
      "Process Modeling": [
        { name: "BPMN", isCore: true },
        { name: "Process Mapping & Flowcharts", isCore: true },
        { name: "UML Modeling", isCore: false },
        { name: "Lucidchart / Visio", isCore: false }
      ],
      "Data & Reporting": [
        { name: "SQL", isCore: true },
        { name: "Excel", isCore: true },
        { name: "Power BI", isCore: true },
        { name: "Tableau", isCore: false },
        { name: "Data Analysis", isCore: true }
      ],
      "Methodologies": [
        { name: "Agile", isCore: true },
        { name: "Scrum", isCore: true },
        { name: "User Acceptance Testing (UAT)", isCore: true },
        { name: "Jira", isCore: true }
      ]
    }
  },

  "Software Development Engineer": {
    categories: {
      "Core Programming Languages": [
        { name: "Java", isCore: true },
        { name: "C++", isCore: true },
        { name: "Python", isCore: true },
        { name: "Go", isCore: false },
        { name: "TypeScript", isCore: false }
      ],
      "Data Structures & Algorithms": [
        { name: "Arrays & Strings", isCore: true },
        { name: "Trees & Graphs", isCore: true },
        { name: "Dynamic Programming", isCore: true },
        { name: "Sorting & Searching", isCore: true },
        { name: "Time & Space Complexity", isCore: true },
        { name: "Hash Tables & Heaps", isCore: true }
      ],
      "Software Design & Architecture": [
        { name: "Object-Oriented Design (OOD)", isCore: true },
        { name: "System Design (HLD & LLD)", isCore: true },
        { name: "Design Patterns", isCore: true },
        { name: "Microservices Architecture", isCore: true },
        { name: "Distributed Systems", isCore: true },
        { name: "Concurrency & Multithreading", isCore: true }
      ],
      "APIs, Databases & Backend": [
        { name: "REST APIs", isCore: true },
        { name: "gRPC", isCore: false },
        { name: "Relational Databases (SQL)", isCore: true },
        { name: "NoSQL Databases", isCore: false },
        { name: "Caching (Redis/Memcached)", isCore: true },
        { name: "Message Queues (Kafka/RabbitMQ)", isCore: false }
      ],
      "Engineering Practices & DevOps": [
        { name: "Git & Version Control", isCore: true },
        { name: "Unit Testing & TDD", isCore: true },
        { name: "CI/CD Pipelines", isCore: true },
        { name: "Docker", isCore: true },
        { name: "Cloud Platforms (AWS/GCP/Azure)", isCore: true },
        { name: "Code Review & Refactoring", isCore: true }
      ]
    }
  },

  "System Reliability Engineer": {
    categories: {
      "Operating Systems & Internals": [
        { name: "Linux Administration", isCore: true },
        { name: "Kernel & OS Internals", isCore: true },
        { name: "Shell Scripting (Bash)", isCore: true },
        { name: "Python", isCore: true },
        { name: "Go", isCore: false }
      ],
      "Cloud & Infrastructure as Code": [
        { name: "Kubernetes (K8s)", isCore: true },
        { name: "Docker & Containerization", isCore: true },
        { name: "Terraform", isCore: true },
        { name: "Ansible", isCore: false },
        { name: "AWS / GCP / Azure", isCore: true },
        { name: "Helm", isCore: false }
      ],
      "Observability & Monitoring": [
        { name: "Prometheus", isCore: true },
        { name: "Grafana", isCore: true },
        { name: "Distributed Tracing (OpenTelemetry/Jaeger)", isCore: true },
        { name: "ELK Stack / Datadog", isCore: true },
        { name: "Log Aggregation & Analysis", isCore: true }
      ],
      "Reliability Engineering & Operations": [
        { name: "SLIs, SLOs & SLAs", isCore: true },
        { name: "Incident Management & Postmortems", isCore: true },
        { name: "Chaos Engineering", isCore: false },
        { name: "Disaster Recovery & High Availability", isCore: true },
        { name: "Capacity Planning", isCore: true }
      ],
      "Networking & Security": [
        { name: "TCP/IP & Networking Protocols", isCore: true },
        { name: "DNS, Load Balancing & CDN", isCore: true },
        { name: "TLS/SSL & Certificates", isCore: true },
        { name: "Network Security & Firewalls", isCore: true }
      ]
    }
  },

  "Game Developer": {
    categories: {
      "Game Programming Languages": [
        { name: "C++", isCore: true },
        { name: "C#", isCore: true },
        { name: "Lua / Python", isCore: false },
        { name: "HLSL / GLSL (Shaders)", isCore: true }
      ],
      "Game Engines": [
        { name: "Unity", isCore: true },
        { name: "Unreal Engine 5", isCore: true },
        { name: "Godot", isCore: false },
        { name: "Custom Engine Architecture", isCore: false }
      ],
      "Math & Physics": [
        { name: "3D Vector & Matrix Math", isCore: true },
        { name: "Quaternions & Rotations", isCore: true },
        { name: "Collision Detection & Physics Engines", isCore: true },
        { name: "Rigid Body Dynamics", isCore: false }
      ],
      "Graphics & Rendering": [
        { name: "Shader Programming", isCore: true },
        { name: "Rendering Pipelines (Forward/Deferred)", isCore: true },
        { name: "DirectX / Vulkan / OpenGL", isCore: false },
        { name: "Lighting & Post-Processing", isCore: false },
        { name: "Particle Systems & VFX", isCore: false }
      ],
      "Gameplay & Systems Architecture": [
        { name: "Gameplay Mechanics & Controls", isCore: true },
        { name: "Game AI & Pathfinding (A*, NavMesh)", isCore: true },
        { name: "Entity-Component-System (ECS)", isCore: true },
        { name: "Animation State Machines", isCore: true },
        { name: "Multiplayer Networking & Replication", isCore: false },
        { name: "Profiling & Memory Optimization", isCore: true }
      ]
    }
  },

  "Database Administrator": {
    categories: {
      "RDBMS & Core SQL": [
        { name: "PostgreSQL", isCore: true },
        { name: "MySQL", isCore: true },
        { name: "Oracle Database", isCore: true },
        { name: "Microsoft SQL Server", isCore: true },
        { name: "Advanced SQL & PL/SQL", isCore: true }
      ],
      "Database Performance & Tuning": [
        { name: "Query Optimization & Execution Plans", isCore: true },
        { name: "Index Tuning & Strategy", isCore: true },
        { name: "Memory & Buffer Cache Management", isCore: true },
        { name: "Concurrency & Lock Troubleshooting", isCore: true },
        { name: "Partitioning & Sharding", isCore: true }
      ],
      "High Availability & Disaster Recovery": [
        { name: "Database Replication (Master-Slave/Multi-Master)", isCore: true },
        { name: "Clustering & Failover", isCore: true },
        { name: "Backup Strategies & Point-in-Time Recovery", isCore: true },
        { name: "Disaster Recovery Planning", isCore: true }
      ],
      "Security & Compliance": [
        { name: "Database Security & Access Control", isCore: true },
        { name: "Data Encryption (At Rest & In Transit)", isCore: true },
        { name: "Audit Logging & Compliance", isCore: true },
        { name: "Patch Management & Upgrades", isCore: true }
      ],
      "Cloud Databases & NoSQL": [
        { name: "AWS RDS / Aurora", isCore: true },
        { name: "MongoDB", isCore: false },
        { name: "Redis", isCore: false },
        { name: "Database Migration Tools", isCore: true },
        { name: "Database Monitoring & Alerting", isCore: true }
      ]
    }
  },

  "Robotics Engineer": {
    categories: {
      "Core Robotics Software": [
        { name: "ROS (Robot Operating System)", isCore: true },
        { name: "ROS 2", isCore: true },
        { name: "C++", isCore: true },
        { name: "Python", isCore: true },
        { name: "Linux / Embedded Linux", isCore: true }
      ],
      "Kinematics, Dynamics & Control": [
        { name: "Forward & Inverse Kinematics", isCore: true },
        { name: "PID & Feedback Control Systems", isCore: true },
        { name: "Trajectory & Motion Planning", isCore: true },
        { name: "State Estimation (Kalman Filters / EKF)", isCore: true }
      ],
      "Perception & Computer Vision": [
        { name: "Computer Vision (OpenCV)", isCore: true },
        { name: "LiDAR & Point Cloud Processing (PCL)", isCore: true },
        { name: "Sensor Fusion (IMU, Camera, LiDAR)", isCore: true },
        { name: "SLAM (Simultaneous Localization & Mapping)", isCore: true }
      ],
      "Embedded & Hardware Interfaces": [
        { name: "Microcontrollers (STM32, Arduino, ESP32)", isCore: true },
        { name: "CAN Bus, I2C, SPI & UART", isCore: true },
        { name: "Actuators & Motor Controllers", isCore: false },
        { name: "Real-Time Operating Systems (RTOS)", isCore: true }
      ],
      "Simulation & Tooling": [
        { name: "Gazebo / Isaac Sim", isCore: true },
        { name: "URDF & Robot Modeling", isCore: true },
        { name: "RViz", isCore: true },
        { name: "Git", isCore: true }
      ]
    }
  },

  "Data Engineer": {
    categories: {
      "Languages & Fundamentals": [
        { name: "Python", isCore: true },
        { name: "SQL", isCore: true },
        { name: "Scala / Java", isCore: false },
        { name: "Data Structures & Algorithms", isCore: true },
        { name: "Linux & Shell Scripting", isCore: true }
      ],
      "Big Data & Distributed Processing": [
        { name: "Apache Spark", isCore: true },
        { name: "PySpark", isCore: true },
        { name: "Apache Hadoop / HDFS", isCore: false },
        { name: "Apache Flink", isCore: false },
        { name: "MapReduce Concepts", isCore: false }
      ],
      "Data Pipelines & Orchestration": [
        { name: "Apache Airflow", isCore: true },
        { name: "dbt (data build tool)", isCore: true },
        { name: "Prefect / Dagster", isCore: false },
        { name: "ETL / ELT Architecture", isCore: true },
        { name: "Data Quality & Validation (Great Expectations)", isCore: false }
      ],
      "Data Warehousing & Lakehouses": [
        { name: "Snowflake", isCore: true },
        { name: "Google BigQuery", isCore: true },
        { name: "AWS Redshift", isCore: false },
        { name: "Delta Lake / Apache Iceberg", isCore: true },
        { name: "Dimensional Data Modeling (Star/Snowflake Schema)", isCore: true }
      ],
      "Streaming, Cloud & Infrastructure": [
        { name: "Apache Kafka", isCore: true },
        { name: "Cloud Storage (AWS S3 / GCP GCS)", isCore: true },
        { name: "Docker", isCore: true },
        { name: "Kubernetes", isCore: false },
        { name: "Git & CI/CD", isCore: true }
      ]
    }
  }
};

const ROLE_ALIASES = {
  "software engineer": "Software Development Engineer",
  "software developer": "Software Development Engineer",
  "software development engineer": "Software Development Engineer",
  "software developement engineer": "Software Development Engineer",
  "sde": "Software Development Engineer",
  "sde 1": "Software Development Engineer",
  "sde 2": "Software Development Engineer",
  "sde 3": "Software Development Engineer",
  "swe": "Software Development Engineer",
  "web developer": "Full Stack Developer",
  "frontend": "Frontend Developer",
  "backend": "Backend Developer",
  "fullstack": "Full Stack Developer",
  "full stack": "Full Stack Developer",
  "qa engineer": "Quality Assurance Engineer",
  "qa": "Quality Assurance Engineer",
  "ml engineer": "Machine Learning Engineer",
  "ai engineer": "Machine Learning Engineer",
  "mobile developer": "Mobile App Developer",
  "ios developer": "Mobile App Developer",
  "android developer": "Mobile App Developer",
  "system reliability engineer": "System Reliability Engineer",
  "site reliability engineer": "System Reliability Engineer",
  "sre": "System Reliability Engineer",
  "game developer": "Game Developer",
  "game dev": "Game Developer",
  "game designer": "Game Developer",
  "database administrator": "Database Administrator",
  "dba": "Database Administrator",
  "database engineer": "Database Administrator",
  "robotics engineer": "Robotics Engineer",
  "robotics": "Robotics Engineer",
  "data engineer": "Data Engineer",
  "de": "Data Engineer"
};

/**
 * Returns the full structured taxonomy for a role.
 * Includes fallback for matching roles by prefix, aliases, or case.
 */
const getRoleTaxonomy = (targetRole) => {
  if (!targetRole) return null;
  const exact = ROLE_TAXONOMY[targetRole];
  if (exact) return exact;

  const normalized = targetRole.trim().toLowerCase();
  if (ROLE_ALIASES[normalized] && ROLE_TAXONOMY[ROLE_ALIASES[normalized]]) {
    return ROLE_TAXONOMY[ROLE_ALIASES[normalized]];
  }

  for (const [key, value] of Object.entries(ROLE_TAXONOMY)) {
    if (key.toLowerCase() === normalized || key.toLowerCase().includes(normalized) || normalized.includes(key.toLowerCase())) {
      return value;
    }
  }

  // Default to Full Stack Developer if unmapped
  return ROLE_TAXONOMY["Full Stack Developer"];
};

const CORE_SKILL_PATTERNS = [
  // Full Stack / Frontend / Backend
  "javascript", "typescript", "html5", "css3", "python", "java", "sql", "git",
  "react", "node.js", "express.js", "postgresql", "rest apis", "docker",
  "responsive web design", "system design", "data structures & algorithms",

  // Product Management (Exactly 10 Core Skills)
  "product strategy", "roadmap planning", "prd writing", "customer discovery",
  "user research", "agile methodologies", "scrum", "stakeholder management",

  // UI/UX Design
  "figma", "wireframing", "prototyping", "design systems", "usability testing",

  // DevOps & Cloud
  "kubernetes", "terraform", "ci/cd", "aws", "linux", "bash scripting",

  // Data Analysis & Data Science
  "excel", "power bi", "tableau", "pandas", "data analysis", "statistics", "machine learning",

  // Quality Assurance
  "selenium", "cypress", "playwright", "test automation", "test case design",

  // Cybersecurity
  "siem", "splunk", "incident response", "threat hunting", "firewalls",

  // Business Analysis
  "requirements gathering", "user stories & acceptance criteria", "brd / frd documentation"
];

const IMPORTANT_SKILL_PATTERNS = [
  "next.js", "tailwind css", "redux", "jest", "mongodb", "mysql", "redis",
  "linux", "ci/cd", "fastapi", "django", "spring boot", "react query",
  "context api", "microservices", "aws", "github", "vite", "unit testing",
  "authentication (jwt/oauth)", "state management", "api design",
  "amplitude", "mixpanel", "a/b testing", "rice scoring", "jira", "user story mapping"
];

const determineTier = (skillObj, category) => {
  if (skillObj.tier) return skillObj.tier;
  const nameLower = skillObj.name.toLowerCase();

  if (skillObj.isCore) {
    if (CORE_SKILL_PATTERNS.some(p => nameLower === p || nameLower.startsWith(p))) {
      return "core";
    }
    if (
      category.toLowerCase().includes("core language") || 
      category.toLowerCase().includes("fundamentals") ||
      category.toLowerCase().includes("strategy") ||
      category.toLowerCase().includes("requirements")
    ) {
      return "core";
    }
    return "important";
  }

  if (IMPORTANT_SKILL_PATTERNS.some(p => nameLower === p || nameLower.startsWith(p))) {
    return "important";
  }

  return "supporting";
};

/**
 * Returns a flat list of all skills defined in the taxonomy for a role with tiers and weights.
 */
const getFlatRoleSkills = (targetRole) => {
  const taxonomy = getRoleTaxonomy(targetRole);
  if (!taxonomy) return [];

  const flat = [];
  for (const [category, skills] of Object.entries(taxonomy.categories)) {
    for (const skillObj of skills) {
      const tier = determineTier(skillObj, category);
      const weight = tier === "core" ? 3.0 : tier === "important" ? 2.0 : 1.0;
      flat.push({
        name: skillObj.name,
        category,
        tier,
        weight,
        isCore: tier === "core"
      });
    }
  }
  return flat;
};

/**
 * Returns the 6-8 core domain pillars for a role to power the Radar Chart.
 */
const getRolePillars = (targetRole) => {
  const taxonomy = getRoleTaxonomy(targetRole);
  if (!taxonomy) return [];

  return Object.entries(taxonomy.categories).map(([category, skills]) => ({
    pillarName: category.replace(/ & /g, " / "),
    skills: skills.map(s => s.name),
    coreCount: skills.filter(s => s.isCore).length,
    totalCount: skills.length
  }));
};

module.exports = {
  ROLE_TAXONOMY,
  getRoleTaxonomy,
  getFlatRoleSkills,
  getRolePillars,
  determineTier
};
