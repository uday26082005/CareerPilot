import { ArrowRight, Search, Building2, Terminal, Monitor, Code } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const LOGO_OVERRIDES = {
  "tcs": "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg",
  "tata consultancy services": "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg",
};

function CompanyLogo({ company }) {
  const [imgErrorCount, setImgErrorCount] = useState(0);
  
  const companyNameLower = company.name.toLowerCase();
  const guessedDomain = company.domain || `${companyNameLower.replace(/[^a-z0-9]/g, '')}.com`;
  
  // 1. Check overrides
  // 2. Try Clearbit (high res)
  // 3. Try Google Favicon (fallback)
  let logoUrl = null;
  if (LOGO_OVERRIDES[companyNameLower]) {
    logoUrl = LOGO_OVERRIDES[companyNameLower];
  } else if (imgErrorCount === 0) {
    logoUrl = `https://logo.clearbit.com/${guessedDomain}`;
  } else if (imgErrorCount === 1) {
    logoUrl = `https://www.google.com/s2/favicons?domain=${guessedDomain}&sz=128`;
  }
  
  const isTextFallback = imgErrorCount >= 2 || !logoUrl;
  const textFallbackStr = company.name.substring(0, 3).toLowerCase();
  
  return (
    <div className={`mb-3 flex h-10 w-10 p-1 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 overflow-hidden`}>
      {isTextFallback ? (
        <span className={`font-bold text-base ${company.textColor || 'text-slate-500 dark:text-gray-400'}`}>
          {textFallbackStr}
        </span>
      ) : (
        <img 
          src={logoUrl} 
          alt={company.name} 
          onError={() => setImgErrorCount(prev => prev + 1)}
          className={`h-full w-full object-contain drop-shadow-sm ${company.invertDark ? 'dark:invert dark:brightness-200' : ''}`} 
        />
      )}
    </div>
  );
}

export default function TopCompaniesHiring({ data }) {
  if (!data) return null;
  const COMPANIES = data.top_companies || [];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md overflow-x-auto">
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-slate-500 dark:text-gray-400">Top Companies Hiring</h3>
      </div>

      <div className="flex-1 grid grid-cols-5 divide-x divide-white/5">
        {COMPANIES.map((company, idx) => (
          <div key={idx} className="flex flex-col items-center justify-center px-2 text-center">
            
            <CompanyLogo company={company} />
            
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{company.name}</h4>
            <span className={`text-xs font-bold mb-2 ${company.demandColor}`}>{company.demand}</span>
            <span className="text-xs text-slate-500 dark:text-gray-400">{company.salary}</span>

          </div>
        ))}
      </div>
      
    </div>
  );
}


