import { forwardRef, useImperativeHandle, useRef } from 'react';
import html2canvas from 'html2canvas';

const VisualRoadmapSummary = forwardRef(({ roadmap }, ref) => {
  const containerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    downloadPng: async () => {
      const element = containerRef.current;
      if (!element) throw new Error("Roadmap render container not ready");

      // Wait for all web fonts (Outfit) to settle to ensure accurate font baseline metrics
      if (document.fonts && document.fonts.ready) {
        try {
          await document.fonts.ready;
        } catch {
          // ignore font loading errors
        }
      }

      // Crucial fix: Tailwind CSS Preflight resets <img> to display: block.
      // html2canvas FontMetrics measures baseline by placing an <img> next to a <span>.
      // If <img> is block, it breaks to a new line, shifting every text baseline down by 15-20px.
      // Injecting img { display: inline-block !important; } guarantees accurate vertical centering.
      const fixStyle = document.createElement('style');
      fixStyle.id = 'html2canvas-fontmetrics-override';
      fixStyle.innerHTML = `
        img { display: inline-block !important; vertical-align: baseline !important; }
      `;
      document.head.appendChild(fixStyle);

      try {
        // Small tick for layout stabilization
        await new Promise((r) => setTimeout(r, 60));

        // Capture using html2canvas with onclone hook.
        // This leaves the user's LIVE DOM completely untouched, avoiding screen shifts,
        // scrollbar flickers, and the 2-second layout jank.
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#090d16',
          windowWidth: 1400,
          windowHeight: element.offsetHeight || 1200,
          onclone: (clonedDoc, clonedElement) => {
            // Also inject style into cloned iframe document
            const clonedFix = clonedDoc.createElement('style');
            clonedFix.innerHTML = `
              img { display: inline-block !important; vertical-align: baseline !important; }
            `;
            clonedDoc.head.appendChild(clonedFix);

            const clonedWrapper = clonedDoc.getElementById('visual-roadmap-export-wrapper');
            if (clonedWrapper) {
              clonedWrapper.style.position = 'static';
              clonedWrapper.style.left = '0px';
              clonedWrapper.style.top = '0px';
              clonedWrapper.style.opacity = '1';
              clonedWrapper.style.display = 'block';
              clonedWrapper.style.visibility = 'visible';
              clonedWrapper.style.transform = 'none';
            }
            if (clonedElement) {
              clonedElement.style.position = 'static';
              clonedElement.style.left = '0px';
              clonedElement.style.top = '0px';
              clonedElement.style.opacity = '1';
              clonedElement.style.visibility = 'visible';
              clonedElement.style.display = 'block';
              clonedElement.style.transform = 'none';
            }
          }
        });

        const dataUri = canvas.toDataURL('image/png', 1.0);
        const safeRole = (roadmap.target_role || 'CareerPilot').replace(/[^a-zA-Z0-9]/g, '_');
        
        const a = document.createElement('a');
        a.href = dataUri;
        a.download = `CareerPilot_${safeRole}_Roadmap.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } finally {
        if (fixStyle && fixStyle.parentNode) {
          fixStyle.parentNode.removeChild(fixStyle);
        }
      }
    },
    generatePdf: async function () {
      return this.downloadPng();
    }
  }));

  if (!roadmap || !roadmap.phases || roadmap.phases.length === 0) return null;

  const phases = roadmap.phases;
  const colors = [
    { primary: "#8b5cf6", glow: "rgba(139, 92, 246, 0.4)", text: "#c4b5fd" },
    { primary: "#3b82f6", glow: "rgba(59, 130, 246, 0.4)", text: "#93c5fd" },
    { primary: "#10b981", glow: "rgba(16, 185, 129, 0.4)", text: "#6ee7b7" },
    { primary: "#f59e0b", glow: "rgba(245, 158, 11, 0.4)", text: "#fcd34d" },
    { primary: "#ec4899", glow: "rgba(236, 72, 153, 0.4)", text: "#f472b6" }
  ];

  const canvasWidth = 1400;
  const canvasHeight = Math.max(900, 360 + phases.length * 320);

  return (
    <div 
      id="visual-roadmap-export-wrapper"
      style={{
        position: 'fixed',
        left: '-99999px',
        top: '0px',
        pointerEvents: 'none',
        opacity: 0,
        zIndex: -9999
      }}
      aria-hidden="true"
    >
      <div 
        ref={containerRef} 
        id="visual-roadmap-export-container"
        style={{ 
          width: `${canvasWidth}px`, 
          minHeight: `${canvasHeight}px`, 
          backgroundColor: '#090d16', 
          backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.18), rgba(255, 255, 255, 0))',
          position: 'relative', 
          padding: '48px 56px',
          boxSizing: 'border-box',
          fontFamily: "'Outfit', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          color: '#ffffff',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale'
        }}
      >
        {/* Header Block */}
        <div style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '32px',
          marginBottom: '40px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          boxSizing: 'border-box'
        }}>
          <div>
            {/* Top Capsule Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(139, 92, 246, 0.15)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              fontSize: '13px',
              lineHeight: '1',
              fontWeight: '700',
              color: '#c4b5fd',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '14px',
              boxSizing: 'border-box'
            }}>
              <span style={{ fontSize: '13px', lineHeight: '1', display: 'inline-flex', alignItems: 'center' }}>🚀</span>
              <span style={{ fontSize: '13px', lineHeight: '1', display: 'inline-flex', alignItems: 'center' }}>CAREERPILOT AI • 2026 LEARNING ROADMAP</span>
            </div>

            <h1 style={{
              fontSize: '44px',
              fontWeight: '800',
              lineHeight: '1.2',
              margin: '0 0 10px 0',
              letterSpacing: '-0.02em',
              color: '#ffffff'
            }}>
              {roadmap.target_role || "Engineering Roadmap"}
            </h1>

            <p style={{
              fontSize: '16px',
              color: '#94a3b8',
              margin: '0',
              maxWidth: '850px',
              lineHeight: '1.6'
            }}>
              {roadmap.summary || `Personalized learning progression designed to bridge your missing skills with market focus priority.`}
            </p>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '12px'
          }}>
            {/* Est Duration Box */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '12px 18px',
              textAlign: 'right',
              boxSizing: 'border-box'
            }}>
              <span style={{ display: 'block', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', lineHeight: '1.3', marginBottom: '4px' }}>
                EST. DURATION
              </span>
              <span style={{ display: 'block', fontSize: '18px', fontWeight: '700', color: '#a78bfa', lineHeight: '1.2' }}>
                {roadmap.estimated_duration || "Self-Paced"}
              </span>
            </div>

            {/* Market Focus Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '12px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#34d399',
              lineHeight: '1',
              boxSizing: 'border-box'
            }}>
              <span style={{ fontSize: '13px', lineHeight: '1', display: 'inline-flex', alignItems: 'center' }}>⚡</span>
              <span style={{ fontSize: '12px', lineHeight: '1', display: 'inline-flex', alignItems: 'center' }}>Market Focus Skills Prioritized</span>
            </div>
          </div>
        </div>

        {/* Phases List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {phases.map((phase, idx) => {
            const theme = colors[idx % colors.length];

            return (
              <div 
                key={phase.phase_number || idx}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid rgba(255, 255, 255, 0.08)`,
                  borderLeft: `4px solid ${theme.primary}`,
                  borderRadius: '18px',
                  padding: '28px 32px',
                  position: 'relative',
                  boxSizing: 'border-box'
                }}
              >
                {/* Phase Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {/* Phase Number Circle */}
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      backgroundColor: theme.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: '800',
                      color: '#ffffff',
                      boxShadow: `0 4px 14px ${theme.glow}`,
                      boxSizing: 'border-box',
                      lineHeight: '1'
                    }}>
                      <span style={{ lineHeight: '1', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        {phase.phase_number || idx + 1}
                      </span>
                    </div>

                    <div>
                      <h2 style={{
                        fontSize: '22px',
                        fontWeight: '700',
                        margin: '0 0 4px 0',
                        color: '#f8fafc',
                        lineHeight: '1.3'
                      }}>
                        {phase.title}
                      </h2>
                      {phase.estimated_duration && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '13px',
                          color: theme.text,
                          fontWeight: '600',
                          lineHeight: '1'
                        }}>
                          <span style={{ fontSize: '12px', lineHeight: '1' }}>⏱</span>
                          <span style={{ lineHeight: '1' }}>{phase.estimated_duration}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Phase Description */}
                {phase.description && (
                  <p style={{
                    fontSize: '14px',
                    color: '#94a3b8',
                    lineHeight: '1.5',
                    margin: '0 0 16px 0'
                  }}>
                    {phase.description}
                  </p>
                )}

                {/* Targeted Missing Skills Badges */}
                {phase.skills && phase.skills.length > 0 && (
                  <div style={{ marginBottom: '18px' }}>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', lineHeight: '1.2' }}>
                      TARGETED MISSING SKILLS
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {phase.skills.map((skill, sIdx) => (
                        <span 
                          key={sIdx}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            lineHeight: '1',
                            color: '#e2e8f0',
                            boxSizing: 'border-box'
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tasks & Resource Breakdown */}
                {phase.tasks && phase.tasks.length > 0 && (
                  <div style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    marginBottom: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    boxSizing: 'border-box'
                  }}>
                    <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: '1.2' }}>
                      Actionable Learning Tasks
                    </span>

                    {phase.tasks.map((task, tIdx) => (
                      <div 
                        key={tIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '16px',
                          borderBottom: tIdx < phase.tasks.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                          paddingBottom: tIdx < phase.tasks.length - 1 ? '12px' : '0'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9', display: 'block', lineHeight: '1.4' }}>
                            • {task.title}
                          </span>
                          {task.description && (
                            <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginTop: '3px', lineHeight: '1.45' }}>
                              {task.description}
                            </span>
                          )}
                          {task.resource?.title && (
                            <span style={{
                              fontSize: '11px',
                              color: '#38bdf8',
                              marginTop: '4px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              lineHeight: '1.3'
                            }}>
                              <span style={{ lineHeight: '1' }}>🔗</span>
                              <span style={{ lineHeight: '1' }}>Recommended: {task.resource.title}</span>
                            </span>
                          )}
                        </div>

                        {task.estimated_hours && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            fontSize: '11px',
                            color: '#cbd5e1',
                            fontWeight: '600',
                            lineHeight: '1',
                            whiteSpace: 'nowrap',
                            boxSizing: 'border-box'
                          }}>
                            {task.estimated_hours} hrs
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Milestone Banner */}
                {phase.milestone && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 18px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(139, 92, 246, 0.08)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    boxSizing: 'border-box'
                  }}>
                    <span style={{
                      fontSize: '15px',
                      lineHeight: '1',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      🎯
                    </span>
                    <span style={{
                      fontSize: '13px',
                      lineHeight: '1.4',
                      fontWeight: '600',
                      color: '#ddd6fe',
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}>
                      Milestone: {phase.milestone}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '48px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#64748b',
          lineHeight: '1.4',
          boxSizing: 'border-box'
        }}>
          <span>
            Generated by <strong style={{ color: '#94a3b8' }}>CareerPilot AI</strong> • Verified with 2026 Labor Market Intelligence
          </span>
          <span>
            www.careerpilot-ai.com
          </span>
        </div>
      </div>
    </div>
  );
});

export default VisualRoadmapSummary;
