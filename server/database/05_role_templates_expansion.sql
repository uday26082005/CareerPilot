-- Phase 6 Expansion: Massive Role Dictionary
-- This script adds ~40 detailed roles to the role_skill_templates table.
-- Using ON CONFLICT DO NOTHING to avoid overwriting existing manually modified roles.

INSERT INTO public.role_skill_templates (role_name, required_skills)
VALUES 
  -- FRONTEND & UI
  ('UI Engineer', '["HTML", "CSS", "JavaScript", "React", "Figma", "Tailwind CSS", "Accessibility (a11y)", "Web Animations", "Storybook", "Responsive Design"]'::jsonb),
  ('React Developer', '["React", "JavaScript", "TypeScript", "Redux/Zustand", "React Query", "Next.js", "Jest/React Testing Library", "CSS/SCSS", "Git", "REST/GraphQL"]'::jsonb),
  ('Angular Developer', '["Angular", "TypeScript", "RxJS", "NgRx", "HTML", "CSS", "Jasmine", "Karma", "Git", "REST APIs"]'::jsonb),
  ('Vue Developer', '["Vue.js", "JavaScript", "TypeScript", "Vuex/Pinia", "Nuxt.js", "CSS", "HTML", "Git", "Vite", "REST APIs"]'::jsonb),
  ('Frontend Architect', '["System Design", "Micro-frontends", "Web Performance Optimization", "TypeScript", "React/Angular/Vue", "CI/CD", "Testing Strategy", "Accessibility", "Web Security", "State Management"]'::jsonb),

  -- BACKEND & API
  ('Go Developer', '["Go (Golang)", "Concurrency (Goroutines)", "REST/gRPC", "PostgreSQL", "Docker", "Kubernetes", "Linux", "Git", "Microservices", "Redis"]'::jsonb),
  ('Ruby on Rails Developer', '["Ruby", "Ruby on Rails", "PostgreSQL", "RSpec", "Redis", "Sidekiq", "HTML/CSS", "JavaScript", "Git", "Heroku/AWS"]'::jsonb),
  ('PHP Developer', '["PHP", "Laravel/Symfony", "MySQL", "JavaScript", "HTML/CSS", "Git", "REST APIs", "Docker", "PHPUnit", "Composer"]'::jsonb),
  ('Backend Architect', '["System Design", "Microservices", "Database Design", "Caching (Redis)", "Message Queues (Kafka/RabbitMQ)", "API Design (GraphQL/gRPC)", "Docker/Kubernetes", "AWS/GCP", "Security", "High Availability"]'::jsonb),
  ('C# / .NET Developer', '["C#", ".NET Core", "ASP.NET", "Entity Framework", "SQL Server", "Azure", "REST APIs", "Git", "xUnit/NUnit", "Microservices"]'::jsonb),
  ('C++ Developer', '["C++", "STL", "Memory Management", "Multithreading", "Algorithms", "Data Structures", "Linux", "Git", "CMake", "GDB"]'::jsonb),

  -- MOBILE
  ('iOS Developer', '["Swift", "SwiftUI", "UIKit", "Core Data", "Grand Central Dispatch (GCD)", "Git", "REST APIs", "XCTest", "CocoaPods/SPM", "App Store Connect"]'::jsonb),
  ('React Native Developer', '["React Native", "JavaScript", "TypeScript", "Redux", "React Navigation", "iOS/Android Build Process", "Git", "REST APIs", "Expo", "Jest"]'::jsonb),
  ('Flutter Developer', '["Dart", "Flutter", "Widget Tree", "State Management (Provider/Riverpod)", "REST APIs", "Firebase", "Git", "iOS/Android Build", "Animations", "Testing"]'::jsonb),
  ('Mobile Architect', '["Mobile System Design", "Swift/Kotlin", "Cross-Platform Strategy", "App Security", "CI/CD for Mobile", "Offline Storage", "Performance Optimization", "Push Notifications", "App Architecture (MVVM/VIPER)", "Testing Strategy"]'::jsonb),

  -- DATA & AI/ML
  ('Data Engineer', '["Python", "SQL", "Apache Spark", "Airflow", "Kafka", "Data Modeling", "ETL/ELT", "AWS/GCP/Azure", "Snowflake/BigQuery", "Docker"]'::jsonb),
  ('NLP Engineer', '["Python", "NLP", "Transformers (Hugging Face)", "PyTorch/TensorFlow", "spaCy", "NLTK", "Machine Learning", "LLMs", "Vector Databases", "SQL"]'::jsonb),
  ('Computer Vision Engineer', '["Python", "OpenCV", "PyTorch/TensorFlow", "CNNs", "Image Processing", "Deep Learning", "C++", "CUDA", "Machine Learning", "Git"]'::jsonb),
  ('MLOps Engineer', '["Python", "Docker", "Kubernetes", "MLflow", "CI/CD", "AWS/GCP/Azure", "Model Deployment", "Terraform", "Monitoring", "Git"]'::jsonb),
  ('Prompt Engineer', '["Prompt Engineering", "Large Language Models (LLMs)", "Python", "LangChain / LlamaIndex", "Vector Databases", "API Integration", "Creative Problem Solving", "NLP Basics", "Data Analysis", "Git"]'::jsonb),
  ('Data Architect', '["Data Modeling", "Data Warehousing", "Data Lakes", "SQL", "Apache Spark", "AWS/GCP/Azure", "Data Governance", "ETL Architecture", "Big Data", "System Design"]'::jsonb),
  ('AI Research Scientist', '["Machine Learning", "Deep Learning", "PyTorch/TensorFlow", "Mathematics (Linear Algebra/Calculus)", "Statistics", "Python", "Research Methodology", "NLP/Computer Vision", "Algorithm Design", "Data Analysis"]'::jsonb),

  -- CLOUD & DEVOPS
  ('Site Reliability Engineer (SRE)', '["Linux", "Python/Go", "Kubernetes", "Docker", "Monitoring (Prometheus/Grafana)", "Incident Response", "Terraform", "CI/CD", "Networking", "AWS/GCP"]'::jsonb),
  ('Platform Engineer', '["Kubernetes", "Docker", "Terraform", "Go/Python", "CI/CD Pipeline Design", "AWS/GCP", "Linux", "Developer Experience (DevEx)", "Infrastructure as Code", "Networking"]'::jsonb),
  ('Kubernetes Administrator', '["Kubernetes", "Docker", "Linux", "Helm", "Networking (CNI)", "Storage (CSI)", "Security (RBAC)", "Monitoring", "AWS EKS / GKE", "Troubleshooting"]'::jsonb),
  ('Cloud Architect', '["AWS/GCP/Azure", "System Design", "Microservices", "Infrastructure as Code (Terraform)", "Cloud Security", "Cost Optimization", "Networking", "Serverless", "Kubernetes", "CI/CD"]'::jsonb),

  -- SECURITY & QA
  ('QA Automation Engineer', '["JavaScript/Python/Java", "Selenium/Cypress/Playwright", "API Testing (Postman)", "CI/CD Integration", "Test Planning", "Git", "Appium", "SQL", "Agile Methodology", "Bug Tracking"]'::jsonb),
  ('Penetration Tester', '["Ethical Hacking", "Kali Linux", "Network Security", "Web App Security (OWASP)", "Burp Suite", "Metasploit", "Python/Bash", "Vulnerability Assessment", "Cryptography", "Report Writing"]'::jsonb),
  ('AppSec Engineer', '["Web App Security", "OWASP Top 10", "SAST/DAST", "Threat Modeling", "Code Review", "Python/Go", "Cryptography", "CI/CD Security", "Penetration Testing", "Cloud Security"]'::jsonb),
  ('Security Analyst', '["SIEM (Splunk/ELK)", "Incident Response", "Network Security", "Threat Intelligence", "Vulnerability Management", "Linux/Windows Security", "Firewalls", "Malware Analysis", "Wireshark", "Python"]'::jsonb),

  -- SPECIALIZED & OTHER
  ('Blockchain Developer', '["Solidity", "Smart Contracts", "Ethereum/Web3", "JavaScript/TypeScript", "Cryptography", "Rust/Go", "Hardhat/Truffle", "DeFi", "Git", "Node.js"]'::jsonb),
  ('Game Developer (Unity)', '["Unity 3D", "C#", "Game Physics", "3D Math", "Game Design", "Animation", "UI Implementation", "Git", "Performance Optimization", "Shaders"]'::jsonb),
  ('Game Developer (Unreal)', '["Unreal Engine", "C++", "Blueprints", "3D Math", "Game Physics", "Animation", "Git", "Performance Optimization", "Shaders", "Multiplayer Networking"]'::jsonb),
  ('Embedded Systems Engineer', '["C", "C++", "Microcontrollers", "RTOS", "Hardware Debugging", "Assembly", "IoT", "Linux Kernel", "Git", "Circuit Design Basics"]'::jsonb),
  ('Web3 Engineer', '["Web3.js / Ethers.js", "React", "TypeScript", "Solidity", "Smart Contracts", "Node.js", "Decentralized Apps (dApps)", "Cryptography", "Git", "IPFS"]'::jsonb),
  ('Salesforce Developer', '["Apex", "Lightning Web Components (LWC)", "Visualforce", "SOQL/SOSL", "Salesforce CRM", "JavaScript", "REST/SOAP APIs", "Git", "Salesforce Admin Basics", "Data Migration"]'::jsonb),
  ('Systems Administrator', '["Linux/Unix", "Windows Server", "Active Directory", "Networking (TCP/IP, DNS)", "Bash/PowerShell", "Virtualization (VMware)", "Cloud (AWS/Azure)", "Security Basics", "Backup/Recovery", "Hardware Troubleshooting"]'::jsonb),
  ('Tech Lead', '["System Design", "Agile Methodology", "Mentorship", "Code Review", "Project Management", "Architecture", "Communication", "Software Engineering", "Cloud Computing", "CI/CD"]'::jsonb)
  
ON CONFLICT (role_name) DO NOTHING;
