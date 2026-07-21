import React, { forwardRef, useImperativeHandle, useRef } from 'react';

const VisualRoadmapSummary = forwardRef(({ roadmap }, ref) => {
  const containerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    generatePdf: async () => {
      const element = containerRef.current;
      if (!element) return;
      
      if (!window.html2canvas) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      const canvas = await window.html2canvas(element, { scale: 2, useCORS: true, logging: false });
      const dataUri = canvas.toDataURL('image/png', 1.0);
      
      const a = document.createElement('a');
      a.href = dataUri;
      a.download = 'CareerPilot_Roadmap.png';
      a.click();
    }
  }));

  if (!roadmap || !roadmap.phases) return null;

  // We have a predefined SVG winding road designed for up to 7 nodes.
  const colors = ["#e84393", "#1abc9c", "#9b59b6", "#e67e22", "#3498db", "#e74c3c", "#2ecc71"];
  
  const nodeCoords = [
    { x: 200, y: 550 },
    { x: 500, y: 300 },
    { x: 800, y: 550 },
    { x: 1100, y: 300 },
    { x: 1400, y: 550 },
    { x: 1700, y: 300 },
    { x: 2000, y: 550 },
  ];

  // Map dynamic phases. Limit to 7 to fit the expanded road canvas safely if Gemini goes crazy.
  const displayPhases = roadmap.phases.slice(0, 7);

  const pathSegments = ["M -100 300"];
  for (let i = 0; i < displayPhases.length; i++) {
    const prevX = (i * 300) + 50;
    const nextX = (i * 300) + 200;
    const isEven = i % 2 === 0;
    const prevY = isEven ? 300 : 550;
    const destY = isEven ? 550 : 300;
    pathSegments.push(`C ${prevX} ${prevY}, ${prevX} ${destY}, ${nextX} ${destY}`);
  }
  // Extend road smoothly horizontally to the right
  const lastI = displayPhases.length - 1;
  const lastX = (lastI * 300) + 200;
  const lastY = (lastI % 2 === 0) ? 550 : 300;
  pathSegments.push(`C ${lastX + 100} ${lastY}, ${lastX + 200} ${lastY}, ${lastX + 300} ${lastY}`);
  
  const roadPath = pathSegments.join(" ");
  
  // Calculate width based on number of phases so it fits nicely
  const canvasWidth = Math.max(1200, displayPhases.length * 300 + 400);

  return (
    <div 
      className="absolute top-0 left-[-9999px]" 
      aria-hidden="true"
    >
      <div 
        ref={containerRef} 
        style={{ width: `${canvasWidth}px`, height: '900px', backgroundColor: '#ffffff', position: 'relative', overflow: 'hidden' }}
      >
        {/* Header Section */}
        <div 
          style={{ 
            backgroundColor: '#cddc39', 
            height: '180px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10
          }}
        >
          <h1 style={{ 
            fontSize: '84px', 
            fontWeight: '900', 
            fontFamily: '"Arial Black", Impact, sans-serif',
            color: '#ffffff', 
            textTransform: 'uppercase', 
            margin: '0', 
            letterSpacing: '4px',
            lineHeight: '1'
          }}>
            ROADMAP
          </h1>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            color: '#111111', 
            margin: '10px 0 0 0' 
          }}>
            {roadmap.target_role || "Professional Journey"}
          </h2>
        </div>

        {/* SVG Winding Road */}
        <svg 
          width={canvasWidth} 
          height="900" 
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        >
          {/* Black Inner Road */}
          <path d={roadPath} fill="none" stroke="#111111" strokeWidth="48" strokeLinecap="round" />

          {/* Dashed White Center Line */}
          <path d={roadPath} fill="none" stroke="#ffffff" strokeWidth="6" strokeDasharray="16 16" />
        </svg>

        {/* Phases (Nodes & Text) */}
        {displayPhases.map((phase, i) => {
          const coord = nodeCoords[i];
          const color = colors[i % colors.length];
          
          return (
            <div key={phase.phase_number}>
              {/* Teardrop Marker */}
              <div 
                style={{ 
                  position: 'absolute', 
                  left: coord.x - 60, 
                  top: coord.y - 90,
                  width: 120, 
                  height: 100, 
                  zIndex: 30 
                }}
              >
                <svg viewBox="0 0 120 100" style={{ width: '100%', height: '100%' }}>
                  <path 
                    d="M 30 40 A 30 30 0 0 1 90 40 Q 90 70 60 90 Q 30 70 30 40 Z" 
                    fill={color} 
                    stroke="#ffffff" 
                    strokeWidth="4" 
                  />
                  <circle cx="60" cy="40" r="22" fill="#ffffff" />
                  
                  <text 
                    x="60" 
                    y="50" 
                    textAnchor="middle" 
                    fontSize="28" 
                    fontWeight="900" 
                    fontFamily='"Arial Black", Impact, sans-serif'
                    fill="#111111"
                  >
                    {phase.phase_number}
                  </text>
                </svg>
              </div>

              {/* Text Block */}
              <div 
                style={{
                  position: 'absolute',
                  left: coord.x - 120,
                  top: coord.y === 300 ? 520 : 600,
                  width: '240px',
                  textAlign: 'center',
                  zIndex: 20
                }}
              >
                <h3 style={{ 
                  fontSize: '28px', 
                  fontWeight: '900', 
                  fontFamily: '"Arial Black", Impact, sans-serif',
                  color: '#111111', 
                  margin: '0 0 12px 0'
                }}>
                  {phase.title}
                </h3>
                <p style={{ 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  fontFamily: 'Arial, sans-serif',
                  color: '#555555', 
                  margin: 0, 
                  lineHeight: '1.6' 
                }}>
                  {phase.description}
                </p>
              </div>
            </div>
          );
        })}

        {/* Footer */}
        <div 
          style={{ 
            backgroundColor: '#cddc39', 
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10
          }}
        >
          <div style={{ backgroundColor: '#ffffff', padding: '6px 24px', borderRadius: '20px' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'Arial, sans-serif', color: '#111111' }}>
              www.careerpilot-ai.com
            </span>
          </div>
        </div>

      </div>
    </div>
  );
});

export default VisualRoadmapSummary;
