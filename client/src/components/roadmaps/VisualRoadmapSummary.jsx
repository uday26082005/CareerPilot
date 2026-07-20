import React, { forwardRef, useImperativeHandle, useRef } from 'react';

const VisualRoadmapSummary = forwardRef((props, ref) => {
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
      const dataUri = canvas.toDataURL('image/jpeg', 0.98);
      
      const a = document.createElement('a');
      a.href = dataUri;
      a.download = 'CareerPilot_Roadmap.jpg';
      a.click();
    }
  }));

  const phases = [
    { num: 1, title: "Fundamentals", desc: "Build strong programming fundamentals with HTML, CSS, JS, and Git.", color: "#e84393" },
    { num: 2, title: "Frontend Dev", desc: "Master modern frameworks like React and build interactive UIs.", color: "#1abc9c" },
    { num: 3, title: "Backend Dev", desc: "Develop robust APIs using Node.js, Express, and REST principles.", color: "#9b59b6" },
    { num: 4, title: "Databases", desc: "Design scalable relational and NoSQL database architectures.", color: "#e67e22" },
    { num: 5, title: "System Design", desc: "Deploy apps, set up CI/CD, and master cloud architecture.", color: "#3498db" },
  ];

  // Distribute 5 nodes evenly across 1600px width.
  // Margins 200px, spacing 300px.
  // Peaks at y=300, Dips at y=550.
  const nodeCoords = [
    { x: 200, y: 550 },
    { x: 500, y: 300 },
    { x: 800, y: 550 },
    { x: 1100, y: 300 },
    { x: 1400, y: 550 },
  ];

  // Mathematically perfect continuous sine-like wave
  const roadPath = [
    "M -100 300",
    "C 50 300, 50 550, 200 550",
    "C 350 550, 350 300, 500 300",
    "C 650 300, 650 550, 800 550",
    "C 950 550, 950 300, 1100 300",
    "C 1250 300, 1250 550, 1400 550",
    "C 1550 550, 1550 300, 1700 300"
  ].join(" ");

  return (
    <div 
      className="absolute top-0 left-[-9999px]" 
      aria-hidden="true"
    >
      <div 
        ref={containerRef} 
        style={{ width: '1600px', height: '900px', backgroundColor: '#ffffff', position: 'relative', overflow: 'hidden' }}
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
            Full Stack Developer Journey
          </h2>
        </div>

        {/* SVG Winding Road */}
        <svg 
          width="1600" 
          height="900" 
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        >
          {/* Black Inner Road */}
          <path d={roadPath} fill="none" stroke="#111111" strokeWidth="48" strokeLinecap="round" />

          {/* Dashed White Center Line */}
          <path d={roadPath} fill="none" stroke="#ffffff" strokeWidth="6" strokeDasharray="16 16" />
        </svg>

        {/* Phases (Nodes & Text) */}
        {phases.map((phase, i) => {
          const coord = nodeCoords[i];
          
          return (
            <div key={phase.num}>
              {/* Teardrop Marker */}
              <div 
                style={{ 
                  position: 'absolute', 
                  left: coord.x - 60, 
                  top: coord.y - 90, // Tip of the teardrop precisely touches the road
                  width: 120, 
                  height: 100, 
                  zIndex: 30 
                }}
              >
                <svg viewBox="0 0 120 100" style={{ width: '100%', height: '100%' }}>
                  <path 
                    d="M 30 40 A 30 30 0 0 1 90 40 Q 90 70 60 90 Q 30 70 30 40 Z" 
                    fill={phase.color} 
                    stroke="#ffffff" 
                    strokeWidth="4" 
                  />
                  <circle cx="60" cy="40" r="22" fill="#ffffff" />
                  
                  {/* Number perfectly centered using SVG text */}
                  <text 
                    x="60" 
                    y="50" 
                    textAnchor="middle" 
                    fontSize="28" 
                    fontWeight="900" 
                    fontFamily='"Arial Black", Impact, sans-serif'
                    fill="#111111"
                  >
                    {phase.num}
                  </text>
                </svg>
              </div>

              {/* Text Block - creates a subtle wave without hugging the curve too tightly */}
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
                  {phase.desc}
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
