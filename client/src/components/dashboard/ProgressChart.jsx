import React, { useState, useRef, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ChevronDown } from "lucide-react";

export default function ProgressChart({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("This Week");
  const options = ["This Week", "This Month", "This Year"];
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const now = new Date();
    let mappedData = [];

    const getDayLabel = (d) => `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`;
    const getMonthLabel = (d) => `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;

    // Group actual data
    const grouped = (Array.isArray(data) ? data : []).reduce((acc, r) => {
      const d = new Date(r.date);
      let label = selected === "This Year" ? getMonthLabel(d) : getDayLabel(d);
      acc[label] = r.score || 0;
      return acc;
    }, {});

    if (selected === "This Week") {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        mappedData.push({ day: getDayLabel(d), value: null });
      }
    } else if (selected === "This Month") {
      // Last 30 days
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        mappedData.push({ day: getDayLabel(d), value: null });
      }
    } else if (selected === "This Year") {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const d = new Date();
        d.setMonth(now.getMonth() - i);
        mappedData.push({ day: getMonthLabel(d), value: null });
      }
    }

    // Fill in the values and carry forward the last known score
    let lastKnownValue = 0;
    
    // Find the very first known score before this period to start with (if any)
    if (data && data.length > 0) {
      lastKnownValue = data[0].score || 0; 
    }

    mappedData = mappedData.map(point => {
      if (grouped[point.day] !== undefined) {
        lastKnownValue = grouped[point.day];
      }
      return { ...point, value: lastKnownValue };
    });

    setFilteredData(mappedData);
  }, [data, selected]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0c1a] p-3 shadow-xl">
          <p className="text-sm font-bold text-violet-400">{`Score: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your Progress</h3>
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 rounded-lg bg-slate-100 dark:bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-gray-300 transition-colors hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:text-white"
          >
            {selected} <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0c1a] shadow-xl z-50 overflow-hidden">
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setSelected(opt);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                    selected === opt 
                      ? 'bg-violet-500/10 text-violet-400 font-bold' 
                      : 'text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 12 }} 
              dy={10}
              minTickGap={20}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              dot={selected === "This Month" ? false : { r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#060816' }}
              activeDot={{ r: 6, fill: '#8b5cf6', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
