import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, User, Mail, GraduationCap, BookOpen, Calendar, Briefcase, Pencil, Sparkles, X } from "lucide-react";

export default function ProfileSetupStep({ onNext, onPrev }) {
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [bio, setBio] = useState("");

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
        <h1 className="mb-2 text-3xl font-black">Profile Setup</h1>
        <p className="text-sm text-gray-400">
          Help us know you better so we can personalize your career journey.
        </p>
      </div>

      <div className="flex-1 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white">Full Name</label>
            <div className="relative flex items-center">
              <div className="absolute left-4 flex items-center justify-center">
                <User className="h-4 w-4 text-violet-400" />
              </div>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-violet-500 focus:bg-white/10"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white">Email Address</label>
            <div className="relative flex items-center">
              <div className="absolute left-4 flex items-center justify-center">
                <Mail className="h-4 w-4 text-violet-400" />
              </div>
              <input
                type="email"
                placeholder="youremail@example.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-violet-500 focus:bg-white/10"
              />
            </div>
          </div>

          {/* College */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white">College / University</label>
            <div className="relative flex items-center">
              <div className="absolute left-4 flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-violet-400" />
              </div>
              <input
                type="text"
                placeholder="Enter your college name"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-violet-500 focus:bg-white/10"
              />
            </div>
          </div>

          {/* Degree */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white">Degree / Branch</label>
            <div className="relative flex items-center">
              <div className="absolute left-4 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-violet-400" />
              </div>
              <select className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-gray-400 outline-none transition-all focus:border-violet-500 focus:bg-white/10">
                <option value="">Select your degree / branch</option>
                <option value="cs">Computer Science</option>
                <option value="it">Information Technology</option>
                <option value="ee">Electrical Engineering</option>
              </select>
            </div>
          </div>

          {/* Graduation Year */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white">Graduation Year</label>
            <div className="relative flex items-center">
              <div className="absolute left-4 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-violet-400" />
              </div>
              <select className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-gray-400 outline-none transition-all focus:border-violet-500 focus:bg-white/10">
                <option value="">Select year</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white">Experience Level</label>
            <div className="relative flex items-center">
              <div className="absolute left-4 flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-violet-400" />
              </div>
              <select className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-gray-400 outline-none transition-all focus:border-violet-500 focus:bg-white/10">
                <option value="">Select experience level</option>
                <option value="fresher">Fresher (0 years)</option>
                <option value="junior">Junior (1-3 years)</option>
                <option value="mid">Mid-level (3-5 years)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-white">Bio (Optional)</label>
          <div className="relative">
            <div className="absolute left-4 top-4 flex items-center justify-center">
              <Pencil className="h-4 w-4 text-violet-400" />
            </div>
            <textarea
              maxLength={200}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a little about yourself..."
              className="min-h-[100px] w-full resize-none rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-violet-500 focus:bg-white/10"
            />
          </div>
          <div className="text-right text-xs text-gray-500">{bio.length}/200</div>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-white">Skills (Optional)</label>
          <div className="relative flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-3 focus-within:border-violet-500 focus-within:bg-white/10 transition-all">
            <div className="flex items-center">
              <div className="mr-3 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-violet-400" />
              </div>
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="Add your key skills"
                className="w-full bg-transparent text-sm text-white placeholder-gray-500 outline-none"
              />
            </div>
            
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1 rounded-md bg-violet-500/20 px-2.5 py-1 text-xs font-medium text-violet-300 border border-violet-500/30"
                  >
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="hover:text-white transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Press Enter after each skill</span>
            <span>{skills.length} skills added</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-violet-500"
        >
          Save & Continue <ArrowRight className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
