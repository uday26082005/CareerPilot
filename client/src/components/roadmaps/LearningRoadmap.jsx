import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Maximize2, Minimize2, CheckCircle2, CircleDashed, Circle, ChevronDown, ChevronUp, Monitor, Layout, FileJson, Database, Rocket, ExternalLink, Code } from "lucide-react";
import html2pdf from 'html2pdf.js';
import ThemedSelect from "../ui/ThemedSelect";

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
      { text: "text-teal-600 dark:text-[#4ee4cb]", bg: "bg-teal-50 border border-teal-200 dark:border-transparent dark:bg-[#4ee4cb]/10", solid: "bg-teal-600 text-white dark:bg-[#4ee4cb] dark:text-slate-950", border: "border-teal-200 dark:border-[#4ee4cb]/30", icon: CheckCircle2 },
      { text: "text-amber-600 dark:text-[#ffd159]", bg: "bg-amber-50 border border-amber-200 dark:border-transparent dark:bg-[#ffd159]/10", solid: "bg-amber-500 text-white dark:bg-[#ffd159] dark:text-slate-950", border: "border-amber-200 dark:border-[#ffd159]/30", icon: CircleDashed },
      { text: "text-purple-600 dark:text-[#e29aff]", bg: "bg-purple-50 border border-purple-200 dark:border-transparent dark:bg-[#e29aff]/10", solid: "bg-purple-600 text-white dark:bg-[#e29aff] dark:text-slate-950", border: "border-purple-200 dark:border-[#e29aff]/30", icon: CircleDashed },
      { text: "text-orange-600 dark:text-[#ffb48a]", bg: "bg-orange-50 border border-orange-200 dark:border-transparent dark:bg-[#ffb48a]/10", solid: "bg-orange-500 text-white dark:bg-[#ffb48a] dark:text-slate-950", border: "border-orange-200 dark:border-[#ffb48a]/30", icon: Circle },
      { text: "text-pink-600 dark:text-[#ff94aa]", bg: "bg-pink-50 border border-pink-200 dark:border-transparent dark:bg-[#ff94aa]/10", solid: "bg-pink-600 text-white dark:bg-[#ff94aa] dark:text-slate-950", border: "border-pink-200 dark:border-[#ff94aa]/30", icon: Circle },
    ];
    return themes[idx % themes.length];
  };

  if (!roadmap || !roadmap.phases) return null;

  return (
    <div id="pdf-roadmap-container" className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#1c1e24] dark:shadow-xl dark:shadow-black/25 h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-white/[0.06]">
        <h2 className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Your Learning Roadmap</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleExpandAll}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <Maximize2 className="h-4 w-4" /> Expand All
          </button>
          <button 
            onClick={handleCollapseAll}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
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
          let statusColor = "text-slate-500 border-slate-200 bg-slate-100 dark:text-slate-400 dark:border-white/10 dark:bg-white/5";
          let progressColor = "text-slate-400 dark:text-slate-500";
          
          if (progress === 100 && totalTasks > 0) {
            statusText = "Completed";
            StatusIcon = CheckCircle2;
            statusColor = "text-teal-700 border-teal-200 bg-teal-50 dark:text-[#4ee4cb] dark:border-[#4ee4cb]/30 dark:bg-[#4ee4cb]/5";
            progressColor = "text-teal-600 dark:text-[#4ee4cb]";
          } else if (progress > 0) {
            statusText = "In Progress";
            StatusIcon = CircleDashed;
            statusColor = "text-amber-700 border-amber-200 bg-amber-50 dark:text-[#ffd159] dark:border-[#ffd159]/30 dark:bg-[#ffd159]/5";
            progressColor = "text-amber-600 dark:text-[#ffd159]";
          }
          
          return (
            <div key={idx} className="relative flex gap-6 pb-8 last:pb-2">
              
              {/* Timeline Line & Circle */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Phase {phase.phase_number}</span>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-md z-10 ${theme.solid}`}>
                  {phase.phase_number}
                </div>
                {idx < roadmap.phases.length - 1 && (
                  <div className="w-px flex-1 border-l border-dashed border-slate-300 dark:border-white/20 mt-2 mb-1" />
                )}
              </div>

              {/* Content Card */}
              <div className="flex-1 flex flex-col rounded-2xl border border-slate-200 bg-slate-50/70 p-5 hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#242730] dark:hover:border-white/15 transition-colors mt-6 shadow-sm">
                
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${theme.bg} ${theme.text}`}>
                    <PhaseIcon className="h-6 w-6" />
                  </div>

                  {/* Text Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{phase.title}</h3>
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${statusColor}`}>
                        {statusText}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{phase.description}</p>
                    
                    {/* Skills */}
                    <div className="flex flex-wrap gap-2">
                      {phase.skills?.map((skill, sIdx) => (
                        <span key={sIdx} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm dark:border-white/[0.08] dark:bg-[#1c1e24] dark:text-slate-300">
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
                    <span className="text-xs text-slate-500 dark:text-slate-400">{completedTasks} / {totalTasks} Tasks</span>
                    <button 
                      onClick={() => togglePhase(idx)}
                      className="mt-4 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer p-1"
                    >
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Topics Accordion */}
                <div className={`mt-6 pt-5 border-t border-slate-200 dark:border-white/[0.06] flex-col gap-5 animation-fade-in ${isExpanded ? 'flex' : 'hidden print:flex'}`}>
                  
                  {/* Tasks list */}
                  <div className="flex flex-col gap-3">
                    {phase.tasks?.map(task => (
                      <div key={task.id} className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 dark:bg-[#1c1e24] dark:border-white/[0.06] dark:hover:border-white/15 transition-colors shadow-sm">
                        <div className="flex items-center gap-4">
                          <ThemedSelect
                            value={task.status}
                            onChange={(val) => onTaskStatusChange && onTaskStatusChange(task.id, val)}
                            options={[
                              { value: "Pending", label: "Pending" },
                              { value: "In Progress", label: "In Progress" },
                              { value: "Completed", label: "Completed" }
                            ]}
                            className="w-36 print:hidden"
                            align="left"
                          />
                          <div className="flex flex-col">
                            <span className={`text-sm font-semibold ${task.status === 'Completed' ? 'text-slate-400 line-through dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'} print:text-black`}>
                              {task.title}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 mb-2">{task.description}</span>
                            {task.resource && (
                              <a 
                                href={task.resource.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-fit flex items-center gap-1.5 text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 dark:bg-[#4ee4cb]/10 dark:text-[#4ee4cb] dark:border-[#4ee4cb]/20 dark:hover:bg-[#4ee4cb]/20 px-2.5 py-1 rounded-md transition-colors"
                              >
                                <ExternalLink className="h-3 w-3" />
                                {task.resource.title}
                              </a>
                            )}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0 ml-4">
                          ~{task.estimated_hours}h
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Projects row */}
                  {phase.projects && phase.projects.length > 0 && (
                    <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 mt-2 shadow-sm dark:border-white/[0.06] dark:bg-[#1c1e24]">
                      <h4 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                        <Code className="h-4 w-4 text-amber-500 dark:text-[#ffd159]" /> Suggested Projects
                      </h4>
                      <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-disc pl-5 marker:text-amber-500 dark:marker:text-[#ffd159]">
                        {phase.projects.map((proj, pIdx) => (
                          <li key={pIdx}><strong className="text-slate-800 dark:text-slate-200 font-semibold">{proj.title}</strong>: {proj.description}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {phase.milestone && (
                    <div className="mt-2 text-sm text-center font-bold text-amber-700 bg-amber-50 border border-amber-200 dark:text-[#ffd159] dark:bg-[#ffd159]/10 dark:border-[#ffd159]/20 p-3 rounded-xl">
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
