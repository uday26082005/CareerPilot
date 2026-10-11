import { motion } from "framer-motion";

const ACCENT_STYLES = [
  {
    iconBg: "bg-[#4ee4cb]/15",
    iconText: "text-[#4ee4cb]",
    glowBg: "bg-[#4ee4cb]/10",
    borderHover: "group-hover:border-[#4ee4cb]/30",
  },
  {
    iconBg: "bg-[#ffd159]/15",
    iconText: "text-[#ffd159]",
    glowBg: "bg-[#ffd159]/10",
    borderHover: "group-hover:border-[#ffd159]/30",
  },
  {
    iconBg: "bg-[#e29aff]/15",
    iconText: "text-[#e29aff]",
    glowBg: "bg-[#e29aff]/10",
    borderHover: "group-hover:border-[#e29aff]/30",
  },
  {
    iconBg: "bg-[#ffb48a]/15",
    iconText: "text-[#ffb48a]",
    glowBg: "bg-[#ffb48a]/10",
    borderHover: "group-hover:border-[#ffb48a]/30",
  },
  {
    iconBg: "bg-[#ff94aa]/15",
    iconText: "text-[#ff94aa]",
    glowBg: "bg-[#ff94aa]/10",
    borderHover: "group-hover:border-[#ff94aa]/30",
  },
  {
    iconBg: "bg-[#72c5ff]/15",
    iconText: "text-[#72c5ff]",
    glowBg: "bg-[#72c5ff]/10",
    borderHover: "group-hover:border-[#72c5ff]/30",
  },
];

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  index = 0,
}) {
  const accent = ACCENT_STYLES[index % ACCENT_STYLES.length];

  return (
    <motion.a
      href="/signup"
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
      className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#1c1e24] p-8 shadow-xl shadow-black/25 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-[#20222a]"
    >
      {/* Background Glow */}
      <div className={`absolute -right-16 -top-16 h-40 w-40 rounded-full ${accent.glowBg} blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-0`} />

      {/* Icon */}
      <motion.div
        whileHover={{
          rotate: 10,
          scale: 1.08,
        }}
        className={`mb-7 flex h-16 w-16 items-center justify-center rounded-2xl ${accent.iconBg} ${accent.iconText} shadow-md shadow-black/20`}
      >
        <Icon className="h-8 w-8" />
      </motion.div>

      {/* Title */}
      <h3 className="mb-4 text-2xl font-bold tracking-tight text-white">
        {title}
      </h3>

      {/* Description */}
      <p className="leading-relaxed text-slate-400">
        {description}
      </p>

      {/* Border */}
      <div className={`absolute inset-0 rounded-3xl border border-transparent transition-all duration-300 ${accent.borderHover}`} />
    </motion.a>
  );
}