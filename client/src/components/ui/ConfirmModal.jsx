import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertTriangle, AlertCircle, X, Loader2 } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Conversation?",
  description = "Are you sure you want to delete this conversation? This action cannot be undone.",
  itemTitle,
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
  icon: Icon,
}) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (typeof document === "undefined") return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: Icon || Trash2,
          iconBadge: "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
          confirmBtn: "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 active:scale-[0.98]",
        };
      case "warning":
        return {
          icon: Icon || AlertTriangle,
          iconBadge: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
          confirmBtn: "bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold shadow-md shadow-amber-500/20 active:scale-[0.98]",
        };
      default:
        return {
          icon: Icon || AlertCircle,
          iconBadge: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
          confirmBtn: "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 active:scale-[0.98]",
        };
    }
  };

  const currentVariant = getVariantStyles();
  const IconComp = currentVariant.icon;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              if (!isLoading) onClose();
            }}
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1c1e24] p-6 sm:p-7 shadow-2xl dark:shadow-black/70 text-slate-900 dark:text-white"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors disabled:opacity-50 cursor-pointer"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header Icon + Info */}
            <div className="flex items-start gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${currentVariant.iconBadge}`}>
                <IconComp className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  {title}
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {description}
                </p>

                {itemTitle && (
                  <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#121316] px-3 py-2 text-xs text-slate-700 dark:text-slate-300">
                    <span className="truncate font-medium italic">"{itemTitle}"</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 hover:bg-slate-200 dark:bg-[#242730] dark:hover:bg-[#2b2f3a] px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all disabled:opacity-60 cursor-pointer ${currentVariant.confirmBtn}`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{confirmText}</span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
