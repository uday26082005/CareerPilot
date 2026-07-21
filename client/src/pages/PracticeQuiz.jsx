import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, ChevronRight, HelpCircle, Code, Layers, Server, Database, Cloud, ArrowLeft, RefreshCw, Trophy, ArrowRight } from "lucide-react";

const TOPICS = [
  { id: "dsa", name: "Data Structures & Algorithms", icon: HelpCircle, count: 120, desc: "Master arrays, trees, graphs, and core algorithms." },
  { id: "frontend", name: "Frontend Development", icon: Code, count: 80, desc: "React, CSS, HTML, and browser fundamentals." },
  { id: "backend", name: "Backend Development", icon: Server, count: 95, desc: "Node.js, Express, APIs, and server architecture." },
  { id: "system_design", name: "System Design", icon: Layers, count: 50, desc: "Scalability, load balancing, and distributed systems." },
  { id: "databases", name: "Databases", icon: Database, count: 65, desc: "SQL, NoSQL, indexing, and normalization." },
  { id: "devops", name: "DevOps & Cloud", icon: Cloud, count: 40, desc: "AWS, Docker, CI/CD, and deployment strategies." },
];

// Helper removed since all questions are now original

const QUESTIONS = {
  dsa: [
    { text: "What is the worst-case time complexity of QuickSort?", options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"], correctAnswer: "O(n^2)" },
    { text: "Which data structure is typically used to implement a LRU Cache?", options: ["Array", "Hash Map + Doubly Linked List", "Queue", "Stack"], correctAnswer: "Hash Map + Doubly Linked List" },
    { text: "What does a topological sort apply to?", options: ["Directed Acyclic Graphs (DAG)", "Binary Trees", "Undirected Graphs", "Linked Lists"], correctAnswer: "Directed Acyclic Graphs (DAG)" },
    { text: "In a min-heap, the root node is always:", options: ["The largest element", "The smallest element", "The median element", "Empty"], correctAnswer: "The smallest element" },
    { text: "Which sorting algorithm is the fastest for nearly sorted data?", options: ["Merge Sort", "Quick Sort", "Insertion Sort", "Selection Sort"], correctAnswer: "Insertion Sort" },
    { text: "What is the time complexity of searching in a perfectly balanced Binary Search Tree?", options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"], correctAnswer: "O(log n)" },
    { text: "How do you detect a cycle in a linked list?", options: ["Floyd's Tortoise and Hare", "Binary Search", "Breadth First Search", "Dijkstra's Algorithm"], correctAnswer: "Floyd's Tortoise and Hare" },
    { text: "What is the primary advantage of a Trie over a Hash Map?", options: ["Uses less memory", "Faster prefix searches", "Easier to implement", "O(1) worst case lookup"], correctAnswer: "Faster prefix searches" },
    { text: "Dynamic programming relies on which two properties?", options: ["Greedy choice and optimal substructure", "Overlapping subproblems and optimal substructure", "Divide and conquer", "Recursion and iteration"], correctAnswer: "Overlapping subproblems and optimal substructure" },
    { text: "Which algorithm finds the shortest path in a weighted graph?", options: ["DFS", "BFS", "Dijkstra's Algorithm", "Kruskal's Algorithm"], correctAnswer: "Dijkstra's Algorithm" },
  ],
  frontend: [
    { text: "What does CSS stand for?", options: ["Computer Style Sheets", "Creative Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"], correctAnswer: "Cascading Style Sheets" },
    { text: "Which HTML element is used to specify a footer for a document or section?", options: ["<bottom>", "<footer>", "<section>", "<foot>"], correctAnswer: "<footer>" },
    { text: "In React, which hook is used to manage side effects?", options: ["useState", "useEffect", "useMemo", "useContext"], correctAnswer: "useEffect" },
    { text: "What is the default display value of a <div> element?", options: ["inline", "inline-block", "block", "flex"], correctAnswer: "block" },
    { text: "Which JavaScript method is used to serialize an object into a JSON string?", options: ["JSON.parse()", "JSON.stringify()", "JSON.serialize()", "Object.toString()"], correctAnswer: "JSON.stringify()" },
    { text: "What is the Virtual DOM in React?", options: ["A lightweight copy of the actual DOM", "A direct reference to the browser DOM", "A new HTML specification", "A CSS framework"], correctAnswer: "A lightweight copy of the actual DOM" },
    { text: "Which HTTP status code represents a 'Not Found' error?", options: ["200", "404", "500", "301"], correctAnswer: "404" },
    { text: "What does CORS stand for?", options: ["Cross-Origin Resource Sharing", "Cross-Origin Routing System", "Cascading Origin Resource System", "Computer Operated Routing Service"], correctAnswer: "Cross-Origin Resource Sharing" },
    { text: "Which of the following is NOT a valid CSS position property?", options: ["static", "absolute", "centered", "relative"], correctAnswer: "centered" },
    { text: "What does the 'box-sizing: border-box' CSS property do?", options: ["Hides the border", "Includes padding and border in the element's total width and height", "Adds a drop shadow", "Makes the element a perfect square"], correctAnswer: "Includes padding and border in the element's total width and height" }
  ],
  backend: [
    { text: "Which of the following is a popular Node.js web framework?", options: ["React", "Express", "Django", "Spring"], correctAnswer: "Express" },
    { text: "What is the purpose of middleware in Express.js?", options: ["To style the frontend", "To intercept and process requests before they reach the route handler", "To directly connect to the database", "To compile TypeScript"], correctAnswer: "To intercept and process requests before they reach the route handler" },
    { text: "Which of the following is NOT a valid HTTP method?", options: ["GET", "POST", "FETCH", "DELETE"], correctAnswer: "FETCH" },
    { text: "What does a JWT typically consist of?", options: ["Header, Payload, Signature", "Username, Password, Salt", "Token, Secret, API Key", "Session ID, Cookie, LocalStorage"], correctAnswer: "Header, Payload, Signature" },
    { text: "What is the primary purpose of a load balancer?", options: ["To encrypt data", "To distribute incoming network traffic across multiple servers", "To cache database queries", "To serve static files"], correctAnswer: "To distribute incoming network traffic across multiple servers" },
    { text: "In REST APIs, which method is typically used to update an existing resource completely?", options: ["POST", "PUT", "PATCH", "GET"], correctAnswer: "PUT" },
    { text: "What does the term 'stateless' mean in the context of REST?", options: ["The server keeps a continuous socket connection open", "Each request must contain all info needed to understand the request", "The API has no database", "The client cannot use cookies"], correctAnswer: "Each request must contain all info needed to understand the request" },
    { text: "Which Node.js core module is used to work with file systems?", options: ["path", "http", "fs", "os"], correctAnswer: "fs" },
    { text: "What is a webhook?", options: ["A spider web catching bugs", "A user-defined HTTP callback triggered by an event", "A new type of HTML anchor tag", "A database relationship"], correctAnswer: "A user-defined HTTP callback triggered by an event" },
    { text: "Which port does HTTP use by default?", options: ["443", "21", "22", "80"], correctAnswer: "80" }
  ],
  system_design: [
    { text: "What is horizontal scaling?", options: ["Adding more power (CPU, RAM) to an existing server", "Adding more servers to a system", "Using a faster database", "Caching data locally"], correctAnswer: "Adding more servers to a system" },
    { text: "What is the CAP theorem?", options: ["Consistency, Availability, Partition tolerance", "Compute, API, Performance", "Caching, Availability, Processing", "Consistency, Authorization, Privacy"], correctAnswer: "Consistency, Availability, Partition tolerance" },
    { text: "Which mechanism is used to improve read performance by storing copies of frequently accessed data?", options: ["Sharding", "Replication", "Caching", "Load Balancing"], correctAnswer: "Caching" },
    { text: "What is a CDN used for?", options: ["Storing relational data", "Distributing static content globally to reduce latency", "Executing serverless functions", "Managing user sessions"], correctAnswer: "Distributing static content globally to reduce latency" },
    { text: "What is Sharding in databases?", options: ["Partitioning data horizontally across multiple databases", "Replicating the entire database", "Encrypting passwords", "Adding foreign keys"], correctAnswer: "Partitioning data horizontally across multiple databases" },
    { text: "What is the role of an API Gateway?", options: ["Acts as a reverse proxy to route API calls and handle cross-cutting concerns", "Compiles frontend code", "Stores user images", "Sends promotional emails"], correctAnswer: "Acts as a reverse proxy to route API calls and handle cross-cutting concerns" },
    { text: "In a microservices architecture, what is 'Service Discovery'?", options: ["A mechanism for services to find each other dynamically", "A tool to discover new frameworks", "A security scanner", "A database indexing strategy"], correctAnswer: "A mechanism for services to find each other dynamically" },
    { text: "What does 'Eventual Consistency' mean?", options: ["Data is never consistent", "Given enough time, all updates will propagate through the system", "Transactions lock the database immediately", "The UI updates instantly"], correctAnswer: "Given enough time, all updates will propagate through the system" },
    { text: "Which pattern ensures that if a service fails, repeated calls aren't made unnecessarily?", options: ["Factory Pattern", "Singleton Pattern", "Circuit Breaker", "Observer Pattern"], correctAnswer: "Circuit Breaker" },
    { text: "What is a reverse proxy?", options: ["A client hiding its IP", "A server that sits in front of web servers and forwards client requests to them", "A database replica", "A DNS resolver"], correctAnswer: "A server that sits in front of web servers and forwards client requests to them" }
  ],
  databases: [
    { text: "What does SQL stand for?", options: ["Standard Query Logic", "Structured Query Language", "Simple Question Language", "System Query Link"], correctAnswer: "Structured Query Language" },
    { text: "Which constraint ensures that all values in a column are distinct?", options: ["NOT NULL", "CHECK", "UNIQUE", "DEFAULT"], correctAnswer: "UNIQUE" },
    { text: "What is a primary key?", options: ["A key used to encrypt the database", "A column or set of columns that uniquely identifies each row", "The first column in a table", "A key used to connect to the database remotely"], correctAnswer: "A column or set of columns that uniquely identifies each row" },
    { text: "In relational databases, what is normalization?", options: ["The process of organizing data to reduce redundancy", "Converting all data to lowercase", "Scaling the database horizontally", "Backing up the database"], correctAnswer: "The process of organizing data to reduce redundancy" },
    { text: "Which of the following is considered a NoSQL document database?", options: ["PostgreSQL", "MySQL", "MongoDB", "Oracle"], correctAnswer: "MongoDB" },
    { text: "What does ACID stand for in database transactions?", options: ["Atomicity, Consistency, Isolation, Durability", "Accuracy, Completeness, Integrity, Data", "Array, Collection, Iterable, Dictionary", "Availability, Consistency, Identity, Durability"], correctAnswer: "Atomicity, Consistency, Isolation, Durability" },
    { text: "What is an index used for in a database?", options: ["To slow down insert operations", "To speed up data retrieval operations", "To encrypt column data", "To format output text"], correctAnswer: "To speed up data retrieval operations" },
    { text: "Which SQL statement is used to extract data from a database?", options: ["GET", "OPEN", "EXTRACT", "SELECT"], correctAnswer: "SELECT" },
    { text: "What is the difference between INNER JOIN and LEFT JOIN?", options: ["They are exactly the same", "INNER JOIN returns only matching rows, LEFT JOIN returns all rows from the left table", "LEFT JOIN is faster", "INNER JOIN includes nulls"], correctAnswer: "INNER JOIN returns only matching rows, LEFT JOIN returns all rows from the left table" },
    { text: "What is a foreign key?", options: ["A key from another country", "A column that references the primary key of another table", "A composite primary key", "An encrypted column"], correctAnswer: "A column that references the primary key of another table" }
  ],
  devops: [
    { text: "What does CI/CD stand for?", options: ["Continuous Integration / Continuous Deployment", "Code Inspection / Code Delivery", "Custom Installation / Custom Deployment", "Computer Interface / Computer Display"], correctAnswer: "Continuous Integration / Continuous Deployment" },
    { text: "Which of the following is an Infrastructure as Code (IaC) tool?", options: ["React", "Terraform", "Jenkins", "Postman"], correctAnswer: "Terraform" },
    { text: "What is a Docker container?", options: ["A physical shipping box", "A standardized, executable component combining app code with OS libraries", "A virtual machine running a full OS", "A database engine"], correctAnswer: "A standardized, executable component combining app code with OS libraries" },
    { text: "In Kubernetes, what is the smallest deployable computing unit?", options: ["Node", "Cluster", "Container", "Pod"], correctAnswer: "Pod" },
    { text: "What is the primary purpose of AWS S3?", options: ["Serverless computing", "Object storage service", "Relational database", "Virtual networking"], correctAnswer: "Object storage service" },
    { text: "Which AWS service is a managed relational database?", options: ["EC2", "S3", "RDS", "Lambda"], correctAnswer: "RDS" },
    { text: "What is a 'blue-green' deployment strategy?", options: ["Deploying during the day and night", "Running two identical production environments to reduce downtime", "Mixing frontend and backend code", "Using blue and green UI themes"], correctAnswer: "Running two identical production environments to reduce downtime" },
    { text: "Which tool is primarily used for configuration management?", options: ["Ansible", "Webpack", "Figma", "MongoDB"], correctAnswer: "Ansible" },
    { text: "What is a 'Pipeline' in the context of CI/CD?", options: ["A network cable", "A set of automated processes that allow developers to reliably compile, test, and deploy code", "A database transaction", "A memory leak"], correctAnswer: "A set of automated processes that allow developers to reliably compile, test, and deploy code" },
    { text: "In Git, what command is used to download a remote repository?", options: ["git fetch", "git pull", "git clone", "git push"], correctAnswer: "git clone" }
  ],
};

export default function PracticeQuiz() {
  const [view, setView] = useState("selection"); // 'selection', 'quiz', 'results'
  const [activeTopic, setActiveTopic] = useState(null);
  
  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const topicParam = params.get("topic");
    
    if (topicParam && TOPICS.find(t => t.id === topicParam)) {
      handleStartQuiz(topicParam);
    }
  }, [location.search]);

  const handleStartQuiz = (topicId) => {
    setActiveTopic(topicId);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setView("quiz");
  };

  const topicQuestions = activeTopic ? QUESTIONS[activeTopic] : [];
  const currentQuestion = topicQuestions[currentQuestionIndex];

  const handleOptionClick = (option) => {
    if (selectedAnswer) return; // Prevent changing answer
    setSelectedAnswer(option);
    if (option === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < topicQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setView("results");
    }
  };

  const handleSkipQuestion = () => {
    if (currentQuestionIndex < topicQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setView("results");
    }
  };

  const handleReturnToTopics = () => {
    setView("selection");
    setActiveTopic(null);
  };

  // ---------------------------------------------------------------------------
  // VIEW: TOPIC SELECTION
  // ---------------------------------------------------------------------------
  if (view === "selection") {
    return (
      <div className="flex flex-col gap-6 pb-6 w-full max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Practice Arena</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
            Select a topic below to start a 10-question practice quiz. Challenge yourself and see where you stand!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleStartQuiz(topic.id)}
              className="group flex flex-col items-center text-center p-8 rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] transition-all hover:-translate-y-2 hover:shadow-2xl hover:border-violet-500/30 hover:bg-slate-50 dark:hover:bg-white/[0.04]"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 mb-6 group-hover:scale-110 transition-transform">
                <topic.icon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{topic.name}</h3>
              <p className="text-sm text-slate-500 dark:text-gray-400 mb-6">{topic.desc}</p>
              
              <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-400">
                Start Quiz <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // VIEW: QUIZ ACTIVE
  // ---------------------------------------------------------------------------
  if (view === "quiz") {
    const topic = TOPICS.find(t => t.id === activeTopic);
    return (
      <div className="max-w-4xl mx-auto py-8">
        <button 
          onClick={handleReturnToTopics}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Topics
        </button>

        <div className="rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] backdrop-blur-md overflow-hidden flex flex-col min-h-[600px] shadow-2xl">
          
          {/* Quiz Header & Progress */}
          <div className="p-8 border-b border-slate-200 dark:border-white/5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400">
                  <topic.icon className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{topic.name}</h2>
              </div>
              <span className="text-sm font-bold px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300">
                Question {currentQuestionIndex + 1} of {topicQuestions.length}
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-violet-500 rounded-full transition-all duration-300" 
                style={{ width: `${((currentQuestionIndex + 1) / topicQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Box */}
          <div className="p-8 flex-1 flex flex-col">
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-10 leading-relaxed">
              {currentQuestion.text}
            </h3>
            
            <div className="space-y-4">
              {currentQuestion.options.map((option, idx) => {
                
                let stateClass = "border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] hover:border-violet-500/30 hover:bg-violet-500/5 hover:text-violet-400";
                let Icon = null;

                if (selectedAnswer) {
                  const isCorrectOption = option === currentQuestion.correctAnswer;
                  const isSelected = selectedAnswer === option;

                  if (isCorrectOption) {
                    stateClass = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
                    Icon = <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
                  } else if (isSelected) {
                    stateClass = "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400";
                    Icon = <XCircle className="h-5 w-5 text-red-500" />;
                  } else {
                    stateClass = "border-slate-200 dark:border-white/5 opacity-40";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(option)}
                    disabled={!!selectedAnswer}
                    className={`w-full p-5 rounded-2xl border flex items-center justify-between text-left transition-all duration-200 ${stateClass}`}
                  >
                    <span className="text-base font-medium">{option}</span>
                    {Icon && Icon}
                  </button>
                );
              })}
            </div>

            {/* Actions Footer */}
            <div className="mt-auto pt-10 flex items-center justify-between">
              <button
                onClick={handleSkipQuestion}
                disabled={!!selectedAnswer}
                className={`text-sm font-semibold transition-colors ${selectedAnswer ? "text-slate-300 dark:text-gray-600 cursor-not-allowed" : "text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-white"}`}
              >
                Skip Question
              </button>
              
              <button
                onClick={handleNextQuestion}
                disabled={!selectedAnswer}
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
                  selectedAnswer 
                  ? "bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:-translate-y-0.5" 
                  : "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-gray-500 cursor-not-allowed"
                }`}
              >
                {currentQuestionIndex === topicQuestions.length - 1 ? "View Results" : "Next Question"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // VIEW: RESULTS SCREEN
  // ---------------------------------------------------------------------------
  if (view === "results") {
    const topic = TOPICS.find(t => t.id === activeTopic);
    const percentage = (score / 10) * 100;
    
    let resultMessage = "";
    if (percentage >= 80) resultMessage = "Excellent work!";
    else if (percentage >= 50) resultMessage = "Good job, keep practicing!";
    else resultMessage = "Keep learning and try again!";

    return (
      <div className="max-w-3xl mx-auto py-16 flex flex-col items-center justify-center text-center">
        
        <div className="w-full rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-12 backdrop-blur-md shadow-2xl relative overflow-hidden">
          
          {/* Confetti / Glow effects */}
          {percentage >= 80 && (
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full pointer-events-none" />
          )}

          <div className="flex justify-center mb-8 relative z-10">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-8 ring-slate-50 dark:ring-[#060816]">
              <Trophy className="h-10 w-10" />
            </div>
          </div>
          
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 relative z-10">{resultMessage}</h2>
          <p className="text-slate-500 dark:text-gray-400 mb-10 relative z-10">You completed the <span className="font-bold text-slate-900 dark:text-white">{topic.name}</span> practice quiz.</p>
          
          <div className="flex justify-center mb-12 relative z-10">
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500 mb-2">Final Score</span>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-slate-900 dark:text-white">{score}</span>
                <span className="text-2xl font-bold text-slate-400 dark:text-gray-500">/ 10</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 relative z-10">
            <button 
              onClick={handleReturnToTopics}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            >
              Back to Topics
            </button>
            <button 
              onClick={() => handleStartQuiz(activeTopic)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-violet-600 text-white hover:bg-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:-translate-y-0.5"
            >
              <RefreshCw className="h-4 w-4" /> Retake Quiz
            </button>
          </div>
        </div>

      </div>
    );
  }

  return null;
}
