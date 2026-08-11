<div align="center">
  <h1>CareerPilot</h1>
  <p><strong>AI-Powered Career Development & Interview Preparation Platform</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" />
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white" alt="Gemini AI" />
  </p>
</div>

<br />

## 📖 Overview
**CareerPilot** is an intelligent, end-to-end career ecosystem designed to bridge the gap between job seekers and their target roles. By leveraging Generative AI, CareerPilot analyzes resumes, identifies precise skill gaps, generates dynamic learning roadmaps, and conducts highly realistic mock interviews.

Whether you're looking to transition careers or ace your next technical interview, CareerPilot provides the data-driven insights and practice you need.

---

## ✨ Key Features

- 📄 **Resume Parsing & ATS Scoring**: Upload your PDF resume to receive an objective ATS compatibility score and precise skill extraction using AI.
- 🎯 **Skill Gap Analysis**: Discover exactly what skills you're missing for your target role and get an actionable plan to acquire them.
- 🗺️ **Dynamic Learning Roadmaps**: Generate phase-by-phase learning paths complete with estimated hours, tasks, and free resource links.
- 🎤 **Interactive Mock Interviews**: Practice adaptive technical and behavioral interviews with real-time scoring, confidence metrics, and constructive feedback.
- 📊 **Career Insights**: Access data-driven salary insights, company hiring trends, and personalized career matchmaking.
- 🤖 **AI Career Advisor**: Chat instantly with a specialized AI assistant to resolve your career doubts.

---

## 🛠️ Technology Stack

### Frontend
- **React (Vite)**: Lightning-fast, component-based user interface.
- **Tailwind CSS**: Utility-first styling for a sleek, modern, and fully responsive design.
- **Framer Motion**: Smooth, professional micro-interactions and animations.
- **Lucide React**: Clean and consistent iconography.

### Backend
- **Node.js & Express.js**: Robust, scalable RESTful API architecture.
- **Supabase**: Open-source PostgreSQL database and secure user authentication.
- **Zod**: Strict schema validation to ensure absolute data integrity.
- **PDF-Parse**: Server-side resume extraction.

### Artificial Intelligence
- **Google Gemini API / Groq API**: Advanced Large Language Models orchestrated with strict JSON structured outputs to generate consistent learning paths and evaluations.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Supabase Project (Database URL & Anon Key)
- Gemini API Key / Groq API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/CareerPilot.git
   cd CareerPilot
   ```

2. **Setup the Backend**
   ```bash
   cd server
   npm install
   ```
   *Create a `.env` file in the `server` directory with your `PORT`, `SUPABASE_URL`, `SUPABASE_KEY`, and `GEMINI_API_KEY`.*
   ```bash
   npm start
   ```

3. **Setup the Frontend**
   ```bash
   cd ../client
   npm install
   ```
   *Create a `.env` file in the `client` directory with your Supabase keys (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).*
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to start exploring CareerPilot!

---

## 📂 Project Structure

```text
CareerPilot/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components (Auth, Dash, Roadmaps, Interviews)
│   │   ├── pages/          # Main application views
│   │   ├── lib/            # Utilities and Supabase client
│   │   └── App.jsx         # Root component and Routing
│   └── package.json
└── server/                 # Node.js/Express Backend
    ├── controllers/        # Route logic and request handling
    ├── database/           # SQL migration scripts (Phases 1-13)
    ├── routes/             # Express API routing definitions
    ├── schemas/            # Zod validation schemas
    ├── services/           # Core business logic and AI Orchestrator
    └── index.js            # Server entry point
```
