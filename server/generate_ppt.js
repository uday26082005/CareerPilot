const PptxGenJS = require("pptxgenjs");

let pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_16x9';

// Define Master Slide for consistent styling
pptx.defineSlideMaster({
  title: "MASTER_SLIDE",
  background: { color: "F8F9FA" }, // Off-white
  objects: [
    { rect: { x: 0, y: 0, w: "100%", h: 0.5, fill: { color: "1E293B" } } }, // Dark navy top bar
    { rect: { x: 0, y: 5.4, w: "100%", h: 0.25, fill: { color: "8B5CF6" } } }, // Subtle violet bottom accent
    { text: { text: "CareerPilot", options: { x: 0.5, y: 5.42, w: 2, h: 0.2, color: "FFFFFF", fontSize: 10, fontFace: "Arial" } } },
  ]
});

const theme = {
  primary: "1E293B", // Dark navy/slate-800
  accent: "8B5CF6", // Violet-500
  text: "334155", // Slate-700
  bg: "FFFFFF",
};

// ---------------------------------------------------------
// 1. Guide-Signed First Slide
// ---------------------------------------------------------
let slide1 = pptx.addSlide();
slide1.background = { color: "1E293B" };
slide1.addText("CareerPilot", { x: 1, y: 1.5, w: 8, fontSize: 44, bold: true, color: "FFFFFF", align: "center", fontFace: "Arial Black" });
slide1.addText("AI-Powered Career Development & Interview Platform", { x: 1, y: 2.3, w: 8, fontSize: 20, color: "E2E8F0", align: "center", fontFace: "Arial" });
slide1.addShape(pptx.shapes.RECTANGLE, { x: 3, y: 3.2, w: 4, h: 2, fill: { color: "334155" }, line: { type: "dash", color: "94A3B8" } });
slide1.addText("[ PLACEHOLDER FOR SCANNED GUIDE-SIGNED APPROVAL ]", { x: 3, y: 3.2, w: 4, h: 2, fontSize: 12, color: "94A3B8", align: "center", fontFace: "Arial" });

// Helper for title
const addSlideTitle = (slide, title) => {
  slide.addText(title, { x: 0.5, y: 0.6, w: 9, fontSize: 32, bold: true, color: theme.primary, fontFace: "Arial Black" });
  slide.addShape(pptx.shapes.LINE, { x: 0.5, y: 1.2, w: 8.5, h: 0, line: { color: theme.accent, width: 2 } });
};

// ---------------------------------------------------------
// 2. Introduction
// ---------------------------------------------------------
let slide2 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
addSlideTitle(slide2, "2. Introduction");
slide2.addText([
  { text: "What is CareerPilot?\n", options: { bold: true, fontSize: 20, color: theme.accent, breakLine: true } },
  { text: "An intelligent career ecosystem that uses Generative AI to guide users from skill analysis to job readiness.\n\n", options: { fontSize: 16, color: theme.text, breakLine: true } },
  
  { text: "Context & Background\n", options: { bold: true, fontSize: 20, color: theme.accent, breakLine: true } },
  { text: "Job seekers struggle with generic advice, unaware of their specific skill gaps or how to navigate technical interviews for their target roles.\n\n", options: { fontSize: 16, color: theme.text, breakLine: true } },
  
  { text: "Primary Goal\n", options: { bold: true, fontSize: 20, color: theme.accent, breakLine: true } },
  { text: "To provide a centralized platform for resume parsing, personalized learning roadmaps, and adaptive AI mock interviews.", options: { fontSize: 16, color: theme.text } }
], { x: 0.5, y: 1.5, w: 9, h: 3.5, fontFace: "Arial" });

// ---------------------------------------------------------
// 3. Problem Statement
// ---------------------------------------------------------
let slide3 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
addSlideTitle(slide3, "3. Problem Statement");

slide3.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 1.6, w: 4.2, h: 1.2, fill: { color: "F1F5F9" }, roundness: 10 });
slide3.addText("Generic Career Advice", { x: 0.6, y: 1.7, w: 4, fontSize: 16, bold: true, color: theme.primary });
slide3.addText("Current platforms offer static, one-size-fits-all roadmaps regardless of the user's existing resume or background.", { x: 0.6, y: 2.0, w: 4, fontSize: 12, color: theme.text });

slide3.addShape(pptx.shapes.RECTANGLE, { x: 5.0, y: 1.6, w: 4.2, h: 1.2, fill: { color: "F1F5F9" }, roundness: 10 });
slide3.addText("Lack of Real Interview Practice", { x: 5.1, y: 1.7, w: 4, fontSize: 16, bold: true, color: theme.primary });
slide3.addText("Students memorize answers rather than experiencing dynamic, adaptive interview scenarios with immediate technical feedback.", { x: 5.1, y: 2.0, w: 4, fontSize: 12, color: theme.text });

slide3.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 3.0, w: 4.2, h: 1.2, fill: { color: "F1F5F9" }, roundness: 10 });
slide3.addText("The Feedback Gap", { x: 0.6, y: 3.1, w: 4, fontSize: 16, bold: true, color: theme.primary });
slide3.addText("Resumes are often rejected by ATS systems without the applicant knowing exactly what skills they are missing.", { x: 0.6, y: 3.4, w: 4, fontSize: 12, color: theme.text });

slide3.addShape(pptx.shapes.RECTANGLE, { x: 5.0, y: 3.0, w: 4.2, h: 1.2, fill: { color: "EEF2FF" }, roundness: 10, line: { color: theme.accent, width: 1 } });
slide3.addText("The CareerPilot Solution", { x: 5.1, y: 3.1, w: 4, fontSize: 16, bold: true, color: theme.accent });
slide3.addText("A closed-loop system: Analyze Resume → Identify Skill Gaps → Generate Learning Roadmap → Practice via Mock Interviews.", { x: 5.1, y: 3.4, w: 4, fontSize: 12, color: theme.primary });

// ---------------------------------------------------------
// 4. Objectives
// ---------------------------------------------------------
let slide4 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
addSlideTitle(slide4, "4. Objectives");

slide4.addText([
  { text: "1. Automated Resume Parsing & Analysis: ", options: { bold: true, color: theme.accent } },
  { text: "To extract skills and evaluate ATS compatibility using Gemini AI.\n\n" },
  
  { text: "2. Personalized Skill Gap Identification: ", options: { bold: true, color: theme.accent } },
  { text: "To contrast current skills against target roles and generate actionable improvement plans.\n\n" },
  
  { text: "3. Dynamic Learning Roadmaps: ", options: { bold: true, color: theme.accent } },
  { text: "To structure phase-by-phase learning paths with estimated hours and free resources.\n\n" },
  
  { text: "4. Interactive Mock Interviews: ", options: { bold: true, color: theme.accent } },
  { text: "To simulate adaptive technical/behavioral interviews with real-time scoring and feedback.\n\n" },
  
  { text: "5. Career & Market Insights: ", options: { bold: true, color: theme.accent } },
  { text: "To provide data-driven salary insights and company hiring trends." }
], { x: 0.8, y: 1.5, w: 8.5, fontSize: 16, color: theme.text, fontFace: "Arial", bullet: true });

// ---------------------------------------------------------
// 5. Proposed Methodology
// ---------------------------------------------------------
let slide5 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
addSlideTitle(slide5, "5. Proposed Methodology & Architecture");

// User
slide5.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 2.5, w: 1.5, h: 0.8, fill: { color: theme.primary }, align: "center", color: "FFFFFF", fontFace: "Arial Black" });
slide5.addText("User / Client\n(React UI)", { x: 0.5, y: 2.5, w: 1.5, h: 0.8, align: "center", color: "FFFFFF", fontSize: 12 });

slide5.addShape(pptx.shapes.RIGHT_ARROW, { x: 2.1, y: 2.7, w: 0.6, h: 0.3, fill: { color: theme.accent } });

// Backend
slide5.addShape(pptx.shapes.RECTANGLE, { x: 2.8, y: 2.5, w: 1.8, h: 0.8, fill: { color: "F8FAFC" }, line: { color: theme.primary }, align: "center" });
slide5.addText("Express Backend\nAPI Gateway", { x: 2.8, y: 2.5, w: 1.8, h: 0.8, align: "center", color: theme.primary, fontSize: 12, bold: true });

slide5.addShape(pptx.shapes.RIGHT_ARROW, { x: 4.7, y: 2.7, w: 0.6, h: 0.3, fill: { color: theme.accent } });

// AI Orchestrator
slide5.addShape(pptx.shapes.RECTANGLE, { x: 5.4, y: 2.0, w: 1.8, h: 0.8, fill: { color: "EEF2FF" }, line: { color: theme.accent, width: 2 }, align: "center" });
slide5.addText("AI Orchestrator\n(Gemini Service)", { x: 5.4, y: 2.0, w: 1.8, h: 0.8, align: "center", color: theme.accent, fontSize: 12, bold: true });

slide5.addShape(pptx.shapes.LINE, { x: 6.3, y: 2.8, w: 0, h: 0.4, line: { color: theme.accent, width: 2, dashType: "dash" } });

// DB
slide5.addShape(pptx.shapes.RECTANGLE, { x: 5.4, y: 3.2, w: 1.8, h: 0.8, fill: { color: "F1F5F9" }, line: { color: theme.primary }, align: "center" });
slide5.addText("Supabase DB\n(PostgreSQL)", { x: 5.4, y: 3.2, w: 1.8, h: 0.8, align: "center", color: theme.primary, fontSize: 12, bold: true });

slide5.addShape(pptx.shapes.RIGHT_ARROW, { x: 7.3, y: 2.3, w: 0.6, h: 0.3, fill: { color: theme.accent } });

// Output
slide5.addShape(pptx.shapes.RECTANGLE, { x: 8.0, y: 2.0, w: 1.5, h: 0.8, fill: { color: "10B981" }, align: "center" });
slide5.addText("JSON Analysis,\nRoadmaps, Scores", { x: 8.0, y: 2.0, w: 1.5, h: 0.8, align: "center", color: "FFFFFF", fontSize: 12, bold: true });

slide5.addText("Core Workflow:", { x: 0.5, y: 4.2, w: 2, fontSize: 14, bold: true, color: theme.primary });
slide5.addText("1. PDF Resume Uploaded\n2. Backend validates & forwards to AI Orchestrator\n3. Gemini API extracts entities via strict Zod Schemas\n4. Data persists to Supabase\n5. Client renders adaptive UI based on JSON response", { x: 0.5, y: 4.5, w: 9, fontSize: 12, color: theme.text });

// ---------------------------------------------------------
// 6. Expected Outcomes
// ---------------------------------------------------------
let slide6 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
addSlideTitle(slide6, "6. Expected Outcomes");

slide6.addText([
  { text: "Highly Accurate ATS Scoring\n", options: { bold: true, fontSize: 18, color: theme.primary, breakLine: true } },
  { text: "Users will receive an objective ATS compatibility score based on real industry parameters.\n\n", options: { fontSize: 14, color: theme.text, breakLine: true } },

  { text: "Actionable Skill Gap Awareness\n", options: { bold: true, fontSize: 18, color: theme.primary, breakLine: true } },
  { text: "Identification of exactly which missing skills are holding the user back from their target roles.\n\n", options: { fontSize: 14, color: theme.text, breakLine: true } },

  { text: "Structured Learning (Roadmaps)\n", options: { bold: true, fontSize: 18, color: theme.primary, breakLine: true } },
  { text: "Generation of detailed, step-by-step learning tracks complete with free resource links and task tracking.\n\n", options: { fontSize: 14, color: theme.text, breakLine: true } },

  { text: "Interview Confidence\n", options: { bold: true, fontSize: 18, color: theme.primary, breakLine: true } },
  { text: "Through the Mock Interview system, users will practice adaptive questions and receive granular evaluation (technical, communication, and confidence scores).", options: { fontSize: 14, color: theme.text } }
], { x: 0.5, y: 1.5, w: 9, h: 3.5, fontFace: "Arial" });


// ---------------------------------------------------------
// 7. Tools / Technologies
// ---------------------------------------------------------
let slide7 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
addSlideTitle(slide7, "7. Technologies Used");

const createTechCard = (slide, x, y, title, techs) => {
  slide.addShape(pptx.shapes.RECTANGLE, { x, y, w: 2.6, h: 1.8, fill: { color: "F8FAFC" }, line: { color: "CBD5E1" }, roundness: 10 });
  slide.addText(title, { x, y: y+0.1, w: 2.6, fontSize: 16, bold: true, color: theme.accent, align: "center" });
  slide.addText(techs.join("\n"), { x, y: y+0.5, w: 2.6, fontSize: 14, color: theme.text, align: "center", bold: true });
};

createTechCard(slide7, 0.5, 1.5, "Frontend", ["React (Vite)", "Tailwind CSS", "Framer Motion", "Lucide Icons"]);
createTechCard(slide7, 3.7, 1.5, "Backend", ["Node.js", "Express.js", "Zod (Validation)", "PDF-Parse"]);
createTechCard(slide7, 6.9, 1.5, "Database", ["Supabase", "PostgreSQL", "JSONB Schemas"]);

createTechCard(slide7, 2.1, 3.5, "AI / Machine Learning", ["Google Gemini API", "Structured Outputs", "Generative Prompting"]);
createTechCard(slide7, 5.3, 3.5, "Dev Tools", ["Git / GitHub", "NPM", "VS Code"]);

// ---------------------------------------------------------
// 8. Project Timeline
// ---------------------------------------------------------
let slide8 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
addSlideTitle(slide8, "8. Project Timeline");

const timelineItems = [
  { phase: "Phase 1-2", title: "Architecture & DB Setup", desc: "Express setup, Supabase config, Schema design" },
  { phase: "Phase 3-4", title: "Auth & Profiles", desc: "User authentication, profile management, avatars" },
  { phase: "Phase 5-6", title: "Resume & Skill Gaps", desc: "PDF parsing, Gemini integration, ATS scoring" },
  { phase: "Phase 7-8", title: "Roadmaps & Interviews", desc: "AI-generated learning paths, adaptive Mock Interviews" },
  { phase: "Phase 9-13", title: "Insights & Final Polish", desc: "Practice Arena, Career Advisor, Advanced validation" }
];

timelineItems.forEach((item, idx) => {
  let yPos = 1.6 + (idx * 0.7);
  
  // Node
  slide8.addShape(pptx.shapes.OVAL, { x: 0.8, y: yPos + 0.1, w: 0.2, h: 0.2, fill: { color: theme.accent } });
  
  // Line (except last)
  if (idx < timelineItems.length - 1) {
    slide8.addShape(pptx.shapes.LINE, { x: 0.9, y: yPos + 0.3, w: 0, h: 0.5, line: { color: theme.accent, width: 2 } });
  }

  // Text
  slide8.addText(item.phase, { x: 1.2, y: yPos, w: 1.5, fontSize: 14, bold: true, color: theme.primary });
  slide8.addText(item.title, { x: 2.8, y: yPos, w: 3, fontSize: 14, bold: true, color: theme.accent });
  slide8.addText(item.desc, { x: 5.5, y: yPos, w: 4, fontSize: 12, color: theme.text });
});

// ---------------------------------------------------------
// 9. References
// ---------------------------------------------------------
let slide9 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
addSlideTitle(slide9, "9. References");

slide9.addText([
  { text: "[1] Groq / Google Gemini Documentation", options: { bold: true, color: theme.primary } },
  { text: ", \"Prompt Engineering & Structured Outputs for Generative AI Models,\" [Online]. Available: https://console.groq.com/docs.\n\n" },
  
  { text: "[2] Supabase & PostgreSQL Docs", options: { bold: true, color: theme.primary } },
  { text: ", \"Relational Database Design and JSONB Storage Implementations,\" [Online]. Available: https://supabase.com/docs.\n\n" },
  
  { text: "[3] Meta Open Source", options: { bold: true, color: theme.primary } },
  { text: ", \"React: A declarative, efficient, and flexible JavaScript library for building user interfaces,\" [Online]. Available: https://react.dev/.\n\n" },
  
  { text: "[4] Tailwind Labs", options: { bold: true, color: theme.primary } },
  { text: ", \"Tailwind CSS: Utility-First CSS Framework for Rapid UI Development,\" [Online]. Available: https://tailwindcss.com/.\n\n" },
  
  { text: "[5] Framer Motion", options: { bold: true, color: theme.primary } },
  { text: ", \"A production-ready motion library for React,\" [Online]. Available: https://www.framer.com/motion/." }
], { x: 0.8, y: 1.5, w: 8.5, fontSize: 13, color: theme.text, fontFace: "Arial" });

// Save the Presentation
pptx.writeFile({ fileName: "CareerPilot_Project_Presentation.pptx" }).then(() => {
    console.log("PPT generated successfully!");
}).catch(err => {
    console.error("Error generating PPT:", err);
});
