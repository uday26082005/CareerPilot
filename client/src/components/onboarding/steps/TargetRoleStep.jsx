import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Briefcase, Building, BarChart, MapPin } from "lucide-react";
import toast from "react-hot-toast";

export default function TargetRoleStep({ onNext, onPrev }) {
  const [formData, setFormData] = useState({
    role: "",
    industry: "",
    experience: "",
    employmentType: "",
    location: ""
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = () => {
    if (!formData.role || !formData.experience) {
      toast.error("Please fill all mandatory fields to continue.");
      return;
    }
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex h-full flex-col"
    >
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-black">Target Role</h1>
        <p className="text-base text-slate-500 dark:text-gray-400">
          Help us tailor the experience to your career goals by choosing your target role and preferences.
          <br/>
          <span className="text-violet-400 font-medium">You can edit these details later.</span>
        </p>
      </div>

      <div className="flex-1 space-y-6">
        {/* Target Role */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">What role are you targeting? *</label>
          <div className="relative flex items-center">
            <div className="absolute left-4 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-violet-400" />
            </div>
            <select 
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 py-4 pl-12 pr-4 text-base text-slate-500 dark:text-gray-400 outline-none transition-all focus:border-violet-500 focus:bg-slate-200 dark:bg-white/10"
            >
              <option value="" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">Select your target role</option>
              <option value="frontend" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">Frontend Developer</option>
              <option value="backend" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">Backend Developer</option>
              <option value="fullstack" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">Full Stack Developer</option>
              <option value="data_scientist" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">Data Scientist</option>
              <option value="product_manager" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">Product Manager</option>
              <option value="ui_ux" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">UI/UX Designer</option>
              <option value="devops" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">DevOps Engineer</option>
              <option value="mobile" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">Mobile App Developer</option>
              <option value="data_analyst" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">Data Analyst</option>
              <option value="ml_engineer" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">Machine Learning Engineer</option>
              <option value="cybersecurity" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">Cybersecurity Analyst</option>
              <option value="cloud_architect" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">Cloud Architect</option>
              <option value="qa" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">Quality Assurance Engineer</option>
              <option value="business_analyst" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">Business Analyst</option>
              <option value="sysadmin" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">Systems Administrator</option>
            </select>
          </div>
        </div>

        {/* Preferred Industry */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">Preferred Industry (Optional)</label>
          <div className="relative flex items-center">
            <div className="absolute left-4 flex items-center justify-center">
              <Building className="h-5 w-5 text-violet-400" />
            </div>
            <select 
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 py-4 pl-12 pr-4 text-base text-slate-500 dark:text-gray-400 outline-none transition-all focus:border-violet-500 focus:bg-slate-200 dark:bg-white/10"
            >
              <option value="" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">Select industry</option>
              <option value="tech" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">Technology</option>
              <option value="finance" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">Finance / Fintech</option>
              <option value="health" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">Healthcare</option>
              <option value="ecommerce" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">E-commerce</option>
            </select>
          </div>
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">Experience Level *</label>
          <div className="relative flex items-center">
            <div className="absolute left-4 flex items-center justify-center">
              <BarChart className="h-5 w-5 text-violet-400" />
            </div>
            <select 
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 py-4 pl-12 pr-4 text-base text-slate-500 dark:text-gray-400 outline-none transition-all focus:border-violet-500 focus:bg-slate-200 dark:bg-white/10"
            >
              <option value="" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">Select your experience level</option>
              <option value="entry" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">Entry Level (0-2 years)</option>
              <option value="mid" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">Mid Level (3-5 years)</option>
              <option value="senior" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">Senior Level (5+ years)</option>
            </select>
          </div>
        </div>

        {/* Employment Type */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">Employment Type (Optional)</label>
          <div className="relative flex items-center">
            <div className="absolute left-4 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-violet-400" />
            </div>
            <select 
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              className="w-full appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 py-4 pl-12 pr-4 text-base text-slate-500 dark:text-gray-400 outline-none transition-all focus:border-violet-500 focus:bg-slate-200 dark:bg-white/10"
            >
              <option value="" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">Select employment type</option>
              <option value="fulltime" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">Full-time</option>
              <option value="parttime" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">Part-time</option>
              <option value="contract" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">Contract</option>
              <option value="freelance" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">Freelance</option>
            </select>
          </div>
        </div>

        {/* Location Preference */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">Location Preference (Optional)</label>
          <div className="relative flex items-center">
            <div className="absolute left-4 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-violet-400" />
            </div>
            <select 
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 py-4 pl-12 pr-4 text-base text-slate-500 dark:text-gray-400 outline-none transition-all focus:border-violet-500 focus:bg-slate-200 dark:bg-white/10"
            >
              <option value="" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">Select location preference</option>
              <option value="remote" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">Remote</option>
              <option value="hybrid" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">Hybrid</option>
              <option value="onsite" className="bg-white dark:bg-[#060816] text-slate-900 dark:text-white">On-site</option>
            </select>
          </div>
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
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-slate-900 dark:text-white transition-colors hover:bg-violet-500"
        >
          Save & Continue <ArrowRight className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}
