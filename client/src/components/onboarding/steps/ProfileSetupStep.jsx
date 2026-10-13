import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, User, Mail, GraduationCap, BookOpen, Calendar, Briefcase, Pencil, Sparkles, X } from "lucide-react";
import toast from "react-hot-toast";
import ThemedSelect from "../../ui/ThemedSelect";

export default function ProfileSetupStep({ onNext, onPrev, onSave }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    college: "",
    branch: "",
    gradYear: "",
    experience: ""
  });
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [bio, setBio] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = () => {
    if (!formData.fullName || !formData.email || !formData.college || !formData.branch || !formData.gradYear || !formData.experience) {
      toast.error("Please fill all mandatory fields to continue.");
      return;
    }
    if (onSave) onSave({ ...formData, skills, bio });
    onNext();
  };

  const handleAddSkill = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex h-full flex-col"
    >
      <div className="mb-8">
        <h1 className="mb-2 text-3xl md:text-4xl font-black text-slate-900 dark:text-white">Profile Setup</h1>
        <p className="text-base text-slate-600 dark:text-slate-400">
          Help us know you better so we can personalize your career journey.
        </p>
      </div>

      <div className="flex-1 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Full Name *</label>
            <div className="relative flex items-center">
              <div className="absolute left-4 flex items-center justify-center">
                <User className="h-5 w-5 text-amber-500 dark:text-[#ffd159]" />
              </div>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#242730] py-3.5 pl-12 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-amber-400 focus:bg-white dark:focus:border-[#ffd159]/60 dark:focus:bg-[#2b2f3a]"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email Address *</label>
            <div className="relative flex items-center">
              <div className="absolute left-4 flex items-center justify-center">
                <Mail className="h-5 w-5 text-amber-500 dark:text-[#ffd159]" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="youremail@example.com"
                className="w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#242730] py-3.5 pl-12 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-amber-400 focus:bg-white dark:focus:border-[#ffd159]/60 dark:focus:bg-[#2b2f3a]"
              />
            </div>
          </div>

          {/* College */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">College / University *</label>
            <div className="relative flex items-center">
              <div className="absolute left-4 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-amber-500 dark:text-[#ffd159]" />
              </div>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="Enter your college name"
                className="w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#242730] py-3.5 pl-12 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-amber-400 focus:bg-white dark:focus:border-[#ffd159]/60 dark:focus:bg-[#2b2f3a]"
              />
            </div>
          </div>

          {/* Degree */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Branch *</label>
            <div className="relative flex items-center">
              <div className="absolute left-4 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-amber-500 dark:text-[#ffd159]" />
              </div>
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                placeholder="e.g. Computer Science"
                className="w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#242730] py-3.5 pl-12 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-amber-400 focus:bg-white dark:focus:border-[#ffd159]/60 dark:focus:bg-[#2b2f3a]"
              />
            </div>
          </div>

          {/* Graduation Year */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Graduation Year *</label>
            <div className="relative flex items-center">
              <div className="absolute left-4 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-amber-500 dark:text-[#ffd159]" />
              </div>
              <input
                type="number"
                name="gradYear"
                value={formData.gradYear}
                onChange={handleChange}
                placeholder="e.g. 2026"
                min="1900"
                max="2100"
                className="w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#242730] py-3.5 pl-12 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-amber-400 focus:bg-white dark:focus:border-[#ffd159]/60 dark:focus:bg-[#2b2f3a] dark:[color-scheme:dark]"
              />
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Experience Level *</label>
            <ThemedSelect
              value={formData.experience}
              onChange={(val) => setFormData((prev) => ({ ...prev, experience: val }))}
              options={[
                { value: "fresher", label: "Fresher (0 years)" },
                { value: "junior", label: "Junior (1-3 years)" },
                { value: "mid", label: "Mid-level (3-5 years)" }
              ]}
              placeholder="Select experience level"
              icon={Briefcase}
              size="lg"
              className="w-full"
              align="left"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Bio</label>
          <div className="relative">
            <div className="absolute left-4 top-4 flex items-center justify-center">
              <Pencil className="h-5 w-5 text-amber-500 dark:text-[#ffd159]" />
            </div>
            <textarea
              maxLength={200}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a little about yourself..."
              className="min-h-[100px] w-full resize-none rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#242730] py-3.5 pl-12 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-amber-400 focus:bg-white dark:focus:border-[#ffd159]/60 dark:focus:bg-[#2b2f3a]"
            />
          </div>
          <div className="text-right text-xs text-slate-400 dark:text-slate-500">{bio.length}/200</div>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Skills</label>
          <div className="relative flex flex-col gap-3 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#242730] p-4 focus-within:border-amber-400 focus-within:bg-white dark:focus-within:border-[#ffd159]/60 dark:focus-within:bg-[#2b2f3a] transition-all">
            <div className="flex items-center">
              <div className="mr-3 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-amber-500 dark:text-[#ffd159]" />
              </div>
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="Add your key skills (e.g. React, Python)"
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none"
              />
            </div>
            
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-white/[0.08]">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 dark:bg-[#ffd159]/15 dark:text-[#ffd159] dark:border-[#ffd159]/30 px-3 py-1 text-xs font-semibold shadow-sm"
                  >
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="hover:text-amber-900 dark:hover:text-white transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
            <span>Press Enter after each skill</span>
            <span>{skills.length} skills added</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-slate-200 dark:border-white/[0.08] pt-6">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <motion.button
          onClick={handleNext}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ffd159] to-[#fed656] px-6 py-3 font-bold text-sm text-slate-950 shadow-md shadow-amber-500/10 transition-all hover:brightness-105 active:scale-95"
        >
          Save & Continue <ArrowRight className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}
