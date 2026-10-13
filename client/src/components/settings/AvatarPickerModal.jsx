import { useState, useRef } from "react";
import { X, Upload, Check, Loader2, Sparkles, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

export const PRESET_AVATARS = [
  // 3D & Tech (Adventurer)
  { id: "adv-1", category: "3D & Tech", name: "Felix", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=ffd5dc" },
  { id: "adv-2", category: "3D & Tech", name: "Sophia", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sophia&backgroundColor=b6e3f4" },
  { id: "adv-3", category: "3D & Tech", name: "Marcus", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Marcus&backgroundColor=d1d4f9" },
  { id: "adv-4", category: "3D & Tech", name: "Elena", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Elena&backgroundColor=ffdfbf" },
  { id: "adv-5", category: "3D & Tech", name: "David", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=David&backgroundColor=c0aede" },
  { id: "adv-6", category: "3D & Tech", name: "Aria", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Aria&backgroundColor=ffd5dc" },
  
  // Modern Illustrative (Lorelei)
  { id: "lor-1", category: "Modern", name: "Lucas", url: "https://api.dicebear.com/7.x/lorelei/svg?seed=Lucas&backgroundColor=b6e3f4" },
  { id: "lor-2", category: "Modern", name: "Zoe", url: "https://api.dicebear.com/7.x/lorelei/svg?seed=Zoe&backgroundColor=c0aede" },
  { id: "lor-3", category: "Modern", name: "Liam", url: "https://api.dicebear.com/7.x/lorelei/svg?seed=Liam&backgroundColor=d1d4f9" },
  { id: "lor-4", category: "Modern", name: "Maya", url: "https://api.dicebear.com/7.x/lorelei/svg?seed=Maya&backgroundColor=ffdfbf" },
  { id: "lor-5", category: "Modern", name: "Noah", url: "https://api.dicebear.com/7.x/lorelei/svg?seed=Noah&backgroundColor=ffd5dc" },
  { id: "lor-6", category: "Modern", name: "Chloe", url: "https://api.dicebear.com/7.x/lorelei/svg?seed=Chloe&backgroundColor=b6e3f4" },

  // Minimalist (Notionists)
  { id: "not-1", category: "Minimalist", name: "Ethan", url: "https://api.dicebear.com/7.x/notionists/svg?seed=Ethan&backgroundColor=ffd5dc" },
  { id: "not-2", category: "Minimalist", name: "Oliver", url: "https://api.dicebear.com/7.x/notionists/svg?seed=Oliver&backgroundColor=c0aede" },
  { id: "not-3", category: "Minimalist", name: "Amara", url: "https://api.dicebear.com/7.x/notionists/svg?seed=Amara&backgroundColor=b6e3f4" },
  { id: "not-4", category: "Minimalist", name: "Kai", url: "https://api.dicebear.com/7.x/notionists/svg?seed=Kai&backgroundColor=d1d4f9" },
  
  // AI & Bots (Bottts)
  { id: "bot-1", category: "AI & Bots", name: "Cyber", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Cyber&backgroundColor=b6e3f4" },
  { id: "bot-2", category: "AI & Bots", name: "Pixel", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Pixel&backgroundColor=ffd5dc" },
  { id: "bot-3", category: "AI & Bots", name: "Echo", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Echo&backgroundColor=c0aede" },
  { id: "bot-4", category: "AI & Bots", name: "Nexus", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Nexus&backgroundColor=d1d4f9" }
];

const CATEGORIES = ["All", "3D & Tech", "Modern", "Minimalist", "AI & Bots"];

export default function AvatarPickerModal({ 
  isOpen, 
  onClose, 
  currentAvatarUrl, 
  userName,
  onSaveAvatar 
}) {
  const [selectedUrl, setSelectedUrl] = useState(currentAvatarUrl || "");
  const [activeCategory, setActiveCategory] = useState("All");
  const [pendingUpload, setPendingUpload] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const filteredAvatars = activeCategory === "All" 
    ? PRESET_AVATARS 
    : PRESET_AVATARS.filter(a => a.category === activeCategory);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      setSelectedUrl(base64);
      setPendingUpload({
        base64Data: base64,
        contentType: file.type
      });
      toast.success("Photo selected from gallery!");
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (url) => {
    setSelectedUrl(url);
    setPendingUpload(null);
  };

  const handleApply = async () => {
    if (!selectedUrl) {
      toast.error("Please select an avatar or upload a photo");
      return;
    }
    try {
      setIsSaving(true);
      await onSaveAvatar(selectedUrl, pendingUpload);
      onClose();
    } catch {
      // Error handled in parent onSaveAvatar
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl dark:border-white/[0.08] dark:bg-[#1c1e24] dark:shadow-black/60 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500 dark:text-[#ffd159]" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Choose Profile Avatar</h3>
          </div>
          <button 
            onClick={onClose}
            disabled={isSaving}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:border-white/[0.08] dark:bg-[#242730] dark:text-slate-400 dark:hover:text-white dark:hover:bg-[#2b2f3a] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6 pr-1">
          {/* Current Selection & Gallery Upload Row */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-50 dark:bg-[#242730]/70 border border-slate-200/80 dark:border-white/[0.06]">
            {/* Live Preview Avatar */}
            <div className="relative shrink-0">
              <div className="relative h-20 w-20 rounded-full overflow-hidden ring-4 ring-amber-500/40 dark:ring-[#ffd159]/40 shadow-md">
                {selectedUrl ? (
                  <img 
                    src={selectedUrl} 
                    alt="Selected Avatar Preview" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-400 to-amber-300 dark:from-[#ffd159] dark:to-[#fed656] text-3xl font-bold text-slate-950 uppercase">
                    {(userName || "U").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-slate-950 shadow-sm">
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              </div>
            </div>

            {/* Gallery Upload Card */}
            <div className="flex-1 text-center sm:text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Upload Custom Photo
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 mb-2.5">
                Pick any photo from your local files or camera gallery.
              </p>
              
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden" 
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl border border-dashed border-amber-500/80 dark:border-[#ffd159]/80 bg-amber-500/10 dark:bg-[#ffd159]/10 px-4 py-2 text-xs font-bold text-amber-700 dark:text-[#ffd159] hover:bg-amber-500/20 dark:hover:bg-[#ffd159]/20 transition-all active:scale-95"
              >
                <ImageIcon className="h-3.5 w-3.5" />
                <span>Select from Gallery</span>
              </button>
            </div>
          </div>

          {/* Curated Avatars Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Or Select A Curated Avatar
              </h4>
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                {filteredAvatars.length} Avatars
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      isActive 
                        ? "bg-amber-500 text-slate-950 font-bold dark:bg-[#ffd159]" 
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#242730] dark:text-slate-400 dark:hover:bg-[#2b2f3a] dark:hover:text-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Circular Avatars Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3.5 pt-2">
              {filteredAvatars.map((avatar) => {
                const isSelected = selectedUrl === avatar.url;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => handleSelectPreset(avatar.url)}
                    className={`group relative flex flex-col items-center justify-center p-1.5 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 ${
                      isSelected 
                        ? "bg-amber-500/10 dark:bg-[#ffd159]/10 ring-2 ring-amber-500 dark:ring-[#ffd159]" 
                        : "hover:bg-slate-100 dark:hover:bg-white/[0.04]"
                    }`}
                    title={avatar.name}
                  >
                    <div className={`relative h-14 w-14 rounded-full overflow-hidden border-2 transition-all shadow-xs ${
                      isSelected 
                        ? "border-amber-500 dark:border-[#ffd159] ring-2 ring-amber-500/30 dark:ring-[#ffd159]/30" 
                        : "border-slate-200 dark:border-white/10 group-hover:border-amber-400 dark:group-hover:border-[#ffd159]/60"
                    }`}>
                      <img 
                        src={avatar.url} 
                        alt={avatar.name} 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                    {isSelected && (
                      <div className="absolute bottom-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 dark:bg-[#ffd159] text-slate-950 shadow-sm">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                    )}
                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 mt-1 truncate max-w-full">
                      {avatar.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/[0.06]">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleApply}
            disabled={isSaving || !selectedUrl}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 dark:from-[#ffd159] dark:to-[#fed656] px-5 py-2 text-xs font-bold text-slate-950 transition-all hover:brightness-105 active:scale-95 disabled:opacity-50 shadow-sm"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-950" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Avatar</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
