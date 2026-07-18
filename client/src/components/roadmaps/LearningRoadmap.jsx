import { useState, forwardRef, useImperativeHandle } from "react";
import { Maximize2, Minimize2, CheckCircle2, CircleDashed, Circle, ChevronDown, ChevronUp, Lock, Monitor, Layout, FileJson, Database, Rocket, ExternalLink } from "lucide-react";
import html2pdf from 'html2pdf.js';

const LearningRoadmap = forwardRef((props, ref) => {
  const [expandedPhases, setExpandedPhases] = useState([]);

  useImperativeHandle(ref, () => ({
    generatePdf: async () => {
      // Expand all 5 phases
      setExpandedPhases([0, 1, 2, 3, 4]);
      
      // Wait for React to render the expanded DOM
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const element = document.getElementById('pdf-roadmap-container');
      const opt = {
        margin:       [0.5, 0.5],
        filename:     'CareerPilot_Roadmap.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
        enableLinks:  true
      };
      
      html2pdf().set(opt).from(element).save();
    }
  }));

  const PHASES = [
    {
      num: 1,
      title: "Fundamentals",
      desc: "Build strong programming fundamentals.",
      status: "Completed",
      statusColor: "text-emerald-400 border-emerald-500/30",
      icon: Monitor,
      iconColor: "text-emerald-400 bg-emerald-500/10",
      themeColor: "bg-emerald-500",
      skills: ["HTML", "CSS", "JavaScript", "Git & GitHub", "Responsive Design"],
      progress: 100,
      tasks: "10 / 10 Tasks",
      progressIcon: CheckCircle2,
      progressColor: "text-emerald-500",
      topics: [
        { id: "1-1", name: "Internet Basics (DNS, HTTP)", completed: true, resource: { text: "MDN Docs", link: "https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/How_does_the_Internet_work" } },
        { id: "1-2", name: "Semantic HTML & Accessibility", completed: true, resource: { text: "MDN HTML", link: "https://developer.mozilla.org/en-US/docs/Learn/HTML" } },
        { id: "1-3", name: "CSS Basics & Selectors", completed: true, resource: { text: "MDN CSS", link: "https://developer.mozilla.org/en-US/docs/Learn/CSS" } },
        { id: "1-4", name: "CSS Flexbox Layout", completed: true, resource: { text: "CSS-Tricks", link: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/" } },
        { id: "1-5", name: "CSS Grid Layout", completed: true, resource: { text: "CSS-Tricks", link: "https://css-tricks.com/snippets/css/complete-guide-grid/" } },
        { id: "1-6", name: "Responsive Web Design", completed: true, resource: { text: "web.dev", link: "https://web.dev/learn/design/" } },
        { id: "1-7", name: "JavaScript Basics & DOM", completed: true, resource: { text: "JavaScript.info", link: "https://javascript.info/" } },
        { id: "1-8", name: "JavaScript ES6+ Features", completed: true, resource: { text: "FreeCodeCamp", link: "https://www.freecodecamp.org/news/javascript-es6-crash-course/" } },
        { id: "1-9", name: "Version Control with Git", completed: true, resource: { text: "Git SCM", link: "https://git-scm.com/book/en/v2" } },
        { id: "1-10", name: "GitHub & Collaboration", completed: true, resource: { text: "GitHub Docs", link: "https://docs.github.com/en/get-started" } }
      ]
    },
    {
      num: 2,
      title: "Frontend Development",
      desc: "Learn modern frontend libraries and frameworks.",
      status: "In Progress",
      statusColor: "text-blue-400 border-blue-500/30",
      icon: Layout,
      iconColor: "text-blue-400 bg-blue-500/10",
      themeColor: "bg-blue-500",
      skills: ["React", "Redux", "Tailwind CSS", "Routing", "State Management"],
      progress: 60,
      tasks: "6 / 10 Tasks",
      progressIcon: CircleDashed,
      progressColor: "text-blue-500",
      topics: [
        { id: "2-1", name: "React Components & JSX", completed: true, resource: { text: "React Docs", link: "https://react.dev/learn/describing-the-ui" } },
        { id: "2-2", name: "React State & Props", completed: true, resource: { text: "React Docs", link: "https://react.dev/learn/adding-interactivity" } },
        { id: "2-3", name: "React Hooks (useState, useEffect)", completed: true, resource: { text: "React Reference", link: "https://react.dev/reference/react" } },
        { id: "2-4", name: "Advanced Hooks (useMemo, useCallback)", completed: true, resource: { text: "React Docs", link: "https://react.dev/learn/reusing-logic-with-custom-hooks" } },
        { id: "2-5", name: "Client-side Routing (React Router)", completed: true, resource: { text: "React Router", link: "https://reactrouter.com/en/main" } },
        { id: "2-6", name: "Global State Management (Redux)", completed: true, resource: { text: "Redux Docs", link: "https://redux-toolkit.js.org/" } },
        { id: "2-7", name: "API Fetching & React Query", completed: false, resource: { text: "TanStack", link: "https://tanstack.com/query/latest" } },
        { id: "2-8", name: "Tailwind CSS & Styling", completed: false, resource: { text: "Tailwind", link: "https://tailwindcss.com/docs" } },
        { id: "2-9", name: "Component Libraries (Shadcn/MUI)", completed: false, resource: { text: "Shadcn UI", link: "https://ui.shadcn.com/" } },
        { id: "2-10", name: "Frontend Testing (Jest/RTL)", completed: false, resource: { text: "Testing Lib", link: "https://testing-library.com/docs/react-testing-library/intro/" } }
      ]
    },
    {
      num: 3,
      title: "Backend Development",
      desc: "Master server-side development and databases.",
      status: "In Progress",
      statusColor: "text-orange-400 border-orange-500/30",
      icon: FileJson,
      iconColor: "text-orange-400 bg-orange-500/10",
      themeColor: "bg-orange-500",
      skills: ["Node.js", "Express.js", "REST APIs", "MongoDB", "Authentication"],
      progress: 30,
      tasks: "3 / 10 Tasks",
      progressIcon: CircleDashed,
      progressColor: "text-orange-500",
      topics: [
        { id: "3-1", name: "Node.js Fundamentals & Event Loop", completed: true, resource: { text: "Node.js Docs", link: "https://nodejs.dev/learn" } },
        { id: "3-2", name: "NPM & Package Management", completed: true, resource: { text: "NPM Docs", link: "https://docs.npmjs.com/" } },
        { id: "3-3", name: "Building REST APIs with Express.js", completed: true, resource: { text: "Express Docs", link: "https://expressjs.com/" } },
        { id: "3-4", name: "Middleware & Error Handling", completed: false, resource: { text: "Express Guide", link: "https://expressjs.com/en/guide/error-handling.html" } },
        { id: "3-5", name: "Relational Databases (PostgreSQL)", completed: false, resource: { text: "PostgreSQL Docs", link: "https://www.postgresql.org/docs/" } },
        { id: "3-6", name: "NoSQL Databases (MongoDB)", completed: false, resource: { text: "MongoDB", link: "https://www.mongodb.com/docs/" } },
        { id: "3-7", name: "Object Relational Mapping (Prisma)", completed: false, resource: { text: "Prisma Docs", link: "https://www.prisma.io/docs" } },
        { id: "3-8", name: "Authentication & JWT", completed: false, resource: { text: "JWT.io", link: "https://jwt.io/introduction" } },
        { id: "3-9", name: "WebSockets & Real-time Communication", completed: false, resource: { text: "Socket.IO", link: "https://socket.io/docs/v4/" } },
        { id: "3-10", name: "Backend Testing (Mocha/Jest)", completed: false, resource: { text: "Jest Docs", link: "https://jestjs.io/docs/getting-started" } }
      ]
    },
    {
      num: 4,
      title: "Databases & DevOps",
      desc: "Work with databases and deploy applications.",
      status: "Pending",
      statusColor: "text-slate-500 dark:text-gray-400 border-gray-500/30",
      icon: Database,
      iconColor: "text-purple-400 bg-purple-500/10",
      themeColor: "bg-purple-500",
      skills: ["SQL", "MongoDB", "Docker", "CI/CD", "AWS Basics"],
      progress: 0,
      tasks: "0 / 8 Tasks",
      progressIcon: Circle,
      progressColor: "text-slate-400 dark:text-gray-500",
      topics: [
        { id: "4-1", name: "Containerization with Docker", completed: false, resource: { text: "Docker Docs", link: "https://docs.docker.com/get-started/" } },
        { id: "4-2", name: "Multi-container Apps with Docker Compose", completed: false, resource: { text: "Docker Compose", link: "https://docs.docker.com/compose/" } },
        { id: "4-3", name: "CI/CD Pipelines (GitHub Actions)", completed: false, resource: { text: "GitHub Actions", link: "https://docs.github.com/en/actions" } },
        { id: "4-4", name: "Cloud Computing Basics (AWS/GCP)", completed: false, resource: { text: "AWS Basics", link: "https://aws.amazon.com/getting-started/" } },
        { id: "4-5", name: "Deploying Serverless Functions", completed: false, resource: { text: "Vercel Docs", link: "https://vercel.com/docs/functions" } },
        { id: "4-6", name: "NGINX & Reverse Proxies", completed: false, resource: { text: "NGINX Guide", link: "https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/" } },
        { id: "4-7", name: "Monitoring & Logging", completed: false, resource: { text: "Datadog", link: "https://datadoghq.com/" } },
        { id: "4-8", name: "Infrastructure as Code (Terraform)", completed: false, resource: { text: "Terraform Docs", link: "https://developer.hashicorp.com/terraform/intro" } }
      ]
    },
    {
      num: 5,
      title: "Projects & Career Prep",
      desc: "Build projects and prepare for interviews.",
      status: "Pending",
      statusColor: "text-slate-500 dark:text-gray-400 border-gray-500/30",
      icon: Rocket,
      iconColor: "text-purple-400 bg-purple-500/10",
      themeColor: "bg-purple-500",
      skills: ["Full Stack Projects", "System Design", "DSA", "Mock Interviews"],
      progress: 0,
      tasks: "0 / 8 Tasks",
      progressIcon: Circle,
      progressColor: "text-slate-400 dark:text-gray-500",
      topics: [
        { id: "5-1", name: "Build a Full-Stack E-commerce App", completed: false, resource: { text: "YouTube Tutorial", link: "https://www.youtube.com/results?search_query=full+stack+ecommerce+tutorial" } },
        { id: "5-2", name: "Build a Real-time Chat Application", completed: false, resource: { text: "Socket.IO Guide", link: "https://socket.io/get-started/chat" } },
        { id: "5-3", name: "System Design Fundamentals", completed: false, resource: { text: "System Design Primer", link: "https://github.com/donnemartin/system-design-primer" } },
        { id: "5-4", name: "Data Structures (Arrays, Trees, Graphs)", completed: false, resource: { text: "LeetCode Explore", link: "https://leetcode.com/explore/learn/" } },
        { id: "5-5", name: "Algorithms (Sorting, Searching, DP)", completed: false, resource: { text: "LeetCode Explore", link: "https://leetcode.com/explore/learn/" } },
        { id: "5-6", name: "Open Source Contributions", completed: false, resource: { text: "OS Guide", link: "https://opensource.guide/how-to-contribute/" } },
        { id: "5-7", name: "Resume Building & Portfolio", completed: false, resource: { text: "Novoresume Blog", link: "https://novoresume.com/career-blog/web-developer-resume" } },
        { id: "5-8", name: "Mock Interviews & Behavioral Prep", completed: false, resource: { text: "Pramp", link: "https://www.pramp.com/" } }
      ]
    }
  ];

  const handleExpandAll = () => setExpandedPhases(PHASES.map((_, i) => i));
  const handleCollapseAll = () => setExpandedPhases([]);
  
  const togglePhase = (idx) => {
    setExpandedPhases(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div id="pdf-roadmap-container" className="flex flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a] p-6 shadow-lg h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-white/5">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Learning Roadmap</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleExpandAll}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            <Maximize2 className="h-4 w-4" /> Expand All
          </button>
          <button 
            onClick={handleCollapseAll}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            <Minimize2 className="h-4 w-4" /> Collapse All
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1">
        {PHASES.map((phase, idx) => {
          const isExpanded = expandedPhases.includes(idx);
          
          return (
            <div key={idx} className="relative flex gap-6 pb-8 last:pb-2">
              
              {/* Timeline Line & Circle */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-medium text-slate-400 dark:text-gray-500 mb-2">Phase {phase.num}</span>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-slate-900 dark:text-white shadow-lg z-10 ${phase.themeColor}`}>
                  {phase.num}
                </div>
                {idx < PHASES.length - 1 && (
                  <div className="w-px flex-1 border-l border-dashed border-slate-300 dark:border-white/20 mt-2 mb-1" />
                )}
              </div>

              {/* Content Card */}
              <div className="flex-1 flex flex-col rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] p-5 hover:bg-white dark:bg-white/[0.02] transition-colors mt-6">
                
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${phase.iconColor}`}>
                    <phase.icon className="h-6 w-6" />
                  </div>

                  {/* Text Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{phase.title}</h3>
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${phase.statusColor}`}>
                        {phase.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mb-4">{phase.desc}</p>
                    
                    {/* Skills */}
                    <div className="flex flex-wrap gap-2">
                      {phase.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="rounded-md border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 px-2 py-1 text-xs font-medium text-slate-600 dark:text-gray-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Progress & Toggle */}
                  <div className="flex flex-col items-end gap-3 shrink-0 ml-4">
                    <div className="flex items-center gap-2">
                      <phase.progressIcon className={`h-5 w-5 ${phase.progressColor}`} />
                      <span className="text-lg font-bold text-slate-900 dark:text-white">{phase.progress}%</span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-gray-400">{phase.tasks}</span>
                    <button 
                      onClick={() => togglePhase(idx)}
                      className="mt-4 text-slate-400 dark:text-gray-500 hover:text-slate-900 dark:text-white transition-colors cursor-pointer p-1"
                    >
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Topics Accordion */}
                <div className={`mt-6 pt-5 border-t border-slate-200 dark:border-white/5 flex-col gap-3 animation-fade-in ${isExpanded ? 'flex' : 'hidden print:flex'}`}>
                  {phase.topics.map(topic => (
                    <div key={topic.id} className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 hover:border-violet-500/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 bg-transparent cursor-pointer print:hidden" 
                          defaultChecked={topic.completed} 
                        />
                        <span className={`text-sm font-semibold ${topic.completed ? 'text-slate-500 dark:text-gray-500' : 'text-slate-700 dark:text-gray-200'} print:text-black`}>
                          {topic.name}
                        </span>
                      </div>
                      <a href={topic.resource.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-violet-500 hover:text-violet-400 bg-violet-50 dark:bg-violet-500/10 px-3 py-1.5 rounded-lg transition-colors print:text-violet-700">
                        {topic.resource.text} <ExternalLink className="h-3 w-3 print:hidden" />
                      </a>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          );
        })}
      </div>
      
    </div>
  );
});

export default LearningRoadmap;
