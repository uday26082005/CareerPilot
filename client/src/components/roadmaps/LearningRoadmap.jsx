import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Maximize2, Minimize2, CheckCircle2, CircleDashed, Circle, ChevronDown, ChevronUp, Monitor, Layout, FileJson, Database, Rocket, ExternalLink, Code } from "lucide-react";
import html2pdf from 'html2pdf.js';

const LearningRoadmap = forwardRef(({ roadmap, onTaskStatusChange }, ref) => {
  const [expandedPhases, setExpandedPhases] = useState([]);

  useEffect(() => {
    if (roadmap?.phases?.length > 0) {
      // expand the first phase by default
      setExpandedPhases([0]);
    }
  }, [roadmap]);

  useImperativeHandle(ref, () => ({
    generatePdf: async () => {
      // Expand all phases
      const allIdxs = roadmap?.phases ? roadmap.phases.map((_, i) => i) : [];
      setExpandedPhases(allIdxs);
      
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

  const handleExpandAll = () => {
    if (!roadmap?.phases) return;
    setExpandedPhases(roadmap.phases.map((_, i) => i));
  };
  const handleCollapseAll = () => setExpandedPhases([]);
  
  const togglePhase = (idx) => {
    setExpandedPhases(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const getPhaseIcons = (idx) => {
    const icons = [Monitor, Layout, FileJson, Database, Rocket];
    return icons[idx % icons.length];
  };

  const getPhaseTheme = (idx) => {
    const themes = [
      { text: "text-emerald-400", bg: "bg-emerald-500/10", solid: "bg-emerald-500", border: "border-emerald-500/30", icon: CheckCircle2 },
      { text: "text-blue-400", bg: "bg-blue-500/10", solid: "bg-blue-500", border: "border-blue-500/30", icon: CircleDashed },
      { text: "text-orange-400", bg: "bg-orange-500/10", solid: "bg-orange-500", border: "border-orange-500/30", icon: CircleDashed },
      { text: "text-purple-400", bg: "bg-purple-500/10", solid: "bg-purple-500", border: "border-purple-500/30", icon: Circle },
      { text: "text-pink-400", bg: "bg-pink-500/10", solid: "bg-pink-500", border: "border-pink-500/30", icon: Circle },
    ];
    return themes[idx % themes.length];
  };

  if (!roadmap || !roadmap.phases) return null;

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
        {roadmap.phases.map((phase, idx) => {
          const isExpanded = expandedPhases.includes(idx);
          const PhaseIcon = getPhaseIcons(idx);
          const theme = getPhaseTheme(idx);
          
          let completedTasks = 0;
          let totalTasks = phase.tasks?.length || 0;
          phase.tasks?.forEach(t => { if (t.status === 'Completed') completedTasks++; });
          
          const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
          let statusText = "Pending";
          let StatusIcon = Circle;
          let statusColor = "text-slate-500 dark:text-gray-400 border-gray-500/30";
          let progressColor = "text-slate-400 dark:text-gray-500";
          
          if (progress === 100 && totalTasks > 0) {
            statusText = "Completed";
            StatusIcon = CheckCircle2;
            statusColor = "text-emerald-400 border-emerald-500/30";
            progressColor = "text-emerald-500";
          } else if (progress > 0) {
            statusText = "In Progress";
            StatusIcon = CircleDashed;
            statusColor = "text-blue-400 border-blue-500/30";
            progressColor = "text-blue-500";
          }
          
          return (
            <div key={idx} className="relative flex gap-6 pb-8 last:pb-2">
              
              {/* Timeline Line & Circle */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-medium text-slate-400 dark:text-gray-500 mb-2">Phase {phase.phase_number}</span>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-slate-900 dark:text-white shadow-lg z-10 ${theme.solid}`}>
                  {phase.phase_number}
                </div>
                {idx < roadmap.phases.length - 1 && (
                  <div className="w-px flex-1 border-l border-dashed border-slate-300 dark:border-white/20 mt-2 mb-1" />
                )}
              </div>

              {/* Content Card */}
              <div className="flex-1 flex flex-col rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] p-5 hover:bg-white dark:bg-white/[0.02] transition-colors mt-6">
                
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${theme.bg} ${theme.text}`}>
                    <PhaseIcon className="h-6 w-6" />
                  </div>

                  {/* Text Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{phase.title}</h3>
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${statusColor}`}>
                        {statusText}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mb-4">{phase.description}</p>
                    
                    {/* Skills */}
                    <div className="flex flex-wrap gap-2">
                      {phase.skills?.map((skill, sIdx) => (
                        <span key={sIdx} className="rounded-md border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 px-2 py-1 text-xs font-medium text-slate-600 dark:text-gray-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Progress & Toggle */}
                  <div className="flex flex-col items-end gap-3 shrink-0 ml-4">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`h-5 w-5 ${progressColor}`} />
                      <span className="text-lg font-bold text-slate-900 dark:text-white">{progress}%</span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-gray-400">{completedTasks} / {totalTasks} Tasks</span>
                    <button 
                      onClick={() => togglePhase(idx)}
                      className="mt-4 text-slate-400 dark:text-gray-500 hover:text-slate-900 dark:text-white transition-colors cursor-pointer p-1"
                    >
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Topics Accordion */}
                <div className={`mt-6 pt-5 border-t border-slate-200 dark:border-white/5 flex-col gap-5 animation-fade-in ${isExpanded ? 'flex' : 'hidden print:flex'}`}>
                  
                  {/* Tasks list */}
                  <div className="flex flex-col gap-3">
                    {phase.tasks?.map(task => (
                      <div key={task.id} className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 hover:border-violet-500/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <select 
                            value={task.status}
                            onChange={(e) => onTaskStatusChange && onTaskStatusChange(task.id, e.target.value)}
                            className={`text-xs font-bold rounded-md border py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-violet-500 print:hidden cursor-pointer transition-colors
                              ${task.status === 'Completed' ? 'border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                                task.status === 'In Progress' ? 'border-blue-500/30 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' :
                                'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-gray-300'
                              }
                            `}
                          >
                            <option className="text-slate-900 bg-white dark:bg-slate-800 dark:text-white" value="Pending">Pending</option>
                            <option className="text-slate-900 bg-white dark:bg-slate-800 dark:text-white" value="In Progress">In Progress</option>
                            <option className="text-slate-900 bg-white dark:bg-slate-800 dark:text-white" value="Completed">Completed</option>
                          </select>
                          <div className="flex flex-col">
                            <span className={`text-sm font-semibold ${task.status === 'Completed' ? 'text-slate-500 dark:text-gray-500' : 'text-slate-700 dark:text-gray-200'} print:text-black`}>
                              {task.title}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-gray-500 mb-2">{task.description}</span>
                            {task.resource && (
                              <a 
                                href={task.resource.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-fit flex items-center gap-1.5 text-[11px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors"
                              >
                                <ExternalLink className="h-3 w-3" />
                                {task.resource.title}
                              </a>
                            )}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-400 dark:text-gray-600 shrink-0 ml-4">
                          ~{task.estimated_hours}h
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Projects row */}
                  {phase.projects && phase.projects.length > 0 && (
                    <div className="flex flex-col gap-2 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.01] p-4 mt-2">
                      <h4 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                        <Code className="h-4 w-4 text-blue-500" /> Suggested Projects
                      </h4>
                      <ul className="text-sm text-slate-600 dark:text-gray-400 space-y-2 list-disc pl-5 marker:text-slate-300 dark:marker:text-gray-700">
                        {phase.projects.map((proj, pIdx) => (
                          <li key={pIdx}><strong className="text-slate-800 dark:text-gray-300">{proj.title}</strong>: {proj.description}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {phase.milestone && (
                    <div className="mt-2 text-sm text-center font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 p-3 rounded-xl">
                      Milestone: {phase.milestone}
                    </div>
                  )}
                  
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
