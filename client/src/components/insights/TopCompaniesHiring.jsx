import { useState } from "react";

const LOGO_OVERRIDES = {
  "tcs": "https://cdn.worldvectorlogo.com/logos/tata-consultancy-services.svg",
  "tata consultancy services": "https://cdn.worldvectorlogo.com/logos/tata-consultancy-services.svg",
  "wipro": "https://www.google.com/s2/favicons?domain=wipro.com&sz=128",
  "hcl": "https://www.google.com/s2/favicons?domain=hcltech.com&sz=128",
  "hcl technologies": "https://www.google.com/s2/favicons?domain=hcltech.com&sz=128",
  "infosys": "https://www.google.com/s2/favicons?domain=infosys.com&sz=128",
  "cognizant": "https://www.google.com/s2/favicons?domain=cognizant.com&sz=128",
  "tech mahindra": "https://www.google.com/s2/favicons?domain=techmahindra.com&sz=128",
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
    <div className="mb-3 flex h-11 w-11 p-1.5 items-center justify-center rounded-2xl bg-white overflow-hidden shadow-sm">
      {isTextFallback ? (
        <span className="font-bold text-base text-slate-900">
          {textFallbackStr}
        </span>
      ) : (
        <img 
          src={logoUrl} 
          alt={company.name} 
          onError={() => setImgErrorCount(prev => prev + 1)}
          className="h-full w-full object-contain drop-shadow-sm p-0.5" 
        />
      )}
    </div>
  );
}

export default function TopCompaniesHiring({ data }) {
  if (!data) return null;
  const COMPANIES = data.top_companies || [];

  return (
    <div className="flex h-full flex-col rounded-3xl border border-white/[0.08] bg-[#1c1e24] p-6 shadow-xl shadow-black/25 overflow-x-auto">
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Top Companies Hiring</h3>
      </div>

      <div className="flex-1 grid grid-cols-5 divide-x divide-white/[0.08]">
        {COMPANIES.map((company, idx) => (
          <div key={idx} className="flex flex-col items-center justify-center px-2 text-center">
            
            <CompanyLogo company={company} />
            
            <h4 className="text-sm font-bold text-white mb-1">{company.name}</h4>
            <span className={`text-xs font-bold mb-2 ${company.demandColor || 'text-[#4ee4cb]'}`}>{company.demand}</span>
            <span className="text-xs text-slate-400">{company.salary}</span>

          </div>
        ))}
      </div>
      
    </div>
  );
}


