import { motion } from "framer-motion";

interface Props {
  dna: {
    concept: number; confidence: number; curiosity: number;
    attention: number; language: number; consistency: number;
  };
}

const LABELS = [
  { key: "concept", label: "Concept", color: "var(--dna-1)" },
  { key: "confidence", label: "Confidence", color: "var(--dna-2)" },
  { key: "curiosity", label: "Curiosity", color: "var(--dna-3)" },
  { key: "attention", label: "Attention", color: "var(--dna-4)" },
  { key: "language", label: "Language", color: "var(--dna-6)" },
  { key: "consistency", label: "Consistency", color: "var(--dna-5)" },
] as const;

export function DNAHelix({ dna }: Props) {
  const rungs = 14;
  const height = 360;
  return (
    <div className="relative w-full h-[360px] grid place-items-center overflow-hidden">
      <svg viewBox="0 0 300 360" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="strandA" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.55 0.22 273)" />
            <stop offset="100%" stopColor="oklch(0.6 0.22 330)" />
          </linearGradient>
          <linearGradient id="strandB" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.7 0.17 158)" />
            <stop offset="100%" stopColor="oklch(0.78 0.16 75)" />
          </linearGradient>
        </defs>

        {Array.from({ length: rungs }).map((_, i) => {
          const t = i / (rungs - 1);
          const y = t * height;
          const angle = t * Math.PI * 4;
          const x1 = 150 + Math.cos(angle) * 70;
          const x2 = 150 - Math.cos(angle) * 70;
          const meta = LABELS[i % LABELS.length];
          const val = (dna as any)[meta.key] as number;
          const opacity = 0.35 + (val / 100) * 0.65;
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
            >
              <line x1={x1} y1={y} x2={x2} y2={y} stroke={meta.color} strokeOpacity={opacity} strokeWidth={2} />
              <circle cx={x1} cy={y} r={5} fill="url(#strandA)" />
              <circle cx={x2} cy={y} r={5} fill="url(#strandB)" />
            </motion.g>
          );
        })}
      </svg>

      <div className="absolute right-2 top-2 grid grid-cols-1 gap-1 text-[10px]">
        {LABELS.map((l) => (
          <div key={l.key} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-card/70 border border-border/60">
            <span className="h-2 w-2 rounded-full" style={{ background: l.color }} />
            <span className="text-muted-foreground">{l.label}</span>
            <span className="ml-auto font-semibold">{(dna as any)[l.key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
