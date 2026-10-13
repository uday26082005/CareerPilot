import { useState } from "react";
import { Building2, ExternalLink, MapPin } from "lucide-react";

const LOGO_OVERRIDES = {
  "tcs": "https://cdn.worldvectorlogo.com/logos/tata-consultancy-services.svg",
  "tata consultancy services": "https://cdn.worldvectorlogo.com/logos/tata-consultancy-services.svg",
  "wipro": "https://www.google.com/s2/favicons?domain=wipro.com&sz=128",
  "hcl": "https://www.google.com/s2/favicons?domain=hcltech.com&sz=128",
  "hcl technologies": "https://www.google.com/s2/favicons?domain=hcltech.com&sz=128",
  "infosys": "https://www.google.com/s2/favicons?domain=infosys.com&sz=128",
  "cognizant": "https://www.google.com/s2/favicons?domain=cognizant.com&sz=128",
  "tech mahindra": "https://www.google.com/s2/favicons?domain=techmahindra.com&sz=128",
  "inmobi": "https://www.google.com/s2/favicons?domain=inmobi.com&sz=128",
  "groww": "https://www.google.com/s2/favicons?domain=groww.in&sz=128",
  "elastic": "https://www.google.com/s2/favicons?domain=elastic.co&sz=128",
  "mongodb": "https://www.google.com/s2/favicons?domain=mongodb.com&sz=128",
  "cloudflare": "https://www.google.com/s2/favicons?domain=cloudflare.com&sz=128",
  "datadog": "https://www.google.com/s2/favicons?domain=datadoghq.com&sz=128",
  "coursera": "https://www.google.com/s2/favicons?domain=coursera.org&sz=128",
  "rubrik": "https://www.google.com/s2/favicons?domain=rubrik.com&sz=128",
  "gitlab": "https://www.google.com/s2/favicons?domain=gitlab.com&sz=128",
  "affirm": "https://www.google.com/s2/favicons?domain=affirm.com&sz=128",
  "coinbase": "https://www.google.com/s2/favicons?domain=coinbase.com&sz=128"
};

function CompanyLogo({ company }) {
  const [imgErrorCount, setImgErrorCount] = useState(0);

  const companyNameLower = (company.name || "").toLowerCase().trim();
  const guessedDomain = company.domain || `${companyNameLower.replace(/[^a-z0-9]/g, "")}.com`;

  let logoUrl = company.logo || null;
  if (LOGO_OVERRIDES[companyNameLower]) {
    logoUrl = LOGO_OVERRIDES[companyNameLower];
  } else if (!logoUrl) {
    if (imgErrorCount === 0) {
      logoUrl = `https://logo.clearbit.com/${guessedDomain}`;
    } else if (imgErrorCount === 1) {
      logoUrl = `https://www.google.com/s2/favicons?domain=${guessedDomain}&sz=128`;
    }
  }

  const isTextFallback = imgErrorCount >= 2 || !logoUrl;
  const textFallbackStr = (company.name || "JOB").substring(0, 3).toUpperCase();

  return (
    <div className="mb-2.5 flex h-11 w-11 shrink-0 p-1.5 items-center justify-center rounded-2xl bg-slate-50 border border-slate-200 dark:border-white/[0.08] dark:bg-white/[0.06] overflow-hidden shadow-sm">
      {isTextFallback ? (
        <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
          {textFallbackStr}
        </span>
      ) : (
        <img
          src={logoUrl}
          alt={company.name}
          onError={() => setImgErrorCount((prev) => prev + 1)}
          className="h-full w-full object-contain drop-shadow-sm p-0.5"
        />
      )}
    </div>
  );
}

export default function TopCompaniesHiring({ data }) {
  if (!data) return null;
  const COMPANIES = (data.top_companies || []).slice(0, 5);

  return (
    <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#1c1e24] dark:shadow-xl dark:shadow-black/25">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Building2 className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          Top Companies Hiring
        </h3>
        {COMPANIES.length > 0 && (
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            {COMPANIES.length} Active Openings
          </span>
        )}
      </div>

      {COMPANIES.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
          <Building2 className="h-8 w-8 text-slate-400 dark:text-slate-500 mb-2 stroke-1" />
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Live hiring data is currently unavailable for this role
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
            Check back soon as verified employer openings in India are refreshed continuously.
          </p>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-white/[0.08]">
          {COMPANIES.map((company, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center px-2 py-3 text-center h-full"
            >
              <CompanyLogo company={company} />

              <h4
                className="text-xs font-bold text-slate-900 dark:text-white truncate w-full"
                title={company.name}
              >
                {company.name}
              </h4>

              {company.title && (
                <span
                  className="text-[11px] font-medium text-slate-600 dark:text-slate-400 truncate w-full mt-0.5"
                  title={company.title}
                >
                  {company.title}
                </span>
              )}

              {company.location && (
                <span
                  className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-0.5 truncate w-full mt-0.5"
                  title={company.location}
                >
                  <MapPin className="h-2.5 w-2.5 shrink-0" />
                  <span className="truncate">{company.location}</span>
                </span>
              )}

              {company.demand && (
                <span className="text-xs font-bold text-teal-600 dark:text-[#4ee4cb] mt-2">
                  {company.demand}
                </span>
              )}

              {company.salary && (
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {company.salary}
                </span>
              )}

              {company.url && (
                <a
                  href={company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-[#ffd159] hover:underline mt-1.5 transition-colors"
                >
                  <span>View Role</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
