import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Briefcase, Building, BarChart, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import ThemedSelect from "../../ui/ThemedSelect";

const ROLE_OPTIONS = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Product Manager",
  "UI/UX Designer",
  "DevOps Engineer",
  "Mobile App Developer",
  "Data Analyst",
  "Machine Learning Engineer",
  "Cybersecurity Analyst",
  "Cloud Architect",
  "Quality Assurance Engineer",
  "Business Analyst",
  "Systems Administrator"
];

const INDUSTRY_OPTIONS = [
  { value: "tech", label: "Technology" },
  { value: "finance", label: "Finance / Fintech" },
  { value: "health", label: "Healthcare" },
  { value: "ecommerce", label: "E-commerce" }
];

const EXPERIENCE_OPTIONS = [
  { value: "entry", label: "Entry Level (0-2 years)" },
  { value: "mid", label: "Mid Level (3-5 years)" },
  { value: "senior", label: "Senior Level (5+ years)" }
];

const EMPLOYMENT_OPTIONS = [
  { value: "fulltime", label: "Full-time" },
  { value: "parttime", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" }
];

const LOCATION_OPTIONS = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" }
];

export default function TargetRoleStep({ onNext, onPrev, isSubmitting }) {
  const [formData, setFormData] = useState({
    role: "",
    industry: "",
    experience: "",
    employmentType: "",
    location: ""
  });

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (!formData.role || !formData.experience) {
      toast.error("Please fill all mandatory fields to continue.");
      return;
    }
    onNext({ targetRole: formData.role, industry: formData.industry, targetExperience: formData.experience });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex h-full flex-col justify-between"
    >
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Target Role & Preferences
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
          Tell us about the career path you are aiming for so we can tailor your roadmap.
        </p>
      </div>

      <div className="flex-1 space-y-6">
        {/* Target Role */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">What role are you targeting? *</label>
          <ThemedSelect
            value={formData.role}
            onChange={(val) => handleFieldChange("role", val)}
            options={ROLE_OPTIONS}
            placeholder="Select your target role"
            icon={Briefcase}
            size="lg"
            className="w-full"
            align="left"
          />
        </div>

        {/* Preferred Industry */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">Preferred Industry (Optional)</label>
          <ThemedSelect
            value={formData.industry}
            onChange={(val) => handleFieldChange("industry", val)}
            options={INDUSTRY_OPTIONS}
            placeholder="Select industry"
            icon={Building}
            size="lg"
            className="w-full"
            align="left"
          />
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">Experience Level *</label>
          <ThemedSelect
            value={formData.experience}
            onChange={(val) => handleFieldChange("experience", val)}
            options={EXPERIENCE_OPTIONS}
            placeholder="Select your experience level"
            icon={BarChart}
            size="lg"
            className="w-full"
            align="left"
          />
        </div>

        {/* Employment Type */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">Employment Type (Optional)</label>
          <ThemedSelect
            value={formData.employmentType}
            onChange={(val) => handleFieldChange("employmentType", val)}
            options={EMPLOYMENT_OPTIONS}
            placeholder="Select employment type"
            icon={Briefcase}
            size="lg"
            className="w-full"
            align="left"
          />
        </div>

        {/* Location Preference */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">Location Preference (Optional)</label>
          <ThemedSelect
            value={formData.location}
            onChange={(val) => handleFieldChange("location", val)}
            options={LOCATION_OPTIONS}
            placeholder="Select location preference"
            icon={MapPin}
            size="lg"
            className="w-full"
            align="left"
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-slate-200 dark:border-white/5 pt-6">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-gray-400 transition-colors hover:text-slate-900 dark:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <motion.button
          onClick={handleNext}
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-slate-900 dark:text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Continue"} <ArrowRight className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}
