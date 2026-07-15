import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  index = 0,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
      }}
      whileHover={{
        y: -12,
        scale: 1.02,
      }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/40 hover:shadow-[0_20px_60px_rgba(139,92,246,.18)]"
    >
      {/* Background Glow */}

      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />

      {/* Icon */}

      <motion.div
        whileHover={{
          rotate: 10,
          scale: 1.08,
        }}
        className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 shadow-[0_0_30px_rgba(139,92,246,.35)]"
      >
        <Icon className="h-8 w-8 text-white" />
      </motion.div>

      {/* Title */}

      <h3 className="mb-4 text-2xl font-bold tracking-tight">
        {title}
      </h3>

      {/* Description */}

      <p className="leading-8 text-gray-400">
        {description}
      </p>

      {/* Footer */}

      <motion.div
        whileHover={{
          x: 5,
        }}
        className="mt-8 flex items-center gap-2 text-sm font-semibold text-violet-400"
      >
        Learn More

        <ArrowUpRight
          size={18}
        />
      </motion.div>

      {/* Border */}

      <div className="absolute inset-0 rounded-3xl border border-transparent transition-all duration-300 group-hover:border-violet-500/20" />
    </motion.div>
  );
}