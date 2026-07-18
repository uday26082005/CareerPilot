import React, { forwardRef, useImperativeHandle, useRef } from 'react';

const VisualRoadmapSummary = forwardRef((props, ref) => {
  const containerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    generatePdf: async () => {
      const element = containerRef.current;
      if (!element) return;
      
      // Load html2canvas dynamically
      if (!window.html2canvas) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Generate Image
      const canvas = await window.html2canvas(element, { scale: 2, useCORS: true, logging: false });
      const dataUri = canvas.toDataURL('image/jpeg', 0.98);
      
      // Download
      const a = document.createElement('a');
      a.href = dataUri;
      a.download = 'CareerPilot_Roadmap.jpg';
      a.click();
    }
  }));

  const phases = [
    { num: 1, title: "FUNDAMENTALS", desc: "Build strong programming fundamentals with HTML, CSS, JS, and essential tools like Git.", color: "#EC4899" },
    { num: 2, title: "FRONTEND DEV", desc: "Master modern frameworks like React, state management, and build interactive UIs.", color: "#F59E0B" },
    { num: 3, title: "BACKEND DEV", desc: "Develop robust APIs using Node.js, Express, and understand RESTful principles.", color: "#8B5CF6" },
    { num: 4, title: "DATABASES", desc: "Design and optimize scalable relational and NoSQL database architectures.", color: "#10B981" },
    { num: 5, title: "SYSTEM DESIGN", desc: "Deploy full stack applications, set up CI/CD, and master cloud architecture.", color: "#EF4444" },
  ];

  const nodeCoords = [
    { x: 800, y: 380, align: 'left' },
    { x: 200, y: 600, align: 'right' },
    { x: 800, y: 820, align: 'left' },
    { x: 200, y: 1040, align: 'right' },
    { x: 800, y: 1260, align: 'left' },
  ];

  return (
    <div 
      className="absolute top-0 left-[-9999px]" // Hide it off-screen
      aria-hidden="true"
    >
      <div 
        ref={containerRef} 
        style={{ width: '1000px', height: '1600px', backgroundColor: '#f8fafc', position: 'relative', overflow: 'hidden' }}
      >
        {/* Header Section */}
        <div 
          style={{ 
            backgroundColor: '#ddd6fe', 
            padding: '40px 20px', 
            textAlign: 'center',
            margin: '40px',
            borderRadius: '20px',
            position: 'relative',
            zIndex: 20
          }}
        >
          <h1 style={{ fontSize: '64px', fontWeight: '900', color: '#1e1b4b', textTransform: 'uppercase', margin: 0, letterSpacing: '4px' }}>
            ROADMAP
          </h1>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#312e81', fontStyle: 'italic', margin: '10px 0 0 0' }}>
            Full Stack Developer Journey
          </h2>
        </div>

        {/* SVG Winding Road */}
        <svg 
          width="1000" 
          height="1600" 
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        >
          {/* White Outer Border for the Road */}
          <path 
            d="M 500 200 
               L 500 250
               C 500 300, 800 300, 800 380
               C 800 490, 200 490, 200 600
               C 200 710, 800 710, 800 820
               C 800 930, 200 930, 200 1040
               C 200 1150, 800 1150, 800 1260
               C 800 1370, 500 1370, 500 1450
               L 500 1500" 
            fill="none" 
            stroke="#e2e8f0" 
            strokeWidth="60"
            strokeLinecap="round"
          />
          {/* Black Inner Road */}
          <path 
            d="M 500 200 
               L 500 250
               C 500 300, 800 300, 800 380
               C 800 490, 200 490, 200 600
               C 200 710, 800 710, 800 820
               C 800 930, 200 930, 200 1040
               C 200 1150, 800 1150, 800 1260
               C 800 1370, 500 1370, 500 1450
               L 500 1500" 
            fill="none" 
            stroke="#1e293b"
            strokeWidth="50"
            strokeLinecap="round"
          />
          {/* Dashed White Center Line */}
          <path 
            d="M 500 200 
               L 500 250
               C 500 300, 800 300, 800 380
               C 800 490, 200 490, 200 600
               C 200 710, 800 710, 800 820
               C 800 930, 200 930, 200 1040
               C 200 1150, 800 1150, 800 1260
               C 800 1370, 500 1370, 500 1450
               L 500 1500" 
            fill="none" 
            stroke="#ffffff" 
            strokeWidth="4" 
            strokeDasharray="16 16" 
          />
          {/* Arrow Head */}
          <polygon points="460,1500 540,1500 500,1560" fill="#1e293b" stroke="#e2e8f0" strokeWidth="4" />
        </svg>

        {/* Phases (Nodes & Text) */}
        {phases.map((phase, i) => {
          const coord = nodeCoords[i];
          const isLeftText = coord.align === 'left';
          
          return (
            <div key={phase.num}>
              {/* Marker Teardrop Circle */}
              <div 
                style={{
                  position: 'absolute',
                  left: coord.x - 30,
                  top: coord.y - 30,
                  width: '60px',
                  height: '60px',
                  backgroundColor: 'white',
                  border: `8px solid ${phase.color}`,
                  borderRadius: '50%',
                  zIndex: 10,
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              >
                <span style={{ 
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontWeight: '900',
                  fontSize: '32px',
                  color: '#1e293b',
                  lineHeight: '1',
                  margin: 0,
                  padding: 0
                }}>
                  {phase.num}
                </span>
              </div>

              {/* Connecting pointer triangle */}
              <div 
                style={{
                  position: 'absolute',
                  left: isLeftText ? coord.x - 60 : coord.x + 20,
                  top: coord.y - 15,
                  width: '0',
                  height: '0',
                  borderTop: '15px solid transparent',
                  borderBottom: '15px solid transparent',
                  borderRight: isLeftText ? 'none' : `40px solid ${phase.color}`,
                  borderLeft: isLeftText ? `40px solid ${phase.color}` : 'none',
                  zIndex: 9
                }}
              />

              {/* Text Block */}
              <div 
                style={{
                  position: 'absolute',
                  left: isLeftText ? coord.x - 450 : coord.x + 90,
                  top: coord.y - 40,
                  width: '350px',
                  textAlign: isLeftText ? 'right' : 'left'
                }}
              >
                <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                  {phase.title}
                </h3>
                <p style={{ fontSize: '15px', fontWeight: '600', color: '#475569', margin: 0, lineHeight: '1.4' }}>
                  {phase.desc}
                </p>
              </div>
            </div>
          );
        })}

        {/* Footer */}
        <div style={{ position: 'absolute', bottom: '20px', width: '100%', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', backgroundColor: '#ddd6fe', padding: '12px 32px', borderRadius: '8px' }}>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#312e81' }}>
              www.careerpilot-ai.com
            </span>
          </div>
        </div>

      </div>
    </div>
  );
});

export default VisualRoadmapSummary;
